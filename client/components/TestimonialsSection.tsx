/**
 * Feature 2 — Community Testimonials & "People Like You" Layer
 *
 * TestimonialsSection renders inside CityDetailScreen.
 * It shows:
 * 1. An aggregate "people like you" rating banner (when identity-matched data exists)
 * 2. Individual testimonial cards, with identity-matched ones first
 * 3. A write-a-review form (collapsible)
 *
 * Privacy: The component only passes identity dimensions to the server if the
 * user's privacy settings permit them (handled by the caller passing identity
 * from the privacy-filtered profile).
 */

import React, { useState } from "react";
import {
    View,
    StyleSheet,
    Pressable,
    TextInput,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { IdentityProfile, Testimonial, TestimonialAggregate } from "@/types";

interface TestimonialsSectionProps {
    cityId: string;
    /** Pass the privacy-filtered identity to enable "people like you" matching */
  identity?: Partial<IdentityProfile>;
}

function StarRating({
    rating,
    interactive = false,
    onRate,
    size = 16,
    color,
}: {
    rating: number;
    interactive?: boolean;
    onRate?: (r: number) => void;
    size?: number;
    color: string;
}) {
    return (
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
                    <Pressable
                                key={star}
                                onPress={() => interactive && onRate?.(star)}
                                disabled={!interactive}
                              >
                              <Feather
                                            name={star <= rating ? "star" : "star"}
                                            size={size}
                                            color={star <= rating ? "#F59E0B" : color + "40"}
                                          />
                    </Pressable>Pressable>
                  ))}
          </View>View>
        );
}

function AggregateBanner({
    aggregate,
    theme,
}: {
    aggregate: TestimonialAggregate;
    theme: any;
}) {
    const hasIdentityData =
          aggregate.identityMatchCount && aggregate.identityMatchCount > 0;
  
    return (
          <View
                  style={[
                            styles.aggregateBanner,
                    { backgroundColor: theme.primary + "12", borderColor: theme.primary + "30" },
                          ]}
                >
                <View style={styles.aggregateRow}>
                        <View style={styles.aggregateScore}>
                                  <ThemedText style={[styles.aggregateNumber, { color: theme.primary }]}>
                                    {aggregate.averageRating.toFixed(1)}
                                  </ThemedText>ThemedText>
                                  <StarRating rating={Math.round(aggregate.averageRating)} color={theme.textSecondary} />
                                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                    {aggregate.totalCount} review{aggregate.totalCount !== 1 ? "s" : ""}
                                  </ThemedText>ThemedText>
                        </View>View>
                
                  {hasIdentityData && aggregate.identityMatchRating !== undefined ? (
                            <View
                                          style={[
                                                          styles.identityMatchBox,
                                            { backgroundColor: theme.success + "15", borderColor: theme.success + "30" },
                                                        ]}
                                        >
                                        <Feather name="users" size={14} color={theme.success} />
                                        <View style={{ marginLeft: Spacing.xs }}>
                                                      <ThemedText
                                                                        type="small"
                                                                        style={{ color: theme.success, fontWeight: "600" }}
                                                                      >
                                                        {aggregate.identityMatchRating.toFixed(1)} / 5
                                                      </ThemedText>ThemedText>
                                                      <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                                      from {aggregate.identityMatchCount} people like you
                                                        {aggregate.matchedDimensions?.length
                                                                            ? ` (${aggregate.matchedDimensions.join(", ")})`
                                                                            : ""}
                                                      </ThemedText>ThemedText>
                                        </View>View>
                            </View>View>
                          ) : null}
                </View>View>
          </View>View>
        );
}

