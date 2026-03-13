import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  getCurrentDietPlanFull,
  getMealCompletions,
  toggleMealCompletion,
  regenerateDietPlan,
  replaceMeal,
} from '../services/api';
import { DaySelector } from '../components/dashboard/DaySelector';
import { StatusChips } from '../components/dashboard/StatusChips';
import { DayProgressBar } from '../components/dashboard/DayProgressBar';
import { MealCard } from '../components/dashboard/MealCard';
import { RegenerateButton } from '../components/dashboard/RegenerateButton';
import { CalendarModal } from '../components/dashboard/CalendarModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DietPlan {
  '7_day_plan': {
    [key: string]: {
      breakfast: string[];
      lunch: string[];
      dinner: string[];
    };
  };
  top_ranked_foods: Array<{ food_name: string; score: number }>;
  reasoning_summary: string;
}

// Ayurveda health profile
interface AyurvedaHealthProfile {
  prakriti: { dosha_type: string };
  vikriti: { dominant: string };
  agni: { name: string; type: string };
}

// Unani health profile
interface UnaniHealthProfile {
  primary_mizaj: string;
  dominant_humor: string;
  digestive_strength: string;
}

// TCM health profile
interface TCMHealthProfile {
  primary_pattern: string;
  secondary_pattern?: string;
  cold_heat: string;
}

// Modern health profile
interface ModernHealthProfile {
  bmi: number;
  bmi_category: string;
  bmr: number;
  tdee: number;
  recommended_calories: number;
  metabolic_risk_level: string;
  primary_goal?: string;
}

type HealthProfile =
  | AyurvedaHealthProfile
  | UnaniHealthProfile
  | TCMHealthProfile
  | ModernHealthProfile;

interface WeeklyPlanDay {
  day: number;
  date: string;
  weekday: string;
  dateNum: number;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
  completed: boolean;
}

interface MealCompletion {
  date: string;
  day: number;
  completedMeals: Array<{ mealType: string; completedAt: Date }>;
  dayCompleted: boolean;
}

