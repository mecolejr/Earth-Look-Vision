import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { EmptyState } from "@/components/EmptyState";
import { ScoreDisplay, ScoreBar } from "@/components/ScoreDisplay";
import { CompareListSkeleton } from "@/components/SkeletonLoader";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius, getScoreColor } from "@/constants/theme";
import { CITIES, getCityById } from "@/data/cities";
import { calculateCityScore, calculateAnonymousCityScore } from "@/lib/scoring";
import { AnonymousModeBanner } from "@/components/AnonymousModeBanner";
import {
  getCompareList,
  removeFromCompareList,
  clearCompareList,
} from "@/lib/storage";
import { CityWithScore, PRIORITY_LABELS, PriorityWeights } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_WIDTH = (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.md) / 2;

export default function CompareScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    profile,
    isLoading: profileLoading,
    isAnonymousMode,
  } = useUserProfile();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCompareList();
  }, []);

  const loadCompareList = async () => {
    const list = await getCompareList();
    setCompareList(list);
    setIsLoading(false);
  };

  const citiesWithScores: CityWithScore[] = useMemo(() => {
    if (!profile) return [];
    return compareList
      .map((id) => {
        const city = getCityById(id);
        if (!city) return null;
        return {
          ...city,
          personalizedScore: isAnonymousMode
            ? calculateAnonymousCityScore(city)
            : calculateCityScore(
                city,
                profile.identity,
                profile.priorities,
                profile.privacySettings
              ),
        };
      })
      .filter(Boolean) as CityWithScore[];
  }, [compareList, profile, isAnonymousMode]);

  const handleRemoveCity = async (cityId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await removeFromCompareList(cityId);
    setCompareList((prev) => prev.filter((id) => id !== cityId));
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear All Cities",
      "This will remove all cities from your comparison list. You can add them back from the Explore tab.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearCompareList();
            setCompareList([]);
          },
        },
      ]
    );
  };

  const handleCityPress = (cityId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("CityDetail", { cityId });
  };

  if (isLoading || profileLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <View
          style={[
            styles.loadingContainer,
            { paddingTop: headerHeight + Spacing.lg },
          ]}
        >
          <CompareListSkeleton count={2} />
        </View>
      </View>
    );
  }

  if (citiesWithScores.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <EmptyState
          image={require("../../assets/images/empty-compare.png")}
          title="Compare cities side-by-side"
          description="Add cities from the Explore tab to compare their scores and see which one is the best match for you."
        />
      </View>
    );
  }

  const comparisonCategories = Object.keys(
    PRIORITY_LABELS
  ) as Array<keyof PriorityWeights>;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText type="h4">
            Comparing {citiesWithScores.length} cities
          </ThemedText>
          <Pressable onPress={handleClearAll}>
            <ThemedText type="small" style={{ color: theme.danger }}>
              Clear All
            </ThemedText>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.citiesRow}
        >
          {citiesWithScores.map((city) => (
            <Pressable
              key={city.id}
              onPress={() => handleCityPress(city.id)}
              style={({ pressed }) => [
                styles.cityColumn,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.cardBorder,
                },
                pressed && styles.cityColumnPressed,
              ]}
            >
              <Pressable
                onPress={() => handleRemoveCity(city.id)}
                style={[
                  styles.removeButton,
                  { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather name="x" size={16} color={theme.textSecondary} />
              </Pressable>

              <ThemedText type="h4" style={styles.cityName}>
                {city.name}
              </ThemedText>
              <ThemedText
                type="small"
                style={[styles.cityLocation, { color: theme.textSecondary }]}
              >
                {city.state ? `${city.state}, ` : ""}
                {city.country}
              </ThemedText>

              <View style={styles.scoreContainer}>
                <ScoreDisplay
                  score={city.personalizedScore.overall}
                  size="medium"
                />
              </View>

              <View style={styles.breakdown}>
                {comparisonCategories.map((category) => {
                  const score = city.personalizedScore.breakdown[category];
                  const scoreColor = getScoreColor(score);
                  return (
                    <View key={category} style={styles.categoryRow}>
                      <ThemedText
                        type="small"
                        style={[
                          styles.categoryLabel,
                          { color: theme.textSecondary },
                        ]}
                        numberOfLines={1}
                      >
                        {PRIORITY_LABELS[category]}
                      </ThemedText>
                      <View
                        style={[
                          styles.categoryScore,
                          { backgroundColor: scoreColor + "20" },
                        ]}
                      >
                        <ThemedText
                          type="small"
                          style={{ color: scoreColor, fontWeight: "600" }}
                        >
                          {Math.round(score)}
                        </ThemedText>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View
                style={[
                  styles.viewDetailsRow,
                  { borderTopColor: theme.border },
                ]}
              >
                <ThemedText
                  type="small"
                  style={[styles.viewDetailsText, { color: theme.primary }]}
                >
                  View Details
                </ThemedText>
                <Feather name="chevron-right" size={14} color={theme.primary} />
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.insights}>
          <ThemedText type="h4" style={styles.insightsTitle}>
            Key Differences
          </ThemedText>
          {citiesWithScores.length >= 2 ? (
            <>
              {/* Best Overall is always first */}
              <InsightRow
                label="Best Overall Match"
                value={
                  [...citiesWithScores].sort(
                    (a, b) =>
                      b.personalizedScore.overall - a.personalizedScore.overall
                  )[0].name
                }
                theme={theme}
              />
              {/* Remaining rows driven by user's top-weighted priorities */}
              {profile &&
                Object.entries(profile.priorities)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([key]) => {
                    const category = key as keyof PriorityWeights;
                    const winner = [...citiesWithScores].sort(
                      (a, b) =>
                        b.personalizedScore.breakdown[category] -
                        a.personalizedScore.breakdown[category]
                    )[0];
                    return (
                      <InsightRow
                        key={category}
                        label={`Best: ${PRIORITY_LABELS[category]}`}
                        value={winner.name}
                        theme={theme}
                      />
                    );
                  })}
            </>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function InsightRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: any;
}) {
  return (
    <View style={styles.insightRow}>
      <ThemedText
        type="small"
        style={[styles.insightLabel, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
      <ThemedText type="body" style={styles.insightValue}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    paddingHorizontal: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  citiesRow: {
    gap: Spacing.md,
  },
  cityColumn: {
    width: COLUMN_WIDTH,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    position: "relative",
  },
  cityColumnPressed: {
    opacity: 0.75,
  },
  removeButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cityName: {
    marginBottom: Spacing.xs,
    paddingRight: Spacing["2xl"],
  },
  cityLocation: {},
  scoreContainer: {
    alignItems: "center",
    marginVertical: Spacing.lg,
  },
  breakdown: {
    gap: Spacing.sm,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryLabel: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  categoryScore: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    minWidth: 36,
    alignItems: "center",
  },
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    gap: Spacing.xs,
  },
  viewDetailsText: {
    fontWeight: "600",
  },
  insights: {
    marginTop: Spacing["2xl"],
  },
  insightsTitle: {
    marginBottom: Spacing.lg,
  },
  insightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  insightLabel: {},
  insightValue: {
    fontWeight: "600",
  },
});
