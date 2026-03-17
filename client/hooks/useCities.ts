import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { CITIES } from "@/data/cities";
import {
    City,
    IdentityProfile,
    PriorityWeights,
    PrivacySettings,
    ScoreHighlight,
} from "@/types";
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

/**
 * Issue #14: Use stable JSON serialization so that two semantically identical
 * profiles always produce the same hash string, regardless of key insertion
 * order or JS engine differences.
 */
function stableStringify(obj: unknown): string {
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
          return JSON.stringify(obj);
    }
    const sortedKeys = Object.keys(obj as object).sort();
    const pairs = sortedKeys.map(
          (k) => `${JSON.stringify(k)}:${stableStringify((obj as Record<string, unknown>)[k])}`
        );
    return `{${pairs.join(",")}}`;
}

function generateProfileHash(
    identity: IdentityProfile,
    priorities: PriorityWeights,
    privacySettings: PrivacySettings
  ): string {
    // Issue #14 fix: use stableStringify to guarantee consistent key ordering
  return stableStringify({ identity, priorities, privacySettings });
}

export function useCities({
    identity,
    priorities,
    privacySettings,
}: UseCitiesOptions): UseCitiesResult {
    const [scoredCities, setScoredCities] = useState<ScoredCity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCacheHit, setIsCacheHit] = useState(false);

  const lastProfileHash = useRef<string>("");
    // Issue #15: Use a ref to guard against re-computation rather than
  // including scoredCities.length as a useCallback dependency, which
  // created a subtle feedback loop (compute → change length → new callback
  // → effect fires again).
  const hasComputedRef = useRef(false);

  const currentProfileHash = useMemo(
        () => generateProfileHash(identity, priorities, privacySettings),
        [identity, priorities, privacySettings]
      );

  const computeScores = useCallback(
        async (forceRefresh = false) => {
                // Issue #15 fix: guard with ref instead of scoredCities.length
          if (
                    currentProfileHash === lastProfileHash.current &&
                    !forceRefresh &&
                    hasComputedRef.current
                  ) {
                    return;
          }

          setIsLoading(true);

          try {
                    if (!forceRefresh) {
                                const cache = await getCachedCityScores();
                                if (cache && cache.profileHash === currentProfileHash) {
                                              const cachedMap = new Map(cache.scores.map((s) => [s.cityId, s]));
                                              const citiesFromCache: ScoredCity[] = CITIES.map((city) => {
                                                              const cached = cachedMap.get(city.id);
                                                              if (cached) {
                                                                                return {
                                                                                                    ...city,
                                                                                                    matchScore: cached.score,
                                                                                                    scoreBreakdown: cached.breakdown,
                                                                                                    highlights: cached.highlights as ScoreHighlight[],
                                                                                };
                                                              }
                                                              const filteredIdentity = applyPrivacyFilter(
                                                                                identity,
                                                                                privacySettings
                                                                              );
                                                              const result = calculateCityScore(
                                                                                city,
                                                                                filteredIdentity,
                                                                                priorities
                                                                              );
                                                              return {
                                                                                ...city,
                                                                                matchScore: result.overall,
                                                                                scoreBreakdown: result.breakdown,
                                                                                highlights: result.highlights,
                                                              };
                                              });
                                              setScoredCities(
                                                              citiesFromCache.sort((a, b) => b.matchScore - a.matchScore)
                                                            );
                                              setIsCacheHit(true);
                                              setIsLoading(false);
                                              lastProfileHash.current = currentProfileHash;
                                              hasComputedRef.current = true;
                                              return;
                                }
                    }

                  const filteredIdentity = applyPrivacyFilter(identity, privacySettings);
                    const computed: ScoredCity[] = CITIES.map((city) => {
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
                    hasComputedRef.current = true;

                  const cacheData: CachedCityScore[] = computed.map((city) => ({
                              cityId: city.id,
                              score: city.matchScore,
                              breakdown: city.scoreBreakdown,
                              highlights: city.highlights,
                  }));
                    await setCachedCityScores(
                                cacheData,
                                identity,
                                priorities,
                                privacySettings
                              );
          } catch (error) {
                    console.error("Error computing city scores:", error);
          } finally {
                    setIsLoading(false);
          }
        },
        // Issue #15: removed scoredCities.length from deps — using hasComputedRef instead
        [identity, priorities, privacySettings, currentProfileHash]
      );

  useEffect(() => {
        computeScores();
  }, [computeScores]);

  const refreshScores = useCallback(() => {
        hasComputedRef.current = false;
        computeScores(true);
  }, [computeScores]);

  const getCityById = useCallback(
        (id: string): ScoredCity | undefined => {
                return scoredCities.find((city) => city.id === id);
        },
        [scoredCities]
      );

  const getSponsoredCities = useCallback((): ScoredCity[] => {
        return scoredCities.filter((city) => city.sponsored?.isSponsored);
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
    return CITIES.find((city) => city.id === id);
}
