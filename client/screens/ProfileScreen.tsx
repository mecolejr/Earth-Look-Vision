import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Pressable,
    Image,
        Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ProfileStackParamList } from "@/navigation/ProfileStackNavigator";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { ChipGroup } from "@/components/Chip";
import { PrioritySlider } from "@/components/PrioritySlider";
import { LiveScorePreview } from "@/components/LiveScorePreview";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import {
    ETHNICITY_OPTIONS,
    GENDER_OPTIONS,
    ORIENTATION_OPTIONS,
    RELIGION_OPTIONS,
    POLITICAL_OPTIONS,
    PRIORITY_LABELS,
    PriorityWeights,
} from "@/types";

type ProfileScreenNavigationProp = NativeStackNavigationProp<
    ProfileStackParamList,
    "Profile"
  >;
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>();
    const rootNavigation = useNavigation<RootNavigationProp>();
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const tabBarHeight = useBottomTabBarHeight();
    const { theme } = useTheme();
    const {
          profile,
          updateIdentity,
          updatePriorities,
          resetProfile,
          privacySettings,
    } = useUserProfile();
    const [activeSection, setActiveSection] = useState<
          "identity" | "priorities" | null
        >(null);

  if (!profile) {
        return null;
  }

  const handleSaveIdentity = async () => {
        if (profile?.identity) {
          await updateIdentity(profile.identity);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setActiveSection(null);
  };

  const handleSavePriorities = async () => {
        if (profile?.priorities) {
          await updatePriorities(profile.priorities);
        }
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setActiveSection(null);
  };

const handleResetProfile = () => {
            Alert.alert(
                            "Reset Profile",
                            "This will permanently erase all your lifestyle, identity, and priority data. This cannot be undone.",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                                        text: "Reset",
                                                        style: "destructive",
                                                        onPress: async () => {
                                                                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                                                                                    await resetProfile();
                                                        },
                                },
                                            ]
                        );
};

  return (
        <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
                <ScrollView
                          style={styles.scrollView}
                          contentContainerStyle={[
                                      styles.scrollContent,
                            {
                                          paddingTop: headerHeight + Spacing.lg,
                                          paddingBottom: tabBarHeight + Spacing["3xl"],
                            },
                                    ]}
                          showsVerticalScrollIndicator={false}
                        >
                        <View style={styles.profileHeader}>
                                  <View
                                                style={[
                                                                styles.avatar,
                                                  { backgroundColor: theme.primaryLight + "40" },
                                                              ]}
                                              >
                                              <Image
                                                              source={require("../../assets/images/identity-illustration.png")}
                                                              style={styles.avatarImage}
                                                              resizeMode="cover"
                                                            />
                                  </View>View>
                                  <ThemedText style={[styles.title, { fontFamily: Fonts?.serifBold }]}>
                                              Your Profile
                                  </ThemedText>ThemedText>
                                  <ThemedText
                                                type="body"
                                                style={[styles.subtitle, { color: theme.textSecondary }]}
                                              >
                                              Adjust your identity and priorities to refine your city matches
                                  </ThemedText>ThemedText>
                        </View>View>
                
                        <LiveScorePreview showLabel={true} />
                
                        <SectionCard
                                    title="Identity Factors"
                                    description="Your background and demographics"
                                    icon="user"
                                    isExpanded={activeSection === "identity"}
                                    onPress={() =>
                                                  setActiveSection(
                                                                  activeSection === "identity" ? null : "identity"
                                                                )
                                    }
                                    theme={theme}
                                  >
                                  <View style={styles.sectionContent}>
                                              <View style={styles.field}>
                                                            <ThemedText type="h4" style={styles.fieldLabel}>
                                                                            Race / Ethnicity
                                                            </ThemedText>ThemedText>
                                                            <ChipGroup
                                                                              options={ETHNICITY_OPTIONS}
                                                                              selected={profile.identity.ethnicities}
                                                                              onChange={(ethnicities) => updateIdentity({ ethnicities })}
                                                                              multiSelect
                                                                            />
                                              </View>View>
                                              <View style={styles.field}>
                                                            <ThemedText type="h4" style={styles.fieldLabel}>
                                                                            Gender Identity
                                                            </ThemedText>ThemedText>
                                                            <ChipGroup
                                                                              options={GENDER_OPTIONS}
                                                                              selected={
                                                                                                  profile.identity.genderIdentity
                                                                                                    ? [profile.identity.genderIdentity]
                                                                                                    : []
                                                                              }
                                                                              onChange={(selected) =>
                                                                                                  updateIdentity({ genderIdentity: selected[0] || "" })
                                                                              }
                                                                            />
                                              </View>View>
                                              <View style={styles.field}>
                                                            <ThemedText type="h4" style={styles.fieldLabel}>
                                                                            Sexual Orientation
                                                            </ThemedText>ThemedText>
                                                            <ChipGroup
                                                                              options={ORIENTATION_OPTIONS}
                                                                              selected={
                                                                                                  profile.identity.sexualOrientation
                                                                                                    ? [profile.identity.sexualOrientation]
                                                                                                    : []
                                                                              }
                                                                              onChange={(selected) =>
                                                                                                  updateIdentity({ sexualOrientation: selected[0] || "" })
                                                                              }
                                                                            />
                                              </View>View>
                                              <View style={styles.field}>
                                                            <ThemedText type="h4" style={styles.fieldLabel}>
                                                                            Religion
                                                            </ThemedText>ThemedText>
                                                            <ChipGroup
                                                                              options={RELIGION_OPTIONS}
                                                                              selected={
                                                                                                  profile.identity.religion
                                                                                                    ? [profile.identity.religion]
                                                                                                    : []
                                                                              }
                                                                              onChange={(selected) =>
                                                                                                  updateIdentity({ religion: selected[0] || "" })
                                                                              }
                                                                            />
                                              </View>View>
                                              <View style={styles.field}>
                                                            <ThemedText type="h4" style={styles.fieldLabel}>
                                                                            Political Views
                                                            </ThemedText>ThemedText>
                                                            <ChipGroup
                                                                              options={POLITICAL_OPTIONS}
                                                                              selected={
                                                                                                  profile.identity.politicalViews
                                                                                                    ? [profile.identity.politicalViews]
                                                                                                    : []
                                                                              }
                                                                              onChange={(selected) =>
                                                                                                  updateIdentity({ politicalViews: selected[0] || "" })
                                                                              }
                                                                            />
                                              </View>View>
                                              <Button onPress={handleSaveIdentity} style={styles.saveButton}>
                                                            Done
                                              </Button>Button>
                                  </View>View>
                        </SectionCard>SectionCard>
                
                        <SectionCard
                                    title="Priority Weights"
                                    description="What matters most to you"
                                    icon="sliders"
                                    isExpanded={activeSection === "priorities"}
                                    onPress={() =>
                                                  setActiveSection(
                                                                  activeSection === "priorities" ? null : "priorities"
                                                                )
                                    }
                                    theme={theme}
                                  >
                                  <View style={styles.sectionContent}>
                                    {(
                                                  Object.keys(PRIORITY_LABELS) as Array<keyof PriorityWeights>
                                                ).map((key) => (
                                                                <PrioritySlider
                                                                                  key={key}
                                                                                  label={PRIORITY_LABELS[key]}
                                                                                  value={profile.priorities[key]}
                                                                                  onChange={(value) => updatePriorities({ [key]: value })}
                                                                                />
                                                              ))}
                                              <Button onPress={handleSavePriorities} style={styles.saveButton}>
                                                            Done
                                              </Button>Button>
                                  </View>View>
                        </SectionCard>SectionCard>
                
                        <Pressable
                                    style={[
                                                  styles.privacyLink,
                                      {
                                                      backgroundColor: theme.backgroundDefault,
                                                      borderColor: theme.cardBorder,
                                      },
                                                ]}
                                    onPress={() => {
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                  navigation.navigate("PrivacySettings");
                                    }}
                                  >
                                  <View
                                                style={[
                                                                styles.sectionIcon,
                                                  { backgroundColor: theme.primary + "20" },
                                                              ]}
                                              >
                                              <Feather name="shield" size={20} color={theme.primary} />
                                  </View>View>
                                  <View style={styles.sectionInfo}>
                                              <ThemedText type="h4">Privacy Settings</ThemedText>ThemedText>
                                              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                {Object.values(privacySettings).filter(Boolean).length} of{" "}
                                                {Object.keys(privacySettings).length} factors active
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <Feather
                                                name="chevron-right"
                                                size={24}
                                                color={theme.textSecondary}
                                              />
                        </Pressable>Pressable>
                
                        <Pressable
                                    style={[
                                                  styles.privacyLink,
                                      {
                                                      backgroundColor: theme.backgroundDefault,
                                                      borderColor: theme.cardBorder,
                                      },
                                                ]}
                                    onPress={() => {
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                  navigation.navigate("ScoringMethodology");
                                    }}
                                    testID="link-scoring-methodology"
                                  >
                                  <View
                                                style={[
                                                                styles.sectionIcon,
                                                  { backgroundColor: theme.success + "20" },
                                                              ]}
                                              >
                                              <Feather name="bar-chart-2" size={20} color={theme.success} />
                                  </View>View>
                                  <View style={styles.sectionInfo}>
                                              <ThemedText type="h4">How Scores Work</ThemedText>ThemedText>
                                              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                            Learn how we calculate your match
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <Feather
                                                name="chevron-right"
                                                size={24}
                                                color={theme.textSecondary}
                                              />
                        </Pressable>Pressable>
                
                  {/* Issue #10 fix: Surface the interactive demo from the Profile tab */}
                        <Pressable
                                    style={[
                                                  styles.privacyLink,
                                      {
                                                      backgroundColor: theme.primary + "10",
                                                      borderColor: theme.primary + "40",
                                      },
                                                ]}
                                    onPress={() => {
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                  rootNavigation.navigate("InteractiveDemo");
                                    }}
                                    testID="link-interactive-demo"                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            <Pressable                                style={[                                    styles.privacyLink,                                    {                                        backgroundColor: theme.success + "10",                                        borderColor: theme.success + "40",                                    },                                ]}                                onPress={() => {                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);                                    rootNavigation.navigate("ScenarioTesting");                                }}                                testID="link-scenario-testing"                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            <Pressable                                style={[                                    styles.privacyLink,                                    {                                        backgroundColor: theme.success + "10",                                        borderColor: theme.success + "40",                                    },                                ]}                                onPress={() => {                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);                                    rootNavigation.navigate("ScenarioTesting");                                }}                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            <Pressable                                style={[                                    styles.privacyLink,                                    {                                        backgroundColor: theme.success + "10",                                        borderColor: theme.success + "40",                                    },                                ]}                                onPress={() => {                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            <Pressable                                style={[                                    styles.privacyLink,                                    {                                        backgroundColor: theme.success + "10",                                        borderColor: theme.success + "40",                                    },                                ]}                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            <Pressable                                style={[                                    styles.privacyLink,                                    {                                        backgroundColor: theme.success + "10",                                        borderColor: theme.success + "40",                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            <Pressable                                style={[                                    styles.privacyLink,                                    {                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            <Pressable                                style={[                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            {/* Feature 3: Scenario Testing entry point */}                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                                />                            </Pressable>                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                                    size={24}                                    color={theme.primary}                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                                <Feather                                    name="chevron-right"                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                                    </ThemedText>                                </View>                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                                    <ThemedText type="small" style={{ color: theme.textSecondary }}>                                        See how adjusting priorities changes your matches in real time                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                                <View style={styles.sectionInfo}>                                    <ThemedText type="h4">Interactive Score Demo</ThemedText>                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                                    <Feather name="play-circle" size={20} color={theme.primary} />                                </View>                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                                    ]}                                >                            >                                <View                                    style={[                                        styles.sectionIcon,                                        { backgroundColor: theme.primary + "20" },                            >                                <View                                    style={[                            >
                                  >
                                  <View
                                                style={[
                                                                styles.sectionIcon,
                                                  { backgroundColor: theme.primary + "20" },
                                                              ]}
                                              >
                                              <Feather name="play-circle" size={20} color={theme.primary} />
                                  </View>View>
                                  <View style={styles.sectionInfo}>
                                              <ThemedText type="h4">Interactive Score Demo</ThemedText>ThemedText>
                                              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                            See how adjusting priorities changes your matches in real time
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <Feather
                                                name="chevron-right"
                                                size={24}
                                                color={theme.primary}
                                              />
                        </Pressable>Pressable>
                
                        <Pressable
                                    style={[
                                                  styles.premiumLink,
                                        {/* Feature 3: Scenario Testing entry point */}
                                                                    <Pressable
                                                                        style={[
                                                                                                                styles.privacyLink,
                                                                            {
                                                                                                                        backgroundColor: theme.success + "10",
                                                                                                                        borderColor: theme.success + "40",
                                                                                },
                                                                                                            ]}
                                                                        onPress={() => {
                                                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                                            rootNavigation.navigate("ScenarioTesting");
                                    }}
                                                            testID="link-scenario-testing"
                                                        >
                                                        <View
                                                                                                style={[
                                                                                                                                            styles.sectionIcon,
                                                                                                    { backgroundColor: theme.success + "20" },
                                                                                                                                        ]}
                                                                                            >
                                                                                            <Feather name="shuffle" size={20} color={theme.success} />
                                                        </View>View>
                                                        <View style={styles.sectionInfo}>
                                                                                            <ThemedText type="h4">What If? Scenario Testing</ThemedText>ThemedText>
                                                                                            <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                                                                                                    Explore how scores change with different life circumstances
                                                                                                </ThemedText>ThemedText>
                                                        </View>View>
                                                        <Feather
                                                                                                name="chevron-right"
                                                                                                size={24}
                                                                                                color={theme.success}
                                                                                            />
                        </Pressable>Pressable></Pressable>
                                      {
                                                      backgroundColor: theme.warning + "15",
                                                      borderColor: theme.warning + "40",
                                      },
                                                ]}
                                    onPress={() => {
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                  navigation.navigate("Premium");
                                    }}
                                    testID="link-premium"
                                  >
                                  <View
                                                style={[
                                                                styles.sectionIcon,
                                                  { backgroundColor: theme.warning + "30" },
                                                              ]}
                                              >
                                              <Feather name="star" size={20} color={theme.warning} />
                                  </View>View>
                                  <View style={styles.sectionInfo}>
                                              <ThemedText type="h4">EarthLook Premium</ThemedText>ThemedText>
                                              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                            Detailed reports, unlimited comparisons
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <Feather
                                                name="chevron-right"
                                                size={24}
                                                color={theme.warning}
                                              />
                        </Pressable>Pressable>
                
                        <Pressable
                                    style={[
                                                  styles.privacyLink,
                                      {
                                                      backgroundColor: theme.success + "10",
                                                      borderColor: theme.success + "30",
                                      },
                                                ]}
                                    onPress={() => {
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                  rootNavigation.navigate("SocialImpact");
                                    }}
                                    testID="link-social-impact"
                                  >
                                  <View
                                                style={[
                                                                styles.sectionIcon,
                                                  { backgroundColor: theme.success + "20" },
                                                              ]}
                                              >
                                              <Feather name="heart" size={20} color={theme.success} />
                                  </View>View>
                                  <View style={styles.sectionInfo}>
                                              <ThemedText type="h4">Social Impact</ThemedText>ThemedText>
                                              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                            Grant programs for underserved communities
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <Feather
                                                name="chevron-right"
                                                size={24}
                                                color={theme.success}
                                              />
                        </Pressable>Pressable>
                
                        <Pressable
                                    style={[
                                                  styles.privacyLink,
                                      {
                                                      backgroundColor: theme.backgroundDefault,
                                                      borderColor: theme.cardBorder,
                                      },
                                                ]}
                                    onPress={() => {
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                  navigation.navigate("Newsletter");
                                    }}
                                    testID="link-newsletter"
                                  >
                                  <View
                                                style={[
                                                                styles.sectionIcon,
                                                  { backgroundColor: theme.warning + "20" },
                                                              ]}
                                              >
                                              <Feather name="mail" size={20} color={theme.warning} />
                                  </View>View>
                                  <View style={styles.sectionInfo}>
                                              <ThemedText type="h4">Newsletter</ThemedText>ThemedText>
                                              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                            Get personalized city updates
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <Feather
                                                name="chevron-right"
                                                size={24}
                                                color={theme.textSecondary}
                                              />
                        </Pressable>Pressable>
                
                        <Pressable
                                    style={[
                                                  styles.privacyLink,
                                      {
                                                      backgroundColor: theme.backgroundDefault,
                                                      borderColor: theme.cardBorder,
                                      },
                                                ]}
                                    onPress={() => {
                                                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                  navigation.navigate("Support");
                                    }}
                                    testID="link-support"
                                  >
                                  <View
                                                style={[
                                                                styles.sectionIcon,
                                                  { backgroundColor: theme.link + "20" },
                                                              ]}
                                              >
                                              <Feather name="headphones" size={20} color={theme.link} />
                                  </View>View>
                                  <View style={styles.sectionInfo}>
                                              <ThemedText type="h4">Get Support</ThemedText>ThemedText>
                                              <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                            Contact us for help
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <Feather
                                                name="chevron-right"
                                                size={24}
                                                color={theme.textSecondary}
                                              />
                        </Pressable>Pressable>
                
                        <View style={styles.dangerZone}>
                                  <ThemedText
                                                type="small"
                                                style={[styles.dangerLabel, { color: theme.textSecondary }]}
                                              >
                                              Reset Profile
                                  </ThemedText>ThemedText>
                                  <Pressable onPress={handleResetProfile} style={styles.resetButton}>
                                              <Feather name="refresh-cw" size={16} color={theme.danger} />
                                              <ThemedText style={[styles.resetText, { color: theme.danger }]}>
                                                            Start Over
                                              </ThemedText>ThemedText>
                                  </Pressable>Pressable>
                        </View>View>
                </ScrollView>ScrollView>
        </View>View>
      );
}

interface SectionCardProps {
    title: string;
    description: string;
    icon: string;
    isExpanded: boolean;
    onPress: () => void;
    theme: any;
    children: React.ReactNode;
}

function SectionCard({
    title,
    description,
    icon,
    isExpanded,
    onPress,
    theme,
    children,
}: SectionCardProps) {
    return (
          <View
                  style={[
                            styles.sectionCard,
                    {
                                backgroundColor: theme.backgroundDefault,
                                borderColor: theme.cardBorder,
                    },
                          ]}
                >
                <Pressable onPress={onPress} style={styles.sectionHeader}>
                        <View
                                    style={[
                                                  styles.sectionIcon,
                                      { backgroundColor: theme.primary + "20" },
                                                ]}
                                  >
                                  <Feather name={icon as any} size={20} color={theme.primary} />
                        </View>View>
                        <View style={styles.sectionInfo}>
                                  <ThemedText type="h4">{title}</ThemedText>ThemedText>
                                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                    {description}
                                  </ThemedText>ThemedText>
                        </View>View>
                        <Feather
                                    name={isExpanded ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color={theme.textSecondary}
                                  />
                </Pressable>Pressable>
            {isExpanded ? children : null}
          </View>View>
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
    profileHeader: {
          alignItems: "center",
          marginBottom: Spacing["3xl"],
    },
    avatar: {
          width: 100,
          height: 100,
          borderRadius: 50,
          overflow: "hidden",
          marginBottom: Spacing.lg,
    },
    avatarImage: {
          width: "100%",
          height: "100%",
    },
    title: {
          fontSize: 28,
          fontWeight: "700",
          marginBottom: Spacing.sm,
    },
    subtitle: {
          textAlign: "center",
    },
    sectionCard: {
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          marginBottom: Spacing.lg,
          overflow: "hidden",
    },
    sectionHeader: {
          flexDirection: "row",
          alignItems: "center",
          padding: Spacing.lg,
    },
    sectionIcon: {
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          marginRight: Spacing.md,
    },
    sectionInfo: {
          flex: 1,
    },
    sectionContent: {
          paddingHorizontal: Spacing.lg,
          paddingBottom: Spacing.lg,
    },
    field: {
          marginBottom: Spacing["2xl"],
    },
    fieldLabel: {
          marginBottom: Spacing.md,
    },
    saveButton: {
          marginTop: Spacing.lg,
    },
    dangerZone: {
          marginTop: Spacing["2xl"],
          alignItems: "center",
    },
    dangerLabel: {
          marginBottom: Spacing.sm,
    },
    resetButton: {
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing.sm,
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.xl,
    },
    resetText: {
          fontWeight: "600",
    },
    privacyLink: {
          flexDirection: "row",
          alignItems: "center",
          padding: Spacing.lg,
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          marginBottom: Spacing.lg,
    },
    premiumLink: {
          flexDirection: "row",
          alignItems: "center",
          padding: Spacing.lg,
          borderRadius: BorderRadius.lg,
          borderWidth: 2,
          marginBottom: Spacing.lg,
    },
});</ScrollView>
