import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LifestyleIndicatorsProps {
  sleepQuality?: string;
  stressLevel?: string;
  activityLevel?: string;
  hydration?: string;
  appetite?: string;
}

export const LifestyleIndicators: React.FC<LifestyleIndicatorsProps> = ({
  sleepQuality = 'Good',
  stressLevel = 'Medium',
  activityLevel = 'Sedentary',
  hydration = 'Unknown',
  appetite = 'Normal',
}) => {
  const getIndicatorColor = (value: string, indicator: string) => {
    if (indicator === 'sleepQuality') {
      if (value === 'Good') return '#10b981';
      if (value === 'Average') return '#f59e0b';
      return '#ef4444';
    }
    if (indicator === 'stressLevel') {
      if (value === 'Low') return '#10b981';
      if (value === 'Medium') return '#f59e0b';
      return '#ef4444';
    }
    if (indicator === 'activityLevel') {
      if (value === 'Active') return '#10b981';
      if (value === 'Moderate') return '#f59e0b';
      return '#ef4444';
    }
    if (indicator === 'hydration') {
      if (value === 'Good') return '#10b981';
      if (value === 'Average') return '#f59e0b';
      return '#ef4444';
    }
    if (value === 'Normal') return '#f59e0b';
    return '#64748b';
  };

  const getIndicatorPercentage = (value: string, indicator: string) => {
    if (indicator === 'sleepQuality') {
      if (value === 'Good') return 85;
      if (value === 'Average') return 50;
      return 25;
    }
    if (indicator === 'stressLevel') {
      if (value === 'Low') return 25;
      if (value === 'Medium') return 50;
      return 85;
    }
    if (indicator === 'activityLevel') {
      if (value === 'Active') return 85;
      if (value === 'Moderate') return 50;
      return 25;
    }
    if (indicator === 'hydration') {
      if (value === 'Good') return 85;
      if (value === 'Average') return 50;
      if (value === 'Unknown') return 50;
      return 25;
    }
    return 50;
  };

  const indicators = [
    { icon: 'moon', label: 'Sleep Quality', value: sleepQuality, key: 'sleepQuality' },
    { icon: 'stopwatch', label: 'Stress Level', value: stressLevel, key: 'stressLevel' },
    { icon: 'pulse', label: 'Activity Level', value: activityLevel, key: 'activityLevel' },
    { icon: 'water', label: 'Hydration', value: hydration, key: 'hydration' },
    { icon: 'restaurant', label: 'Appetite', value: appetite, key: 'appetite' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="pulse-outline" size={20} color="#0f172a" />
        <Text style={styles.sectionTitle}>Lifestyle Indicators</Text>
      </View>

      <View style={styles.card}>
        {indicators.map((indicator, index) => (
          <View 
            key={indicator.key} 
            style={[
              styles.indicatorRow,
              index < indicators.length - 1 && styles.indicatorBorder,
            ]}
          >
            <View style={styles.indicatorContent}>
              <Text style={styles.indicatorLabel}>{indicator.label}</Text>
              <Text style={styles.indicatorValue}>{indicator.value}</Text>
            </View>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${getIndicatorPercentage(indicator.value, indicator.key)}%`,
                    backgroundColor: getIndicatorColor(indicator.value, indicator.key),
                  },
                ]} 
              />
            </View>
          </View>
        ))}
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
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  indicatorRow: {
    paddingVertical: 10,
  },
  indicatorBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  indicatorContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  indicatorLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  indicatorValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  progressContainer: {
    width: '100%',
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
