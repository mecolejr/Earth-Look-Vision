import React, { useMemo, useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { getApiUrl } from "@/lib/query-client";

import { ThemedText } from "@/components/ThemedText";
import { ScoreDisplay, ScoreBreakdown } from "@/components/ScoreDisplay";
import { Button } from "@/components/Button";
import { CostComparisonCalculator } from "@/components/CostComparisonCalculator";
import { CityDetailSkeleton } from "@/components/SkeletonLoader";
import { CommunityBadge } from "@/components/CommunityBadge";
import { CityImage } from "@/components/OptimizedImage";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius, Fonts, getScoreColor } from "@/constants/theme";
import { getCityById } from "@/data/cities";
import { getPartnersForCity } from "@/data/partners";
import { calculateCityScore, calculateAnonymousCityScore } from "@/lib/scoring";
import { AnonymousModeBanner } from "@/components/AnonymousModeBanner";
import { PartnerCard } from "@/components/PartnerCard";
import { CityWithScore, ScoreHighlight, PRIORITY_LABELS, PriorityWeights } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { addToCompareList, getCompareList } from "@/lib/storage";

interface CityDetailScreenProps {
  route: RouteProp<RootStackParamList, "CityDetail">;
  navigation: NativeStackNavigationProp<RootStackParamList, "CityDetail">;
}

interface CurrentWeather {
  temperature: number;
  temperatureUnit: string;
  shortForecast: string;
  windSpeed: string;
  humidity?: number;
  icon: string;
}

