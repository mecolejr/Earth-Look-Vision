import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UserProfile,
  DEFAULT_IDENTITY,
  DEFAULT_PRIORITIES,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_APP_SETTINGS,
} from "@/types";

const STORAGE_KEYS = {
  USER_PROFILE: "@earthlook/user_profile",
  SAVED_CITIES: "@earthlook/saved_cities",
  COMPARE_LIST: "@earthlook/compare_list",
  MOVING_CHECKLISTS: "@earthlook/moving_checklists",
  CITY_SCORES_CACHE: "@earthlook/city_scores_cache",
};

const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

export interface CachedCityScore {
  cityId: string;
  score: number;
  breakdown: Record<string, number>;
  highlights: Array<{ icon: string; text: string; type: "positive" | "warning" | "negative" }>;
}

export interface CityScoresCache {
  scores: CachedCityScore[];
  profileHash: string;
  timestamp: number;
}

function generateProfileHash(identity: any, priorities: any, privacySettings: any): string {
  return JSON.stringify({ identity, priorities, privacySettings });
}

export async function getCachedCityScores(): Promise<CityScoresCache | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CITY_SCORES_CACHE);
    if (!data) return null;
    
    const cache: CityScoresCache = JSON.parse(data);
    const now = Date.now();
    
    if (now - cache.timestamp > CACHE_EXPIRATION_MS) {
      await AsyncStorage.removeItem(STORAGE_KEYS.CITY_SCORES_CACHE);
      return null;
    }
    
    return cache;
  } catch (error) {
    console.error("Error getting cached city scores:", error);
    return null;
  }
}

export async function setCachedCityScores(
  scores: CachedCityScore[],
  identity: any,
  priorities: any,
  privacySettings: any
): Promise<void> {
  try {
    const cache: CityScoresCache = {
      scores,
      profileHash: generateProfileHash(identity, priorities, privacySettings),
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.CITY_SCORES_CACHE, JSON.stringify(cache));
  } catch (error) {
    console.error("Error caching city scores:", error);
  }
}

export async function isCacheValidForProfile(
  identity: any,
  priorities: any,
  privacySettings: any
): Promise<boolean> {
  const cache = await getCachedCityScores();
  if (!cache) return false;
  
  const currentHash = generateProfileHash(identity, priorities, privacySettings);
  return cache.profileHash === currentHash;
}

export async function invalidateCityScoresCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.CITY_SCORES_CACHE);
  } catch (error) {
    console.error("Error invalidating city scores cache:", error);
  }
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  category: "before" | "during" | "after";
}

export interface MovingChecklist {
  cityId: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_CHECKLIST_ITEMS: Omit<ChecklistItem, "id">[] = [
  { text: "Research neighborhoods and housing options", completed: false, category: "before" },
  { text: "Calculate cost of living differences", completed: false, category: "before" },
  { text: "Find LGBTQ+ friendly healthcare providers", completed: false, category: "before" },
  { text: "Research local community groups and organizations", completed: false, category: "before" },
  { text: "Visit the city if possible", completed: false, category: "before" },
  { text: "Start job search or remote work transition", completed: false, category: "before" },
  { text: "Get quotes from moving companies", completed: false, category: "before" },
  { text: "Notify current landlord/prepare current home", completed: false, category: "before" },
  { text: "Transfer utilities and update address", completed: false, category: "during" },
  { text: "Set up mail forwarding", completed: false, category: "during" },
  { text: "Update driver's license and vehicle registration", completed: false, category: "during" },
  { text: "Register to vote at new address", completed: false, category: "during" },
  { text: "Find local grocery stores and pharmacies", completed: false, category: "after" },
  { text: "Locate nearest emergency services", completed: false, category: "after" },
  { text: "Connect with local community groups", completed: false, category: "after" },
  { text: "Explore the neighborhood and meet neighbors", completed: false, category: "after" },
  { text: "Update bank and financial accounts", completed: false, category: "after" },
  { text: "Find local services (dentist, mechanic, etc.)", completed: false, category: "after" },
];

export async function getMovingChecklist(cityId: string): Promise<MovingChecklist | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MOVING_CHECKLISTS);
    const checklists: Record<string, MovingChecklist> = data ? JSON.parse(data) : {};
    return checklists[cityId] || null;
  } catch (error) {
    console.error("Error getting moving checklist:", error);
    return null;
  }
}

