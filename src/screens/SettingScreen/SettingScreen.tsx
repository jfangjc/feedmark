import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRssData } from "../../features/rss/RssDataProvider";
import { styles } from "./SettingScreen.styles";

export default function SettingScreen() {
    const { clearSubscriptions, exportSubscriptionsJson, importSubscriptionsJson } = useRssData();
    const [json, setJson] = useState("");
    const [message, setMessage] = useState<string | undefined>();

    async function handleImportPress() {
        if (!json.trim()) {
            return;
        }

        setMessage(undefined);

        try {
            await importSubscriptionsJson(json);
            setMessage("Subscriptions imported.");
        }
        catch (error) {
            setMessage(getErrorMessage(error));
        }
    }

    async function handleClearPress() {
        await clearSubscriptions();
        setJson("");
        setMessage("Subscriptions cleared.");
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Setting</Text>
            <View style={styles.actions}>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                        setJson(exportSubscriptionsJson());
                        setMessage(undefined);
                    }}
                    style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}
                >
                    <Text style={styles.buttonText}>Export JSON</Text>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                        void handleImportPress();
                    }}
                    style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}
                >
                    <Text style={styles.buttonText}>Import JSON</Text>
                </Pressable>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                        void handleClearPress();
                    }}
                    style={({ pressed }) => [styles.button, pressed ? styles.buttonPressed : null]}
                >
                    <Text style={styles.buttonText}>Clear</Text>
                </Pressable>
            </View>
            <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                multiline
                onChangeText={setJson}
                placeholder={'{ "urls": ["https://example.com/feed/"] }'}
                placeholderTextColor={styles.placeholder.color}
                style={styles.jsonInput}
                textAlignVertical="top"
                value={json}
            />
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </ScrollView>
    );
}

function getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    return "Unable to import subscriptions.";
}
