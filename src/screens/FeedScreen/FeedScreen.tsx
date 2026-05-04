import { Text, View } from "react-native";
import type { AppRoute } from "../../navigation/routes";
import { styles } from "./FeedScreen.styles";

type FeedScreenProps = {
    route: Extract<AppRoute, { name: "feed" }>;
};

export default function FeedScreen({ route }: FeedScreenProps) {
    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.title}>{route.params.title ?? "Feed"}</Text>
            </View>
        </View>
    );
}
