export type RssFeedItem = {
    id: string;
    title: string;
    link?: string;
    imageUrl?: string;
    summary?: string;
    publishedAt?: string;
    author?: string;
};

export type RssFeed = {
    id: string;
    title: string;
    feedUrl: string;
    siteUrl?: string;
    description?: string;
    imageUrl?: string;
    lastFetchedAt?: string;
    items: RssFeedItem[];
};
