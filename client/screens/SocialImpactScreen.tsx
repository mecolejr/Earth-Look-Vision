import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Pressable, Linking, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  GRANT_PROGRAMS,
  IMPACT_METRICS,
  COMMUNITY_PARTNERS,
  MISSION_STATEMENT,
  FUNDING_TRANSPARENCY,
  GrantProgram,
  ImpactMetric,
  CommunityPartner,
} from "@/data/socialImpact";

export default function SocialImpactScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [expandedGrant, setExpandedGrant] = useState<string | null>(null);

  const handleApplyForGrant = (grant: GrantProgram) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Apply for " + grant.name,
      "Applications are reviewed within 5 business days. You'll need to provide:\n\n• Proof of eligibility\n• Brief description of your situation\n• Contact information\n\nWould you like to start your application?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Start Application", 
          onPress: () => {
            Alert.alert(
              "Application Started",
              "Thank you for your interest! In the full app, you would be directed to a secure application form. For now, please contact support@earthlook.app to apply."
            );
          }
        },
      ]
    );
  };

  const toggleGrantExpanded = (grantId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedGrant(expandedGrant === grantId ? null : grantId);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { 
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: theme.success + "20" }]}>
            <Feather name="heart" size={32} color={theme.success} />
          </View>
          <ThemedText type="h2" style={styles.heroTitle}>
            Our Social Impact
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.missionText, { color: theme.textSecondary }]}
          >
            {MISSION_STATEMENT}
          </ThemedText>
        </View>

        <View style={styles.metricsSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Impact by the Numbers
          </ThemedText>
          <View style={styles.metricsGrid}>
            {IMPACT_METRICS.map((metric) => (
              <MetricCard key={metric.id} metric={metric} theme={theme} />
            ))}
          </View>
        </View>

        <View style={styles.grantsSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Grant Programs
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.sectionDescription, { color: theme.textSecondary }]}
          >
            Free premium access and support for those who need it most
          </ThemedText>
          {GRANT_PROGRAMS.map((grant) => (
            <GrantCard
              key={grant.id}
              grant={grant}
              isExpanded={expandedGrant === grant.id}
              onToggle={() => toggleGrantExpanded(grant.id)}
              onApply={() => handleApplyForGrant(grant)}
              theme={theme}
            />
          ))}
        </View>

        <View style={styles.partnersSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Community Partners
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.sectionDescription, { color: theme.textSecondary }]}
          >
            Organizations that make our mission possible
          </ThemedText>
          {COMMUNITY_PARTNERS.map((partner) => (
            <PartnerCard key={partner.id} partner={partner} theme={theme} />
          ))}
        </View>

        <View style={[styles.transparencySection, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <View style={styles.transparencyHeader}>
            <Feather name="eye" size={20} color={theme.primary} />
            <ThemedText type="h4" style={styles.transparencyTitle}>
              Funding Transparency
            </ThemedText>
          </View>
          <View style={styles.transparencyGrid}>
            <View style={styles.transparencyItem}>
              <ThemedText type="h3" style={{ color: theme.success }}>
                {FUNDING_TRANSPARENCY.totalGrantFunding}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Total Grant Funding
              </ThemedText>
            </View>
            <View style={styles.transparencyItem}>
              <ThemedText type="h3" style={{ color: theme.success }}>
                {FUNDING_TRANSPARENCY.percentToPrograms}%
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Goes to Programs
              </ThemedText>
            </View>
          </View>
          <ThemedText
            type="small"
            style={[styles.auditText, { color: theme.textSecondary }]}
          >
            Independently audited by {FUNDING_TRANSPARENCY.auditor}
          </ThemedText>
        </View>

        <View style={styles.ctaSection}>
          <ThemedText type="h4" style={styles.ctaTitle}>
            Support Our Mission
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.ctaDescription, { color: theme.textSecondary }]}
          >
            Your premium subscription helps fund free access for underserved communities
          </ThemedText>
          <Button
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Alert.alert("Thank You!", "In the full app, you would be directed to donation options or premium upgrade.");
            }}
          >
            Become a Supporter
          </Button>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

interface MetricCardProps {
  metric: ImpactMetric;
  theme: any;
}

function MetricCard({ metric, theme }: MetricCardProps) {
  return (
    <View
      style={[
        styles.metricCard,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
      ]}
    >
      <View style={[styles.metricIcon, { backgroundColor: theme.primary + "15" }]}>
        <Feather name={metric.icon as any} size={20} color={theme.primary} />
      </View>
      <ThemedText type="h3" style={[styles.metricValue, { color: theme.primary }]}>
        {metric.value}
      </ThemedText>
      <ThemedText type="small" style={styles.metricLabel}>
        {metric.label}
      </ThemedText>
    </View>
  );
}

interface GrantCardProps {
  grant: GrantProgram;
  isExpanded: boolean;
  onToggle: () => void;
  onApply: () => void;
  theme: any;
}

