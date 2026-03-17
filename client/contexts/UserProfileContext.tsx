import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import {
    UserProfile,
    IdentityProfile,
    PriorityWeights,
    PrivacySettings,
    AppSettings,
    OnboardingStep,
    DEFAULT_IDENTITY,
    DEFAULT_PRIORITIES,
    DEFAULT_PRIVACY_SETTINGS,
    DEFAULT_APP_SETTINGS,
} from "@/types";
import {
    getUserProfile,
    saveUserProfile,
    createUserProfile,
    updateUserProfile,
} from "@/lib/storage";
import { clearScoreCache } from "@/lib/scoring";

interface UserProfileContextValue {
    profile: UserProfile | null;
    isLoading: boolean;
    hasProfileError: boolean;
    hasCompletedOnboarding: boolean;
    isAnonymousMode: boolean;
    onboardingStep: OnboardingStep;
    currentCityId: string | undefined;
    privacySettings: PrivacySettings;
    appSettings: AppSettings;
    updateIdentity: (identity: Partial<IdentityProfile>) => Promise<void>;
    updatePriorities: (priorities: Partial<PriorityWeights>) => Promise<void>;
    updatePrivacySettings: (settings: Partial<PrivacySettings>) => Promise<void>;
    updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;
    setOnboardingStep: (step: OnboardingStep) => Promise<void>;
    setCurrentCity: (cityId: string | undefined) => Promise<void>;
    completeOnboarding: () => Promise<void>;
    enterAnonymousMode: () => Promise<void>;
    exitAnonymousMode: () => Promise<void>;
    resetProfile: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextValue | undefined>(
    undefined
  );

export function UserProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Issue #16: track profile load failures so screens can show a proper error state
  const [hasProfileError, setHasProfileError] = useState(false);

  const loadProfile = async () => {
        try {
                setHasProfileError(false);
                let loadedProfile = await getUserProfile();
                if (!loadedProfile) {
                          loadedProfile = await createUserProfile();
                }
                setProfile(loadedProfile);
        } catch (error) {
                console.error("Error loading profile:", error);
                // Issue #16 fix: surface the error instead of silently continuing with null
          setHasProfileError(true);
        } finally {
                setIsLoading(false);
        }
  };

  useEffect(() => {
        loadProfile();
  }, []);

  const updateIdentity = async (identityUpdates: Partial<IdentityProfile>) => {
        if (!profile) return;
        const newIdentity = { ...profile.identity, ...identityUpdates };
        const updated = await updateUserProfile({ identity: newIdentity });
        setProfile(updated);
  };

  const updatePriorities = async (
        priorityUpdates: Partial<PriorityWeights>
      ) => {
        if (!profile) return;
        const newPriorities = { ...profile.priorities, ...priorityUpdates };
        const updated = await updateUserProfile({ priorities: newPriorities });
        setProfile(updated);
        // Issue #12 fix: invalidate the score cache whenever priorities change
        // so the Explore screen reflects the updated weights immediately
        clearScoreCache();
  };

  const setOnboardingStep = async (step: OnboardingStep) => {
        if (!profile) return;
        const updated = await updateUserProfile({ onboardingStep: step });
        setProfile(updated);
  };

  const completeOnboarding = async () => {
        if (!profile) return;
        const updated = await updateUserProfile({
                hasCompletedOnboarding: true,
                onboardingStep: 3,
        });
        setProfile(updated);
  };

  const setCurrentCity = async (cityId: string | undefined) => {
        if (!profile) return;
        const updated = await updateUserProfile({ currentCityId: cityId });
        setProfile(updated);
  };

  const updatePrivacySettings = async (
        settingsUpdates: Partial<PrivacySettings>
      ) => {
        if (!profile) return;
        const newSettings = {
                ...(profile.privacySettings || DEFAULT_PRIVACY_SETTINGS),
                ...settingsUpdates,
        };
        const updated = await updateUserProfile({ privacySettings: newSettings });
        setProfile(updated);
  };

  const updateAppSettings = async (settingsUpdates: Partial<AppSettings>) => {
        if (!profile) return;
        const newSettings = {
                ...(profile.appSettings || DEFAULT_APP_SETTINGS),
                ...settingsUpdates,
        };
        const updated = await updateUserProfile({ appSettings: newSettings });
        setProfile(updated);
  };

  const enterAnonymousMode = async () => {
        if (!profile) return;
        const updated = await updateUserProfile({
                isAnonymousMode: true,
                hasCompletedOnboarding: true,
        });
        setProfile(updated);
  };

  const exitAnonymousMode = async () => {
        if (!profile) return;
        const updated = await updateUserProfile({
                isAnonymousMode: false,
                hasCompletedOnboarding: false,
                onboardingStep: 0,
        });
        setProfile(updated);
  };

  const resetProfile = async () => {
        const newProfile = await createUserProfile();
        setProfile(newProfile);
  };

  const refreshProfile = async () => {
        await loadProfile();
  };

  return (
        <UserProfileContext.Provider
                value={{
                          profile,
                          isLoading,
                          hasProfileError,
                          hasCompletedOnboarding: profile?.hasCompletedOnboarding ?? false,
                          isAnonymousMode: profile?.isAnonymousMode ?? false,
                          onboardingStep: profile?.onboardingStep ?? 0,
                          currentCityId: profile?.currentCityId,
                          privacySettings: profile?.privacySettings ?? DEFAULT_PRIVACY_SETTINGS,
                          appSettings: profile?.appSettings ?? DEFAULT_APP_SETTINGS,
                          updateIdentity,
                          updatePriorities,
                          updatePrivacySettings,
                          updateAppSettings,
                          setOnboardingStep,
                          setCurrentCity,
                          completeOnboarding,
                          enterAnonymousMode,
                          exitAnonymousMode,
                          resetProfile,
                          refreshProfile,
                }}
              >
          {children}
        </UserProfileContext.Provider>
      );
}

export function useUserProfile() {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
          throw new Error("useUserProfile must be used within a UserProfileProvider");
    }
    return context;
}</UserProfileContext.Provider>
