import React, { useState, useMemo } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { PrioritySlider } from "@/components/PrioritySlider";
import { Button } from "@/components/Button";
import { ChipGroup } from "@/components/Chip";
import { useTheme } from "@/hooks/useTheme";
import { calculateCityScore } from "@/lib/scoring";
import { CITIES, getCityById } from "@/data/cities";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { IdentityProfile, PriorityWeights, City, CityScore } from "@/types";
import { OnboardingStackParamList } from "@/navigation/OnboardingNavigator";

type Props = {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "InteractiveDemo">;
};

const DEMO_CITIES = ["san-francisco", "austin", "seattle", "new-york", "denver"];

const DEFAULT_IDENTITY: IdentityProfile = {
  ethnicities: [],
  genderIdentity: "",
  sexualOrientation: "",
  religion: "",
  politicalViews: "",
  familyStructure: "",
  incomeLevel: "",
  careerField: "",
  ageRange: "",
  disabilities: [],
  languages: [],
};

const IDENTITY_PRESETS = [
  { 
    id: "lgbtq", 
    label: "LGBTQ+ Person",
    identity: { ...DEFAULT_IDENTITY, sexualOrientation: "Gay", genderIdentity: "Non-binary" }
  },
  { 
    id: "poc", 
    label: "Person of Color",
    identity: { ...DEFAULT_IDENTITY, ethnicities: ["Black/African American"] }
  },
  { 
    id: "tech", 
    label: "Tech Worker",
    identity: { ...DEFAULT_IDENTITY, careerField: "Technology", incomeLevel: "$100,000 - $150,000" }
  },
  { 
    id: "family", 
    label: "Young Family",
    identity: { ...DEFAULT_IDENTITY, familyStructure: "Married with children" }
  },
];

