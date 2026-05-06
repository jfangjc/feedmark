import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const MIN_VISUAL_SIZE = 67;
export const METADATA_TEXT_SIZE = 10;
export const METADATA_LINE_HEIGHT = 14;
export const TITLE_TEXT_SIZE = 14;
export const TITLE_LINE_HEIGHT = 17;
export const SUMMARY_TEXT_SIZE = 12;
export const SUMMARY_LINE_HEIGHT = 16;
export const TITLE_TOP_GAP = 1;
export const SUMMARY_TOP_GAP = 2;

export const styles = StyleSheet.create({
    card: {
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.sm,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
    },
    cardPressed: {
        opacity: 0.72,
    },
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        minHeight: MIN_VISUAL_SIZE,
    },
    content: {
        flex: 1,
        minHeight: MIN_VISUAL_SIZE,
        paddingLeft: theme.spacing.sm,
    },
    title: {
        marginTop: TITLE_TOP_GAP,
        color: theme.colors.text,
        fontSize: TITLE_TEXT_SIZE,
        lineHeight: TITLE_LINE_HEIGHT,
        fontWeight: theme.fontWeights.semibold,
    },
    metadataRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    metadataText: {
        flex: 1,
        minWidth: 0,
        flexDirection: "row",
        alignItems: "center",
    },
    sourceMetadata: {
        flexShrink: 1,
        marginRight: theme.spacing.xs,
        color: theme.colors.text,
        fontSize: METADATA_TEXT_SIZE,
        lineHeight: METADATA_LINE_HEIGHT,
        fontWeight: theme.fontWeights.medium,
    },
    metadata: {
        flexShrink: 0,
        color: theme.colors.textMuted,
        fontSize: METADATA_TEXT_SIZE,
        lineHeight: METADATA_LINE_HEIGHT,
        fontWeight: theme.fontWeights.medium,
    },
    shareButton: {
        marginLeft: theme.spacing.xs,
        paddingHorizontal: theme.spacing.xs,
        paddingVertical: 1,
        borderRadius: theme.radii.sm,
    },
    shareButtonPressed: {
        opacity: 0.5,
    },
    shareButtonText: {
        color: theme.colors.text,
        fontSize: METADATA_TEXT_SIZE,
        lineHeight: METADATA_LINE_HEIGHT,
        fontWeight: theme.fontWeights.medium,
    },
    summary: {
        marginTop: SUMMARY_TOP_GAP,
        color: theme.colors.textMuted,
        fontSize: SUMMARY_TEXT_SIZE,
        lineHeight: SUMMARY_LINE_HEIGHT,
    },
    visual: {
        width: MIN_VISUAL_SIZE,
        height: MIN_VISUAL_SIZE,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surfaceMuted,
    },
    preview: {
        width: "100%",
        height: "100%",
        justifyContent: "space-between",
        padding: theme.spacing.sm,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(255,255,255,0.8)",
        borderRadius: theme.radii.md,
        backgroundColor: "rgba(255,255,255,0.58)",
        shadowColor: theme.colors.text,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 2,
    },
    previewTitle: {
        marginTop: theme.spacing.md,
        color: theme.colors.text,
        fontSize: METADATA_TEXT_SIZE,
        lineHeight: METADATA_LINE_HEIGHT,
        fontWeight: theme.fontWeights.semibold,
    },
    previewAction: {
        color: theme.colors.textMuted,
        fontSize: METADATA_TEXT_SIZE,
        lineHeight: METADATA_LINE_HEIGHT,
        fontWeight: theme.fontWeights.medium,
    },
});
