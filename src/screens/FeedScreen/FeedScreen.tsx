import { Linking, Text, View } from "react-native";
import { EmptyList } from "../../components/EmptyList/EmptyList";
import { FeedList } from "../../components/FeedList/FeedList";
import type { RssFeed } from "../../features/rss/types";
import type { FeedSubscription } from "../../features/subscriptions/types";
import { styles } from "./FeedScreen.styles";

const feeds: RssFeed[] = [];
const subscriptions: FeedSubscription[] = [];

export default function FeedScreen() {
    return (
        <View style={styles.screen}>
            <FeedList
                feeds={feeds}
                subscriptions={subscriptions}
                header={
                    <View style={styles.intro}>
                        <Text style={styles.title}>Feedmark</Text>
                    </View>
                }
                empty={<EmptyList title="No feeds yet" />}
                onEntryPress={(entry) => {
                    if (entry.type === "rssItem" && entry.item.link) {
                        void Linking.openURL(entry.item.link);
                    }
                }}
            />
        </View>
    );
}
