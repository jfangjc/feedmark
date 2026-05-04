import { Pressable, Text, View } from "react-native";
import { appTabs, createTabRoute, getActiveTabName, type AppTabRouteName } from "../../navigation/routes";
import { useNavigation } from "../../navigation/useNavigation";
import { styles } from "./NavBar.styles";

export function NavBar() {
    const navigation = useNavigation();
    const activeTabName = getActiveTabName(navigation.route);

    function handlePress(tabName: AppTabRouteName) {
        navigation.reset(createTabRoute(tabName));
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {appTabs.map((tab) => {
                    const isActive = activeTabName === tab.name;

                    return (
                        <Pressable
                            accessibilityLabel={tab.label}
                            accessibilityRole="tab"
                            accessibilityState={{ selected: isActive }}
                            key={tab.name}
                            onPress={() => handlePress(tab.name)}
                            style={({ pressed }) => [
                                styles.item,
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
