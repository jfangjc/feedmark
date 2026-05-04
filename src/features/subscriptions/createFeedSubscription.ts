import { createStableId } from "../../utils/id";
import { getHostnameLabel, normalizeFeedUrl } from "../../utils/url";
import type { CreateFeedSubscriptionInput, FeedSubscription } from "./types";

export function createFeedSubscription(input: CreateFeedSubscriptionInput): FeedSubscription {
    const feedUrl = normalizeFeedUrl(input.feedUrl);
    const title = input.title?.trim() || getHostnameLabel(feedUrl) || "RSS feed";
    const now = (input.now ?? new Date()).toISOString();

    return {
        id: createStableId("rss_subscription", feedUrl),
        type: "rss",
        title,
        feedUrl,
        siteUrl: input.siteUrl ? normalizeFeedUrl(input.siteUrl) : undefined,
        createdAt: now,
        updatedAt: now,
    };
}
