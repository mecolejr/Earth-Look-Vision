# EarthLook

## Overview

EarthLook is a mobile application that helps people with marginalized identities find cities where they'll thrive. Unlike generic city comparison apps, EarthLook provides personalized city scores based on the user's identity profile (race, gender, sexuality, religion, etc.) and their priorities. The core differentiator is that the same city will score differently for different users based on their unique identity and what matters most to them.

The app is built with Expo/React Native for cross-platform mobile support (iOS, Android, Web) with an Express backend. It uses a personalization algorithm that weighs city data against user identity factors and priority weights to generate match scores.


## How to Run

### Development (local / Replit)

```bash
# Install dependencies
npm install

# Start both Expo (port 8081) and Express backend (port 5000) in parallel
npm run expo:dev        # Expo dev server with Replit proxy
npm run server:dev      # Express API server with hot reload
```

### Production build (Replit Deploy)

```bash
# 1. Build Expo web static output + Express bundle
npm run expo:static:build && npm run server:build

# 2. Start production server (serves API + static Expo web on port 5000)
npm run server:prod
```

### Key ports

| Port | Service |
|------|---------|
| 5000 | Express API + served Expo web (production) |
| 8081 | Expo dev packager |

### Environment / Secrets

Store secrets in Replit **Secrets** tab (not in code). Required keys:
- `DATABASE_URL` — Neon/Postgres connection string
- `PORT` — defaults to `5000` (already set in `.replit`)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Expo SDK 54 with React Native 0.81
- **Navigation**: React Navigation v7 with native stack and bottom tabs
- **State Management**: React Context for user profile, TanStack Query for server state
- **UI Components**: Custom themed component library with Reanimated animations
- **Styling**: StyleSheet-based with a centralized theme system (light/dark mode support)

### Directory Structure
```
client/           # React Native/Expo frontend
├── components/   # Reusable UI components
├── screens/      # Screen components
├── navigation/   # React Navigation setup
├── contexts/     # React Context providers
├── hooks/        # Custom React hooks
├── lib/          # Utilities (scoring, storage, API client)
├── data/         # Static city data
├── types/        # TypeScript type definitions
├── constants/    # Theme and design tokens
server/           # Express backend
shared/           # Shared types and database schema
```

### Navigation Flow
1. **Onboarding Stack** (first-time users): Welcome → Identity Step 1 (Lifestyle) → Identity Step 2 (Identity) → Priorities Step
2. **Main Tab Navigator**: Explore, Compare, Stories (Blog), Profile tabs
3. **Modal Screens**: City Detail (presented as a modal from any tab)

### Blog/Stories Feature
The Stories tab (`client/navigation/BlogStackNavigator.tsx`) provides editorial content across three categories:
- **City Spotlights** (map-pin icon, purple): In-depth looks at specific cities for marginalized communities
- **Policy Changes** (file-text icon, orange): Updates on laws and policies affecting communities
- **Community Stories** (users icon, green): Personal narratives from community members

**Screens**:
- `BlogScreen`: Article list with category filter chips, cards showing title, excerpt, author, date
- `BlogArticleScreen`: Full article view with formatted content, metadata, and tags

**Data**: Static articles in `client/data/blog.ts` with helper functions:
- `getArticlesByCategory()`, `getArticleById()`, `getLatestArticles()`, `getArticlesForCity()`

### Onboarding Design (Gradual Trust-Building)
The onboarding flow is designed to build trust by starting with less sensitive questions:
- **Step 1 (Your lifestyle)**: Career Field, Income Level, Family Structure, Climate Preferences (Temperature, Seasons, Precipitation)
- **Step 2 (Your identity)**: Race/Ethnicity, Gender Identity, Sexual Orientation, Religion, Political Views
- **Step 3 (Priorities)**: Weight sliders for what matters most

**Example Personas**: Users can select pre-filled personas (Maya, Marcus, Sofia, Jordan) from the Welcome screen to preview the app before entering their own data.

**"Why we ask this" Tooltips**: Each sensitive question has an InfoTooltip explaining how the data affects city scoring.

**Live Score Preview ("Aha Moment")**: The `LiveScorePreview` component shows real-time score updates for San Francisco as users make selections during onboarding and on the Profile screen. This demonstrates that the algorithm responds to their unique identity - the core value proposition. Features:
- Compact mode on Step 1 (lifestyle): Shows city name and score
- Full mode on Step 2 (identity) and Profile: Shows overall score + breakdown (Safety, LGBTQ+, Diversity, Cost)
- Animated score changes with spring animations and pulse effects

