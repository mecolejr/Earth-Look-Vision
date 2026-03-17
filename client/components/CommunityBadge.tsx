import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { CommunityVerification } from "@/types";
import { Spacing, BorderRadius } from "@/constants/theme";

interface CommunityBadgeProps {
  community: CommunityVerification;
  variant?: "compact" | "full";
  onPress?: () => void;
}

const COMMUNITY_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  lgbtq: { label: "LGBTQ+", icon: "heart" },
  bipoc: { label: "BIPOC", icon: "users" },
  immigrants: { label: "Immigrant", icon: "globe" },
  disability: { label: "Disability", icon: "shield" },
  general: { label: "Active", icon: "check-circle" },
};

export function CommunityBadge({
  community,
  variant = "compact",
  onPress,
}: CommunityBadgeProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  if (!community.isVerified) {
    return null;
  }

  const typeInfo = COMMUNITY_TYPE_LABELS[community.communityType || "general"];

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (variant === "compact") {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!onPress}
      >
        <Animated.View
          style={[
            styles.compactBadge,
            { backgroundColor: theme.success + "20" },
            animatedStyle,
          ]}
        >
          <Feather name="check-circle" size={12} color={theme.success} />
          <ThemedText style={[styles.compactText, { color: theme.success }]}>
            Verified
          </ThemedText>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress}
    >
      <Animated.View
        style={[
          styles.fullBadge,
          {
            backgroundColor: theme.success + "15",
            borderColor: theme.success + "40",
          },
          animatedStyle,
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.success + "25" }]}>
          <Feather name={typeInfo.icon as any} size={18} color={theme.success} />
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Feather name="check-circle" size={14} color={theme.success} />
            <ThemedText style={[styles.title, { color: theme.success }]}>
              Community Verified
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {community.communityName || `${typeInfo.label} Community`}
            {community.memberCount ? ` · ${community.memberCount.toLocaleString()} members` : ""}
          </ThemedText>
        </View>
        {onPress ? (
          <Feather name="chevron-right" size={18} color={theme.textSecondary} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  compactText: {
    fontSize: 11,
    fontWeight: "600",
  },
  fullBadge: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
});
