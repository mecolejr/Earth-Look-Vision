import React from "react";
import { StyleSheet, View } from "react-native";
import Slider from "@react-native-community/slider";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, Colors } from "@/constants/theme";

interface PrioritySliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

export function PrioritySlider({
  label,
  value,
  onChange,
  description,
}: PrioritySliderProps) {
  const { theme, isDark } = useTheme();

  const getValueLabel = (val: number): string => {
    if (val <= 20) return "Not Important";
    if (val <= 40) return "Slightly Important";
    if (val <= 60) return "Moderately Important";
    if (val <= 80) return "Very Important";
    return "Essential";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <View
          style={[
            styles.valueBadge,
            { backgroundColor: theme.primaryLight + "30" },
          ]}
        >
          <ThemedText
            style={[styles.valueText, { color: theme.primary }]}
          >
            {getValueLabel(value)}
          </ThemedText>
        </View>
      </View>
      {description ? (
        <ThemedText
          type="small"
          style={[styles.description, { color: theme.textSecondary }]}
        >
          {description}
        </ThemedText>
      ) : null}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={theme.primary}
        maximumTrackTintColor={isDark ? Colors.dark.border : Colors.light.border}
        thumbTintColor={theme.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing["2xl"],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  valueBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  valueText: {
    fontSize: 12,
    fontWeight: "600",
  },
  description: {
    marginBottom: Spacing.sm,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