function TestimonialCard({
    testimonial,
    theme,
}: {
    testimonial: Testimonial;
    theme: any;
}) {
    const name = testimonial.displayName || "Anonymous";
    const date = new Date(testimonial.createdAt).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
    });
  
    // Build a short identity tag if dimensions were shared
    const identityParts: string[] = [];
    if (testimonial.ethnicity) identityParts.push(testimonial.ethnicity);
    if (testimonial.sexualOrientation && testimonial.sexualOrientation !== "Straight/Heterosexual") {
          identityParts.push(testimonial.sexualOrientation);
    }
    if (testimonial.genderIdentity && !["Woman", "Man"].includes(testimonial.genderIdentity)) {
          identityParts.push(testimonial.genderIdentity);
    }
    if (testimonial.religion && testimonial.religion !== "Prefer not to say") {
          identityParts.push(testimonial.religion);
    }
  
    return (
          <View
                  style={[
                            styles.testimonialCard,
                    { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
                          ]}
                >
                <View style={styles.cardHeader}>
                        <View style={styles.cardAuthor}>
                                  <View
                                                style={[styles.avatarCircle, { backgroundColor: theme.primary + "20" }]}
                                              >
                                              <ThemedText style={[styles.avatarInitial, { color: theme.primary }]}>
                                                {name[0].toUpperCase()}
                                              </ThemedText>ThemedText>
                                  </View>View>
                                  <View>
                                              <ThemedText style={styles.authorName}>{name}</ThemedText>ThemedText>
                                    {identityParts.length > 0 ? (
                                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                  {identityParts.join(" · ")}
                                </ThemedText>ThemedText>
                              ) : null}
                                  </View>View>
                        </View>View>
                        <View style={styles.cardMeta}>
                                  <StarRating rating={testimonial.rating} color={theme.textSecondary} size={14} />
                                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                    {date}
                                  </ThemedText>ThemedText>
                        </View>View>
                </View>View>
                <ThemedText type="body" style={styles.testimonialContent}>
                  {testimonial.content}
                </ThemedText>ThemedText>
          </View>View>
        );
}

function WriteReviewForm({
    onSubmit,
    onCancel,
    theme,
}: {
    onSubmit: (content: string, rating: number, displayName?: string) => Promise<void>;
    onCancel: () => void;
    theme: any;
}) {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [displayName, setDisplayName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
  
    const canSubmit = content.trim().length >= 10 && rating >= 1;
  
    const handleSubmit = async () => {
          if (!canSubmit || isSubmitting) return;
          setIsSubmitting(true);
          await onSubmit(content.trim(), rating, displayName.trim() || undefined);
          setIsSubmitting(false);
          setSubmitted(true);
    };
  
    if (submitted) {
          return (
                  <View
                            style={[
                                        styles.reviewForm,
                              { backgroundColor: theme.success + "10", borderColor: theme.success + "30" },
                                      ]}
                          >
                          <Feather name="check-circle" size={20} color={theme.success} />
                          <ThemedText style={{ marginLeft: Spacing.sm, color: theme.success }}>
                                    Thanks! Your review is under review and will appear once approved.
                          </ThemedText>ThemedText>
                  </View>View>
                );
    }
  
    return (
          <View
                  style={[
                            styles.reviewForm,
                    { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
                          ]}
                >
                <ThemedText type="h4" style={{ marginBottom: Spacing.md }}>
                        Write a Review
                </ThemedText>ThemedText>
          
                <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: Spacing.xs }}>
                        Your rating
                </ThemedText>ThemedText>
                <StarRating
                          rating={rating}
                          interactive
                          onRate={setRating}
                          size={28}
                          color={theme.textSecondary}
                        />
          
                <ThemedText
                          type="small"
                          style={{ color: theme.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.xs }}
                        >
                        Display name (optional — leave blank to post anonymously)
                </ThemedText>ThemedText>
                <TextInput
                          style={[
                                      styles.textInput,
                            { borderColor: theme.cardBorder, color: theme.textPrimary, backgroundColor: theme.backgroundRoot },
                                    ]}
                          placeholder="Your name or leave blank"
                          placeholderTextColor={theme.textSecondary}
                          value={displayName}
                          onChangeText={setDisplayName}
                          maxLength={50}
                        />
          
                <ThemedText
                          type="small"
                          style={{ color: theme.textSecondary, marginTop: Spacing.md, marginBottom: Spacing.xs }}
                        >
                        Your experience ({content.length}/280)
                </ThemedText>ThemedText>
                <TextInput
                          style={[
                                      styles.textArea,
                            { borderColor: theme.cardBorder, color: theme.textPrimary, backgroundColor: theme.backgroundRoot },
                                    ]}
                          placeholder="What was living here like for you? (min 10 characters)"
                          placeholderTextColor={theme.textSecondary}
                          value={content}
                          onChangeText={setContent}
                          multiline
                          maxLength={280}
                          numberOfLines={4}
                          textAlignVertical="top"
                        />
          
                <ThemedText
                          type="small"
                          style={{ color: theme.textSecondary, marginTop: Spacing.sm, marginBottom: Spacing.md }}
                        >
                        Your review goes into a moderation queue before appearing publicly.
                        Your identity information (if any) is only used to help others find
                        reviews from people like them.
                </ThemedText>ThemedText>
          
                <View style={styles.formButtons}>
                        <Pressable
                                    style={[styles.cancelButton, { borderColor: theme.cardBorder }]}
                                    onPress={onCancel}
                                  >
                                  <ThemedText style={{ color: theme.textSecondary }}>Cancel</ThemedText>ThemedText>
                        </Pressable>Pressable>
                        <Pressable
                                    style={[
                                                  styles.submitButton,
                                      { backgroundColor: canSubmit ? theme.primary : theme.primary + "40" },
                                                ]}
                                    onPress={handleSubmit}
                                    disabled={!canSubmit || isSubmitting}
                                  >
                          {isSubmitting ? (
                                                <ActivityIndicator size="small" color="#fff" />
                                              ) : (
                                                <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
                                                              Submit Review
                                                </ThemedText>ThemedText>
                                  )}
                        </Pressable>Pressable>
                </View>View>
          </View>View>
        );
}

