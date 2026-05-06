import { StyleSheet } from "react-native";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    content: {
        padding: theme.spacing.md,
        paddingTop: theme.spacing.xxxl,
        paddingBottom: theme.spacing.xl,
    },
    emptyContent: {
        flexGrow: 1,
    },
});
