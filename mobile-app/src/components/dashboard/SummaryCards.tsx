import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryCardsProps {
  currentWeight?: number;
  goalWeight?: number;
  bmi?: number;
  calorieTarget?: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  currentWeight,
  goalWeight,
  bmi,
  calorieTarget,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>⚖️</Text>
          <Text style={styles.cardValue}>{currentWeight || '--'}</Text>
          <Text style={styles.cardLabel}>Current Weight (kg)</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🎯</Text>
          <Text style={styles.cardValue}>{goalWeight || '--'}</Text>
          <Text style={styles.cardLabel}>Goal Weight (kg)</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>📊</Text>
          <Text style={styles.cardValue}>
            {bmi ? bmi.toFixed(1) : '--'}
          </Text>
          <Text style={styles.cardLabel}>BMI</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardIcon}>🔥</Text>
          <Text style={styles.cardValue}>{calorieTarget || '--'}</Text>
          <Text style={styles.cardLabel}>Daily Calories</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default SummaryCards;
