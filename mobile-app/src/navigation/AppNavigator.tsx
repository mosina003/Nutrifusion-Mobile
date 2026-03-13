import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AssessmentScreen from '../screens/AssessmentScreen';
import YogaSessionScreen from '../screens/YogaSessionScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Welcome: undefined;
  Assessment: { showLatestResult?: boolean } | undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  YogaSession: undefined;
  DietPlan: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Tab Navigator Component
const MainTabNavigator = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Navigation will happen automatically via AuthContext
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0891b2',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: '#ffffff',
          borderRadius: 20,
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            android: {
              elevation: 6,
            },
          }),
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tab.Screen
        name="YogaSession"
        component={YogaSessionScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'body' : 'body-outline'} 
              size={24} 
              color={color} 
            />
          ),
          tabBarLabel: 'Yoga Session',
        }}
      />
      <Tab.Screen
        name="DietPlan"
        component={DietPlanScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'restaurant' : 'restaurant-outline'} 
              size={24} 
              color={color} 
            />
          ),
          tabBarLabel: 'Diet Plan',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          {!user?.hasCompletedAssessment ? (
            <>
              <Stack.Screen 
                name="Welcome" 
                component={WelcomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen 
                name="Assessment" 
                component={AssessmentScreen}
                options={{
                  headerShown: true,
                  headerTitle: 'Complete Your Assessment',
                  headerStyle: {
                    backgroundColor: '#ffffff',
                  },
                  headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 20,
                    color: '#0f172a',
                  },
                }}
              />
            </>
          ) : null}
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
