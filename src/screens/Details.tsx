import React, { useEffect, useState } from "react";
import { View, Image, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { DetailsScreenProps } from "../navigation/types";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

type Platform = {
  platform: { name: string };
};

type Creator = {
  name: string;
};

type GameDetails = {
  name: string;
  background_image: string;
  released: string;
  rating: number;
  genres: { name: string }[];
  platforms: Platform[];
  description_raw: string;
  developers: Creator[];
};

export default function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  const { gameId } = route.params;

  const [details, setDetails] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await fetch(
        `https://api.rawg.io/api/games/${gameId}?key=14623032330347328ccac22aded6c2fd`
      );
      const json = await res.json();
      setDetails({
        ...json,
        description_raw: json.description_raw || "",
      });
    } catch (e) {
      console.warn("fetchDetails error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [gameId]);

  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes("windows") || lower.includes("pc")) return <FontAwesome5 name="windows" size={14} color="#fff" />;
    if (lower.includes("linux")) return <FontAwesome5 name="linux" size={14} color="#fff" />;
    if (lower.includes("playstation")) return <FontAwesome5 name="playstation" size={14} color="#fff" />;
    if (lower.includes("xbox")) return <FontAwesome5 name="xbox" size={14} color="#fff" />;
    if (lower.includes("switch") || lower.includes("nintendo")) return <MaterialCommunityIcons name="nintendo-switch" size={14} color="#fff" />;
    if (lower.includes("mac") || lower.includes("ios") || lower.includes("iphone") || lower.includes("ipad")) return <FontAwesome5 name="apple" size={14} color="#fff" />;
    return null;
  };

  if (loading || !details) {
    return (
      <SafeAreaView style={styles.loaderBox}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  const platformSet = new Set<string>();
  details.platforms?.forEach((p) => {
    const name = p.platform.name.toLowerCase();
    if (name.includes("windows") || name.includes("pc")) platformSet.add("Windows");
    else if (name.includes("linux")) platformSet.add("Linux");
    else if (name.includes("playstation")) platformSet.add("PlayStation");
    else if (name.includes("xbox")) platformSet.add("Xbox");
    else if (name.includes("switch") || name.includes("nintendo")) platformSet.add("Nintendo");
    else if (name.includes("mac") || name.includes("ios") || name.includes("iphone") || name.includes("ipad")) platformSet.add("Mac");
  });
  const groupedPlatforms = Array.from(platformSet);

  const shortDescription =
    details.description_raw.length > 300
      ? details.description_raw.slice(0, 300) + "..."
      : details.description_raw;

  return (
    <SafeAreaView style={styles.safe}>
      {/* SETA DE VOLTAR */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios" size={24} color="#7a46ff" />
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        {/* IMAGEM COM TÍTULO */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: details.background_image }} style={styles.image} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.overlayBottom}
          >
            <Text style={styles.titleOverlay} numberOfLines={2}>
              {details.name}
            </Text>
          </LinearGradient>
        </View>

        {/* INFORMAÇÕES */}
        <View style={styles.info}>
          <View style={styles.infoRow}>
            <Text style={styles.sub}>{details.released?.slice(0, 4) || "----"}</Text>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {details.rating?.toFixed(1)}</Text>
            </View>
          </View>

          <Text style={styles.genre}>
            Gêneros: {details.genres.map((g) => g.name).join(", ")}
          </Text>

          <View style={styles.platforms}>
            {groupedPlatforms.map((p, idx) => (
              <View style={styles.platformItem} key={idx}>
                {getPlatformIcon(p)}
                <Text style={styles.platformText}>{p}</Text>
              </View>
            ))}
          </View>

          {details.description_raw && (
            <View>
              <Text style={styles.description}>
                {showFullDescription ? details.description_raw : shortDescription}
              </Text>
              {details.description_raw.length > 300 && (
                <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                  <Text style={styles.readMore}>{showFullDescription ? "Leia menos" : "Leia mais"}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {details.developers?.length > 0 && (
            <Text style={styles.creators}>
              Developers: {details.developers.map((d) => d.name).join(", ")}
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#121212",
  },
  backButton: {
  flexDirection: "row",
  alignItems: "center",
  top: 20,
  left: 20,
  zIndex: 10,
  },
  backButtonText: {
    fontSize: 14,
    color: "#7a46ff",
    fontWeight: "500",
    marginLeft: 1,
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  titleOverlay: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 22,
    shadowColor: "#7a46ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  info: {
    marginBottom: 0,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  sub: {
    color: "#b0b0b0",
    fontSize: 14,
  },
  genre: {
    color: "#9ca3af",
    fontSize: 14,
    marginBottom: 12,
  },
  description: {
    color: "#d0d0d0",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  readMore: {
    color: "#7a46ff",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  creators: {
    color: "#b0b0b0",
    fontSize: 13,
    marginBottom: 12,
  },
  platforms: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  platformItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
    gap: 4,
  },
  platformText: {
    color: "#c0c0c0",
    fontSize: 11,
  },
  ratingBadge: {
    backgroundColor: "rgba(123, 70, 255, 0.4)",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#7a46ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  ratingText: {
    color: "#ffffffe7",
    fontWeight: "700",
    fontSize: 14,
    textShadowColor: "rgba(122, 70, 255,0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
});