export default function CityDetailScreen({
  route,
  navigation,
}: CityDetailScreenProps) {
  const { cityId } = route.params;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { profile, isLoading, isAnonymousMode } = useUserProfile();
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const cityWithScore: CityWithScore | null = useMemo(() => {
    const city = getCityById(cityId);
    if (!city || !profile) return null;
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
  }, [cityId, profile, isAnonymousMode]);

  useEffect(() => {
    async function fetchWeather() {
      if (!cityWithScore) return;
      
      setWeatherLoading(true);
      setWeatherError(null);
      
      try {
        const lat = cityWithScore.coordinates.lat;
        const lon = cityWithScore.coordinates.lon;
        const apiUrl = getApiUrl();
        const response = await fetch(
          new URL(`/api/weather/current?lat=${lat}&lon=${lon}`, apiUrl).toString()
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch weather");
        }
        
        const data = await response.json();
        setCurrentWeather(data);
      } catch (err) {
        setWeatherError("Unable to load weather");
      } finally {
        setWeatherLoading(false);
      }
    }
    
    fetchWeather();
  }, [cityWithScore?.coordinates.lat, cityWithScore?.coordinates.lon]);

  if (isLoading) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
        contentContainerStyle={{ paddingTop: headerHeight }}
      >
        <CityDetailSkeleton />
      </ScrollView>
    );
  }

  if (!cityWithScore) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <ThemedText>City not found</ThemedText>
      </View>
    );
  }

  const handleAddToCompare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addToCompareList(cityId);
  };

  const normalizedWeights = useMemo(() => {
    if (!profile) return {};
    const total = Object.values(profile.priorities).reduce((a, b) => a + b, 0);
    const weights: Record<string, number> = {};
    for (const key of Object.keys(profile.priorities)) {
      weights[key] =
        (profile.priorities[key as keyof PriorityWeights] / total) * 100;
    }
    return weights;
  }, [profile]);

  const renderHighlight = (highlight: ScoreHighlight, index: number) => {
    const iconColor =
      highlight.type === "positive"
        ? theme.success
        : highlight.type === "warning"
        ? theme.warning
        : theme.danger;

    return (
      <View key={index} style={styles.highlightItem}>
        <View
          style={[
            styles.highlightIcon,
            { backgroundColor: iconColor + "20" },
          ]}
        >
          <Feather name={highlight.icon as any} size={16} color={iconColor} />
        </View>
        <ThemedText style={styles.highlightText}>{highlight.text}</ThemedText>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <CityImage
            cityId={cityId}
            style={styles.heroImage}
            size="large"
          />
        </View>

        <View style={styles.headerSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <ThemedText
                style={[styles.cityName, { fontFamily: Fonts?.serifBold }]}
              >
                {cityWithScore.name}
              </ThemedText>
              <ThemedText
                type="body"
                style={[styles.location, { color: theme.textSecondary }]}
              >
                {cityWithScore.state ? `${cityWithScore.state}, ` : ""}
                {cityWithScore.country}
              </ThemedText>
            </View>
            <ScoreDisplay
              score={cityWithScore.personalizedScore.overall}
              size="large"
            />
          </View>
        </View>

        {isAnonymousMode ? (
          <View style={{ paddingHorizontal: Spacing.lg }}>
            <AnonymousModeBanner />
          </View>
        ) : null}

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Why This Score?
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
          >
            Based on your identity and priorities
          </ThemedText>

          <ScoreBreakdown
            breakdown={cityWithScore.personalizedScore.breakdown}
            weights={normalizedWeights}
            labels={PRIORITY_LABELS}
          />
        </View>

        {cityWithScore.community?.isVerified ? (
          <View style={styles.communitySection}>
            <CommunityBadge community={cityWithScore.community} variant="full" />
          </View>
        ) : null}

        {cityWithScore.personalizedScore.highlights.length > 0 ? (
          <View
            style={[
              styles.section,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <ThemedText type="h4" style={styles.sectionTitle}>
              Highlights for You
            </ThemedText>
            <View style={styles.highlights}>
              {cityWithScore.personalizedScore.highlights.map(renderHighlight)}
            </View>
          </View>
        ) : null}

        {cityWithScore.personalizedScore.concerns.length > 0 ? (
          <View
            style={[
              styles.section,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <ThemedText type="h4" style={styles.sectionTitle}>
              Things to Consider
            </ThemedText>
            <View style={styles.highlights}>
              {cityWithScore.personalizedScore.concerns.map((c, i) =>
                renderHighlight(c, i + 100)
              )}
            </View>
          </View>
        ) : null}

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Demographics
          </ThemedText>

          <View style={styles.statGrid}>
            <StatItem
              label="Population"
              value={cityWithScore.population.toLocaleString()}
              theme={theme}
            />
            <StatItem
              label="LGBTQ+ Population"
              value={`${cityWithScore.demographics.lgbtqPopulation.toFixed(1)}%`}
              theme={theme}
            />
            <StatItem
              label="Median Age"
              value={`${cityWithScore.demographics.medianAge} years`}
              theme={theme}
            />
            <StatItem
              label="Cost of Living"
              value={`${cityWithScore.costOfLivingIndex} index`}
              theme={theme}
            />
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Safety & Politics
          </ThemedText>

          <View style={styles.statGrid}>
            <StatItem
              label="LGBTQ+ Protections"
              value={cityWithScore.political.lgbtqProtections ? "Yes" : "No"}
              positive={cityWithScore.political.lgbtqProtections}
              theme={theme}
            />
            <StatItem
              label="Reproductive Rights"
              value={cityWithScore.political.reproductiveRights ? "Yes" : "No"}
              positive={cityWithScore.political.reproductiveRights}
              theme={theme}
            />
            <StatItem
              label="LGBTQ+ Safety Index"
              value={`${cityWithScore.safety.lgbtqSafetyIndex}/100`}
              theme={theme}
            />
            <StatItem
              label="Progressive Score"
              value={`${cityWithScore.political.progressiveScore}/100`}
              theme={theme}
            />
          </View>
        </View>

        <View
          style={[
            styles.section,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Climate & Weather
          </ThemedText>

          {weatherLoading ? (
            <View style={styles.weatherLoading}>
              <ActivityIndicator size="small" color={theme.primary} />
              <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
                Loading current weather...
              </ThemedText>
            </View>
          ) : currentWeather ? (
            <View style={styles.currentWeatherCard}>
              <View style={styles.weatherMain}>
                <Feather name="cloud" size={32} color={theme.primary} />
                <View style={styles.weatherTemp}>
                  <ThemedText style={styles.weatherTempText}>
                    {currentWeather.temperature}°{currentWeather.temperatureUnit}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {currentWeather.shortForecast}
                  </ThemedText>
                </View>
              </View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Wind: {currentWeather.windSpeed}
              </ThemedText>
            </View>
          ) : weatherError ? (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {weatherError}
            </ThemedText>
          ) : null}

          <View style={[styles.climateMatchCard, { backgroundColor: theme.primary + "10" }]}>
            <View style={styles.climateMatchHeader}>
              <Feather name="thermometer" size={20} color={theme.primary} />
              <ThemedText type="h4" style={{ marginLeft: Spacing.sm }}>
                Climate Match
              </ThemedText>
            </View>
            <View style={styles.climateMatchScore}>
              <ThemedText style={styles.climateScoreText}>
                {cityWithScore.personalizedScore.breakdown.climate}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                /100
              </ThemedText>
            </View>
          </View>

          <View style={styles.statGrid}>
            <StatItem
              label="Average Temp"
              value={`${cityWithScore.climate.averageTemp}°F`}
              theme={theme}
            />
            <StatItem
              label="Sunny Days"
              value={`${cityWithScore.climate.sunnyDays}/year`}
              theme={theme}
            />
            <StatItem
              label="Annual Rainfall"
              value={`${cityWithScore.climate.annualRainfall}"`}
              theme={theme}
            />
            <StatItem
              label="Season Type"
              value={cityWithScore.climate.seasonType.replace(/-/g, " ")}
              theme={theme}
            />
          </View>
        </View>

        <CostComparisonCalculator targetCity={cityWithScore} />

        <PartnersSection cityId={cityId} theme={theme} />

        <View style={styles.actionButtons}>
          <Button onPress={handleAddToCompare} style={styles.addButton}>
            Add to Compare
          </Button>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("DetailedReport", { cityId });
            }}
            style={[
              styles.reportButton,
              {
                backgroundColor: theme.warning + "15",
                borderColor: theme.warning + "40",
              },
            ]}
          >
            <Feather name="file-text" size={20} color={theme.warning} />
            <ThemedText style={[styles.reportButtonText, { color: theme.warning }]}>
              Detailed Report
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("MovingChecklist", { cityId });
            }}
            style={[
              styles.checklistButton,
              {
                backgroundColor: theme.success + "15",
                borderColor: theme.success + "40",
              },
            ]}
          >
            <Feather name="check-square" size={20} color={theme.success} />
            <ThemedText style={[styles.checklistButtonText, { color: theme.success }]}>
              Moving Checklist
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  positive?: boolean;
  theme: any;
}

function StatItem({ label, value, positive, theme }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <ThemedText
        type="small"
        style={[styles.statLabel, { color: theme.textSecondary }]}
      >
        {label}
      </ThemedText>
      <ThemedText
        type="h4"
        style={[
          styles.statValue,
          positive !== undefined && {
            color: positive ? theme.success : theme.warning,
          },
        ]}
      >
        {value}
      </ThemedText>
    </View>
  );
}

interface PartnersSectionProps {
  cityId: string;
  theme: any;
}

function PartnersSection({ cityId, theme }: PartnersSectionProps) {
  const partners = getPartnersForCity(cityId);

  if (partners.length === 0) {
    return null;
  }

  return (
    <View style={styles.partnersSection}>
      <View style={styles.partnersSectionHeader}>
        <View style={[styles.partnersIcon, { backgroundColor: theme.primary + "20" }]}>
          <Feather name="users" size={20} color={theme.primary} />
        </View>
        <View style={styles.partnersHeaderText}>
          <ThemedText type="h4">Local Partners</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Verified relocation services & real estate agents
          </ThemedText>
        </View>
      </View>
      {partners.slice(0, 3).map((partner) => (
        <PartnerCard key={partner.id} partner={partner} />
      ))}
      {partners.length > 3 ? (
        <ThemedText
          type="small"
          style={[styles.morePartnersText, { color: theme.textSecondary }]}
        >
          +{partners.length - 3} more partners available
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  heroSection: {
    height: 180,
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  headerSection: {
    marginBottom: Spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  cityName: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  location: {},
  section: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    marginBottom: Spacing.lg,
  },
  highlights: {
    gap: Spacing.md,
  },
  highlightItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  highlightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  highlightText: {
    flex: 1,
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
  },
  statItem: {
    width: "45%",
  },
  statLabel: {
    marginBottom: Spacing.xs,
  },
  statValue: {},
  actionButtons: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  addButton: {},
  checklistButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  checklistButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  communitySection: {
    marginBottom: Spacing.lg,
  },
  partnersSection: {
    marginBottom: Spacing.xl,
  },
  partnersSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  partnersIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  partnersHeaderText: {
    flex: 1,
  },
  morePartnersText: {
    textAlign: "center",
    fontStyle: "italic",
    marginTop: Spacing.sm,
  },
  weatherLoading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  currentWeatherCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  weatherMain: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  weatherTemp: {
    marginLeft: Spacing.md,
  },
  weatherTempText: {
    fontSize: 28,
    fontWeight: "700",
  },
  climateMatchCard: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  climateMatchHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  climateMatchScore: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  climateScoreText: {
    fontSize: 32,
    fontWeight: "700",
  },
});
