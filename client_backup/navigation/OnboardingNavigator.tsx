import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "@/screens/WelcomeScreen";
import IdentityStep1Screen from "@/screens/IdentityStep1Screen";
import IdentityStep2Screen from "@/screens/IdentityStep2Screen";
import PrioritiesStepScreen from "@/screens/PrioritiesStepScreen";
import InteractiveDemoScreen from "@/screens/InteractiveDemoScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { OnboardingStep } from "@/types";

export type OnboardingStackParamList = {
  Welcome: undefined;
  InteractiveDemo: undefined;
  IdentityStep1: undefined;
  IdentityStep2: undefined;
  PrioritiesStep: undefined;
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

const STEP_TO_SCREEN: Record<OnboardingStep, keyof OnboardingStackParamList> = {
  0: "Welcome",
  1: "IdentityStep1",
  2: "IdentityStep2",
  3: "PrioritiesStep",
};

export default function OnboardingNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });
  const { onboardingStep } = useUserProfile();

  const initialRouteName = STEP_TO_SCREEN[onboardingStep] || "Welcome";

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        ...screenOptions,
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="InteractiveDemo"
        component={InteractiveDemoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IdentityStep1"
        component={IdentityStep1Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IdentityStep2"
        component={IdentityStep2Screen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PrioritiesStep"
        component={PrioritiesStepScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
