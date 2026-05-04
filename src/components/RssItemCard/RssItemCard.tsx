import { Pressable, Text, View } from "react-native";
import type { RssFeedItem } from "../../features/rss/types";
import { styles } from "./RssItemCard.styles";

type RssItemCardProps = {
    item: RssFeedItem;
    sourceTitle?: string;
    onPress?: () => void;
};

export function RssItemCard({ item, sourceTitle, onPress }: RssItemCardProps) {
    const metadata = [sourceTitle, formatPublishedDate(item.publishedAt)].filter(Boolean).join(" / ");

    return (
        <Pressable
            accessibilityRole={onPress ? "button" : undefined}
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
        >
            <View style={styles.content}>
                {metadata ? (
                    <View style={styles.metadataRow}>
                        <Text numberOfLines={1} style={styles.metadata}>
                            {metadata}
                        </Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>RSS</Text>
                        </View>
                    </View>
                ) : null}
                <Text numberOfLines={2} style={styles.title}>
                    {item.title}
                </Text>
                {item.summary ? (
                    <Text numberOfLines={3} style={styles.summary}>
                        {item.summary}
                    </Text>
                ) : null}
            </View>
        </Pressable>
    );
}

function formatPublishedDate(value: string | undefined): string | undefined {
    if (!value) {
        return undefined;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return undefined;
    }

    return date.toLocaleDateString();
}
