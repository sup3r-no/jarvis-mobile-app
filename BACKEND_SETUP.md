# Jarvis Backend Server Setup Guide

This guide walks you through setting up the Jarvis backend server in your Termux environment to connect with the mobile app.

## Prerequisites

Before you begin, ensure you have:

1. **Termux** installed on your Android device
2. **Python 3.11+** with pip
3. **Your Jarvis scripts** (ai_agent.py, logic_core.py, etc.) in `~/.shortcuts/`
4. **SmartThings API token** saved in `~/.shortcuts/token.txt`
5. **Device configuration** saved in `~/my_devices.json`

## Step 1: Copy Backend Server to Termux

The backend server file is included in the project. You need to copy it to your Termux environment.

### Option A: Using ADB (Recommended)

If you have Android Debug Bridge (ADB) set up on your computer:

```bash
# From your computer, push the file to Termux
adb push server/termux_backend.py /data/data/com.termux/files/home/.shortcuts/

# Verify it was copied
adb shell ls -la /data/data/com.termux/files/home/.shortcuts/termux_backend.py
```

### Option B: Manual Copy

1. Download `termux_backend.py` from the project
2. In Termux, create the file:
   ```bash
   nano ~/.shortcuts/termux_backend.py
   ```
3. Paste the content and save (Ctrl+X, Y, Enter)

### Option C: Using Termux Web

If you have Termux:API installed, you can use the web interface to upload files.

## Step 2: Verify Your Scripts Are in Place

Ensure all your Jarvis scripts are in the correct location:

```bash
ls -la ~/.shortcuts/
```

You should see:
- `ai_agent_PERFECT.py` or `ai_agent.py`
- `logic_core.py`
- `google_speak.py`
- `find_samsung.py`
- `token.txt`
- `termux_backend.py` (newly copied)

And in your home directory:
```bash
ls -la ~/my_devices.json
```

## Step 3: Install Python Dependencies

Make sure you have the required Python packages:

```bash
pip install requests pychromecast piper-tts ollama
```

## Step 4: Start the Backend Server

### Option A: Manual Start (for testing)

```bash
python ~/.shortcuts/termux_backend.py --port 8000
```

You should see:
```
╔════════════════════════════════════════════╗
║     Jarvis Termux Backend Server           ║
║     Running on http://0.0.0.0:8000         ║
╚════════════════════════════════════════════╝
```

### Option B: Background Start (recommended)

To run the server in the background:

```bash
nohup python ~/.shortcuts/termux_backend.py --port 8000 > ~/.shortcuts/backend.log 2>&1 &
```

### Option C: Persistent Start with Termux:Boot

For the server to start automatically when your device boots:

1. Install Termux:Boot from F-Droid
2. Create the boot script:
   ```bash
   mkdir -p ~/.termux/boot
   nano ~/.termux/boot/start_jarvis
   ```

3. Add this content:
   ```bash
   #!/data/data/com.termux/files/usr/bin/sh
   nohup python ~/.shortcuts/termux_backend.py --port 8000 > ~/.shortcuts/backend.log 2>&1 &
   ```

4. Make it executable:
   ```bash
   chmod +x ~/.termux/boot/start_jarvis
   ```

## Step 5: Configure the Mobile App

Now that your backend server is running, configure the mobile app to connect to it.

### Find Your Termux Device IP

In Termux, run:
```bash
ifconfig | grep "inet addr"
```

Or use:
```bash
hostname -I
```

Note the IP address (e.g., `192.168.1.100`).

### Connect Mobile App to Backend

1. Open the Jarvis mobile app
2. Go to **Settings** → **Backend Configuration** (or similar)
3. Enter the backend URL:
   - **Local Network**: `http://192.168.1.100:8000`
   - **USB Forward**: `http://127.0.0.1:8000` (if using ADB port forwarding)
4. Tap "Test Connection"

You should see a success message.

## Step 6: Test the Backend

### Test Status Endpoint

From your phone's browser or using curl:

```bash
curl http://192.168.1.100:8000/api/status
```

You should get a JSON response:
```json
{
  "system": "online",
  "timestamp": 1234567890,
  "ollama": true,
  "config": {...},
  "version": "1.0.0"
}
```

### Test Command Endpoint

```bash
curl -X POST http://192.168.1.100:8000/api/command \
  -H "Content-Type: application/json" \
  -d '{"command": "what time is it"}'
```

### Test Device Endpoint

```bash
curl http://192.168.1.100:8000/api/devices
```

## API Reference

The backend server provides the following endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | System status and configuration |
| `/api/health` | GET | Health check |
| `/api/config` | GET | Get current configuration |
| `/api/config` | POST | Save configuration |
| `/api/devices` | GET | List SmartThings devices |
| `/api/command` | POST | Process voice/text command |
| `/api/device-command` | POST | Send command to device |
| `/api/scan-devices` | POST | Scan for WiFi devices |

## Troubleshooting

### Server won't start

**Error**: `ModuleNotFoundError: No module named 'logic_core'`

**Solution**: Ensure your scripts are in `~/.shortcuts/` and the path is correct in the server.

### Can't connect from mobile app

**Problem**: "Connection refused" or timeout

**Solution**:
1. Verify the server is running: `ps aux | grep termux_backend`
2. Check the IP address is correct: `hostname -I`
3. Ensure both devices are on the same WiFi network
4. Check firewall settings: `iptables -L` (may need to open port 8000)

### Commands not executing

**Problem**: API returns error for commands

**Solution**:
1. Check the backend logs: `tail -f ~/.shortcuts/backend.log`
2. Verify your scripts are working in Termux directly
3. Ensure Ollama is running: `ps aux | grep ollama`

### Ollama not responding

**Problem**: API shows `"ollama": false`

**Solution**:
1. Start Ollama: `ollama serve`
2. Verify it's listening: `netstat -an | grep 11434`
3. Check available models: `ollama list`

## Advanced Configuration

### Custom Port

To run on a different port:

```bash
python ~/.shortcuts/termux_backend.py --port 9000
```

### Bind to Specific IP

To bind to a specific interface:

```bash
python ~/.shortcuts/termux_backend.py --host 192.168.1.100 --port 8000
```

### Enable Logging

To see detailed logs:

```bash
python ~/.shortcuts/termux_backend.py --port 8000 2>&1 | tee ~/.shortcuts/backend.log
```

## Security Considerations

⚠️ **Important**: The backend server is designed for local network use only.

- **Don't expose to the internet**: Use a VPN if you need remote access
- **Firewall**: Only allow connections from trusted devices
- **API Key**: Store your SmartThings token securely
- **Network**: Use a private WiFi network, not public WiFi

## Next Steps

Once your backend is running and connected:

1. **Test Voice Commands**: Try saying "Jarvis, what time is it?"
2. **Control Devices**: Use the SmartThings tab to control your devices
3. **Customize Settings**: Adjust wake words and voice models
4. **Set Up Automation**: Create custom routines and automations

## Support

If you encounter issues:

1. Check the logs: `tail -f ~/.shortcuts/backend.log`
2. Review the TERMUX_INTEGRATION.md guide
3. Verify all scripts are in the correct locations
4. Test individual components in Termux

For more information, see the main README.md and QUICKSTART.md guides.
