/**
 * Feature 3 — Scenario Testing ("What If?")
 *
 * ScenarioTestingScreen lets users explore how their city scores would change
 * if their circumstances were different — without touching their real profile.
 *
 * Architecture:
 * - Reads the user's real profile from UserProfileContext (never modified here)
 * - Maintains an ephemeral "active scenario" in local state
 * - Calls calculateScenarioCityScore (scoring.ts) with the scenario overrides,
 *   which always uses skipCache = true
 * - Shows a before/after delta for the user's top cities
 *
 * Privacy: Scenario calculations stay client-side. No scenario data is sent
 * to the server. This is consistent with EarthLook's privacy-by-design principle.
 */

import React, { useState, useMemo } from "react";
import {
    View,
    ScrollView,
    StyleSheet,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius, getScoreColor } from "@/constants/theme";
import { getAllCities } from "@/data/cities";
import {
    calculateCityScore,
    calculateScenarioCityScore,
} from "@/lib/scoring";
import {
    ScenarioProfile,
    SCENARIO_TEMPLATES,
    IdentityProfile,
    PriorityWeights,
    CityWithScore,
} from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

interface ScenarioTestingScreenProps {
    navigation: NativeStackNavigationProp<RootStackParamList, "ScenarioTesting">;
}

const MAX_CITIES = 8;

function DeltaBadge({ delta, theme }: { delta: number; theme: any }) {
    if (delta === 0) {
          return (
                  <View style={[styles.deltaBadge, { backgroundColor: theme.backgroundRoot }]}>
                            <ThemedText style={[styles.deltaText, { color: theme.textSecondary }]}>
                                        No change
                            </ThemedText>ThemedText>
                  </View>View>
                );
    }
    const isPositive = delta > 0;
    const color = isPositive ? theme.success : theme.danger;
    return (
          <View style={[styles.deltaBadge, { backgroundColor: color + "15" }]}>
                  <Feather
                            name={isPositive ? "trending-up" : "trending-down"}
                            size={12}
                            color={color}
                          />
                  <ThemedText style={[styles.deltaText, { color }]}>
                    {isPositive ? "+" : ""}
                    {delta}
                  </ThemedText>ThemedText>
          </View>View>
        );
}

function ScenarioTemplateChip({
    template,
    isActive,
    onPress,
    theme,
}: {
    template: ScenarioProfile;
    isActive: boolean;
    onPress: () => void;
    theme: any;
}) {
    return (
          <Pressable
                  style={[
                            styles.chip,
                    {
                                backgroundColor: isActive ? theme.primary : theme.backgroundRoot,
                                borderColor: isActive ? theme.primary : theme.cardBorder,
                    },
                          ]}
                  onPress={onPress}
                >
                <ThemedText
                          style={[
                                      styles.chipText,
                            { color: isActive ? "#fff" : theme.textPrimary },
                                    ]}
                        >
                  {template.label}
                </ThemedText>ThemedText>
          </Pressable>Pressable>
        );
}

