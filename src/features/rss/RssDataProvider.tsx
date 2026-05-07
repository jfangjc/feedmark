import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type PropsWithChildren,
} from "react";
import { fetchRssFeed } from "./fetchRssFeed";
import { refreshRssFeeds } from "./refreshRssFeeds";
import {
    listCachedRssFeeds,
    removeCachedRssFeed,
    replaceCachedRssFeeds,
    saveCachedRssFeed,
    saveCachedRssFeeds,
} from "./storage";
import type { RssFeed } from "./types";
import { createFeedSubscription } from "../subscriptions/createFeedSubscription";
import {
    clearFeedSubscriptions,
    exportFeedSubscriptionsJson,
    listFeedSubscriptions,
    parseFeedSubscriptionsJson,
    removeFeedSubscription,
    replaceFeedSubscriptions,
    saveFeedSubscription,
} from "../subscriptions/storage";
import type { FeedSubscription } from "../subscriptions/types";

type RssDataContextValue = {
    subscriptions: FeedSubscription[];
    feeds: RssFeed[];
    isLoading: boolean;
    isRefreshing: boolean;
    statusMessage?: string;
    addRssSubscription: (feedUrl: string) => Promise<void>;
    removeRssSubscription: (id: string) => Promise<void>;
    refreshFeeds: () => Promise<void>;
    clearSubscriptions: () => Promise<void>;
    exportSubscriptionsJson: () => string;
    importSubscriptionsJson: (json: string) => Promise<void>;
};

const RssDataContext = createContext<RssDataContextValue | null>(null);

