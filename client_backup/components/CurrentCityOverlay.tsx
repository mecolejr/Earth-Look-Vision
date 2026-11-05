import React, { useMemo } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { getCityById } from "@/data/cities";
import { calculateCityScore } from "@/lib/scoring";

interface CurrentCityOverlayProps {
  onPress?: () => void;
  onChangeCity?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CurrentCityOverlay({ onPress, onChangeCity }: CurrentCityOverlayProps) {
  const { theme } = useTheme();
  const { profile, currentCityId } = useUserProfile();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    translateY.value = withSpring(-2, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
  };

  const currentCityWithScore = useMemo(() => {
    if (!currentCityId || !profile) return null;
    const city = getCityById(currentCityId);
    if (!city) return null;
    
    const score = calculateCityScore(city, profile.identity, profile.priorities, profile.privacySettings);
    return { ...city, score };
  }, [currentCityId, profile]);

  if (!currentCityWithScore) {
    return (
      <AnimatedPressable
        entering={FadeInDown.duration(300).springify()}
        onPress={onChangeCity}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.emptyContainer, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }, animatedStyle]}
      >
        <View style={styles.emptyContent}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="map-pin" size={18} color={theme.primary} />
          </View>
          <View style={styles.emptyTextContainer}>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Set your current city
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.primary, fontWeight: "600" }}>
              Add for comparison context
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={18} color={theme.textSecondary} />
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      entering={FadeInDown.duration(300).springify()}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, { backgroundColor: theme.backgroundSecondary, borderColor: theme.cardBorder }, animatedStyle]}
    >
      <View style={styles.content}>
        <View style={[styles.badge, { backgroundColor: theme.primary }]}>
          <ThemedText type="small" style={styles.badgeText}>
            Your City
          </ThemedText>
        </View>
        
        <View style={styles.cityInfo}>
          <View style={styles.cityHeader}>
            <ThemedText style={styles.cityName}>
              {currentCityWithScore.name}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {currentCityWithScore.state}, {currentCityWithScore.country}
            </ThemedText>
          </View>
          
          <View style={styles.scoreContainer}>
            <ThemedText style={[styles.score, { color: theme.primary, fontFamily: Fonts.serif }]}>
              {currentCityWithScore.score.overall}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              match
            </ThemedText>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatChip
            icon="shield"
            value={currentCityWithScore.score.breakdown.safety}
            label="Safety"
            theme={theme}
          />
          <StatChip
            icon="dollar-sign"
            value={currentCityWithScore.score.breakdown.costOfLiving}
            label="Cost"
            theme={theme}
          />
          <StatChip
            icon="heart"
            value={currentCityWithScore.score.breakdown.lgbtqAcceptance}
            label="LGBTQ+"
            theme={theme}
          />
        </View>

        <Pressable 
          onPress={onChangeCity} 
          style={[styles.changeButton, { borderColor: theme.border }]}
          hitSlop={8}
        >
          <Feather name="edit-2" size={12} color={theme.textSecondary} />
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Change
          </ThemedText>
        </Pressable>
      </View>
    </AnimatedPressable>
  );
}

interface StatChipProps {
  icon: string;
  value: number;
  label: string;
  theme: any;
}

function StatChip({ icon, value, label, theme }: StatChipProps) {
  return (
    <View style={[styles.statChip, { backgroundColor: theme.backgroundDefault }]}>
      <Feather name={icon as any} size={12} color={theme.textSecondary} />
      <ThemedText type="small" style={{ fontWeight: "600" }}>
        {value}
      </ThemedText>
      <ThemedText type="small" style={{ color: theme.textSecondary, fontSize: 10 }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
  },
  emptyContainer: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    gap: Spacing.md,
  },
  emptyTextContainer: {
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.md,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginBottom: Spacing.sm,
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cityInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  cityHeader: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  scoreContainer: {
    alignItems: "flex-end",
  },
  score: {
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 32,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  statChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  changeButton: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
  },
});
