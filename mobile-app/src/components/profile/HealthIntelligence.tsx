import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HealthIntelligenceProps {
  framework: string;
  primaryDosha?: string;
  primaryDoshaPercentage?: number;
  secondaryDosha?: string;
  secondaryDoshaPercentage?: number;
  agniType?: string;
  agniStatus?: string;
  currentState?: string;
  currentStateStatus?: string;
  prakritiDescription?: string;
  agniDescription?: string;
  currentStateDescription?: string;
}

export const HealthIntelligence: React.FC<HealthIntelligenceProps> = ({
  framework = 'AYURVEDA',
  primaryDosha = 'vata',
  primaryDoshaPercentage = 39,
  secondaryDosha = 'pitta',
  secondaryDoshaPercentage = 39,
  agniType = 'Sama Agni',
  agniStatus = 'Balanced',
  currentState = 'pitta',
  currentStateStatus = 'Imbalanced',
  prakritiDescription = 'You are Vata-Pitta dominant',
  agniDescription = 'Sama Agni - Balanced digestion, can eat at regular times.',
  currentStateDescription = 'pitta is currently aggravated - focus on balancing foods and lifestyle.',
}) => {
  console.log('🎯 HealthIntelligence RENDERING with:', { primaryDosha, agniType, currentState });
  const [isExpanded, setIsExpanded] = useState(false);

  const getDoshaColor = (dosha: string) => {
    const colors: { [key: string]: string } = {
      vata: '#8b5cf6',
      pitta: '#ef4444',
      kapha: '#10b981',
    };
    return colors[dosha.toLowerCase()] || '#64748b';
  };

  const getDoshaBackgroundColor = (dosha: string) => {
    const colors: { [key: string]: string } = {
      vata: '#f5f3ff',
      pitta: '#fef2f2',
      kapha: '#f0fdf4',
    };
    return colors[dosha.toLowerCase()] || '#f8fafc';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Balanced') return '#10b981';
    if (status === 'Imbalanced') return '#ef4444';
    return '#f59e0b';
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="analytics-outline" size={18} color="#0f172a" />
        <Text style={styles.sectionTitle}>Health Intelligence Summary</Text>
      </View>

      {/* Dosha Cards Row */}
      <View style={styles.doshaRow}>
        {/* Primary Dosha */}
        <View style={[styles.doshaCard, { backgroundColor: getDoshaBackgroundColor(primaryDosha) }]}>
          <View style={styles.doshaHeader}>
            <Ionicons name="flower-outline" size={12} color="#64748b" />
            <Text style={styles.doshaLabel}>PRIMARY</Text>
          </View>
          <Text style={[styles.doshaValue, { color: getDoshaColor(primaryDosha) }]}>
            {primaryDosha}
          </Text>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>{primaryDoshaPercentage}%</Text>
          </View>
        </View>

        {/* Agni Type */}
        <View style={[styles.doshaCard, { backgroundColor: '#f0fdf4' }]}>
          <View style={styles.doshaHeader}>
            <Ionicons name="flame-outline" size={12} color="#64748b" />
            <Text style={styles.doshaLabel}>AGNI</Text>
          </View>
          <Text style={styles.doshaValue}>{agniType}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agniStatus) }]}>
            <Text style={styles.statusText}>{agniStatus}</Text>
          </View>
        </View>

        {/* Current State */}
        <View style={[styles.doshaCard, { backgroundColor: getDoshaBackgroundColor(currentState) }]}>
          <View style={styles.doshaHeader}>
            <Ionicons name="pulse-outline" size={12} color="#64748b" />
            <Text style={styles.doshaLabel}>STATE</Text>
          </View>
          <Text style={[styles.doshaValue, { color: getDoshaColor(currentState) }]}>
            {currentState}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentStateStatus) }]}>
            <Text style={styles.statusText}>{currentStateStatus}</Text>
          </View>
        </View>
      </View>

      {/* Understanding Your Constitution */}
      <View style={styles.constitutionCard}>
        <TouchableOpacity 
          style={styles.constitutionHeader}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.constitutionTitleRow}>
            <Ionicons name="information-circle" size={16} color="#d97706" />
            <Text style={styles.constitutionTitle}>Understanding Your Constitution</Text>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color="#d97706" 
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.constitutionContent}>
            <View style={styles.constitutionItem}>
              <Text style={styles.constitutionLabel}>
                Your Prakriti (Birth Constitution):{' '}
                <Text style={styles.constitutionValue}>
                  {prakritiDescription} with{' '}
                  <Text style={styles.doshaHighlight}>{primaryDosha}</Text> as primary ({primaryDoshaPercentage}%) 
                  and <Text style={styles.doshaHighlight}>{secondaryDosha}</Text> as secondary ({secondaryDoshaPercentage}%).
                </Text>
              </Text>
            </View>

            <View style={styles.constitutionItem}>
              <Text style={styles.constitutionLabel}>
                Your Agni (Digestive Fire):{' '}
                <Text style={styles.constitutionValue}>{agniDescription}</Text>
              </Text>
            </View>

            <View style={styles.constitutionItem}>
              <Text style={styles.constitutionLabel}>
                Current State (Vikriti): ⚠️{' '}
                <Text style={styles.constitutionValue}>{currentStateDescription}</Text>
              </Text>
            </View>
          </View>
        )}
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
    gap: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  doshaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  doshaCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  doshaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  doshaLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  doshaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  percentageBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  percentageText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1e40af',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  constitutionCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fde047',
    overflow: 'hidden',
  },
  constitutionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  constitutionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  constitutionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400e',
  },
  constitutionContent: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  constitutionItem: {
    marginBottom: 10,
  },
  constitutionLabel: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
    lineHeight: 18,
  },
  constitutionValue: {
    fontWeight: '400',
    color: '#78350f',
  },
  doshaHighlight: {
    fontWeight: '700',
    color: '#92400e',
  },
});
