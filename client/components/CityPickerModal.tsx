import React, { useState, useMemo } from "react";
import { StyleSheet, View, Modal, Pressable, FlatList, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { CITIES } from "@/data/cities";
import { City } from "@/types";

interface CityPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCity: (cityId: string) => void;
  selectedCityId?: string;
  title?: string;
  excludeCityId?: string;
}

export function CityPickerModal({
  visible,
  onClose,
  onSelectCity,
  selectedCityId,
  title = "Select Your City",
  excludeCityId,
}: CityPickerModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCities = useMemo(() => {
    let cities = CITIES;
    if (excludeCityId) {
      cities = cities.filter(c => c.id !== excludeCityId);
    }
    if (!searchQuery) return cities;
    const query = searchQuery.toLowerCase();
    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        (city.state && city.state.toLowerCase().includes(query)) ||
        city.country.toLowerCase().includes(query)
    );
  }, [searchQuery, excludeCityId]);

  const handleSelect = (cityId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectCity(cityId);
    onClose();
    setSearchQuery("");
  };

  const renderCity = ({ item }: { item: City }) => (
    <Pressable
      onPress={() => handleSelect(item.id)}
      style={({ pressed }) => [
        styles.cityItem,
        {
          backgroundColor: selectedCityId === item.id 
            ? theme.primary + "15" 
            : pressed 
              ? theme.backgroundSecondary 
              : "transparent",
          borderBottomColor: theme.border,
        },
      ]}
    >
      <View style={styles.cityInfo}>
        <ThemedText style={[styles.cityName, selectedCityId === item.id && { color: theme.primary }]}>
          {item.name}
        </ThemedText>
        <ThemedText type="small" style={{ color: theme.textSecondary }}>
          {item.state ? `${item.state}, ` : ""}{item.country}
        </ThemedText>
      </View>
      {selectedCityId === item.id ? (
        <Feather name="check" size={20} color={theme.primary} />
      ) : null}
    </Pressable>
  );

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
          { 
            backgroundColor: theme.backgroundDefault,
            paddingBottom: insets.bottom + Spacing.lg,
          },
        ]}
      >
        <View style={styles.handle}>
          <View style={[styles.handleBar, { backgroundColor: theme.border }]} />
        </View>

        <View style={styles.header}>
          <ThemedText type="h4">{title}</ThemedText>
          <Pressable onPress={onClose} hitSlop={12}>
            <Feather name="x" size={24} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.backgroundSecondary, borderColor: theme.border }]}>
          <Feather name="search" size={18} color={theme.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search cities..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery("")}>
              <Feather name="x" size={16} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <FlatList
          data={filteredCities}
          renderItem={renderCity}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                No cities found matching "{searchQuery}"
              </ThemedText>
            </View>
          }
        />
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
    maxHeight: "80%",
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  listContent: {
    paddingBottom: Spacing.lg,
  },
  cityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontWeight: "600",
    marginBottom: 2,
  },
  emptyState: {
    alignItems: "center",
    padding: Spacing.xl,
  },
});
