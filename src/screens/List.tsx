import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, ActivityIndicator } from "react-native-paper";
import GameCard from "../components/GameCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ListScreenProps } from "../navigation/types";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

export default function ListScreen({ navigation }: ListScreenProps) {
  const [myList, setMyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const STORAGE_KEY = "@my_game_list";
  const loadList = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setMyList(JSON.parse(stored));
    } catch (e) {
      console.log("Erro ao carregar lista:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveList = async (list: any[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.log("Erro ao salvar lista:", e);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const removeFromList = (gameId: number) => {
    const newList = myList.filter((g) => g.id !== gameId);
    setMyList(newList);
    saveList(newList);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderBox}>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (myList.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.emptyText}>Sua lista está vazia 😢</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={myList}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 20 }}
        renderItem={({ item }) => (
          <GameCard
            item={item}
            onPress={() => navigation.navigate("Details", { gameId: item.id })}
            onAddPress={() => removeFromList(item.id)} 
          />
        )}
      />
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
  loaderBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
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