import { useState, useEffect, useCallback } from 'react';
import * as Permissions from 'expo-permissions';
import { Platform, Alert } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionsState {
  microphone: PermissionStatus;
  notifications: PermissionStatus;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage app permissions for microphone and notifications.
 * Handles permission requests and status tracking.
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionsState>({
    microphone: 'undetermined',
    notifications: 'undetermined',
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
      const { status: micStatus } = await Permissions.askAsync(
        Permissions.AUDIO
      );
      
      // Check notifications permission
      const { status: notifStatus } = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
      );

      setPermissions({
        microphone: mapPermissionStatus(micStatus),
        notifications: mapPermissionStatus(notifStatus),
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
      const { status } = await Permissions.askAsync(Permissions.AUDIO);
      const mappedStatus = mapPermissionStatus(status);
      
      setPermissions((prev) => ({
        ...prev,
        microphone: mappedStatus,
      }));

      if (mappedStatus === 'denied') {
        Alert.alert(
          'Microphone Permission Denied',
          'Jarvis needs microphone access to listen for voice commands. Please enable it in Settings.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return mappedStatus === 'granted';
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
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      const mappedStatus = mapPermissionStatus(status);
      
      setPermissions((prev) => ({
        ...prev,
        notifications: mappedStatus,
      }));

      if (mappedStatus === 'denied') {
        Alert.alert(
          'Notification Permission Denied',
          'Jarvis needs notification access to alert you about important events.',
          [{ text: 'OK' }]
        );
        return false;
      }

      return mappedStatus === 'granted';
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
   * Request all critical permissions at once.
   */
  const requestAllPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const micResult = await requestMicrophonePermission();
      const notifResult = await requestNotificationPermission();

      return micResult && notifResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permissions';
      setPermissions((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }
  }, [requestMicrophonePermission, requestNotificationPermission]);

  /**
   * Check if all critical permissions are granted.
   */
  const allPermissionsGranted = useCallback((): boolean => {
    return (
      permissions.microphone === 'granted' &&
      permissions.notifications === 'granted'
    );
  }, [permissions]);

  /**
   * Get a human-readable description of permission status.
   */
  const getPermissionDescription = useCallback((permission: keyof PermissionsState): string => {
    if (permission === 'isLoading' || permission === 'error') {
      return '';
    }

    const status = permissions[permission];
    const names: Record<string, string> = {
      microphone: 'Microphone',
      notifications: 'Notifications',
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
