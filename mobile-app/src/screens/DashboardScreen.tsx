import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getDashboardData } from '../services/api';
import {
  DashboardHeader,
  WelcomeSection,
  SummaryCards,
  HealthScoreCard,
  RecommendationsSection,
  QuickActions,
} from '../components/dashboard';

interface DashboardData {
  summary?: {
    currentWeight?: number;
    goalWeight?: number;
    bmi?: number;
    calorieTarget?: number;
  };
  todaysMeals?: any[];
  recommendations?: string[];
  healthScore?: number;
}

const DashboardScreen = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default empty data to prevent crashes
      setDashboardData({
        summary: {},
        todaysMeals: [],
        recommendations: [],
        healthScore: 0,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout, style: 'destructive' },
    ]);
  };

  const handleNotifications = () => {
    Alert.alert('Notifications', 'No new notifications');
  };

  const handleSettings = () => {
    Alert.alert('Settings', 'Settings screen coming soon');
  };

  const handleAssessment = () => {
    Alert.alert('Assessment', 'Navigate to assessment');
  };

  const handleDietPlan = () => {
    Alert.alert('Diet Plan', 'Navigate to diet plan');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <DashboardHeader
          onNotificationPress={handleNotifications}
          onSettingsPress={handleSettings}
          onLogoutPress={handleLogout}
        />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0891b2']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <WelcomeSection userName={user?.name} userEmail={user?.email} />

        <SummaryCards
          currentWeight={dashboardData?.summary?.currentWeight}
          goalWeight={dashboardData?.summary?.goalWeight}
          bmi={dashboardData?.summary?.bmi}
          calorieTarget={dashboardData?.summary?.calorieTarget}
        />

        <HealthScoreCard score={dashboardData?.healthScore || 75} />

        <RecommendationsSection
          recommendations={dashboardData?.recommendations || []}
        />

        <QuickActions
          onAssessmentPress={handleAssessment}
          onDietPlanPress={handleDietPlan}
        />
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
});

export default DashboardScreen;
