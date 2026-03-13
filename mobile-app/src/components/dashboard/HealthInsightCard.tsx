import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HealthInsightCardProps {
  prakriti?: string;
  currentState?: string;
  agni?: string;
  healthScore?: number;
  tip?: string;
}

const HealthInsightCard: React.FC<HealthInsightCardProps> = ({
  prakriti = 'Vata-Pitta',
  currentState = 'Pitta Elevated',
  agni = 'Sama Agni',
  healthScore = 79,
  tip = 'Favor cooling foods today like cucumber and coconut.',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🧘</Text>
        <Text style={styles.title}>Today's Health Insight</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Prakriti:</Text>
            <Text style={styles.valueMain}>{prakriti}</Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusLabel}>Current State:</Text>
            <Text style={styles.statusValue}>{currentState}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Agni:</Text>
            <Text style={styles.valueSecondary}>{agni}</Text>
          </View>
        </View>

        <View style={styles.scoreSection}>
          <View style={styles.circularProgress}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{healthScore}</Text>
              <Text style={styles.scoreMax}>100/100</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.tipSection}>
        <Text style={styles.tipLabel}>Tip:</Text>
        <Text style={styles.tipText}>{tip}</Text>
        <View style={styles.tipIconContainer}>
          <Text style={styles.tipIcon}>🥒🥥🌿</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoSection: {
    flex: 1,
    justifyContent: 'space-around',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 8,
  },
  valueMain: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  valueSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  statusLabel: {
    fontSize: 12,
    color: '#92400e',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400e',
  },
  scoreSection: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  circularProgress: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#e2e8f0',
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreMax: {
    fontSize: 10,
    color: '#f0fdfa',
  },
  tipSection: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#166534',
    marginRight: 6,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: '#166534',
    lineHeight: 18,
  },
  tipIconContainer: {
    marginLeft: 8,
  },
  tipIcon: {
    fontSize: 16,
  },
});

export default HealthInsightCard;
