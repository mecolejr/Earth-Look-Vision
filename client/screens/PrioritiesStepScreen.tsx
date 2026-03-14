import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { PrioritySlider } from "@/components/PrioritySlider";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, Fonts } from "@/constants/theme";
import { PriorityWeights, PRIORITY_LABELS } from "@/types";
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

export default function PrioritiesStepScreen({
  navigation,
}: PrioritiesStepScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { profile, updatePriorities, completeOnboarding } = useUserProfile();
  const [priorities, setPriorities] = useState<PriorityWeights>(
    profile?.priorities || {
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
    }
  );

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
