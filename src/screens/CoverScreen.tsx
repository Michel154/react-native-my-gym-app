import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const backgroundSource = require("../../assets/workout-background.jpg");

export const CoverScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("WorkoutScreen");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={backgroundSource}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
      <View style={styles.overlay}>
        <Text style={styles.appTitle}>My Gym App</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 30,
  },
  appTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#f9fafb",
    letterSpacing: 1,
    textAlign: "center",
  },
});
