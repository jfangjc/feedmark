import { FlatList, Platform, RefreshControl, type ListRenderItemInfo } from "react-native";
import { useCallback, useMemo, type ReactElement } from "react";
import type { RssFeed, RssFeedItem } from "../../features/rss/types";
import { RssItemCard } from "../RssItemCard/RssItemCard";
import { styles } from "./FeedList.styles";

export type FeedEntry = {
    id: string;
    type: "rssItem";
    sourceId: string;
    sourceTitle: string;
    item: RssFeedItem;
};

type FeedListProps = {
    feeds: RssFeed[];
    header?: ReactElement;
    empty?: ReactElement;
    refreshing?: boolean;
    onEntryPress?: (entry: FeedEntry) => void;
    onEntryShare?: (entry: FeedEntry) => void;
    onRefresh?: () => void;
};

export function FeedList({
    feeds,
    header,
    empty,
    refreshing = false,
    onEntryPress,
    onEntryShare,
    onRefresh,
}: FeedListProps) {
    const entries = useMemo(() => createEntries(feeds), [feeds]);
    const renderItem = useCallback((info: ListRenderItemInfo<FeedEntry>) => (
        <FeedCard
            info={info}
            onEntryPress={onEntryPress}
            onEntryShare={onEntryShare}
        />
    ), [onEntryPress, onEntryShare]);

    return (
        <FlatList
            data={entries}
            keyExtractor={(entry) => entry.id}
            renderItem={renderItem}
            ListHeaderComponent={header ?? null}
            ListEmptyComponent={empty ?? null}
            contentContainerStyle={[styles.content, entries.length === 0 ? styles.emptyContent : null]}
            refreshControl={
                onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
            }
            alwaysBounceVertical={Boolean(onRefresh)}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            removeClippedSubviews={Platform.OS === "android"}
            windowSize={7}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
    );
}

function FeedCard({
    info,
    onEntryPress,
    onEntryShare,
}: {
    info: ListRenderItemInfo<FeedEntry>;
    onEntryPress?: (entry: FeedEntry) => void;
    onEntryShare?: (entry: FeedEntry) => void;
}) {
    return (
        <RssItemCard
            item={info.item.item}
            sourceTitle={info.item.sourceTitle}
            onPress={onEntryPress ? () => onEntryPress(info.item) : undefined}
            onShare={
                onEntryShare && info.item.item.link
                    ? () => onEntryShare(info.item)
                    : undefined
            }
        />
    );
}

function createEntries(feeds: RssFeed[]): FeedEntry[] {
    return feeds.flatMap((feed) =>
        feed.items.map((item) => ({
            id: `rss:${feed.id}:${item.id}`,
            type: "rssItem" as const,
            sourceId: feed.id,
            sourceTitle: feed.title,
            item,
        })),
    ).sort(
        (firstEntry, secondEntry) => getTime(secondEntry) - getTime(firstEntry),
    );
}

function getTime(entry: FeedEntry): number {
    const value = entry.item.publishedAt;

    if (!value) {
        return 0;
    }

    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
}
