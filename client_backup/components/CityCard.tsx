import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { CommunityBadge } from "@/components/CommunityBadge";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { CityImage } from "@/components/OptimizedImage";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, getScoreColor } from "@/constants/theme";
import { CityWithScore, ScoreHighlight } from "@/types";

interface CityCardProps {
  city: CityWithScore;
  onPress?: () => void;
  onComparePress?: () => void;
  isInCompareList?: boolean;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CityCard({
  city,
  onPress,
  onComparePress,
  isInCompareList = false,
  index = 0,
}: CityCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const scoreColor = getScoreColor(city.personalizedScore.overall);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
    translateY.value = withSpring(-3, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
  };

  const handleComparePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComparePress?.();
  };

  const renderHighlight = (highlight: ScoreHighlight, index: number) => {
    const iconColor =
      highlight.type === "positive"
        ? theme.success
        : highlight.type === "warning"
        ? theme.warning
        : theme.danger;

    return (
      <View key={index} style={styles.highlightItem}>
        <Feather
          name={highlight.icon as any}
          size={14}
          color={iconColor}
        />
        <ThemedText
          type="small"
          style={[styles.highlightText, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {highlight.text}
        </ThemedText>
      </View>
    );
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
        animatedStyle,
      ]}
    >
      <View style={styles.imageContainer}>
        <CityImage
          cityId={city.id}
          style={styles.image}
          size="medium"
          index={index}
        />
        <View style={styles.imageOverlay}>
          <Pressable
            onPress={handleComparePress}
            style={[
              styles.compareButton,
              {
                backgroundColor: isInCompareList
                  ? theme.primary
                  : theme.backgroundDefault + "E0",
              },
            ]}
          >
            <Feather
              name={isInCompareList ? "check" : "plus"}
              size={18}
              color={isInCompareList ? theme.buttonText : theme.text}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleRow}>
              <ThemedText type="h4" style={styles.cityName}>
                {city.name}
              </ThemedText>
              {city.sponsored?.isSponsored ? (
                <View style={styles.sponsoredBadgeContainer}>
                  <SponsoredBadge size="small" />
                </View>
              ) : null}
            </View>
            <ThemedText
              type="small"
              style={[styles.location, { color: theme.textSecondary }]}
            >
              {city.state ? `${city.state}, ` : ""}
              {city.country}
            </ThemedText>
          </View>

          <View
            style={[
              styles.scoreContainer,
              { backgroundColor: scoreColor + "20", borderColor: scoreColor },
            ]}
          >
            <ThemedText style={[styles.score, { color: scoreColor }]}>
              {city.personalizedScore.overall}
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.scoreLabel, { color: scoreColor }]}
            >
              Match
            </ThemedText>
          </View>
        </View>

        <View style={styles.highlights}>
          {city.personalizedScore.highlights.slice(0, 3).map(renderHighlight)}
        </View>

        {city.personalizedScore.concerns.length > 0 ? (
          <View style={styles.concerns}>
            {city.personalizedScore.concerns.slice(0, 1).map((concern, i) =>
              renderHighlight(concern, i + 10)
            )}
          </View>
        ) : null}

        {city.community?.isVerified ? (
          <View style={styles.communityBadgeContainer}>
            <CommunityBadge community={city.community} variant="compact" />
          </View>
        ) : null}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  imageContainer: {
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    top: Spacing.md,
    right: Spacing.md,
  },
  compareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cityName: {},
  location: {},
  scoreContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    minWidth: 64,
  },
  score: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 28,
  },
  scoreLabel: {
    fontWeight: "600",
    marginTop: -2,
  },
  highlights: {
    gap: Spacing.xs,
  },
  concerns: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  highlightText: {
    flex: 1,
  },
  communityBadgeContainer: {
    marginTop: Spacing.md,
    alignSelf: "flex-start",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: Spacing.xs,
  },
  sponsoredBadgeContainer: {
    marginLeft: Spacing.sm,
  },
});