function GrantCard({ grant, isExpanded, onToggle, onApply, theme }: GrantCardProps) {
  const statusColor = grant.status === "active" ? theme.success : 
                      grant.status === "upcoming" ? theme.warning : theme.textSecondary;

  return (
    <View
      style={[
        styles.grantCard,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
      ]}
    >
      <Pressable onPress={onToggle} style={styles.grantHeader}>
        <View style={styles.grantTitleRow}>
          <ThemedText type="body" style={styles.grantName}>
            {grant.name}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + "20" }]}>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {grant.status.charAt(0).toUpperCase() + grant.status.slice(1)}
            </ThemedText>
          </View>
        </View>
        <Feather
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme.textSecondary}
        />
      </Pressable>

      <ThemedText
        type="small"
        style={[styles.grantDescription, { color: theme.textSecondary }]}
      >
        {grant.description}
      </ThemedText>

      {isExpanded ? (
        <View style={styles.grantDetails}>
          <ThemedText type="small" style={[styles.detailLabel, { color: theme.primary }]}>
            Eligibility:
          </ThemedText>
          {grant.eligibility.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <Feather name="check" size={12} color={theme.success} />
              <ThemedText type="small" style={[styles.bulletText, { color: theme.textSecondary }]}>
                {item}
              </ThemedText>
            </View>
          ))}

          <ThemedText type="small" style={[styles.detailLabel, { color: theme.primary, marginTop: Spacing.md }]}>
            Benefits:
          </ThemedText>
          {grant.benefits.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <Feather name="gift" size={12} color={theme.primary} />
              <ThemedText type="small" style={[styles.bulletText, { color: theme.textSecondary }]}>
                {item}
              </ThemedText>
            </View>
          ))}

          <View style={[styles.fundedByRow, { borderTopColor: theme.cardBorder }]}>
            <Feather name="heart" size={14} color={theme.success} />
            <ThemedText type="small" style={{ color: theme.textSecondary }}>
              Funded by {grant.fundedBy}
            </ThemedText>
          </View>

          {grant.status === "active" ? (
            <Pressable
              onPress={onApply}
              style={[styles.applyButton, { backgroundColor: theme.success }]}
            >
              <ThemedText style={[styles.applyButtonText, { color: theme.buttonText }]}>
                Apply Now
              </ThemedText>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

interface PartnerCardProps {
  partner: CommunityPartner;
  theme: any;
}

function PartnerCard({ partner, theme }: PartnerCardProps) {
  const typeIcon = partner.type === "foundation" ? "award" :
                   partner.type === "nonprofit" ? "heart" :
                   partner.type === "government" ? "flag" : "briefcase";

  return (
    <View
      style={[
        styles.partnerCard,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
      ]}
    >
      <View style={styles.partnerHeader}>
        <View style={[styles.partnerIcon, { backgroundColor: theme.primary + "15" }]}>
          <Feather name={typeIcon as any} size={18} color={theme.primary} />
        </View>
        <View style={styles.partnerInfo}>
          <ThemedText type="body" style={styles.partnerName}>
            {partner.name}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {partner.type.charAt(0).toUpperCase() + partner.type.slice(1)}
          </ThemedText>
        </View>
      </View>
      <ThemedText
        type="small"
        style={[styles.partnerDescription, { color: theme.textSecondary }]}
      >
        {partner.description}
      </ThemedText>
      <View style={styles.focusAreas}>
        {partner.focus.map((area, index) => (
          <View
            key={index}
            style={[styles.focusBadge, { backgroundColor: theme.primary + "10" }]}
          >
            <ThemedText style={[styles.focusText, { color: theme.primary }]}>
              {area}
            </ThemedText>
          </View>
        ))}
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
  content: {
    paddingHorizontal: Spacing.lg,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  heroTitle: {
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  missionText: {
    textAlign: "center",
    lineHeight: 24,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    marginBottom: Spacing.lg,
  },
  metricsSection: {
    marginBottom: Spacing["2xl"],
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  metricCard: {
    width: "47%",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  metricValue: {
    marginBottom: Spacing.xs,
  },
  metricLabel: {
    textAlign: "center",
    fontWeight: "500",
  },
  grantsSection: {
    marginBottom: Spacing["2xl"],
  },
  grantCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  grantHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  grantTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.sm,
  },
  grantName: {
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  grantDescription: {
    lineHeight: 20,
  },
  grantDetails: {
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  detailLabel: {
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  bulletItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  bulletText: {
    flex: 1,
    lineHeight: 18,
  },
  fundedByRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  applyButton: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: "center",
  },
  applyButtonText: {
    fontWeight: "600",
  },
  partnersSection: {
    marginBottom: Spacing["2xl"],
  },
  partnerCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  partnerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  partnerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontWeight: "600",
  },
  partnerDescription: {
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  focusAreas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  focusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  focusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  transparencySection: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing["2xl"],
  },
  transparencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  transparencyTitle: {},
  transparencyGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Spacing.md,
  },
  transparencyItem: {
    alignItems: "center",
  },
  auditText: {
    textAlign: "center",
    fontStyle: "italic",
  },
  ctaSection: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
  },
  ctaTitle: {
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  ctaDescription: {
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
});
