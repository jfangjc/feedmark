import { Text, View } from "react-native";
import { styles } from "./SettingScreen.styles";

export default function SettingScreen() {
    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>Setting</Text>
            </View>
        </View>
    );
}
