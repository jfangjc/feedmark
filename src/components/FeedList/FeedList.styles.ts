import { StyleSheet } from "react-native";
import { NAV_BAR_SCROLL_CLEARANCE } from "../../navigation/layout";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    content: {
        padding: theme.spacing.md,
        paddingTop: theme.spacing.xxxl,
        paddingBottom: NAV_BAR_SCROLL_CLEARANCE,
    },
    emptyContent: {
        flexGrow: 1,
    },
});
