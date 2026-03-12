import React from "react";
import { StyleSheet, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
  showCheckmark?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Chip({
  label,
  selected = false,
  onPress,
  disabled = false,
  showCheckmark = true,
}: ChipProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.backgroundSecondary,
          borderColor: selected ? theme.primary : theme.border,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
      ]}
    >
      {selected && showCheckmark ? (
        <View style={styles.checkmark}>
          <Feather name="check" size={14} color={theme.buttonText} />
        </View>
      ) : null}
      <ThemedText
        style={[
          styles.label,
          { color: selected ? theme.buttonText : theme.text },
        ]}
      >
        {label}
      </ThemedText>
    </AnimatedPressable>
  );
}

interface ChipGroupProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  multiSelect?: boolean;
  disabled?: boolean;
}

export function ChipGroup({
  options,
  selected,
  onChange,
  multiSelect = false,
  disabled = false,
}: ChipGroupProps) {
  const handlePress = (option: string) => {
    if (multiSelect) {
      if (selected.includes(option)) {
        onChange(selected.filter((s) => s !== option));
      } else {
        onChange([...selected, option]);
      }
    } else {
      onChange(selected.includes(option) ? [] : [option]);
    }
  };

  return (
    <View style={styles.chipGroup}>
      {options.map((option) => (
        <Chip
          key={option}
          label={option}
          selected={selected.includes(option)}
          onPress={() => handlePress(option)}
          disabled={disabled}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  checkmark: {
    marginRight: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
