import { createStableId } from "../../../utils/id";
import { normalizeFeedUrl, resolveUrl } from "../../../utils/url";
import type { RssFeed, RssFeedItem } from "../types";
import { extractImageUrlFromHtml, normalizeHtmlSummary, normalizeText } from "./text";

export function parseRssFeedXml(xml: string, feedUrlInput: string): RssFeed {
    if (typeof DOMParser === "undefined") {
        throw new Error("DOMParser RSS parsing is only supported on web.");
    }

    const feedUrl = normalizeFeedUrl(feedUrlInput);
    const document = new DOMParser().parseFromString(xml, "application/xml");

    if (document.querySelector("parsererror")) {
        throw new Error("Unable to parse RSS XML.");
    }

    const channel = document.querySelector("channel");

    if (channel) {
        return parseRssChannel(channel, feedUrl);
    }

    const atomFeed = document.querySelector("feed");

    if (atomFeed) {
        return parseAtomFeed(atomFeed, feedUrl);
    }

    throw new Error("XML does not contain an RSS channel or Atom feed.");
}

function parseRssChannel(channel: Element, feedUrl: string): RssFeed {
    const title = getText(channel, "title") ?? "Untitled RSS feed";
    const siteUrl = resolveUrl(getText(channel, "link"), feedUrl);
    const description = normalizeText(getText(channel, "description"));
    const imageUrl = getRssFeedImageUrl(channel, feedUrl);
    const items = Array.from(channel.querySelectorAll("item")).map((item, index) => parseRssItem(item, feedUrl, index));

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

function parseAtomFeed(feed: Element, feedUrl: string): RssFeed {
    const title = getText(feed, "title") ?? "Untitled Atom feed";
    const siteUrl = resolveUrl(getAtomLink(feed), feedUrl);
    const description = normalizeText(getText(feed, "subtitle"));
    const imageUrl = resolveUrl(getText(feed, "logo") ?? getText(feed, "icon"), feedUrl);
    const items = Array.from(feed.querySelectorAll("entry")).map((entry, index) =>
        parseAtomEntry(entry, feedUrl, index),
    );

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

function parseRssItem(item: Element, feedUrl: string, index: number): RssFeedItem {
    const title = getText(item, "title") ?? "Untitled item";
    const link = resolveUrl(getText(item, "link"), feedUrl);
    const publishedAt = normalizeDate(getText(item, "pubDate"));
    const rawSummary = getText(item, "description") ?? getNamespacedText(item, "encoded");
    const summary = normalizeHtmlSummary(rawSummary);
    const imageUrl = getRssItemImageUrl(item, feedUrl, rawSummary);
    const author = getText(item, "author") ?? getNamespacedText(item, "creator");
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

function parseAtomEntry(entry: Element, feedUrl: string, index: number): RssFeedItem {
    const title = getText(entry, "title") ?? "Untitled item";
    const link = resolveUrl(getAtomLink(entry), feedUrl);
    const publishedAt = normalizeDate(getText(entry, "published") ?? getText(entry, "updated"));
    const rawSummary = getText(entry, "summary") ?? getText(entry, "content");
    const summary = normalizeHtmlSummary(rawSummary);
    const imageUrl = getAtomItemImageUrl(entry, feedUrl, rawSummary);
    const author = getText(entry, "author > name");
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

function getText(parent: Element, selector: string): string | undefined {
    return parent.querySelector(selector)?.textContent?.trim() || undefined;
}

function getNamespacedText(parent: Element, localName: string): string | undefined {
    return (
        Array.from(parent.children)
            .find((child) => child.localName === localName)
            ?.textContent?.trim() || undefined
    );
}

function getRssFeedImageUrl(channel: Element, feedUrl: string): string | undefined {
    const channelImage = Array.from(channel.children).find((child) => child.localName === "image");
    const imageUrl = channelImage ? getText(channelImage, "url") : undefined;

    return (
        resolveUrl(imageUrl, feedUrl) ??
        resolveUrl(getChildAttribute(channel, "logo", "href"), feedUrl) ??
        resolveUrl(getChildAttribute(channel, "icon", "href"), feedUrl)
    );
}

function getRssItemImageUrl(item: Element, feedUrl: string, rawSummary: string | undefined): string | undefined {
    return (
        resolveUrl(getImageEnclosureUrl(item), feedUrl) ??
        resolveUrl(getMediaImageUrl(item), feedUrl) ??
        resolveUrl(getChildAttribute(item, "image", "href"), feedUrl) ??
        extractImageUrlFromHtml(rawSummary, feedUrl)
    );
}

function getAtomItemImageUrl(entry: Element, feedUrl: string, rawSummary: string | undefined): string | undefined {
    return (
        resolveUrl(getAtomEnclosureImageUrl(entry), feedUrl) ??
        resolveUrl(getMediaImageUrl(entry), feedUrl) ??
        extractImageUrlFromHtml(rawSummary, feedUrl)
    );
}

function getImageEnclosureUrl(parent: Element): string | undefined {
    const enclosure = Array.from(parent.children).find((child) => {
        const type = child.getAttribute("type") ?? "";

        return child.localName === "enclosure" && type.toLowerCase().startsWith("image/");
    });

    return enclosure?.getAttribute("url") ?? undefined;
}

function getMediaImageUrl(parent: Element): string | undefined {
    const mediaChild = Array.from(parent.children).find((child) => {
        const medium = child.getAttribute("medium") ?? "";
        const type = child.getAttribute("type") ?? "";

        return (
            (child.localName === "thumbnail" && child.getAttribute("url")) ||
            (child.localName === "content" &&
                child.getAttribute("url") &&
                (medium.toLowerCase() === "image" || type.toLowerCase().startsWith("image/")))
        );
    });

    return mediaChild?.getAttribute("url") ?? undefined;
}

function getAtomEnclosureImageUrl(parent: Element): string | undefined {
    const link = Array.from(parent.querySelectorAll("link")).find((child) => {
        const rel = child.getAttribute("rel") ?? "";
        const type = child.getAttribute("type") ?? "";

        return rel.toLowerCase() === "enclosure" && type.toLowerCase().startsWith("image/");
    });

    return link?.getAttribute("href") ?? undefined;
}

function getChildAttribute(parent: Element, localName: string, attributeName: string): string | undefined {
    return (
        Array.from(parent.children)
            .find((child) => child.localName === localName)
            ?.getAttribute(attributeName) ?? undefined
    );
}

function getAtomLink(parent: Element): string | undefined {
    return (
        parent.querySelector("link[rel='alternate']")?.getAttribute("href") ??
        parent.querySelector("link")?.getAttribute("href") ??
        undefined
    );
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