export function TestimonialsSection({
    cityId,
    identity,
}: TestimonialsSectionProps) {
    const { theme } = useTheme();
    const { testimonials, aggregate, isLoading, error, submitTestimonial } =
          useTestimonials(cityId, identity);
    const [showForm, setShowForm] = useState(false);
  
    const handleSubmit = async (
          content: string,
          rating: number,
          displayName?: string
        ) => {
          // Pass back identity dimensions the user has chosen to share
          await submitTestimonial({
                  content,
                  rating,
                  displayName,
                  ethnicity: identity?.ethnicities?.[0],
                  genderIdentity: identity?.genderIdentity,
                  sexualOrientation: identity?.sexualOrientation,
                  religion: identity?.religion,
          });
    };
  
    return (
          <View
                  style={[
                            styles.container,
                    { backgroundColor: theme.backgroundDefault, borderColor: theme.cardBorder },
                          ]}
                >
                <View style={styles.header}>
                        <ThemedText type="h4">Community Reviews</ThemedText>ThemedText>
                        <Pressable
                                    style={[styles.writeButton, { backgroundColor: theme.primary + "15" }]}
                                    onPress={() => setShowForm((v) => !v)}
                                  >
                                  <Feather name="edit-2" size={14} color={theme.primary} />
                                  <ThemedText style={[styles.writeButtonText, { color: theme.primary }]}>
                                              Write a Review
                                  </ThemedText>ThemedText>
                        </Pressable>Pressable>
                </View>View>
          
            {showForm ? (
                          <WriteReviewForm
                                      onSubmit={handleSubmit}
                                      onCancel={() => setShowForm(false)}
                                      theme={theme}
                                    />
                        ) : null}
          
            {isLoading ? (
                          <View style={styles.loadingRow}>
                                    <ActivityIndicator size="small" color={theme.primary} />
                                    <ThemedText type="small" style={{ color: theme.textSecondary, marginLeft: Spacing.sm }}>
                                                Loading reviews...
                                    </ThemedText>ThemedText>
                          </View>View>
                        ) : error ? (
                          <ThemedText type="small" style={{ color: theme.textSecondary }}>
                            {error}
                          </ThemedText>ThemedText>
                        ) : (
                          <>
                            {aggregate && aggregate.totalCount > 0 ? (
                                        <AggregateBanner aggregate={aggregate} theme={theme} />
                                      ) : null}
                          
                            {testimonials.length === 0 ? (
                                        <ThemedText type="small" style={{ color: theme.textSecondary }}>
                                                      No reviews yet — be the first to share your experience.
                                        </ThemedText>ThemedText>
                                      ) : (
                                        <View style={styles.testimonialList}>
                                          {testimonials.slice(0, 5).map((t) => (
                                                          <TestimonialCard key={t.id} testimonial={t} theme={theme} />
                                                        ))}
                                          {testimonials.length > 5 ? (
                                                          <ThemedText
                                                                              type="small"
                                                                              style={{ color: theme.textSecondary, textAlign: "center", marginTop: Spacing.sm }}
                                                                            >
                                                                            +{testimonials.length - 5} more reviews
                                                          </ThemedText>ThemedText>
                                                        ) : null}
                                        </View>View>
                                    )}
                          </>>
                        )}
          </View>View>
        );
}

