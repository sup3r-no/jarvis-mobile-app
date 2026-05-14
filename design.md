# Jarvis Mobile App - Interface Design

## Overview

The Jarvis Mobile App is a sophisticated AI assistant interface that bridges the user's Termux environment with a beautiful, intuitive mobile dashboard. The app provides voice control, device management, and system configuration in a sleek, customizable interface inspired by the J.A.R.V.I.S. system from Iron Man.

## Design Principles

- **One-handed usage**: All interactive elements positioned within thumb reach
- **Dark-first aesthetic**: Inspired by AI interfaces and Tony Stark's tech
- **Minimal cognitive load**: Clear hierarchy, obvious next actions
- **Offline-first**: All core features work without internet connectivity
- **Accessibility**: Large touch targets, high contrast, clear feedback

## Screen List

### 1. **Home Screen** (Dashboard)
The main entry point showing the current system status and quick access to key features.

**Content:**
- Jarvis status indicator (online/offline)
- Current wake word display
- Quick action buttons (Settings, Voice Control, Devices)
- System status panel (battery, WiFi, device count)
- Recent commands/activity log

**Functionality:**
- Display real-time status from Termux backend
- Quick access to primary features
- Visual feedback on system health

### 2. **Voice Settings Screen**
Configure voice-related settings for the Jarvis system.

**Content:**
- Wake word input field (editable, default: "jarvis")
- Voice model selector (dropdown with Piper voice options)
- Microphone test button
- Volume slider
- Speech speed slider
- Language selector

**Functionality:**
- Change wake word dynamically
- Select from available voice models
- Test microphone and audio playback
- Adjust speech parameters

### 3. **SmartThings Integration Screen**
Configure Samsung SmartThings API integration.

**Content:**
- API Key input field (password-protected)
- Connected devices list
- Device status indicators
- Refresh button
- Save/Cancel buttons

**Functionality:**
- Securely store API key
- Display connected SmartThings devices
- Show device status (on/off, brightness, etc.)
- Refresh device list

### 4. **WiFi Device Scanner Screen**
Scan and select WiFi speakers and devices.

**Content:**
- Scan button (triggers network scan)
- Loading indicator during scan
- List of discovered devices with signal strength
- Selected speaker indicator
- Device details (IP, MAC address)

**Functionality:**
- Scan local WiFi network for devices
- Display discovered speakers and devices
- Select default speaker for audio output
- Show device connectivity information

### 5. **Settings Screen**
Main settings hub for app configuration.

**Content:**
- Theme selector (light/dark/auto)
- Color palette picker
- Notification settings toggle
- Permission status display
- About section
- Advanced settings (hidden by default)

**Functionality:**
- Switch between light and dark themes
- Customize app colors
- Toggle notifications
- View and manage app permissions
- Access advanced configuration

### 6. **Permissions Screen**
Request and display app permissions.

**Content:**
- Permission list with status indicators
- Description of why each permission is needed
- Request button for each permission
- Visual status (granted/denied/pending)

**Functionality:**
- Request microphone access
- Request WiFi scanning permissions
- Request notification permissions
- Request file system access
- Show permission status

## Primary User Flows

### Flow 1: Initial Setup
1. User opens app
2. Permissions screen appears
3. User grants microphone, WiFi, and notification permissions
4. App initializes Ollama and native_trigger.py
5. Home screen displays with "JARVIS ONLINE" status
6. User can proceed to Voice Settings or SmartThings setup

### Flow 2: Voice Control Configuration
1. User taps "Voice Settings" on Home
2. Voice Settings screen opens
3. User enters new wake word (optional)
4. User selects voice model from dropdown
5. User taps "Test Microphone" to verify audio
6. Settings are saved to local config
7. User returns to Home

### Flow 3: SmartThings Device Control
1. User taps "Devices" on Home
2. SmartThings Integration screen opens
3. User enters API key (if not already saved)
4. App fetches and displays connected devices
5. User can tap devices to see details
6. User selects default speaker for audio output
7. Configuration is saved

### Flow 4: WiFi Speaker Selection
1. User taps "Select Speaker" on Home or Settings
2. WiFi Device Scanner screen opens
3. User taps "Scan Network"
4. App scans for WiFi devices (shows loading)
5. Discovered devices appear in list
6. User selects desired speaker
7. Selection is saved and confirmed

## Color Choices

**Primary Brand Colors:**
- **Primary Accent**: `#00D9FF` (Cyan - Jarvis blue)
- **Background Dark**: `#0F1419` (Deep space black)
- **Background Light**: `#1A1F2E` (Charcoal)
- **Surface**: `#252D3D` (Elevated surface)
- **Text Primary**: `#FFFFFF` (Pure white)
- **Text Secondary**: `#A0A8B8` (Muted silver)
- **Success**: `#00FF41` (Matrix green)
- **Warning**: `#FFB800` (Alert orange)
- **Error**: `#FF3B3B` (Alert red)

**Theme Strategy:**
- Default to dark theme (AI/tech aesthetic)
- Cyan accents for interactive elements
- High contrast for accessibility
- Consistent use of brand colors across all screens

## Layout Specifications

- **Safe Area Padding**: 16px (left/right), 12px (top/bottom)
- **Card Radius**: 12px (subtle rounded corners)
- **Button Height**: 48px (thumb-friendly)
- **List Item Height**: 56px (standard)
- **Icon Size**: 24px (standard), 32px (large buttons)
- **Font Sizes**: 12px (caption), 14px (body), 16px (subtitle), 18px (title), 24px (heading)

## Interaction Patterns

- **Buttons**: Scale to 0.97 on press with light haptic feedback
- **List Items**: Opacity change to 0.7 on press
- **Loading States**: Spinner with "Initializing..." text
- **Confirmation**: Toast notifications for successful actions
- **Errors**: Modal alerts with retry options

## Accessibility Considerations

- Minimum touch target size: 44x44pt
- Color contrast ratio: 4.5:1 for text
- Clear focus indicators for keyboard navigation
- Haptic feedback for important actions
- Voice announcements for status changes (future enhancement)
