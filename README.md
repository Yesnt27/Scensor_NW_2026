# Scensor - React Native App with Firebase

Simple React Native app that connects directly to Firebase Realtime Database to display sensor data.

## Architecture

```
ESP32 → Firebase Realtime Database → React Native App
```

No backend server needed! ESP32 writes directly to Firebase, and the app reads from Firebase in real-time.

## Setup

1. **Install dependencies:**
   ```bash
   cd mobile
   npm install
   ```

2. **Configure Firebase:**
   - Update `mobile/config/firebase.js` with your Firebase credentials
   - Enable Realtime Database in Firebase Console

3. **Run the app:**
   ```bash
   npm start
   # Press 'w' for web
   ```

## Firebase Data Structure

Your ESP32 should write data to:
```
sensor/value: 81
```

Or with unit:
```
sensor/
  value: 81
  unit: "ppi"
```

## Features

- ✅ Direct Firebase connection (no backend needed)
- ✅ Real-time sensor data display
- ✅ Custom font support
- ✅ Beautiful gradient design
- ✅ Web-ready for MVP testing

## Project Structure

```
mobile/
├── App.js                    # Entry point
├── components/               # React components
│   ├── SensorScreen.js      # Main screen
│   ├── SensorCircle.js      # Green circle display
│   ├── CloudButton.js       # Bottom button
│   └── BottomGradient.js    # Gradient effect
├── config/
│   ├── firebase.js          # Firebase configuration
│   └── fonts.js             # Font configuration
└── styles/                   # Style files
```

## ESP32 Integration

Your ESP32 can write directly to Firebase using the Firebase REST API or Firebase SDK. No Node.js server required!
To run the vocUpload code you need to have a esp32, and an sgp40. 
To run the code you will need a config.h defined with the following:

```
#ifndef CONFIG_H
#define CONFIG_H

#define WIFI_SSID "wifi name"
#define WIFI_PASSWORD "wifi name"
#define FIREBASE_HOST "firebase host name"
#define FIREBASE_AUTH "firebase secret"

#endif
```

This file will need to be in the vocUpload Folder
