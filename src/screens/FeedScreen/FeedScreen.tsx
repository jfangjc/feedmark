import { Linking, Text, View } from "react-native";
import { EmptyList } from "../../components/EmptyList/EmptyList";
import { FeedList } from "../../components/FeedList/FeedList";
import { useRssData } from "../../features/rss/RssDataProvider";
import { styles } from "./FeedScreen.styles";

export default function FeedScreen() {
    const {
        feeds,
        subscriptions,
        isLoading,
        isRefreshing,
        statusMessage,
        refreshFeeds,
    } = useRssData();

    return (
        <View style={styles.screen}>
            <FeedList
                feeds={feeds}
                subscriptions={subscriptions}
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
                    if (entry.type === "rssItem" && entry.item.link) {
                        void Linking.openURL(entry.item.link);
                        return;
                    }

                    if (entry.type === "subscription") {
                        void Linking.openURL(entry.subscription.siteUrl ?? entry.subscription.feedUrl);
                    }
                }}
            />
        </View>
    );
}
