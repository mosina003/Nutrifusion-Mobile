# Development Notes

## Project Architecture

### Navigation Flow

```
App.tsx
  └── AuthProvider (Context)
      └── NavigationContainer
          └── AppNavigator
              ├── Not Authenticated
              │   ├── LoginScreen
              │   └── RegisterScreen
              └── Authenticated
                  └── MainTabNavigator (Bottom Tabs)
                      ├── Dashboard
                      ├── Assessment
                      ├── DietPlan
                      └── Profile
```

### State Management

**AuthContext** manages:
- Current user data
- Authentication status
- Loading state
- Login/logout functions

**Local Component State** manages:
- Form inputs
- Loading states
- Modal visibility
- API data

### API Service Architecture

**Axios Instance** with:
- Base URL configuration
- Request interceptor (adds JWT token)
- Response interceptor (handles 401 errors)
- Centralized error handling

**AsyncStorage** for:
- JWT token persistence
- User data caching

## Code Organization

### Screens
Each screen is self-contained with:
- State management
- API calls
- UI rendering
- Error handling

### Services
- `api.ts` - All API functions and configuration
- Token management utilities
- Generic request handler

### Context
- `AuthContext.tsx` - Global authentication state
- User session management

### Navigation
- `AppNavigator.tsx` - Navigation structure
- Conditional rendering based on auth state

## Styling Approach

**Design System**:
- Colors: Teal/Blue primary (#0891b2), Slate grays
- Border Radius: 12-16px for cards
- Spacing: 20px base, 8px increments
- Typography: Bold headers, regular body text

**Component Patterns**:
- Cards for content grouping
- Gradient backgrounds for visual appeal
- Emoji icons for quick recognition
- Consistent padding and margins

## API Response Handling

**Success Flow**:
```typescript
try {
  const data = await apiFunction();
  setData(data);
} catch (error) {
  Alert.alert('Error', error.message);
}
```

**Error Types**:
- Network errors (no connection)
- API errors (4xx, 5xx)
- Validation errors
- Authentication errors (401)

## TypeScript Types

**Key Interfaces**:
- User
- ProfileData
- DietPlan
- Meal
- Framework
- ApiResponse
- AuthResponse

## Best Practices Implemented

1. **Error Handling**: Try-catch blocks with user feedback
2. **Loading States**: Show ActivityIndicator during async operations
3. **Type Safety**: TypeScript interfaces for all data structures
4. **Code Reusability**: Shared API service and auth context
5. **User Feedback**: Alerts and loading indicators
6. **Clean Code**: Consistent naming and structure
7. **Security**: Token-based auth with secure storage

## Common Development Tasks

### Adding a New Screen

1. Create screen file in `src/screens/`
2. Add screen to navigator in `AppNavigator.tsx`
3. Add API functions if needed in `api.ts`
4. Update types as needed

### Adding a New API Endpoint

1. Add function to `src/services/api.ts`
2. Define TypeScript types
3. Handle errors appropriately
4. Update calling component

### Modifying Navigation

1. Update type definitions in `AppNavigator.tsx`
2. Add/modify screens in navigator
3. Update tab bar configuration if needed

## Testing Tips

### Local Testing
- Use `localhost` for emulator
- Use IP address for physical device
- Keep backend running during tests

### Debugging
- Use React DevTools
- Check network tab in debug menu
- View console logs in terminal
- Use Chrome DevTools for deeper debugging

### Common Issues
- Token expiration: Re-login required
- Network errors: Check API URL and connection
- State not updating: Verify Context usage
- Navigation issues: Check auth state

## Performance Considerations

**Current Performance**:
- Fast navigation with native stack
- Efficient re-renders with Context API
- Lazy loading of screens
- Optimized images and assets

**Future Optimizations**:
- Add React.memo for expensive components
- Implement FlatList for long lists
- Add image caching
- Reduce bundle size
- Add code splitting

## Security Notes

**Current Security**:
- JWT tokens stored in AsyncStorage
- HTTPS should be used in production
- No sensitive data in source code
- Token included in all authenticated requests

**Production Considerations**:
- Enable HTTPS
- Add token refresh mechanism
- Implement biometric auth
- Add request rate limiting
- Validate all user inputs

## Environment-Specific Configuration

**Development**:
- API_BASE_URL: `http://localhost:5000/api`
- Debug mode enabled
- Hot reload active

**Production** (Future):
- API_BASE_URL: Production server URL
- Debug mode disabled
- Error reporting service
- Analytics integration

## Dependencies Overview

**Core**:
- `expo` - Development framework
- `react` - UI library
- `react-native` - Native components

**Navigation**:
- `@react-navigation/native` - Navigation library
- `@react-navigation/native-stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Tab navigator

**API & Storage**:
- `axios` - HTTP client
- `@react-native-async-storage/async-storage` - Persistent storage

**Development**:
- `typescript` - Type safety
- `@types/react` - React types

## Future Development Roadmap

### Phase 1 - Core Improvements
- [ ] Add custom app icon and splash screen
- [ ] Implement proper error boundaries
- [ ] Add loading skeleton screens
- [ ] Improve form validation

### Phase 2 - Feature Enhancements
- [ ] Push notifications
- [ ] Meal logging
- [ ] Progress tracking
- [ ] Recipe search

### Phase 3 - UX Improvements
- [ ] Dark mode
- [ ] Animations and transitions
- [ ] Biometric authentication
- [ ] Offline mode

### Phase 4 - Advanced Features
- [ ] Social features
- [ ] AI recommendations
- [ ] Wearable integration
- [ ] Multi-language support

## Resources

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [React Navigation Docs](https://reactnavigation.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Axios Docs](https://axios-http.com/)

---

**Last Updated**: Generated on initial setup
