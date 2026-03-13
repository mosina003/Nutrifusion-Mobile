import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DayActivity {
  day: string;
  steps: number;
}

interface ActivityTrackingCardProps {
  currentSteps?: number;
  goalSteps?: number;
  calories?: number;
  weeklyData?: DayActivity[];
  onViewFullPlan?: () => void;
}

const ActivityTrackingCard: React.FC<ActivityTrackingCardProps> = ({
  currentSteps = 4200,
  goalSteps = 10000,
  calories = 210,
  weeklyData = [
    { day: 'Sat', steps: 0 },
    { day: 'Sun', steps: 0 },
    { day: 'Mon', steps: 0 },
    { day: 'Tue', steps: 0 },
    { day: 'Wed', steps: 4200 },
    { day: 'Fri', steps: 0 },
  ],
  onViewFullPlan,
}) => {
  const progress = (currentSteps / goalSteps) * 100;
  const maxSteps = Math.max(...weeklyData.map(d => d.steps), goalSteps);

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.topSection}>
        {/* Today's Activity */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.icon}>🏃</Text>
            <Text style={styles.activityTitle}>Today's Activity</Text>
          </View>
          <Text style={styles.stepsText}>
            Steps: <Text style={styles.stepsValue}>{currentSteps.toLocaleString()} / {goalSteps.toLocaleString()}</Text>
          </Text>
          <TouchableOpacity
            style={styles.viewPlanButton}
            onPress={onViewFullPlan}
            activeOpacity={0.7}
          >
            <Text style={styles.viewPlanText}>View Full Diet Plan</Text>
            <Icon name="arrow-right" size={16} color="#0891b2" />
          </TouchableOpacity>
        </View>

        {/* Steps Goal and Calories */}
        <View style={styles.statsSection}>
          {/* Steps Goal */}
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Steps Goal</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.min(progress, 100)}%` },
                  ]}
                />
              </View>
            </View>
            <Text style={styles.statValue}>
              Steps: <Text style={styles.statValueBold}>{currentSteps.toLocaleString()} / {goalSteps.toLocaleString()}</Text>
            </Text>
          </View>

          {/* Calories */}
          <View style={styles.caloriesCard}>
            <Text style={styles.caloriesValue}>{calories} cal</Text>
          </View>
        </View>
      </View>

      {/* Weekly Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartContainer}>
          {weeklyData.map((dayData, index) => {
            const height = maxSteps > 0 ? (dayData.steps / maxSteps) * 100 : 0;
            const isToday = dayData.day === 'Wed'; // highlighting Wednesday as "today"
            
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  {dayData.steps > 0 && (
                    <Text style={styles.barLabel}>
                      {(dayData.steps / 1000).toFixed(1)}k
                    </Text>
                  )}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${Math.max(height, 5)}%`,
                        backgroundColor: isToday ? '#0891b2' : '#e2e8f0',
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                  {dayData.day}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.chartAxisLabels}>
          <Text style={styles.axisLabel}>10K</Text>
          <Text style={styles.axisLabel}>50K</Text>
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
  topSection: {
    marginBottom: 20,
  },
  activitySection: {
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  stepsText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  stepsValue: {
    fontWeight: '600',
    color: '#0f172a',
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
  statsSection: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  statValue: {
    fontSize: 11,
    color: '#64748b',
  },
  statValueBold: {
    fontWeight: '600',
    color: '#0f172a',
  },
  caloriesCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  caloriesValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#166534',
  },
  chartSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
  },
  bar: {
    width: 24,
    backgroundColor: '#0891b2',
    borderRadius: 4,
    minHeight: 8,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  todayLabel: {
    fontWeight: '600',
    color: '#0891b2',
  },
  chartAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  axisLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
});

export default ActivityTrackingCard;
