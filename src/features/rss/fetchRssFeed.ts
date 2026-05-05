import { Image } from "react-native";
import { normalizeFeedUrl } from "../../utils/url";
import { parseRssFeedXml } from "./parsers/parseRssFeed";
import type { RssFeed } from "./types";

const RSS_ACCEPT_HEADER = [
    "application/rss+xml",
    "application/atom+xml",
    "application/xml",
    "text/xml",
    "*/*",
].join(", ");

const MAX_PREFETCHED_IMAGES = 20;

export async function fetchRssFeed(feedUrlInput: string): Promise<RssFeed> {
    const feedUrl = normalizeFeedUrl(feedUrlInput);
    const xml = await fetchRssXml(feedUrl);
    const feed = parseRssFeedXml(xml, feedUrl);

    void prefetchFeedImages(feed);

    return feed;
}

async function fetchRssXml(feedUrl: string): Promise<string> {
    const response = await fetch(feedUrl, {
        headers: {
            Accept: RSS_ACCEPT_HEADER,
        },
    });

    if (!response.ok) {
        throw new Error(`Unable to fetch RSS feed (${response.status}).`);
    }

    return await response.text();
}

async function prefetchFeedImages(feed: RssFeed): Promise<void> {
    const imageUrls = Array.from(
        new Set(feed.items.map((item) => item.imageUrl).filter((imageUrl): imageUrl is string => Boolean(imageUrl))),
    ).slice(0, MAX_PREFETCHED_IMAGES);

    await Promise.all(
        imageUrls.map(async (imageUrl) => {
            try {
                await Image.prefetch(imageUrl);
            }
            catch {
                // Image failures should not block feed updates.
            }
        }),
    );
}
