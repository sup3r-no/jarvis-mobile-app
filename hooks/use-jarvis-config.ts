import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export interface JarvisConfig {
  wakeWord: string;
  voiceModel: string;
  smartThingsApiKey: string;
  selectedSpeaker: string;
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  notificationsEnabled: boolean;
}

const DEFAULT_CONFIG: JarvisConfig = {
  wakeWord: 'jarvis',
  voiceModel: 'piper-en-us-libritts-high',
  smartThingsApiKey: '',
  selectedSpeaker: '',
  theme: 'dark',
  primaryColor: '#00D9FF',
  notificationsEnabled: true,
};

const CONFIG_KEY = 'jarvis_config';

export function useJarvisConfig() {
  const [config, setConfig] = useState<JarvisConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load config from AsyncStorage on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(CONFIG_KEY);
      if (stored) {
        setConfig(JSON.parse(stored));
      } else {
        setConfig(DEFAULT_CONFIG);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load config');
      setConfig(DEFAULT_CONFIG);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateConfig = useCallback(
    async (updates: Partial<JarvisConfig>) => {
      try {
        const newConfig = { ...config, ...updates };
        await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
        setConfig(newConfig);
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update config');
        return false;
      }
    },
    [config]
  );

  const updateWakeWord = useCallback(
    (wakeWord: string) => updateConfig({ wakeWord }),
    [updateConfig]
  );

  const updateVoiceModel = useCallback(
    (voiceModel: string) => updateConfig({ voiceModel }),
    [updateConfig]
  );

  const updateSmartThingsApiKey = useCallback(
    (smartThingsApiKey: string) => updateConfig({ smartThingsApiKey }),
    [updateConfig]
  );

  const updateSelectedSpeaker = useCallback(
    (selectedSpeaker: string) => updateConfig({ selectedSpeaker }),
    [updateConfig]
  );

  const updateTheme = useCallback(
    (theme: 'light' | 'dark' | 'auto') => updateConfig({ theme }),
    [updateConfig]
  );

  const updatePrimaryColor = useCallback(
    (primaryColor: string) => updateConfig({ primaryColor }),
    [updateConfig]
  );

  const updateNotificationsEnabled = useCallback(
    (notificationsEnabled: boolean) => updateConfig({ notificationsEnabled }),
    [updateConfig]
  );

  const resetConfig = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(CONFIG_KEY);
      setConfig(DEFAULT_CONFIG);
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset config');
      return false;
    }
  }, []);

  return {
    config,
    isLoading,
    error,
    updateConfig,
    updateWakeWord,
    updateVoiceModel,
    updateSmartThingsApiKey,
    updateSelectedSpeaker,
    updateTheme,
    updatePrimaryColor,
    updateNotificationsEnabled,
    resetConfig,
    loadConfig,
  };
}
