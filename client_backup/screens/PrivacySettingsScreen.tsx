import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Switch, Pressable, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { PrivacySettings, PRIVACY_LABELS } from "@/types";
import { exportUserData, clearAllData } from "@/lib/storage";

export default function PrivacySettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { privacySettings, updatePrivacySettings, resetProfile } = useUserProfile();
  const [isExporting, setIsExporting] = useState(false);

  const handleToggle = async (key: keyof PrivacySettings, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await updatePrivacySettings({ [key]: value });
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      const data = await exportUserData();
      const jsonString = JSON.stringify(data, null, 2);
      const fileName = `earthlook-data-${new Date().toISOString().split("T")[0]}.json`;
      
      if (Platform.OS === "web") {
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        Alert.alert(
          "Export Complete",
          "Your data has been downloaded as a JSON file.",
          [{ text: "OK" }]
        );
      } else {
        const { Paths, File } = await import("expo-file-system");
        const Sharing = await import("expo-sharing");
        
        const file = new File(Paths.cache, fileName);
        await file.write(jsonString);
        const filePath = file.uri;
        
        const canShare = await Sharing.isAvailableAsync();
        if (canShare) {
          await Sharing.shareAsync(filePath, {
            mimeType: "application/json",
            dialogTitle: "Export Your Data",
          });
        } else {
          Alert.alert(
            "Export Complete",
            "Your data has been exported. On this device, sharing is not available, but your data file has been saved.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      Alert.alert("Export Failed", "There was an error exporting your data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = () => {
    Alert.alert(
      "Delete All Data",
      "This will permanently delete all your data including your profile, saved cities, and preferences. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Everything",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearAllData();
            await resetProfile();
            Alert.alert("Data Deleted", "All your data has been permanently deleted.");
          },
        },
      ]
    );
  };

  const enabledCount = Object.values(privacySettings).filter(Boolean).length;
  const totalCount = Object.keys(privacySettings).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing["3xl"],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.primary + "20" },
            ]}
          >
            <Feather name="shield" size={32} color={theme.primary} />
          </View>
          <ThemedText style={[styles.title, { fontFamily: Fonts?.serifBold }]}>
            Privacy Settings
          </ThemedText>
          <ThemedText
            type="body"
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Control which aspects of your identity are used to personalize city
            scores. Disabled factors won't affect your recommendations.
          </ThemedText>
        </View>

        <View
          style={[
            styles.statusCard,
            {
              backgroundColor: theme.backgroundDefault,
              borderColor: theme.cardBorder,
            },
          ]}
        >
          <ThemedText type="h4">Active Factors</ThemedText>
          <ThemedText style={[styles.statusValue, { color: theme.primary }]}>
            {enabledCount} of {totalCount}
          </ThemedText>
        </View>

        <View style={styles.settingsList}>
          {(Object.keys(PRIVACY_LABELS) as Array<keyof PrivacySettings>).map(
            (key) => (
              <PrivacyToggle
                key={key}
                settingKey={key}
                label={PRIVACY_LABELS[key].label}
                description={PRIVACY_LABELS[key].description}
                value={privacySettings[key]}
                onToggle={(value) => handleToggle(key, value)}
                theme={theme}
              />
            )
          )}
        </View>

        <View style={styles.dataStorageSection}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            How Your Data is Stored
          </ThemedText>
          
          <View style={[styles.storageCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
            <View style={[styles.storageIconContainer, { backgroundColor: theme.success + "20" }]}>
              <Feather name="smartphone" size={24} color={theme.success} />
            </View>
            <View style={styles.storageContent}>
              <ThemedText type="h4" style={styles.storageTitle}>
                Stored on Your Device
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 4 }}>
                Your identity profile, saved cities, and preferences are stored locally on this device only. No account is required.
              </ThemedText>
            </View>
          </View>

          <View style={[styles.storageCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
            <View style={[styles.storageIconContainer, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="cloud-off" size={24} color={theme.primary} />
            </View>
            <View style={styles.storageContent}>
              <ThemedText type="h4" style={styles.storageTitle}>
                Never Sent to Servers
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 4 }}>
                Your personal identity data never leaves your device. City data is bundled with the app - no internet needed for scoring.
              </ThemedText>
            </View>
          </View>

          <View style={[styles.storageCard, { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder }]}>
            <View style={[styles.storageIconContainer, { backgroundColor: theme.warning + "20" }]}>
              <Feather name="trash-2" size={24} color={theme.warning} />
            </View>
            <View style={styles.storageContent}>
              <ThemedText type="h4" style={styles.storageTitle}>
                Easy to Delete
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary, marginTop: 4 }}>
                Uninstalling the app or using "Delete All Data" below permanently removes all your information.
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.gdprSection}>
          <ThemedText type="h4" style={styles.gdprTitle}>
            Your Data Rights
          </ThemedText>
          <ThemedText
            type="small"
            style={[styles.gdprSubtitle, { color: theme.textSecondary }]}
          >
            Under GDPR and similar privacy laws, you have the right to access
            and delete your personal data.
          </ThemedText>

          <Pressable
            onPress={handleExportData}
            disabled={isExporting}
            style={[
              styles.gdprButton,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.cardBorder,
                opacity: isExporting ? 0.6 : 1,
              },
            ]}
            testID="button-export-data"
          >
            <View style={[styles.gdprIconContainer, { backgroundColor: theme.primary + "20" }]}>
              <Feather name="download" size={20} color={theme.primary} />
            </View>
            <View style={styles.gdprButtonContent}>
              <ThemedText type="h4">
                {isExporting ? "Exporting..." : "Export My Data"}
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Download all your personal data as a JSON file
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>

          <Pressable
            onPress={handleDeleteData}
            style={[
              styles.gdprButton,
              {
                backgroundColor: theme.backgroundDefault,
                borderColor: theme.danger + "30",
              },
            ]}
            testID="button-delete-data"
          >
            <View style={[styles.gdprIconContainer, { backgroundColor: theme.danger + "20" }]}>
              <Feather name="trash-2" size={20} color={theme.danger} />
            </View>
            <View style={styles.gdprButtonContent}>
              <ThemedText type="h4" style={{ color: theme.danger }}>
                Delete All Data
              </ThemedText>
              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                Permanently remove all your data from this device
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.footer}>
          <ThemedText
            type="small"
            style={[styles.footerText, { color: theme.textSecondary }]}
          >
            Your data is stored locally on your device and is never shared.
            These settings only affect how city scores are calculated.
          </ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

