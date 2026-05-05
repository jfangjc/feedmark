import { useState } from "react";
import { Linking, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SubscriptionCard } from "../../components/SubscriptionCard/SubscriptionCard";
import { useRssData } from "../../features/rss/RssDataProvider";
import { styles } from "./ManageScreen.styles";

export default function ManageScreen() {
    const {
        subscriptions,
        isRefreshing,
        addRssSubscription,
        removeRssSubscription,
        refreshFeeds,
    } = useRssData();
    const [feedUrl, setFeedUrl] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [message, setMessage] = useState<string | undefined>();

    async function handleAddPress() {
        const nextFeedUrl = feedUrl.trim();

        if (!nextFeedUrl || isAdding) {
            return;
        }

        setIsAdding(true);
        setMessage(undefined);

        try {
            await addRssSubscription(nextFeedUrl);
            setFeedUrl("");
        }
        catch (error) {
            setMessage(getErrorMessage(error));
        }
        finally {
            setIsAdding(false);
        }
    }

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            style={styles.screen}
            contentContainerStyle={styles.content}
        >
            <Text style={styles.title}>Manage</Text>
            <View style={styles.form}>
                <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    onChangeText={setFeedUrl}
                    onSubmitEditing={() => {
                        void handleAddPress();
                    }}
                    placeholder="https://example.com/feed.xml"
                    placeholderTextColor={styles.placeholder.color}
                    returnKeyType="done"
                    style={styles.input}
                    value={feedUrl}
                />
                <Pressable
                    accessibilityRole="button"
                    disabled={isAdding}
                    onPress={() => {
                        void handleAddPress();
                    }}
                    style={({ pressed }) => [
                        styles.primaryButton,
                        pressed || isAdding ? styles.buttonPressed : null,
                    ]}
                >
                    <Text style={styles.primaryButtonText}>{isAdding ? "Adding" : "Add"}</Text>
                </Pressable>
            </View>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <View style={styles.actions}>
                <Pressable
                    accessibilityRole="button"
                    disabled={isRefreshing}
                    onPress={() => {
                        void refreshFeeds();
                    }}
                    style={({ pressed }) => [
                        styles.secondaryButton,
                        pressed || isRefreshing ? styles.buttonPressed : null,
                    ]}
                >
                    <Text style={styles.secondaryButtonText}>{isRefreshing ? "Refreshing" : "Refresh"}</Text>
                </Pressable>
            </View>
            <View style={styles.list}>
                {subscriptions.length === 0 ? (
                    <Text style={styles.emptyText}>No RSS subscriptions saved.</Text>
                ) : null}
                {subscriptions.map((subscription) => (
                    <View key={subscription.id} style={styles.subscription}>
                        <SubscriptionCard
                            subscription={subscription}
                            onPress={() => {
                                void Linking.openURL(subscription.siteUrl ?? subscription.feedUrl);
                            }}
                        />
                        <Pressable
                            accessibilityLabel={`Remove ${subscription.title}`}
                            accessibilityRole="button"
                            onPress={() => {
                                void removeRssSubscription(subscription.id);
                            }}
                            style={({ pressed }) => [
                                styles.removeButton,
                                pressed ? styles.buttonPressed : null,
                            ]}
                        >
                            <Text style={styles.removeButtonText}>Remove</Text>
                        </Pressable>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Unable to add RSS feed.";
}
