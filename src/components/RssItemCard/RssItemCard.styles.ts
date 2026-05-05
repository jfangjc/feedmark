import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

const VISUAL_SIZE = 96;

export const styles = StyleSheet.create({
    card: {
        marginBottom: theme.spacing.md,
        padding: theme.spacing.lg,
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
        alignItems: "stretch",
        minHeight: VISUAL_SIZE,
    },
    content: {
        flex: 1,
        minHeight: VISUAL_SIZE,
        paddingLeft: theme.spacing.md,
    },
    title: {
        marginTop: theme.spacing.xs,
        color: theme.colors.text,
        fontSize: theme.fontSizes.lg,
        lineHeight: theme.lineHeights.lg,
        fontWeight: theme.fontWeights.semibold,
    },
    metadata: {
        flex: 1,
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.medium,
    },
    summary: {
        marginTop: theme.spacing.sm,
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
    },
    visual: {
        width: VISUAL_SIZE,
        height: VISUAL_SIZE,
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
    sourcePill: {
        position: "absolute",
        top: theme.spacing.xs,
        left: theme.spacing.xs,
        right: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.radii.sm,
        backgroundColor: "rgba(20,20,20,0.62)",
    },
    sourceText: {
        color: theme.colors.surface,
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.bold,
    },
    previewTitle: {
        marginTop: theme.spacing.xl,
        color: theme.colors.text,
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.semibold,
    },
    previewAction: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.medium,
    },
});
