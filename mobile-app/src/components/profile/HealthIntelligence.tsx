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
  const [isExpanded, setIsExpanded] = useState(false);

  const getDoshaColor = (dosha: string) => {
    const colors: { [key: string]: string } = {
      vata: '#8b5cf6',
      pitta: '#ef4444',
      kapha: '#10b981',
    };
    return colors[dosha.toLowerCase()] || '#64748b';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Balanced') return '#10b981';
    if (status === 'Imbalanced') return '#ef4444';
    return '#f59e0b';
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="analytics-outline" size={20} color="#0f172a" />
        <Text style={styles.sectionTitle}>Health Intelligence Summary</Text>
      </View>

      {/* Dosha Cards Row */}
      <View style={styles.doshaRow}>
        {/* Primary Dosha */}
        <View style={styles.doshaCard}>
          <View style={styles.doshaHeader}>
            <Ionicons name="flower-outline" size={14} color="#64748b" />
            <Text style={styles.doshaLabel}>PRIMARY DOSHA</Text>
          </View>
          <Text style={[styles.doshaValue, { color: getDoshaColor(primaryDosha) }]}>
            {primaryDosha}
          </Text>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>{primaryDoshaPercentage}%</Text>
          </View>
        </View>

        {/* Agni Type */}
        <View style={styles.doshaCard}>
          <View style={styles.doshaHeader}>
            <Ionicons name="flame-outline" size={14} color="#64748b" />
            <Text style={styles.doshaLabel}>AGNI TYPE</Text>
          </View>
          <Text style={styles.doshaValue}>{agniType}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(agniStatus) }]}>
            <Text style={styles.statusText}>{agniStatus}</Text>
            <Ionicons name="checkmark-circle" size={10} color="#ffffff" />
          </View>
        </View>

        {/* Current State */}
        <View style={styles.doshaCard}>
          <View style={styles.doshaHeader}>
            <Ionicons name="heart-outline" size={14} color="#64748b" />
            <Text style={styles.doshaLabel}>CURRENT STATE</Text>
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
            <Ionicons name="information-circle" size={20} color="#d97706" />
            <Text style={styles.constitutionTitle}>Understanding Your Constitution</Text>
          </View>
          <Ionicons 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={20} 
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
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  doshaRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  doshaCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  doshaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  doshaLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.3,
  },
  doshaValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  percentageBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  percentageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  constitutionCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde047',
    overflow: 'hidden',
  },
  constitutionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  constitutionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  constitutionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
  },
  constitutionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  constitutionItem: {
    marginBottom: 12,
  },
  constitutionLabel: {
    fontSize: 13,
    color: '#92400e',
    fontWeight: '600',
    lineHeight: 20,
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