const DietPlanScreen = () => {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [healthProfile, setHealthProfile] = useState<HealthProfile | null>(null);
  const [framework, setFramework] = useState<string>('ayurveda');
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlanDay[]>([]);
  const [completions, setCompletions] = useState<Map<string, MealCompletion>>(
    new Map()
  );
  const [planStartDate, setPlanStartDate] = useState<Date | null>(null);
  const [planEndDate, setPlanEndDate] = useState<Date | null>(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const hasAttemptedRegenerate = useRef(false);
  const hasCheckedExpiry = useRef(false);

  useEffect(() => {
    fetchDietPlan();
    fetchMealCompletions();
  }, []);

  // Auto-regenerate if diet plan is empty (only once)
  useEffect(() => {
    if (!loading && !hasAttemptedRegenerate.current && dietPlan) {
      const hasEmptyData =
        !dietPlan['7_day_plan'] ||
        Object.keys(dietPlan['7_day_plan']).length === 0 ||
        !dietPlan['7_day_plan']['day_1']?.breakfast?.length;

      if (hasEmptyData && !regenerating) {
        hasAttemptedRegenerate.current = true;
        regeneratePlanSilent();
      }
    }
  }, [loading, dietPlan]);

  // Check if plan has expired and needs regeneration
  useEffect(() => {
    if (
      planEndDate &&
      !hasCheckedExpiry.current &&
      !loading &&
      !regenerating
    ) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(planEndDate);
      endDate.setHours(0, 0, 0, 0);

      if (today > endDate) {
        console.log('📅 Plan expired, auto-regenerating...');
        hasCheckedExpiry.current = true;
        regeneratePlanSilent();
      }
    }
  }, [planEndDate, loading, regenerating]);

  // Generate weekly plan from diet plan data
  useEffect(() => {
    if (dietPlan && planStartDate && planEndDate) {
      generatePlanDays();
    }
  }, [dietPlan, completions, planStartDate, planEndDate]);

  const generatePlanDays = () => {
    if (!planStartDate || !planEndDate) return;

    // Normalize all dates to local midnight
    const startDate = new Date(planStartDate.getFullYear(), planStartDate.getMonth(), planStartDate.getDate());
    const endDate = new Date(planEndDate.getFullYear(), planEndDate.getMonth(), planEndDate.getDate());

    const daysData: WeeklyPlanDay[] = [];
    let i = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const dayKey = `day_${i + 1}`;
      const dayPlan = dietPlan!['7_day_plan'][dayKey];
      const completion = completions.get(dateString);
      daysData.push({
        day: i + 1,
        date: dateString,
        weekday: currentDate.toLocaleDateString('en-US', { weekday: 'short' }),
        dateNum: currentDate.getDate(),
        meals: {
          breakfast: dayPlan?.breakfast || [],
          lunch: dayPlan?.lunch || [],
          dinner: dayPlan?.dinner || [],
        },
        completed: completion?.dayCompleted || false,
      });
      i++;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setWeeklyPlan(daysData);

    // Calculate which day we're on in the current plan
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const daysDiff = Math.floor((todayMidnight.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const calculatedDay = Math.min(Math.max(daysDiff + 1, 1), daysData.length);
    setCurrentDay(calculatedDay);
  };

  const fetchDietPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getCurrentDietPlanFull();

      if (response.success) {
        setDietPlan(response.dietPlan);
        setHealthProfile(response.healthProfile);
        setFramework(response.framework || 'ayurveda');

        // Store plan dates from metadata
        if (response.metadata?.validFrom) {
          setPlanStartDate(new Date(response.metadata.validFrom));
        }
        if (response.metadata?.validTo) {
          setPlanEndDate(new Date(response.metadata.validTo));
        }
      } else {
        setError(response.error || 'Failed to load diet plan');
      }
    } catch (err: any) {
      console.error('Error fetching diet plan:', err);
      // Check if it's a "no diet plan found" error
      if (err.message.includes('No active diet plan') || 
          err.message.includes('No assessment') ||
          err.message.includes('complete an assessment')) {
        setError('expired'); // Special flag for expired plan
      } else {
        setError('Failed to load diet plan. Please try again later.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchMealCompletions = async () => {
    try {
      const response = await getMealCompletions();
      if (response.data) {
        const completionMap = new Map();
        response.data.forEach((completion: MealCompletion) => {
          completionMap.set(completion.date, completion);
        });
        setCompletions(completionMap);
      }
    } catch (err) {
      console.error('Error fetching completions:', err);
    }
  };

  const handleToggleMealCompletion = async (mealType: string) => {
    const currentDayData = weeklyPlan[currentDay - 1];
    if (!currentDayData) return;

    // Optimistic update
    const updatedCompletions = new Map(completions);
    const existingCompletion = updatedCompletions.get(currentDayData.date) || {
      date: currentDayData.date,
      day: currentDay,
      completedMeals: [],
      dayCompleted: false,
    };

    const mealIndex = existingCompletion.completedMeals.findIndex(
      (m) => m.mealType === mealType.toLowerCase()
    );

    if (mealIndex > -1) {
      existingCompletion.completedMeals.splice(mealIndex, 1);
    } else {
      existingCompletion.completedMeals.push({
        mealType: mealType.toLowerCase(),
        completedAt: new Date(),
      });
    }

    existingCompletion.dayCompleted =
      existingCompletion.completedMeals.length === 3;
    updatedCompletions.set(currentDayData.date, existingCompletion);
    setCompletions(updatedCompletions);

    // API call
    try {
      const result = await toggleMealCompletion({
        date: currentDayData.date,
        day: currentDay,
        mealType: mealType.toLowerCase(),
        dietPlanId: 'current',
      });

      if (result.data?.dayCompleted && !existingCompletion.dayCompleted) {
        Alert.alert('Success', '🎉 Day completed! Great job!');
      }
    } catch (err: any) {
      console.error('Error toggling meal:', err);
      // Revert optimistic update on error
      fetchMealCompletions();
      Alert.alert('Error', 'Failed to update meal completion');
    }
  };

  const handleRegeneratePlan = async () => {
    setRegenerating(true);
    try {
      const response = await regenerateDietPlan();

      if (response.success && response.dietPlan) {
        setDietPlan(response.dietPlan);
        setFramework(response.framework || framework);

        // Use metadata dates from response
        if (response.metadata?.validFrom) {
          setPlanStartDate(new Date(response.metadata.validFrom));
        } else {
          setPlanStartDate(new Date());
        }

        if (response.metadata?.validTo) {
          setPlanEndDate(new Date(response.metadata.validTo));
        } else {
          const newEndDate = new Date();
          newEndDate.setDate(newEndDate.getDate() + 7);
          setPlanEndDate(newEndDate);
        }

        hasCheckedExpiry.current = false;
        Alert.alert('Success', 'Diet plan regenerated successfully!');
        await fetchMealCompletions();
        setCurrentDay(1);
      } else {
        Alert.alert('Error', response.error || 'Failed to regenerate plan');
      }
    } catch (err: any) {
      console.error('Error regenerating plan:', err);
      Alert.alert('Error', err.message || 'Failed to regenerate plan');
    } finally {
      setRegenerating(false);
    }
  };

  // Silent version for auto-generation
  const regeneratePlanSilent = async () => {
    setRegenerating(true);
    try {
      const response = await regenerateDietPlan();

      if (response.success && response.dietPlan) {
        console.log('🔄 Auto-generated diet plan');
        setDietPlan(response.dietPlan);
        setFramework(response.framework || framework);

        if (response.metadata?.validFrom) {
          setPlanStartDate(new Date(response.metadata.validFrom));
        } else {
          setPlanStartDate(new Date());
        }

        if (response.metadata?.validTo) {
          setPlanEndDate(new Date(response.metadata.validTo));
        } else {
          const newEndDate = new Date();
          newEndDate.setDate(newEndDate.getDate() + 7);
          setPlanEndDate(newEndDate);
        }

        hasCheckedExpiry.current = false;
        await fetchMealCompletions();
        setCurrentDay(1);
      }
    } catch (err) {
      console.error('Error auto-generating plan:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleReplaceMeal = async (mealType: string) => {
    try {
      const response = await replaceMeal({
        day: currentDay,
        mealType: mealType.toLowerCase(),
      });

      if (response.data?.newFoods && dietPlan) {
        const updatedPlan = { ...dietPlan };
        const dayKey = `day_${currentDay}`;
        const mealKey = mealType.toLowerCase() as 'breakfast' | 'lunch' | 'dinner';

        if (updatedPlan['7_day_plan'][dayKey]) {
          updatedPlan['7_day_plan'][dayKey][mealKey] = response.data.newFoods;
        }
        setDietPlan(updatedPlan);
        Alert.alert('Success', `${mealType} replaced successfully!`);
      }
    } catch (err: any) {
      console.error('Error replacing meal:', err);
      Alert.alert('Error', err.message || 'Failed to replace meal');
    }
  };

  const getCurrentDayCompletion = () => {
    const currentDayData = weeklyPlan[currentDay - 1];
    if (!currentDayData)
      return { completedMeals: 0, totalMeals: 3, dayCompleted: false };

    const completion = completions.get(currentDayData.date);
    return {
      completedMeals: completion?.completedMeals.length || 0,
      totalMeals: 3,
      dayCompleted: completion?.dayCompleted || false,
    };
  };

  const isMealCompleted = (mealType: string) => {
    const currentDayData = weeklyPlan[currentDay - 1];
    if (!currentDayData) return false;

    const completion = completions.get(currentDayData.date);
    return (
      completion?.completedMeals.some(
        (m) => m.mealType === mealType.toLowerCase()
      ) || false
    );
  };

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🍽️';
      case 'dinner':
        return '🌙';
      default:
        return '🍴';
    }
  };

  const getMealTime = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '7:00 AM - 8:00 AM';
      case 'lunch':
        return '12:00 PM - 1:00 PM';
      case 'dinner':
        return '6:00 PM - 7:00 PM';
      default:
        return '';
    }
  };

  const getMealExplanation = (type: string) => {
    switch (type) {
      case 'breakfast':
        return 'Light and easy to digest, perfect way to start your day';
      case 'lunch':
        return 'Main meal of the day when digestive fire is strongest';
      case 'dinner':
        return 'Light evening meal to support restful sleep';
      default:
        return '';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDietPlan();
    fetchMealCompletions();
  };

  if (loading || regenerating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891B2" />
        <Text style={styles.loadingText}>
          {regenerating
            ? 'Generating your personalized diet plan...'
            : 'Loading your personalized diet plan...'}
        </Text>
      </View>
    );
  }

  if (error) {
    // Check if it's an expired plan error
    const isExpiredPlan = error === 'expired' || error.includes('No active diet plan');
    
    return (
      <View style={styles.errorContainer}>
        <Icon 
          name={isExpiredPlan ? "calendar-clock" : "alert-circle"} 
          size={60} 
          color={isExpiredPlan ? "#0891B2" : "#F59E0B"} 
        />
        <Text style={styles.errorTitle}>
          {isExpiredPlan ? 'Diet Plan Expired' : 'Error'}
        </Text>
        <Text style={styles.errorText}>
          {isExpiredPlan 
            ? 'Your 7-day diet plan has expired. Generate a new personalized plan to continue your journey!' 
            : error}
        </Text>
        {isExpiredPlan && (
          <RegenerateButton 
            onRegenerate={handleRegeneratePlan}
            isLoading={regenerating}
          />
        )}
      </View>
    );
  }

  if (!dietPlan || !dietPlan['7_day_plan']) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891B2" />
        <Text style={styles.loadingText}>Preparing your diet plan...</Text>
      </View>
    );
  }

  const currentDayPlan = dietPlan['7_day_plan']?.[`day_${currentDay}`];
  if (!currentDayPlan) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0891B2" />
        <Text style={styles.loadingText}>
          Loading day {currentDay} meal plan...
        </Text>
      </View>
    );
  }

  const { completedMeals, totalMeals, dayCompleted } = getCurrentDayCompletion();

  const meals = [
    {
      type: 'breakfast',
      name: 'Breakfast',
      foods: currentDayPlan.breakfast,
      time: getMealTime('breakfast'),
      icon: getMealIcon('breakfast'),
      explanation: getMealExplanation('breakfast'),
    },
    {
      type: 'lunch',
      name: 'Lunch',
      foods: currentDayPlan.lunch,
      time: getMealTime('lunch'),
      icon: getMealIcon('lunch'),
      explanation: getMealExplanation('lunch'),
    },
    {
      type: 'dinner',
      name: 'Dinner',
      foods: currentDayPlan.dinner,
      time: getMealTime('dinner'),
      icon: getMealIcon('dinner'),
      explanation: getMealExplanation('dinner'),
    },
  ];

  // Try to load the logo
  let logoImage;
  try {
    logoImage = require('../../assets/logo.png');
  } catch (e) {
    logoImage = null;
  }

  const handleCalendarPress = () => {
    setCalendarVisible(true);
  };

  const handleCalendarClose = () => {
    setCalendarVisible(false);
  };

  const handleCalendarDateSelect = (date: Date) => {
    // Find the day index in weeklyPlan for the selected date
    const dateStr = date.toISOString().split('T')[0];
    const found = weeklyPlan.find((d) => d.date === dateStr);
    if (found) {
      setCurrentDay(found.day);
      setCalendarVisible(false);
    } else {
      // If not found, just close modal
      setCalendarVisible(false);
    }
  };

  return (
    <>
      <CalendarModal
        visible={calendarVisible}
        onClose={handleCalendarClose}
        onSelectDate={handleCalendarDateSelect}
        planStartDate={planStartDate}
        planEndDate={planEndDate}
        completions={completions}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* App Header */}
        <View style={styles.appHeader}>
          <View style={styles.logoContainer}>
            {logoImage ? (
              <Image 
                source={logoImage} 
                style={styles.logo}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.logo, styles.logoPlaceholder]}>
                <Ionicons name="nutrition" size={24} color="#0891b2" />
              </View>
            )}
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.calendarButton} 
              onPress={handleCalendarPress}
            >
              <Ionicons name="calendar-outline" size={16} color="#0891b2" />
              <Text style={styles.calendarText}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={() => handleRegeneratePlan()}
              disabled={regenerating}
            >
              <Ionicons 
                name="refresh-outline" 
                size={20} 
                color={regenerating ? "#cbd5e0" : "#64748b"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#0891B2']}
            />
          }
        >
          {/* Page Title */}
          <View style={styles.pageTitle}>
            <Icon name="nutrition" size={24} color="#0891B2" />
            <Text style={styles.title}>Your Personalized Diet Plan</Text>
          </View>

        {/* Day Selector */}
        {weeklyPlan.length > 0 && (
          <DaySelector
            days={weeklyPlan}
            selectedDay={currentDay}
            onDaySelect={setCurrentDay}
          />
        )}

        {/* Health Profile Summary */}
        {healthProfile && (
          <StatusChips healthProfile={healthProfile} framework={framework} />
        )}

        {/* Day Progress */}
        <DayProgressBar
          completedMeals={completedMeals}
          totalMeals={totalMeals}
          dayCompleted={dayCompleted}
        />

        {/* Meals */}
        <View style={styles.mealsSection}>
          {meals.map((meal, idx) => (
            <MealCard
              key={idx}
              mealType={meal.type}
              mealName={meal.name}
              foods={meal.foods}
              time={meal.time}
              icon={meal.icon}
              explanation={meal.explanation}
              isCompleted={isMealCompleted(meal.type)}
              onToggleCompletion={() => handleToggleMealCompletion(meal.type)}
              onReplaceMeal={() => handleReplaceMeal(meal.type)}
            />
          ))}
        </View>

        {/* Reasoning Summary */}
        {dietPlan.reasoning_summary && (
          <View style={styles.reasoningCard}>
            <View style={styles.reasoningHeader}>
              <Icon name="leaf" size={20} color="#059669" />
              <Text style={styles.reasoningTitle}>Why This Plan Works For You</Text>
            </View>
            <Text style={styles.reasoningText}>{dietPlan.reasoning_summary}</Text>
          </View>
        )}

        {/* Top Ranked Foods */}
        {dietPlan.top_ranked_foods && dietPlan.top_ranked_foods.length > 0 && (
          <View style={styles.topFoodsCard}>
            <Text style={styles.topFoodsTitle}>Top Recommended Foods</Text>
            <View style={styles.topFoodsContainer}>
              {dietPlan.top_ranked_foods.slice(0, 10).map((food, idx) => (
                <View key={idx} style={styles.topFoodChip}>
                  <Text style={styles.topFoodText}>{food.food_name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Footer Spacer */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  logoPlaceholder: {
    backgroundColor: '#f0f9ff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  calendarText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0891b2',
  },
  refreshButton: {
    width: 36,
    height: 36,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  pageTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FEF3C7',
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#92400E',
    textAlign: 'center',
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 24,
  },
  mealsSection: {
    marginBottom: 20,
  },
  reasoningCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  reasoningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reasoningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#047857',
    marginLeft: 8,
  },
  reasoningText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  topFoodsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topFoodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  topFoodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topFoodChip: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  topFoodText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1E40AF',
  },
});

export default DietPlanScreen;
