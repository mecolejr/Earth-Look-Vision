import React from "react";
import { StyleSheet, View, Pressable, Linking, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Partner, getPartnerTypeLabel, getPartnerTypeIcon } from "@/data/partners";

interface PartnerCardProps {
  partner: Partner;
}

export function PartnerCard({ partner }: PartnerCardProps) {
  const { theme } = useTheme();

  const handleContact = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      `Contact ${partner.name}`,
      "How would you like to reach out?",
      [
        {
          text: "Email",
          onPress: () => Linking.openURL(`mailto:${partner.contactEmail}`),
        },
        partner.phone
          ? {
              text: "Call",
              onPress: () => Linking.openURL(`tel:${partner.phone}`),
            }
          : null,
        partner.website
          ? {
              text: "Website",
              onPress: () => Linking.openURL(partner.website!),
            }
          : null,
        { text: "Cancel", style: "cancel" },
      ].filter(Boolean) as any
    );
  };

  const iconName = getPartnerTypeIcon(partner.type) as any;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
          <Feather name={iconName} size={20} color={theme.primary} />
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <ThemedText type="body" style={styles.name} numberOfLines={1}>
              {partner.name}
            </ThemedText>
            {partner.verified ? (
              <View style={[styles.verifiedBadge, { backgroundColor: theme.success + "20" }]}>
                <Feather name="check" size={12} color={theme.success} />
              </View>
            ) : null}
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {getPartnerTypeLabel(partner.type)}
          </ThemedText>
        </View>
      </View>

      <ThemedText type="small" style={[styles.specialty, { color: theme.primary }]}>
        {partner.specialty}
      </ThemedText>

      <ThemedText type="small" style={[styles.description, { color: theme.textSecondary }]}>
        {partner.description}
      </ThemedText>

      <View style={styles.metaRow}>
        <View style={styles.ratingContainer}>
          <Feather name="star" size={14} color={theme.warning} />
          <ThemedText type="small" style={styles.rating}>
            {partner.rating}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            ({partner.reviewCount})
          </ThemedText>
        </View>

        {partner.lgbtqFriendly ? (
          <View style={[styles.lgbtqBadge, { backgroundColor: theme.primary + "15" }]}>
            <ThemedText style={[styles.lgbtqText, { color: theme.primary }]}>
              LGBTQ+ Friendly
            </ThemedText>
          </View>
        ) : null}
      </View>

      {partner.languages.length > 1 ? (
        <View style={styles.languagesRow}>
          <Feather name="globe" size={12} color={theme.textSecondary} />
          <ThemedText type="small" style={[styles.languages, { color: theme.textSecondary }]}>
            {partner.languages.join(", ")}
          </ThemedText>
        </View>
      ) : null}

      <Pressable
        onPress={handleContact}
        style={[styles.contactButton, { backgroundColor: theme.primary }]}
      >
        <Feather name="message-circle" size={16} color={theme.buttonText} />
        <ThemedText style={[styles.contactText, { color: theme.buttonText }]}>
          Contact
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontWeight: "600",
    flex: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.xs,
  },
  specialty: {
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  description: {
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontWeight: "600",
    marginLeft: 4,
    marginRight: 4,
  },
  lgbtqBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  lgbtqText: {
    fontSize: 11,
    fontWeight: "600",
  },
  languagesRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  languages: {
    marginLeft: Spacing.xs,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  contactText: {
    fontWeight: "600",
  },
});
