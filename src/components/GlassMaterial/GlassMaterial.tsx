import { Image, View, type ImageSourcePropType } from "react-native";
import { theme } from "../../styles/theme";
import { styles } from "./GlassMaterial.styles";

type GlassMaterialVariant = "card" | "pill";

type GlassMaterialProps = {
    blurSource?: ImageSourcePropType;
    blurRadius?: number;
    variant?: GlassMaterialVariant;
};

export function GlassMaterial({
    blurSource,
    blurRadius = 28,
    variant = "card",
}: GlassMaterialProps) {
    const radius = variant === "pill" ? 999 : theme.radii.md;

    return (
        <View
            pointerEvents="none"
            style={[
                styles.material,
                variant === "pill" ? styles.materialPill : null,
                { borderRadius: radius },
            ]}
        >
            {blurSource ? (
                <Image
                    blurRadius={blurRadius}
                    resizeMode="cover"
                    source={blurSource}
                    style={styles.blurredSource}
                />
            ) : null}
            <View style={styles.haze} />
            <View style={[styles.refractedCenter, { borderRadius: radius }]} />
            <View style={styles.topHighlight} />
            <View style={styles.leftHighlight} />
            <View style={styles.rightShade} />
            <View style={styles.bottomShade} />
            <View style={[styles.innerEdge, { borderRadius: radius }]} />
            <View style={styles.specularSpot} />
        </View>
    );
}
