import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { Button } from "@/components/Button";
import { apiRequest } from "@/lib/query-client";
import type { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type Props = NativeStackScreenProps<ProfileStackParamList, "Newsletter">;

const FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly", description: "Best city picks every week" },
  { value: "biweekly", label: "Every 2 Weeks", description: "Curated recommendations twice monthly" },
  { value: "monthly", label: "Monthly", description: "Monthly digest of top matches" },
];

export default function NewsletterScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { profile } = useUserProfile();

  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState("weekly");
  const [includeProfile, setIncludeProfile] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const preferences = includeProfile && profile ? {
        ethnicity: profile.identity.ethnicities,
        genderIdentity: profile.identity.genderIdentity,
        sexualOrientation: profile.identity.sexualOrientation,
        religion: profile.identity.religion,
        politicalViews: profile.identity.politicalViews,
        priorityWeights: profile.priorities,
      } : undefined;

      await apiRequest("POST", "/api/newsletter/subscribe", {
        email,
        frequency,
        preferences,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSubscribed(true);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      Alert.alert(
        "Subscription Failed",
        "There was an error subscribing. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <View style={[styles.successIcon, { backgroundColor: `${theme.success}20` }]}>
          <Feather name="check-circle" size={48} color={theme.success} />
        </View>
        <Text style={[styles.successTitle, { color: theme.text }]}>
          You're Subscribed!
        </Text>
        <Text style={[styles.successText, { color: theme.textSecondary }]}>
          You'll receive personalized city recommendations at {email}
        </Text>
        <Button
          onPress={() => navigation.goBack()}
          style={{ marginTop: Spacing.xl }}
        >
          Back to Profile
        </Button>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: headerHeight + Spacing.lg, paddingBottom: insets.bottom + Spacing["3xl"] },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}20` }]}>
          <Feather name="mail" size={32} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>
          Personalized City Updates
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Get city recommendations tailored to your identity and priorities, delivered right to your inbox.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Email Address
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundSecondary,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          placeholder="your@email.com"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          testID="input-email"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          How Often?
        </Text>
        {FREQUENCY_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setFrequency(option.value)}
            style={[
              styles.frequencyOption,
              {
                backgroundColor: theme.backgroundSecondary,
                borderColor: frequency === option.value ? theme.primary : theme.border,
                borderWidth: frequency === option.value ? 2 : 1,
              },
            ]}
            testID={`frequency-${option.value}`}
          >
            <View style={styles.frequencyContent}>
              <Text style={[styles.frequencyLabel, { color: theme.text }]}>
                {option.label}
              </Text>
              <Text style={[styles.frequencyDesc, { color: theme.textSecondary }]}>
                {option.description}
              </Text>
            </View>
            {frequency === option.value ? (
              <Feather name="check-circle" size={20} color={theme.primary} />
            ) : (
              <View style={[styles.radioEmpty, { borderColor: theme.border }]} />
            )}
          </Pressable>
        ))}
      </View>

      <View style={styles.section}>
        <Pressable
          onPress={() => setIncludeProfile(!includeProfile)}
          style={[
            styles.toggleRow,
            { backgroundColor: theme.backgroundSecondary },
          ]}
          testID="toggle-include-profile"
        >
          <View style={styles.toggleContent}>
            <Feather
              name="user-check"
              size={20}
              color={includeProfile ? theme.primary : theme.textSecondary}
            />
            <View style={styles.toggleText}>
              <Text style={[styles.toggleLabel, { color: theme.text }]}>
                Personalize with my profile
              </Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                Use your identity and priorities for better recommendations
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.toggle,
              {
                backgroundColor: includeProfile ? theme.primary : theme.backgroundTertiary,
              },
            ]}
          >
            <View
              style={[
                styles.toggleKnob,
                {
                  backgroundColor: "#FFFFFF",
                  transform: [{ translateX: includeProfile ? 18 : 2 }],
                },
              ]}
            />
          </View>
        </Pressable>
      </View>

      <View style={styles.infoBox}>
        <Feather name="shield" size={16} color={theme.textSecondary} />
        <Text style={[styles.infoText, { color: theme.textSecondary }]}>
          Your data is stored securely and never shared with third parties. Unsubscribe anytime.
        </Text>
      </View>

      <Button
        onPress={handleSubscribe}
        disabled={!email || isSubmitting}
        style={{ marginTop: Spacing.lg }}
        testID="button-subscribe"
      >
        {isSubmitting ? "Subscribing..." : "Subscribe"}
      </Button>

      <Text style={[styles.preview, { color: theme.textSecondary }]}>
        Preview what you'll receive:
      </Text>

      <View style={[styles.previewCard, { backgroundColor: theme.backgroundSecondary }]}>
        <Text style={[styles.previewTitle, { color: theme.text }]}>
          Your Top City Matches This Week
        </Text>
        <View style={styles.previewCities}>
          {["San Francisco", "Seattle", "Austin"].map((city, index) => (
            <View key={city} style={styles.previewCity}>
              <Text style={[styles.previewRank, { color: theme.primary }]}>
                #{index + 1}
              </Text>
              <Text style={[styles.previewCityName, { color: theme.text }]}>
                {city}
              </Text>
            </View>
          ))}
        </View>
        <Text style={[styles.previewNote, { color: theme.textSecondary }]}>
          Plus new policy updates affecting your community...
        </Text>
      </View>
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
    paddingHorizontal: Spacing.xl,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: "LibreBaskerville_700Bold",
    fontSize: 24,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    marginBottom: Spacing.sm,
  },
  input: {
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  frequencyOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    marginBottom: 2,
  },
  frequencyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  radioEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  toggleContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: Spacing.md,
  },
  toggleText: {
    flex: 1,
  },
  toggleLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    marginBottom: 2,
  },
  toggleDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  infoText: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 18,
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontFamily: "LibreBaskerville_700Bold",
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  successText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    textAlign: "center",
  },
  preview: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    marginTop: Spacing["2xl"],
    marginBottom: Spacing.md,
    textAlign: "center",
  },
  previewCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  previewTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    marginBottom: Spacing.md,
  },
  previewCities: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  previewCity: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  previewRank: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    width: 24,
  },
  previewCityName: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
  },
  previewNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    fontStyle: "italic",
  },
});