export function RssDataProvider({ children }: PropsWithChildren) {
    const [subscriptions, setSubscriptions] = useState<FeedSubscription[]>([]);
    const [feeds, setFeeds] = useState<RssFeed[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | undefined>();
    const mountedRef = useRef(true);
    const refreshIdRef = useRef(0);

    const cancelActiveRefresh = useCallback(() => {
        refreshIdRef.current += 1;
        setIsRefreshing(false);
    }, []);

    const refreshFeedSet = useCallback(async (nextSubscriptions: FeedSubscription[]) => {
        const refreshId = refreshIdRef.current + 1;

        refreshIdRef.current = refreshId;

        if (nextSubscriptions.length === 0) {
            setFeeds([]);
            setStatusMessage(undefined);
            setIsRefreshing(false);
            return;
        }

        setIsRefreshing(true);

        try {
            const result = await refreshRssFeeds(nextSubscriptions);

            if (!mountedRef.current || refreshId !== refreshIdRef.current) {
                return;
            }

            if (result.cacheUpdates.length > 0) {
                try {
                    await saveCachedRssFeeds(result.cacheUpdates);
                }
                catch {
                    // The refreshed in-memory feed should still update if persistence is temporarily unavailable.
                }
            }

            if (!mountedRef.current || refreshId !== refreshIdRef.current) {
                return;
            }

            setFeeds(result.feeds);
            setStatusMessage(formatRefreshStatus(result.failures.length, nextSubscriptions.length));
        }
        catch (error) {
            if (mountedRef.current && refreshId === refreshIdRef.current) {
                setStatusMessage(getErrorMessage(error));
            }
        }
        finally {
            if (mountedRef.current && refreshId === refreshIdRef.current) {
                setIsRefreshing(false);
            }
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        async function loadLibrary() {
            try {
                const [storedSubscriptions, cachedFeeds] = await Promise.all([
                    listFeedSubscriptions(),
                    listCachedRssFeeds(),
                ]);

                if (!mountedRef.current) {
                    return;
                }

                setSubscriptions(storedSubscriptions);
                setFeeds(filterFeedsForSubscriptions(cachedFeeds, storedSubscriptions));
                setIsLoading(false);

                await refreshFeedSet(storedSubscriptions);
            }
            catch (error) {
                if (!mountedRef.current) {
                    return;
                }

                setIsLoading(false);
                setStatusMessage(getErrorMessage(error));
            }
        }

        void loadLibrary();

        return () => {
            mountedRef.current = false;
        };
    }, [refreshFeedSet]);

    const addRssSubscription = useCallback(async (feedUrl: string) => {
        cancelActiveRefresh();
        setStatusMessage(undefined);

        const subscription = createFeedSubscription({ feedUrl });
        const feed = await fetchRssFeed(subscription.feedUrl);
        const now = feed.lastFetchedAt ?? new Date().toISOString();
        const savedSubscription: FeedSubscription = {
            ...subscription,
            title: feed.title,
            siteUrl: feed.siteUrl,
            updatedAt: now,
        };

        await saveFeedSubscription(savedSubscription);
        await saveCachedRssFeed(feed);

        setSubscriptions((currentSubscriptions) => upsertSubscription(currentSubscriptions, savedSubscription));
        setFeeds((currentFeeds) => upsertFeed(currentFeeds, feed));
    }, [cancelActiveRefresh]);

    const removeRssSubscription = useCallback(async (id: string) => {
        cancelActiveRefresh();
        const subscription = subscriptions.find((candidate) => candidate.id === id);

        await removeFeedSubscription(id);

        if (subscription) {
            await removeCachedRssFeed(subscription.feedUrl);
        }

        setSubscriptions((currentSubscriptions) =>
            currentSubscriptions.filter((currentSubscription) => currentSubscription.id !== id),
        );
        setFeeds((currentFeeds) =>
            subscription
                ? currentFeeds.filter((feed) => feed.feedUrl !== subscription.feedUrl)
                : currentFeeds,
        );
    }, [cancelActiveRefresh, subscriptions]);

    const refreshFeeds = useCallback(async () => {
        await refreshFeedSet(subscriptions);
    }, [refreshFeedSet, subscriptions]);

    const clearSubscriptions = useCallback(async () => {
        cancelActiveRefresh();
        await clearFeedSubscriptions();
        await replaceCachedRssFeeds([]);
        setSubscriptions([]);
        setFeeds([]);
        setStatusMessage(undefined);
    }, [cancelActiveRefresh]);

    const exportSubscriptionsJson = useCallback(() => exportFeedSubscriptionsJson(subscriptions), [subscriptions]);

    const importSubscriptionsJson = useCallback(async (json: string) => {
        cancelActiveRefresh();
        const importedSubscriptions = parseFeedSubscriptionsJson(json);

        await replaceFeedSubscriptions(importedSubscriptions);
        setSubscriptions(importedSubscriptions);

        const cachedFeeds = await listCachedRssFeeds();
        setFeeds(filterFeedsForSubscriptions(cachedFeeds, importedSubscriptions));
        await refreshFeedSet(importedSubscriptions);
    }, [cancelActiveRefresh, refreshFeedSet]);

    const value = useMemo<RssDataContextValue>(
        () => ({
            subscriptions,
            feeds,
            isLoading,
            isRefreshing,
            statusMessage,
            addRssSubscription,
            removeRssSubscription,
            refreshFeeds,
            clearSubscriptions,
            exportSubscriptionsJson,
            importSubscriptionsJson,
        }),
        [
            subscriptions,
            feeds,
            isLoading,
            isRefreshing,
            statusMessage,
            addRssSubscription,
            removeRssSubscription,
            refreshFeeds,
            clearSubscriptions,
            exportSubscriptionsJson,
            importSubscriptionsJson,
        ],
    );

    return <RssDataContext.Provider value={value}>{children}</RssDataContext.Provider>;
}

export function useRssData(): RssDataContextValue {
    const context = useContext(RssDataContext);

    if (!context) {
        throw new Error("useRssData must be used within RssDataProvider.");
    }

    return context;
}

function upsertSubscription(subscriptions: FeedSubscription[], subscription: FeedSubscription): FeedSubscription[] {
    const nextSubscriptions = subscriptions.filter((currentSubscription) => currentSubscription.id !== subscription.id);

    nextSubscriptions.push(subscription);

    return nextSubscriptions.sort(
        (firstSubscription, secondSubscription) =>
            getTime(firstSubscription.createdAt) - getTime(secondSubscription.createdAt),
    );
}

function upsertFeed(feeds: RssFeed[], feed: RssFeed): RssFeed[] {
    const nextFeeds = feeds.filter((currentFeed) => currentFeed.feedUrl !== feed.feedUrl);

    nextFeeds.push(feed);

    return nextFeeds;
}

function filterFeedsForSubscriptions(feeds: RssFeed[], subscriptions: FeedSubscription[]): RssFeed[] {
    const subscriptionUrls = new Set(subscriptions.map((subscription) => subscription.feedUrl));

    return feeds.filter((feed) => subscriptionUrls.has(feed.feedUrl));
}

function formatRefreshStatus(failureCount: number, subscriptionCount: number): string | undefined {
    if (failureCount === 0) {
        return undefined;
    }

    if (failureCount === subscriptionCount) {
        return "Unable to refresh feeds. Showing cached items where available.";
    }

    return "Some feeds could not refresh. Showing cached items for those subscriptions.";
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Something went wrong.";
}

function getTime(value: string): number {
    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
}
