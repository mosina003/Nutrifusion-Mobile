import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileHeaderProps {
  name: string;
  age?: number;
  framework?: string;
  profileCompletion: number;
  bmi?: number;
  bmiCategory?: string;
  dailyTarget?: number;
  riskLevel?: string;
  onDashboard?: () => void;
  onViewResult?: () => void;
  onExportPDF?: () => void;
  onEditProfile?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  age,
  framework = 'Ayurveda Framework',
  profileCompletion,
  bmi,
  bmiCategory,
  dailyTarget,
  riskLevel = 'Moderate',
  onDashboard,
  onViewResult,
  onExportPDF,
  onEditProfile,
}) => {
  const getInitial = () => name?.charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Health Profile</Text>
      <Text style={styles.subtitle}>Comprehensive health intelligence and analytics</Text>

      {/* Profile Info Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileMain}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitial()}</Text>
            <View style={styles.onlineIndicator} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.metaRow}>
              {age && <Text style={styles.metaText}>{age} years</Text>}
              {age && framework && <Text style={styles.metaDivider}>•</Text>}
              {framework && <Text style={styles.metaText}>{framework}</Text>}
            </View>
            
            {/* Profile Completion */}
            <View style={styles.completionContainer}>
              <Text style={styles.completionLabel}>PROFILE COMPLETION</Text>
              <Text style={styles.completionValue}>{profileCompletion}%</Text>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${profileCompletion}%` }]} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  },
  profileMain: {
    flexDirection: 'row',
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
    marginBottom: 12,
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
  completionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  completionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
});
