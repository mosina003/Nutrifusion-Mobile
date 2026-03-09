import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
      <Text style={styles.logo}>NutriFusion</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onLogoutPress}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={24} color="#ef4444" />
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
    paddingTop: 29,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
