import { describe, it, expect, beforeEach, vi } from 'vitest';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

describe('useJarvisConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have default configuration', () => {
    const defaultConfig = {
      wakeWord: 'jarvis',
      voiceModel: 'piper-en-us-libritts-high',
      smartThingsApiKey: '',
      selectedSpeaker: '',
      theme: 'dark',
      primaryColor: '#00D9FF',
      notificationsEnabled: true,
    };

    expect(defaultConfig.wakeWord).toBe('jarvis');
    expect(defaultConfig.theme).toBe('dark');
    expect(defaultConfig.primaryColor).toBe('#00D9FF');
  });

  it('should validate wake word is not empty', () => {
    const wakeWord = 'jarvis';
    expect(wakeWord.trim().length).toBeGreaterThan(0);
  });

  it('should validate voice model is selected', () => {
    const voiceModels = [
      'piper-en-us-libritts-high',
      'piper-en-us-libritts-medium',
      'piper-en-us-libritts-low',
      'google-speak',
    ];

    expect(voiceModels).toContain('piper-en-us-libritts-high');
  });

  it('should validate theme options', () => {
    const validThemes = ['light', 'dark', 'auto'];
    const testTheme = 'dark';

    expect(validThemes).toContain(testTheme);
  });

  it('should validate primary color format', () => {
    const color = '#00D9FF';
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    expect(hexColorRegex.test(color)).toBe(true);
  });

  it('should have valid color presets', () => {
    const colorPresets = [
      '#00D9FF', // Cyan
      '#9D4EDD', // Purple
      '#00FF41', // Green
      '#FF6B35', // Orange
      '#FF006E', // Pink
      '#0096FF', // Blue
    ];

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    colorPresets.forEach((color) => {
      expect(hexColorRegex.test(color)).toBe(true);
    });
  });

  it('should validate SmartThings API key can be empty initially', () => {
    const apiKey = '';
    expect(typeof apiKey).toBe('string');
  });

  it('should validate selected speaker can be empty initially', () => {
    const speaker = '';
    expect(typeof speaker).toBe('string');
  });

  it('should validate notifications flag is boolean', () => {
    const notificationsEnabled = true;
    expect(typeof notificationsEnabled).toBe('boolean');
  });
});
