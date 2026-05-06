import { FlatList, RefreshControl, type ListRenderItemInfo } from "react-native";
import type { ReactElement } from "react";
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
    onRefresh?: () => void;
};

export function FeedList({
    feeds,
    header,
    empty,
    refreshing = false,
    onEntryPress,
    onRefresh,
}: FeedListProps) {
    const entries = createEntries(feeds);

    return (
        <FlatList
            data={entries}
            keyExtractor={(entry) => entry.id}
            renderItem={(info) => <FeedCard info={info} onEntryPress={onEntryPress} />}
            ListHeaderComponent={header ?? null}
            ListEmptyComponent={empty ?? null}
            contentContainerStyle={[styles.content, entries.length === 0 ? styles.emptyContent : null]}
            refreshControl={
                onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> : undefined
            }
            alwaysBounceVertical={Boolean(onRefresh)}
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
    return (
        <RssItemCard
            item={info.item.item}
            sourceTitle={info.item.sourceTitle}
            onPress={onEntryPress ? () => onEntryPress(info.item) : undefined}
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
