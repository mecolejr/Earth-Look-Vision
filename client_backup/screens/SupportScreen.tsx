import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { usePremium } from "@/contexts/PremiumContext";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";

type SupportScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList, "Support">;

export default function SupportScreen() {
  const navigation = useNavigation<SupportScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { isPremium } = usePremium();
  const [message, setMessage] = useState("");

  const handleSubmitTicket = () => {
    if (!message.trim()) {
      Alert.alert("Please enter a message", "Tell us how we can help you.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      isPremium ? "Priority Ticket Submitted" : "Ticket Submitted",
      isPremium
        ? "Your priority support ticket has been received. We typically respond within 4 hours."
        : "Your support ticket has been received. We typically respond within 24-48 hours.",
      [{ text: "OK", onPress: () => setMessage("") }]
    );
  };

  const handleEmailSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL("mailto:support@earthlook.app?subject=EarthLook%20Support%20Request");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: isPremium ? theme.warning + "20" : theme.primary + "20" },
            ]}
          >
            <Feather
              name={isPremium ? "zap" : "headphones"}
              size={48}
              color={isPremium ? theme.warning : theme.primary}
            />
          </View>
          <ThemedText type="h3" style={styles.title}>
            {isPremium ? "Priority Support" : "Get Help"}
          </ThemedText>
          <ThemedText type="body" style={[styles.subtitle, { color: theme.textSecondary }]}>
            {isPremium
              ? "As a Premium member, you get faster response times and dedicated support."
              : "We're here to help you find your perfect city."}
          </ThemedText>
        </View>

        {isPremium ? (
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: theme.warning + "15", borderColor: theme.warning + "40" },
            ]}
          >
            <Feather name="star" size={20} color={theme.warning} />
            <ThemedText style={[styles.priorityText, { color: theme.warning }]}>
              Priority Response: 4 hours or less
            </ThemedText>
          </View>
        ) : (
          <View
            style={[
              styles.upgradeBanner,
              { backgroundColor: theme.warning + "10", borderColor: theme.warning + "30" },
            ]}
          >
            <View style={styles.upgradeBannerContent}>
              <Feather name="zap" size={24} color={theme.warning} />
              <View style={styles.upgradeBannerText}>
                <ThemedText type="body" style={{ fontWeight: "600" }}>
                  Want faster responses?
                </ThemedText>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  Premium members get priority support
                </ThemedText>
              </View>
            </View>
            <Pressable
              onPress={() => navigation.navigate("Premium")}
              style={[styles.upgradeLink, { backgroundColor: theme.warning }]}
            >
              <ThemedText style={[styles.upgradeLinkText, { color: theme.buttonText }]}>
                Upgrade
              </ThemedText>
            </Pressable>
          </View>
        )}

        <View
          style={[
            styles.formCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Send a Message
          </ThemedText>

          <TextInput
            style={[
              styles.textInput,
              {
                color: theme.text,
                borderColor: theme.cardBorder,
                backgroundColor: theme.backgroundTertiary,
              },
            ]}
            placeholder="Tell us how we can help..."
            placeholderTextColor={theme.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          <Button onPress={handleSubmitTicket} style={styles.submitButton}>
            {isPremium ? "Submit Priority Ticket" : "Submit Ticket"}
          </Button>
        </View>

        <View
          style={[
            styles.optionsCard,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
          ]}
        >
          <ThemedText type="h4" style={styles.sectionTitle}>
            Other Ways to Reach Us
          </ThemedText>

          <Pressable
            onPress={handleEmailSupport}
            style={[styles.optionRow, { borderColor: theme.cardBorder }]}
          >
            <View style={[styles.optionIcon, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="mail" size={20} color={theme.primary} />
            </View>
            <View style={styles.optionInfo}>
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                Email Support
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                support@earthlook.app
              </ThemedText>
            </View>
            <Feather name="external-link" size={20} color={theme.textSecondary} />
          </Pressable>

          <View style={[styles.optionRow, { borderColor: theme.cardBorder }]}>
            <View style={[styles.optionIcon, { backgroundColor: theme.success + "20" }]}>
              <Feather name="book-open" size={20} color={theme.success} />
            </View>
            <View style={styles.optionInfo}>
              <ThemedText type="body" style={{ fontWeight: "600" }}>
                Help Center
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Browse FAQs and guides
              </ThemedText>
            </View>
            <ThemedText type="small" style={[styles.comingSoon, { color: theme.textSecondary }]}>
              Coming Soon
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  priorityText: {
    fontWeight: "600",
    fontSize: 16,
  },
  upgradeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  upgradeBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  upgradeBannerText: {
    marginLeft: Spacing.md,
  },
  upgradeLink: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  upgradeLinkText: {
    fontWeight: "600",
  },
  formCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    fontSize: 16,
    minHeight: 140,
    marginBottom: Spacing.lg,
  },
  submitButton: {},
  optionsCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  optionInfo: {
    flex: 1,
  },
  comingSoon: {
    fontStyle: "italic",
  },
});
