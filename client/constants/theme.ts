import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#2D2438",
    textSecondary: "#73648A",
    buttonText: "#FFFFFF",
    tabIconDefault: "#73648A",
    tabIconSelected: "#6B4E9C",
    link: "#6B4E9C",
    primary: "#6B4E9C",
    primaryLight: "#9B7DCA",
    success: "#4CAF8E",
    warning: "#F4A261",
    danger: "#E76F51",
    backgroundRoot: "#F9F7FC",
    backgroundDefault: "#FFFFFF",
    backgroundSecondary: "#F0EDF5",
    backgroundTertiary: "#E8E3F0",
    border: "#D8D0E5",
    cardBorder: "#D0C6DD",
  },
  dark: {
    text: "#F5F3F8",
    textSecondary: "#A99BBC",
    buttonText: "#FFFFFF",
    tabIconDefault: "#A99BBC",
    tabIconSelected: "#9B7DCA",
    link: "#9B7DCA",
    primary: "#9B7DCA",
    primaryLight: "#B89FDB",
    success: "#5DC9A3",
    warning: "#F7B77A",
    danger: "#F08A70",
    backgroundRoot: "#1F1A2E",
    backgroundDefault: "#2A2438",
    backgroundSecondary: "#352E45",
    backgroundTertiary: "#403852",
    border: "#403852",
    cardBorder: "#403852",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  "6xl": 64,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
    fontFamily: Platform.select({
      ios: "LibreBaskerville-Bold",
      android: "LibreBaskerville-Bold",
      default: "LibreBaskerville_700Bold",
    }),
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
    fontFamily: Platform.select({
      ios: "LibreBaskerville-Bold",
      android: "LibreBaskerville-Bold",
      default: "LibreBaskerville_700Bold",
    }),
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  headline: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "LibreBaskerville-Regular",
    serifBold: "LibreBaskerville-Bold",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  android: {
    sans: "normal",
    serif: "LibreBaskerville-Regular",
    serifBold: "LibreBaskerville-Bold",
    rounded: "normal",
    mono: "monospace",
  },
  default: {
    sans: "Inter_400Regular",
    serif: "LibreBaskerville_400Regular",
    serifBold: "LibreBaskerville_700Bold",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "'Libre Baskerville', Georgia, 'Times New Roman', serif",
    serifBold: "'Libre Baskerville', Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const ScoreColors = {
  excellent: "#4CAF8E",
  good: "#7BC96F",
  moderate: "#F4A261",
  poor: "#E76F51",
};

export function getScoreColor(score: number): string {
  if (score >= 80) return ScoreColors.excellent;
  if (score >= 60) return ScoreColors.good;
  if (score >= 40) return ScoreColors.moderate;
  return ScoreColors.poor;
}
