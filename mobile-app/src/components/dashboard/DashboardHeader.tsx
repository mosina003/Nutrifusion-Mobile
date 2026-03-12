import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Try to load the logo, with a fallback
let logoImage: ImageSourcePropType | undefined;
try {
  logoImage = require('../../../assets/logo.png');
} catch (e) {
  console.log('Logo not found:', e);
}

interface DashboardHeaderProps {
  onNotificationPress: () => void;
  onSettingsPress: () => void;
  onLogoutPress: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onNotificationPress,
  onSettingsPress,
  onLogoutPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {logoImage ? (
          <Image 
            source={logoImage} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.logoImage, styles.logoPlaceholder]}>
            <Ionicons name="nutrition" size={20} color="#0891b2" />
          </View>
        )}
        <Text style={styles.logo}>NutriFusion</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLogoutPress}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  logoImage: {
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
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0891b2',
    letterSpacing: 0.5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 6,
  },
});

export default DashboardHeader;
