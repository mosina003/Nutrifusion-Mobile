import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface YogaPractice {
  name: string;
  completed?: boolean;
}

interface RecommendedYogaCardProps {
  constitutionType?: string;
  practices?: YogaPractice[];
}

const RecommendedYogaCard: React.FC<RecommendedYogaCardProps> = ({
  constitutionType = 'Pitta Balance',
  practices = [
    { name: 'Cooling Breathing', completed: false },
    { name: 'Moon Salutation', completed: false },
  ],
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🧘</Text>
        <Text style={styles.title}>Recommended Yoga</Text>
        <Text style={styles.subtitle}>for {constitutionType}</Text>
      </View>

      <View style={styles.practicesContainer}>
        {practices.map((practice, index) => (
          <View key={index} style={styles.practiceRow}>
            <Icon
              name={practice.completed ? 'check-circle' : 'checkbox-blank-circle-outline'}
              size={20}
              color={practice.completed ? '#10b981' : '#0891b2'}
            />
            <Text style={styles.practiceName}>{practice.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fde68a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#0f172a',
  },
  practicesContainer: {
    gap: 8,
  },
  practiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  practiceName: {
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 8,
    fontWeight: '500',
  },
});

export default RecommendedYogaCard;
