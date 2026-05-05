import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { styles } from "./FeedmarkApp.styles";
import { RssDataProvider } from "../features/rss/RssDataProvider";
import { AppNavigator } from "../navigation/AppNavigator";
import { NavigationProvider } from "../navigation/NavigationProvider";

export default function FeedmarkApp() {
    return (
        <NavigationProvider>
            <RssDataProvider>
                <View style={styles.root}>
                    <StatusBar />
                    <AppNavigator />
                </View>
            </RssDataProvider>
        </NavigationProvider>
    );
}
