import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: theme.colors.surface,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: theme.colors.border,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 64,
        paddingHorizontal: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
    },
    item: {
        flex: 1,
        minHeight: 44,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.spacing.xs,
        borderRadius: theme.radii.md,
    },
    itemActive: {
        backgroundColor: theme.colors.accentSoft,
    },
    itemPressed: {
        opacity: 0.5,
    },
    label: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.semibold,
        textAlign: "center",
    },
    labelActive: {
        color: theme.colors.accent,
    },
});