**Interactive Demo Mode**: Accessible from the Welcome screen via "Try interactive demo" button. The `InteractiveDemoScreen` lets users:
- Choose from identity presets (LGBTQ+ Person, Person of Color, Tech Worker, Young Family)
- Adjust priority sliders (Safety, LGBTQ+ Acceptance, Diversity, Cost of Living, Job Market)
- Watch 5 demo cities (San Francisco, Austin, Seattle, New York, Denver) rerank in real-time
- Each city card shows overall score and breakdown with animated updates

**Current City Overlay**: On the Explore screen, users can set their current city to provide context for comparisons. Features:
- Empty state prompts users to "Set your current city"
- CityPickerModal with search functionality for selecting a city
- When set, shows "Your City" badge with city name, match score, and stat chips (Safety, Cost, LGBTQ+)
- "Change" button to update the current city
- Tapping the overlay navigates to the city's detail screen

**Interactive Map View**: The Map tab (`client/navigation/MapStackNavigator.tsx`) provides a visual way to explore city recommendations:
- **Native (iOS/Android)**: Full Google Maps integration with colored markers showing match scores
  - Markers color-coded: green (80+), purple (60-79), orange (40-59), red (<40)
  - Tap markers to see city cards with score breakdowns
  - Driving distances from user's current city (via Google Distance Matrix API)
- **Web fallback** (`client/screens/MapScreen.web.tsx`): Scrollable list of top 10 city matches
  - Each card shows city name, match score, and breakdown (Safety, LGBTQ+, Cost, Climate)
  - Tap to navigate to city detail
- **API endpoint**: `/api/distances?origin=lat,lon&destinations=lat1,lon1|lat2,lon2` returns driving distance and duration

**Granular Privacy Settings**: Accessible from Profile screen via "Privacy Settings" link. The `PrivacySettingsScreen` allows users to control which identity factors are used in scoring:
- 10 toggleable factors: Race & Ethnicity, Gender Identity, Sexual Orientation, Religion, Political Views, Family Structure, Income Level, Career Field, Age Range, Disabilities
- Each toggle has a label and description explaining how it affects scoring
- "Active Factors" counter shows X of 10 enabled
- Settings are stored in `UserProfile.privacySettings` and passed to scoring functions
- Disabled factors are excluded from personalization calculations
- "How Your Data is Stored" section explains: data stored locally, never sent to servers, easy to delete
- GDPR-compliant "Your Data Rights" section with Export and Delete buttons

**Scoring Methodology Transparency**: Accessible from Profile screen via "How Scores Work" link. The `ScoringMethodologyScreen` explains:
- How match scores are calculated from city data, user identity, and priorities
- All 8 scoring categories (Safety, LGBTQ+ Acceptance, Diversity, Cost of Living, Job Market, Healthcare, Climate, Public Transit)
- How user identity affects personalized scores
- That all calculations happen on-device for privacy

### Climate Preferences
Users can set climate preferences during onboarding (Step 1) to personalize city scores based on weather patterns:
- **Temperature**: cold, mild, warm, hot
- **Seasons**: four-seasons, mild-winters, no-winter, dry-year-round
- **Precipitation**: dry, moderate, rainy
- **Humidity**: low, moderate, high (configurable in profile)
- **Sunshine**: sunny, mixed, cloudy-ok (configurable in profile)

The `calculateClimateScore()` function in `client/lib/scoring.ts` matches user preferences against city climate data to generate personalized climate compatibility scores.

### City Detail Weather Section
The City Detail screen (`client/screens/CityDetailScreen.tsx`) includes a "Climate & Weather" section showing:
- **Current Weather**: Live data from National Weather Service API (US cities only) - temperature, forecast, wind
- **Climate Match Score**: Personalized score based on user's climate preferences
- **Climate Stats**: Average temp, sunny days/year, annual rainfall, season type

City data includes coordinates (`lat`, `lon`) for weather API lookups.

### Personalization Algorithm
Located in `client/lib/scoring.ts`. Takes city data, user identity profile, priority weights, and privacy settings to calculate:
- Overall match score (0-100)
- Breakdown scores per category (safety, LGBTQ+ acceptance, diversity, cost, climate, etc.)
- Highlighted factors (positive/warning/negative) specific to user's identity
- Climate-related highlights when climate preferences match/mismatch city weather patterns
- `applyPrivacyFilter()` function filters identity data based on user's privacy preferences before scoring

