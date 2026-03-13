import React from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator from "@/navigation/MainTabNavigator";
import OnboardingNavigator from "@/navigation/OnboardingNavigator";
import CityDetailScreen from "@/screens/CityDetailScreen";
import MovingChecklistScreen from "@/screens/MovingChecklistScreen";
import DetailedReportScreen from "@/screens/DetailedReportScreen";
import SocialImpactScreen from "@/screens/SocialImpactScreen";
// Issue #10: Import InteractiveDemoScreen so it can be reached post-onboarding
import InteractiveDemoScreen from "@/screens/InteractiveDemoScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useTheme } from "@/hooks/useTheme";

export type RootStackParamList = {
    Onboarding: undefined;
    Main: undefined;
    CityDetail: { cityId: string };
    MovingChecklist: { cityId: string };
    DetailedReport: { cityId: string };
    SocialImpact: undefined;
    // Issue #10: Add InteractiveDemo to the root stack so it's reachable from Profile
    InteractiveDemo: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
    const screenOptions = useScreenOptions();
    const { hasCompletedOnboarding, isLoading } = useUserProfile();
    const { theme } = useTheme();

  if (isLoading) {
        return (
                <View
                          style={{
                                      flex: 1,
                                      alignItems: "center",
                                      justifyContent: "center",
                                      backgroundColor: theme.backgroundRoot,
                          }}
                        >
                        <ActivityIndicator size="large" color={theme.primary} />
                </View>View>
              );
  }
  
    return (
          <Stack.Navigator screenOptions={screenOptions}>
            {hasCompletedOnboarding ? (
                    <>
                              <Stack.Screen
                                            name="Main"
                                            component={MainTabNavigator}
                                            options={{ headerShown: false }}
                                          />
                              <Stack.Screen
                                            name="CityDetail"
                                            component={CityDetailScreen}
                                            options={{
                                                            presentation: "modal",
                                                            headerTitle: "City Details",
                                            }}
                                          />
                              <Stack.Screen
                                            name="MovingChecklist"
                                            component={MovingChecklistScreen}
                                            options={{
                                                            headerTitle: "Moving Checklist",
                                            }}
                                          />
                              <Stack.Screen
                                            name="DetailedReport"
                                            component={DetailedReportScreen}
                                            options={{
                                                            headerTitle: "Detailed Report",
                                            }}
                                          />
                              <Stack.Screen
                                            name="SocialImpact"
                                            component={SocialImpactScreen}
                                            options={{
                                                            headerTitle: "Social Impact",
                                            }}
                                          />
                      {/* Issue #10 fix: Expose interactive demo after onboarding.
                                    Link to this from Profile → "See how scores work" */}
                              <Stack.Screen
                                            name="InteractiveDemo"
                                            component={InteractiveDemoScreen}
                                            options={{
                                                            presentation: "modal",
                                                            headerTitle: "How Scores Work",
                                            }}
                                          />
                    </>>
                  ) : (
                    <Stack.Screen
                                name="Onboarding"
                                component={OnboardingNavigator}
                                options={{ headerShown: false }}
                              />
                  )}
          </Stack.Navigator>Stack.Navigator>
        );
}</></View>
