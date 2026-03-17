# EarthLook Design Guidelines

## Brand Identity

**Purpose:** EarthLook helps people with marginalized identities find cities where they'll thrive by scoring locations based on personalized safety, acceptance, and community fit.

**Tone:** Trustworthy, empowering, and respectful. The aesthetic should be **editorial/magazine** meets **soft/pastel** - sophisticated typography with calming, approachable colors that make discussing sensitive identity topics feel safe. This app handles deeply personal data, so every interaction must feel thoughtful and secure.

**Memorable Element:** Real-time score changes as users adjust their identity profile - showing that cities score differently for different people is the "aha!" moment that proves the algorithm works.

## Navigation Architecture

**Root Navigation:** Tab Bar (4 tabs)
- **Explore** (home) - Browse and search cities
- **Compare** - Side-by-side city comparison
- **Profile** - User identity settings and preferences
- **Floating Action Button (FAB)** - "Find My Match" - runs personalized algorithm

**Authentication:** Required (SSO with Apple/Google Sign-In). Identity data requires accounts for sync and privacy controls.

## Screen-by-Screen Specifications

### Onboarding Flow (Stack-Only)
**1. Welcome Screen**
- Hero illustration showing diverse people finding their place
- Headline: "Find cities where people like you thrive"
- CTA: "Get Started" → Identity Profile Builder

**2-4. Identity Profile Builder (3 screens)**
- Progressive disclosure questionnaire
- Screen 1: Demographics (race/ethnicity, gender, sexuality)
- Screen 2: Beliefs & Lifestyle (religion, politics, family structure)
- Screen 3: Priorities (sliders: "What matters most to you?")
- Form with "Next" button in header, progress indicator at top
- Safe area insets: top = insets.top + Spacing.xl, bottom = insets.bottom + Spacing.xl

### Main App

**Explore Tab (Home)**
- Transparent header with search bar and filter icon (right)
- Scrollable card list of cities
- Each card shows:
  - City photo (full-width, rounded corners)
  - City name & country
  - **"Your Match: 87/100"** (personalized score, large bold)
  - Top 3 identity-relevant highlights (icons + text)
  - Example: "✓ High LGBTQ+ acceptance • ⚠ Moderate cost • ✓ Asian community 12%"
- Empty state: Illustration with "Tell us about yourself to see personalized matches"
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Compare Tab**
- Header with "Compare Cities" title, "Add City" button (right)
- Scrollable horizontal city cards (swipeable)
- Side-by-side comparison table below
- Each city column shows breakdown of scores with explanations
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**Profile Tab**
- Scrollable form with avatar at top
- Sections: Identity Factors, Priority Weights, Privacy Controls, Account Settings
- "See How Scores Change" demo button (opens modal)
- Safe area: top = headerHeight + Spacing.xl, bottom = tabBarHeight + Spacing.xl

**City Detail Screen (Modal)**
- Custom header with back button (left), bookmark icon (right), city name centered
- Scrollable content with sections:
  - Hero image
  - **"Your Match Score"** with breakdown ("Why this score?")
  - Safety data (hate crimes, discrimination reports) - filterable by user's identity
  - Community demographics ("% like you")
  - Cultural institutions relevant to user
  - "People Like You Say..." testimonials carousel
- Safe area: top = headerHeight + Spacing.xl, bottom = insets.bottom + Spacing.xl

**FAB: "Find My Match" (Floating Action Button)**
- Runs algorithm, shows animated results screen (modal)
- List of top 10 cities ranked by compatibility
- Shadow: offset (0, 2), opacity 0.10, radius 2

## Color Palette

- **Primary:** #6B4E9C (Deep plum - conveys trust, sophistication, empowerment)
- **Primary Light:** #9B7DCA (Soft lavender - calming, approachable)
- **Background:** #F9F7FC (Off-white with purple tint - subtle, clean)
- **Surface:** #FFFFFF (Pure white for cards)
- **Text Primary:** #2D2438 (Dark plum - high contrast, readable)
- **Text Secondary:** #73648A (Muted purple - supporting text)
- **Success:** #4CAF8E (Soft teal - positive, not harsh)
- **Warning:** #F4A261 (Warm orange - caution without alarm)
- **Danger:** #E76F51 (Muted coral - serious but not aggressive)

## Typography

- **Primary Font:** Libre Baskerville (serif) for headlines - editorial, trustworthy
- **Secondary Font:** Inter (sans-serif) for body/UI - clean, legible
- **Type Scale:**
  - Display: Libre Baskerville Bold, 32pt
  - Title: Libre Baskerville Bold, 24pt
  - Headline: Inter SemiBold, 18pt
  - Body: Inter Regular, 16pt
  - Caption: Inter Regular, 14pt
  - Label: Inter Medium, 12pt

## Visual Design

- Cards have subtle borders (1px, #E8E3F0) and no drop shadow
- Icons: Feather icon set (consistent, minimal)
- Touchable elements: Reduce opacity to 0.6 on press
- FAB shadow: offset (0, 2), opacity 0.10, radius 2
- Score displays use large, bold numbers with colored accents matching score range (green 80-100, orange 60-79, red below 60)
- Identity inputs use chips/tags with soft rounded corners

## Assets to Generate

**App Branding:**
- `icon.png` - App icon showing stylized globe with diverse faces outline
- `splash-icon.png` - Same icon for launch screen

**Onboarding:**
- `welcome-hero.png` - Diverse group of people with city skylines (warm, inclusive)
- `identity-illustration.png` - Abstract representation of intersecting identities (used in profile builder intro)

**Empty States:**
- `empty-explore.png` - Person looking at map with question mark (used when no identity profile set)
- `empty-compare.png` - Two city silhouettes with connecting dots (used when compare list is empty)

**City Detail:**
- `default-city-photo.png` - Generic cityscape placeholder (used when city photo unavailable)

**Profile Avatars (generate 6 diverse options):**
- `avatar-1.png` through `avatar-6.png` - Diverse illustrated faces (various skin tones, features)

All illustrations should use the app's color palette (plums, lavenders, teals) with a soft, inclusive, non-threatening style. Avoid stark lines; prefer rounded, organic shapes.