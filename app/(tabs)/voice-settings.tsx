import { ScrollView, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useJarvisConfig } from '@/hooks/use-jarvis-config';
import { useColors } from '@/hooks/use-colors';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

const VOICE_MODELS = [
  { label: 'Piper (High Quality)', value: 'piper-en-us-libritts-high' },
  { label: 'Piper (Medium Quality)', value: 'piper-en-us-libritts-medium' },
  { label: 'Piper (Low Quality)', value: 'piper-en-us-libritts-low' },
  { label: 'Google Speak', value: 'google-speak' },
];

export default function VoiceSettingsScreen() {
  const colors = useColors();
  const {
    config,
    updateWakeWord,
    updateVoiceModel,
  } = useJarvisConfig();

  const [wakeWordInput, setWakeWordInput] = useState(config.wakeWord);
  const [showVoiceModelPicker, setShowVoiceModelPicker] = useState(false);

  const handleSaveWakeWord = async () => {
    if (wakeWordInput.trim().length === 0) {
      Alert.alert('Invalid Wake Word', 'Wake word cannot be empty');
      return;
    }
    await updateWakeWord(wakeWordInput.trim());
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', `Wake word updated to "${wakeWordInput.trim()}"`);
  };

  const handleSelectVoiceModel = async (model: string) => {
    await updateVoiceModel(model);
    setShowVoiceModelPicker(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-4">
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Voice Settings</Text>
            <Text className="text-base text-muted">Configure your Jarvis voice preferences</Text>
          </View>

          {/* Wake Word Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">Wake Word</Text>
            <Text className="text-sm text-muted">The word that activates Jarvis</Text>
            
            <TextInput
              value={wakeWordInput}
              onChangeText={setWakeWordInput}
              placeholder="Enter wake word (e.g., jarvis)"
              placeholderTextColor={colors.muted}
              className="bg-background text-foreground px-4 py-3 rounded-lg border border-border"
              style={{ color: colors.foreground }}
            />

            <TouchableOpacity
              onPress={handleSaveWakeWord}
              style={({ pressed }: { pressed: boolean }) => [
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
              className="py-3 px-4 rounded-lg items-center"
            >
              <Text className="text-background font-semibold">Save Wake Word</Text>
            </TouchableOpacity>
          </View>

          {/* Voice Model Section */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">Voice Model</Text>
            <Text className="text-sm text-muted">Select the voice for Jarvis responses</Text>

            <TouchableOpacity
              onPress={() => setShowVoiceModelPicker(!showVoiceModelPicker)}
              style={({ pressed }: { pressed: boolean }) => [
                { opacity: pressed ? 0.7 : 1 },
              ]}
              className="bg-background border border-border rounded-lg p-4 flex-row justify-between items-center"
            >
              <Text className="text-foreground font-medium">
                {VOICE_MODELS.find(m => m.value === config.voiceModel)?.label || 'Select a model'}
              </Text>
              <Text className="text-muted">▼</Text>
            </TouchableOpacity>

            {showVoiceModelPicker && (
              <View className="gap-2 mt-2">
                {VOICE_MODELS.map((model) => (
                  <TouchableOpacity
                    key={model.value}
                    onPress={() => handleSelectVoiceModel(model.value)}
                    style={({ pressed }: { pressed: boolean }) => [
                      { opacity: pressed ? 0.7 : 1 },
                      {
                        backgroundColor:
                          config.voiceModel === model.value
                            ? colors.primary
                            : colors.background,
                      },
                    ]}
                    className="border border-border rounded-lg p-3"
                  >
                    <Text
                      className={
                        config.voiceModel === model.value
                          ? 'text-background font-medium'
                          : 'text-foreground'
                      }
                    >
                      {model.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Current Settings Display */}
          <View className="gap-3 bg-surface rounded-2xl p-4">
            <Text className="text-lg font-semibold text-foreground">Current Settings</Text>
            
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Wake Word:</Text>
                <Text className="text-sm font-medium text-foreground">{config.wakeWord}</Text>
              </View>
              
              <View className="h-px bg-border my-1" />
              
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-muted">Voice Model:</Text>
                <Text className="text-sm font-medium text-foreground">
                  {VOICE_MODELS.find(m => m.value === config.voiceModel)?.label}
                </Text>
              </View>
            </View>
          </View>

          {/* Info Section */}
          <View className="gap-2 bg-surface rounded-2xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground">ℹ️ About Voice Models</Text>
            <Text className="text-xs text-muted leading-relaxed">
              Piper models run locally on your device for complete offline operation. Google Speak requires internet but offers more natural-sounding voices.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
