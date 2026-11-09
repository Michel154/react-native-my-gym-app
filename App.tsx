import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { CoverScreen } from "./src/screens/CoverScreen";
import { WorkoutScreen } from "./src/screens/WorkoutScreen";
import { HistoryScreen } from "./src/screens/HistoryScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { initDatabase } from "@/utils/db";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1f2937",
          borderTopColor: "#374151",
          height: 70,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-outline";
          if (route.name === "Dagbok") iconName = "add-circle-outline";
          if (route.name === "Statistik") iconName = "stats-chart-outline";
          if (route.name === "Träningslogg") iconName = "book-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dagbok" component={WorkoutScreen} />
      <Tab.Screen name="Statistik" component={StatsScreen} />
      <Tab.Screen name="Träningslogg" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CoverScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="CoverScreen" component={CoverScreen} />
        <Stack.Screen name="WorkoutScreen" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
