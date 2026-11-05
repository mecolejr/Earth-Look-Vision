import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";
import ExploreStackNavigator from "@/navigation/ExploreStackNavigator";
import CompareStackNavigator from "@/navigation/CompareStackNavigator";
import MapStackNavigator from "@/navigation/MapStackNavigator";
import BlogStackNavigator from "@/navigation/BlogStackNavigator";
import ProfileStackNavigator from "@/navigation/ProfileStackNavigator";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/constants/theme";

export type MainTabParamList = {
    ExploreTab: undefined;
    MapTab: undefined;
    CompareTab: undefined;
    BlogTab: undefined;
    ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
    const { theme, isDark } = useTheme();

  return (
        <Tab.Navigator
                initialRouteName="ExploreTab"
                screenOptions={{
                          tabBarActiveTintColor: theme.primary,
                          tabBarInactiveTintColor: theme.tabIconDefault,
                          tabBarStyle: {
                                      position: "absolute",
                                      backgroundColor: Platform.select({
                                                    ios: "transparent",
                                                    android: theme.backgroundRoot,
                                      }),
                                      borderTopWidth: 0,
                                      elevation: 0,
                          },
                          tabBarBackground: () =>
                                      Platform.OS === "ios" ? (
                                                    <BlurView
                                                                    intensity={100}
                                                                    tint={isDark ? "dark" : "light"}
                                                                    style={StyleSheet.absoluteFill}
                                                                  />
                                                  ) : null,
                          headerShown: false,
                }}
              >
              <Tab.Screen
                        name="ExploreTab"
                        component={ExploreStackNavigator}
                        options={{
                                    title: "Explore",
                                    tabBarIcon: ({ color, size }) => (
                                                  <Feather name="compass" size={size} color={color} />
                                                ),
                        }}
                      />
          {/* Issue #4 fix: Hide Map tab on web — the map is native-only.
                    On web users see a dead-end placeholder; hiding it is a better UX
                              until a react-leaflet web implementation is added. */}
          {Platform.OS !== "web" && (
                        <Tab.Screen
                                    name="MapTab"
                                    component={MapStackNavigator}
                                    options={{
                                                  title: "Map",
                                                  tabBarIcon: ({ color, size }) => (
                                                                  <Feather name="map" size={size} color={color} />
                                                                ),
                                    }}
                                  />
                      )}
              <Tab.Screen
                        name="CompareTab"
                        component={CompareStackNavigator}
                        options={{
                                    title: "Compare",
                                    tabBarIcon: ({ color, size }) => (
                                                  <Feather name="columns" size={size} color={color} />
                                                ),
                        }}
                      />
              <Tab.Screen
                        name="BlogTab"
                        component={BlogStackNavigator}
                        options={{
                                    title: "Stories",
                                    tabBarIcon: ({ color, size }) => (
                                                  <Feather name="book-open" size={size} color={color} />
                                                ),
                        }}
                      />
              <Tab.Screen
                        name="ProfileTab"
                        component={ProfileStackNavigator}
                        options={{
                                    title: "Profile",
                                    tabBarIcon: ({ color, size }) => (
                                                  <Feather name="user" size={size} color={color} />
                                                ),
                        }}
                      />
        </Tab.Navigator>
      );
}
