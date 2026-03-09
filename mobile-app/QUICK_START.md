# NutriFusion Mobile - Quick Start Guide

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Backend Connection

Edit `src/services/api.ts` and update the API_BASE_URL:

**For Testing on Same Machine (Emulator):**
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

**For Testing on Physical Device:**
```typescript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000/api';
```

To find your IP address:
- **Windows**: Open Command Prompt and run `ipconfig`
- **macOS/Linux**: Open Terminal and run `ifconfig` or `ip addr`

### 3. Ensure Backend is Running

Make sure the NutriFusion backend server is running:

```bash
cd ../backend
npm start
```

The backend should be running on `http://localhost:5000`

### 4. Start the Expo Development Server

```bash
npm start
```

### 5. Test the App

**Option A: Physical Device (Recommended)**
1. Install Expo Go app from App Store or Play Store
2. Scan the QR code with your camera (iOS) or Expo Go app (Android)
3. Wait for the app to load

**Option B: Emulator/Simulator**
- **Android**: Press `a` in the terminal or run `npm run android`
- **iOS** (macOS only): Press `i` in the terminal or run `npm run ios`

## Test Credentials

You can register a new account or use test credentials if available in your backend.

## Common Issues & Solutions

### Issue: Cannot connect to backend
**Solution**: 
- Make sure backend is running
- Update API_BASE_URL to use your IP address (not localhost) when testing on physical device
- Ensure device and computer are on same Wi-Fi network

### Issue: "Unable to resolve module"
**Solution**: 
```bash
rm -rf node_modules
npm install
expo start -c
```

### Issue: Port already in use
**Solution**: 
```bash
expo start --port 8082
```

## Development Tips

1. **Hot Reload**: The app automatically reloads when you save changes
2. **Debug Menu**: Shake your device or press `Ctrl+M` (Android) / `Cmd+D` (iOS) to open debug menu
3. **Console Logs**: View logs in the terminal where you ran `npm start`
4. **Network Requests**: Enable Network Inspector in debug menu to see API calls

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure backend URL
3. ✅ Start backend server
4. ✅ Start Expo dev server
5. ✅ Test on device/emulator
6. 🚀 Start developing!

## Need Help?

- Read the full [README.md](./README.md)
- Check [Backend API Documentation](../backend/API_DOCUMENTATION.md)
- Review [Project Summary](../PROJECT_SUMMARY.md)

---

Happy coding! 🎉
