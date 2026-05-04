import { View } from "react-native";
import { NavBar } from "../components/NavBar/NavBar";
import AddScreen from "../screens/AddScreen/AddScreen";
import AllScreen from "../screens/AllScreen/AllScreen";
import FeedScreen from "../screens/FeedScreen/FeedScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";
import ManageScreen from "../screens/ManageScreen/ManageScreen";
import SettingScreen from "../screens/SettingScreen/SettingScreen";
import { styles } from "./AppNavigator.styles";
import { useNavigation } from "./useNavigation";

export function AppNavigator() {
    const { route } = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.content}>{renderRoute()}</View>
            <NavBar />
        </View>
    );

    function renderRoute() {
        switch (route.name) {
            case "all":
                return <AllScreen />;
            case "add":
                return <AddScreen />;
            case "manage":
                return <ManageScreen />;
            case "setting":
                return <SettingScreen />;
            case "feed":
                return <FeedScreen route={route} />;
            case "home":
            default:
                return <HomeScreen />;
        }
    }
}
