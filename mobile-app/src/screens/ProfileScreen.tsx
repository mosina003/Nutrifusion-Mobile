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
import { getCompleteProfile, getAssessmentHistory, updateMyProfile, deleteAccount } from '../services/api';
import {
  ProfileHeader,
  HealthIntelligence,
  ClinicalMetrics,
  LifestyleIndicators,
  DietaryProfile,
  AnalyticsHistory,
  DangerZone,
  EditProfileModal,
  AssessmentResultModal,
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
  riskLevel?: string;
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
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [latestAssessment, setLatestAssessment] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getCompleteProfile();
      console.log('📊 Complete Profile from API:', {
        name: data.identity?.name,
        framework: data.identity?.activeFramework,
        hasCompletedAssessment: data.hasCompletedAssessment,
      });

      const ayurveda = data.healthIntelligence?.ayurveda;
      const primaryDosha: string | undefined = ayurveda?.primaryDosha || undefined;
      const secondaryDosha: string | undefined = ayurveda?.secondaryDosha || undefined;
      const doshaPercentages = ayurveda?.percentages || {};
      const agniName: string = ayurveda?.agniName || ayurveda?.agniType || '';
      const agniStatus: string | undefined = agniName
        ? agniName.toLowerCase().includes('sama') ? 'Balanced' : 'Imbalanced'
        : undefined;

      const profileData: ProfileData = {
        // Identity
        name: data.identity?.name || user?.name || '',
        email: data.identity?.email || user?.email || '',
        age: data.identity?.age,
        gender: data.identity?.gender,
        preferredMedicalFramework: data.identity?.activeFramework || user?.preferredMedicalFramework,
        profileCompletion: data.identity?.profileCompletion || 0,
        hasCompletedAssessment: data.hasCompletedAssessment,
        riskLevel: data.kpi?.riskLevel,

        // Clinical metrics
        height: data.clinicalMetrics?.anthropometric?.height,
        weight: data.clinicalMetrics?.anthropometric?.weight,
        bmi: data.kpi?.bmi || data.clinicalMetrics?.anthropometric?.bmi,
        bmr: data.clinicalMetrics?.anthropometric?.bmr,
        tdee: data.kpi?.calorieTarget || data.clinicalMetrics?.anthropometric?.tdee,
        waist: data.clinicalMetrics?.anthropometric?.waist,
        bloodPressure: data.clinicalMetrics?.metabolic?.bloodPressure,
        bloodSugar: data.clinicalMetrics?.metabolic?.bloodSugar,
        cholesterol: data.clinicalMetrics?.metabolic?.cholesterol,

        // Ayurveda health intelligence
        primaryDosha,
        primaryDoshaPercentage: primaryDosha ? (doshaPercentages[primaryDosha.toLowerCase()] || undefined) : undefined,
        secondaryDosha,
        secondaryDoshaPercentage: secondaryDosha ? (doshaPercentages[secondaryDosha.toLowerCase()] || undefined) : undefined,
        agniType: agniName || undefined,
        agniStatus,
        currentState: ayurveda?.currentDosha || undefined,
        currentStateStatus: ayurveda?.imbalanceSeverity || undefined,

        // Lifestyle
        sleepQuality: data.lifestyleIndicators?.sleepQuality,
        stressLevel: data.lifestyleIndicators?.stressLevel,
        activityLevel: data.lifestyleIndicators?.activityLevel,
        hydration: data.lifestyleIndicators?.hydrationLevel,
        appetite: data.lifestyleIndicators?.appetite,

        // Dietary
        preferences: data.dietaryInfo?.preferences?.filter(Boolean) || [],
        restrictions: data.dietaryInfo?.restrictions || [],
        healthConditions: data.dietaryInfo?.chronicConditions || [],

        // Analytics
        currentStreak: data.analytics?.currentStreak,
        compliance: data.analytics?.complianceScore,
        daysTracked: data.analytics?.totalDaysTracked,
        dietPlansCount: data.analytics?.dietPlansCount,
      };

      console.log('✅ Profile loaded - framework:', profileData.preferredMedicalFramework);
      setProfile(profileData);
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
      setProfile({
        name: user?.name || '',
        email: user?.email || '',
        hasCompletedAssessment: user?.hasCompletedAssessment,
        preferredMedicalFramework: user?.preferredMedicalFramework || 'Ayurveda',
        profileCompletion: 0,
      });
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
    setIsEditModalVisible(true);
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

  const handleViewResult = async () => {
    if (reportLoading) return;

    try {
      setReportLoading(true);
      const response = await getAssessmentHistory();
      const assessments = response?.assessments || [];

      if (!assessments.length) {
        Alert.alert('No Result Found', 'No assessment result is available yet.');
        return;
      }

      setLatestAssessment(assessments[0]);
      setIsReportModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load assessment result');
    } finally {
      setReportLoading(false);
    }
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
    return profile.riskLevel || 'Moderate';
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

      {/* Health Intelligence - Only shown when framework data is available */}
      {profile.primaryDosha && (
        <HealthIntelligence
          framework={(profile.preferredMedicalFramework || 'Ayurveda').toUpperCase()}
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

      {/* Dietary Profile */}
      <DietaryProfile
        preferences={profile.preferences}
        restrictions={profile.restrictions}
        healthConditions={profile.healthConditions}
      />

      {/* Analytics & History */}
      <AnalyticsHistory
        currentStreak={profile.currentStreak}
        compliance={profile.compliance}
        daysTracked={profile.daysTracked}
        dietPlans={profile.dietPlansCount}
      />

      {/* Danger Zone */}
      <DangerZone onDeleteAccount={handleDeleteAccount} />

      {/* Footer Spacer */}
      <View style={{ height: 40 }} />
      </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        currentData={profile}
        onSave={() => {
          fetchProfile();
          setIsEditModalVisible(false);
        }}
      />

      <AssessmentResultModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        assessment={latestAssessment}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
