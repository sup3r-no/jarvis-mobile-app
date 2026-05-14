import { ScrollView, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useJarvisConfig } from '@/hooks/use-jarvis-config';
import { useColors } from '@/hooks/use-colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

const THEME_OPTIONS = [
  { label: 'Light', value: 'light' as const },
  { label: 'Dark', value: 'dark' as const },
  { label: 'Auto', value: 'auto' as const },
];

const COLOR_PRESETS = [
  { label: 'Cyan (Default)', value: '#00D9FF' },
  { label: 'Purple', value: '#9D4EDD' },
  { label: 'Green', value: '#00FF41' },
  { label: 'Orange', value: '#FF6B35' },
  { label: 'Pink', value: '#FF006E' },
  { label: 'Blue', value: '#0096FF' },
];

export default function SettingsScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const {
    config,
    updateTheme,
    updatePrimaryColor,
    updateNotificationsEnabled,
    resetConfig,
  } = useJarvisConfig();

  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleThemeChange = async (theme: 'light' | 'dark' | 'auto') => {
    await updateTheme(theme);
    setShowThemePicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleColorChange = async (color: string) => {
    await updatePrimaryColor(color);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleNotificationToggle = async (value: boolean) => {
    await updateNotificationsEnabled(value);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResetConfig = () => {
    Alert.alert(
      'Reset Configuration',
      'Are you sure you want to reset all settings to defaults?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await resetConfig();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'All settings have been reset to defaults');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-base text-muted">Customize your Jarvis experience</Text>
          </View>

          {/* Theme Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">Theme</Text>
            <Text className="text-sm text-muted">Choose your preferred appearance</Text>

            <View className="flex-row gap-2">
              {THEME_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleThemeChange(option.value)}
                  style={({ pressed }: { pressed: boolean }) => [
                    { opacity: pressed ? 0.7 : 1 },
                    {
                      backgroundColor:
                        config.theme === option.value
                          ? colors.primary
                          : colors.background,
                      borderColor:
                        config.theme === option.value
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                  className="flex-1 border rounded-lg py-2 px-3 items-center"
                >
                  <Text
                    className={
                      config.theme === option.value
                        ? 'text-background font-semibold'
                        : 'text-foreground'
                    }
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Color Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">Primary Color</Text>
            <Text className="text-sm text-muted">Choose your accent color</Text>

            <View className="flex-row flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <TouchableOpacity
                  key={preset.value}
                  onPress={() => handleColorChange(preset.value)}
                  style={({ pressed }: { pressed: boolean }) => [
                    {
                      backgroundColor: preset.value,
                      opacity: pressed ? 0.8 : 1,
                      borderWidth: config.primaryColor === preset.value ? 3 : 0,
                      borderColor: colors.foreground,
                    },
                  ]}
                  className="w-12 h-12 rounded-lg"
                />
              ))}
            </View>

            <Text className="text-xs text-muted mt-2">
              Current: {config.primaryColor}
            </Text>
          </View>

          {/* Notifications Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Notifications</Text>
                <Text className="text-sm text-muted mt-1">
                  Receive alerts and status updates
                </Text>
              </View>
              <Switch
                value={config.notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">About</Text>
            
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">App Version</Text>
                <Text className="text-sm font-medium text-foreground">1.0.0</Text>
              </View>
              
              <View className="h-px bg-border my-1" />
              
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Current Theme</Text>
                <Text className="text-sm font-medium text-foreground">
                  {config.theme === 'auto' ? `Auto (${colorScheme})` : config.theme}
                </Text>
              </View>
            </View>
          </View>

          {/* Danger Zone */}
          <View className="gap-3 bg-red-950 rounded-2xl p-4 border border-red-900">
            <Text className="text-lg font-semibold text-red-200">Danger Zone</Text>
            
            <TouchableOpacity
              onPress={handleResetConfig}
              style={({ pressed }) => [
                { opacity: pressed ? 0.8 : 1 },
              ]}
              className="bg-red-900 py-3 px-4 rounded-lg items-center"
            >
              <Text className="text-red-200 font-semibold">Reset All Settings</Text>
            </TouchableOpacity>

            <Text className="text-xs text-red-300">
              This will reset all settings to their default values. This action cannot be undone.
            </Text>
          </View>

          {/* Info Section */}
          <View className="gap-2 bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">🎨 Customization</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Your theme and color preferences are saved locally on your device and will persist across app restarts.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
