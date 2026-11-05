import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BlogScreen from "@/screens/BlogScreen";
import BlogArticleScreen from "@/screens/BlogArticleScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type BlogStackParamList = {
  BlogList: undefined;
  BlogArticle: { articleId: string };
};

const Stack = createNativeStackNavigator<BlogStackParamList>();

export default function BlogStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="BlogList"
        component={BlogScreen}
        options={{ headerTitle: "Stories" }}
      />
      <Stack.Screen
        name="BlogArticle"
        component={BlogArticleScreen}
        options={{ headerTitle: "" }}
      />
    </Stack.Navigator>
  );
}
