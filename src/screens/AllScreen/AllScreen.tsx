import { Text, View } from "react-native";
import { styles } from "./AllScreen.styles";

export default function AllScreen() {
    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>All</Text>
            </View>
        </View>
    );
}
