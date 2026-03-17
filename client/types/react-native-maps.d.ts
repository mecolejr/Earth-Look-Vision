declare module 'react-native-maps' {
  import React from 'react';
  import { ViewStyle } from 'react-native';

  export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }

  export interface LatLng {
    latitude: number;
    longitude: number;
  }

  export interface MapViewProps {
    style?: ViewStyle;
    provider?: 'google' | undefined;
    initialRegion?: Region;
    region?: Region;
    showsUserLocation?: boolean;
    showsMyLocationButton?: boolean;
    showsCompass?: boolean;
    showsScale?: boolean;
    showsTraffic?: boolean;
    showsBuildings?: boolean;
    showsIndoors?: boolean;
    zoomEnabled?: boolean;
    rotateEnabled?: boolean;
    scrollEnabled?: boolean;
    pitchEnabled?: boolean;
    onRegionChange?: (region: Region) => void;
    onRegionChangeComplete?: (region: Region) => void;
    onPress?: (event: any) => void;
    onLongPress?: (event: any) => void;
    onMapReady?: () => void;
    children?: React.ReactNode;
  }

  export interface MarkerProps {
    key?: string;
    coordinate: LatLng;
    title?: string;
    description?: string;
    pinColor?: string;
    image?: any;
    anchor?: { x: number; y: number };
    centerOffset?: { x: number; y: number };
    onPress?: (event: any) => void;
    onCalloutPress?: (event: any) => void;
    children?: React.ReactNode;
  }

  export interface CalloutProps {
    tooltip?: boolean;
    onPress?: (event: any) => void;
    children?: React.ReactNode;
  }

  export const PROVIDER_GOOGLE: 'google';

  export class MapView extends React.Component<MapViewProps> {
    animateToRegion(region: Region, duration?: number): void;
    animateCamera(camera: any, options?: any): void;
    fitToCoordinates(coordinates: LatLng[], options?: any): void;
    getCamera(): Promise<any>;
    setCamera(camera: any): void;
  }

  export class Marker extends React.Component<MarkerProps> {}
  export class Callout extends React.Component<CalloutProps> {}

  export default MapView;
}
