import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WellnessTipCardProps {
  tip?: string;
}

const WellnessTipCard: React.FC<WellnessTipCardProps> = ({
  tip = 'Drinking warm water in the morning helps stimulate digestion and balance Vata.',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🍃</Text>
        <Text style={styles.title}>Wellness Tip</Text>
        <Text style={styles.icon}>🍃</Text>
      </View>
      <View style={styles.tipContainer}>
        <Text style={styles.tipIcon}>🌿</Text>
        <Text style={styles.tipText}>{tip}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
});

export default WellnessTipCard;
