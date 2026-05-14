import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionsState {
  microphone: PermissionStatus;
  notifications: PermissionStatus;
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook to manage app permissions for microphone and notifications.
 * Simplified version that doesn't require expo-permissions package.
 * In production, you would integrate with native permission APIs.
 */
export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionsState>({
    microphone: 'undetermined',
    notifications: 'undetermined',
    isLoading: true,
    error: null,
  });

  // Initialize permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  /**
   * Check the current status of all permissions.
   * In a real app, this would query native permission APIs.
   */
  const checkPermissions = useCallback(async () => {
    try {
      setPermissions((prev) => ({ ...prev, isLoading: true, error: null }));

      // Simulate permission check - in production, use native APIs
      // For now, assume permissions are undetermined until explicitly requested
      setPermissions({
        microphone: 'undetermined',
        notifications: 'undetermined',
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
   * In production, this would call native permission APIs.
   */
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      // Simulate permission request
      setPermissions((prev) => ({
        ...prev,
        microphone: 'granted',
      }));

      Alert.alert(
        'Microphone Access',
        'Jarvis will now have access to your microphone for voice commands.',
        [{ text: 'OK' }]
      );

      return true;
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
   * In production, this would call native permission APIs.
   */
  const requestNotificationPermission = useCallback(async (): Promise<boolean> => {
    try {
      // Simulate permission request
      setPermissions((prev) => ({
        ...prev,
        notifications: 'granted',
      }));

      Alert.alert(
        'Notification Access',
        'Jarvis will now send you notifications about important events.',
        [{ text: 'OK' }]
      );

      return true;
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
