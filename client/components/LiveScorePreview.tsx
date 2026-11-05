import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { calculateCityScore } from "@/lib/scoring";
import { getCityById } from "@/data/cities";
import { Spacing, BorderRadius } from "@/constants/theme";

interface LiveScorePreviewProps {
  cityId?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export function LiveScorePreview({
  cityId = "san-francisco",
  showLabel = true,
  compact = false,
}: LiveScorePreviewProps) {
  const { theme } = useTheme();
  const { profile } = useUserProfile();
  
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);
  const previousScoreRef = React.useRef<number | null>(null);

  const city = getCityById(cityId);

  const score = useMemo(() => {
    if (!city || !profile) return null;
    return calculateCityScore(city, profile.identity, profile.priorities, profile.privacySettings);
  }, [city, profile]);

  useEffect(() => {
    if (score && previousScoreRef.current !== null && previousScoreRef.current !== score.overall) {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      pulseOpacity.value = withSequence(
        withTiming(1, { duration: 100 }),
        withTiming(0, { duration: 400 })
      );
    }
    if (score) {
      previousScoreRef.current = score.overall;
    }
  }, [score?.overall]);

  const animatedScoreStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedPulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  if (!city || !score) {
    return null;
  }

  const getScoreColor = (value: number) => {
    if (value >= 80) return theme.success;
    if (value >= 60) return theme.warning;
    return theme.danger;
  };

  const scoreColor = getScoreColor(score.overall);

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: theme.backgroundSecondary }]}>
        <View style={styles.compactContent}>
          <Feather name="map-pin" size={14} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {city.name}
          </ThemedText>
        </View>
        <View style={styles.compactScoreWrapper}>
          <Animated.View style={[styles.compactPulse, { backgroundColor: scoreColor }, animatedPulseStyle]} />
          <Animated.View style={animatedScoreStyle}>
            <ThemedText style={[styles.compactScore, { color: scoreColor }]}>
              {Math.round(score.overall)}
            </ThemedText>
          </Animated.View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>/100</ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
      {showLabel ? (
        <View style={styles.labelRow}>
          <Feather name="zap" size={14} color={theme.primary} />
          <ThemedText type="small" style={[styles.label, { color: theme.primary }]}>
            Live Preview
          </ThemedText>
        </View>
      ) : null}
      
      <View style={styles.cityRow}>
        <View style={styles.cityInfo}>
          <ThemedText type="h4">{city.name}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {city.state}, {city.country}
          </ThemedText>
        </View>
        
        <View style={styles.scoreWrapper}>
          <Animated.View 
            style={[
              styles.pulseBg, 
              { backgroundColor: scoreColor },
              animatedPulseStyle,
            ]} 
          />
          <Animated.View style={animatedScoreStyle}>
            <ThemedText style={[styles.score, { color: scoreColor }]}>
              {Math.round(score.overall)}
            </ThemedText>
          </Animated.View>
          <ThemedText type="small" style={[styles.scoreLabel, { color: theme.textSecondary }]}>
            /100 match
          </ThemedText>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.breakdownRow}>
        <BreakdownItem
          label="Safety"
          value={score.breakdown.safety}
          theme={theme}
        />
        <BreakdownItem
          label="LGBTQ+"
          value={score.breakdown.lgbtqAcceptance}
          theme={theme}
        />
        <BreakdownItem
          label="Diversity"
          value={score.breakdown.diversityInclusion}
          theme={theme}
        />
        <BreakdownItem
          label="Cost"
          value={score.breakdown.costOfLiving}
          theme={theme}
        />
      </View>

      <ThemedText type="small" style={[styles.hint, { color: theme.textSecondary }]}>
        Scores update as you make selections
      </ThemedText>
    </View>
  );
}

interface BreakdownItemProps {
  label: string;
  value: number;
  theme: any;
}

function BreakdownItem({ label, value, theme }: BreakdownItemProps) {
  const getColor = (v: number) => {
    if (v >= 80) return theme.success;
    if (v >= 60) return theme.warning;
    return theme.danger;
  };

  return (
    <View style={styles.breakdownItem}>
      <ThemedText type="small" style={{ color: theme.textSecondary }}>
        {label}
      </ThemedText>
      <ThemedText style={[styles.breakdownValue, { color: getColor(value) }]}>
        {Math.round(value)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  label: {
    marginLeft: Spacing.xs,
    fontWeight: "600",
  },
  cityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cityInfo: {
    flex: 1,
  },
  scoreWrapper: {
    alignItems: "flex-end",
    position: "relative",
  },
  pulseBg: {
    position: "absolute",
    top: -8,
    right: -8,
    bottom: -8,
    left: -8,
    borderRadius: BorderRadius.md,
    opacity: 0.2,
  },
  score: {
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 42,
  },
  scoreLabel: {
    marginTop: -4,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  breakdownItem: {
    alignItems: "center",
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  hint: {
    textAlign: "center",
    marginTop: Spacing.md,
    fontStyle: "italic",
  },
  compactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  compactContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  compactScoreWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    position: "relative",
  },
  compactPulse: {
    position: "absolute",
    top: -4,
    right: -4,
    bottom: -4,
    left: -4,
    borderRadius: BorderRadius.sm,
  },
  compactScore: {
    fontSize: 20,
    fontWeight: "700",
  },
});