function CityScenarioRow({
    city,
    baseScore,
    scenarioScore,
    theme,
    onPress,
}: {
    city: CityWithScore;
    baseScore: number;
    scenarioScore: number;
    theme: any;
    onPress: () => void;
}) {
    const delta = scenarioScore - baseScore;
    return (
          <Pressable
                  style={[
                            styles.cityRow,
                    { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
                          ]}
                  onPress={onPress}
                >
                <View style={styles.cityInfo}>
                        <ThemedText style={styles.cityName}>
                          {city.name}
                          {city.state ? `, ${city.state}` : ""}
                        </ThemedText>ThemedText>
                        <ThemedText type="small" style={{ color: theme.textSecondary }}>
                          {city.country}
                        </ThemedText>ThemedText>
                </View>View>
                <View style={styles.scoreComparison}>
                        <View style={styles.scoreColumn}>
                                  <ThemedText
                                                type="small"
                                                style={{ color: theme.textSecondary, marginBottom: 2 }}
                                              >
                                              Now
                                  </ThemedText>ThemedText>
                                  <ThemedText
                                                style={[styles.scoreNumber, { color: getScoreColor(baseScore) }]}
                                              >
                                    {baseScore}
                                  </ThemedText>ThemedText>
                        </View>View>
                        <Feather name="arrow-right" size={16} color={theme.textSecondary} style={{ marginTop: 18 }} />
                        <View style={styles.scoreColumn}>
                                  <ThemedText
                                                type="small"
                                                style={{ color: theme.textSecondary, marginBottom: 2 }}
                                              >
                                              Scenario
                                  </ThemedText>ThemedText>
                                  <ThemedText
                                                style={[
                                                                styles.scoreNumber,
                                                  { color: getScoreColor(scenarioScore) },
                                                              ]}
                                              >
                                    {scenarioScore}
                                  </ThemedText>ThemedText>
                        </View>View>
                        <DeltaBadge delta={delta} theme={theme} />
                </View>View>
          </Pressable>Pressable>
        );
}

export default function ScenarioTestingScreen({
    navigation,
}: ScenarioTestingScreenProps) {
    const insets = useSafeAreaInsets();
    const headerHeight = useHeaderHeight();
    const { theme } = useTheme();
    const { profile, isLoading } = useUserProfile();
  
    const [activeScenario, setActiveScenario] = useState<ScenarioProfile | null>(
          null
        );
    const [customScenario, setCustomScenario] = useState<Partial<ScenarioProfile>>({});
  
    const cities = useMemo(() => getAllCities().slice(0, MAX_CITIES), []);
  
    // Compute base scores (real profile, cached)
    const baseScores = useMemo(() => {
          if (!profile) return {};
          const result: Record<string, number> = {};
          for (const city of cities) {
                  result[city.id] = calculateCityScore(
                            city,
                            profile.identity,
                            profile.priorities,
                            profile.privacySettings
                          ).overall;
          }
          return result;
    }, [cities, profile]);
  
    // Compute scenario scores (always skipCache)
    const scenarioScores = useMemo(() => {
          if (!profile || !activeScenario) return {};
          const result: Record<string, number> = {};
          for (const city of cities) {
                  result[city.id] = calculateScenarioCityScore(
                            city,
                            profile.identity,
                            profile.priorities,
                    {
                                identityOverrides: activeScenario.identityOverrides,
                                priorityOverrides: activeScenario.priorityOverrides,
                    }
                          ).overall;
          }
          return result;
    }, [cities, profile, activeScenario]);
  
    const handleSelectTemplate = (template: ScenarioProfile) => {
          setActiveScenario((prev) =>
                  prev?.label === template.label ? null : template
                );
    };
  
    if (isLoading) {
          return (
                  <View
                            style={[
                                        styles.container,
                                        styles.centered,
                              { backgroundColor: theme.backgroundRoot },
                                      ]}
                          >
                          <ActivityIndicator size="large" color={theme.primary} />
                  </View>View>
                );
    }
  
    if (!profile) {
          return (
                  <View
                            style={[
                                        styles.container,
                                        styles.centered,
                              { backgroundColor: theme.backgroundRoot },
                                      ]}
                          >
                          <ThemedText>Please complete your profile to use Scenario Testing.</ThemedText>ThemedText>
                  </View>View>
                );
    }
  
    // Sort cities by base score descending for consistent ordering
    const sortedCities = [...cities].sort(
          (a, b) => (baseScores[b.id] ?? 0) - (baseScores[a.id] ?? 0)
              );
  
    return (
          <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
                <ScrollView
                          contentContainerStyle={[
                                      styles.scrollContent,
                            {
                                          paddingTop: headerHeight + Spacing.lg,
                                          paddingBottom: insets.bottom + Spacing["3xl"],
                            },
                                    ]}
                          showsVerticalScrollIndicator={false}
                        >
                  {/* Header */}
                        <View style={styles.heroSection}>
                                  <View
                                                style={[
                                                                styles.heroIcon,
                                                  { backgroundColor: theme.primary + "15" },
                                                              ]}
                                              >
                                              <Feather name="shuffle" size={32} color={theme.primary} />
                                  </View>View>
                                  <ThemedText type="h2" style={styles.heroTitle}>
                                              What If?
                                  </ThemedText>ThemedText>
                                  <ThemedText
                                                type="body"
                                                style={[styles.heroSubtitle, { color: theme.textSecondary }]}
                                              >
                                              Explore how your city scores would change under different
                                              circumstances — without changing your profile.
                                  </ThemedText>ThemedText>
                        </View>View>
                
                  {/* Scenario template chips */}
                        <View
                                    style={[
                                                  styles.section,
                                      {
                                                      backgroundColor: theme.backgroundDefault,
                                                      borderColor: theme.cardBorder,
                                      },
                                                ]}
                                  >
                                  <ThemedText type="h4" style={styles.sectionTitle}>
                                              Choose a Scenario
                                  </ThemedText>ThemedText>
                                  <ThemedText
                                                type="small"
                                                style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
                                              >
                                              Tap a scenario to see how your scores change
                                  </ThemedText>ThemedText>
                                  <View style={styles.chipList}>
                                    {SCENARIO_TEMPLATES.map((template) => (
                                                  <ScenarioTemplateChip
                                                                    key={template.label}
                                                                    template={template}
                                                                    isActive={activeScenario?.label === template.label}
                                                                    onPress={() => handleSelectTemplate(template)}
                                                                    theme={theme}
                                                                  />
                                                ))}
                                  </View>View>
                        
                          {activeScenario ? (
                                                <View
                                                                style={[
                                                                                  styles.activeScenarioCard,
                                                                  {
                                                                                      backgroundColor: theme.primary + "08",
                                                                                      borderColor: theme.primary + "25",
                                                                  },
                                                                                ]}
                                                              >
                                                              <ThemedText style={{ fontWeight: "600", marginBottom: Spacing.xs }}>
                                                                {activeScenario.label}
                                                              </ThemedText>ThemedText>
                                                              <ThemedText
                                                                                type="small"
                                                                                style={{ color: theme.textSecondary }}
                                                                              >
                                                                {activeScenario.description}
                                                              </ThemedText>ThemedText>
                                                  {activeScenario.identityOverrides ? (
                                                                                <ThemedText
                                                                                                    type="small"
                                                                                                    style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
                                                                                                  >
                                                                                                  Identity changes:{" "}
                                                                                  {Object.entries(activeScenario.identityOverrides)
                                                                                                        .filter(([, v]) => v !== undefined)
                                                                                                        .map(([k, v]) => `${k}: ${v}`)
                                                                                                        .join(", ")}
                                                                                </ThemedText>ThemedText>
                                                                              ) : null}
                                                  {activeScenario.priorityOverrides ? (
                                                                                <ThemedText
                                                                                                    type="small"
                                                                                                    style={{ color: theme.textSecondary, marginTop: Spacing.xs }}
                                                                                                  >
                                                                                                  Priority changes:{" "}
                                                                                  {Object.entries(activeScenario.priorityOverrides)
                                                                                                        .filter(([, v]) => v !== undefined)
                                                                                                        .map(([k, v]) => `${k}: ${v}`)
                                                                                                        .join(", ")}
                                                                                </ThemedText>ThemedText>
                                                                              ) : null}
                                                </View>View>
                                              ) : (
                                                <View
                                                                style={[
                                                                                  styles.noScenarioHint,
                                                                  { backgroundColor: theme.backgroundRoot, borderColor: theme.cardBorder },
                                                                                ]}
                                                              >
                                                              <Feather name="info" size={16} color={theme.textSecondary} />
                                                              <ThemedText
                                                                                type="small"
                                                                                style={{ color: theme.textSecondary, marginLeft: Spacing.sm, flex: 1 }}
                                                                              >
                                                                              Select a scenario above to see how your scores would change.
                                                              </ThemedText>ThemedText>
                                                </View>View>
                                  )}
                        </View>View>
                
                  {/* City comparison table */}
                        <View
                                    style={[
                                                  styles.section,
                                      {
                                                      backgroundColor: theme.backgroundDefault,
                                                      borderColor: theme.cardBorder,
                                      },
                                                ]}
                                  >
                                  <ThemedText type="h4" style={styles.sectionTitle}>
                                              Your Top Cities
                                  </ThemedText>ThemedText>
                          {!activeScenario ? (
                                                <ThemedText
                                                                type="small"
                                                                style={{ color: theme.textSecondary, marginBottom: Spacing.md }}
                                                              >
                                                              Select a scenario above to see how scores change
                                                </ThemedText>ThemedText>
                                              ) : (
                                                <ThemedText
                                                                type="small"
                                                                style={{ color: theme.textSecondary, marginBottom: Spacing.md }}
                                                              >
                                                              Sorted by your current score. Tap a city for full details.
                                                </ThemedText>ThemedText>
                                  )}
                        
                          {sortedCities.map((city) => (
                                                <CityScenarioRow
                                                                key={city.id}
                                                                city={{ ...city, personalizedScore: { overall: baseScores[city.id] ?? 0, breakdown: {} as any, highlights: [], concerns: [] } }}
                                                                baseScore={baseScores[city.id] ?? 0}
                                                                scenarioScore={
                                                                                  activeScenario
                                                                                    ? (scenarioScores[city.id] ?? baseScores[city.id] ?? 0)
                                                                                    : baseScores[city.id] ?? 0
                                                                }
                                                                theme={theme}
                                                                onPress={() =>
                                                                                  navigation.navigate("CityDetail", { cityId: city.id })
                                                                }
                                                              />
                                              ))}
                        </View>View>
                
                  {/* Privacy notice */}
                        <View
                                    style={[
                                                  styles.privacyNote,
                                      {
                                                      backgroundColor: theme.backgroundDefault,
                                                      borderColor: theme.cardBorder,
                                      },
                                                ]}
                                  >
                                  <Feather name="lock" size={14} color={theme.textSecondary} />
                                  <ThemedText
                                                type="small"
                                                style={{ color: theme.textSecondary, marginLeft: Spacing.sm, flex: 1 }}
                                              >
                                              Scenarios are computed entirely on your device. No scenario data is
                                              ever sent to our servers, and your real profile is never modified.
                                  </ThemedText>ThemedText>
                        </View>View>
                </ScrollView>ScrollView>
          </View>View>
        );
}

const styles = StyleSheet.create({
    container: {
          flex: 1,
    },
    centered: {
          alignItems: "center",
          justifyContent: "center",
    },
    scrollContent: {
          paddingHorizontal: Spacing.lg,
    },
    heroSection: {
          alignItems: "center",
          marginBottom: Spacing.xl,
    },
    heroIcon: {
          width: 72,
          height: 72,
          borderRadius: 36,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: Spacing.lg,
    },
    heroTitle: {
          textAlign: "center",
          marginBottom: Spacing.sm,
    },
    heroSubtitle: {
          textAlign: "center",
          lineHeight: 22,
          maxWidth: 320,
    },
    section: {
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          padding: Spacing.xl,
          marginBottom: Spacing.lg,
    },
    sectionTitle: {
          marginBottom: Spacing.xs,
    },
    sectionSubtitle: {
          marginBottom: Spacing.lg,
    },
    chipList: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: Spacing.sm,
          marginBottom: Spacing.lg,
    },
    chip: {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          borderRadius: BorderRadius.full ?? 100,
          borderWidth: 1,
    },
    chipText: {
          fontSize: 13,
          fontWeight: "500",
    },
    activeScenarioCard: {
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          padding: Spacing.lg,
    },
    noScenarioHint: {
          flexDirection: "row",
          alignItems: "center",
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          padding: Spacing.lg,
    },
    cityRow: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          padding: Spacing.lg,
          marginBottom: Spacing.sm,
    },
    cityInfo: {
          flex: 1,
          marginRight: Spacing.md,
    },
    cityName: {
          fontWeight: "600",
          fontSize: 15,
          marginBottom: 2,
    },
    scoreComparison: {
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing.sm,
    },
    scoreColumn: {
          alignItems: "center",
          minWidth: 36,
    },
    scoreNumber: {
          fontSize: 22,
          fontWeight: "700",
    },
    deltaBadge: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.sm,
          paddingVertical: 3,
          borderRadius: BorderRadius.sm,
          gap: 3,
          minWidth: 56,
          justifyContent: "center",
    },
    deltaText: {
          fontSize: 12,
          fontWeight: "600",
    },
    privacyNote: {
          flexDirection: "row",
          alignItems: "flex-start",
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          padding: Spacing.lg,
          marginBottom: Spacing.lg,
    },
});</Pressable>
