import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HealthScoreCardProps {
  score: number;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Score</Text>
      <View style={styles.card}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.scoreLabel}>/ 100</Text>
        </View>
        <View style={styles.scoreInfo}>
          <Text style={styles.scoreStatus}>Good Progress! 💪</Text>
          <Text style={styles.scoreDescription}>
            Keep following your diet plan to improve your health score
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#e0f2fe',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default HealthScoreCard;
