import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MealStatus {
  name: string;
  status: 'completed' | 'upcoming' | 'in-progress';
  progress?: number;
}

interface DietSummaryCardProps {
  meals?: MealStatus[];
  onViewFullPlan?: () => void;
}

const DietSummaryCard: React.FC<DietSummaryCardProps> = ({
  meals = [
    { name: 'Breakfast', status: 'completed' },
    { name: 'Lunch', status: 'upcoming' },
    { name: 'Dinner', status: 'in-progress', progress: 60 },
  ],
  onViewFullPlan,
}) => {
  const renderMealStatus = (meal: MealStatus) => {
    switch (meal.status) {
      case 'completed':
        return (
          <View style={styles.statusContainer}>
            <Icon name="check-circle" size={20} color="#10b981" />
            <View style={styles.statusButton}>
              <Text style={styles.statusButtonText}>Completed</Text>
            </View>
          </View>
        );
      case 'upcoming':
        return (
          <View style={styles.statusContainer}>
            <Icon name="clock-outline" size={20} color="#64748b" />
            <Text style={styles.upcomingText}>Upcoming</Text>
            <View style={styles.pendingButton}>
              <Text style={styles.pendingButtonText}>Pending</Text>
            </View>
          </View>
        );
      case 'in-progress':
        return (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${meal.progress || 0}%` },
                ]}
              />
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🍽️</Text>
        <Text style={styles.title}>Today's Diet Summary</Text>
      </View>

      <View style={styles.mealsContainer}>
        {meals.map((meal, index) => (
          <View key={index} style={styles.mealRow}>
            <Text style={styles.mealName}>{meal.name}</Text>
            {renderMealStatus(meal)}
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.waterReminder}>Aim for 8 glasses daily</Text>
        <TouchableOpacity
          style={styles.viewPlanButton}
          onPress={onViewFullPlan}
          activeOpacity={0.7}
        >
          <Text style={styles.viewPlanText}>View Full Diet Plan</Text>
          <Icon name="arrow-right" size={16} color="#0891b2" />
        </TouchableOpacity>
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
  mealsContainer: {
    marginBottom: 16,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#10b981',
    marginLeft: 4,
  },
  upcomingText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
  },
  statusButton: {
    backgroundColor: '#10b981',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  statusButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  pendingButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  pendingButtonText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    maxWidth: 200,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0891b2',
    borderRadius: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  waterReminder: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },
  viewPlanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  viewPlanText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0891b2',
    marginRight: 4,
  },
});

export default DietSummaryCard;
