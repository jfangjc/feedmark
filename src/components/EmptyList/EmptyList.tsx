import { Text, View } from "react-native";
import { styles } from "./EmptyList.styles";

type EmptyListProps = {
    title: string;
    message?: string;
};

export function EmptyList({ title, message }: EmptyListProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
    );
}
