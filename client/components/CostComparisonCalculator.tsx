import React, { useState, useMemo } from "react";
import { StyleSheet, View, TextInput, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { City } from "@/types";
import { CITIES } from "@/data/cities";

interface CostComparisonCalculatorProps {
  targetCity: City;
}

interface CostBreakdown {
  category: string;
  icon: string;
  currentCost: number;
  targetCost: number;
  difference: number;
  percentChange: number;
}

const US_AVERAGE_COL_INDEX = 100;

const COST_CATEGORIES = [
  { id: "housing", label: "Housing", icon: "home", baseMonthly: 1800, weight: 0.40 },
  { id: "groceries", label: "Groceries", icon: "shopping-cart", baseMonthly: 400, weight: 0.15 },
  { id: "transportation", label: "Transportation", icon: "truck", baseMonthly: 350, weight: 0.12 },
  { id: "utilities", label: "Utilities", icon: "zap", baseMonthly: 180, weight: 0.08 },
  { id: "healthcare", label: "Healthcare", icon: "heart", baseMonthly: 450, weight: 0.12 },
  { id: "entertainment", label: "Entertainment", icon: "coffee", baseMonthly: 250, weight: 0.08 },
  { id: "other", label: "Other", icon: "more-horizontal", baseMonthly: 200, weight: 0.05 },
];

export function CostComparisonCalculator({ targetCity }: CostComparisonCalculatorProps) {
  const { theme } = useTheme();
  const [salary, setSalary] = useState("");
  const [currentCityId, setCurrentCityId] = useState<string | null>(null);
  const [showCityPicker, setShowCityPicker] = useState(false);

  const currentCity = currentCityId ? CITIES.find(c => c.id === currentCityId) : null;

  const calculations = useMemo(() => {
    const salaryNum = parseFloat(salary.replace(/,/g, "")) || 0;
    if (!salaryNum || !currentCity) return null;

    const currentCOL = currentCity.costOfLivingIndex;
    const targetCOL = targetCity.costOfLivingIndex;
    const adjustmentRatio = targetCOL / currentCOL;

    const equivalentSalary = Math.round(salaryNum * adjustmentRatio);
    const salaryDifference = equivalentSalary - salaryNum;
    const percentChange = ((adjustmentRatio - 1) * 100);

    const breakdown: CostBreakdown[] = COST_CATEGORIES.map(cat => {
      const currentCost = Math.round(cat.baseMonthly * (currentCOL / US_AVERAGE_COL_INDEX));
      const targetCost = Math.round(cat.baseMonthly * (targetCOL / US_AVERAGE_COL_INDEX));
      return {
        category: cat.label,
        icon: cat.icon,
        currentCost,
        targetCost,
        difference: targetCost - currentCost,
        percentChange: ((targetCost - currentCost) / currentCost) * 100,
      };
    });

    const totalCurrentMonthly = breakdown.reduce((sum, b) => sum + b.currentCost, 0);
    const totalTargetMonthly = breakdown.reduce((sum, b) => sum + b.targetCost, 0);

    return {
      equivalentSalary,
      salaryDifference,
      percentChange,
      breakdown,
      totalCurrentMonthly,
      totalTargetMonthly,
      monthlyDifference: totalTargetMonthly - totalCurrentMonthly,
    };
  }, [salary, currentCity, targetCity]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatSalaryInput = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "");
    if (!digits) return "";
    return new Intl.NumberFormat("en-US").format(parseInt(digits));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      <View style={styles.header}>
        <Feather name="dollar-sign" size={20} color={theme.primary} />
        <ThemedText type="h4" style={styles.title}>
          Cost Comparison Calculator
        </ThemedText>
      </View>

      <View style={styles.inputSection}>
        <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
          Your current annual salary
        </ThemedText>
        <View style={[styles.salaryInput, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <ThemedText style={{ color: theme.textSecondary }}>$</ThemedText>
          <TextInput
            value={salary}
            onChangeText={(text) => setSalary(formatSalaryInput(text))}
            placeholder="75,000"
            placeholderTextColor={theme.textSecondary}
            keyboardType="numeric"
            style={[styles.input, { color: theme.text }]}
          />
        </View>
      </View>

      <View style={styles.inputSection}>
        <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
          Your current city
        </ThemedText>
        <Pressable
          onPress={() => setShowCityPicker(!showCityPicker)}
          style={[styles.cityPicker, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
        >
          <Feather name="map-pin" size={16} color={theme.textSecondary} />
          <ThemedText style={[styles.cityPickerText, !currentCity && { color: theme.textSecondary }]}>
            {currentCity ? `${currentCity.name}, ${currentCity.state}` : "Select your city"}
          </ThemedText>
          <Feather name={showCityPicker ? "chevron-up" : "chevron-down"} size={18} color={theme.textSecondary} />
        </Pressable>

        {showCityPicker ? (
          <Animated.View entering={FadeIn.duration(150)} style={[styles.cityList, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
            {CITIES.filter(c => c.id !== targetCity.id).map(city => (
              <Pressable
                key={city.id}
                onPress={() => {
                  setCurrentCityId(city.id);
                  setShowCityPicker(false);
                }}
                style={({ pressed }) => [
                  styles.cityOption,
                  pressed && { backgroundColor: theme.backgroundSecondary },
                  currentCityId === city.id && { backgroundColor: theme.primary + "15" },
                ]}
              >
                <ThemedText style={currentCityId === city.id ? { color: theme.primary } : undefined}>
                  {city.name}, {city.state}
                </ThemedText>
              </Pressable>
            ))}
          </Animated.View>
        ) : null}
      </View>

      {calculations ? (
        <Animated.View entering={FadeIn.duration(200)} style={styles.results}>
          <View style={[styles.summaryCard, { backgroundColor: theme.backgroundDefault }]}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              To maintain your lifestyle in {targetCity.name}, you'd need:
            </ThemedText>
            <ThemedText style={[styles.equivalentSalary, { fontFamily: Fonts.serif }]}>
              {formatCurrency(calculations.equivalentSalary)}/year
            </ThemedText>
            <View style={styles.differenceRow}>
              <Feather
                name={calculations.percentChange > 0 ? "trending-up" : "trending-down"}
                size={16}
                color={calculations.percentChange > 0 ? theme.danger : theme.success}
              />
              <ThemedText
                style={[
                  styles.differenceText,
                  { color: calculations.percentChange > 0 ? theme.danger : theme.success },
                ]}
              >
                {calculations.percentChange > 0 ? "+" : ""}
                {calculations.percentChange.toFixed(1)}% ({calculations.salaryDifference > 0 ? "+" : ""}
                {formatCurrency(calculations.salaryDifference)})
              </ThemedText>
            </View>
          </View>

          <ThemedText type="h4" style={styles.breakdownTitle}>
            Monthly Cost Breakdown
          </ThemedText>

          <View style={styles.costComparison}>
            <View style={styles.costHeader}>
              <View style={styles.costHeaderLabel} />
              <ThemedText type="small" style={[styles.costHeaderCity, { color: theme.textSecondary }]}>
                {currentCity?.name}
              </ThemedText>
              <ThemedText type="small" style={[styles.costHeaderCity, { color: theme.primary }]}>
                {targetCity.name}
              </ThemedText>
            </View>

            {calculations.breakdown.map((item) => (
              <View key={item.category} style={[styles.costRow, { borderBottomColor: theme.border }]}>
                <View style={styles.costLabel}>
                  <Feather name={item.icon as any} size={14} color={theme.textSecondary} />
                  <ThemedText type="small" style={styles.costLabelText}>
                    {item.category}
                  </ThemedText>
                </View>
                <ThemedText type="small" style={styles.costValue}>
                  {formatCurrency(item.currentCost)}
                </ThemedText>
                <View style={styles.costTargetCell}>
                  <ThemedText type="small" style={[styles.costValue, { color: theme.primary }]}>
                    {formatCurrency(item.targetCost)}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={{
                      color: item.difference > 0 ? theme.danger : theme.success,
                      fontSize: 10,
                    }}
                  >
                    {item.difference > 0 ? "+" : ""}
                    {item.percentChange.toFixed(0)}%
                  </ThemedText>
                </View>
              </View>
            ))}

            <View style={[styles.totalRow, { borderTopColor: theme.border }]}>
              <ThemedText style={styles.totalLabel}>Monthly Total</ThemedText>
              <ThemedText style={styles.totalValue}>
                {formatCurrency(calculations.totalCurrentMonthly)}
              </ThemedText>
              <ThemedText style={[styles.totalValue, { color: theme.primary }]}>
                {formatCurrency(calculations.totalTargetMonthly)}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.disclaimer, { backgroundColor: theme.warning + "15" }]}>
            <Feather name="info" size={14} color={theme.warning} />
            <ThemedText type="small" style={{ color: theme.textSecondary, flex: 1 }}>
              Estimates based on cost of living indices. Actual costs may vary based on lifestyle choices.
            </ThemedText>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  title: {
    flex: 1,
  },
  inputSection: {
    marginBottom: Spacing.md,
  },
  salaryInput: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },
  cityPicker: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 48,
    gap: Spacing.sm,
  },
  cityPickerText: {
    flex: 1,
  },
  cityList: {
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    maxHeight: 200,
    overflow: "hidden",
  },
  cityOption: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  results: {
    marginTop: Spacing.md,
  },
  summaryCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: "center",
  },
  equivalentSalary: {
    fontSize: 32,
    fontWeight: "700",
    marginVertical: Spacing.sm,
  },
  differenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  differenceText: {
    fontWeight: "600",
  },
  breakdownTitle: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  costComparison: {
    gap: Spacing.xs,
  },
  costHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: Spacing.sm,
  },
  costHeaderLabel: {
    flex: 1,
  },
  costHeaderCity: {
    width: 80,
    textAlign: "right",
  },
  costRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
  },
  costLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  costLabelText: {
    fontWeight: "500",
  },
  costValue: {
    width: 80,
    textAlign: "right",
  },
  costTargetCell: {
    width: 80,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    marginTop: Spacing.xs,
  },
  totalLabel: {
    flex: 1,
    fontWeight: "700",
  },
  totalValue: {
    width: 80,
    textAlign: "right",
    fontWeight: "700",
  },
  disclaimer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
});
