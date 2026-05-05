import { createStableId } from "../../../utils/id";
import { normalizeFeedUrl, resolveUrl } from "../../../utils/url";
import type { RssFeed, RssFeedItem } from "../types";
import { decodeXmlEntities, extractImageUrlFromHtml, normalizeHtmlSummary, normalizeText, stripCdata } from "./text";

type XmlElement = {
    attributes: string;
    content: string;
};

export function parseRssFeedXml(xml: string, feedUrlInput: string): RssFeed {
    const feedUrl = normalizeFeedUrl(feedUrlInput);
    const channel = findFirstElement(xml, "channel");

    if (channel) {
        return parseRssChannel(channel, feedUrl);
    }

    const atomFeed = findFirstElement(xml, "feed");

    if (atomFeed) {
        return parseAtomFeed(atomFeed, feedUrl);
    }

    throw new Error("XML does not contain an RSS channel or Atom feed.");
}

function parseRssChannel(channel: XmlElement, feedUrl: string): RssFeed {
    const title = getText(channel.content, "title") ?? "Untitled RSS feed";
    const siteUrl = resolveUrl(getText(channel.content, "link"), feedUrl);
    const description = normalizeText(getText(channel.content, "description"));
    const imageUrl = getRssFeedImageUrl(channel.content, feedUrl);
    const items = findElements(channel.content, "item").map((item, index) => parseRssItem(item, feedUrl, index));

    return {
        id: createStableId("rss_feed", feedUrl),
        title,
        feedUrl,
        siteUrl,
        description,
        imageUrl,
        lastFetchedAt: new Date().toISOString(),
        items,
    };
}

function parseAtomFeed(feed: XmlElement, feedUrl: string): RssFeed {
    const title = getText(feed.content, "title") ?? "Untitled Atom feed";
    const siteUrl = resolveUrl(getAtomLink(feed.content), feedUrl);
    const description = normalizeText(getText(feed.content, "subtitle"));
    const imageUrl = resolveUrl(getText(feed.content, "logo") ?? getText(feed.content, "icon"), feedUrl);
    const items = findElements(feed.content, "entry").map((entry, index) => parseAtomEntry(entry, feedUrl, index));

    return {
        id: createStableId("rss_feed", feedUrl),
        title,
        feedUrl,
        siteUrl,
        description,
        imageUrl,
        lastFetchedAt: new Date().toISOString(),
        items,
    };
}

function parseRssItem(item: XmlElement, feedUrl: string, index: number): RssFeedItem {
    const title = getText(item.content, "title") ?? "Untitled item";
    const link = resolveUrl(getText(item.content, "link"), feedUrl);
    const publishedAt = normalizeDate(getText(item.content, "pubDate"));
    const rawSummary = getRawText(item.content, "description") ?? getRawText(item.content, "encoded");
    const summary = normalizeHtmlSummary(rawSummary);
    const imageUrl = getRssItemImageUrl(item.content, feedUrl, rawSummary);
    const author = getText(item.content, "author") ?? getText(item.content, "creator");
    const stableSeed = `${feedUrl}:${link ?? title}:${publishedAt ?? index}`;

    return {
        id: createStableId("rss_item", stableSeed),
        title,
        link,
        imageUrl,
        summary,
        publishedAt,
        author,
    };
}

function parseAtomEntry(entry: XmlElement, feedUrl: string, index: number): RssFeedItem {
    const title = getText(entry.content, "title") ?? "Untitled item";
    const link = resolveUrl(getAtomLink(entry.content), feedUrl);
    const publishedAt = normalizeDate(getText(entry.content, "published") ?? getText(entry.content, "updated"));
    const rawSummary = getRawText(entry.content, "summary") ?? getRawText(entry.content, "content");
    const summary = normalizeHtmlSummary(rawSummary);
    const imageUrl = getAtomItemImageUrl(entry.content, feedUrl, rawSummary);
    const authorElement = findFirstElement(entry.content, "author");
    const author = authorElement ? getText(authorElement.content, "name") : undefined;
    const stableSeed = `${feedUrl}:${link ?? title}:${publishedAt ?? index}`;

    return {
        id: createStableId("rss_item", stableSeed),
        title,
        link,
        imageUrl,
        summary,
        publishedAt,
        author,
    };
}

function getRssFeedImageUrl(xml: string, feedUrl: string): string | undefined {
    const imageElement = findFirstElement(xml, "image");
    const imageUrl = imageElement ? getText(imageElement.content, "url") : undefined;

    return (
        resolveUrl(imageUrl, feedUrl) ??
        resolveUrl(getFirstChildAttribute(xml, "logo", "href"), feedUrl) ??
        resolveUrl(getFirstChildAttribute(xml, "icon", "href"), feedUrl)
    );
}

