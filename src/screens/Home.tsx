import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, ActivityIndicator, Searchbar } from "react-native-paper";
import GameCard from "../components/GameCard";
import { HomeScreenProps } from "../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const API_KEY = "14623032330347328ccac22aded6c2fd";

export default function Home({ navigation }: HomeScreenProps) {
  const [games, setGames] = useState<any[]>([]);
  const [displayedGames, setDisplayedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  const loadGames = async () => {
    try {
      const res = await fetch(
        `https://api.rawg.io/api/games?key=${API_KEY}&page_size=40`
      );
      const data = await res.json();
      setGames(data.results || []);
      setDisplayedGames(data.results.slice(0, PAGE_SIZE));
    } catch (err) {
      console.log("Erro ao carregar jogos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const filtered = games.filter((g) =>
    g.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDisplayed = filtered.slice(0, page * PAGE_SIZE);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const renderFooter = () => {
    if (filteredDisplayed.length >= filtered.length) return null;
    return (
      <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
        <Text style={styles.loadMoreText}>Carregar mais</Text>
      </TouchableOpacity>
    );
  };
  const addToList = async (game: any) => {
  try {
    const stored = await AsyncStorage.getItem("@my_game_list");
    const currentList = stored ? JSON.parse(stored) : [];
    const alreadyAdded = currentList.some((g: any) => g.id === game.id);
    if (!alreadyAdded) {
      const newList = [...currentList, game];
      await AsyncStorage.setItem("@my_game_list", JSON.stringify(newList));
      console.log(`${game.name} adicionado à lista!`);
      Alert.alert(`"${game.name}" foi adicionado à sua lista.`); 
    } else {
      Alert.alert(`"${game.name}" já está na sua lista.`); 
    }
  } catch (e) {
    console.log("Erro ao adicionar à lista:", e);
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>RAWG - II</Text>
        <Text style={styles.subtitle}>Explorador de jogos</Text>

        {/* SEARCHBAR */}
        <Searchbar
          placeholder="Buscar jogos"
          value={query}
          onChangeText={setQuery}
          style={styles.search}
          inputStyle={{ color: "#fff" }}
          placeholderTextColor="#888"
          iconColor="#999"
        />
      </View>

      {/* LISTA */}
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <FlatList
          data={filteredDisplayed}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
          renderItem={({ item }) => (
            <GameCard
              item={item}
              onPress={() =>
                navigation.navigate("Details", { gameId: item.id })
              }
              onAddPress={() => addToList(item)
              }
            />
          )}
          ListFooterComponent={renderFooter}
        />
      )}
{/* FOOTER NAVIGATION */}
<View style={styles.footerNav}>
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => navigation.navigate("Home")}
  >
    <FontAwesome5 name="home" size={20} color="#fff" />
    <Text style={styles.navText}>Home</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.navButton}
    onPress={() => navigation.navigate("List")}
  >
    <FontAwesome5 name="list" size={20} color="#fff" />
    <Text style={styles.navText}>Lista</Text>
  </TouchableOpacity>
</View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    color: "#ffffff",
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#b0b0b0",
    marginBottom: 12,
  },
  search: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
  },
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadMoreButton: {
    marginVertical: 12,
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 22,
    backgroundColor: "#1a1d20",
    borderRadius: 50,
    borderWidth: 0.8,
    borderColor: "#4b556330",
  },
  loadMoreText: {
    color: "#e5e7ebb8",
    fontWeight: "300",
    fontSize: 12,
  },
  footerNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderTopWidth: 0.5,
    borderTopColor: "#333",
  },
  navButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});