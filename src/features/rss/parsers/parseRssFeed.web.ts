import { createStableId } from "../../../utils/id";
import { normalizeFeedUrl } from "../../../utils/url";
import type { RssFeed, RssFeedItem } from "../types";

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
    const siteUrl = getText(channel, "link");
    const description = getText(channel, "description");
    const items = Array.from(channel.querySelectorAll("item")).map((item, index) => parseRssItem(item, feedUrl, index));

    return {
        id: createStableId("rss_feed", feedUrl),
        title,
        feedUrl,
        siteUrl,
        description,
        lastFetchedAt: new Date().toISOString(),
        items,
    };
}

function parseAtomFeed(feed: Element, feedUrl: string): RssFeed {
    const title = getText(feed, "title") ?? "Untitled Atom feed";
    const siteUrl = getAtomLink(feed);
    const description = getText(feed, "subtitle");
    const items = Array.from(feed.querySelectorAll("entry")).map((entry, index) =>
        parseAtomEntry(entry, feedUrl, index),
    );

    return {
        id: createStableId("rss_feed", feedUrl),
        title,
        feedUrl,
        siteUrl,
        description,
        lastFetchedAt: new Date().toISOString(),
        items,
    };
}

function parseRssItem(item: Element, feedUrl: string, index: number): RssFeedItem {
    const title = getText(item, "title") ?? "Untitled item";
    const link = getText(item, "link");
    const publishedAt = normalizeDate(getText(item, "pubDate"));
    const summary = getText(item, "description");
    const author = getText(item, "author") ?? getNamespacedText(item, "creator");
    const stableSeed = `${feedUrl}:${link ?? title}:${publishedAt ?? index}`;

    return {
        id: createStableId("rss_item", stableSeed),
        title,
        link,
        summary,
        publishedAt,
        author,
    };
}

function parseAtomEntry(entry: Element, feedUrl: string, index: number): RssFeedItem {
    const title = getText(entry, "title") ?? "Untitled item";
    const link = getAtomLink(entry);
    const publishedAt = normalizeDate(getText(entry, "published") ?? getText(entry, "updated"));
    const summary = getText(entry, "summary") ?? getText(entry, "content");
    const author = getText(entry, "author > name");
    const stableSeed = `${feedUrl}:${link ?? title}:${publishedAt ?? index}`;

    return {
        id: createStableId("rss_item", stableSeed),
        title,
        link,
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
