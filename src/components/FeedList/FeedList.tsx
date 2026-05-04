import { FlatList, type ListRenderItemInfo } from "react-native";
import type { ReactElement } from "react";
import type { RssFeed, RssFeedItem } from "../../features/rss/types";
import type { FeedSubscription } from "../../features/subscriptions/types";
import { RssItemCard } from "../RssItemCard/RssItemCard";
import { SubscriptionCard } from "../SubscriptionCard/SubscriptionCard";
import { styles } from "./FeedList.styles";

export type FeedEntry =
    | {
        id: string;
        type: "rssItem";
        sourceId: string;
        sourceTitle: string;
        item: RssFeedItem;
    }
    | {
        id: string;
        type: "subscription";
        subscription: FeedSubscription;
    };

type FeedListProps = {
    feeds: RssFeed[];
    subscriptions: FeedSubscription[];
    header?: ReactElement;
    empty?: ReactElement;
    onEntryPress?: (entry: FeedEntry) => void;
};

export function FeedList({ feeds, subscriptions, header, empty, onEntryPress }: FeedListProps) {
    const entries = createEntries(feeds, subscriptions);

    return (
        <FlatList
            data={entries}
            keyExtractor={(entry) => entry.id}
            renderItem={(info) => <FeedCard info={info} onEntryPress={onEntryPress} />}
            ListHeaderComponent={header ?? null}
            ListEmptyComponent={empty ?? null}
            contentContainerStyle={[styles.content, entries.length === 0 ? styles.emptyContent : null]}
            alwaysBounceVertical={false}
        />
    );
}

function FeedCard({
    info,
    onEntryPress,
}: {
    info: ListRenderItemInfo<FeedEntry>;
    onEntryPress?: (entry: FeedEntry) => void;
}) {
    if (info.item.type === "subscription") {
        return (
            <SubscriptionCard
                subscription={info.item.subscription}
                onPress={onEntryPress ? () => onEntryPress(info.item) : undefined}
            />
        );
    }

    return (
        <RssItemCard
            item={info.item.item}
            sourceTitle={info.item.sourceTitle}
            onPress={onEntryPress ? () => onEntryPress(info.item) : undefined}
        />
    );
}

function createEntries(feeds: RssFeed[], subscriptions: FeedSubscription[]): FeedEntry[] {
    const rssEntries = feeds.flatMap((feed) =>
        feed.items.map((item) => ({
            id: `rss:${feed.id}:${item.id}`,
            type: "rssItem" as const,
            sourceId: feed.id,
            sourceTitle: feed.title,
            item,
        })),
    );

    const subscriptionEntries = subscriptions.map((subscription) => ({
        id: `subscription:${subscription.id}`,
        type: "subscription" as const,
        subscription,
    }));

    return [...rssEntries, ...subscriptionEntries].sort(
        (firstEntry, secondEntry) => getTime(secondEntry) - getTime(firstEntry),
    );
}

function getTime(entry: FeedEntry): number {
    const value = entry.type === "rssItem" ? entry.item.publishedAt : entry.subscription.updatedAt;

    if (!value) {
        return 0;
    }

    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
}
