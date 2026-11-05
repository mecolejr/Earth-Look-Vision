import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { PrioritySlider } from "@/components/PrioritySlider";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { LiveScorePreview } from "@/components/LiveScorePreview";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, Fonts } from "@/constants/theme";
import { PriorityWeights, PRIORITY_LABELS, IdentityProfile } from "@/types";
import { OnboardingStackParamList } from "@/navigation/OnboardingNavigator";

interface PrioritiesStepScreenProps {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "PrioritiesStep">;
}

const PRIORITY_DESCRIPTIONS: Record<keyof PriorityWeights, string> = {
  safety: "Low crime rates and hate crime statistics",
  lgbtqAcceptance: "LGBTQ+ protections, venues, and community size",
  diversityInclusion: "Ethnic diversity and representation",
  costOfLiving: "Housing, food, and daily expenses",
  jobMarket: "Employment opportunities in your field",
  healthcare: "Quality care and LGBTQ-affirming providers",
  climate: "Weather and sunny days",
  publicTransit: "Walkability and public transportation",
  culturalInstitutions: "Restaurants, venues, and cultural centers",
  politicalAlignment: "Voting patterns and policy alignment",
};

const LGBTQ_ORIENTATIONS = [
  "Gay",
  "Lesbian",
  "Bisexual",
  "Pansexual",
  "Queer",
  "Asexual",
];

const NON_BINARY_GENDERS = [
  "Non-binary",
  "Genderqueer",
  "Genderfluid",
  "Agender",
  "Two-Spirit",
];

const MAJORITY_ETHNICITIES = ["White / Caucasian", "White", "White/Caucasian"];

/** Derive meaningful starting weights from identity so sliders aren't all 50. */
function computeSmartDefaults(
  identity: IdentityProfile
): Partial<PriorityWeights> {
  const defaults: Partial<PriorityWeights> = {};

  // LGBTQ+ orientation or non-binary gender â boost LGBTQ acceptance & safety
  const isLgbtq = LGBTQ_ORIENTATIONS.includes(identity.sexualOrientation);
  const isNonBinary = NON_BINARY_GENDERS.includes(identity.genderIdentity);
  if (isLgbtq || isNonBinary) {
    defaults.lgbtqAcceptance = 80;
    defaults.safety = Math.max(defaults.safety ?? 50, 70);
  }

  // Ethnic minority â boost diversity & safety
  const hasMinorityEthnicity =
    identity.ethnicities.length > 0 &&
    !identity.ethnicities.every((e) => MAJORITY_ETHNICITIES.includes(e));
  if (hasMinorityEthnicity) {
    defaults.diversityInclusion = 75;
    defaults.safety = Math.max(defaults.safety ?? 50, 70);
  }

  // Income signals â adjust cost of living weight
  const income = identity.incomeLevel ?? "";
  if (income.startsWith("Under") || income.startsWith("$25,000")) {
    defaults.costOfLiving = 85;
  } else if (income.startsWith("$150,000") || income === "$250,000+") {
    defaults.costOfLiving = 30;
  } else if (income.startsWith("$75,000") || income.startsWith("$100,000")) {
    defaults.costOfLiving = 65;
  }

  // Family with children â boost safety & cost of living
  const family = identity.familyStructure?.toLowerCase() ?? "";
  if (family.includes("child") || family.includes("parent") || family.includes("kids")) {
    defaults.safety = Math.max(defaults.safety ?? 50, 75);
    defaults.costOfLiving = Math.max(defaults.costOfLiving ?? 50, 70);
  }

  // Climate preferences set â weight climate higher
  const climate = identity.climatePreferences;
  if (climate && Object.values(climate).some(Boolean)) {
    defaults.climate = 75;
  }

  // Career field â weight job market
  if (identity.careerField) {
    defaults.jobMarket = 70;
  }

  // Disabilities â weight healthcare
  if (identity.disabilities && identity.disabilities.length > 0) {
    defaults.healthcare = 80;
  }

  // Political views set â weight political alignment
  if (identity.politicalViews) {
    defaults.politicalAlignment = 65;
  }

  return defaults;
}

const DEFAULT_PRIORITIES: PriorityWeights = {
  safety: 50,
  lgbtqAcceptance: 50,
  diversityInclusion: 50,
  costOfLiving: 50,
  jobMarket: 50,
  healthcare: 50,
  climate: 50,
  publicTransit: 50,
  culturalInstitutions: 50,
  politicalAlignment: 50,
};

export default function PrioritiesStepScreen({
  navigation,
}: PrioritiesStepScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { profile, updatePriorities, completeOnboarding } = useUserProfile();

  const [priorities, setPriorities] = useState<PriorityWeights>(
    profile?.priorities ?? DEFAULT_PRIORITIES
  );

  // On first render, if priorities are still all at default (no user edits yet),
  // compute smart starting weights from identity & lifestyle data collected
  // in Steps 1 and 2 so sliders reflect real preferences instead of all-50.
  useEffect(() => {
    if (!profile?.identity) return;

    const allDefault = Object.values(priorities).every((v) => v === 50);
    if (!allDefault) return; // user already has custom priorities â don't overwrite

    const smartDefaults = computeSmartDefaults(profile.identity);
    if (Object.keys(smartDefaults).length === 0) return;

    const merged: PriorityWeights = { ...DEFAULT_PRIORITIES, ...smartDefaults };
    setPriorities(merged);
    updatePriorities(merged);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePriorityChange = async (
    key: keyof PriorityWeights,
    value: number
  ) => {
    const newPriorities = { ...priorities, [key]: value };
    setPriorities(newPriorities);
    await updatePriorities({ [key]: value });
  };

  const handleComplete = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updatePriorities(priorities);
    await completeOnboarding();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => navigation.goBack()}
            hitSlop={12}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            style={styles.backButton}
          >
            <Feather name="chevron-left" size={24} color={theme.text} />
          </Pressable>
          <View style={styles.headerProgress}>
            <ProgressIndicator steps={3} currentStep={2} />
            <ThemedText
              type="caption"
              style={[styles.stepLabel, { color: theme.textSecondary }]}
            >
              Step 3 of 3
            </ThemedText>
          </View>
          <View style={styles.backButton} />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={[styles.title, { fontFamily: Fonts?.serifBold }]}>
          What matters most?
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          Adjust these sliders to weight how much each factor influences your
          city compatibility scores.
        </ThemedText>

        <LiveScorePreview showLabel compact={false} />

        <View style={styles.sliders}>
          {(Object.keys(PRIORITY_LABELS) as Array<keyof PriorityWeights>).map(
            (key) => (
              <PrioritySlider
                key={key}
                label={PRIORITY_LABELS[key]}
                description={PRIORITY_DESCRIPTIONS[key]}
                value={priorities[key]}
                onChange={(value) => handlePriorityChange(key, value)}
              />
            )
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <Button onPress={handleComplete}>Find My Matches</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing.lg,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerProgress: {
    flex: 1,
    alignItems: "center",
  },
  stepLabel: {
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing["2xl"],
    paddingBottom: Spacing["4xl"],
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    marginBottom: Spacing.md,
  },
  subtitle: {
    marginBottom: Spacing["3xl"],
  },
  sliders: {},
  footer: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