interface PrivacyToggleProps {
  settingKey: keyof PrivacySettings;
  label: string;
  description: string;
  value: boolean;
  onToggle: (value: boolean) => void;
  theme: any;
}

function PrivacyToggle({
  label,
  description,
  value,
  onToggle,
  theme,
}: PrivacyToggleProps) {
  return (
    <View
      style={[
        styles.toggleItem,
        {
          backgroundColor: theme.backgroundDefault,
          borderColor: theme.cardBorder,
        },
      ]}
    >
      <View style={styles.toggleContent}>
        <ThemedText type="h4" style={styles.toggleLabel}>
          {label}
        </ThemedText>
        <ThemedText
          type="small"
          style={[styles.toggleDescription, { color: theme.textSecondary }]}
        >
          {description}
        </ThemedText>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: theme.backgroundTertiary,
          true: theme.primary + "80",
        }}
        thumbColor={value ? theme.primary : theme.backgroundSecondary}
        ios_backgroundColor={theme.backgroundTertiary}
      />
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing["2xl"],
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  settingsList: {
    gap: Spacing.md,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  toggleContent: {
    flex: 1,
    marginRight: Spacing.md,
  },
  toggleLabel: {
    marginBottom: Spacing.xs,
  },
  toggleDescription: {
    lineHeight: 18,
  },
  footer: {
    marginTop: Spacing["2xl"],
    paddingHorizontal: Spacing.md,
  },
  footerText: {
    textAlign: "center",
    lineHeight: 18,
  },
  gdprSection: {
    marginTop: Spacing["2xl"],
  },
  gdprTitle: {
    marginBottom: Spacing.sm,
  },
  gdprSubtitle: {
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  gdprButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  gdprIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  gdprButtonContent: {
    flex: 1,
  },
  dataStorageSection: {
    marginTop: Spacing["2xl"],
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  storageCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  storageIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  storageContent: {
    flex: 1,
  },
  storageTitle: {
    marginBottom: 0,
  },
});
