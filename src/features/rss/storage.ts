import { normalizeFeedUrl } from "../../utils/url";
import { readJsonValue, writeJsonValue } from "../storage/jsonStore";
import type { RssFeed, RssFeedItem } from "./types";

const STORAGE_KEY = "feedmark:rss-cache:v1";
const MAX_CACHED_ITEMS_PER_FEED = 60;

type StoredRssFeeds = {
    version: 1;
    feeds: RssFeed[];
};

export async function listCachedRssFeeds(): Promise<RssFeed[]> {
    const storedValue = await readJsonValue<StoredRssFeeds>(STORAGE_KEY, createEmptyStore());

    return normalizeFeeds(storedValue.feeds);
}

export async function saveCachedRssFeed(feed: RssFeed): Promise<void> {
    const feeds = await listCachedRssFeeds();
    const nextFeeds = feeds.filter((cachedFeed) => cachedFeed.feedUrl !== feed.feedUrl);

    nextFeeds.push(trimFeed(feed));

    await writeFeeds(nextFeeds);
}

export async function removeCachedRssFeed(feedUrl: string): Promise<void> {
    const normalizedFeedUrl = normalizeFeedUrl(feedUrl);
    const feeds = await listCachedRssFeeds();

    await writeFeeds(feeds.filter((feed) => feed.feedUrl !== normalizedFeedUrl));
}

export async function replaceCachedRssFeeds(feeds: RssFeed[]): Promise<void> {
    await writeFeeds(feeds);
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

        byUrl.set(feed.feedUrl, trimFeed(feed));
    }

    return Array.from(byUrl.values()).sort((firstFeed, secondFeed) => getFeedTime(secondFeed) - getFeedTime(firstFeed));
}

function trimFeed(feed: RssFeed): RssFeed {
    return {
        ...feed,
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
