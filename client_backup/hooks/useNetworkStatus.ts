import { useState, useEffect, useCallback } from "react";
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";

export type ConnectionQuality = "offline" | "slow" | "moderate" | "fast";

interface NetworkStatus {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionType: NetInfoStateType | null;
  connectionQuality: ConnectionQuality;
  isDataSaverEnabled: boolean;
  setDataSaverEnabled: (enabled: boolean) => void;
  refresh: () => Promise<void>;
}

let dataSaverEnabled = false;

export function useNetworkStatus(): NetworkStatus {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);
  const [connectionType, setConnectionType] = useState<NetInfoStateType | null>(null);
  const [isDataSaver, setIsDataSaver] = useState(dataSaverEnabled);

  const checkNetworkStatus = useCallback(async () => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? null);
      setConnectionType(state.type);
    } catch (error) {
      console.warn("Error checking network status:", error);
      setIsConnected(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: { isConnected: boolean | null; isInternetReachable: boolean | null; type: NetInfoStateType }) => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? null);
      setConnectionType(state.type);
    });
    
    return () => unsubscribe();
  }, []);

  const getConnectionQuality = useCallback((): ConnectionQuality => {
    if (!isConnected) return "offline";
    
    if (connectionType === "cellular") {
      return "slow";
    }
    
    if (connectionType === "wifi" || connectionType === "ethernet") {
      return "fast";
    }
    
    return "moderate";
  }, [isConnected, connectionType]);

  const setDataSaverEnabled = useCallback((enabled: boolean) => {
    dataSaverEnabled = enabled;
    setIsDataSaver(enabled);
  }, []);

  return {
    isConnected,
    isInternetReachable,
    connectionType,
    connectionQuality: getConnectionQuality(),
    isDataSaverEnabled: isDataSaver,
    setDataSaverEnabled,
    refresh: checkNetworkStatus,
  };
}

export function getImageQualityForConnection(
  connectionQuality: ConnectionQuality,
  isDataSaverEnabled: boolean
): { quality: number; width: number } {
  if (isDataSaverEnabled) {
    return { quality: 40, width: 400 };
  }

  switch (connectionQuality) {
    case "offline":
      return { quality: 30, width: 200 };
    case "slow":
      return { quality: 50, width: 400 };
    case "moderate":
      return { quality: 70, width: 600 };
    case "fast":
    default:
      return { quality: 80, width: 800 };
  }
}
