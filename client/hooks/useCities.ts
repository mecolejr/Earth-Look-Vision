import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { CITIES } from "@/data/cities";
import { City, IdentityProfile, PriorityWeights, PrivacySettings, ScoreHighlight } from "@/types";
import { calculateCityScore, applyPrivacyFilter } from "@/lib/scoring";
import {
  getCachedCityScores,
  setCachedCityScores,
  CachedCityScore,
} from "@/lib/storage";

export interface ScoredCity extends City {
  matchScore: number;
  scoreBreakdown: Record<string, number>;
  highlights: ScoreHighlight[];
}

interface UseCitiesOptions {
  identity: IdentityProfile;
  priorities: PriorityWeights;
  privacySettings: PrivacySettings;
}

interface UseCitiesResult {
  cities: ScoredCity[];
  isLoading: boolean;
  isCacheHit: boolean;
  refreshScores: () => void;
  getCityById: (id: string) => ScoredCity | undefined;
  getSponsoredCities: () => ScoredCity[];
}

function generateProfileHash(identity: IdentityProfile, priorities: PriorityWeights, privacySettings: PrivacySettings): string {
  return JSON.stringify({ identity, priorities, privacySettings });
}

export function useCities({ identity, priorities, privacySettings }: UseCitiesOptions): UseCitiesResult {
  const [scoredCities, setScoredCities] = useState<ScoredCity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCacheHit, setIsCacheHit] = useState(false);
  const lastProfileHash = useRef<string>("");

  const currentProfileHash = useMemo(
    () => generateProfileHash(identity, priorities, privacySettings),
    [identity, priorities, privacySettings]
  );

  const computeScores = useCallback(async (forceRefresh = false) => {
    if (currentProfileHash === lastProfileHash.current && !forceRefresh && scoredCities.length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      if (!forceRefresh) {
        const cache = await getCachedCityScores();
        if (cache && cache.profileHash === currentProfileHash) {
          const cachedMap = new Map(cache.scores.map(s => [s.cityId, s]));
          const citiesFromCache: ScoredCity[] = CITIES.map(city => {
            const cached = cachedMap.get(city.id);
            if (cached) {
              return {
                ...city,
                matchScore: cached.score,
                scoreBreakdown: cached.breakdown,
                highlights: cached.highlights as ScoreHighlight[],
              };
            }
            const filteredIdentity = applyPrivacyFilter(identity, privacySettings);
            const result = calculateCityScore(city, filteredIdentity, priorities);
            return {
              ...city,
              matchScore: result.overall,
              scoreBreakdown: result.breakdown,
              highlights: result.highlights,
            };
          });

          setScoredCities(citiesFromCache.sort((a, b) => b.matchScore - a.matchScore));
          setIsCacheHit(true);
          setIsLoading(false);
          lastProfileHash.current = currentProfileHash;
          return;
        }
      }

      const filteredIdentity = applyPrivacyFilter(identity, privacySettings);
      const computed: ScoredCity[] = CITIES.map(city => {
        const result = calculateCityScore(city, filteredIdentity, priorities);
        return {
          ...city,
          matchScore: result.overall,
          scoreBreakdown: result.breakdown,
          highlights: result.highlights,
        };
      });

      computed.sort((a, b) => b.matchScore - a.matchScore);
      setScoredCities(computed);
      setIsCacheHit(false);
      lastProfileHash.current = currentProfileHash;

      const cacheData: CachedCityScore[] = computed.map(city => ({
        cityId: city.id,
        score: city.matchScore,
        breakdown: city.scoreBreakdown,
        highlights: city.highlights,
      }));
      await setCachedCityScores(cacheData, identity, priorities, privacySettings);
    } catch (error) {
      console.error("Error computing city scores:", error);
    } finally {
      setIsLoading(false);
    }
  }, [identity, priorities, privacySettings, currentProfileHash, scoredCities.length]);

  useEffect(() => {
    computeScores();
  }, [computeScores]);

  const refreshScores = useCallback(() => {
    computeScores(true);
  }, [computeScores]);

  const getCityById = useCallback((id: string): ScoredCity | undefined => {
    return scoredCities.find(city => city.id === id);
  }, [scoredCities]);

  const getSponsoredCities = useCallback((): ScoredCity[] => {
    return scoredCities.filter(city => city.sponsored?.isSponsored);
  }, [scoredCities]);

  return {
    cities: scoredCities,
    isLoading,
    isCacheHit,
    refreshScores,
    getCityById,
    getSponsoredCities,
  };
}

export function getCityByIdStatic(id: string): City | undefined {
  return CITIES.find(city => city.id === id);
}
