import React from "react";
import { View, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type Game = {
  id: number;
  name: string;
  background_image: string;
  rating: number;
  released: string;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
};

type Props = {
  item: Game;
  onPress: () => void;
  onAddPress: () => void;
};

export default function GameCard({ item, onPress, onAddPress }: Props) {
  const getPlatformIcon = (platform: string) => {
    const lower = platform.toLowerCase();
    if (lower.includes("windows") || lower.includes("pc")) return <FontAwesome5 name="windows" size={14} color="#fff" />;
    if (lower.includes("linux")) return <FontAwesome5 name="linux" size={14} color="#fff" />;
    if (lower.includes("playstation")) return <FontAwesome5 name="playstation" size={14} color="#fff" />;
    if (lower.includes("xbox")) return <FontAwesome5 name="xbox" size={14} color="#fff" />;
    if (lower.includes("switch") || lower.includes("nintendo"))
      return <MaterialCommunityIcons name="nintendo-switch" size={14} color="#fff" />;
    if (lower.includes("mac") || lower.includes("ios") || lower.includes("iphone") || lower.includes("ipad"))
      return <FontAwesome5 name="apple" size={14} color="#fff" />;
    return null;
  };

  const platformSet = new Set<string>();
  item.platforms?.forEach((p) => {
    const name = p.platform.name.toLowerCase();
    if (name.includes("windows") || name.includes("pc")) platformSet.add("Windows");
    else if (name.includes("linux")) platformSet.add("Linux");
    else if (name.includes("playstation")) platformSet.add("PlayStation");
    else if (name.includes("xbox")) platformSet.add("Xbox");
    else if (name.includes("switch") || name.includes("nintendo")) platformSet.add("Nintendo");
    else if (name.includes("mac") || name.includes("ios") || name.includes("iphone") || name.includes("ipad"))
      platformSet.add("Mac");
  });
  const groupedPlatforms = Array.from(platformSet);

  return (
    <TouchableOpacity style={styles.wrapper} onPress={onPress} activeOpacity={0.9}>
      {/* IMAGEM */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.background_image }} style={styles.image} />
        {/* botao adicionar lista */}
        <TouchableOpacity style={styles.addButton} 
        onPress={() => {
          Alert.alert(
            "Adicionar Jogo",
            `Deseja adicionar "${item.name}" à sua lista?`,
            [
              { text: "Cancelar", style: "cancel" },
              { text: "Adicionar", onPress: onAddPress }
            ]
          );
        }}>
          <FontAwesome5 name="plus" size={16} color="#fff" />
        </TouchableOpacity>
        {/* Overlay inferior com gradiente */}
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={styles.overlayBottom}>
          <Text style={styles.titleOverlay} numberOfLines={1}>
            {item.name}
          </Text>
        </LinearGradient>
      </View>

      {/* CONTEÚDO */}
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View>
            <Text style={styles.sub}>{item.released?.slice(0, 4) || "----"}</Text>
            <Text style={styles.genre} numberOfLines={1}>
              {item.genres?.map((g) => g.name).join(", ") || "Unknown Genre"}
            </Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>★ {item.rating?.toFixed(1)}</Text>
          </View>
        </View>

        {/* PLATAFORMAS */}
        <View style={styles.platforms}>
          {groupedPlatforms.map((p, idx) => (
            <View style={styles.platformItem} key={idx}>
              {getPlatformIcon(p)}
              <Text style={styles.platformText}>{p}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#1a1a1e",
    borderRadius: 15,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  addButton: {
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "rgba(123, 70, 255, 0.8)",
  padding: 6,
  borderRadius: 20,
  zIndex: 10,
  alignItems: "center",
  justifyContent: "center",
  },
  overlayBottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "50%",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  titleOverlay: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 22,
    marginBottom: 6,
    shadowColor: "#7a46ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  content: {
    padding: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    backgroundColor: "rgba(123, 70, 255, 0.41)",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: "#7a46ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  badgeText: {
    color: "#ffffffe7",
    fontWeight: "700",
    fontSize: 12,
    textShadowColor: "rgba(122, 70, 255, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  sub: {
    color: "#b0b0b0",
    fontSize: 12,
  },
  genre: {
    color: "#9ca3af",
    fontSize: 13,
    marginTop: 2,
  },
  platforms: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
});