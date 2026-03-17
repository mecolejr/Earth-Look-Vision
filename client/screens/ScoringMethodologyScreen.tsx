import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

const SCORING_FACTORS = [
  {
    icon: "shield" as const,
    title: "Safety",
    description: "Crime rates, hate crime statistics, and how safe people with your identity report feeling in this city.",
    color: "success",
  },
  {
    icon: "heart" as const,
    title: "LGBTQ+ Acceptance",
    description: "Legal protections, community size, inclusive policies, and social attitudes toward LGBTQ+ individuals.",
    color: "primary",
  },
  {
    icon: "users" as const,
    title: "Diversity & Inclusion",
    description: "Racial and ethnic diversity, representation in leadership, cultural communities, and inclusion initiatives.",
    color: "warning",
  },
  {
    icon: "dollar-sign" as const,
    title: "Cost of Living",
    description: "Housing costs, taxes, and overall affordability adjusted for the median income in your career field.",
    color: "info",
  },
  {
    icon: "briefcase" as const,
    title: "Job Market",
    description: "Employment opportunities in your career field, salary ranges, and economic growth prospects.",
    color: "success",
  },
  {
    icon: "activity" as const,
    title: "Healthcare",
    description: "Access to quality healthcare, specialists, and providers who understand diverse patient needs.",
    color: "danger",
  },
  {
    icon: "sun" as const,
    title: "Climate",
    description: "Weather patterns, natural disaster risks, and environmental factors that may affect your quality of life.",
    color: "warning",
  },
  {
    icon: "navigation" as const,
    title: "Public Transit",
    description: "Quality of public transportation, walkability, and ease of getting around without a car.",
    color: "primary",
  },
];

export default function ScoringMethodologyScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const getColor = (colorName: string) => {
    switch (colorName) {
      case "success": return theme.success;
      case "primary": return theme.primary;
      case "warning": return theme.warning;
      case "danger": return theme.danger;
      case "info": return theme.link;
      default: return theme.primary;
    }
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
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="bar-chart-2" size={32} color={theme.primary} />
          </View>
          <ThemedText type="h4" style={styles.title}>
            How We Calculate Your Score
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Your match score is personalized based on your unique identity and what matters most to you.
          </ThemedText>
        </View>

        <View style={[styles.overviewCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <ThemedText type="h4" style={styles.overviewTitle}>
            The Basics
          </ThemedText>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewBullet, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" style={[styles.overviewText, { color: theme.textSecondary }]}>
              We analyze real data about each city across multiple categories
            </ThemedText>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewBullet, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" style={[styles.overviewText, { color: theme.textSecondary }]}>
              Your identity factors adjust scores based on how cities treat people like you
            </ThemedText>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewBullet, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" style={[styles.overviewText, { color: theme.textSecondary }]}>
              Your priorities weight each category by importance to you
            </ThemedText>
          </View>
          <View style={styles.overviewItem}>
            <View style={[styles.overviewBullet, { backgroundColor: theme.primary }]} />
            <ThemedText type="body" style={[styles.overviewText, { color: theme.textSecondary }]}>
              The same city can score differently for different people
            </ThemedText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <ThemedText type="h4">
            Scoring Categories
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.xs }}>
            Each category is scored 0-100 and weighted by your priorities
          </ThemedText>
        </View>

        <View style={styles.factorsList}>
          {SCORING_FACTORS.map((factor, index) => (
            <View
              key={index}
              style={[
                styles.factorCard,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.cardBorder,
                },
              ]}
            >
              <View style={[styles.factorIcon, { backgroundColor: getColor(factor.color) + "20" }]}>
                <Feather name={factor.icon} size={20} color={getColor(factor.color)} />
              </View>
              <View style={styles.factorContent}>
                <ThemedText type="h4" style={styles.factorTitle}>
                  {factor.title}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary, lineHeight: 18 }}>
                  {factor.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.personalizationCard, { backgroundColor: theme.primaryLight + "30", borderColor: theme.primary + "40" }]}>
          <Feather name="user" size={24} color={theme.primary} style={styles.personalizationIcon} />
          <ThemedText type="h4" style={styles.personalizationTitle}>
            How Your Identity Matters
          </ThemedText>
          <ThemedText type="body" style={[styles.personalizationText, { color: theme.textSecondary }]}>
            When you share your identity, we adjust scores based on real data about how cities treat people like you. For example:
          </ThemedText>
          <View style={styles.exampleList}>
            <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}>
              A city's safety score adjusts based on hate crime data relevant to your identity
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.sm }}>
              LGBTQ+ acceptance reflects legal protections and community presence
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Diversity scores consider how well-represented your community is
            </ThemedText>
          </View>
        </View>

        <View style={[styles.transparencyCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <Feather name="eye" size={20} color={theme.success} style={{ marginBottom: Spacing.md }} />
          <ThemedText type="h4" style={styles.transparencyTitle}>
            Full Transparency
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, lineHeight: 20 }}>
            We show you exactly why each city scored the way it did. On any city's detail page, you'll see a breakdown of every category and specific highlights or concerns based on your profile.
          </ThemedText>
        </View>

        <View style={styles.footer}>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center", lineHeight: 18 }}>
            Scores are calculated entirely on your device. Your identity data is never sent to any server.
          </ThemedText>
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
  header: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  overviewCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing["2xl"],
  },
  overviewTitle: {
    marginBottom: Spacing.lg,
  },
  overviewItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  overviewBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: Spacing.md,
  },
  overviewText: {
    flex: 1,
    lineHeight: 22,
  },
  sectionHeader: {
    marginBottom: Spacing.lg,
  },
  factorsList: {
    gap: Spacing.md,
    marginBottom: Spacing["2xl"],
  },
  factorCard: {
    flexDirection: "row",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  factorIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  factorContent: {
    flex: 1,
  },
  factorTitle: {
    marginBottom: Spacing.xs,
  },
  personalizationCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  personalizationIcon: {
    marginBottom: Spacing.md,
  },
  personalizationTitle: {
    marginBottom: Spacing.sm,
  },
  personalizationText: {
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  exampleList: {
    paddingLeft: Spacing.md,
  },
  transparencyCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing["2xl"],
    alignItems: "center",
  },
  transparencyTitle: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
});