### Performance Caching
Two-tier caching system for fast load times:
- **In-memory cache** (`client/lib/scoring.ts`): 5-minute TTL, 500-entry limit, keyed by city ID + profile hash. Eliminates redundant score calculations during navigation.
- **Persistent cache** (`client/lib/storage.ts`): AsyncStorage-based, 24-hour expiration. Stores pre-computed scores for instant app launch. Automatically invalidates when user profile changes.
- `useCities` hook (`client/hooks/useCities.ts`): Combines both caching layers for optimal performance. Returns scored cities sorted by match score.

### Progressive Enhancement for Slower Connections
Network-aware loading system that adapts to connection quality:
- **Network Status Hook** (`client/hooks/useNetworkStatus.ts`): Uses `@react-native-community/netinfo` to detect connection type (WiFi, cellular, offline) and quality
- **Connection Quality Levels**: offline, slow (cellular), moderate, fast (WiFi/ethernet)
- **Adaptive Image Loading** (`client/components/OptimizedImage.tsx`): 
  - Adjusts image quality and width based on connection (30-80% quality, 200-800px width)
  - Uses appropriate cache policies (memory-disk for offline, disk for slow connections)
  - Priority-based loading (first 3 images high priority, rest load in background)
- **Data Saver Mode**: User preference stored in `AppSettings.dataSaverMode` - forces lower quality images regardless of connection
- **Network Context** (`client/contexts/NetworkContext.tsx`): Provides global access to network state and image quality settings
- **Network Status Indicator** (`client/components/NetworkStatusIndicator.tsx`): Shows banner when offline or on slow connection, with option to disable via `AppSettings.showNetworkIndicator`

### Data Storage
- **Local**: AsyncStorage for user profile, saved cities, compare lists
- **Backend**: PostgreSQL with Drizzle ORM (schema in `shared/schema.ts`)
- **Current state**: Backend has basic user auth schema; city data is static in `client/data/cities.ts`

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API Pattern**: RESTful endpoints prefixed with `/api`
- **Build**: esbuild for server bundling

### Key Design Patterns
- **Themed Components**: All UI components accept theme from `useTheme()` hook
- **Safe Area Handling**: Consistent use of `react-native-safe-area-context` with header/tab bar height calculations
- **Animation**: Reanimated for micro-interactions and transitions
- **Path Aliases**: `@/` maps to `client/`, `@shared/` maps to `shared/`

## External Dependencies

### Core Services
- **Database**: PostgreSQL (Drizzle ORM for type-safe queries)
- **Authentication**: Planned SSO with Apple/Google Sign-In (not yet implemented)

### Key NPM Packages
- **expo**: Core Expo SDK and native modules
- **@react-navigation/***: Navigation infrastructure
- **@tanstack/react-query**: Server state management
- **react-native-reanimated**: Animations
- **drizzle-orm + drizzle-zod**: Database ORM and validation
- **@react-native-async-storage/async-storage**: Local persistence
- **@react-native-community/netinfo**: Network status detection for progressive enhancement
- **expo-image**: Optimized image loading with WebP support and caching

### Fonts
- Libre Baskerville (serif, for editorial headings)
- Inter (sans-serif, for body text)

### Development Tools
- **TypeScript**: Strict mode enabled
- **ESLint + Prettier**: Code formatting and linting
- **drizzle-kit**: Database migrations

## External API Integrations

### Configured Integrations
- **Google Cloud** (`GOOGLE_CLOUD_API_KEY`): General cloud services - ready to use
- **Cohere AI** (`COHERE_API_KEY`): AI-powered personalized content recommendations - fully integrated
  - Endpoint: `POST /api/recommendations` - accepts user identity profile, returns ranked articles
  - Uses Cohere's rerank-english-v3.0 model to match blog articles to user identity factors
  - Powers "Recommended for You" section in Stories screen with personalized article suggestions
  - Identity factors used: race, gender, sexuality, religion, family structure, career field
- **Resend**: Email sending for newsletters - integrated with welcome emails on subscription
- **National Weather Service API**: Free weather data - fully integrated
  - Endpoints: `/api/weather/forecast?lat=X&lon=Y` and `/api/weather/current?lat=X&lon=Y`
  - No API key required (uses User-Agent header)

- **Google Maps** (`GOOGLE_MAPS_API_KEY`): Location services, mapping, and geocoding - ready to use