import { StyleSheet } from "react-native";
import {
    NAV_BAR_ACTIVE_INDICATOR_VERTICAL_INSET,
    NAV_BAR_HEIGHT,
    NAV_BAR_HORIZONTAL_PADDING,
    NAV_BAR_VERTICAL_PADDING,
} from "../../navigation/layout";
import { theme } from "../../styles/theme";

export const styles = StyleSheet.create({
    wrapper: {
        padding: 0,
        backgroundColor: "transparent",
    },
    container: {
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        minHeight: NAV_BAR_HEIGHT,
        paddingHorizontal: NAV_BAR_HORIZONTAL_PADDING,
        paddingTop: NAV_BAR_VERTICAL_PADDING,
        paddingBottom: NAV_BAR_VERTICAL_PADDING,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
        borderRightColor: theme.colors.glassEdgeSoftShade,
        borderBottomColor: theme.colors.glassEdgeShade,
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.66)",
        shadowColor: theme.colors.glassShadow,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.16,
        shadowRadius: 22,
        elevation: 5,
    },
    item: {
        position: "relative",
        flex: 1,
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.spacing.xs,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "transparent",
        borderRadius: 999,
        cursor: "pointer",
    },
    activeIndicator: {
        position: "absolute",
        top: NAV_BAR_ACTIVE_INDICATOR_VERTICAL_INSET,
        bottom: NAV_BAR_ACTIVE_INDICATOR_VERTICAL_INSET,
        left: NAV_BAR_HORIZONTAL_PADDING,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(255, 255, 255, 1)",
        borderRadius: 999,
        backgroundColor: "rgba(255, 255, 255, 0.82)",
        shadowColor: theme.colors.glassShadow,
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.12,
        shadowRadius: 14,
        elevation: 3,
    },
    itemHovered: {
        borderColor: "rgba(255, 255, 255, 0.72)",
        backgroundColor: "rgba(255, 255, 255, 0.52)",
        transform: [{ translateY: -1 }],
    },
    itemActive: {
        borderColor: "transparent",
    },
    itemPressed: {
        opacity: 0.82,
        transform: [{ scale: 0.97 }],
    },
    label: {
        color: "#3f3f3f",
        fontSize: theme.fontSizes.xs,
        lineHeight: theme.lineHeights.sm,
        fontWeight: theme.fontWeights.semibold,
        textAlign: "center",
        textShadowColor: "rgba(255, 255, 255, 0.65)",
        textShadowOffset: {
            width: 0,
            height: 1,
        },
        textShadowRadius: 1,
        zIndex: 1,
    },
    labelActive: {
        color: theme.colors.text,
    },
});
