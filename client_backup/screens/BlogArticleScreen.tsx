import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getArticleById, BLOG_CATEGORIES } from "@/data/blog";
import type { BlogStackParamList } from "@/navigation/BlogStackNavigator";

type Props = NativeStackScreenProps<BlogStackParamList, "BlogArticle">;

export default function BlogArticleScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { articleId } = route.params;

  const article = getArticleById(articleId);

  if (!article) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <Feather name="alert-circle" size={48} color={theme.textSecondary} />
        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
          Article not found
        </Text>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const categoryInfo = BLOG_CATEGORIES[article.category];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n");
    
    return paragraphs.map((paragraph, index) => {
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return (
          <Text
            key={index}
            style={[styles.subheading, { color: theme.text }]}
          >
            {paragraph.slice(2, -2)}
          </Text>
        );
      }
      
      if (paragraph.startsWith("- ")) {
        const items = paragraph.split("\n");
        return (
          <View key={index} style={styles.listContainer}>
            {items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.listItem}>
                <View style={[styles.bullet, { backgroundColor: theme.primary }]} />
                <Text style={[styles.listText, { color: theme.textSecondary }]}>
                  {item.replace("- ", "")}
                </Text>
              </View>
            ))}
          </View>
        );
      }

      const formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, "$1");
      
      return (
        <Text
          key={index}
          style={[styles.paragraph, { color: theme.textSecondary }]}
        >
          {formattedParagraph}
        </Text>
      );
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + Spacing["3xl"] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.categoryBadge,
          { backgroundColor: `${categoryInfo.color}20` },
        ]}
      >
        <Feather
          name={categoryInfo.icon as any}
          size={14}
          color={categoryInfo.color}
        />
        <Text style={[styles.categoryBadgeText, { color: categoryInfo.color }]}>
          {categoryInfo.label}
        </Text>
      </View>

      <Text style={[styles.title, { color: theme.text }]}>
        {article.title}
      </Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Feather name="user" size={14} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {article.author}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="calendar" size={14} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {formatDate(article.publishedAt)}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="clock" size={14} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {article.readTimeMinutes} min read
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.articleContent}>
        {renderContent(article.content)}
      </View>

      {article.tags.length > 0 ? (
        <View style={styles.tagsSection}>
          <View style={[styles.divider, { backgroundColor: theme.border }]} />
          <View style={styles.tagsContainer}>
            {article.tags.map((tag) => (
              <View
                key={tag}
                style={[styles.tag, { backgroundColor: theme.backgroundSecondary }]}
              >
                <Text style={[styles.tagText, { color: theme.textSecondary }]}>
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.md,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  errorText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.md,
  },
  backButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: "#FFFFFF",
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  categoryBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  title: {
    fontFamily: "LibreBaskerville_700Bold",
    fontSize: 26,
    lineHeight: 32,
    marginBottom: Spacing.lg,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  metaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.lg,
  },
  articleContent: {
    gap: Spacing.lg,
  },
  paragraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 26,
  },
  subheading: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    marginTop: Spacing.md,
  },
  listContainer: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
  },
  tagsSection: {
    marginTop: Spacing.lg,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  tag: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
});
