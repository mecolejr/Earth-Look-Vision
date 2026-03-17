import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "@/screens/ProfileScreen";
import PrivacySettingsScreen from "@/screens/PrivacySettingsScreen";
import ScoringMethodologyScreen from "@/screens/ScoringMethodologyScreen";
import PremiumScreen from "@/screens/PremiumScreen";
import SupportScreen from "@/screens/SupportScreen";
import NewsletterScreen from "@/screens/NewsletterScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type ProfileStackParamList = {
  Profile: undefined;
  PrivacySettings: undefined;
  ScoringMethodology: undefined;
  Premium: undefined;
  Support: undefined;
  Newsletter: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: "Profile",
        }}
      />
      <Stack.Screen
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{
          headerTitle: "Privacy Settings",
        }}
      />
      <Stack.Screen
        name="ScoringMethodology"
        component={ScoringMethodologyScreen}
        options={{
          headerTitle: "How Scores Work",
        }}
      />
      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{
          headerTitle: "Premium",
        }}
      />
      <Stack.Screen
        name="Support"
        component={SupportScreen}
        options={{
          headerTitle: "Support",
        }}
      />
      <Stack.Screen
        name="Newsletter"
        component={NewsletterScreen}
        options={{
          headerTitle: "Newsletter",
        }}
      />
    </Stack.Navigator>
  );
}
