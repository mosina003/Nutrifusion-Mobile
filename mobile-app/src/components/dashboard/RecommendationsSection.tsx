import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecommendationsSectionProps {
  recommendations: string[];
}

const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  recommendations,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Recommendations</Text>
      {recommendations && recommendations.length > 0 ? (
        recommendations.slice(0, 3).map((rec, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.icon}>✨</Text>
            <Text style={styles.text}>{rec}</Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>
            Complete your assessment to get personalized recommendations
          </Text>
        </View>
      )}
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
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default RecommendationsSection;
