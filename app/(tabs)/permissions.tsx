import { ScrollView, Text, View, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { usePermissions } from '@/hooks/use-permissions';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';

export default function PermissionsScreen() {
  const colors = useColors();
  const {
    permissions,
    checkPermissions,
    requestAllPermissions,
    requestMicrophonePermission,
    requestNotificationPermission,
    requestMediaLibraryPermission,
    allPermissionsGranted,
    getPermissionDescription,
  } = usePermissions();

  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const handleRequestAllPermissions = async () => {
    setIsRequesting(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const success = await requestAllPermissions();
    
    setIsRequesting(false);
    
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'All permissions have been granted!');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleRequestMicrophone = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await requestMicrophonePermission();
  };

  const handleRequestNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await requestNotificationPermission();
  };

  const handleRequestMediaLibrary = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await requestMediaLibraryPermission();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted':
        return colors.success;
      case 'denied':
        return colors.error;
      default:
        return colors.warning;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'granted':
        return '✓';
      case 'denied':
        return '✗';
      default:
        return '?';
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Permissions</Text>
            <Text className="text-base text-muted">
              Grant Jarvis access to essential features
            </Text>
          </View>

          {/* Status Summary */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-semibold text-foreground">Overall Status</Text>
              <View
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: allPermissionsGranted()
                    ? colors.success
                    : colors.warning,
                }}
              >
                <Text className="text-white text-sm font-semibold">
                  {allPermissionsGranted() ? 'All Set' : 'Incomplete'}
                </Text>
              </View>
            </View>
            <Text className="text-sm text-muted">
              {allPermissionsGranted()
                ? 'All permissions are enabled. Jarvis is ready to assist!'
                : 'Some permissions are missing. Enable them for full functionality.'}
            </Text>
          </View>

          {/* Individual Permissions */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground mb-2">
              Individual Permissions
            </Text>

            {/* Microphone */}
            <PermissionCard
              icon="🎤"
              title="Microphone"
              description="Listen for voice commands and wake words"
              status={permissions.microphone}
              statusColor={getStatusColor(permissions.microphone)}
              statusIcon={getStatusIcon(permissions.microphone)}
              onPress={handleRequestMicrophone}
              colors={colors}
            />

            {/* Notifications */}
            <PermissionCard
              icon="🔔"
              title="Notifications"
              description="Receive alerts and important updates"
              status={permissions.notifications}
              statusColor={getStatusColor(permissions.notifications)}
              statusIcon={getStatusIcon(permissions.notifications)}
              onPress={handleRequestNotifications}
              colors={colors}
            />

            {/* Media Library (iOS only) */}
            <PermissionCard
              icon="📸"
              title="Media Library"
              description="Access photos and media files"
              status={permissions.mediaLibrary}
              statusColor={getStatusColor(permissions.mediaLibrary)}
              statusIcon={getStatusIcon(permissions.mediaLibrary)}
              onPress={handleRequestMediaLibrary}
              colors={colors}
            />
          </View>

          {/* Request All Button */}
          <TouchableOpacity
            onPress={handleRequestAllPermissions}
            disabled={isRequesting || allPermissionsGranted()}
            style={({ pressed }: { pressed: boolean }) => [
              {
                backgroundColor: allPermissionsGranted()
                  ? colors.border
                  : colors.primary,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="py-4 px-4 rounded-lg items-center"
          >
            <Text
              className={`font-semibold text-base ${
                allPermissionsGranted()
                  ? 'text-muted'
                  : 'text-background'
              }`}
            >
              {isRequesting
                ? 'Requesting Permissions...'
                : allPermissionsGranted()
                ? 'All Permissions Granted ✓'
                : 'Request All Permissions'}
            </Text>
          </TouchableOpacity>

          {/* Info Section */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">
              💡 Why These Permissions?
            </Text>
            <Text className="text-xs text-muted leading-relaxed">
              Jarvis needs microphone access to hear your voice commands, notifications to alert you of important events, and media access to manage audio files. All permissions are used only when needed and never shared with external services.
            </Text>
          </View>

          {/* Error Message */}
          {permissions.error && (
            <View className="bg-error/10 rounded-lg p-3 border border-error">
              <Text className="text-error text-sm">{permissions.error}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

/**
 * Individual permission card component.
 */
interface PermissionCardProps {
  icon: string;
  title: string;
  description: string;
  status: string;
  statusColor: string;
  statusIcon: string;
  onPress: () => void;
  colors: any;
}

function PermissionCard({
  icon,
  title,
  description,
  status,
  statusColor,
  statusIcon,
  onPress,
  colors,
}: PermissionCardProps) {
  const isGranted = status === 'granted';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isGranted}
      style={({ pressed }: { pressed: boolean }) => [
        {
          opacity: pressed && !isGranted ? 0.7 : 1,
          backgroundColor: isGranted
            ? colors.background
            : colors.background,
        },
      ]}
      className="border border-border rounded-lg p-3 flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-3 flex-1">
        <Text className="text-2xl">{icon}</Text>
        <View className="flex-1">
          <Text className="text-foreground font-semibold">{title}</Text>
          <Text className="text-xs text-muted">{description}</Text>
        </View>
      </View>

      <View
        className="w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: statusColor }}
      >
        <Text className="text-white text-sm font-bold">{statusIcon}</Text>
      </View>
    </TouchableOpacity>
  );
}
