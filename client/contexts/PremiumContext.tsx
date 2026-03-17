import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert, Platform, Linking } from "react-native";

import { useUserProfile } from "@/contexts/UserProfileContext";
import { SubscriptionTier, FREE_TIER_LIMITS, PremiumSubscription } from "@/types";

interface PremiumContextValue {
  isPremium: boolean;
  subscription: PremiumSubscription;
  limits: typeof FREE_TIER_LIMITS;
  canCompare: (currentCount: number) => boolean;
  canSaveCity: (currentCount: number) => boolean;
  hasDetailedReports: boolean;
  hasPrioritySupport: boolean;
  upgradeToPremium: () => Promise<void>;
  showUpgradePrompt: (feature: string) => void;
}

const PremiumContext = createContext<PremiumContextValue | undefined>(undefined);

const PREMIUM_LIMITS = {
  maxComparisons: Infinity,
  maxSavedCities: Infinity,
  hasDetailedReports: true,
  hasPrioritySupport: true,
};

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { profile, refreshProfile } = useUserProfile();
  const [isUpgrading, setIsUpgrading] = useState(false);

  const subscription = profile?.subscription || { tier: "free" as SubscriptionTier };
  const isPremium = subscription.tier === "premium";
  const limits = isPremium ? PREMIUM_LIMITS : FREE_TIER_LIMITS;

  const canCompare = (currentCount: number) => {
    if (isPremium) return true;
    return currentCount < FREE_TIER_LIMITS.maxComparisons;
  };

  const canSaveCity = (currentCount: number) => {
    if (isPremium) return true;
    return currentCount < FREE_TIER_LIMITS.maxSavedCities;
  };

  const showUpgradePrompt = (feature: string) => {
    Alert.alert(
      "Premium Feature",
      `${feature} is available with EarthLook Premium. Upgrade to unlock unlimited comparisons, detailed reports, and priority support.`,
      [
        { text: "Maybe Later", style: "cancel" },
        { text: "Learn More", onPress: () => {} },
      ]
    );
  };

  const upgradeToPremium = async () => {
    setIsUpgrading(true);
    try {
      Alert.alert(
        "Premium Coming Soon",
        "In-app purchases will be available soon. For now, enjoy all features for free during our beta period!",
        [{ text: "OK" }]
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        subscription,
        limits,
        canCompare,
        canSaveCity,
        hasDetailedReports: limits.hasDetailedReports,
        hasPrioritySupport: limits.hasPrioritySupport,
        upgradeToPremium,
        showUpgradePrompt,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
}
