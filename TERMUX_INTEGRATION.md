# Jarvis Mobile App - Termux Integration Guide

This document explains how to integrate the Jarvis mobile app with your Termux environment and Python backend scripts.

## Overview

The Jarvis mobile app is designed to work alongside your existing Termux setup. The app provides a user-friendly interface for:

- Configuring voice settings (wake word, voice model)
- Managing SmartThings API integration
- Scanning and selecting WiFi speakers
- Customizing the app theme and appearance

The app communicates with your Termux backend to execute commands and retrieve device information.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Jarvis Mobile App                         │
│  (React Native / Expo - iOS & Android)                      │
│                                                             │
│  • Voice Settings UI                                        │
│  • SmartThings Configuration                               │
│  • WiFi Device Scanner                                      │
│  • Theme Customization                                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket Communication
                     │
┌────────────────────▼────────────────────────────────────────┐
│              Termux Backend (Python)                         │
│                                                             │
│  • native_trigger.py (Wake word detection)                 │
│  • ai_agent.py (Command processing)                        │
│  • logic_core.py (Device control)                          │
│  • google_speak.py (Text-to-speech)                        │
│  • find_samsung.py (SmartThings integration)               │
│  • Ollama (Local LLM)                                       │
└────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### Step 1: Prepare Your Termux Environment

Ensure your Termux setup has the following:

1. **Python 3.11+** with required packages:
   ```bash
   pip install requests pychromecast piper-tts ollama
   ```

2. **Ollama** running locally:
   ```bash
   ollama pull llama3.2:1b
   ollama serve
   ```

3. **FFmpeg** for audio processing:
   ```bash
   apt install ffmpeg
   ```

4. **Your Python scripts** in `~/.shortcuts/`:
   - `native_trigger.py`
   - `ai_agent.py`
   - `logic_core.py`
   - `google_speak.py`
   - `find_samsung.py`
   - `vosk_server.py`

### Step 2: Create a Termux Backend Server

Create a simple HTTP server to handle requests from the mobile app. Save this as `~/.shortcuts/app_server.py`:

```python
#!/usr/bin/env python3
import json
import os
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

HOME = "/data/data/com.termux/files/home"
CONFIG_FILE = f"{HOME}/.shortcuts/app_config.json"

class JarvisAppHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            status = {
                'system': 'online',
                'ollama': self._check_ollama(),
                'config': self._load_config(),
            }
            self.wfile.write(json.dumps(status).encode())
        
        elif parsed_path.path == '/api/devices':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            # Call find_samsung.py to get devices
            devices = self._get_devices()
            self.wfile.write(json.dumps(devices).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        """Handle POST requests"""
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode())
        except:
            self.send_response(400)
            self.end_headers()
            return
        
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/config':
            self._save_config(data)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode())
        
        elif parsed_path.path == '/api/command':
            result = self._execute_command(data.get('command', ''))
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'result': result}).encode())
        
        else:
            self.send_response(404)
            self.end_headers()
    
    def _check_ollama(self):
        """Check if Ollama is running"""
        try:
            import socket
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect(('127.0.0.1', 11434))
            s.close()
            return True
        except:
            return False
    
    def _load_config(self):
        """Load configuration from file"""
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, 'r') as f:
                    return json.load(f)
            except:
                pass
        return {}
    
    def _save_config(self, config):
        """Save configuration to file"""
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)
    
    def _get_devices(self):
        """Get SmartThings devices"""
        # This would call your find_samsung.py or similar
        return []
    
    def _execute_command(self, command):
        """Execute a command"""
        try:
            result = subprocess.run(
                ['python', f'{HOME}/.shortcuts/ai_agent.py', command],
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.stdout
        except Exception as e:
            return f"Error: {str(e)}"
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass

def run_server(port=8000):
    """Start the HTTP server"""
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, JarvisAppHandler)
    print(f"Jarvis App Server running on http://127.0.0.1:{port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
```

### Step 3: Start the Backend Server

In your Termux environment, run:

```bash
nohup python ~/.shortcuts/app_server.py > ~/.shortcuts/app_server.log 2>&1 &
```

This starts the backend server on `http://127.0.0.1:8000`.

### Step 4: Configure the Mobile App

1. **Open the Jarvis app** on your device
2. **Go to Voice Settings** and configure:
   - Wake word (e.g., "jarvis")
   - Voice model (e.g., "piper-en-us-libritts-high")
3. **Go to SmartThings** and enter your API key
4. **Go to WiFi Devices** and scan for speakers
5. **Go to Settings** and customize the theme

All settings are saved locally on your device.

## API Endpoints

The app expects the following endpoints to be available on your Termux backend:

### GET `/api/status`
Returns the current system status.

**Response:**
```json
{
  "system": "online",
  "ollama": true,
  "config": {
    "wakeWord": "jarvis",
    "voiceModel": "piper-en-us-libritts-high"
  }
}
```

### GET `/api/devices`
Returns a list of discovered devices.

**Response:**
```json
{
  "devices": [
    {
      "id": "1",
      "name": "Living Room Speaker",
      "ip": "192.168.1.100",
      "type": "speaker",
      "status": "online"
    }
  ]
}
```

### POST `/api/config`
Saves configuration settings.

**Request:**
```json
{
  "wakeWord": "jarvis",
  "voiceModel": "piper-en-us-libritts-high",
  "smartThingsApiKey": "your-api-key"
}
```

### POST `/api/command`
Executes a command through the AI agent.

**Request:**
```json
{
  "command": "turn on the living room light"
}
```

**Response:**
```json
{
  "result": "Command executed successfully"
}
```

## Networking

### Local Network (Same WiFi)

If your phone and Termux device are on the same WiFi network, use:
```
http://<termux-device-ip>:8000
```

### USB Connection

If using USB debugging, you can forward the port:
```bash
adb forward tcp:8000 tcp:8000
```

Then use:
```
http://127.0.0.1:8000
```

## Troubleshooting

### App can't connect to backend
1. Check if the backend server is running: `ps aux | grep app_server.py`
2. Verify the IP address and port are correct
3. Check firewall settings on your Termux device
4. Ensure both devices are on the same network

### Ollama not responding
1. Check if Ollama is running: `ps aux | grep ollama`
2. Verify it's listening on port 11434: `netstat -an | grep 11434`
3. Restart Ollama: `killall ollama && ollama serve`

### Voice commands not working
1. Check microphone permissions in app settings
2. Verify `native_trigger.py` is running
3. Check the Vosk server is initialized
4. Review logs: `tail -f ~/.shortcuts/app_server.log`

## Building the APK

Once you've tested the app and everything is working:

1. **In the Manus UI**, click the "Publish" button
2. The system will build an APK file
3. Download the APK to your device
4. Install it: `adb install jarvis-mobile-app.apk`

## Future Enhancements

- Push notifications for system alerts
- Voice recognition directly in the app
- Real-time device status updates
- Custom automation routines
- Cloud sync for settings (optional)
- Multi-device support

## Support

For issues or questions, refer to:
- Expo documentation: https://docs.expo.dev
- React Native documentation: https://reactnative.dev
- Your Termux scripts documentation

## License

This app integrates with your personal Termux setup and is for personal use only.
