# NutriFusion Mobile App

A React Native mobile application built with Expo and TypeScript that connects to the NutriFusion backend API for personalized nutrition and diet planning.

## 📱 Features

- **User Authentication**: Login and registration with JWT token management
- **Dashboard**: View health metrics, recommendations, and quick actions
- **Health Assessment**: Take assessments based on different medical frameworks (Ayurveda, Modern, TCM, Unani)
- **Diet Plans**: View personalized meal plans with detailed nutrition information
- **Profile Management**: Update personal information and health metrics
- **Secure API Integration**: Axios-based API service with AsyncStorage for token persistence

## 🏗️ Tech Stack

- **Framework**: React Native with Expo (~51.0.0)
- **Language**: TypeScript
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)
- **State Management**: React Context API
- **API Client**: Axios
- **Storage**: AsyncStorage
- **UI Components**: Custom components built with React Native primitives

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/client) app on your mobile device (iOS or Android)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd mobile-app
npm install
```

### 2. Configure Backend URL

By default, the app connects to `http://localhost:5000/api`. To change this:

1. Open `src/services/api.ts`
2. Update the `API_BASE_URL` constant:

```typescript
const API_BASE_URL = 'YOUR_BACKEND_URL/api';
```

**Important**: When testing on a physical device, use your computer's IP address instead of `localhost`:
```typescript
const API_BASE_URL = 'http://192.168.1.XXX:5000/api';
```

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server and display a QR code.

### 4. Run on Your Device

**Option 1: Using Expo Go (Recommended for Development)**

1. Install [Expo Go](https://expo.dev/client) on your iOS or Android device
2. Scan the QR code shown in your terminal:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app

**Option 2: Using an Emulator/Simulator**

```bash
# For iOS (macOS only)
npm run ios

# For Android
npm run android
```

## 📁 Project Structure

```
mobile-app/
├── App.tsx                 # Main app entry point
├── index.js               # App registration
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript configuration
└── src/
    ├── context/
    │   └── AuthContext.tsx        # Authentication context
    ├── navigation/
    │   └── AppNavigator.tsx       # Navigation structure
    ├── screens/
    │   ├── LoginScreen.tsx        # Login page
    │   ├── RegisterScreen.tsx     # Registration page
    │   ├── DashboardScreen.tsx    # Main dashboard
    │   ├── AssessmentScreen.tsx   # Health assessment
    │   ├── DietPlanScreen.tsx     # Diet plan viewer
    │   └── ProfileScreen.tsx      # User profile
    └── services/
        └── api.ts                  # API service layer
```

## 🔧 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device (macOS only)
- `npm run web` - Run in web browser

## 🎨 Screens Overview

### Authentication
- **Login**: Email/password authentication with error handling
- **Register**: User registration with validation

### Main App (Bottom Tab Navigation)
- **Dashboard**: Welcome screen with health metrics and quick actions
- **Assessment**: Framework selection and health questionnaires
- **Diet Plan**: Detailed meal plans with calories and guidelines
- **Profile**: User information and settings

## 🔐 Authentication Flow

The app uses JWT tokens for authentication:

1. User logs in with email/password
2. Backend returns a JWT token
3. Token is stored in AsyncStorage
4. All subsequent API requests include the token in the Authorization header
5. Context API manages authentication state globally

## 🌐 API Integration

The app connects to the following backend endpoints:

- `POST /api/auth/login` - User login
- `POST /api/auth/register/user` - User registration
- `GET /api/auth/me` - Get current user
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/dashboard` - Get dashboard data
- `GET /api/assessments/:framework/questions` - Get assessment questions
- `POST /api/assessments/:framework` - Submit assessment
- `GET /api/diet-plans/current` - Get current diet plan

## 🐛 Troubleshooting

### Cannot connect to backend

**Problem**: App shows "Network error" or "Failed to fetch"

**Solutions**:
1. Ensure your backend is running on `http://localhost:5000`
2. If testing on a physical device, update the API_BASE_URL to use your computer's IP address
3. Check that your device and computer are on the same Wi-Fi network
4. Verify firewall settings allow incoming connections

### Expo Go app crashes

**Solutions**:
1. Clear Expo cache: `expo start -c`
2. Reinstall node_modules: `rm -rf node_modules && npm install`
3. Update Expo Go app to the latest version

### TypeScript errors

**Solutions**:
1. Ensure all dependencies are installed: `npm install`
2. Check TypeScript version: `npx tsc --version`
3. Restart the TypeScript server in your editor

## 📱 Testing on Physical Device

1. **Connect to the same network**: Ensure your phone and development machine are on the same Wi-Fi network
2. **Update API URL**: Change `localhost` to your machine's IP address in `src/services/api.ts`
3. **Scan QR code**: Use Expo Go to scan the QR code from the terminal
4. **Allow permissions**: Grant necessary permissions when prompted

## 🎯 Future Enhancements

- [ ] Push notifications for meal reminders
- [ ] Offline mode with local data caching
- [ ] Meal logging and tracking
- [ ] Progress charts and analytics
- [ ] Dark mode support
- [ ] Biometric authentication
- [ ] Image upload for profile photos
- [ ] Recipe search and favorites

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the NutriFusion platform.

## 🆘 Support

For issues and questions:
- Check the [Backend API Documentation](../backend/API_DOCUMENTATION.md)
- Review the [Project Summary](../PROJECT_SUMMARY.md)
- Open an issue in the repository

---

**Built with ❤️ using React Native and Expo**
