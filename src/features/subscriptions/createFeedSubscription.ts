import { createStableId } from "../../utils/id";
import { getHostnameLabel, normalizeFeedUrl } from "../../utils/url";
import type { CreateFeedSubscriptionInput, FeedSubscription } from "./types";

export function createFeedSubscription(input: CreateFeedSubscriptionInput): FeedSubscription {
    const feedUrl = normalizeFeedUrl(input.feedUrl);
    const title = input.title?.trim() || getHostnameLabel(feedUrl) || "RSS feed";
    const now = toIsoDate(input.now ?? new Date());

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

function toIsoDate(date: Date): string {
    return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}
