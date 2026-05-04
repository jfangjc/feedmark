import { Text, View } from "react-native";
import { styles } from "./ManageScreen.styles";

export default function ManageScreen() {
    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>Manage</Text>
            </View>
        </View>
    );
}
