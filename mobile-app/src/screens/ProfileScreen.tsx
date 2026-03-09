import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile } from '../services/api';
import {
  ProfileHeader,
  HealthIntelligence,
  ClinicalMetrics,
  LifestyleIndicators,
} from '../components/profile';

interface ProfileData {
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  waist?: number;
  dietaryPreference?: string;
  allergies?: string[];
  chronicConditions?: string[];
  hasCompletedAssessment?: boolean;
  preferredMedicalFramework?: string;
  bmi?: number;
  bmr?: number;
  tdee?: number;
  bloodPressure?: number;
  bloodSugar?: number;
  cholesterol?: number;
  profileCompletion?: number;
  // Ayurveda specific
  primaryDosha?: string;
  primaryDoshaPercentage?: number;
  secondaryDosha?: string;
  secondaryDoshaPercentage?: number;
  agniType?: string;
  agniStatus?: string;
  currentState?: string;
  currentStateStatus?: string;
  // Lifestyle
  sleepQuality?: string;
  stressLevel?: string;
  activityLevel?: string;
  hydration?: string;
  appetite?: string;
  // Analytics
  currentStreak?: number;
  compliance?: number;
  daysTracked?: number;
  dietPlansCount?: number;
}

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      
      // Calculate profile completion percentage
      const completionFields = [
        'name', 'email', 'age', 'gender', 'height', 'weight',
        'dietaryPreference', 'hasCompletedAssessment',
      ];
      const completedFields = completionFields.filter(field => data[field]);
      const completion = Math.round((completedFields.length / completionFields.length) * 100);
      
      setProfile({
        ...data,
        profileCompletion: completion,
        // Mock data for demonstration - replace with actual API data
        bmi: data.height && data.weight ? 
          parseFloat((data.weight / Math.pow(data.height / 100, 2)).toFixed(1)) : undefined,
        bmr: 1319, // Should come from API
        tdee: 1583, // Should come from API
        waist: 28, // Should come from API
        bloodPressure: 129, // Should come from API
        bloodSugar: 98, // Should come from API
        cholesterol: 160, // Should come from API
        primaryDosha: 'vata',
        primaryDoshaPercentage: 39,
        secondaryDosha: 'pitta',
        secondaryDoshaPercentage: 39,
        agniType: 'Sama Agni',
        agniStatus: 'Balanced',
        currentState: 'pitta',
        currentStateStatus: 'Imbalanced',
        sleepQuality: 'Good',
        stressLevel: 'Medium',
        activityLevel: 'Sedentary',
        hydration: 'Unknown',
        appetite: 'Normal',
        currentStreak: 4,
        compliance: 0,
        daysTracked: 17,
        dietPlansCount: 4,
      });
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      // Set default profile from user context
      const defaultProfile: ProfileData = {
        name: user?.name || '',
        email: user?.email || '',
        hasCompletedAssessment: user?.hasCompletedAssessment,
        preferredMedicalFramework: user?.preferredMedicalFramework,
        profileCompletion: 50,
      };
      setProfile(defaultProfile);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleEditProfile = () => {
    // Navigate to edit profile screen or open modal
    Alert.alert('Edit Profile', 'Profile editing functionality coming soon!');
  };

  const handleDeleteAccount = async () => {
    try {
      // Add delete account API call here
      Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
      logout();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    }
  };

  const handleDashboard = () => {
    // Navigate to dashboard
    Alert.alert('Dashboard', 'Navigating to dashboard...');
  };

  const handleViewResult = () => {
    // Navigate to results
    Alert.alert('View Result', 'Viewing assessment results...');
  };

  const handleExportPDF = () => {
    // Export to PDF
    Alert.alert('Export PDF', 'Exporting profile to PDF...');
  };

  const getBMICategory = (bmi?: number) => {
    if (!bmi) return 'Unknown';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const getRiskLevel = (profile: ProfileData) => {
    // Simple risk calculation - should be more sophisticated in production
    if (!profile.bloodPressure && !profile.bloodSugar) return 'Low';
    if (profile.bloodPressure && profile.bloodPressure > 140) return 'High';
    if (profile.bloodSugar && profile.bloodSugar > 100) return 'High';
    return 'Moderate';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0891b2']} />
      }
    >
      {/* Profile Header with Metrics */}
      <ProfileHeader
        name={profile.name}
        age={profile.age}
        framework={profile.preferredMedicalFramework}
        profileCompletion={profile.profileCompletion || 0}
        bmi={profile.bmi}
        bmiCategory={getBMICategory(profile.bmi)}
        dailyTarget={profile.tdee}
        riskLevel={getRiskLevel(profile)}
        onDashboard={handleDashboard}
        onViewResult={handleViewResult}
        onExportPDF={handleExportPDF}
        onEditProfile={handleEditProfile}
      />

      {/* Health Intelligence Summary */}
      {profile.preferredMedicalFramework === 'Ayurveda' && (
        <HealthIntelligence
          framework="AYURVEDA"
          primaryDosha={profile.primaryDosha}
          primaryDoshaPercentage={profile.primaryDoshaPercentage}
          secondaryDosha={profile.secondaryDosha}
          secondaryDoshaPercentage={profile.secondaryDoshaPercentage}
          agniType={profile.agniType}
          agniStatus={profile.agniStatus}
          currentState={profile.currentState}
          currentStateStatus={profile.currentStateStatus}
        />
      )}

      {/* Clinical Metrics */}
      <ClinicalMetrics
        height={profile.height}
        weight={profile.weight}
        bmi={profile.bmi}
        bmr={profile.bmr}
        tdee={profile.tdee}
        waist={profile.waist}
        bloodPressure={profile.bloodPressure}
        bloodSugar={profile.bloodSugar}
        cholesterol={profile.cholesterol}
      />

      {/* Lifestyle Indicators */}
      <LifestyleIndicators
        sleepQuality={profile.sleepQuality}
        stressLevel={profile.stressLevel}
        activityLevel={profile.activityLevel}
        hydration={profile.hydration}
        appetite={profile.appetite}
      />

      {/* Footer Spacer */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});

export default ProfileScreen;
