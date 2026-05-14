import { useState, useEffect, useCallback } from 'react';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { Platform, Alert } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionsState {
  microphone: PermissionStatus;
  notifications: PermissionStatus;
  mediaLibrary: PermissionStatus;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage app permissions for microphone, notifications, and media library.
 * Handles permission requests and status tracking.
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionsState>({
    microphone: 'undetermined',
    notifications: 'undetermined',
    mediaLibrary: 'undetermined',
    isLoading: true,
    error: null,
  });

  // Check current permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  /**
   * Check the current status of all permissions.
   */
  const checkPermissions = useCallback(async () => {
    try {
      setPermissions((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check microphone permission
      const micStatus = await Permissions.getAsync(Permissions.AUDIO);
      
      // Check notifications permission
      const notifStatus = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      
      // Check media library permission (iOS only)
      let mediaStatus: Permissions.PermissionStatus | undefined;
      if (Platform.OS === 'ios') {
        mediaStatus = await MediaLibrary.getPermissions();
      }

      setPermissions({
        microphone: mapPermissionStatus(micStatus.status),
        notifications: mapPermissionStatus(notifStatus.status),
        mediaLibrary: mediaStatus ? mapPermissionStatus(mediaStatus.status) : 'granted',
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check permissions';
      setPermissions((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  }, []);

  /**
   * Request microphone permission.
   */
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await Permissions.askAsync(Permissions.AUDIO);
      const status = mapPermissionStatus(result.status);
      
      setPermissions((prev) => ({
        ...prev,
        microphone: status,
      }));

      if (status === 'denied') {
        Alert.alert(
          'Microphone Permission Denied',
          'Jarvis needs microphone access to listen for voice commands. Please enable it in Settings.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return status === 'granted';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request microphone permission';
      setPermissions((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  /**
   * Request notification permission.
   */
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      const result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      const status = mapPermissionStatus(result.status);
      
      setPermissions((prev) => ({
        ...prev,
        notifications: status,
      }));

      if (status === 'denied') {
        Alert.alert(
          'Notification Permission Denied',
          'Jarvis needs notification access to alert you about important events.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return status === 'granted';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request notification permission';
      setPermissions((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  /**
   * Request media library permission (iOS only).
   */
  const requestMediaLibraryPermission = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'ios') {
      return true; // Not needed on Android
    }

    try {
      const result = await MediaLibrary.requestPermissionsAsync();
      const status = mapPermissionStatus(result.status);
      
      setPermissions((prev) => ({
        ...prev,
        mediaLibrary: status,
      }));

      if (status === 'denied') {
        Alert.alert(
          'Media Library Permission Denied',
          'Jarvis needs access to your media library.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return status === 'granted';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request media library permission';
      setPermissions((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, []);

  /**
   * Request all critical permissions at once.
   */
  const requestAllPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const micResult = await requestMicrophonePermission();
      const notifResult = await requestNotificationPermission();
      const mediaResult = await requestMediaLibraryPermission();

      return micResult && notifResult && mediaResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permissions';
      setPermissions((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, [requestMicrophonePermission, requestNotificationPermission, requestMediaLibraryPermission]);

  /**
   * Check if all critical permissions are granted.
   */
  const allPermissionsGranted = useCallback((): boolean => {
    return (
      permissions.microphone === 'granted' &&
      permissions.notifications === 'granted' &&
      (Platform.OS === 'ios' ? permissions.mediaLibrary === 'granted' : true)
    );
  }, [permissions]);

  /**
   * Get a human-readable description of permission status.
   */
  const getPermissionDescription = useCallback((permission: keyof PermissionsState): string => {
    const status = permissions[permission];
    const names: Record<string, string> = {
      microphone: 'Microphone',
      notifications: 'Notifications',
      mediaLibrary: 'Media Library',
    };

    const name = names[permission] || permission;

    switch (status) {
      case 'granted':
        return `✓ ${name} - Enabled`;
      case 'denied':
        return `✗ ${name} - Disabled`;
      case 'undetermined':
        return `? ${name} - Not requested`;
      default:
        return `${name} - Unknown`;
    }
  }, [permissions]);

  return {
    permissions,
    checkPermissions,
    requestMicrophonePermission,
    requestNotificationPermission,
    requestMediaLibraryPermission,
    requestAllPermissions,
    allPermissionsGranted,
    getPermissionDescription,
  };
}

/**
 * Map Expo permission status to our simplified status.
 */
function mapPermissionStatus(status: string): PermissionStatus {
  switch (status) {
    case Permissions.PermissionStatus.GRANTED:
      return 'granted';
    case Permissions.PermissionStatus.DENIED:
      return 'denied';
    case Permissions.PermissionStatus.UNDETERMINED:
    default:
      return 'undetermined';
  }
}
