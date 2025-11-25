import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, ActivityIndicator, Searchbar } from "react-native-paper";
import GameCard from "../components/GameCard";
import { HomeScreenProps } from "../navigation/types";

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
            />
          )}
          ListFooterComponent={renderFooter}
        />
      )}
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
});