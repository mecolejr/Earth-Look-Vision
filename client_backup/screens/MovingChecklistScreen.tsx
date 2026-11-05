import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getCityById } from "@/data/cities";
import {
  getMovingChecklist,
  createMovingChecklist,
  toggleChecklistItem,
  addCustomChecklistItem,
  deleteChecklistItem,
  MovingChecklist,
  ChecklistItem,
} from "@/lib/storage";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

interface MovingChecklistScreenProps {
  route: RouteProp<RootStackParamList, "MovingChecklist">;
}

const CATEGORY_CONFIG = {
  before: {
    title: "Before You Move",
    icon: "calendar" as const,
    description: "Preparation tasks",
  },
  during: {
    title: "Moving Day & Week",
    icon: "truck" as const,
    description: "Transition tasks",
  },
  after: {
    title: "After You Arrive",
    icon: "home" as const,
    description: "Settlement tasks",
  },
};

export default function MovingChecklistScreen({
  route,
}: MovingChecklistScreenProps) {
  const { cityId } = route.params;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const [checklist, setChecklist] = useState<MovingChecklist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemText, setNewItemText] = useState("");
  const [activeCategory, setActiveCategory] = useState<"before" | "during" | "after">("before");
  const [showAddForm, setShowAddForm] = useState(false);

  const city = getCityById(cityId);

  const loadChecklist = useCallback(async () => {
    setIsLoading(true);
    let existingChecklist = await getMovingChecklist(cityId);
    if (!existingChecklist) {
      existingChecklist = await createMovingChecklist(cityId);
    }
    setChecklist(existingChecklist);
    setIsLoading(false);
  }, [cityId]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  const handleToggleItem = async (itemId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updated = await toggleChecklistItem(cityId, itemId);
    if (updated) setChecklist(updated);
  };

  const handleAddItem = async () => {
    if (!newItemText.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated = await addCustomChecklistItem(cityId, newItemText.trim(), activeCategory);
    if (updated) {
      setChecklist(updated);
      setNewItemText("");
      setShowAddForm(false);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to remove this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            const updated = await deleteChecklistItem(cityId, itemId);
            if (updated) setChecklist(updated);
          },
        },
      ]
    );
  };

  const getProgress = () => {
    if (!checklist) return { completed: 0, total: 0, percentage: 0 };
    const completed = checklist.items.filter((item) => item.completed).length;
    const total = checklist.items.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const getCategoryItems = (category: "before" | "during" | "after") => {
    if (!checklist) return [];
    return checklist.items.filter((item) => item.category === category);
  };

  const getCategoryProgress = (category: "before" | "during" | "after") => {
    const items = getCategoryItems(category);
    const completed = items.filter((item) => item.completed).length;
    return { completed, total: items.length };
  };

  const progress = getProgress();

  if (isLoading || !checklist) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading checklist...</ThemedText>
        </View>
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
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + "20" }]}>
            <Feather name="check-square" size={32} color={theme.primary} />
          </View>
          <ThemedText type="h4" style={styles.title}>
            Moving to {city?.name || "New City"}
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            Track your moving tasks and stay organized
          </ThemedText>
        </View>

        <View style={[styles.progressCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
          <View style={styles.progressHeader}>
            <ThemedText type="h4">Overall Progress</ThemedText>
            <ThemedText style={[styles.progressPercent, { color: theme.primary }]}>
              {progress.percentage}%
            </ThemedText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.backgroundTertiary }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: theme.success, width: `${progress.percentage}%` },
              ]}
            />
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: Spacing.sm }}>
            {progress.completed} of {progress.total} tasks completed
          </ThemedText>
        </View>

        {(["before", "during", "after"] as const).map((category) => {
          const config = CATEGORY_CONFIG[category];
          const categoryProgress = getCategoryProgress(category);
          const items = getCategoryItems(category);

          return (
            <View key={category} style={styles.categorySection}>
              <Pressable
                onPress={() => setActiveCategory(activeCategory === category ? activeCategory : category)}
                style={[
                  styles.categoryHeader,
                  { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
                ]}
              >
                <View style={[styles.categoryIcon, { backgroundColor: theme.primary + "20" }]}>
                  <Feather name={config.icon} size={20} color={theme.primary} />
                </View>
                <View style={styles.categoryInfo}>
                  <ThemedText type="h4">{config.title}</ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {categoryProgress.completed}/{categoryProgress.total} completed
                  </ThemedText>
                </View>
                <View style={[styles.categoryBadge, { backgroundColor: theme.success + "20" }]}>
                  <ThemedText style={[styles.categoryBadgeText, { color: theme.success }]}>
                    {categoryProgress.total > 0
                      ? Math.round((categoryProgress.completed / categoryProgress.total) * 100)
                      : 0}%
                  </ThemedText>
                </View>
              </Pressable>

              <View style={[styles.itemsList, { borderColor: theme.cardBorder }]}>
                {items.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    theme={theme}
                    onToggle={() => handleToggleItem(item.id)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))}

                {activeCategory === category && showAddForm ? (
                  <View style={[styles.addItemForm, { borderColor: theme.cardBorder }]}>
                    <TextInput
                      style={[
                        styles.addItemInput,
                        { color: theme.text, borderColor: theme.cardBorder },
                      ]}
                      placeholder="Add a custom task..."
                      placeholderTextColor={theme.textSecondary}
                      value={newItemText}
                      onChangeText={setNewItemText}
                      onSubmitEditing={handleAddItem}
                    />
                    <View style={styles.addItemButtons}>
                      <Pressable
                        onPress={() => {
                          setShowAddForm(false);
                          setNewItemText("");
                        }}
                        style={[styles.addItemButton, { backgroundColor: theme.backgroundTertiary }]}
                      >
                        <ThemedText type="small">Cancel</ThemedText>
                      </Pressable>
                      <Pressable
                        onPress={handleAddItem}
                        style={[styles.addItemButton, { backgroundColor: theme.primary }]}
                      >
                        <ThemedText type="small" style={{ color: theme.buttonText }}>Add</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ) : activeCategory === category ? (
                  <Pressable
                    onPress={() => setShowAddForm(true)}
                    style={[styles.addButton, { borderColor: theme.cardBorder }]}
                  >
                    <Feather name="plus" size={18} color={theme.primary} />
                    <ThemedText type="small" style={{ color: theme.primary, marginLeft: Spacing.sm }}>
                      Add custom task
                    </ThemedText>
                  </Pressable>
                ) : null}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

interface ChecklistItemRowProps {
  item: ChecklistItem;
  theme: any;
  onToggle: () => void;
  onDelete: () => void;
}

function ChecklistItemRow({ item, theme, onToggle, onDelete }: ChecklistItemRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    onToggle();
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        onLongPress={onDelete}
        style={[
          styles.itemRow,
          {
            backgroundColor: item.completed ? theme.success + "10" : theme.backgroundDefault,
            borderColor: theme.cardBorder,
          },
        ]}
      >
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: item.completed ? theme.success : "transparent",
              borderColor: item.completed ? theme.success : theme.textSecondary,
            },
          ]}
        >
          {item.completed ? (
            <Feather name="check" size={14} color={theme.buttonText} />
          ) : null}
        </View>
        <ThemedText
          style={[
            styles.itemText,
            {
              color: item.completed ? theme.textSecondary : theme.text,
              textDecorationLine: item.completed ? "line-through" : "none",
            },
          ]}
        >
          {item.text}
        </ThemedText>
      </Pressable>
    </Animated.View>
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
  },
  progressCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing["2xl"],
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.md,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: "700",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  categorySection: {
    marginBottom: Spacing.xl,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemsList: {
    marginTop: Spacing.sm,
    borderLeftWidth: 2,
    marginLeft: 22,
    paddingLeft: Spacing.lg,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  addItemForm: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  addItemInput: {
    fontSize: 15,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  addItemButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.sm,
  },
  addItemButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
});
