import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getCityById } from "@/data/cities";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { usePremium } from "@/contexts/PremiumContext";
import { calculateCityScore } from "@/lib/scoring";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

interface DetailedReportScreenProps {
  route: RouteProp<RootStackParamList, "DetailedReport">;
}

const NEIGHBORHOOD_DATA: Record<string, { name: string; vibe: string; score: number }[]> = {
  "san-francisco": [
    { name: "Castro", vibe: "LGBTQ+ hub, vibrant nightlife", score: 95 },
    { name: "Mission District", vibe: "Diverse, artistic, affordable", score: 88 },
    { name: "Hayes Valley", vibe: "Trendy, walkable, boutiques", score: 82 },
    { name: "Noe Valley", vibe: "Family-friendly, quiet streets", score: 79 },
  ],
  "new-york": [
    { name: "Chelsea", vibe: "LGBTQ+ friendly, art galleries", score: 92 },
    { name: "Park Slope", vibe: "Progressive, family-oriented", score: 89 },
    { name: "Harlem", vibe: "Cultural hub, diverse community", score: 85 },
    { name: "Jackson Heights", vibe: "Most diverse zip in US", score: 94 },
  ],
  "seattle": [
    { name: "Capitol Hill", vibe: "LGBTQ+ center, nightlife", score: 93 },
    { name: "Central District", vibe: "Historic Black community", score: 82 },
    { name: "Beacon Hill", vibe: "Diverse, affordable, transit", score: 80 },
    { name: "Fremont", vibe: "Quirky, artistic, progressive", score: 78 },
  ],
};

const LOCAL_RESOURCES: Record<string, { category: string; items: string[] }[]> = {
  "san-francisco": [
    { category: "LGBTQ+ Organizations", items: ["SF LGBT Center", "GLIDE Memorial", "Transgender Law Center"] },
    { category: "Community Groups", items: ["BAPAC", "API Equality", "NAACP SF Branch"] },
    { category: "Healthcare", items: ["Lyon-Martin Health", "SF AIDS Foundation", "UCSF Gender Clinic"] },
  ],
  "new-york": [
    { category: "LGBTQ+ Organizations", items: ["The Center NYC", "Ali Forney Center", "SAGE NYC"] },
    { category: "Community Groups", items: ["National Action Network", "Hispanic Federation", "AAFE"] },
    { category: "Healthcare", items: ["Callen-Lorde", "Housing Works", "Apicha CHC"] },
  ],
  "seattle": [
    { category: "LGBTQ+ Organizations", items: ["Lambert House", "Seattle Counseling", "Gender Justice League"] },
    { category: "Community Groups", items: ["Urban League Seattle", "El Centro de la Raza", "APACE"] },
    { category: "Healthcare", items: ["Country Doctor", "Harborview Transgender", "Seattle Indian Health"] },
  ],
};

