import React, { useState, useMemo, useRef, useEffect } from "react";
import { StyleSheet, View, Pressable, Platform, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useCities, ScoredCity } from "@/hooks/useCities";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { DEFAULT_IDENTITY, DEFAULT_PRIORITIES, DEFAULT_PRIVACY_SETTINGS } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

interface DistanceInfo {
  distance: string;
  duration: string;
}

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
  const mapRef = useRef<MapView>(null);
  
  const [selectedCity, setSelectedCity] = useState<ScoredCity | null>(null);
  const [distances, setDistances] = useState<Record<string, DistanceInfo>>({});
  const [distanceLoading, setDistanceLoading] = useState(false);

  const currentCityCoords = useMemo(() => {
    if (!profile?.currentCityId) return null;
    const currentCity = cities.find(c => c.id === profile.currentCityId);
    if (currentCity) {
      return { lat: currentCity.coordinates.lat, lon: currentCity.coordinates.lon };
    }
    return null;
  }, [profile?.currentCityId, cities]);

  useEffect(() => {
    async function fetchDistances() {
      if (!currentCityCoords || cities.length === 0) return;
      
      setDistanceLoading(true);
      try {
        const apiUrl = getApiUrl();
        const destinations = cities
          .filter(c => c.id !== profile?.currentCityId)
          .map(c => `${c.coordinates.lat},${c.coordinates.lon}`)
          .join("|");
        
        const response = await fetch(
          new URL(
            `/api/distances?origin=${currentCityCoords.lat},${currentCityCoords.lon}&destinations=${destinations}`,
            apiUrl
          ).toString()
        );
        
        if (response.ok) {
          const data = await response.json();
          const distanceMap: Record<string, DistanceInfo> = {};
          cities.filter(c => c.id !== profile?.currentCityId).forEach((city, index) => {
            if (data.distances && data.distances[index]) {
              distanceMap[city.id] = data.distances[index];
            }
          });
          setDistances(distanceMap);
        }
      } catch (error) {
        console.log("Failed to fetch distances");
      } finally {
        setDistanceLoading(false);
      }
    }
    
    fetchDistances();
  }, [currentCityCoords, cities, profile?.currentCityId]);

  const initialRegion = useMemo(() => {
    if (cities.length === 0) {
      return {
        latitude: 39.8283,
        longitude: -98.5795,
        latitudeDelta: 40,
        longitudeDelta: 40,
      };
    }
    
    const lats = cities.map(c => c.coordinates.lat);
    const lons = cities.map(c => c.coordinates.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 10),
      longitudeDelta: Math.max((maxLon - minLon) * 1.5, 10),
    };
  }, [cities]);

  const handleMarkerPress = (city: ScoredCity) => {
    setSelectedCity(city);
  };

  const handleCityDetailPress = () => {
    if (selectedCity) {
      navigation.navigate("CityDetail", { cityId: selectedCity.id });
    }
  };

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
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {cities.map((city) => (
          <Marker
            key={city.id}
            coordinate={{
              latitude: city.coordinates.lat,
              longitude: city.coordinates.lon,
            }}
            pinColor={getMarkerColor(city.matchScore)}
            onPress={() => handleMarkerPress(city)}
          >
            <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(city.matchScore) }]}>
              <ThemedText style={styles.markerScore}>
                {Math.round(city.matchScore)}
              </ThemedText>
            </View>
          </Marker>
        ))}
      </MapView>

      <View style={[styles.header, { paddingTop: insets.top + Spacing.md }]}>
        <View style={[styles.headerContent, { backgroundColor: theme.backgroundDefault + "F0" }]}>
          <ThemedText style={[styles.headerTitle, { fontFamily: Fonts?.serifBold }]}>
            City Map
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Tap markers to see details
          </ThemedText>
        </View>
      </View>

      {selectedCity ? (
        <View style={[styles.cityCard, { paddingBottom: insets.bottom + Spacing.lg }]}>
          <View style={[styles.cardContent, { backgroundColor: theme.backgroundDefault }]}>
            <Pressable onPress={handleCityDetailPress} style={styles.cardPressable}>
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleSection}>
                  <ThemedText style={[styles.cardCityName, { fontFamily: Fonts?.serifBold }]}>
                    {selectedCity.name}
                  </ThemedText>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {selectedCity.state ? `${selectedCity.state}, ` : ""}{selectedCity.country}
                  </ThemedText>
                </View>
                <ScoreDisplay score={selectedCity.matchScore} size="medium" />
              </View>

              {distances[selectedCity.id] ? (
                <View style={[styles.distanceRow, { backgroundColor: theme.primary + "10" }]}>
                  <Feather name="navigation" size={16} color={theme.primary} />
                  <ThemedText style={[styles.distanceText, { color: theme.primary }]}>
                    {distances[selectedCity.id].distance} drive ({distances[selectedCity.id].duration})
                  </ThemedText>
                </View>
              ) : distanceLoading && profile?.currentCityId ? (
                <View style={[styles.distanceRow, { backgroundColor: theme.primary + "10" }]}>
                  <ActivityIndicator size="small" color={theme.primary} />
                  <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
                    Calculating distance...
                  </ThemedText>
                </View>
              ) : null}

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>Safety</ThemedText>
                  <ThemedText style={styles.statValue}>{selectedCity.scoreBreakdown.safety}</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>LGBTQ+</ThemedText>
                  <ThemedText style={styles.statValue}>{selectedCity.scoreBreakdown.lgbtqAcceptance}</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>Cost</ThemedText>
                  <ThemedText style={styles.statValue}>{selectedCity.scoreBreakdown.costOfLiving}</ThemedText>
                </View>
                <View style={styles.statItem}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>Climate</ThemedText>
                  <ThemedText style={styles.statValue}>{selectedCity.scoreBreakdown.climate}</ThemedText>
                </View>
              </View>

              <View style={[styles.viewDetailsButton, { backgroundColor: theme.primary }]}>
                <ThemedText style={styles.viewDetailsText}>View Full Details</ThemedText>
                <Feather name="arrow-right" size={16} color="#fff" />
              </View>
            </Pressable>
          </View>
        </View>
      ) : null}

      {!profile?.currentCityId ? (
        <View style={[styles.tipBanner, { bottom: insets.bottom + Spacing.lg, backgroundColor: theme.warning + "20" }]}>
          <Feather name="info" size={16} color={theme.warning} />
          <ThemedText type="small" style={{ color: theme.warning, marginLeft: Spacing.sm, flex: 1 }}>
            Set your current city in the Explore tab to see driving distances
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerScore: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  cityCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.lg,
  },
  cardContent: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardPressable: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  cardTitleSection: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cardCityName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  distanceText: {
    marginLeft: Spacing.sm,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: Spacing.xs,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
  },
  viewDetailsText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  tipBanner: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
});
