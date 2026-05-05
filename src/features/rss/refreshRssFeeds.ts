import { normalizeFeedUrl } from "../../utils/url";
import type { FeedSubscription } from "../subscriptions/types";
import { fetchRssFeed } from "./fetchRssFeed";
import { listCachedRssFeeds, saveCachedRssFeed } from "./storage";
import type { RssFeed } from "./types";

export type RefreshRssFeedsResult = {
    feeds: RssFeed[];
    failures: Array<{
        feedUrl: string;
        message: string;
    }>;
};

export async function refreshRssFeeds(subscriptions: FeedSubscription[]): Promise<RefreshRssFeedsResult> {
    const cachedFeeds = await listCachedRssFeeds();
    const cachedFeedsByUrl = new Map(cachedFeeds.map((feed) => [feed.feedUrl, feed]));
    const results = await Promise.all(
        subscriptions.map(async (subscription) => refreshSubscription(subscription, cachedFeedsByUrl)),
    );

    return {
        feeds: results.flatMap((result) => (result.feed ? [result.feed] : [])),
        failures: results.flatMap((result) => (result.failure ? [result.failure] : [])),
    };
}

async function refreshSubscription(
    subscription: FeedSubscription,
    cachedFeedsByUrl: Map<string, RssFeed>,
): Promise<{
    feed?: RssFeed;
    failure?: {
        feedUrl: string;
        message: string;
    };
}> {
    const feedUrl = normalizeFeedUrl(subscription.feedUrl);

    try {
        const feed = await fetchRssFeed(feedUrl);
        await saveCachedRssFeed(feed);

        return { feed };
    }
    catch (error) {
        return {
            feed: cachedFeedsByUrl.get(feedUrl),
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
