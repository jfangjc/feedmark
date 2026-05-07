import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    card: {
        padding: theme.spacing.lg,
        borderRadius: theme.radii.md,
        backgroundColor: "transparent",
    },
    cardPressed: {
        opacity: 0.72,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    title: {
        flex: 1,
        color: theme.colors.text,
        fontSize: theme.fontSizes.md,
        lineHeight: theme.lineHeights.md,
        fontWeight: theme.fontWeights.semibold,
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
    url: {
        marginTop: theme.spacing.sm,
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
    },
});
