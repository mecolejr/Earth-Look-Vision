import React, { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = BorderRadius.xs,
  style,
}: SkeletonProps) {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.3, 0.7]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.backgroundSecondary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function CityCardSkeleton() {
  return (
    <View style={styles.cardContainer}>
      <Skeleton height={140} borderRadius={0} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Skeleton width="70%" height={24} style={styles.mb8} />
            <Skeleton width="40%" height={16} />
          </View>
          <Skeleton width={64} height={64} borderRadius={BorderRadius.md} />
        </View>
        <View style={styles.cardHighlights}>
          <Skeleton width="80%" height={16} style={styles.mb8} />
          <Skeleton width="65%" height={16} style={styles.mb8} />
          <Skeleton width="75%" height={16} />
        </View>
      </View>
    </View>
  );
}

export function CityListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <CityCardSkeleton key={index} />
      ))}
    </View>
  );
}

export function CurrentCityOverlaySkeleton() {
  return (
    <View style={styles.overlayContainer}>
      <Skeleton width={60} height={16} borderRadius={BorderRadius.xs} style={styles.mb8} />
      <View style={styles.overlayHeader}>
        <View style={{ flex: 1 }}>
          <Skeleton width="60%" height={20} style={styles.mb8} />
          <Skeleton width="40%" height={14} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Skeleton width={50} height={32} borderRadius={BorderRadius.sm} />
          <Skeleton width={30} height={12} style={{ marginTop: 4 }} />
        </View>
      </View>
      <View style={styles.overlayStats}>
        <Skeleton width={70} height={28} borderRadius={BorderRadius.sm} />
        <Skeleton width={70} height={28} borderRadius={BorderRadius.sm} />
        <Skeleton width={70} height={28} borderRadius={BorderRadius.sm} />
      </View>
    </View>
  );
}

export function CompareCardSkeleton() {
  return (
    <View style={styles.compareCard}>
      <Skeleton width="100%" height={100} borderRadius={BorderRadius.md} style={styles.mb8} />
      <Skeleton width="70%" height={18} style={styles.mb8} />
      <Skeleton width="50%" height={14} style={styles.mb8} />
      <Skeleton width={60} height={40} borderRadius={BorderRadius.md} />
    </View>
  );
}

export function CompareListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View style={styles.compareList}>
      {Array.from({ length: count }).map((_, index) => (
        <CompareCardSkeleton key={index} />
      ))}
    </View>
  );
}

export function CityDetailSkeleton() {
  return (
    <View style={styles.detailContainer}>
      <Skeleton width="100%" height={200} borderRadius={0} />
      <View style={styles.detailContent}>
        <View style={styles.detailHeader}>
          <View style={{ flex: 1 }}>
            <Skeleton width="70%" height={28} style={styles.mb8} />
            <Skeleton width="45%" height={16} />
          </View>
          <Skeleton width={80} height={80} borderRadius={BorderRadius.lg} />
        </View>
        <View style={styles.detailSection}>
          <Skeleton width="40%" height={20} style={styles.mb12} />
          <View style={styles.detailGrid}>
            <Skeleton width="48%" height={60} borderRadius={BorderRadius.md} />
            <Skeleton width="48%" height={60} borderRadius={BorderRadius.md} />
            <Skeleton width="48%" height={60} borderRadius={BorderRadius.md} />
            <Skeleton width="48%" height={60} borderRadius={BorderRadius.md} />
          </View>
        </View>
        <View style={styles.detailSection}>
          <Skeleton width="50%" height={20} style={styles.mb12} />
          <Skeleton width="100%" height={16} style={styles.mb8} />
          <Skeleton width="90%" height={16} style={styles.mb8} />
          <Skeleton width="85%" height={16} />
        </View>
      </View>
    </View>
  );
}

export function ProfileSkeleton() {
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profileHeader}>
        <Skeleton width={80} height={80} borderRadius={40} />
        <View style={{ flex: 1, marginLeft: Spacing.lg }}>
          <Skeleton width="60%" height={24} style={styles.mb8} />
          <Skeleton width="80%" height={14} />
        </View>
      </View>
      <View style={styles.profileSection}>
        <Skeleton width="35%" height={18} style={styles.mb12} />
        <Skeleton width="100%" height={48} borderRadius={BorderRadius.md} style={styles.mb8} />
        <Skeleton width="100%" height={48} borderRadius={BorderRadius.md} style={styles.mb8} />
        <Skeleton width="100%" height={48} borderRadius={BorderRadius.md} />
      </View>
      <View style={styles.profileSection}>
        <Skeleton width="30%" height={18} style={styles.mb12} />
        <Skeleton width="100%" height={48} borderRadius={BorderRadius.md} style={styles.mb8} />
        <Skeleton width="100%" height={48} borderRadius={BorderRadius.md} />
      </View>
    </View>
  );
}

export function SearchResultSkeleton() {
  return (
    <View style={styles.searchResult}>
      <Skeleton width="65%" height={16} style={styles.mb8} />
      <Skeleton width="40%" height={12} />
    </View>
  );
}

export function SearchResultListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <SearchResultSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: BorderRadius.lg,
    overflow: "hidden",
    marginBottom: Spacing.lg,
  },
  cardContent: {
    padding: Spacing.lg,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cardHighlights: {},
  mb8: {
    marginBottom: Spacing.sm,
  },
  mb12: {
    marginBottom: Spacing.md,
  },
  overlayContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  overlayHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  overlayStats: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  compareCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  compareList: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  detailContainer: {
    flex: 1,
  },
  detailContent: {
    padding: Spacing.lg,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing["2xl"],
  },
  detailSection: {
    marginBottom: Spacing["2xl"],
  },
  detailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  profileContainer: {
    padding: Spacing.lg,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  profileSection: {
    marginBottom: Spacing["2xl"],
  },
  searchResult: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
});
