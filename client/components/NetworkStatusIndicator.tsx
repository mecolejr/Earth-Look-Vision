import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInUp, 
  SlideOutUp 
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetwork } from "@/contexts/NetworkContext";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, Typography } from "@/constants/theme";

interface NetworkStatusIndicatorProps {
  showDataSaverInfo?: boolean;
}

export function NetworkStatusIndicator({ showDataSaverInfo = false }: NetworkStatusIndicatorProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { 
    isConnected, 
    connectionQuality, 
    isDataSaverEnabled,
    showNetworkIndicator 
  } = useNetwork();

  if (!showNetworkIndicator) return null;

  const shouldShow = !isConnected || connectionQuality === "slow" || (showDataSaverInfo && isDataSaverEnabled);

  if (!shouldShow) return null;

  const getStatusConfig = () => {
    if (!isConnected) {
      return {
        icon: "wifi-off" as const,
        message: "No internet connection",
        subtext: "Using cached data",
        backgroundColor: Colors.dark.danger,
        textColor: "#FFFFFF",
      };
    }
    if (connectionQuality === "slow") {
      return {
        icon: "activity" as const,
        message: "Slow connection",
        subtext: "Loading lower quality images",
        backgroundColor: Colors.dark.warning,
        textColor: "#1A1A1A",
      };
    }
    if (isDataSaverEnabled) {
      return {
        icon: "zap" as const,
        message: "Data saver on",
        subtext: "Using reduced image quality",
        backgroundColor: theme.backgroundSecondary,
        textColor: theme.text,
      };
    }
    return null;
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      exiting={SlideOutUp.duration(200)}
      style={[
        styles.container,
        { 
          top: insets.top,
          backgroundColor: config.backgroundColor,
        },
      ]}
    >
      <Feather name={config.icon} size={16} color={config.textColor} />
      <View style={styles.textContainer}>
        <Text style={[styles.message, { color: config.textColor }]}>
          {config.message}
        </Text>
        <Text style={[styles.subtext, { color: config.textColor, opacity: 0.8 }]}>
          {config.subtext}
        </Text>
      </View>
    </Animated.View>
  );
}

export function NetworkOfflineBanner() {
  const { theme } = useTheme();
  const { isConnected, refresh } = useNetwork();

  if (isConnected) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[styles.offlineBanner, { backgroundColor: Colors.dark.danger }]}
    >
      <Feather name="wifi-off" size={18} color="#FFFFFF" />
      <Text style={styles.offlineText}>You're offline</Text>
      <Pressable 
        onPress={() => refresh()} 
        style={styles.retryButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.md,
    right: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  message: {
    ...Typography.caption,
    fontFamily: "Inter_600SemiBold",
  },
  subtext: {
    ...Typography.caption,
    fontSize: 11,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  offlineText: {
    ...Typography.caption,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  retryButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
  },
  retryText: {
    ...Typography.caption,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
});
