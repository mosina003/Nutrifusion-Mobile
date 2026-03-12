import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text as RNText,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile, deleteAccount } from '../services/api';
import {
  ProfileHeader,
  HealthIntelligence,
  ClinicalMetrics,
  LifestyleIndicators,
  DietaryProfile,
  DangerZone,
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
  // Dietary Profile
  preferences?: string[];
  restrictions?: string[];
  healthConditions?: string[];
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
      
      console.log('📊 Profile Data from API:', {
        name: data.name,
        email: data.email,
        preferredMedicalFramework: data.preferredMedicalFramework,
        hasCompletedAssessment: data.hasCompletedAssessment,
      });
      
      // Calculate profile completion percentage
      const completionFields = [
        'name', 'email', 'age', 'gender', 'height', 'weight',
        'dietaryPreference', 'hasCompletedAssessment',
      ];
      const completedFields = completionFields.filter(field => data[field]);
      const completion = Math.round((completedFields.length / completionFields.length) * 100);
      
      const profileData = {
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
        preferences: ['Vegetarian'],
        restrictions: ['apple'],
        healthConditions: ['thyroid'],
      };
      
      console.log('✅ Setting profile with framework:', profileData.preferredMedicalFramework);
      setProfile(profileData);
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      // Set default profile from user context
      const defaultProfile: ProfileData = {
        name: user?.name || '',
        email: user?.email || '',
        hasCompletedAssessment: user?.hasCompletedAssessment,
        preferredMedicalFramework: user?.preferredMedicalFramework || 'Ayurveda',
        profileCompletion: 50,
        // Mock Ayurveda data for demonstration
        primaryDosha: 'vata',
        primaryDoshaPercentage: 39,
        secondaryDosha: 'pitta',
        secondaryDoshaPercentage: 39,
        agniType: 'Sama Agni',
        agniStatus: 'Balanced',
        currentState: 'pitta',
        currentStateStatus: 'Imbalanced',
        // Mock lifestyle data
        sleepQuality: 'Good',
        stressLevel: 'Medium',
        activityLevel: 'Sedentary',
        hydration: 'Unknown',
        appetite: 'Normal',
        // Mock dietary data
        preferences: ['Vegetarian'],
        restrictions: ['apple'],
        healthConditions: ['thyroid'],
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
      await deleteAccount();
      await logout();
      Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
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
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
      </SafeAreaView>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Fixed Profile Header */}
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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0891b2']} />
          }
        >
        {/* Title and Profile Card */}
        <View style={styles.profileSection}>
          <RNText style={styles.title}>Health Profile</RNText>
          <RNText style={styles.subtitle}>Comprehensive health intelligence and analytics</RNText>

          {/* Profile Summary Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileMain}>
              <View style={styles.avatarContainer}>
                <RNText style={styles.avatarText}>{profile.name?.charAt(0).toUpperCase() || 'U'}</RNText>
                <View style={styles.onlineIndicator} />
              </View>
              
              <View style={styles.profileInfo}>
                <RNText style={styles.name}>{profile.name}</RNText>
                <View style={styles.metaRow}>
                  {profile.age && <RNText style={styles.metaText}>{profile.age} years</RNText>}
                  {profile.age && profile.preferredMedicalFramework && <RNText style={styles.metaDivider}>•</RNText>}
                  {profile.preferredMedicalFramework && <RNText style={styles.metaText}>{profile.preferredMedicalFramework}</RNText>}
                </View>
              </View>
            </View>
            
            {/* Profile Completion */}
            <View style={styles.completionContainer}>
              <View style={styles.completionHeader}>
                <RNText style={styles.completionLabel}>PROFILE COMPLETION</RNText>
                <RNText style={styles.completionValue}>{profile.profileCompletion || 0}%</RNText>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${profile.profileCompletion || 0}%` }]} />
              </View>
            </View>
          </View>
        </View>

      {/* Health Intelligence Summary - Always show with mock data for now */}
      {(() => {
        console.log('🚀 About to render HealthIntelligence with props:', {
          primaryDosha: profile.primaryDosha || 'vata',
          agniType: profile.agniType || 'Sama Agni',
          currentState: profile.currentState || 'pitta',
        });
        return true;
      })() && (
        <HealthIntelligence
          framework="AYURVEDA"
          primaryDosha={profile.primaryDosha || 'vata'}
          primaryDoshaPercentage={profile.primaryDoshaPercentage || 39}
          secondaryDosha={profile.secondaryDosha || 'pitta'}
          secondaryDoshaPercentage={profile.secondaryDoshaPercentage || 39}
          agniType={profile.agniType || 'Sama Agni'}
          agniStatus={profile.agniStatus || 'Balanced'}
          currentState={profile.currentState || 'pitta'}
          currentStateStatus={profile.currentStateStatus || 'Imbalanced'}
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

      {/* Dietary Profile */}
      <DietaryProfile
        preferences={profile.preferences}
        restrictions={profile.restrictions}
        healthConditions={profile.healthConditions}
      />

      {/* Danger Zone */}
      <DangerZone onDeleteAccount={handleDeleteAccount} />

      {/* Footer Spacer */}
      <View style={{ height: 40 }} />
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
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  profileSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileMain: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    position: 'relative',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#475569',
  },
  metaDivider: {
    fontSize: 13,
    color: '#cbd5e1',
    marginHorizontal: 6,
  },
  completionContainer: {
    marginTop: 4,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  completionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
});

export default ProfileScreen;
