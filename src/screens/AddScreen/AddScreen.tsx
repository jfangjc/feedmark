import { Text, View } from "react-native";
import { styles } from "./AddScreen.styles";

export default function AddScreen() {
    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>Add</Text>
            </View>
        </View>
    );
}
