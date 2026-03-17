import React, { useState } from "react";
import { StyleSheet, Pressable, View, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface InfoTooltipProps {
  title: string;
  description: string;
}

export function InfoTooltip({ title, description }: InfoTooltipProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePress}
          onPressIn={() => {
            scale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
          }}
          onPressOut={() => {
            scale.value = withSpring(1, { damping: 15, stiffness: 200 });
          }}
          style={[styles.iconButton, { backgroundColor: theme.primary + "15" }]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="help-circle" size={14} color={theme.primary} />
        </Pressable>
      </Animated.View>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.overlay} onPress={handleClose}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={[
              styles.tooltipCard,
              {
                backgroundColor: theme.backgroundElevated,
                shadowColor: theme.text,
              },
            ]}
          >
            <View style={styles.tooltipHeader}>
              <Feather name="info" size={18} color={theme.primary} />
              <ThemedText type="headline" style={styles.tooltipTitle}>
                {title}
              </ThemedText>
            </View>
            <ThemedText
              type="body"
              style={[styles.tooltipDescription, { color: theme.textSecondary }]}
            >
              {description}
            </ThemedText>
            <Pressable
              onPress={handleClose}
              style={[styles.closeButton, { backgroundColor: theme.primary + "15" }]}
            >
              <ThemedText style={[styles.closeButtonText, { color: theme.primary }]}>
                Got it
              </ThemedText>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.xs,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing["2xl"],
  },
  tooltipCard: {
    width: "100%",
    maxWidth: 320,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tooltipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  tooltipTitle: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  tooltipDescription: {
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  closeButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
