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
    form: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: theme.spacing.xl,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: theme.spacing.md,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
        color: theme.colors.text,
        fontSize: theme.fontSizes.md,
        lineHeight: theme.lineHeights.md,
    },
    placeholder: {
        color: theme.colors.textMuted,
    },
    primaryButton: {
        height: 48,
        justifyContent: "center",
        marginLeft: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.text,
    },
    primaryButtonText: {
        color: theme.colors.surface,
        fontSize: theme.fontSizes.md,
        lineHeight: theme.lineHeights.md,
        fontWeight: theme.fontWeights.semibold,
    },
    secondaryButton: {
        height: 40,
        justifyContent: "center",
        paddingHorizontal: theme.spacing.lg,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.surface,
    },
    secondaryButtonText: {
        color: theme.colors.text,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.semibold,
    },
    buttonPressed: {
        opacity: 0.68,
    },
    message: {
        marginTop: theme.spacing.md,
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
    },
    actions: {
        flexDirection: "row",
        marginTop: theme.spacing.lg,
    },
    list: {
        marginTop: theme.spacing.xl,
    },
    subscription: {
        marginBottom: theme.spacing.md,
    },
    removeButton: {
        alignSelf: "flex-start",
        marginTop: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: theme.colors.border,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.surfaceMuted,
    },
    removeButtonText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.sm,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.medium,
    },
    emptyText: {
        color: theme.colors.textMuted,
        fontSize: theme.fontSizes.md,
        lineHeight: theme.lineHeights.md,
    },
});
