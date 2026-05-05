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

    return (
        <Pressable
            accessibilityRole={onPress ? "button" : undefined}
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
        >
            <View style={styles.row}>
                <ArticleVisual item={item} sourceTitle={sourceTitle} />
                <View style={styles.content}>
                    {publishedDate ? (
                        <Text numberOfLines={1} style={styles.metadata}>
                            {publishedDate}
                        </Text>
                    ) : null}
                    <Text numberOfLines={3} style={styles.title}>
                        {item.title}
                    </Text>
                    {summary ? (
                        <Text numberOfLines={1} style={styles.summary}>
                            {summary}
                        </Text>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );
}

function ArticleVisual({ item, sourceTitle }: { item: RssFeedItem; sourceTitle?: string }) {
    const host = item.link ? getHostnameLabel(item.link) : "Preview";
    const sourceLabel = sourceTitle ?? host;

    if (item.imageUrl) {
        return (
            <View style={styles.visual}>
                <Image
                    resizeMode="cover"
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                />
                <SourcePill label={sourceLabel} />
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
            <SourcePill label={sourceLabel} />
        </View>
    );
}

function SourcePill({ label }: { label: string }) {
    return (
        <View style={styles.sourcePill}>
            <Text numberOfLines={1} style={styles.sourceText}>
                {label}
            </Text>
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
