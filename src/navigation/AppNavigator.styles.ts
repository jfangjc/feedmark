import { StyleSheet } from "react-native";
import { NAV_BAR_BOTTOM_OFFSET } from "./layout";
import { theme } from "../styles/theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        overflow: "hidden",
    },
    screen: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    },
    navOverlay: {
        position: "absolute",
        bottom: NAV_BAR_BOTTOM_OFFSET,
        alignSelf: "center",
        width: "88%",
    },
});