const styles = StyleSheet.create({
    container: {
          borderRadius: BorderRadius.lg,
          borderWidth: 1,
          padding: Spacing.xl,
          marginBottom: Spacing.lg,
    },
    header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: Spacing.lg,
    },
    writeButton: {
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.xs,
          borderRadius: BorderRadius.sm,
          gap: Spacing.xs,
    },
    writeButtonText: {
          fontSize: 13,
          fontWeight: "600",
    },
    loadingRow: {
          flexDirection: "row",
          alignItems: "center",
    },
    aggregateBanner: {
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          padding: Spacing.lg,
          marginBottom: Spacing.lg,
    },
    aggregateRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing.lg,
    },
    aggregateScore: {
          alignItems: "center",
          gap: Spacing.xs,
    },
    aggregateNumber: {
          fontSize: 32,
          fontWeight: "700",
    },
    identityMatchBox: {
          flex: 1,
          flexDirection: "row",
          alignItems: "flex-start",
          borderRadius: BorderRadius.sm,
          borderWidth: 1,
          padding: Spacing.md,
    },
    stars: {
          flexDirection: "row",
          gap: 2,
    },
    testimonialList: {
          gap: Spacing.md,
    },
    testimonialCard: {
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          padding: Spacing.lg,
    },
    cardHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: Spacing.sm,
    },
    cardAuthor: {
          flexDirection: "row",
          alignItems: "center",
          gap: Spacing.sm,
          flex: 1,
    },
    avatarCircle: {
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
    },
    avatarInitial: {
          fontSize: 16,
          fontWeight: "700",
    },
    authorName: {
          fontWeight: "600",
          fontSize: 14,
    },
    cardMeta: {
          alignItems: "flex-end",
          gap: 2,
    },
    testimonialContent: {
          lineHeight: 20,
    },
    reviewForm: {
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          padding: Spacing.lg,
          marginBottom: Spacing.lg,
          flexDirection: "row",
          alignItems: "flex-start",
    },
    textInput: {
          borderWidth: 1,
          borderRadius: BorderRadius.sm,
          padding: Spacing.md,
          fontSize: 14,
          height: 44,
    },
    textArea: {
          borderWidth: 1,
          borderRadius: BorderRadius.sm,
          padding: Spacing.md,
          fontSize: 14,
          minHeight: 100,
    },
    formButtons: {
          flexDirection: "row",
          gap: Spacing.md,
    },
    cancelButton: {
          flex: 1,
          alignItems: "center",
          padding: Spacing.md,
          borderRadius: BorderRadius.sm,
          borderWidth: 1,
    },
    submitButton: {
          flex: 2,
          alignItems: "center",
          padding: Spacing.md,
          borderRadius: BorderRadius.sm,
    },
});</></Pressable>
