import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AnalyticsHistoryProps {
  currentStreak?: number;
  compliance?: number;
  daysTracked?: number;
  dietPlans?: number;
}

export const AnalyticsHistory: React.FC<AnalyticsHistoryProps> = ({
  currentStreak = 0,
  compliance = 0,
  daysTracked = 0,
  dietPlans = 0,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Analytics & History</Text>

      <View style={styles.grid}>
        {/* Current Streak */}
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={20} color="#0891b2" />
          </View>
          <Text style={styles.statLabel}>CURRENT STREAK</Text>
          <Text style={styles.statValue}>{currentStreak} days</Text>
        </View>

        {/* Compliance */}
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          </View>
          <Text style={styles.statLabel}>COMPLIANCE</Text>
          <Text style={styles.statValue}>{compliance}%</Text>
        </View>

        {/* Days Tracked */}
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="trending-up" size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.statLabel}>DAYS TRACKED</Text>
          <Text style={styles.statValue}>{daysTracked}</Text>
        </View>

        {/* Diet Plans */}
        <View style={styles.statCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="nutrition" size={20} color="#f59e0b" />
          </View>
          <Text style={styles.statLabel}>DIET PLANS</Text>
          <Text style={styles.statValue}>{dietPlans}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