export default function InteractiveDemoScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [selectedPreset, setSelectedPreset] = useState<string>("lgbtq");
  const [priorities, setPriorities] = useState<PriorityWeights>({
    safety: 80,
    lgbtqAcceptance: 70,
    diversityInclusion: 60,
    costOfLiving: 50,
    jobMarket: 50,
    healthcare: 50,
    climate: 40,
    publicTransit: 40,
    culturalInstitutions: 30,
    politicalAlignment: 50,
  });

  const currentIdentity = useMemo(() => {
    const preset = IDENTITY_PRESETS.find(p => p.id === selectedPreset);
    return preset?.identity || DEFAULT_IDENTITY;
  }, [selectedPreset]);

  const cityScores = useMemo(() => {
    const scores: { city: City; score: CityScore }[] = [];
    for (const cityId of DEMO_CITIES) {
      const city = getCityById(cityId);
      if (city) {
        const score = calculateCityScore(city, currentIdentity, priorities);
        scores.push({ city, score });
      }
    }
    return scores.sort((a, b) => b.score.overall - a.score.overall);
  }, [currentIdentity, priorities]);

  const handlePriorityChange = (key: keyof PriorityWeights, value: number) => {
    setPriorities(prev => ({ ...prev, [key]: value }));
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleStartOnboarding = () => {
    navigation.navigate("IdentityStep1");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </Pressable>
        <ThemedText style={[styles.headerTitle, { fontFamily: Fonts?.serifBold }]}>
          Interactive Demo
        </ThemedText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="body" style={[styles.intro, { color: theme.textSecondary }]}>
          See how different identities and priorities affect city scores. Adjust the sliders and watch scores update in real-time.
        </ThemedText>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Choose an Identity
          </ThemedText>
          <View style={styles.presetGrid}>
            {IDENTITY_PRESETS.map(preset => (
              <Pressable
                key={preset.id}
                onPress={() => setSelectedPreset(preset.id)}
                style={[
                  styles.presetChip,
                  { 
                    backgroundColor: selectedPreset === preset.id 
                      ? theme.primary 
                      : theme.backgroundSecondary,
                    borderColor: selectedPreset === preset.id 
                      ? theme.primary 
                      : theme.border,
                  },
                ]}
              >
                <ThemedText
                  type="small"
                  style={{
                    color: selectedPreset === preset.id ? "#FFFFFF" : theme.text,
                    fontWeight: selectedPreset === preset.id ? "600" : "400",
                  }}
                >
                  {preset.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Adjust Priorities
          </ThemedText>
          
          <PrioritySlider
            label="Safety"
            value={priorities.safety}
            onChange={(v) => handlePriorityChange("safety", v)}
          />
          <PrioritySlider
            label="LGBTQ+ Acceptance"
            value={priorities.lgbtqAcceptance}
            onChange={(v) => handlePriorityChange("lgbtqAcceptance", v)}
          />
          <PrioritySlider
            label="Diversity & Inclusion"
            value={priorities.diversityInclusion}
            onChange={(v) => handlePriorityChange("diversityInclusion", v)}
          />
          <PrioritySlider
            label="Cost of Living"
            value={priorities.costOfLiving}
            onChange={(v) => handlePriorityChange("costOfLiving", v)}
          />
          <PrioritySlider
            label="Job Market"
            value={priorities.jobMarket}
            onChange={(v) => handlePriorityChange("jobMarket", v)}
          />
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            City Rankings
          </ThemedText>
          <ThemedText type="small" style={[styles.rankingHint, { color: theme.textSecondary }]}>
            Watch scores change as you adjust sliders above
          </ThemedText>
          
          {cityScores.map(({ city, score }, index) => (
            <CityScoreCard
              key={city.id}
              city={city}
              score={score}
              rank={index + 1}
              theme={theme}
            />
          ))}
        </View>

        <View style={[styles.ctaSection, { paddingBottom: insets.bottom + Spacing.xl }]}>
          <Button onPress={handleStartOnboarding}>
            Create Your Profile
          </Button>
          <ThemedText
            type="small"
            style={[styles.ctaHint, { color: theme.textSecondary }]}
          >
            Get personalized city recommendations based on your unique identity
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

interface CityScoreCardProps {
  city: City;
  score: CityScore;
  rank: number;
  theme: any;
}

function CityScoreCard({ city, score, rank, theme }: CityScoreCardProps) {
  const scale = useSharedValue(1);
  const prevScore = React.useRef(score.overall);

  React.useEffect(() => {
    if (Math.abs(prevScore.current - score.overall) > 0.5) {
      scale.value = withSequence(
        withSpring(1.02, { damping: 10, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    }
    prevScore.current = score.overall;
  }, [score.overall]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getScoreColor = (value: number) => {
    if (value >= 80) return theme.success;
    if (value >= 60) return theme.warning;
    return theme.danger;
  };

  return (
    <Animated.View
      style={[
        styles.cityCard,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <View style={styles.cityCardHeader}>
        <View style={[styles.rankBadge, { backgroundColor: theme.primaryLight + "30" }]}>
          <ThemedText style={[styles.rankText, { color: theme.primary }]}>
            #{rank}
          </ThemedText>
        </View>
        <View style={styles.cityInfo}>
          <ThemedText type="h4">{city.name}</ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {city.state}
          </ThemedText>
        </View>
        <View style={styles.scoreContainer}>
          <ThemedText style={[styles.scoreValue, { color: getScoreColor(score.overall) }]}>
            {Math.round(score.overall)}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>/100</ThemedText>
        </View>
      </View>

      <View style={styles.breakdownRow}>
        <BreakdownPill label="Safety" value={score.breakdown.safety} theme={theme} />
        <BreakdownPill label="LGBTQ+" value={score.breakdown.lgbtqAcceptance} theme={theme} />
        <BreakdownPill label="Diversity" value={score.breakdown.diversityInclusion} theme={theme} />
        <BreakdownPill label="Cost" value={score.breakdown.costOfLiving} theme={theme} />
      </View>
    </Animated.View>
  );
}

interface BreakdownPillProps {
  label: string;
  value: number;
  theme: any;
}

function BreakdownPill({ label, value, theme }: BreakdownPillProps) {
  const getColor = (v: number) => {
    if (v >= 80) return theme.success;
    if (v >= 60) return theme.warning;
    return theme.danger;
  };

  return (
    <View style={[styles.breakdownPill, { backgroundColor: theme.backgroundSecondary }]}>
      <ThemedText style={[styles.breakdownLabel, { color: theme.textSecondary }]}>
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
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  intro: {
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  presetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  presetChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  rankingHint: {
    marginBottom: Spacing.lg,
    fontStyle: "italic",
  },
  cityCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cityCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  rankText: {
    fontWeight: "700",
    fontSize: 14,
  },
  cityInfo: {
    flex: 1,
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "700",
  },
  breakdownRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.xs,
  },
  breakdownPill: {
    flex: 1,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  breakdownLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  ctaSection: {
    marginTop: Spacing.lg,
    alignItems: "center",
  },
  ctaHint: {
    marginTop: Spacing.md,
    textAlign: "center",
  },
});
