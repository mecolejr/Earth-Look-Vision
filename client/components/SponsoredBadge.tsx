import React from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SponsoredBadgeProps {
  size?: "small" | "medium";
  showIcon?: boolean;
}

export function SponsoredBadge({ size = "small", showIcon = true }: SponsoredBadgeProps) {
  const { theme } = useTheme();

  const isSmall = size === "small";

  return (
    <View
      style={[
        styles.badge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
        { backgroundColor: theme.warning + "20", borderColor: theme.warning + "40" },
      ]}
    >
      {showIcon ? (
        <Feather
          name="star"
          size={isSmall ? 10 : 12}
          color={theme.warning}
          style={styles.icon}
        />
      ) : null}
      <ThemedText
        style={[
          styles.text,
          isSmall ? styles.textSmall : styles.textMedium,
          { color: theme.warning },
        ]}
      >
        Sponsored
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  badgeSmall: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  badgeMedium: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  icon: {
    marginRight: 3,
  },
  text: {
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 12,
  },
});
