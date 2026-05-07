import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { NAV_BAR_HORIZONTAL_PADDING } from "../../navigation/layout";
import { appTabs, createTabRoute, getActiveTabName, type AppTabRouteName } from "../../navigation/routes";
import { useNavigation } from "../../navigation/useNavigation";
import { GlassMaterial } from "../GlassMaterial/GlassMaterial";
import { styles } from "./NavBar.styles";

export function NavBar() {
    const navigation = useNavigation();
    const activeTabName = getActiveTabName(navigation.route);
    const [hoveredTabName, setHoveredTabName] = useState<AppTabRouteName>();
    const [containerWidth, setContainerWidth] = useState(0);
    const activeIndex = Math.max(appTabs.findIndex((tab) => tab.name === activeTabName), 0);
    const activePosition = useRef(new Animated.Value(activeIndex)).current;
    const indicatorTrackWidth = Math.max(containerWidth - NAV_BAR_HORIZONTAL_PADDING * 2, 0);
    const tabWidth = indicatorTrackWidth / appTabs.length;

    useEffect(() => {
        Animated.timing(activePosition, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
            toValue: activeIndex,
            useNativeDriver: true,
        }).start();
    }, [activeIndex, activePosition]);

    function handlePress(tabName: AppTabRouteName) {
        navigation.reset(createTabRoute(tabName));
    }

    return (
        <View pointerEvents="box-none" style={styles.wrapper}>
            <View
                onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
                style={styles.container}
            >
                <GlassMaterial variant="pill" />
                {tabWidth > 0 ? (
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.activeIndicator,
                            {
                                width: tabWidth,
                                transform: [
                                    {
                                        translateX: Animated.multiply(activePosition, tabWidth),
                                    },
                                ],
                            },
                        ]}
                    />
                ) : null}
                {appTabs.map((tab) => {
                    const isActive = activeTabName === tab.name;

                    return (
                        <Pressable
                            accessibilityLabel={tab.label}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isActive }}
                            key={tab.name}
                            onHoverIn={() => setHoveredTabName(tab.name)}
                            onHoverOut={() => setHoveredTabName(undefined)}
                            onPress={() => handlePress(tab.name)}
                            style={({ pressed }) => [
                                styles.item,
                                hoveredTabName === tab.name ? styles.itemHovered : null,
                                isActive ? styles.itemActive : null,
                                pressed ? styles.itemPressed : null,
                            ]}
                        >
                            <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                style={[styles.label, isActive ? styles.labelActive : null]}
                            >
                                {tab.label}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}
