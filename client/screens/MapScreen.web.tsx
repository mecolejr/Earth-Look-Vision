import React from "react";
import { StyleSheet, View, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useCities } from "@/hooks/useCities";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { DEFAULT_IDENTITY, DEFAULT_PRIORITIES, DEFAULT_PRIVACY_SETTINGS } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { profile } = useUserProfile();
  const { cities, isLoading } = useCities({
    identity: profile?.identity || DEFAULT_IDENTITY,
    priorities: profile?.priorities || DEFAULT_PRIORITIES,
    privacySettings: profile?.privacySettings || DEFAULT_PRIVACY_SETTINGS,
  });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getMarkerColor = (score: number) => {
    if (score >= 80) return theme.success;
    if (score >= 60) return theme.primary;
    if (score >= 40) return theme.warning;
    return theme.danger;
  };

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText style={{ marginTop: Spacing.md }}>Loading cities...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        contentContainerStyle={[styles.webFallbackContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.webFallbackHeader}>
          <Feather name="map" size={64} color={theme.primary} />
          <ThemedText style={[styles.webFallbackTitle, { fontFamily: Fonts?.serifBold }]}>
            Interactive Map
          </ThemedText>
          <ThemedText style={[styles.webFallbackSubtitle, { color: theme.textSecondary }]}>
            Run this app in Expo Go on your phone to use the interactive map feature with Google Maps.
          </ThemedText>
        </View>

        <ThemedText style={[styles.webFallbackSectionTitle, { fontFamily: Fonts?.serifBold }]}>
          Your City Matches
        </ThemedText>

        {cities.slice(0, 10).map((city) => (
          <Pressable
            key={city.id}
            style={[styles.webCityCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}
            onPress={() => navigation.navigate("CityDetail", { cityId: city.id })}
          >
            <View style={styles.webCityCardHeader}>
              <View style={styles.webCityInfo}>
                <ThemedText style={[styles.webCityName, { fontFamily: Fonts?.serifBold }]}>
                  {city.name}
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  {city.state ? `${city.state}, ` : ""}{city.country}
                </ThemedText>
              </View>
              <View style={[styles.webScoreBadge, { backgroundColor: getMarkerColor(city.matchScore) }]}>
                <ThemedText style={styles.webScoreText}>{Math.round(city.matchScore)}</ThemedText>
              </View>
            </View>
            <View style={styles.webCityStats}>
              <View style={styles.webStatItem}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Safety</ThemedText>
                <ThemedText>{city.scoreBreakdown.safety}</ThemedText>
              </View>
              <View style={styles.webStatItem}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>LGBTQ+</ThemedText>
                <ThemedText>{city.scoreBreakdown.lgbtqAcceptance}</ThemedText>
              </View>
              <View style={styles.webStatItem}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Cost</ThemedText>
                <ThemedText>{city.scoreBreakdown.costOfLiving}</ThemedText>
              </View>
              <View style={styles.webStatItem}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Climate</ThemedText>
                <ThemedText>{city.scoreBreakdown.climate}</ThemedText>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webFallbackContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  webFallbackHeader: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  webFallbackTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  webFallbackSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  webFallbackSectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: Spacing.lg,
  },
  webCityCard: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  webCityCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  webCityInfo: {
    flex: 1,
  },
  webCityName: {
    fontSize: 18,
    fontWeight: "600",
  },
  webScoreBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  webScoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  webCityStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  webStatItem: {
    alignItems: "center",
  },
});
