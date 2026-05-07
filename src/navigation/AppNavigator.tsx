import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View, useWindowDimensions } from "react-native";
import { NavBar } from "../components/NavBar/NavBar";
import AllScreen from "../screens/AllScreen/AllScreen";
import FeedScreen from "../screens/FeedScreen/FeedScreen";
import ManageScreen from "../screens/ManageScreen/ManageScreen";
import SettingScreen from "../screens/SettingScreen/SettingScreen";
import { appTabs, type AppRoute } from "./routes";
import { styles } from "./AppNavigator.styles";
import { useNavigation } from "./useNavigation";

export function AppNavigator() {
    const { route } = useNavigation();
    const { width } = useWindowDimensions();
    const slideProgress = useRef(new Animated.Value(1)).current;
    const lastRouteRef = useRef(route);
    const [transition, setTransition] = useState<{
        direction: number;
        from?: AppRoute;
        to: AppRoute;
    }>({
        direction: 1,
        to: route,
    });

    useEffect(() => {
        const previousRoute = lastRouteRef.current;

        if (previousRoute.name === route.name) {
            return undefined;
        }

        const direction = getRouteIndex(route) > getRouteIndex(previousRoute) ? 1 : -1;

        slideProgress.setValue(0);
        setTransition({
            direction,
            from: previousRoute,
            to: route,
        });
        lastRouteRef.current = route;

        const animation = Animated.timing(slideProgress, {
            duration: 220,
            easing: Easing.out(Easing.cubic),
            toValue: 1,
            useNativeDriver: true,
        });

        animation.start(({ finished }) => {
            if (finished) {
                setTransition({
                    direction,
                    to: route,
                });
            }
        });

        return () => {
            animation.stop();
        };
    }, [route, slideProgress]);

    const outgoingTranslateX = slideProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -transition.direction * width],
    });
    const incomingTranslateX = slideProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [transition.direction * width, 0],
    });

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {transition.from ? (
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.screen,
                            {
                                transform: [{ translateX: outgoingTranslateX }],
                            },
                        ]}
                    >
                        {renderRoute(transition.from)}
                    </Animated.View>
                ) : null}
                <Animated.View
                    style={[
                        styles.screen,
                        {
                            transform: [{ translateX: transition.from ? incomingTranslateX : 0 }],
                        },
                    ]}
                >
                    {renderRoute(transition.to)}
                </Animated.View>
            </View>
            <View pointerEvents="box-none" style={styles.navOverlay}>
                <NavBar />
            </View>
        </View>
    );

    function renderRoute(nextRoute: AppRoute) {
        switch (nextRoute.name) {
            case "all":
                return <AllScreen />;
            case "manage":
                return <ManageScreen />;
            case "setting":
                return <SettingScreen />;
            case "feed":
            default:
                return <FeedScreen />;
        }
    }
}

function getRouteIndex(route: AppRoute): number {
    return appTabs.findIndex((tab) => tab.name === route.name);
}
