import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Try to load the logo, with a fallback
let logoImage: ImageSourcePropType | undefined;
try {
  logoImage = require('../../../assets/logo.png');
} catch (e) {
  console.log('Logo not found:', e);
}

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
  framework = 'Ayurvedic Framework',
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
    <View style={styles.appHeader}>
      <View style={styles.logoContainer}>
        {logoImage ? (
          <Image 
            source={logoImage} 
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Ionicons name="nutrition" size={24} color="#0891b2" />
          </View>
        )}
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity 
          style={styles.viewResultButton} 
          onPress={onViewResult}
        >
          <Ionicons name="share-outline" size={16} color="#0891b2" />
          <Text style={styles.viewResultText}>Report</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.exportButton} 
          onPress={onEditProfile}
        >
          <Ionicons name="create-outline" size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  logoPlaceholder: {
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewResultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewResultText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0891b2',
  },
  exportButton: {
    width: 36,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
});

export default ProfileHeader;
