import { Pressable, Text, View } from "react-native";
import type { FeedSubscription } from "../../features/subscriptions/types";
import { getHostnameLabel } from "../../utils/url";
import { styles } from "./SubscriptionCard.styles";

type SubscriptionCardProps = {
    subscription: FeedSubscription;
    onPress?: () => void;
};

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
    return (
        <Pressable
            accessibilityLabel={`Open ${subscription.title}`}
            accessibilityRole={onPress ? "button" : undefined}
            onPress={onPress}
            style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
        >
            <View style={styles.header}>
                <Text numberOfLines={1} style={styles.title}>
                    {subscription.title}
                </Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>RSS</Text>
                </View>
            </View>
            <Text numberOfLines={1} style={styles.url}>
                {getHostnameLabel(subscription.feedUrl)}
            </Text>
        </Pressable>
    );
}
