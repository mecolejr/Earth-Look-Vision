import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, View, FlatList, RefreshControl, Pressable, ScrollView, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { CityCard } from "@/components/CityCard";
import { ThemedText } from "@/components/ThemedText";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { CityListSkeleton } from "@/components/SkeletonLoader";
import { SortFilterSheet, SortOption } from "@/components/SortFilterSheet";
import { CurrentCityOverlay } from "@/components/CurrentCityOverlay";
import { CityPickerModal } from "@/components/CityPickerModal";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { CITIES, searchCities, getSponsoredCities } from "@/data/cities";
import { calculateAllCityScores, calculateAllAnonymousCityScores } from "@/lib/scoring";
import { AnonymousModeBanner } from "@/components/AnonymousModeBanner";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { CityWithScore, City } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import {
  getCompareList,
  addToCompareList,
  removeFromCompareList,
} from "@/lib/storage";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { profile, hasCompletedOnboarding, isAnonymousMode, currentCityId, setCurrentCity } = useUserProfile();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [compareList, setCompareList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("match");
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  React.useEffect(() => {
    loadCompareList();
  }, []);

  const loadCompareList = async () => {
    const list = await getCompareList();
    setCompareList(list);
  };

  const sponsoredCities = useMemo(() => getSponsoredCities(), []);

  const cities = useMemo(() => {
    if (!profile) return [];

    let filteredCities = searchQuery
      ? searchCities(searchQuery)
      : CITIES;

    const scoredCities = isAnonymousMode
      ? calculateAllAnonymousCityScores(filteredCities)
      : calculateAllCityScores(
          filteredCities,
          profile.identity,
          profile.priorities,
          profile.privacySettings
        );

    const sorted = [...scoredCities];
    switch (sortOption) {
      case "match":
        return sorted.sort((a, b) => b.personalizedScore.overall - a.personalizedScore.overall);
      case "safety":
        return sorted.sort((a, b) => b.personalizedScore.breakdown.safety - a.personalizedScore.breakdown.safety);
      case "lgbtq":
        return sorted.sort((a, b) => b.personalizedScore.breakdown.lgbtqAcceptance - a.personalizedScore.breakdown.lgbtqAcceptance);
      case "diversity":
        return sorted.sort((a, b) => b.personalizedScore.breakdown.diversityInclusion - a.personalizedScore.breakdown.diversityInclusion);
      case "cost":
        return sorted.sort((a, b) => b.personalizedScore.breakdown.costOfLiving - a.personalizedScore.breakdown.costOfLiving);
      case "climate":
        return sorted.sort((a, b) => b.personalizedScore.breakdown.climate - a.personalizedScore.breakdown.climate);
      default:
        return sorted;
    }
  }, [profile, searchQuery, sortOption, isAnonymousMode]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCompareList();
    setRefreshing(false);
  }, []);

  const handleCityPress = (city: CityWithScore) => {
    navigation.navigate("CityDetail", { cityId: city.id });
  };

  const handleComparePress = async (cityId: string) => {
    if (compareList.includes(cityId)) {
      await removeFromCompareList(cityId);
      setCompareList((prev) => prev.filter((id) => id !== cityId));
    } else if (compareList.length < 3) {
      await addToCompareList(cityId);
      setCompareList((prev) => [...prev, cityId]);
    }
  };

  const renderCity = ({ item, index }: { item: CityWithScore; index: number }) => (
    <CityCard
      city={item}
      onPress={() => handleCityPress(item)}
      onComparePress={() => handleComparePress(item.id)}
      isInCompareList={compareList.includes(item.id)}
      index={index}
    />
  );

  const renderHeader = () => {
    const showSponsored = sponsoredCities.length > 0 && !searchQuery;
    
    return (
      <View>
        {isAnonymousMode ? <AnonymousModeBanner compact /> : null}
        {showSponsored ? (
          <FeaturedSponsored
            cities={sponsoredCities}
            onCityPress={(cityId) => navigation.navigate("CityDetail", { cityId })}
            theme={theme}
          />
        ) : null}
      </View>
    );
  };

  const renderEmptyState = () => {
    if (!hasCompletedOnboarding) {
      return (
        <EmptyState
          image={require("../../assets/images/empty-explore.png")}
          title="Tell us about yourself"
          description="Complete your profile to see personalized city matches based on your unique identity."
          actionLabel="Set Up Profile"
          onAction={() => navigation.navigate("Onboarding")}
        />
      );
    }

    if (searchQuery) {
      return (
        <EmptyState
          title="No cities found"
          description={`We couldn't find any cities matching "${searchQuery}"`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery("")}
        />
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop: headerHeight + Spacing.lg,
              backgroundColor: theme.backgroundRoot,
            },
          ]}
        >
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            showFilter={false}
          />
        </View>
        <View style={styles.loadingContainer}>
          <CityListSkeleton count={3} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.header,
          {
            paddingTop: headerHeight + Spacing.lg,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          showFilter={true}
          onFilterPress={() => setShowSortSheet(true)}
        />
        {sortOption !== "match" ? (
          <SortIndicator
            sortOption={sortOption}
            onClear={() => setSortOption("match")}
            theme={theme}
          />
        ) : null}
        {hasCompletedOnboarding ? (
          <View style={styles.overlayContainer}>
            <CurrentCityOverlay
              onPress={() => {
                if (currentCityId) {
                  navigation.navigate("CityDetail", { cityId: currentCityId });
                }
              }}
              onChangeCity={() => setShowCityPicker(true)}
            />
          </View>
        ) : null}
      </View>

      <FlatList
        data={cities}
        renderItem={renderCity}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing["3xl"] },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        initialNumToRender={3}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: 280,
          offset: 280 * index,
          index,
        })}
      />

      <SortFilterSheet
        visible={showSortSheet}
        onClose={() => setShowSortSheet(false)}
        selectedSort={sortOption}
        onSortChange={setSortOption}
      />

      <CityPickerModal
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onSelectCity={(cityId) => setCurrentCity(cityId)}
        selectedCityId={currentCityId}
        title="Set Your Current City"
      />
    </View>
  );
}

