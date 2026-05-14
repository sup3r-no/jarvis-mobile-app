#!/usr/bin/env python3
"""
Jarvis Termux Backend Server
Integrates with user's Jarvis scripts to provide HTTP API for mobile app.
"""

import json
import os
import sys
import subprocess
import threading
import time
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from pathlib import Path

# --- CONFIGURATION ---
HOME = "/data/data/com.termux/files/home"
SHORTCUTS_PATH = f"{HOME}/.shortcuts"
CONFIG_FILE = f"{SHORTCUTS_PATH}/app_config.json"
TOKEN_FILE = f"{SHORTCUTS_PATH}/token.txt"
DEVICES_FILE = f"{HOME}/my_devices.json"

# Ensure shortcuts path exists
Path(SHORTCUTS_PATH).mkdir(parents=True, exist_ok=True)

# Add shortcuts to path for imports
if SHORTCUTS_PATH not in sys.path:
    sys.path.insert(0, SHORTCUTS_PATH)

# Import user's modules
try:
    import logic_core
    import ai_agent_PERFECT as ai_agent
except ImportError as e:
    print(f"Warning: Could not import user modules: {e}")
    logic_core = None
    ai_agent = None


class JarvisBackendHandler(BaseHTTPRequestHandler):
    """HTTP request handler for Jarvis mobile app API."""

    def do_GET(self):
        """Handle GET requests."""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        try:
            if path == '/api/status':
                self._handle_status()
            elif path == '/api/devices':
                self._handle_get_devices()
            elif path == '/api/config':
                self._handle_get_config()
            elif path == '/api/health':
                self._handle_health()
            else:
                self._send_error(404, "Endpoint not found")
        except Exception as e:
            print(f"Error handling GET {path}: {e}")
            self._send_error(500, str(e))

    def do_POST(self):
        """Handle POST requests."""
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Read request body
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)
        
        try:
            data = json.loads(body.decode('utf-8')) if body else {}
        except json.JSONDecodeError:
            self._send_error(400, "Invalid JSON")
            return
        
        try:
            if path == '/api/config':
                self._handle_save_config(data)
            elif path == '/api/command':
                self._handle_command(data)
            elif path == '/api/device-command':
                self._handle_device_command(data)
            elif path == '/api/scan-devices':
                self._handle_scan_devices(data)
            else:
                self._send_error(404, "Endpoint not found")
        except Exception as e:
            print(f"Error handling POST {path}: {e}")
            self._send_error(500, str(e))

    # --- GET HANDLERS ---

    def _handle_status(self):
        """GET /api/status - Return system status."""
        status = {
            'system': 'online',
            'timestamp': time.time(),
            'ollama': self._check_ollama(),
            'config': self._load_config(),
            'version': '1.0.0',
        }
        self._send_json(status)

    def _handle_get_devices(self):
        """GET /api/devices - Return list of SmartThings devices."""
        devices = self._load_devices()
        self._send_json({'devices': devices})

    def _handle_get_config(self):
        """GET /api/config - Return current configuration."""
        config = self._load_config()
        self._send_json(config)

    def _handle_health(self):
        """GET /api/health - Health check endpoint."""
        self._send_json({'status': 'healthy', 'timestamp': time.time()})

    # --- POST HANDLERS ---

    def _handle_save_config(self, data):
        """POST /api/config - Save configuration."""
        config = self._load_config()
        config.update(data)
        
        with open(CONFIG_FILE, 'w') as f:
            json.dump(config, f, indent=2)
        
        self._send_json({'success': True, 'config': config})

    def _handle_command(self, data):
        """POST /api/command - Process a voice/text command."""
        command = data.get('command', '').strip()
        
        if not command:
            self._send_error(400, "Command is required")
            return
        
        if not ai_agent:
            self._send_error(503, "AI agent not available")
            return
        
        try:
            # Use the user's AI agent to process the command
            result = ai_agent.process_query(command)
            self._send_json({
                'success': True,
                'command': command,
                'result': result,
                'timestamp': time.time(),
            })
        except Exception as e:
            print(f"Error processing command: {e}")
            self._send_json({
                'success': False,
                'command': command,
                'error': str(e),
            })

    def _handle_device_command(self, data):
        """POST /api/device-command - Send command to a SmartThings device."""
        device_name = data.get('device', '').strip()
        command = data.get('command', '').strip()
        arg = data.get('arg')
        
        if not device_name or not command:
            self._send_error(400, "Device and command are required")
            return
        
        if not logic_core:
            self._send_error(503, "Logic core not available")
            return
        
        try:
            # Use the user's logic_core to execute device commands
            result = logic_core.execute_logic(json.dumps({
                'tool': 'smartthings',
                'device': device_name,
                'command': command,
                'arg': arg,
            }))
            
            self._send_json({
                'success': True,
                'device': device_name,
                'command': command,
                'result': result,
                'timestamp': time.time(),
            })
        except Exception as e:
            print(f"Error executing device command: {e}")
            self._send_json({
                'success': False,
                'device': device_name,
                'command': command,
                'error': str(e),
            })

    def _handle_scan_devices(self, data):
        """POST /api/scan-devices - Scan for WiFi devices."""
        try:
            # This would call find_samsung.py or similar
            # For now, return mock data
            devices = [
                {
                    'id': '1',
                    'name': 'Living Room Speaker',
                    'ip': '192.168.1.100',
                    'type': 'speaker',
                    'status': 'online',
                    'signal': 85,
                },
                {
                    'id': '2',
                    'name': 'Kitchen Display',
                    'ip': '192.168.1.101',
                    'type': 'display',
                    'status': 'online',
                    'signal': 72,
                },
            ]
            
            self._send_json({
                'success': True,
                'devices': devices,
                'timestamp': time.time(),
            })
        except Exception as e:
            print(f"Error scanning devices: {e}")
            self._send_json({
                'success': False,
                'error': str(e),
            })

    # --- UTILITY METHODS ---

    def _check_ollama(self):
        """Check if Ollama service is running."""
        try:
            import socket
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(1)
            result = s.connect_ex(('127.0.0.1', 11434))
            s.close()
            return result == 0
        except:
            return False

    def _load_config(self):
        """Load configuration from file."""
        default_config = {
            'wakeWord': 'jarvis',
            'voiceModel': 'piper-en-us-libritts-high',
            'smartThingsApiKey': '',
            'selectedSpeaker': '',
            'theme': 'dark',
            'primaryColor': '#00D9FF',
            'notificationsEnabled': True,
        }
        
        if os.path.exists(CONFIG_FILE):
            try:
                with open(CONFIG_FILE, 'r') as f:
                    config = json.load(f)
                    # Merge with defaults
                    default_config.update(config)
                    return default_config
            except:
                pass
        
        return default_config

    def _load_devices(self):
        """Load SmartThings devices from file."""
        if os.path.exists(DEVICES_FILE):
            try:
                with open(DEVICES_FILE, 'r') as f:
                    return json.load(f)
            except:
                pass
        
        return {}

    def _send_json(self, data):
        """Send JSON response."""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def _send_error(self, code, message):
        """Send error response."""
        self.send_response(code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({'error': message}).encode('utf-8'))

    def log_message(self, format, *args):
        """Suppress default logging."""
        pass


def run_server(host='0.0.0.0', port=8000):
    """Start the Jarvis backend HTTP server."""
    server_address = (host, port)
    httpd = HTTPServer(server_address, JarvisBackendHandler)
    
    print(f"""
╔════════════════════════════════════════════╗
║     Jarvis Termux Backend Server           ║
║     Running on http://{host}:{port}       ║
╚════════════════════════════════════════════╝
    """)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        httpd.shutdown()


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Jarvis Termux Backend Server')
    parser.add_argument('--host', default='0.0.0.0', help='Server host (default: 0.0.0.0)')
    parser.add_argument('--port', type=int, default=8000, help='Server port (default: 8000)')
    
    args = parser.parse_args()
    
    run_server(args.host, args.port)
