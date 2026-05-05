import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.xl,
        paddingTop: theme.spacing.xxxl,
        paddingBottom: theme.spacing.xxl,
    },
    title: {
        color: theme.colors.text,
        fontSize: theme.fontSizes.xl,
        lineHeight: theme.lineHeights.xl,
        fontWeight: theme.fontWeights.bold,
    },
    actions: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
    },
    button: {
        justifyContent: "center",
        minHeight: 40,
        marginRight: theme.spacing.sm,
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
    },
    buttonPressed: {
        opacity: 0.68,
    },
    buttonText: {
        color: theme.colors.text,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.semibold,
    },
    jsonInput: {
        minHeight: 220,
        padding: theme.spacing.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
    },
    placeholder: {
        color: theme.colors.textMuted,
    },
    message: {
        marginTop: theme.spacing.md,
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
    },
});
