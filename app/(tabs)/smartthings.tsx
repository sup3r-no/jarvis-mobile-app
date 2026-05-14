import { ScrollView, Text, TextInput, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useJarvisConfig } from '@/hooks/use-jarvis-config';
import { useColors } from '@/hooks/use-colors';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

interface SmartThingsDevice {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline';
}

export default function SmartThingsScreen() {
  const colors = useColors();
  const {
    config,
    updateSmartThingsApiKey,
  } = useJarvisConfig();

  const [apiKeyInput, setApiKeyInput] = useState(config.smartThingsApiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState<SmartThingsDevice[]>([]);
  const [hasDevices, setHasDevices] = useState(false);

  const handleSaveApiKey = async () => {
    if (apiKeyInput.trim().length === 0) {
      Alert.alert('Invalid API Key', 'API key cannot be empty');
      return;
    }
    await updateSmartThingsApiKey(apiKeyInput.trim());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'SmartThings API key saved securely');
  };

  const handleFetchDevices = async () => {
    if (!config.smartThingsApiKey) {
      Alert.alert('API Key Required', 'Please save your SmartThings API key first');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate fetching devices from SmartThings API
      // In a real app, this would call the SmartThings API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockDevices: SmartThingsDevice[] = [
        { id: '1', name: 'Living Room Speaker', type: 'speaker', status: 'online' },
        { id: '2', name: 'Kitchen Light', type: 'light', status: 'online' },
        { id: '3', name: 'Bedroom TV', type: 'tv', status: 'offline' },
      ];
      
      setDevices(mockDevices);
      setHasDevices(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Found ${mockDevices.length} devices`);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch devices. Check your API key.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">SmartThings</Text>
            <Text className="text-base text-muted">Connect and control your Samsung devices</Text>
          </View>

          {/* API Key Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">API Key</Text>
            <Text className="text-sm text-muted">Enter your SmartThings API key to connect devices</Text>
            
            <View className="flex-row items-center gap-2">
              <TextInput
                value={apiKeyInput}
                onChangeText={setApiKeyInput}
                placeholder="Enter SmartThings API key"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showApiKey}
                className="flex-1 bg-background text-foreground px-4 py-3 rounded-lg border border-border"
                style={{ color: colors.foreground }}
              />
            <TouchableOpacity
              onPress={() => setShowApiKey(!showApiKey)}
              style={({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="p-2"
              >
                <Text className="text-muted text-lg">{showApiKey ? '👁️' : '🔒'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleSaveApiKey}
              style={({ pressed }: { pressed: boolean }) => [
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
              className="py-3 px-4 rounded-lg items-center"
            >
              <Text className="text-background font-semibold">Save API Key</Text>
            </TouchableOpacity>
          </View>

          {/* Fetch Devices Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">Connected Devices</Text>
            
            <TouchableOpacity
              onPress={handleFetchDevices}
              disabled={isLoading || !config.smartThingsApiKey}
              style={({ pressed }: { pressed: boolean }) => [
                { 
                  backgroundColor: !config.smartThingsApiKey ? colors.border : colors.primary,
                  opacity: pressed ? 0.8 : 1 
                },
              ]}
              className="py-3 px-4 rounded-lg items-center flex-row justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color={colors.background} size="small" />
                  <Text className="text-background font-semibold">Scanning...</Text>
                </>
              ) : (
                <Text className="text-background font-semibold">Scan for Devices</Text>
              )}
            </TouchableOpacity>

            {/* Devices List */}
            {hasDevices && devices.length > 0 && (
              <View className="gap-2 mt-4">
                {devices.map((device) => (
                  <View
                    key={device.id}
                    className="bg-background rounded-lg p-3 border border-border flex-row justify-between items-center"
                  >
                    <View className="flex-1">
                      <Text className="text-foreground font-medium">{device.name}</Text>
                      <Text className="text-xs text-muted mt-1">{device.type}</Text>
                    </View>
                    <View
                      className={`px-3 py-1 rounded-full ${
                        device.status === 'online'
                          ? 'bg-green-900'
                          : 'bg-red-900'
                      }`}
                    >
                      <Text
                        className={
                          device.status === 'online'
                            ? 'text-green-200 text-xs font-medium'
                            : 'text-red-200 text-xs font-medium'
                        }
                      >
                        {device.status}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {hasDevices && devices.length === 0 && (
              <Text className="text-center text-muted text-sm py-4">No devices found</Text>
            )}
          </View>

          {/* Info Section */}
          <View className="gap-2 bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">🔐 Security Note</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Your API key is stored securely on your device and never sent to external servers. You can reset it anytime by clearing the app data.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
