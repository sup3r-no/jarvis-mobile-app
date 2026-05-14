import { ScrollView, Text, View, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useJarvisConfig } from '@/hooks/use-jarvis-config';
import { useColors } from '@/hooks/use-colors';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

interface WiFiDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  signalStrength: number;
  type: string;
}

export default function WiFiScannerScreen() {
  const colors = useColors();
  const {
    config,
    updateSelectedSpeaker,
  } = useJarvisConfig();

  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<WiFiDevice[]>([]);
  const [hasScanned, setHasScanned] = useState(false);

  const handleScanNetwork = async (): Promise<void> => {
    setIsScanning(true);
    setHasScanned(true);
    try {
      // Simulate scanning for WiFi devices
      // In a real app, this would use native WiFi scanning APIs
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockDevices: WiFiDevice[] = [
        {
          id: '1',
          name: 'Samsung Speaker Pro',
          ip: '192.168.1.100',
          mac: '00:1A:2B:3C:4D:5E',
          signalStrength: 95,
          type: 'speaker',
        },
        {
          id: '2',
          name: 'Living Room TV',
          ip: '192.168.1.101',
          mac: '00:1A:2B:3C:4D:5F',
          signalStrength: 85,
          type: 'tv',
        },
        {
          id: '3',
          name: 'Kitchen Display',
          ip: '192.168.1.102',
          mac: '00:1A:2B:3C:4D:60',
          signalStrength: 72,
          type: 'display',
        },
        {
          id: '4',
          name: 'Bedroom Speaker',
          ip: '192.168.1.103',
          mac: '00:1A:2B:3C:4D:61',
          signalStrength: 65,
          type: 'speaker',
        },
      ];
      
      setDevices(mockDevices);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan network');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSelectDevice = async (device: WiFiDevice): Promise<void> => {
    await updateSelectedSpeaker(device.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Success', `Selected ${device.name} as default speaker`);
  };

  const getSignalIcon = (strength: number) => {
    if (strength >= 80) return '📶';
    if (strength >= 60) return '📳';
    return '📴';
  };

  const renderDeviceItem = ({ item }: { item: WiFiDevice }): JSX.Element => (
    <TouchableOpacity
      onPress={() => handleSelectDevice(item)}
      style={({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.7 : 1 }]}
      className="bg-background rounded-lg p-4 border border-border mb-3 flex-row justify-between items-center"
    >
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-foreground font-semibold flex-1">{item.name}</Text>
          <Text className="text-lg">{getSignalIcon(item.signalStrength)}</Text>
        </View>
        
        <View className="gap-1">
          <Text className="text-xs text-muted">IP: {item.ip}</Text>
          <Text className="text-xs text-muted">Signal: {item.signalStrength}%</Text>
        </View>
      </View>

      {config.selectedSpeaker === item.id && (
        <View className="ml-3 p-2 bg-green-900 rounded-full">
          <Text className="text-green-200 text-lg">✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">WiFi Devices</Text>
            <Text className="text-base text-muted">Scan and select your speakers</Text>
          </View>

          {/* Scan Button */}
          <TouchableOpacity
            onPress={handleScanNetwork}
            disabled={isScanning}
            style={({ pressed }: { pressed: boolean }) => [
              { 
                backgroundColor: colors.primary,
                opacity: pressed ? 0.8 : 1 
              },
            ]}
            className="py-4 px-4 rounded-lg items-center flex-row justify-center gap-2"
          >
            {isScanning ? (
              <>
                <ActivityIndicator color={colors.background} size="small" />
                <Text className="text-background font-semibold">Scanning Network...</Text>
              </>
            ) : (
              <>
                <Text className="text-lg">📡</Text>
                <Text className="text-background font-semibold">Scan for Devices</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Devices List */}
          {hasScanned && devices.length > 0 && (
            <View className="gap-3 bg-surface rounded-2xl p-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold text-foreground">
                  Found {devices.length} Device{devices.length !== 1 ? 's' : ''}
                </Text>
              </View>

              <FlatList
                data={devices}
                renderItem={renderDeviceItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {hasScanned && devices.length === 0 && (
            <View className="bg-surface rounded-2xl p-6 items-center gap-3">
              <Text className="text-4xl">📡</Text>
              <Text className="text-foreground font-semibold text-center">No Devices Found</Text>
              <Text className="text-sm text-muted text-center">
                Make sure your devices are connected to the same WiFi network and try again.
              </Text>
            </View>
          )}

          {/* Selected Speaker Display */}
          {config.selectedSpeaker && (
            <View className="gap-3 bg-surface rounded-2xl p-4 border-2 border-green-900">
              <Text className="text-sm font-semibold text-foreground">✓ Selected Speaker</Text>
              <Text className="text-foreground font-medium">
                {devices.find(d => d.id === config.selectedSpeaker)?.name || 'Unknown Device'}
              </Text>
            </View>
          )}

          {/* Info Section */}
          <View className="gap-2 bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">💡 Tips</Text>
            <Text className="text-xs text-muted leading-relaxed">
              • Make sure your phone is connected to the same WiFi network{'\n'}
              • Devices must support network discovery (mDNS/Bonjour){'\n'}
              • Signal strength indicates connection quality
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
