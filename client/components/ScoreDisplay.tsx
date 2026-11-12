import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, getScoreColor } from "@/constants/theme";

interface ScoreDisplayProps {
  score: number;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

export function ScoreDisplay({
  score,
  size = "medium",
  showLabel = true,
}: ScoreDisplayProps) {
  const { theme } = useTheme();
  const scoreColor = getScoreColor(score);

  const dimensions = {
    small: { container: 48, fontSize: 18 },
    medium: { container: 72, fontSize: 28 },
    large: { container: 100, fontSize: 36 },
  }[size];

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            width: dimensions.container,
            height: dimensions.container,
            backgroundColor: scoreColor + "20",
            borderColor: scoreColor,
          },
        ]}
      >
        <ThemedText
          style={[
            styles.score,
            { fontSize: dimensions.fontSize, color: scoreColor },
          ]}
        >
          {score}
        </ThemedText>
      </View>
      {showLabel ? (
        <ThemedText
          type="small"
          style={[styles.label, { color: theme.textSecondary }]}
        >
          Your Match
        </ThemedText>
      ) : null}
    </View>
  );
}

interface ScoreBarProps {
  label: string;
  score: number;
  weight?: number;
  showWeight?: boolean;
}

export function ScoreBar({
  label,
  score,
  weight,
  showWeight = false,
}: ScoreBarProps) {
  const { theme } = useTheme();
  const scoreColor = getScoreColor(score);

  const animatedWidth = useAnimatedStyle(() => ({
    width: withTiming(`${score}%`, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <View style={styles.barContainer}>
      <View style={styles.barHeader}>
        <ThemedText style={styles.barLabel}>{label}</ThemedText>
        <View style={styles.barValues}>
          {showWeight && weight !== undefined ? (
            <ThemedText
              type="caption"
              style={[styles.weight, { color: theme.textSecondary }]}
            >
              ({Math.round(weight)}% weight)
            </ThemedText>
          ) : null}
          <ThemedText style={[styles.barScore, { color: scoreColor }]}>
            {Math.round(score)}
          </ThemedText>
        </View>
      </View>
      <View
        style={[styles.barTrack, { backgroundColor: theme.backgroundSecondary }]}
      >
        <Animated.View
          style={[
            styles.barFill,
            { backgroundColor: scoreColor },
            animatedWidth,
          ]}
        />
      </View>
    </View>
  );
}

interface ScoreBreakdownProps {
  breakdown: Record<string, number>;
  weights?: Record<string, number>;
  labels?: Record<string, string>;
}

export function ScoreBreakdown({
  breakdown,
  weights,
  labels,
}: ScoreBreakdownProps) {
  const displayLabels: Record<string, string> = labels || {
    safety: "Safety",
    lgbtqAcceptance: "LGBTQ+ Acceptance",
    diversityInclusion: "Diversity & Inclusion",
    costOfLiving: "Cost of Living",
    jobMarket: "Job Market",
    healthcare: "Healthcare",
    climate: "Climate",
    publicTransit: "Public Transit",
    culturalInstitutions: "Cultural Fit",
    politicalAlignment: "Political Alignment",
  };

  const sortedKeys = Object.keys(breakdown).sort(
    (a, b) => (weights?.[b] || 0) - (weights?.[a] || 0)
  );

  return (
    <View style={styles.breakdownContainer}>
      {sortedKeys.map((key) => (
        <ScoreBar
          key={key}
          label={displayLabels[key] || key}
          score={breakdown[key]}
          weight={weights?.[key]}
          showWeight={!!weights}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  container: {
    borderRadius: BorderRadius.full,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  score: {
    fontWeight: "700",
  },
  label: {
    marginTop: Spacing.xs,
  },
  barContainer: {
    marginBottom: Spacing.lg,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  barValues: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  weight: {
    fontSize: 11,
  },
  barScore: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 28,
    textAlign: "right",
  },
  barTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  breakdownContainer: {
    marginTop: Spacing.lg,
  },
});
