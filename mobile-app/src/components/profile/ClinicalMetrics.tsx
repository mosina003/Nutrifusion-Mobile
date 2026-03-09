import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ClinicalMetricsProps {
  height?: number;
  weight?: number;
  bmi?: number;
  bmr?: number;
  tdee?: number;
  waist?: number;
  bloodPressure?: number;
  bloodSugar?: number;
  cholesterol?: number;
}

export const ClinicalMetrics: React.FC<ClinicalMetricsProps> = ({
  height,
  weight,
  bmi,
  bmr,
  tdee,
  waist,
  bloodPressure,
  bloodSugar,
  cholesterol,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="clipboard-outline" size={20} color="#0f172a" style={{ marginRight: 8 }} />
        <Text style={styles.sectionTitle}>Clinical Metrics</Text>
      </View>

      <View style={styles.metricsCard}>
        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Height</Text>
            <Text style={styles.metricValue}>{height || '--'} cm</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Weight</Text>
            <Text style={styles.metricValue}>{weight || '--'} kg</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>BMI</Text>
            <Text style={styles.metricValue}>{bmi || '--'}</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>BMR</Text>
            <Text style={styles.metricValue}>{bmr || '--'} cal</Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>TDEE</Text>
            <Text style={styles.metricValue}>{tdee || '--'} cal</Text>
          </View>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Waist</Text>
            <Text style={styles.metricValue}>{waist || '--'} cm</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  metricsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  metricRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});