export default function DetailedReportScreen({ route }: DetailedReportScreenProps) {
  const { cityId } = route.params;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { profile, privacySettings } = useUserProfile();
  const { isPremium, showUpgradePrompt } = usePremium();

  const city = getCityById(cityId);

  if (!city || !profile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={styles.center}>
          <ThemedText>City not found</ThemedText>
        </View>
      </View>
    );
  }

  const cityWithScore = calculateCityScore(city, profile.identity, profile.priorities, privacySettings);
  const neighborhoods = NEIGHBORHOOD_DATA[cityId] || [];
  const resources = LOCAL_RESOURCES[cityId] || [];

  if (!isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingBottom: insets.bottom + Spacing["3xl"],
            },
          ]}
        >
          <View style={styles.lockedContainer}>
            <View style={[styles.lockedIcon, { backgroundColor: theme.warning + "20" }]}>
              <Feather name="lock" size={48} color={theme.warning} />
            </View>
            <ThemedText type="h3" style={styles.lockedTitle}>
              Premium Feature
            </ThemedText>
            <ThemedText type="body" style={[styles.lockedText, { color: theme.textSecondary }]}>
              Detailed city reports with neighborhood breakdowns, local resources, and insider insights are available with EarthLook Premium.
            </ThemedText>
            <Pressable
              onPress={() => showUpgradePrompt("Detailed Reports")}
              style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
            >
              <Feather name="star" size={20} color={theme.buttonText} />
              <ThemedText style={[styles.upgradeText, { color: theme.buttonText }]}>
                Upgrade to Premium
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
      >
        <View style={styles.header}>
          <ThemedText type="h3" style={styles.cityName}>
            {city.name}, {city.state}
          </ThemedText>
          <View style={[styles.scoreBadge, { backgroundColor: theme.primary + "20" }]}>
            <ThemedText style={[styles.scoreText, { color: theme.primary }]}>
              {cityWithScore.overall}% Match
            </ThemedText>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={20} color={theme.primary} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Recommended Neighborhoods
            </ThemedText>
          </View>
          <ThemedText type="small" style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Based on your identity and priorities
          </ThemedText>
          
          {neighborhoods.length > 0 ? neighborhoods.map((n, index) => (
            <View
              key={n.name}
              style={[
                styles.neighborhoodCard,
                { backgroundColor: theme.backgroundTertiary },
                index === 0 && { borderColor: theme.success, borderWidth: 2 },
              ]}
            >
              {index === 0 ? (
                <View style={[styles.topPickBadge, { backgroundColor: theme.success }]}>
                  <ThemedText style={[styles.topPickText, { color: theme.buttonText }]}>
                    Top Pick
                  </ThemedText>
                </View>
              ) : null}
              <View style={styles.neighborhoodHeader}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {n.name}
                </ThemedText>
                <ThemedText style={[styles.neighborhoodScore, { color: theme.success }]}>
                  {n.score}%
                </ThemedText>
              </View>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                {n.vibe}
              </ThemedText>
            </View>
          )) : (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Neighborhood data coming soon for this city.
            </ThemedText>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Feather name="users" size={20} color={theme.primary} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Local Resources & Organizations
            </ThemedText>
          </View>
          
          {resources.length > 0 ? resources.map((category) => (
            <View key={category.category} style={styles.resourceCategory}>
              <ThemedText type="body" style={{ fontWeight: "600", marginBottom: Spacing.sm }}>
                {category.category}
              </ThemedText>
              {category.items.map((item) => (
                <View key={item} style={styles.resourceItem}>
                  <Feather name="check" size={14} color={theme.success} />
                  <ThemedText type="small" style={{ marginLeft: Spacing.sm }}>
                    {item}
                  </ThemedText>
                </View>
              ))}
            </View>
          )) : (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Resource data coming soon for this city.
            </ThemedText>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <View style={styles.sectionHeader}>
            <Feather name="bar-chart-2" size={20} color={theme.primary} />
            <ThemedText type="h4" style={styles.sectionTitle}>
              Detailed Score Breakdown
            </ThemedText>
          </View>
          
          {Object.entries(cityWithScore.breakdown).map(([key, value]) => (
            <View key={key} style={styles.breakdownRow}>
              <ThemedText type="body" style={styles.breakdownLabel}>
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
              </ThemedText>
              <View style={styles.breakdownBarContainer}>
                <View
                  style={[
                    styles.breakdownBar,
                    { backgroundColor: theme.primary + "30" },
                  ]}
                >
                  <View
                    style={[
                      styles.breakdownFill,
                      {
                        backgroundColor: theme.primary,
                        width: `${value}%`,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={[styles.breakdownValue, { color: theme.primary }]}>
                  {value}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  cityName: {
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  scoreBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    marginLeft: Spacing.sm,
  },
  sectionSubtitle: {
    marginBottom: Spacing.lg,
  },
  neighborhoodCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  neighborhoodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  neighborhoodScore: {
    fontSize: 16,
    fontWeight: "700",
  },
  topPickBadge: {
    position: "absolute",
    top: -8,
    right: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  topPickText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  resourceCategory: {
    marginBottom: Spacing.lg,
  },
  resourceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  breakdownRow: {
    marginBottom: Spacing.md,
  },
  breakdownLabel: {
    marginBottom: Spacing.xs,
  },
  breakdownBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  breakdownBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.md,
  },
  breakdownFill: {
    height: "100%",
    borderRadius: 4,
  },
  breakdownValue: {
    width: 36,
    fontWeight: "600",
    textAlign: "right",
  },
  lockedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  lockedIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xl,
  },
  lockedTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  lockedText: {
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing["2xl"],
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
