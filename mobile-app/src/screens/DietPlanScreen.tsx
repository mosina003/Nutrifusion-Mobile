import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { getCurrentDietPlan } from '../services/api';

interface Meal {
  name: string;
  time: string;
  items: string[];
  calories?: number;
  notes?: string;
}

interface DietPlan {
  _id: string;
  name: string;
  framework: string;
  startDate: string;
  endDate: string;
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
    snacks?: Meal[];
  };
  totalCalories?: number;
  guidelines?: string[];
}

const DietPlanScreen = () => {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDay, setSelectedDay] = useState('today');

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const fetchDietPlan = async () => {
    try {
      const data = await getCurrentDietPlan();
      setDietPlan(data);
    } catch (error: any) {
      console.error('Failed to fetch diet plan:', error);
      Alert.alert('Info', 'No diet plan available. Complete your assessment to get one!');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDietPlan();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  if (!dietPlan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🍽️</Text>
        <Text style={styles.emptyTitle}>No Diet Plan Yet</Text>
        <Text style={styles.emptyText}>
          Complete your health assessment to receive a personalized diet plan
        </Text>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Take Assessment</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderMeal = (meal: Meal, mealType: string, icon: string) => {
    if (!meal) return null;

    return (
      <View style={styles.mealCard}>
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleContainer}>
            <Text style={styles.mealIcon}>{icon}</Text>
            <View>
              <Text style={styles.mealType}>{mealType}</Text>
              <Text style={styles.mealTime}>{meal.time || 'Anytime'}</Text>
            </View>
          </View>
          {meal.calories && (
            <View style={styles.caloriesBadge}>
              <Text style={styles.caloriesText}>{meal.calories} cal</Text>
            </View>
          )}
        </View>

        <View style={styles.mealItems}>
          {meal.items && meal.items.length > 0 ? (
            meal.items.map((item, index) => (
              <View key={index} style={styles.mealItem}>
                <Text style={styles.itemBullet}>•</Text>
                <Text style={styles.itemText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noItemsText}>No items specified</Text>
          )}
        </View>

        {meal.notes && (
          <View style={styles.mealNotes}>
            <Text style={styles.notesLabel}>Note:</Text>
            <Text style={styles.notesText}>{meal.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0891b2']} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.planName}>{dietPlan.name || 'Your Diet Plan'}</Text>
        <View style={styles.frameworkBadge}>
          <Text style={styles.frameworkText}>{dietPlan.framework}</Text>
        </View>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Daily Calories</Text>
          <Text style={styles.summaryValue}>{dietPlan.totalCalories || 2000}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Meals</Text>
          <Text style={styles.summaryValue}>4</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Days Active</Text>
          <Text style={styles.summaryValue}>7</Text>
        </View>
      </View>

      {/* Meals */}
      <View style={styles.mealsSection}>
        <Text style={styles.sectionTitle}>Today's Meals</Text>
        
        {dietPlan.meals.breakfast && 
          renderMeal(dietPlan.meals.breakfast, 'Breakfast', '🌅')}
        
        {dietPlan.meals.lunch && 
          renderMeal(dietPlan.meals.lunch, 'Lunch', '☀️')}
        
        {dietPlan.meals.dinner && 
          renderMeal(dietPlan.meals.dinner, 'Dinner', '🌙')}
        
        {dietPlan.meals.snacks && dietPlan.meals.snacks.length > 0 &&
          dietPlan.meals.snacks.map((snack, idx) => 
            renderMeal(snack, 'Snack', '🍎')
          )}
      </View>

      {/* Guidelines */}
      {dietPlan.guidelines && dietPlan.guidelines.length > 0 && (
        <View style={styles.guidelinesSection}>
          <Text style={styles.sectionTitle}>Daily Guidelines</Text>
          <View style={styles.guidelinesCard}>
            {dietPlan.guidelines.map((guideline, index) => (
              <View key={index} style={styles.guidelineItem}>
                <Text style={styles.guidelineIcon}>✓</Text>
                <Text style={styles.guidelineText}>{guideline}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Footer Spacer */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  header: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  frameworkBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0891b2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  frameworkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  mealsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  mealType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  mealTime: {
    fontSize: 14,
    color: '#64748b',
  },
  caloriesBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  caloriesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  mealItems: {
    marginBottom: 8,
  },
  mealItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemBullet: {
    fontSize: 16,
    color: '#0891b2',
    marginRight: 8,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  noItemsText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  mealNotes: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  guidelinesSection: {
    marginBottom: 24,
  },
  guidelinesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guidelineIcon: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 12,
    marginTop: 2,
  },
  guidelineText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#0891b2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default DietPlanScreen;
