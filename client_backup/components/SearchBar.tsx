import React, { useState, useMemo } from "react";
import { StyleSheet, View, TextInput, Pressable, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { CITIES } from "@/data/cities";

interface SearchSuggestion {
  id: string;
  name: string;
  state?: string;
  country: string;
}

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilterPress?: () => void;
  showFilter?: boolean;
  onSelectSuggestion?: (suggestion: SearchSuggestion) => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search cities...",
  onFilterPress,
  showFilter = true,
  onSelectSuggestion,
}: SearchBarProps) {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    if (!value || value.length < 2) return [];
    const query = value.toLowerCase();
    return CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        (city.state && city.state.toLowerCase().includes(query)) ||
        city.country.toLowerCase().includes(query)
    )
      .slice(0, 5)
      .map((city) => ({
        id: city.id,
        name: city.name,
        state: city.state,
        country: city.country,
      }));
  }, [value]);

  const showSuggestions = isFocused && suggestions.length > 0;

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    onChangeText(suggestion.name);
    setIsFocused(false);
    onSelectSuggestion?.(suggestion);
  };

  const highlightMatch = (text: string, query: string) => {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return <ThemedText style={styles.suggestionName}>{text}</ThemedText>;
    
    return (
      <ThemedText style={styles.suggestionName}>
        {text.substring(0, index)}
        <ThemedText style={[styles.suggestionName, { color: theme.primary, fontWeight: "700" }]}>
          {text.substring(index, index + query.length)}
        </ThemedText>
        {text.substring(index + query.length)}
      </ThemedText>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.backgroundSecondary,
            borderColor: isFocused ? theme.primary : theme.border,
          },
        ]}
      >
        <Feather
          name="search"
          size={20}
          color={isFocused ? theme.primary : theme.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />
        {value.length > 0 ? (
          <Pressable onPress={() => onChangeText("")} style={styles.clearButton}>
            <Feather name="x" size={18} color={theme.textSecondary} />
          </Pressable>
        ) : null}
        {showFilter && onFilterPress ? (
          <Pressable onPress={onFilterPress} style={styles.filterButton}>
            <Feather name="sliders" size={20} color={theme.text} />
          </Pressable>
        ) : null}
      </View>

      {showSuggestions ? (
        <Animated.View
          entering={FadeIn.duration(150)}
          exiting={FadeOut.duration(100)}
          style={[
            styles.suggestionsContainer,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.border,
              shadowColor: theme.text,
            },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={suggestion.id}
                onPress={() => handleSelectSuggestion(suggestion)}
                style={({ pressed }) => [
                  styles.suggestionItem,
                  index < suggestions.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                  pressed && { backgroundColor: theme.backgroundSecondary },
                ]}
              >
                <Feather
                  name="map-pin"
                  size={16}
                  color={theme.textSecondary}
                  style={styles.suggestionIcon}
                />
                <View style={styles.suggestionText}>
                  {highlightMatch(suggestion.name, value)}
                  <ThemedText
                    type="small"
                    style={{ color: theme.textSecondary }}
                  >
                    {suggestion.state
                      ? `${suggestion.state}, ${suggestion.country}`
                      : suggestion.country}
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  filterButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  suggestionsContainer: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    maxHeight: 220,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  suggestionIcon: {
    marginRight: Spacing.sm,
  },
  suggestionText: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: "500",
  },
});
