import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useNetworkStatus, ConnectionQuality, getImageQualityForConnection } from "@/hooks/useNetworkStatus";
import { useUserProfile } from "./UserProfileContext";

interface NetworkContextValue {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  connectionQuality: ConnectionQuality;
  isDataSaverEnabled: boolean;
  showNetworkIndicator: boolean;
  imageQuality: { quality: number; width: number };
  setDataSaverEnabled: (enabled: boolean) => void;
  refresh: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const network = useNetworkStatus();
  const { appSettings, updateAppSettings } = useUserProfile();

  const effectiveDataSaver = appSettings?.dataSaverMode ?? false;
  const showNetworkIndicator = appSettings?.showNetworkIndicator ?? true;

  const imageQuality = useMemo(
    () => getImageQualityForConnection(network.connectionQuality, effectiveDataSaver),
    [network.connectionQuality, effectiveDataSaver]
  );

  const setDataSaverEnabled = async (enabled: boolean) => {
    await updateAppSettings({ dataSaverMode: enabled });
  };

  return (
    <NetworkContext.Provider
      value={{
        isConnected: network.isConnected,
        isInternetReachable: network.isInternetReachable,
        connectionQuality: network.connectionQuality,
        isDataSaverEnabled: effectiveDataSaver,
        showNetworkIndicator,
        imageQuality,
        setDataSaverEnabled,
        refresh: network.refresh,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}
