import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import type { RssFeedItem } from "../../features/rss/types";
import { getHostnameLabel } from "../../utils/url";
import { styles } from "./RssItemCard.styles";

type RssItemCardProps = {
    item: RssFeedItem;
    sourceTitle?: string;
    onPress?: () => void;
};

export function RssItemCard({ item, sourceTitle, onPress }: RssItemCardProps) {
    const publishedDate = formatPublishedDate(item.publishedAt);
    const summary = getFirstLine(item.summary);
    const sourceLabel = sourceTitle ?? (item.link ? getHostnameLabel(item.link) : undefined);
    const hasMetadata = Boolean(sourceLabel || publishedDate);
    const [titleLineCount, setTitleLineCount] = useState(1);
    const summaryLineCount = titleLineCount <= 1 ? 2 : 1;

    useEffect(() => {
        setTitleLineCount(1);
    }, [item.id]);

    return (
        <Pressable
            accessibilityRole={onPress ? "button" : undefined}
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
        >
            <View style={styles.row}>
                <ArticleVisual item={item} />
                <View style={styles.content}>
                    {hasMetadata ? (
                        <View style={styles.metadataRow}>
                            {sourceLabel ? (
                                <Text numberOfLines={1} style={styles.sourceMetadata}>
                                    {sourceLabel}
                                </Text>
                            ) : null}
                            {publishedDate ? (
                                <Text numberOfLines={1} style={styles.metadata}>
                                    {publishedDate}
                                </Text>
                            ) : null}
                        </View>
                    ) : null}
                    <Text
                        numberOfLines={2}
                        onTextLayout={(event) => {
                            const nextTitleLineCount = Math.min(event.nativeEvent.lines.length, 2);

                            setTitleLineCount((currentTitleLineCount) =>
                                currentTitleLineCount === nextTitleLineCount
                                    ? currentTitleLineCount
                                    : nextTitleLineCount,
                            );
                        }}
                        style={styles.title}
                    >
                        {item.title}
                    </Text>
                    {summary ? (
                        <Text numberOfLines={summaryLineCount} style={styles.summary}>
                            {summary}
                        </Text>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );
}

function ArticleVisual({ item }: { item: RssFeedItem }) {
    const host = item.link ? getHostnameLabel(item.link) : "Preview";

    if (item.imageUrl) {
        return (
            <View style={styles.visual}>
                <Image
                    resizeMode="cover"
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                />
            </View>
        );
    }

    return (
        <View style={styles.visual}>
            <View style={styles.preview}>
                <Text numberOfLines={2} style={styles.previewTitle}>
                    {host}
                </Text>
                <Text numberOfLines={1} style={styles.previewAction}>
                    Open link
                </Text>
            </View>
        </View>
    );
}

function getFirstLine(value: string | undefined): string | undefined {
    const firstLine = value?.split(/\r?\n/)[0]?.trim();

    return firstLine || undefined;
}

function formatPublishedDate(value: string | undefined): string | undefined {
    if (!value) {
        return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    return [
        `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`,
        `${padDatePart(date.getDate())}/${padDatePart(date.getMonth() + 1)}/${date.getFullYear()}`,
    ].join(" ");
}

function padDatePart(value: number): string {
    return value.toString().padStart(2, "0");
}
