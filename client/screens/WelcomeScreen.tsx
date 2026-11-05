import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Dimensions, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Spacing, BorderRadius, Fonts } from "@/constants/theme";
import { OnboardingStackParamList } from "@/navigation/OnboardingNavigator";
import { EXAMPLE_PERSONAS, Persona } from "@/data/personas";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface WelcomeScreenProps {
  navigation: NativeStackNavigationProp<OnboardingStackParamList, "Welcome">;
}

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { completeOnboarding, updateIdentity, updatePriorities, enterAnonymousMode } = useUserProfile();
  const [showPersonas, setShowPersonas] = useState(false);

  const pulseScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    glowOpacity.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleGetStarted = () => {
    navigation.navigate("IdentityStep1");
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const handleTryExample = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPersonas(true);
  };

  const handleTryDemo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate("InteractiveDemo");
  };

  const handleBrowseAnonymously = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await enterAnonymousMode();
  };

  const handleSelectPersona = async (persona: Persona) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateIdentity(persona.identity);
    await updatePriorities(persona.priorities);
    await completeOnboarding();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View style={styles.heroContainer}>
        <Image
          source={require("../../assets/images/welcome-hero.png")}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View
          style={[
            styles.heroOverlay,
            { backgroundColor: theme.backgroundRoot + "80" },
          ]}
        />
      </View>

      <View
        style={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing["2xl"] },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <ThemedText style={[styles.title, { fontFamily: Fonts?.serifBold }]}>
          Find cities where{"\n"}people like you thrive
        </ThemedText>

        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.textSecondary }]}
        >
          EarthLook uses your unique identity to calculate personalized
          compatibility scores for cities worldwide.
        </ThemedText>

        <View style={styles.features}>
          <FeatureItem
            icon="1"
            text="Tell us about yourself"
            theme={theme}
          />
          <FeatureItem
            icon="2"
            text="Set your priorities"
            theme={theme}
          />
          <FeatureItem
            icon="3"
            text="Discover your perfect match"
            theme={theme}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Animated.View
            style={[
              styles.buttonGlow,
              { backgroundColor: theme.primary },
              animatedGlowStyle,
            ]}
          />
          <Animated.View style={animatedButtonStyle}>
            <Button onPress={handleGetStarted} style={styles.button} testID="button-get-started">
              Get Started
            </Button>
          </Animated.View>
        </View>

        <View style={styles.secondaryActions}>
          <Pressable onPress={handleTryDemo} style={styles.secondaryButton} testID="button-try-demo">
            <Feather name="sliders" size={16} color={theme.primary} />
            <ThemedText
              type="body"
              style={[styles.secondaryButtonText, { color: theme.primary }]}
            >
              Try interactive demo
            </ThemedText>
          </Pressable>

          <Pressable onPress={handleTryExample} style={styles.secondaryButton} testID="button-try-persona">
            <Feather name="users" size={16} color={theme.textSecondary} />
            <ThemedText
              type="body"
              style={[styles.skipText, { color: theme.textSecondary }]}
            >
              Try with example persona
            </ThemedText>
          </Pressable>

          <Pressable onPress={handleBrowseAnonymously} style={styles.secondaryButton} testID="button-browse-anonymously">
            <Feather name="eye-off" size={16} color={theme.textSecondary} />
            <ThemedText
              type="body"
              style={[styles.skipText, { color: theme.textSecondary }]}
            >
              Browse anonymously
            </ThemedText>
          </Pressable>
        </View>

        {showPersonas ? (
          <Animated.View entering={FadeIn.duration(300)} style={styles.personasContainer}>
            <ThemedText type="h4" style={styles.personasTitle}>
              Choose an example persona
            </ThemedText>
            <ThemedText
              type="small"
              style={[styles.personasSubtitle, { color: theme.textSecondary }]}
            >
              See how EarthLook works before entering your own info
            </ThemedText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.personasList}
            >
              {EXAMPLE_PERSONAS.map((persona) => (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  theme={theme}
                  onSelect={() => handleSelectPersona(persona)}
                />
              ))}
            </ScrollView>
          </Animated.View>
        ) : (
          <ThemedText
            type="small"
            style={[styles.privacy, { color: theme.textSecondary }]}
          >
            Your data stays on your device. We never share your identity information.
          </ThemedText>
        )}
      </View>
    </View>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
  theme: any;
}

function FeatureItem({ icon, text, theme }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <View
        style={[styles.featureIcon, { backgroundColor: theme.primary + "20" }]}
      >
        <ThemedText style={[styles.featureNumber, { color: theme.primary }]}>
          {icon}
        </ThemedText>
      </View>
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
  );
}

interface PersonaCardProps {
  persona: Persona;
  theme: any;
  onSelect: () => void;
}

function PersonaCard({ persona, theme, onSelect }: PersonaCardProps) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.personaCard,
        { backgroundColor: theme.backgroundElevated, borderColor: theme.border },
      ]}
    >
      <View style={[styles.personaAvatar, { backgroundColor: theme.primary + "20" }]}>
        <Feather name="user" size={24} color={theme.primary} />
      </View>
      <ThemedText type="h4" style={styles.personaName}>
        {persona.name}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.personaTagline, { color: theme.textSecondary }]}
        numberOfLines={2}
      >
        {persona.tagline}
      </ThemedText>
      <View style={[styles.personaSelectButton, { backgroundColor: theme.primary }]}>
        <ThemedText style={styles.personaSelectText}>Try this</ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    height: SCREEN_WIDTH * 0.6,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing["2xl"],
    paddingTop: Spacing["2xl"],
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 56,
    height: 56,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    marginBottom: Spacing.lg,
  },
  subtitle: {
    marginBottom: Spacing["2xl"],
  },
  features: {
    marginBottom: Spacing["3xl"],
    gap: Spacing.lg,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  featureNumber: {
    fontSize: 14,
    fontWeight: "700",
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    position: "relative",
    marginBottom: Spacing.md,
  },
  buttonGlow: {
    position: "absolute",
    top: 4,
    left: 8,
    right: 8,
    bottom: -4,
    borderRadius: BorderRadius.lg,
    opacity: 0.3,
    pointerEvents: "none",
  },
  button: {},
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  skipText: {
    fontSize: 14,
  },
  personasContainer: {
    marginTop: Spacing.sm,
  },
  personasTitle: {
    marginBottom: Spacing.xs,
  },
  personasSubtitle: {
    marginBottom: Spacing.lg,
  },
  personasList: {
    gap: Spacing.md,
    paddingRight: Spacing.md,
  },
  personaCard: {
    width: 140,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: "center",
  },
  personaAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  personaName: {
    marginBottom: Spacing.xs,
    textAlign: "center",
  },
  personaTagline: {
    textAlign: "center",
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  personaSelectButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  personaSelectText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  privacy: {
    textAlign: "center",
  },
});
