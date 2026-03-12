import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CompareScreen from "@/screens/CompareScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type CompareStackParamList = {
  Compare: undefined;
};

const Stack = createNativeStackNavigator<CompareStackParamList>();

export default function CompareStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Compare"
        component={CompareScreen}
        options={{
          headerTitle: "Compare Cities",
        }}
      />
    </Stack.Navigator>
  );
}
