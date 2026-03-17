import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { PREMIUM_FEATURES } from "@/types";
import { usePremium } from "@/contexts/PremiumContext";

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { isPremium, upgradeToPremium } = usePremium();

  const handleUpgrade = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await upgradeToPremium();
  };

  if (isPremium) {
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
            <View style={[styles.premiumBadge, { backgroundColor: theme.warning + "20" }]}>
              <Feather name="award" size={48} color={theme.warning} />
            </View>
            <ThemedText type="h3" style={styles.title}>
              You're Premium!
            </ThemedText>
            <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
              Thank you for supporting EarthLook. You have access to all premium features.
            </ThemedText>
          </View>

          <View style={[styles.featuresCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Your Benefits
            </ThemedText>
            {PREMIUM_FEATURES.map((feature) => (
              <View key={feature.id} style={styles.featureRow}>
                <View style={[styles.featureIcon, { backgroundColor: theme.success + "20" }]}>
                  <Feather name={feature.icon} size={20} color={theme.success} />
                </View>
                <View style={styles.featureInfo}>
                  <ThemedText type="body" style={{ fontWeight: "600" }}>
                    {feature.title}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {feature.description}
                  </ThemedText>
                </View>
                <Feather name="check-circle" size={20} color={theme.success} />
              </View>
            ))}
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
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="star" size={48} color={theme.primary} />
          </View>
          <ThemedText type="h3" style={styles.title}>
            EarthLook Premium
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Unlock the full power of personalized city matching
          </ThemedText>
        </View>

        <View style={[styles.pricingCard, { backgroundColor: theme.primary + "10", borderColor: theme.primary + "40" }]}>
          <ThemedText type="small" style={[styles.pricingLabel, { color: theme.primary }]}>
            PREMIUM
          </ThemedText>
          <View style={styles.priceRow}>
            <ThemedText style={[styles.price, { color: theme.text }]}>$4.99</ThemedText>
            <ThemedText type="body" style={{ color: theme.textSecondary }}>/month</ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: "center" }}>
            Cancel anytime
          </ThemedText>
        </View>

        <View style={[styles.featuresCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            What's Included
          </ThemedText>
          {PREMIUM_FEATURES.map((feature) => (
            <View key={feature.id} style={styles.featureRow}>
              <View style={[styles.featureIcon, { backgroundColor: theme.primary + "20" }]}>
                <Feather name={feature.icon} size={20} color={theme.primary} />
              </View>
              <View style={styles.featureInfo}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  {feature.title}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {feature.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.comparisonCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Free vs Premium
          </ThemedText>
          <ComparisonRow
            feature="City comparisons"
            free="3 cities"
            premium="Unlimited"
            theme={theme}
          />
          <ComparisonRow
            feature="Saved cities"
            free="5 cities"
            premium="Unlimited"
            theme={theme}
          />
          <ComparisonRow
            feature="Detailed reports"
            free={false}
            premium={true}
            theme={theme}
          />
          <ComparisonRow
            feature="Priority support"
            free={false}
            premium={true}
            theme={theme}
          />
          <ComparisonRow
            feature="Early access"
            free={false}
            premium={true}
            theme={theme}
          />
        </View>

        <Pressable
          onPress={handleUpgrade}
          style={[styles.upgradeButton, { backgroundColor: theme.primary }]}
        >
          <Feather name="star" size={20} color={theme.buttonText} />
          <ThemedText style={[styles.upgradeButtonText, { color: theme.buttonText }]}>
            Upgrade to Premium
          </ThemedText>
        </Pressable>

        <ThemedText type="small" style={[styles.disclaimer, { color: theme.textSecondary }]}>
          Payment will be charged to your account. Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
        </ThemedText>
      </ScrollView>
    </View>
  );
}

interface ComparisonRowProps {
  feature: string;
  free: string | boolean;
  premium: string | boolean;
  theme: any;
}

function ComparisonRow({ feature, free, premium, theme }: ComparisonRowProps) {
  return (
    <View style={[styles.comparisonRow, { borderColor: theme.cardBorder }]}>
      <ThemedText type="body" style={styles.comparisonFeature}>
        {feature}
      </ThemedText>
      <View style={styles.comparisonValues}>
        <View style={styles.comparisonValue}>
          {typeof free === "boolean" ? (
            <Feather
              name={free ? "check" : "x"}
              size={18}
              color={free ? theme.success : theme.textSecondary}
            />
          ) : (
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              {free}
            </ThemedText>
          )}
        </View>
        <View style={styles.comparisonValue}>
          {typeof premium === "boolean" ? (
            <Feather
              name={premium ? "check" : "x"}
              size={18}
              color={premium ? theme.success : theme.textSecondary}
            />
          ) : (
            <ThemedText type="small" style={{ color: theme.primary, fontWeight: "600" }}>
              {premium}
            </ThemedText>
          )}
        </View>
      </View>
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
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  premiumBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  pricingCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  pricingLabel: {
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: 40,
    fontWeight: "700",
  },
  featuresCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  featureInfo: {
    flex: 1,
  },
  comparisonCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  comparisonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  comparisonFeature: {
    flex: 1,
  },
  comparisonValues: {
    flexDirection: "row",
    width: 140,
  },
  comparisonValue: {
    width: 70,
    alignItems: "center",
  },
  upgradeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  disclaimer: {
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: Spacing.lg,
  },
});
