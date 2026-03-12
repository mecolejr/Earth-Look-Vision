import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

interface ProgressIndicatorProps {
  steps: number;
  currentStep: number;
}

export function ProgressIndicator({ steps, currentStep }: ProgressIndicatorProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: steps }).map((_, index) => {
        const isActive = index <= currentStep;
        const isCurrent = index === currentStep;

        return (
          <View
            key={index}
            style={[
              styles.step,
              {
                backgroundColor: isActive
                  ? theme.primary
                  : theme.backgroundSecondary,
                flex: isCurrent ? 2 : 1,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  const { theme } = useTheme();

  const animatedWidth = useAnimatedStyle(() => ({
    width: withTiming(`${Math.min(100, Math.max(0, progress))}%`, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  return (
    <View
      style={[styles.barTrack, { backgroundColor: theme.backgroundSecondary }]}
    >
      <Animated.View
        style={[styles.barFill, { backgroundColor: theme.primary }, animatedWidth]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: Spacing.xs,
    height: 4,
  },
  step: {
    borderRadius: 2,
    height: "100%",
  },
  barTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 2,
  },
});
