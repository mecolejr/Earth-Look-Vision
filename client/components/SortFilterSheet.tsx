import React from "react";
import { StyleSheet, View, Pressable, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

export type SortOption = 
  | "match" 
  | "safety" 
  | "lgbtq" 
  | "diversity" 
  | "cost" 
  | "climate";

interface SortOptionConfig {
  id: SortOption;
  label: string;
  icon: string;
  description: string;
}

const SORT_OPTIONS: SortOptionConfig[] = [
  {
    id: "match",
    label: "Best Match",
    icon: "star",
    description: "Overall compatibility score",
  },
  {
    id: "safety",
    label: "Safety Score",
    icon: "shield",
    description: "Crime rates and hate crime data",
  },
  {
    id: "lgbtq",
    label: "LGBTQ+ Community",
    icon: "heart",
    description: "LGBTQ+ population and protections",
  },
  {
    id: "diversity",
    label: "Diversity",
    icon: "users",
    description: "Ethnic and cultural diversity",
  },
  {
    id: "cost",
    label: "Cost of Living",
    icon: "dollar-sign",
    description: "Most affordable cities first",
  },
  {
    id: "climate",
    label: "Climate",
    icon: "sun",
    description: "Weather and outdoor activities",
  },
];

interface SortFilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SortFilterSheet({
  visible,
  onClose,
  selectedSort,
  onSortChange,
}: SortFilterSheetProps) {
  const { theme } = useTheme();

  const handleSelect = (option: SortOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSortChange(option);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View 
          entering={FadeIn.duration(200)}
          style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.4)" }]} 
        />
      </Pressable>
      
      <Animated.View
        entering={SlideInDown.springify().damping(20).stiffness(200)}
        style={[
          styles.sheet,
          { backgroundColor: theme.backgroundDefault },
        ]}
      >
        <View style={styles.handle}>
          <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
        </View>

        <ThemedText type="h4" style={styles.title}>
          Sort Cities By
        </ThemedText>

        <View style={styles.optionsList}>
          {SORT_OPTIONS.map((option) => (
            <Pressable
              key={option.id}
              onPress={() => handleSelect(option.id)}
              style={[
                styles.optionItem,
                {
                  backgroundColor:
                    selectedSort === option.id
                      ? theme.primary + "15"
                      : "transparent",
                  borderColor:
                    selectedSort === option.id ? theme.primary : theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.optionIcon,
                  {
                    backgroundColor:
                      selectedSort === option.id
                        ? theme.primary
                        : theme.backgroundSecondary,
                  },
                ]}
              >
                <Feather
                  name={option.icon as any}
                  size={18}
                  color={selectedSort === option.id ? "#FFFFFF" : theme.text}
                />
              </View>
              <View style={styles.optionContent}>
                <ThemedText
                  style={[
                    styles.optionLabel,
                    selectedSort === option.id && { color: theme.primary },
                  ]}
                >
                  {option.label}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={{ color: theme.textSecondary }}
                >
                  {option.description}
                </ThemedText>
              </View>
              {selectedSort === option.id ? (
                <Feather name="check" size={20} color={theme.primary} />
              ) : null}
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Spacing["4xl"],
  },
  handle: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  title: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  optionsList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontWeight: "600",
    marginBottom: 2,
  },
});
