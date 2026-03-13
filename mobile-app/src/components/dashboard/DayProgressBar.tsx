import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DayProgressBarProps {
  completedMeals: number;
  totalMeals: number;
  dayCompleted: boolean;
}

export const DayProgressBar: React.FC<DayProgressBarProps> = ({
  completedMeals,
  totalMeals,
  dayCompleted,
}) => {
  const progress = (completedMeals / totalMeals) * 100;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    if (dayCompleted) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [dayCompleted]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Daily Progress</Text>
          {dayCompleted && (
            <Animated.View
              style={[
                styles.completedBadge,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Icon name="check-circle" size={16} color="#FFFFFF" />
              <Text style={styles.completedText}>Day Completed ✅</Text>
            </Animated.View>
          )}
        </View>
        <Text style={styles.mealsText}>
          {completedMeals}/{totalMeals} meals
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressWidth,
            },
          ]}
        />
      </View>

      <Text style={styles.progressText}>
        {progress === 100 && !dayCompleted
          ? 'All meals completed!'
          : `${Math.round(progress)}% complete`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginRight: 8,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical:2,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  mealsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#CBD5E1',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0891B2',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
});
