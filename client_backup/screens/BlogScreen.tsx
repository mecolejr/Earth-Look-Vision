import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";

import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  blogArticles,
  BlogCategory,
  BLOG_CATEGORIES,
  BlogArticle,
  getArticleById,
} from "@/data/blog";
import { apiRequest } from "@/lib/query-client";
import type { BlogStackParamList } from "@/navigation/BlogStackNavigator";

type Props = NativeStackScreenProps<BlogStackParamList, "BlogList">;

interface RecommendedArticle {
  id: string;
  title: string;
  excerpt: string;
  relevanceScore: number;
}

export default function BlogScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { profile, hasCompletedOnboarding } = useUserProfile();
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | "all">("all");

  const { data: recommendations, isLoading: isLoadingRecommendations } = useQuery({
    queryKey: ["/api/recommendations", profile?.identity],
    queryFn: async () => {
      if (!profile?.identity || !hasCompletedOnboarding) return [];
      
      const identity = {
        race: profile.identity.ethnicities?.[0],
        gender: profile.identity.genderIdentity,
        sexuality: profile.identity.sexualOrientation,
        religion: profile.identity.religion,
        familyStructure: profile.identity.familyStructure,
        careerField: profile.identity.careerField,
      };

      const response = await apiRequest("POST", "/api/recommendations", { identity, limit: 5 });
      const data = await response.json();
      return data.recommendations as RecommendedArticle[];
    },
    enabled: !!profile && hasCompletedOnboarding,
    staleTime: 1000 * 60 * 5,
  });

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "all") {
      return [...blogArticles].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    return blogArticles
      .filter((article) => article.category === selectedCategory)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const renderCategoryChip = (category: BlogCategory | "all", label: string, icon?: string) => {
    const isSelected = selectedCategory === category;
    const categoryColor = category !== "all" ? BLOG_CATEGORIES[category].color : theme.primary;

    return (
      <Pressable
        key={category}
        onPress={() => setSelectedCategory(category)}
        style={[
          styles.categoryChip,
          {
            backgroundColor: isSelected ? categoryColor : theme.backgroundSecondary,
            borderColor: isSelected ? categoryColor : theme.border,
          },
        ]}
        testID={`category-${category}`}
      >
        {icon ? (
          <Feather
            name={icon as any}
            size={14}
            color={isSelected ? "#FFFFFF" : theme.textSecondary}
            style={styles.categoryIcon}
          />
        ) : null}
        <Text
          style={[
            styles.categoryLabel,
            { color: isSelected ? "#FFFFFF" : theme.textSecondary },
          ]}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  const renderRecommendedCard = (item: RecommendedArticle) => {
    const fullArticle = getArticleById(item.id);
    if (!fullArticle) return null;

    const categoryInfo = BLOG_CATEGORIES[fullArticle.category];

    return (
      <Pressable
        key={item.id}
        onPress={() => navigation.navigate("BlogArticle", { articleId: item.id })}
        style={[styles.recommendedCard, { backgroundColor: theme.backgroundSecondary }]}
        testID={`recommended-${item.id}`}
      >
        <View
          style={[
            styles.recommendedBadge,
            { backgroundColor: `${theme.primary}20` },
          ]}
        >
          <Feather name="star" size={10} color={theme.primary} />
          <Text style={[styles.recommendedBadgeText, { color: theme.primary }]}>
            For You
          </Text>
        </View>
        <Text style={[styles.recommendedTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.recommendedMeta}>
          <View
            style={[
              styles.miniCategoryBadge,
              { backgroundColor: `${categoryInfo.color}20` },
            ]}
          >
            <Feather name={categoryInfo.icon as any} size={10} color={categoryInfo.color} />
          </View>
          <Text style={[styles.recommendedReadTime, { color: theme.textSecondary }]}>
            {fullArticle.readTimeMinutes} min
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderArticle = ({ item }: { item: BlogArticle }) => {
    const categoryInfo = BLOG_CATEGORIES[item.category];

    return (
      <Pressable
        onPress={() => navigation.navigate("BlogArticle", { articleId: item.id })}
        style={[styles.articleCard, { backgroundColor: theme.backgroundSecondary }]}
        testID={`article-${item.id}`}
      >
        <View style={styles.articleHeader}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: `${categoryInfo.color}20` },
            ]}
          >
            <Feather
              name={categoryInfo.icon as any}
              size={12}
              color={categoryInfo.color}
            />
            <Text style={[styles.categoryBadgeText, { color: categoryInfo.color }]}>
              {categoryInfo.label}
            </Text>
          </View>
          <Text style={[styles.readTime, { color: theme.textSecondary }]}>
            {item.readTimeMinutes} min read
          </Text>
        </View>

        <Text style={[styles.articleTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={[styles.articleExcerpt, { color: theme.textSecondary }]} numberOfLines={3}>
          {item.excerpt}
        </Text>

        <View style={styles.articleFooter}>
          <Text style={[styles.authorText, { color: theme.textSecondary }]}>
            By {item.author}
          </Text>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            {formatDate(item.publishedAt)}
          </Text>
        </View>
      </Pressable>
    );
  };

  const ListHeader = () => (
    <>
      {hasCompletedOnboarding && recommendations && recommendations.length > 0 ? (
        <View style={styles.recommendedSection}>
          <View style={styles.recommendedHeader}>
            <Feather name="zap" size={18} color={theme.primary} />
            <Text style={[styles.recommendedSectionTitle, { color: theme.text }]}>
              Recommended for You
            </Text>
          </View>
          <Text style={[styles.recommendedSubtitle, { color: theme.textSecondary }]}>
            Based on your identity profile
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          >
            {recommendations.map(renderRecommendedCard)}
          </ScrollView>
        </View>
      ) : isLoadingRecommendations && hasCompletedOnboarding ? (
        <View style={styles.recommendedSection}>
          <View style={styles.recommendedHeader}>
            <Feather name="zap" size={18} color={theme.primary} />
            <Text style={[styles.recommendedSectionTitle, { color: theme.text }]}>
              Recommended for You
            </Text>
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
              Finding stories for you...
            </Text>
          </View>
        </View>
      ) : null}
    </>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.categoryScroll, { marginTop: headerHeight }]}
        contentContainerStyle={styles.categoryContainer}
      >
        {renderCategoryChip("all", "All")}
        {(Object.keys(BLOG_CATEGORIES) as BlogCategory[]).map((category) =>
          renderCategoryChip(
            category,
            BLOG_CATEGORIES[category].label,
            BLOG_CATEGORIES[category].icon
          )
        )}
      </ScrollView>

      <FlatList
        data={filteredArticles}
        keyExtractor={(item) => item.id}
        renderItem={renderArticle}
        ListHeaderComponent={selectedCategory === "all" ? ListHeader : null}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="file-text" size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No articles in this category yet
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryScroll: {
    flexGrow: 0,
    marginBottom: Spacing.md,
  },
  categoryContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  categoryIcon: {
    marginRight: Spacing.xs,
  },
  categoryLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  recommendedSection: {
    marginBottom: Spacing.xl,
  },
  recommendedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  recommendedSectionTitle: {
    fontFamily: "LibreBaskerville_700Bold",
    fontSize: 18,
  },
  recommendedSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  recommendedList: {
    gap: Spacing.md,
  },
  recommendedCard: {
    width: 200,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.sm,
    gap: 4,
    marginBottom: Spacing.sm,
  },
  recommendedBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  recommendedTitle: {
    fontFamily: "LibreBaskerville_700Bold",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  recommendedMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  miniCategoryBadge: {
    padding: 4,
    borderRadius: BorderRadius.sm,
  },
  recommendedReadTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  loadingText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  articleCard: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    gap: 4,
  },
  categoryBadgeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
  },
  readTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  articleTitle: {
    fontFamily: "LibreBaskerville_700Bold",
    fontSize: 18,
    lineHeight: 24,
    marginBottom: Spacing.sm,
  },
  articleExcerpt: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: Spacing.md,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  dateText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing["4xl"],
    gap: Spacing.md,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
});
