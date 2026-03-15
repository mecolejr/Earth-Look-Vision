import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { ChipGroup } from "@/components/Chip";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { InfoTooltip } from "@/components/InfoTooltip";
import { LiveScorePreview } from "@/components/LiveScorePreview";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, Fonts } from "@/constants/theme";
import {
  CAREER_OPTIONS,
  INCOME_OPTIONS,
  FAMILY_OPTIONS,
  CLIMATE_OPTIONS,
  DEFAULT_CLIMATE_PREFERENCES,
  ClimatePreferences,
} from "@/types";
import { OnboardingStackParamList } from "@/navigation/OnboardingNavigator";

interface IdentityStep1ScreenProps {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "IdentityStep1">;
}

export default function IdentityStep1Screen({
  navigation,
}: IdentityStep1ScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { profile, updateIdentity, setOnboardingStep } = useUserProfile();

  const [career, setCareer] = useState<string[]>(
    profile?.identity.careerField ? [profile.identity.careerField] : []
  );
  const [income, setIncome] = useState<string[]>(
    profile?.identity.incomeLevel ? [profile.identity.incomeLevel] : []
  );
  const [family, setFamily] = useState<string[]>(
    profile?.identity.familyStructure ? [profile.identity.familyStructure] : []
  );
  const [climatePrefs, setClimatePrefs] = useState<ClimatePreferences>(
    profile?.identity.climatePreferences || DEFAULT_CLIMATE_PREFERENCES
  );

  const handleCareerChange = async (values: string[]) => {
    setCareer(values);
    await updateIdentity({ careerField: values[0] || "" });
    if (profile?.onboardingStep === 0) {
      await setOnboardingStep(1);
    }
  };

  const handleIncomeChange = async (values: string[]) => {
    setIncome(values);
    await updateIdentity({ incomeLevel: values[0] || "" });
    if (profile?.onboardingStep === 0) {
      await setOnboardingStep(1);
    }
  };

  const handleFamilyChange = async (values: string[]) => {
    setFamily(values);
    await updateIdentity({ familyStructure: values[0] || "" });
    if (profile?.onboardingStep === 0) {
      await setOnboardingStep(1);
    }
  };

  const handleClimateChange = async (key: keyof ClimatePreferences, value: string) => {
    const updated = { ...climatePrefs, [key]: value };
    setClimatePrefs(updated);
    await updateIdentity({ climatePreferences: updated });
  };

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setOnboardingStep(2);
    navigation.navigate("IdentityStep2");
  };

  const canProceed =
    career.length > 0 || income.length > 0 || family.length > 0 || climatePrefs.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}
      >
        <ProgressIndicator steps={3} currentStep={0} />
        <ThemedText
          type="small"
          style={[styles.stepLabel, { color: theme.textSecondary }]}
        >
          Step 1 of 3
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={[styles.title, { fontFamily: Fonts?.serifBold }]}>
          Your lifestyle
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          Let's start with some basics about your work and life. All answers are optional.
        </ThemedText>

        <LiveScorePreview compact />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Career Field
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your career field helps us identify cities with strong job markets in your industry. We look at employment rates, major employers, remote work culture, and salary levels for your profession."
            />
          </View>
          <ChipGroup
            options={CAREER_OPTIONS}
            selected={career}
            onChange={handleCareerChange}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Income Level
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your income level helps us assess cost of living compatibility. We compare housing costs, daily expenses, and overall affordability to ensure you can maintain your quality of life in recommended cities."
            />
          </View>
          <ChipGroup
            options={INCOME_OPTIONS}
            selected={income}
            onChange={handleIncomeChange}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Family Structure
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your family situation helps us evaluate cities based on relevant factors like school quality, family-friendly amenities, dating scene, or support for non-traditional family structures."
            />
          </View>
          <ChipGroup
            options={FAMILY_OPTIONS}
            selected={family}
            onChange={handleFamilyChange}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Climate Preferences
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your climate preferences help us match you with cities that have weather patterns you'll enjoy. We consider temperature, seasons, rainfall, humidity, and sunshine levels."
            />
          </View>

          <ThemedText type="small" style={[styles.climateSubLabel, { color: theme.textSecondary }]}>
            Temperature
          </ThemedText>
          <ChipGroup
            options={CLIMATE_OPTIONS.temperature.map(o => o.value)}
            selected={climatePrefs.temperaturePreference ? [climatePrefs.temperaturePreference] : []}
            onChange={(values) => handleClimateChange("temperaturePreference", values[0] || "")}
          />

          <ThemedText type="small" style={[styles.climateSubLabel, { color: theme.textSecondary }]}>
            Seasons
          </ThemedText>
          <ChipGroup
            options={CLIMATE_OPTIONS.seasons.map(o => o.value)}
            selected={climatePrefs.seasonPreference ? [climatePrefs.seasonPreference] : []}
            onChange={(values) => handleClimateChange("seasonPreference", values[0] || "")}
          />

          <ThemedText type="small" style={[styles.climateSubLabel, { color: theme.textSecondary }]}>
            Precipitation
          </ThemedText>
          <ChipGroup
            options={CLIMATE_OPTIONS.precipitation.map(o => o.value)}
            selected={climatePrefs.precipitationPreference ? [climatePrefs.precipitationPreference] : []}
            onChange={(values) => handleClimateChange("precipitationPreference", values[0] || "")}
          />
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
        <Button onPress={handleNext} disabled={!canProceed}>
          Continue
        </Button>
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
  section: {
    marginBottom: Spacing["3xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {},
  climateSubLabel: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
