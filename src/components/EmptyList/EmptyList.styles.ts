import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xxl,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
    },
    title: {
        color: theme.colors.text,
        fontSize: theme.fontSizes.lg,
        lineHeight: theme.lineHeights.lg,
        fontWeight: theme.fontWeights.semibold,
        textAlign: "center",
    },
    message: {
        marginTop: theme.spacing.sm,
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.md,
        lineHeight: theme.lineHeights.md,
        textAlign: "center",
    },
});
