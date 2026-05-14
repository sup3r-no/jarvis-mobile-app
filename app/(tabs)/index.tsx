import { ScrollView, Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useJarvisConfig } from "@/hooks/use-jarvis-config";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { config, isLoading } = useJarvisConfig();

  const handleNavigate = (screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(screen as any);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">J.A.R.V.I.S.</Text>
            <Text className="text-base text-muted">Your AI Assistant</Text>
          </View>

          {/* Status Card */}
          <View className="bg-gradient-to-r from-cyan-900 to-blue-900 rounded-2xl p-6 border border-cyan-700">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-3 h-3 bg-green-400 rounded-full" />
              <Text className="text-lg font-bold text-cyan-200">SYSTEM ONLINE</Text>
            </View>
            <Text className="text-sm text-cyan-100 leading-relaxed">
              Wake Word: <Text className="font-semibold">{config.wakeWord}</Text>
            </Text>
            <Text className="text-xs text-cyan-200 mt-2">Ready to assist</Text>
          </View>

          {/* Quick Actions */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">Quick Access</Text>
            
            <TouchableOpacity
              onPress={() => handleNavigate("voice-settings")}
              style={({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center gap-3"
            >
              <Text className="text-2xl">🎤</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Voice Settings</Text>
                <Text className="text-xs text-muted">Configure wake word & voice</Text>
              </View>
              <Text className="text-muted">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNavigate("smartthings")}
              style={({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center gap-3"
            >
              <Text className="text-2xl">🏠</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">SmartThings</Text>
                <Text className="text-xs text-muted">Connect your devices</Text>
              </View>
              <Text className="text-muted">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNavigate("wifi-scanner")}
              style={({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center gap-3"
            >
              <Text className="text-2xl">📡</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">WiFi Devices</Text>
                <Text className="text-xs text-muted">Select speakers & devices</Text>
              </View>
              <Text className="text-muted">›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleNavigate("settings")}
              style={({ pressed }: { pressed: boolean }) => [{ opacity: pressed ? 0.7 : 1 }]}
              className="bg-surface rounded-xl p-4 border border-border flex-row items-center gap-3"
            >
              <Text className="text-2xl">⚙️</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold">Settings</Text>
                <Text className="text-xs text-muted">Theme & preferences</Text>
              </View>
              <Text className="text-muted">›</Text>
            </TouchableOpacity>
          </View>

          {/* System Info */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">System Status</Text>
            
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Voice Model</Text>
                <Text className="text-sm font-medium text-foreground">Piper</Text>
              </View>
              
              <View className="h-px bg-border" />
              
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Speaker</Text>
                <Text className="text-sm font-medium text-foreground">
                  {config.selectedSpeaker ? "Connected" : "Not selected"}
                </Text>
              </View>
              
              <View className="h-px bg-border" />
              
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Theme</Text>
                <Text className="text-sm font-medium text-foreground">
                  {config.theme === "auto" ? "Auto" : config.theme}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View className="bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">💡 Getting Started</Text>
            <Text className="text-xs text-muted leading-relaxed">
              1. Configure your voice settings{"\n"}
              2. Connect your SmartThings devices{"\n"}
              3. Scan and select your WiFi speaker{"\n"}
              4. Start using Jarvis!
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
