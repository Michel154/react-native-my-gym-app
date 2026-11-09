import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { getEntries, WorkoutEntry } from "../utils/db";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";

export const StatsScreen = () => {
  const [entries, setEntries] = useState<WorkoutEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, []),
  );

  const loadStats = async () => {
    const data = await getEntries();
    setEntries(data);
  };

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const passesThisMonth = entries.filter((item) => {
    const itemDate = new Date(Number(item.id));
    return (
      itemDate.getMonth() === currentMonth &&
      itemDate.getFullYear() === currentYear
    );
  }).length;

  const monthsPassed = currentMonth + 1;

  const passesThisYear = entries.filter((item) => {
    const itemDate = new Date(Number(item.id));
    return itemDate.getFullYear() === currentYear;
  }).length;

  const averagePerMonth =
    monthsPassed > 0 ? (passesThisYear / monthsPassed).toFixed(1) : "0";

  const getFullYearChartData = () => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Maj",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Okt",
      "Nov",
      "Dec",
    ];
    const passCounts: number[] = [];
    const intensityCounts: number[] = [];

    for (let m = 0; m < 12; m++) {
      const monthEntries = entries.filter((item) => {
        const itemDate = new Date(Number(item.id));
        return (
          itemDate.getMonth() === m && itemDate.getFullYear() === currentYear
        );
      });

      passCounts.push(monthEntries.length);

      let score = 0;
      monthEntries.forEach((entry) => {
        
        if (entry.mood && entry.mood.trim() !== "") {
          if (entry.mood.includes("🔥")) score += 3;
          else if (entry.mood.includes("💪")) score += 2;
          else score += 1; 
        }
      });
      intensityCounts.push(score);
    }

    const maxPass = Math.max(...passCounts, 4);

    return {
      labels: monthNames,
      datasets: [
        {
          data: passCounts,
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: intensityCounts,
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
          strokeWidth: 2,
        },
      ],
      legend: ["Antal pass", "Energi-poäng"],
      maxPass,
    };
  };

  const chartData = getFullYearChartData();
  const screenWidth = Dimensions.get("window").width - 56;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Statistik</Text>

        <View style={styles.grid}>
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: "#1e3a8a" }]}>
              <Ionicons name="trophy-outline" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.cardValue}>{passesThisMonth}</Text>
            <Text style={styles.cardLabel}>Antal pass</Text>
          </View>

          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: "#1e3a8a" }]}>
              <Ionicons name="trending-up-outline" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.cardValue}>{averagePerMonth}</Text>
            <Text style={styles.cardLabel}>Snitt per / månad</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Träningsöversikt {currentYear}</Text>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={195}
            yAxisLabel=""
            yAxisSuffix=""
            formatYLabel={(value) => Math.round(Number(value)).toString()}
            segments={4}
            chartConfig={{
              backgroundColor: "#1f2937",
              backgroundGradientFrom: "#1f2937",
              backgroundGradientTo: "#1f2937",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "3",
                strokeWidth: "2",
              },
              propsForLabels: {
                fontSize: 10,
              },
            }}
            bezier
            style={styles.chartStyle}
            fromZero={true}
          />
        </View>
      </ScrollView>
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
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#f9fafb",
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 44,
  },
  card: {
    flex: 1,
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#374151",
    alignItems: "flex-start",
  },
  iconBox: {
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#f9fafb",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 13,
    color: "#9ca3af",
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: "#1f2937",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f9fafb",
    marginBottom: 12,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 12,
    paddingRight: 18,
    marginLeft: -5,
  },
});
