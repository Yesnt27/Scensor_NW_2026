# Scensor_NW_2026

## 📦 What to Download/Install (Mac)

### 1. Node.js (Required)
**Download:** [nodejs.org](https://nodejs.org/) - Get the LTS version

**Or install via Homebrew:**
```bash
brew install node
```

**Verify installation:**
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

That's it! Node.js includes npm (package manager).

---

## 🚀 How to Run the Website

### Step 1: Install Dependencies

**For the Mobile App (Website):**
```bash
cd mobile
npm install
```

**For the Server (if running ESP32):**
```bash
cd server
npm install
```

### Step 2: Run the Website

```bash
cd mobile
npm start
```

This will:
- Start the Expo development server
- Show a QR code in your terminal
- Open options to run on different platforms

**To open in web browser:**
- Press `w` in the terminal
- Or wait for it to automatically open in your browser
- Website will be at: `http://localhost:8081` (or similar)

### Step 3: (Optional) Run the Server

If you're connecting ESP32, run the server in a **separate terminal**:

```bash
cd server
npm start
```

Server runs on port 8080.

---

## 📋 Quick Start Checklist

1. ✅ Install Node.js
2. ✅ `cd mobile && npm install`
3. ✅ `npm start` then press `w`
4. ✅ Website opens in browser!

---

## 🎯 Project Structure

```
Scensor_NW_2026/
├── mobile/          # React Native app (your website)
│   ├── App.js      # Main UI file - edit this!
│   └── config/
│       └── firebase.js  # Add your API key here
└── server/         # Node.js WebSocket server (for ESP32)
    └── server.js   # WebSocket server
```

---

## 🔧 Troubleshooting

**"command not found: npm"**
- Install Node.js first (see above)

**Port already in use:**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9
```

**"Cannot find module"**
```bash
# Delete and reinstall
rm -rf node_modules
npm install
```

---

## 📱 Running on Different Platforms

After `npm start`:
- Press `w` - Web browser
- Press `i` - iOS Simulator (requires Xcode)
- Press `a` - Android Emulator (requires Android Studio)

For now, just use **`w` for web** - easiest!
