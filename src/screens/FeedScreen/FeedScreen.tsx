import { Linking, Share, Text, View } from "react-native";
import { EmptyList } from "../../components/EmptyList/EmptyList";
import { FeedList } from "../../components/FeedList/FeedList";
import { useRssData } from "../../features/rss/RssDataProvider";
import { styles } from "./FeedScreen.styles";

export default function FeedScreen() {
    const {
        feeds,
        isLoading,
        isRefreshing,
        statusMessage,
        refreshFeeds,
    } = useRssData();

    return (
        <View style={styles.screen}>
            <FeedList
                feeds={feeds}
                refreshing={isRefreshing}
                onRefresh={() => {
                    void refreshFeeds();
                }}
                header={
                    <View style={styles.intro}>
                        <Text style={styles.title}>Feedmark</Text>
                        {statusMessage ? <Text style={styles.status}>{statusMessage}</Text> : null}
                    </View>
                }
                empty={
                    <EmptyList
                        title={isLoading ? "Loading feeds" : "No feeds yet"}
                        message={
                            isLoading
                                ? "Cached items and subscriptions are being loaded."
                                : "Add an RSS feed in Manage to start."
                        }
                    />
                }
                onEntryPress={(entry) => {
                    if (entry.item.link) {
                        void Linking.openURL(entry.item.link);
                    }
                }}
                onEntryShare={(entry) => {
                    const link = entry.item.link;

                    if (!link) {
                        return;
                    }

                    void Share.share({
                        title: entry.item.title,
                        message: link,
                        url: link,
                    }).catch(() => {
                        void Linking.openURL(link);
                    });
                }}
            />
        </View>
    );
}
