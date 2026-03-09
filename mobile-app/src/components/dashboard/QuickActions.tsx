import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuickActionsProps {
  onAssessmentPress: () => void;
  onDietPlanPress: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAssessmentPress,
  onDietPlanPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onAssessmentPress}
          activeOpacity={0.8}
        >
          <Text style={styles.icon}>📝</Text>
          <Text style={styles.buttonText}>Take Assessment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={onDietPlanPress}
          activeOpacity={0.8}
        >
          <Text style={styles.icon}>🍽️</Text>
          <Text style={styles.buttonText}>View Diet Plan</Text>
        </TouchableOpacity>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#0891b2',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default QuickActions;
