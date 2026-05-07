import { mapWithConcurrency } from "../../utils/async";
import { normalizeFeedUrl } from "../../utils/url";
import type { FeedSubscription } from "../subscriptions/types";
import { fetchRssFeed } from "./fetchRssFeed";
import { listCachedRssFeeds } from "./storage";
import type { RssFeed } from "./types";

const MAX_CONCURRENT_FEED_FETCHES = 4;

export type RefreshRssFeedsResult = {
    feeds: RssFeed[];
    cacheUpdates: RssFeed[];
    failures: Array<{
        feedUrl: string;
        message: string;
    }>;
};

export async function refreshRssFeeds(subscriptions: FeedSubscription[]): Promise<RefreshRssFeedsResult> {
    const cachedFeeds = await listCachedRssFeeds();
    const cachedFeedsByUrl = new Map(cachedFeeds.map((feed) => [feed.feedUrl, feed]));
    const results = await mapWithConcurrency(
        subscriptions,
        MAX_CONCURRENT_FEED_FETCHES,
        async (subscription) => refreshSubscription(subscription, cachedFeedsByUrl),
    );

    return {
        feeds: results.flatMap((result) => (result.feed ? [result.feed] : [])),
        cacheUpdates: results.flatMap((result) => (result.feedToCache ? [result.feedToCache] : [])),
        failures: results.flatMap((result) => (result.failure ? [result.failure] : [])),
    };
}

async function refreshSubscription(
    subscription: FeedSubscription,
    cachedFeedsByUrl: Map<string, RssFeed>,
): Promise<{
    feed?: RssFeed;
    feedToCache?: RssFeed;
    failure?: {
        feedUrl: string;
        message: string;
    };
}> {
    const feedUrl = normalizeFeedUrl(subscription.feedUrl);
    const cachedFeed = cachedFeedsByUrl.get(feedUrl);

    try {
        const feed = await fetchRssFeed(feedUrl, { cachedFeed });

        return {
            feed,
            feedToCache: feed,
        };
    }
    catch (error) {
        return {
            feed: cachedFeed,
            failure: {
                feedUrl,
                message: getErrorMessage(error),
            },
        };
    }
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Unable to refresh feed.";
}