interface SortIndicatorProps {
  sortOption: SortOption;
  onClear: () => void;
  theme: any;
}

function SortIndicator({ sortOption, onClear, theme }: SortIndicatorProps) {
  const labels: Record<SortOption, string> = {
    match: "Best Match",
    safety: "Safety Score",
    lgbtq: "LGBTQ+ Community",
    diversity: "Diversity",
    cost: "Cost of Living",
    climate: "Climate",
  };

  return (
    <View style={sortIndicatorStyles.container}>
      <View
        style={[
          sortIndicatorStyles.chip,
          { backgroundColor: theme.primary + "20" },
        ]}
      >
        <ThemedText
          type="small"
          style={[sortIndicatorStyles.label, { color: theme.primary }]}
        >
          Sorted by: {labels[sortOption]}
        </ThemedText>
        <Pressable onPress={onClear} hitSlop={8} accessibilityLabel="Clear search" accessibilityRole="button">
          <Feather name="x" size={14} color={theme.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const sortIndicatorStyles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  label: {
    fontWeight: "500",
  },
});

interface FeaturedSponsoredProps {
  cities: City[];
  onCityPress: (cityId: string) => void;
  theme: any;
}

function FeaturedSponsored({ cities, onCityPress, theme }: FeaturedSponsoredProps) {
  if (cities.length === 0) return null;

  return (
    <View style={sponsoredStyles.container}>
      <View style={sponsoredStyles.header}>
        <ThemedText type="h4" style={sponsoredStyles.title}>
          Featured Cities
        </ThemedText>
        <SponsoredBadge size="medium" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sponsoredStyles.scrollContent}
      >
        {cities.map((city) => (
          <Pressable
            key={city.id}
            onPress={() => onCityPress(city.id)}
            accessibilityLabel={`View ${city.name} details`}
            accessibilityRole="button"
            style={[
              sponsoredStyles.card,
              { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
            ]}
          >
            <Image
              // TODO: replace with real sponsored city image when available
              source={require("../../assets/images/empty-explore.png")}
              style={sponsoredStyles.cardImage}
              resizeMode="cover"
            />
            <View style={sponsoredStyles.cardContent}>
              <ThemedText type="body" style={sponsoredStyles.cardTitle}>
                {city.name}
              </ThemedText>
              <ThemedText type="small" style={[sponsoredStyles.cardSubtitle, { color: theme.textSecondary }]}>
                {city.state ? `${city.state}, ` : ""}{city.country}
              </ThemedText>
              {city.sponsored?.sponsorMessage ? (
                <ThemedText
                  type="small"
                  style={[sponsoredStyles.sponsorMessage, { color: theme.primary }]}
                  numberOfLines={2}
                >
                  {city.sponsored.sponsorMessage}
                </ThemedText>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const sponsoredStyles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  title: {},
  scrollContent: {
    paddingRight: Spacing.lg,
  },
  card: {
    width: 200,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: "hidden",
    marginRight: Spacing.md,
  },
  cardImage: {
    width: "100%",
    height: 100,
  },
  cardContent: {
    padding: Spacing.md,
  },
  cardTitle: {
    fontWeight: "600",
  },
  cardSubtitle: {
    marginTop: 2,
  },
  sponsorMessage: {
    marginTop: Spacing.xs,
    fontStyle: "italic",
    lineHeight: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  overlayContainer: {
    marginTop: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  loadingContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
});
