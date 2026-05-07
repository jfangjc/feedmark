import { normalizeFeedUrl } from "../../utils/url";
import { readJsonValue, writeJsonValue } from "../storage/jsonStore";
import type { RssFeed, RssFeedItem } from "./types";

const STORAGE_KEY = "feedmark:rss-cache:v1";
const MAX_CACHED_ITEMS_PER_FEED = 60;

type StoredRssFeeds = {
    version: 1;
    feeds: RssFeed[];
};

let cacheWriteQueue: Promise<void> = Promise.resolve();

export async function listCachedRssFeeds(): Promise<RssFeed[]> {
    await waitForCacheWrites();

    return await readCachedFeeds();
}

export async function saveCachedRssFeed(feed: RssFeed): Promise<void> {
    await saveCachedRssFeeds([feed]);
}

export async function saveCachedRssFeeds(feedsToSave: RssFeed[]): Promise<void> {
    await enqueueCacheWrite(async () => {
        const feeds = await readCachedFeeds();
        const nextFeedsByUrl = new Map(feeds.map((cachedFeed) => [cachedFeed.feedUrl, cachedFeed]));

        for (const feed of feedsToSave) {
            const trimmedFeed = trimFeed(feed);

            nextFeedsByUrl.set(trimmedFeed.feedUrl, trimmedFeed);
        }

        await writeFeeds(Array.from(nextFeedsByUrl.values()));
    });
}

export async function removeCachedRssFeed(feedUrl: string): Promise<void> {
    await enqueueCacheWrite(async () => {
        const normalizedFeedUrl = normalizeFeedUrl(feedUrl);
        const feeds = await readCachedFeeds();

        await writeFeeds(feeds.filter((feed) => feed.feedUrl !== normalizedFeedUrl));
    });
}

export async function replaceCachedRssFeeds(feeds: RssFeed[]): Promise<void> {
    await enqueueCacheWrite(async () => {
        await writeFeeds(feeds);
    });
}

async function readCachedFeeds(): Promise<RssFeed[]> {
    const storedValue = await readJsonValue<StoredRssFeeds>(STORAGE_KEY, createEmptyStore());

    return normalizeFeeds(storedValue.feeds);
}

async function enqueueCacheWrite(write: () => Promise<void>): Promise<void> {
    const writeOperation = cacheWriteQueue.then(write, write);

    cacheWriteQueue = writeOperation.catch(() => undefined);

    return await writeOperation;
}

async function waitForCacheWrites(): Promise<void> {
    try {
        await cacheWriteQueue;
    }
    catch {
        // Failed writes are surfaced to their caller; later reads should still be allowed to continue.
    }
}

async function writeFeeds(feeds: RssFeed[]): Promise<void> {
    await writeJsonValue<StoredRssFeeds>(STORAGE_KEY, {
        version: 1,
        feeds: normalizeFeeds(feeds),
    });
}

function createEmptyStore(): StoredRssFeeds {
    return {
        version: 1,
        feeds: [],
    };
}

function normalizeFeeds(feeds: RssFeed[] | undefined): RssFeed[] {
    const byUrl = new Map<string, RssFeed>();

    for (const feed of feeds ?? []) {
        if (!feed?.id || !feed.feedUrl || !Array.isArray(feed.items)) {
            continue;
        }

        try {
            const trimmedFeed = trimFeed(feed);

            byUrl.set(trimmedFeed.feedUrl, trimmedFeed);
        }
        catch {
            // Ignore malformed cache entries so one bad feed does not invalidate the whole cache.
        }
    }

    return Array.from(byUrl.values()).sort((firstFeed, secondFeed) => getFeedTime(secondFeed) - getFeedTime(firstFeed));
}

function trimFeed(feed: RssFeed): RssFeed {
    return {
        ...feed,
        feedUrl: normalizeFeedUrl(feed.feedUrl),
        items: normalizeItems(feed.items).slice(0, MAX_CACHED_ITEMS_PER_FEED),
    };
}

function normalizeItems(items: RssFeedItem[]): RssFeedItem[] {
    return items
        .filter((item) => item?.id && item.title)
        .sort((firstItem, secondItem) => getItemTime(secondItem) - getItemTime(firstItem));
}

function getFeedTime(feed: RssFeed): number {
    return getTime(feed.lastFetchedAt) || Math.max(0, ...feed.items.map(getItemTime));
}

function getItemTime(item: RssFeedItem): number {
    return getTime(item.publishedAt);
}

function getTime(value: string | undefined): number {
    if (!value) {
        return 0;
    }

    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
}
