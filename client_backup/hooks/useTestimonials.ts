/**
 * Feature 2 — Community Testimonials
 *
 * useTestimonials fetches approved testimonials for a city from the server,
 * passing optional identity filter params so the server can sort identity-matched
 * testimonials to the top and compute a "people like you" aggregate rating.
 *
 * The hook also exposes a submitTestimonial function for users to write their
 * own review.
 */

import { useState, useEffect, useCallback } from "react";
import { getApiUrl } from "@/lib/query-client";
import { Testimonial, TestimonialAggregate, IdentityProfile } from "@/types";

interface UseTestimonialsState {
    testimonials: Testimonial[];
    aggregate: TestimonialAggregate | null;
    isLoading: boolean;
    error: string | null;
}

interface SubmitTestimonialData {
    content: string;
    rating: number;
    /** Optional identity dimensions to associate with the review */
  ethnicity?: string;
    genderIdentity?: string;
    sexualOrientation?: string;
    religion?: string;
    displayName?: string;
}

interface UseTestimonialsResult extends UseTestimonialsState {
    /**
     * Submit a testimonial. Returns true on success, false on failure.
     * The testimonial enters a "pending" moderation queue and won't appear
     * immediately in the fetched list.
     */
  submitTestimonial: (data: SubmitTestimonialData) => Promise<boolean>;
    /** Refetch testimonials (e.g. after a submission) */
  refetch: () => void;
}

/**
 * Builds a query string from the user's identity profile to request
 * identity-matched testimonials from the server.
 * Only includes dimensions that are non-empty.
 */
function buildIdentityQuery(identity?: Partial<IdentityProfile>): string {
    if (!identity) return "";
    const params = new URLSearchParams();
    if (identity.ethnicities?.[0]) {
          params.set("ethnicity", identity.ethnicities[0]);
    }
    if (identity.genderIdentity) {
          params.set("genderIdentity", identity.genderIdentity);
    }
    if (
          identity.sexualOrientation &&
          identity.sexualOrientation !== "Straight/Heterosexual"
        ) {
          params.set("sexualOrientation", identity.sexualOrientation);
    }
    if (identity.religion && identity.religion !== "Prefer not to say") {
          params.set("religion", identity.religion);
    }
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

export function useTestimonials(
    cityId: string,
    /** Pass the user's identity to enable "people like you" matching */
    identity?: Partial<IdentityProfile>
  ): UseTestimonialsResult {
    const [state, setState] = useState<UseTestimonialsState>({
          testimonials: [],
          aggregate: null,
          isLoading: false,
          error: null,
    });
    const [fetchCounter, setFetchCounter] = useState(0);

  const refetch = useCallback(() => {
        setFetchCounter((n) => n + 1);
  }, []);

  useEffect(() => {
        if (!cityId) return;
        let cancelled = false;

                const fetchTestimonials = async () => {
                        setState((prev) => ({ ...prev, isLoading: true, error: null }));
                        try {
                                  const query = buildIdentityQuery(identity);
                                  const apiUrl = getApiUrl();
                                  const url = new URL(
                                              `/api/testimonials/${encodeURIComponent(cityId)}${query}`,
                                              apiUrl
                                            ).toString();
                                  const res = await fetch(url);
                                  if (!res.ok) {
                                              throw new Error(`Server error: ${res.status}`);
                                  }
                                  const data = await res.json();
                                  if (!cancelled) {
                                              setState({
                                                            testimonials: data.testimonials ?? [],
                                                            aggregate: data.aggregate ?? null,
                                                            isLoading: false,
                                                            error: null,
                                              });
                                  }
                        } catch (err) {
                                  if (!cancelled) {
                                              setState((prev) => ({
                                                            ...prev,
                                                            isLoading: false,
                                                            error: "Unable to load testimonials",
                                              }));
                                  }
                        }
                };

                fetchTestimonials();
        return () => {
                cancelled = true;
        };
  }, [cityId, fetchCounter]);
    // Note: intentionally omitting `identity` from deps — we fetch once on mount
  // (and on explicit refetch). If identity changes frequently it would cause
  // excessive requests; users can tap "refetch" or navigate away.

  const submitTestimonial = useCallback(
        async (data: SubmitTestimonialData): Promise<boolean> => {
                try {
                          const apiUrl = getApiUrl();
                          const url = new URL("/api/testimonials", apiUrl).toString();
                          const res = await fetch(url, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ cityId, ...data }),
                          });
                          if (!res.ok) {
                                      return false;
                          }
                          return true;
                } catch {
                          return false;
                }
        },
        [cityId]
      );

  return { ...state, submitTestimonial, refetch };
}
