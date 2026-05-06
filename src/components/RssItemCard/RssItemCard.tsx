import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, Text, useWindowDimensions, View } from "react-native";
import type { RssFeedItem } from "../../features/rss/types";
import { getHostnameLabel } from "../../utils/url";
import {
    METADATA_LINE_HEIGHT,
    METADATA_TEXT_SIZE,
    MIN_VISUAL_SIZE,
    SUMMARY_LINE_HEIGHT,
    SUMMARY_TEXT_SIZE,
    SUMMARY_TOP_GAP,
    TITLE_LINE_HEIGHT,
    TITLE_TEXT_SIZE,
    TITLE_TOP_GAP,
    styles,
} from "./RssItemCard.styles";

type RssItemCardProps = {
    item: RssFeedItem;
    sourceTitle?: string;
    onPress?: () => void;
    onShare?: () => void;
};

export function RssItemCard({ item, sourceTitle, onPress, onShare }: RssItemCardProps) {
    const { fontScale } = useWindowDimensions();
    const publishedDate = formatPublishedDate(item.publishedAt);
    const summary = getFirstLine(item.summary);
    const sourceLabel = sourceTitle ?? (item.link ? getHostnameLabel(item.link) : undefined);
    const hasMetadata = Boolean(sourceLabel || publishedDate || onShare);
    const [titleLineCount, setTitleLineCount] = useState(1);
    const summaryLineCount = titleLineCount <= 1 ? 2 : 1;
    const textStyles = useMemo(() => getScaledTextStyles(fontScale), [fontScale]);
    const visualSize = getVisualSize({
        fontScale,
        hasMetadata,
        hasSummary: Boolean(summary),
    });

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
                <ArticleVisual item={item} textStyles={textStyles} visualSize={visualSize} />
                <View style={styles.content}>
                    {hasMetadata ? (
                        <View style={styles.metadataRow}>
                            <View style={styles.metadataText}>
                                {sourceLabel ? (
                                    <Text
                                        allowFontScaling={false}
                                        numberOfLines={1}
                                        style={[styles.sourceMetadata, textStyles.metadata]}
                                    >
                                        {sourceLabel}
                                    </Text>
                                ) : null}
                                {publishedDate ? (
                                    <Text
                                        allowFontScaling={false}
                                        numberOfLines={1}
                                        style={[styles.metadata, textStyles.metadata]}
                                    >
                                        {publishedDate}
                                    </Text>
                                ) : null}
                            </View>
                            {onShare ? (
                                <Pressable
                                    accessibilityLabel={`Share ${item.title}`}
                                    accessibilityRole="button"
                                    hitSlop={8}
                                    onPress={(event) => {
                                        event.stopPropagation();
                                        onShare();
                                    }}
                                    style={({ pressed }) => [
                                        styles.shareButton,
                                        pressed ? styles.shareButtonPressed : null,
                                    ]}
                                >
                                    <Text
                                        allowFontScaling={false}
                                        style={[styles.shareButtonText, textStyles.metadata]}
                                    >
                                        Share
                                    </Text>
                                </Pressable>
                            ) : null}
                        </View>
                    ) : null}
                    <Text
                        allowFontScaling={false}
                        numberOfLines={2}
                        onTextLayout={(event) => {
                            const nextTitleLineCount = Math.min(event.nativeEvent.lines.length, 2);

                            setTitleLineCount((currentTitleLineCount) =>
                                currentTitleLineCount === nextTitleLineCount
                                    ? currentTitleLineCount
                                    : nextTitleLineCount,
                            );
                        }}
                        style={[styles.title, textStyles.title]}
                    >
                        {item.title}
                    </Text>
                    {summary ? (
                        <Text
                            allowFontScaling={false}
                            numberOfLines={summaryLineCount}
                            style={[styles.summary, textStyles.summary]}
                        >
                            {summary}
                        </Text>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );
}

function ArticleVisual({
    item,
    textStyles,
    visualSize,
}: {
    item: RssFeedItem;
    textStyles: ReturnType<typeof getScaledTextStyles>;
    visualSize: number;
}) {
    const host = item.link ? getHostnameLabel(item.link) : "Preview";
    const visualStyle = [styles.visual, { width: visualSize, height: visualSize }];

    if (item.imageUrl) {
        return (
            <View style={visualStyle}>
                <Image
                    resizeMode="cover"
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                />
            </View>
        );
    }

    return (
        <View style={visualStyle}>
            <View style={styles.preview}>
                <Text
                    allowFontScaling={false}
                    numberOfLines={2}
                    style={[styles.previewTitle, textStyles.metadata]}
                >
                    {host}
                </Text>
                <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={[styles.previewAction, textStyles.metadata]}
                >
                    Open link
                </Text>
            </View>
        </View>
    );
}

function getVisualSize({
    fontScale,
    hasMetadata,
    hasSummary,
}: {
    fontScale: number;
    hasMetadata: boolean;
    hasSummary: boolean;
}): number {
    const metadataHeight = hasMetadata ? METADATA_LINE_HEIGHT * fontScale : 0;
    const titleHeight = TITLE_LINE_HEIGHT * 2 * fontScale;
    const summaryHeight = hasSummary ? SUMMARY_LINE_HEIGHT * fontScale : 0;
    const summaryGap = hasSummary ? SUMMARY_TOP_GAP : 0;

    return Math.ceil(
        Math.max(
            MIN_VISUAL_SIZE,
            metadataHeight + TITLE_TOP_GAP + titleHeight + summaryGap + summaryHeight,
        ),
    );
}

function getScaledTextStyles(fontScale: number) {
    return {
        metadata: {
            fontSize: METADATA_TEXT_SIZE * fontScale,
            lineHeight: METADATA_LINE_HEIGHT * fontScale,
        },
        title: {
            fontSize: TITLE_TEXT_SIZE * fontScale,
            lineHeight: TITLE_LINE_HEIGHT * fontScale,
        },
        summary: {
            fontSize: SUMMARY_TEXT_SIZE * fontScale,
            lineHeight: SUMMARY_LINE_HEIGHT * fontScale,
        },
    };
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
