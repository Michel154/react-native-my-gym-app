import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getEntries, deleteEntry, WorkoutEntry } from "../utils/db";

export const HistoryScreen = () => {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);

  const loadData = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert("Ta bort", "Vill du radera det här inlägget?", [
      { text: "Avbryt", style: "cancel" },
      {
        text: "Radera",
        style: "destructive",
        onPress: async () => {
          await deleteEntry(id);
          loadData();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: WorkoutEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.date}>{item.date}</Text>

        {item.mood && item.mood.trim() !== "" && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.mood}</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{item.title}</Text>
      {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={16} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Träningslogg</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Inga sparade inlägg ännu.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f9fafb",
    marginVertical: 20,
  },
  list: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  date: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "700",
  },
  badge: {
    backgroundColor: "#374151",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#f9fafb",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    color: "#f9fafb",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  notes: {
    color: "#d1d5db",
    fontSize: 14,
    lineHeight: 20,
  },
  deleteBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  empty: {
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 50,
    fontSize: 14,
  },
});
