export type FeedSubscriptionType = "rss";

export type FeedSubscription = {
    id: string;
    type: FeedSubscriptionType;
    title: string;
    feedUrl: string;
    siteUrl?: string;
    createdAt: string;
    updatedAt: string;
};

export type CreateFeedSubscriptionInput = {
    title?: string;
    feedUrl: string;
    siteUrl?: string;
    now?: Date;
};
