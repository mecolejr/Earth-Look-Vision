import React, { useState, useMemo } from "react";
import { StyleSheet, View, StyleProp, ImageStyle, ViewStyle } from "react-native";
import { Image, ImageSource, ImageContentFit } from "expo-image";
import { useTheme } from "@/hooks/useTheme";
import { useNetworkStatus, getImageQualityForConnection, ConnectionQuality } from "@/hooks/useNetworkStatus";

interface OptimizedImageProps {
  source: ImageSource | string | number;
  fallbackSource?: ImageSource | string | number;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  contentFit?: ImageContentFit;
  placeholder?: string | null;
  transition?: number;
  priority?: "low" | "normal" | "high";
  cachePolicy?: "none" | "disk" | "memory" | "memory-disk";
  recyclingKey?: string;
  testID?: string;
}

const blurhashPlaceholder = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

export function OptimizedImage({
  source,
  fallbackSource,
  style,
  containerStyle,
  contentFit = "cover",
  placeholder = blurhashPlaceholder,
  transition = 300,
  priority = "normal",
  cachePolicy = "memory-disk",
  recyclingKey,
  testID,
}: OptimizedImageProps) {
  const { theme } = useTheme();
  const [hasError, setHasError] = useState(false);

  const effectiveSource = hasError && fallbackSource ? fallbackSource : source;

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={effectiveSource}
        style={[styles.image, style]}
        contentFit={contentFit}
        placeholder={placeholder}
        placeholderContentFit="cover"
        transition={transition}
        priority={priority}
        cachePolicy={cachePolicy}
        recyclingKey={recyclingKey}
        onError={() => {
          if (!hasError && fallbackSource) {
            setHasError(true);
          }
        }}
        testID={testID}
      />
    </View>
  );
}

interface CityImageProps {
  cityId: string;
  style?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  size?: "small" | "medium" | "large";
  index?: number;
}

const CITY_IMAGE_URLS: Record<string, string> = {
  "san-francisco": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&q=80&fm=webp",
  "new-york": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80&fm=webp",
  "austin": "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=800&q=80&fm=webp",
  "seattle": "https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=800&q=80&fm=webp",
  "denver": "https://images.unsplash.com/photo-1619856699906-09e1f58c98b9?w=800&q=80&fm=webp",
  "portland": "https://images.unsplash.com/photo-1566889225639-9c3e0cf75c4b?w=800&q=80&fm=webp",
  "los-angeles": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800&q=80&fm=webp",
  "chicago": "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800&q=80&fm=webp",
  "miami": "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=800&q=80&fm=webp",
  "boston": "https://images.unsplash.com/photo-1501979376754-2ff867a4f659?w=800&q=80&fm=webp",
  "toronto": "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800&q=80&fm=webp",
  "vancouver": "https://images.unsplash.com/photo-1559511260-66a68e37f3f0?w=800&q=80&fm=webp",
  "montreal": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&fm=webp",
  "berlin": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&q=80&fm=webp",
  "amsterdam": "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80&fm=webp",
  "barcelona": "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80&fm=webp",
  "london": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80&fm=webp",
  "paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80&fm=webp",
  "tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80&fm=webp",
  "sydney": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80&fm=webp",
  "melbourne": "https://images.unsplash.com/photo-1514395462725-fb4566210144?w=800&q=80&fm=webp",
};

const fallbackImage = require("../../assets/images/welcome-hero.png");

export function CityImage({ cityId, style, containerStyle, size = "medium", index = 0 }: CityImageProps) {
  const network = useNetworkStatus();
  const imageUrl = CITY_IMAGE_URLS[cityId];
  
  const { quality, width } = useMemo(() => {
    return getImageQualityForConnection(network.connectionQuality, network.isDataSaverEnabled);
  }, [network.connectionQuality, network.isDataSaverEnabled]);

  const adaptiveWidth = useMemo(() => {
    if (size === "small") return Math.min(width, 400);
    if (size === "large") return Math.min(width * 1.5, 1200);
    return width;
  }, [size, width]);

  const sizeParams = `&w=${adaptiveWidth}&q=${quality}`;
  
  const effectivePriority: "low" | "normal" | "high" = 
    size === "large" ? "high" : 
    index === 0 ? "high" : 
    index < 3 ? "normal" : 
    "low";

  const cachePolicy: "none" | "disk" | "memory" | "memory-disk" = 
    network.connectionQuality === "offline" ? "memory-disk" : 
    network.connectionQuality === "slow" ? "disk" : 
    "memory-disk";
  
  return (
    <OptimizedImage
      source={imageUrl ? { uri: imageUrl + sizeParams } : fallbackImage}
      fallbackSource={fallbackImage}
      style={style}
      containerStyle={containerStyle}
      priority={effectivePriority}
      cachePolicy={cachePolicy}
      recyclingKey={`${cityId}-${network.connectionQuality}`}
      testID={`city-image-${cityId}`}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
