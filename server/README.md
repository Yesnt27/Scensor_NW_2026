# Scensor Server

Simple Node.js WebSocket server that receives one-line JSON from ESP32 and forwards to Firebase.

## Setup

```bash
cd server
npm install
npm start
```

Server runs on port 8080.

## ESP32 Connection

Connect to: `ws://YOUR_SERVER_IP:8080`

Send one-line JSON per reading:
```json
{"deviceId":"esp32_001","temperature":25.5,"humidity":60}
```

The server adds a timestamp and saves to Firebase at:
```
devices/{deviceId}/data
```

## Firebase Structure

```
devices/
  {deviceId}/
    data/          # Latest sensor reading
    info/          # Device status (online/offline, lastUpdate)
```


