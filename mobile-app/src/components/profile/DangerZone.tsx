import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DangerZoneProps {
  onDeleteAccount?: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onDeleteAccount }) => {
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.\n\n• All health profiles and assessments will be deleted\n• Diet plans and meal tracking history will be removed\n• Progress analytics and reports will be lost',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: onDeleteAccount,
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Danger Zone Header */}
      <View style={styles.dangerHeader}>
        <Ionicons name="warning" size={20} color="#dc2626" />
        <Text style={styles.dangerTitle}>Danger Zone</Text>
      </View>
      <Text style={styles.dangerSubtitle}>Irreversible account actions</Text>

      {/* Delete Account Card */}
      <View style={styles.dangerCard}>
        <View style={styles.deleteInfo}>
          <Text style={styles.deleteTitle}>Delete Account</Text>
          <Text style={styles.deleteDescription}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
          
          <View style={styles.warningList}>
            <View style={styles.warningItem}>
              <Text style={styles.warningBullet}>•</Text>
              <Text style={styles.warningText}>
                All health profiles and assessments will be deleted
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningBullet}>•</Text>
              <Text style={styles.warningText}>
                Diet plans and meal tracking history will be removed
              </Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningBullet}>•</Text>
              <Text style={styles.warningText}>
                Progress analytics and reports will be lost
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Ionicons name="trash" size={18} color="#ffffff" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  dangerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dangerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  dangerSubtitle: {
    fontSize: 13,
    color: '#dc2626',
    marginBottom: 16,
  },
  dangerCard: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  deleteInfo: {
    marginBottom: 20,
  },
  deleteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
    marginBottom: 8,
  },
  deleteDescription: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 12,
    lineHeight: 20,
  },
  warningList: {
    gap: 6,
  },
  warningItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  warningBullet: {
    fontSize: 14,
    color: '#991b1b',
    marginRight: 8,
  },
  warningText: {
    fontSize: 12,
    color: '#7f1d1d',
    flex: 1,
    lineHeight: 18,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
