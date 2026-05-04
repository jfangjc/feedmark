import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

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
    content: {
        minHeight: 96,
    },
    metadataRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
    },
    title: {
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
    badge: {
        marginLeft: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.accentSoft,
    },
    badgeText: {
        color: theme.colors.accent,
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.bold,
    },
    summary: {
        marginTop: theme.spacing.sm,
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
    },
});
