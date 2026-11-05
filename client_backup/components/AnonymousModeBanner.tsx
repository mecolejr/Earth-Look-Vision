import React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius } from "@/constants/theme";

interface AnonymousModeBannerProps {
  compact?: boolean;
}

export function AnonymousModeBanner({ compact = false }: AnonymousModeBannerProps) {
  const { theme } = useTheme();
  const { isAnonymousMode, exitAnonymousMode } = useUserProfile();

  if (!isAnonymousMode) return null;

  const handleCreateProfile = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await exitAnonymousMode();
  };

  if (compact) {
    return (
      <Animated.View
        entering={FadeInDown.duration(300).springify()}
        style={[
          styles.compactBanner,
          {
            backgroundColor: theme.primary + "15",
            borderColor: theme.primary + "30",
          },
        ]}
      >
        <Feather name="eye-off" size={14} color={theme.primary} />
        <ThemedText type="small" style={[styles.compactText, { color: theme.primary }]}>
          Anonymous mode
        </ThemedText>
        <Pressable onPress={handleCreateProfile} hitSlop={8}>
          <ThemedText type="small" style={[styles.upgradeLink, { color: theme.primary }]}>
            Personalize
          </ThemedText>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      style={[
        styles.banner,
        {
          backgroundColor: theme.primary + "15",
          borderColor: theme.primary + "30",
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Feather name="eye-off" size={20} color={theme.primary} />
      </View>
      <View style={styles.content}>
        <ThemedText type="h4" style={styles.title}>
          Anonymous Mode
        </ThemedText>
        <ThemedText type="small" style={[styles.description, { color: theme.textSecondary }]}>
          You're seeing general city statistics. Create a profile to get personalized scores based on your identity.
        </ThemedText>
      </View>
      <Pressable
        onPress={handleCreateProfile}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <ThemedText type="small" style={[styles.buttonText, { color: "#FFFFFF" }]}>
          Create Profile
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
    marginRight: Spacing.md,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  description: {
    lineHeight: 18,
  },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    fontWeight: "600",
  },
  compactBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  compactText: {
    flex: 1,
    fontWeight: "500",
  },
  upgradeLink: {
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
