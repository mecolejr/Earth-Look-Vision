import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

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
  ETHNICITY_OPTIONS,
  GENDER_OPTIONS,
  ORIENTATION_OPTIONS,
  RELIGION_OPTIONS,
  POLITICAL_OPTIONS,
} from "@/types";
import { OnboardingStackParamList } from "@/navigation/OnboardingNavigator";

interface IdentityStep2ScreenProps {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "IdentityStep2">;
}

export default function IdentityStep2Screen({
  navigation,
}: IdentityStep2ScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { profile, updateIdentity, setOnboardingStep } = useUserProfile();
  const [ethnicities, setEthnicities] = useState<string[]>(
    profile?.identity.ethnicities || []
  );
  const [gender, setGender] = useState<string[]>(
    profile?.identity.genderIdentity
      ? [profile.identity.genderIdentity]
      : []
  );
  const [orientation, setOrientation] = useState<string[]>(
    profile?.identity.sexualOrientation
      ? [profile.identity.sexualOrientation]
      : []
  );
  const [religion, setReligion] = useState<string[]>(
    profile?.identity.religion ? [profile.identity.religion] : []
  );
  const [political, setPolitical] = useState<string[]>(
    profile?.identity.politicalViews
      ? [profile.identity.politicalViews]
      : []
  );

  const handleEthnicitiesChange = async (values: string[]) => {
    setEthnicities(values);
    await updateIdentity({ ethnicities: values });
  };
  const handleGenderChange = async (values: string[]) => {
    setGender(values);
    await updateIdentity({ genderIdentity: values[0] || "" });
  };
  const handleOrientationChange = async (values: string[]) => {
    setOrientation(values);
    await updateIdentity({ sexualOrientation: values[0] || "" });
  };
  const handleReligionChange = async (values: string[]) => {
    setReligion(values);
    await updateIdentity({ religion: values[0] || "" });
  };
  const handlePoliticalChange = async (values: string[]) => {
    setPolitical(values);
    await updateIdentity({ politicalViews: values[0] || "" });
  };

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setOnboardingStep(3);
    navigation.navigate("PrioritiesStep");
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
            <ProgressIndicator steps={3} currentStep={1} />
            <ThemedText
              type="small"
              style={[styles.stepLabel, { color: theme.textSecondary }]}
            >
              Step 2 of 3
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
          Your identity
        </ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          This personal information helps us find cities where people like you
          feel safe and welcome. Share only what you're comfortable with.
        </ThemedText>
        <LiveScorePreview />
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Race / Ethnicity
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your race and ethnicity help us identify cities with communities where you'll feel at home. We look at demographic representation, cultural institutions, and hate crime statistics to find places where people like you thrive."
            />
          </View>
          <ThemedText
            type="small"
            style={[styles.sectionHint, { color: theme.textSecondary }]}
          >
            Select all that apply
          </ThemedText>
          <ChipGroup
            options={ETHNICITY_OPTIONS}
            selected={ethnicities}
            onChange={handleEthnicitiesChange}
            multiSelect
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Gender Identity
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your gender identity helps us evaluate cities based on gender-affirming healthcare access, legal protections, and community safety. We prioritize places with strong support systems and low rates of gender-based discrimination."
            />
          </View>
          <ChipGroup
            options={GENDER_OPTIONS}
            selected={gender}
            onChange={handleGenderChange}
          multiSelect
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Sexual Orientation
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your sexual orientation helps us find LGBTQ+-friendly cities with legal protections, vibrant queer communities, affirming healthcare providers, and venues where you can be yourself safely."
            />
          </View>
          <ChipGroup
            options={ORIENTATION_OPTIONS}
            selected={orientation}
            onChange={handleOrientationChange}
          multiSelect
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Religion / Spirituality
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your religious or spiritual background helps us find cities with relevant places of worship, community centers, and cultural institutions. We also consider religious diversity and tolerance levels in different areas."
            />
          </View>
          <ChipGroup
            options={RELIGION_OPTIONS}
            selected={religion}
            onChange={handleReligionChange}
          multiSelect
          />
        </View>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Political Views
            </ThemedText>
            <InfoTooltip
              title="Why we ask this"
              description="Your political views help us match you with cities whose policies and voting patterns align with your values. This includes local legislation on issues that may matter to you like civil rights, healthcare, and social programs."
            />
          </View>
          <ChipGroup
            options={POLITICAL_OPTIONS}
            selected={political}
            onChange={handlePoliticalChange}
          multiSelect
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
        <Button onPress={handleNext}>Continue</Button>
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
  section: {
    marginBottom: Spacing["3xl"],
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sectionTitle: {},
  sectionHint: {
    marginBottom: Spacing.lg,
    marginTop: -Spacing.sm,
  },
  footer: {
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
});