export async function createMovingChecklist(cityId: string): Promise<MovingChecklist> {
  const checklist: MovingChecklist = {
    cityId,
    items: DEFAULT_CHECKLIST_ITEMS.map((item, index) => ({
      ...item,
      id: `${cityId}_${index}_${Date.now()}`,
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveMovingChecklist(checklist);
  return checklist;
}

export async function saveMovingChecklist(checklist: MovingChecklist): Promise<void> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MOVING_CHECKLISTS);
    const checklists: Record<string, MovingChecklist> = data ? JSON.parse(data) : {};
    checklists[checklist.cityId] = {
      ...checklist,
      updatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEYS.MOVING_CHECKLISTS, JSON.stringify(checklists));
  } catch (error) {
    console.error("Error saving moving checklist:", error);
    throw error;
  }
}

export async function toggleChecklistItem(cityId: string, itemId: string): Promise<MovingChecklist | null> {
  const checklist = await getMovingChecklist(cityId);
  if (!checklist) return null;
  
  const updatedItems = checklist.items.map((item) =>
    item.id === itemId ? { ...item, completed: !item.completed } : item
  );
  
  const updatedChecklist = { ...checklist, items: updatedItems };
  await saveMovingChecklist(updatedChecklist);
  return updatedChecklist;
}

export async function addCustomChecklistItem(
  cityId: string,
  text: string,
  category: "before" | "during" | "after"
): Promise<MovingChecklist | null> {
  const checklist = await getMovingChecklist(cityId);
  if (!checklist) return null;
  
  const newItem: ChecklistItem = {
    id: `${cityId}_custom_${Date.now()}`,
    text,
    completed: false,
    category,
  };
  
  const updatedChecklist = {
    ...checklist,
    items: [...checklist.items, newItem],
  };
  await saveMovingChecklist(updatedChecklist);
  return updatedChecklist;
}

export async function deleteChecklistItem(cityId: string, itemId: string): Promise<MovingChecklist | null> {
  const checklist = await getMovingChecklist(cityId);
  if (!checklist) return null;
  
  const updatedChecklist = {
    ...checklist,
    items: checklist.items.filter((item) => item.id !== itemId),
  };
  await saveMovingChecklist(updatedChecklist);
  return updatedChecklist;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_PROFILE,
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

export async function createUserProfile(): Promise<UserProfile> {
  const profile: UserProfile = {
    id: `user_${Date.now()}`,
    identity: DEFAULT_IDENTITY,
    priorities: DEFAULT_PRIORITIES,
    privacySettings: DEFAULT_PRIVACY_SETTINGS,
    appSettings: DEFAULT_APP_SETTINGS,
    subscription: { tier: "free" },
    hasCompletedOnboarding: false,
    isAnonymousMode: false,
    onboardingStep: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await saveUserProfile(profile);
  return profile;
}

export async function updateUserProfile(
  updates: Partial<UserProfile>
): Promise<UserProfile> {
  const current = await getUserProfile();
  if (!current) {
    throw new Error("No user profile found");
  }
  const updated: UserProfile = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveUserProfile(updated);
  return updated;
}

export async function getSavedCities(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_CITIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting saved cities:", error);
    return [];
  }
}

export async function saveCityToList(cityId: string): Promise<void> {
  try {
    const current = await getSavedCities();
    if (!current.includes(cityId)) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_CITIES,
        JSON.stringify([...current, cityId])
      );
    }
  } catch (error) {
    console.error("Error saving city:", error);
    throw error;
  }
}

export async function removeCityFromList(cityId: string): Promise<void> {
  try {
    const current = await getSavedCities();
    await AsyncStorage.setItem(
      STORAGE_KEYS.SAVED_CITIES,
      JSON.stringify(current.filter((id) => id !== cityId))
    );
  } catch (error) {
    console.error("Error removing city:", error);
    throw error;
  }
}

export async function getCompareList(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPARE_LIST);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting compare list:", error);
    return [];
  }
}

export async function addToCompareList(cityId: string): Promise<void> {
  try {
    const current = await getCompareList();
    if (!current.includes(cityId) && current.length < 3) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPARE_LIST,
        JSON.stringify([...current, cityId])
      );
    }
  } catch (error) {
    console.error("Error adding to compare:", error);
    throw error;
  }
}

export async function removeFromCompareList(cityId: string): Promise<void> {
  try {
    const current = await getCompareList();
    await AsyncStorage.setItem(
      STORAGE_KEYS.COMPARE_LIST,
      JSON.stringify(current.filter((id) => id !== cityId))
    );
  } catch (error) {
    console.error("Error removing from compare:", error);
    throw error;
  }
}

export async function clearCompareList(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.COMPARE_LIST, JSON.stringify([]));
  } catch (error) {
    console.error("Error clearing compare list:", error);
    throw error;
  }
}

export async function clearAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}

export interface ExportedUserData {
  exportDate: string;
  appVersion: string;
  profile: UserProfile | null;
  savedCities: string[];
  compareList: string[];
}

export async function exportUserData(): Promise<ExportedUserData> {
  try {
    const profile = await getUserProfile();
    const savedCities = await getSavedCities();
    const compareList = await getCompareList();

    return {
      exportDate: new Date().toISOString(),
      appVersion: "1.0.0",
      profile,
      savedCities,
      compareList,
    };
  } catch (error) {
    console.error("Error exporting user data:", error);
    throw error;
  }
}