function getRssItemImageUrl(xml: string, feedUrl: string, rawSummary: string | undefined): string | undefined {
    return (
        resolveUrl(getImageEnclosureUrl(xml), feedUrl) ??
        resolveUrl(getMediaImageUrl(xml), feedUrl) ??
        resolveUrl(getFirstChildAttribute(xml, "image", "href"), feedUrl) ??
        extractImageUrlFromHtml(rawSummary, feedUrl)
    );
}

function getAtomItemImageUrl(xml: string, feedUrl: string, rawSummary: string | undefined): string | undefined {
    return (
        resolveUrl(getAtomEnclosureImageUrl(xml), feedUrl) ??
        resolveUrl(getMediaImageUrl(xml), feedUrl) ??
        extractImageUrlFromHtml(rawSummary, feedUrl)
    );
}

function getImageEnclosureUrl(xml: string): string | undefined {
    return findFirstOpenTag(
        xml,
        "enclosure",
        (attributes) => getAttribute(attributes, "type")?.startsWith("image/") ?? false,
    )?.url;
}

function getMediaImageUrl(xml: string): string | undefined {
    const thumbnail = findFirstOpenTag(xml, "thumbnail", (attributes) => Boolean(getAttribute(attributes, "url")));

    if (thumbnail?.url) {
        return thumbnail.url;
    }

    return findFirstOpenTag(xml, "content", (attributes) => {
        const medium = getAttribute(attributes, "medium") ?? "";
        const type = getAttribute(attributes, "type") ?? "";

        return Boolean(getAttribute(attributes, "url")) && (medium === "image" || type.startsWith("image/"));
    })?.url;
}

function getAtomEnclosureImageUrl(xml: string): string | undefined {
    return findFirstOpenTag(xml, "link", (attributes) => {
        const rel = getAttribute(attributes, "rel") ?? "";
        const type = getAttribute(attributes, "type") ?? "";

        return rel === "enclosure" && type.startsWith("image/");
    })?.href;
}

function getAtomLink(xml: string): string | undefined {
    return (
        findFirstOpenTag(xml, "link", (attributes) => getAttribute(attributes, "rel") === "alternate")?.href ??
        findFirstOpenTag(xml, "link")?.href
    );
}

function getText(xml: string, localName: string): string | undefined {
    return normalizeText(getRawText(xml, localName));
}

function getRawText(xml: string, localName: string): string | undefined {
    const element = findFirstElement(xml, localName);

    if (!element) {
        return undefined;
    }

    return decodeXmlEntities(stripCdata(element.content)).trim() || undefined;
}

function getFirstChildAttribute(xml: string, localName: string, attributeName: string): string | undefined {
    return findFirstOpenTag(xml, localName)?.[attributeName];
}

function findFirstElement(xml: string, localName: string): XmlElement | undefined {
    return findElements(xml, localName)[0];
}

function findElements(xml: string, localName: string): XmlElement[] {
    const elements: XmlElement[] = [];
    const pattern = new RegExp(
        `<(${createQualifiedNamePattern(localName)})(\\s[^>]*)?>([\\s\\S]*?)<\\/\\1>`,
        "gi",
    );
    let match = pattern.exec(xml);

    while (match) {
        elements.push({
            attributes: match[2] ?? "",
            content: match[3] ?? "",
        });
        match = pattern.exec(xml);
    }

    return elements;
}

function findFirstOpenTag(
    xml: string,
    localName: string,
    predicate: (attributes: string) => boolean = () => true,
): Record<string, string> | undefined {
    const pattern = new RegExp(`<${createQualifiedNamePattern(localName)}\\b([^>]*)\\/?>`, "gi");
    let match = pattern.exec(xml);

    while (match) {
        const attributes = match[1] ?? "";

        if (predicate(attributes)) {
            return parseAttributes(attributes);
        }

        match = pattern.exec(xml);
    }

    return undefined;
}

function parseAttributes(attributes: string): Record<string, string> {
    const parsedAttributes: Record<string, string> = {};
    const attributePattern = /([:\w.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let match = attributePattern.exec(attributes);

    while (match) {
        parsedAttributes[match[1]] = decodeXmlEntities(match[2] ?? match[3] ?? "");
        match = attributePattern.exec(attributes);
    }

    return parsedAttributes;
}

function getAttribute(attributes: string, attributeName: string): string | undefined {
    return parseAttributes(attributes)[attributeName]?.toLowerCase();
}

function createQualifiedNamePattern(localName: string): string {
    return `(?:[\\w.-]+:)?${escapeRegExp(localName)}`;
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeDate(value: string | undefined): string | undefined {
    if (!value) {
        return undefined;
    }

    const parsedDate = new Date(value);

    if (Number.isNaN(parsedDate.getTime())) {
        return undefined;
    }

    return parsedDate.toISOString();
}
