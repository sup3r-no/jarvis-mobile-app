# Jarvis Mobile App - Quick Start Guide

Welcome to the Jarvis Mobile App! This guide will help you get started quickly.

## What is Jarvis?

Jarvis is a sophisticated AI assistant interface that brings your Termux environment to your mobile device. It provides:

- **Voice Control**: Configure wake words and voice models
- **Device Management**: Connect and control SmartThings devices
- **WiFi Integration**: Scan and select speakers for audio output
- **Customization**: Personalize the app theme and colors
- **Offline Operation**: Works completely offline with local AI

## First Launch

When you first open the Jarvis app:

1. **Grant Permissions**: The app will request microphone, WiFi, and notification permissions
2. **See the Dashboard**: You'll see the main home screen with quick access buttons
3. **Configure Settings**: Start with Voice Settings to set your wake word

## Quick Setup (5 minutes)

### 1. Voice Settings
- Tap the **🎤 Voice Settings** button on the home screen
- Enter your desired wake word (default: "jarvis")
- Select a voice model (Piper is recommended for offline use)
- Tap "Save Wake Word"

### 2. SmartThings (Optional)
- Tap the **🏠 SmartThings** button
- Enter your Samsung SmartThings API key
- Tap "Scan for Devices" to find your connected devices
- Devices will appear in a list

### 3. WiFi Speakers
- Tap the **📡 WiFi Devices** button
- Tap "Scan for Devices"
- Select your preferred speaker from the list
- The app will remember your selection

### 4. Customize Theme
- Tap the **⚙️ Settings** button
- Choose between Light, Dark, or Auto theme
- Select your preferred accent color
- Toggle notifications on/off

## Main Screens

### Home Dashboard
The main entry point showing:
- System status indicator (SYSTEM ONLINE)
- Current wake word
- Quick access buttons to all features
- System information (voice model, speaker status, theme)

### Voice Settings
Configure how Jarvis responds to you:
- **Wake Word**: The phrase that activates Jarvis
- **Voice Model**: Choose from Piper or Google Speak
- **Current Settings**: View your active configuration

### SmartThings
Connect your Samsung smart home devices:
- Enter your API key securely
- Scan for connected devices
- View device status (online/offline)
- Device types include speakers, lights, TVs, and more

### WiFi Devices
Scan your local network for speakers:
- Discover WiFi-enabled speakers and devices
- View signal strength for each device
- Select your default speaker
- See device details (IP, MAC address)

### Settings
Personalize your experience:
- **Theme**: Light, Dark, or Auto (follows system)
- **Primary Color**: Choose from 6 color presets (Cyan, Purple, Green, Orange, Pink, Blue)
- **Notifications**: Toggle system alerts
- **About**: View app version and current settings
- **Danger Zone**: Reset all settings to defaults

## Tips & Tricks

### Optimal Wake Word
- Use a single word (e.g., "jarvis", "alexa", "hey")
- Avoid words that sound similar to common speech
- Test with the microphone test button

### Voice Models
- **Piper (High)**: Best quality, larger file size, offline
- **Piper (Medium)**: Good balance, recommended
- **Piper (Low)**: Smaller file, faster, lower quality
- **Google Speak**: Requires internet, more natural sounding

### WiFi Scanning
- Ensure your phone is on the same WiFi network as your devices
- Devices must support mDNS/Bonjour discovery
- Signal strength shows connection quality (higher is better)

### Theme Customization
- Colors are saved locally on your device
- Changes apply immediately
- Auto theme follows your system settings

## Connecting to Termux Backend

To use the full power of Jarvis, you need to connect it to your Termux backend:

1. **Set up the backend server** (see TERMUX_INTEGRATION.md)
2. **Start Ollama** in Termux: `ollama serve`
3. **Run the app server**: `python ~/.shortcuts/app_server.py`
4. **Configure the app** with your Termux device IP address

See **TERMUX_INTEGRATION.md** for detailed setup instructions.

## Troubleshooting

### App won't start
- Check that you have at least 100MB free storage
- Try restarting your device
- Clear app cache in Settings

### Can't grant permissions
- Go to phone Settings > Apps > Jarvis
- Enable Microphone, WiFi, and Notification permissions
- Restart the app

### WiFi scan finds no devices
- Ensure your phone is on the same WiFi as your devices
- Check that devices support WiFi discovery
- Try scanning again (sometimes takes a few seconds)

### Settings not saving
- Check that you have storage space available
- Ensure the app has permission to access storage
- Try resetting settings and reconfiguring

### Backend connection issues
- Verify your Termux server is running
- Check the IP address and port are correct
- Ensure both devices are on the same network
- Check firewall settings

## Getting Help

If you encounter issues:

1. **Check the logs**: Review app console for error messages
2. **Read TERMUX_INTEGRATION.md**: Detailed backend setup guide
3. **Verify permissions**: Ensure all required permissions are granted
4. **Test components**: Try each feature independently

## Next Steps

After setup, you can:

1. **Configure automation**: Create custom routines in SmartThings
2. **Optimize voice**: Fine-tune your wake word and voice model
3. **Explore commands**: Try different voice commands with your AI
4. **Customize further**: Adjust colors and theme to your preference

## Advanced Features (Future)

Coming soon:
- Push notifications for system alerts
- Custom automation routines
- Voice command history
- Device automation scheduling
- Multi-device support

## Privacy & Security

- All settings are stored locally on your device
- API keys are encrypted and never sent to external servers
- The app works offline (except for Google Speak)
- No personal data is collected or transmitted

Enjoy your new AI assistant! 🚀
