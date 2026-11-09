import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { saveEntry } from "../utils/db";

const motivationalQuotes = [
  "Varje pass räknas. Du är 100% före de som ligger på soffan! 🔥",
  "Kroppen klarar nästan vad som helst. Det är huvudet du måste övertyga! 💪",
  "Smärta är tillfällig, stolthet är för alltid.",
  "Dagens insats är morgondagens styrka.",
  "Inga ursäkter, bara resultat! 🚀",
  "Du ångrar aldrig ett genomfört träningspass.",
];

export const WorkoutScreen = ({ navigation }: { navigation: any }) => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [randomQuote, setRandomQuote] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setRandomQuote(motivationalQuotes[randomIndex]);
  }, []);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Behörighet saknas",
        "Du behöver ge tillgång till bilder för att kunna lägga till bild.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Skriv en titel för passet!");
      return;
    }

    try {
      // Vänta in att passet sparas i den asynkrona databasen
      await saveEntry({
        date: new Date().toLocaleDateString("sv-SE", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        title,
        notes,
        mood: mood || "",
        imageUri: imageUri || undefined,
      });

      setTitle("");
      setNotes("");
      setMood(null);
      setImageUri(null);
      navigation.navigate("Träningslogg");
    } catch (error) {
      console.error("Kunde inte spara passet:", error);
      Alert.alert("Ett fel uppstod när passet skulle sparas.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Nytt Pass</Text>
            <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
              <Text style={{ fontSize: 20 }}>📷</Text>
              {imageUri && <View style={styles.imageBadge} />}
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Titel / Pass</Text>
          <TextInput
            style={styles.input}
            placeholder="Vad har du tränat idag?"
            placeholderTextColor={"#6b7280"}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.moodRow}>
            {["🔥 Grymt", "💪 Bra", "😴 Trött", "⚡ Okej"].map((item) => {
              const isSelected = mood === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.moodBtn, isSelected && styles.moodBtnActive]}
                  onPress={() => {
                    if (isSelected) {
                      setMood(null);
                    } else {
                      setMood(item);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.moodText,
                      isSelected && styles.moodTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Anteckningar / Övningar</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Skriv dina set, reps eller tankar här..."
            placeholderTextColor={"#6b7280"}
            multiline
            numberOfLines={5}
            value={notes}
            onChangeText={setNotes}
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>Spara inlägg</Text>
          </TouchableOpacity>

          <View style={styles.motivationContainer}>
            <Text style={styles.motivationTitle}> ✨</Text>
            <Text style={styles.motivationText}>"{randomQuote}"</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  scroll: {
    padding: 20,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f9fafb",
  },
  cameraBtn: {
    backgroundColor: "#1f2937",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  imageBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9ca3af",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1f2937",
    borderWidth: 1,
    borderColor: "#374151",
    borderRadius: 12,
    padding: 14,
    color: "#f9fafb",
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  moodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginTop: 12,
  },
  moodBtn: {
    flex: 1,
    backgroundColor: "#1f2937",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  moodBtnActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  moodText: {
    color: "#9ca3af",
    fontSize: 12,
    fontWeight: "600",
  },
  moodTextActive: {
    color: "#ffffff",
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },
  saveBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  motivationContainer: {
    padding: 28,
    alignItems: "center",
    marginTop: 50,
  },
  motivationTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10b981",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  motivationText: {
    fontSize: 15,
    color: "#10b981",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "600",
  },
});