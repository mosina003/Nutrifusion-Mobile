import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DayPillProps {
  day: string; // Short weekday (e.g., "Thu")
  date: number; // Date number (e.g., 26)
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

export const DayPill: React.FC<DayPillProps> = ({
  day,
  date,
  isActive,
  isCompleted,
  onClick,
}) => {
  const getContainerStyle = () => {
    if (isActive) {
      return [styles.container, styles.activeContainer];
    } else if (isCompleted) {
      return [styles.container, styles.completedContainer];
    }
    return styles.container;
  };

  const getTextColor = () => {
    if (isActive || isCompleted) {
      return '#FFFFFF';
    }
    return '#475569';
  };

  const getDayTextColor = () => {
    if (isActive || isCompleted) {
      return '#BFDBFE';
    }
    return '#94A3B8';
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onClick}
      activeOpacity={0.7}
    >
      {/* Completed indicator */}
      {isCompleted && !isActive && (
        <View style={styles.completedBadge}>
          <Icon name="check" size={12} color="#FFFFFF" />
        </View>
      )}

      {/* Weekday */}
      <Text style={[styles.dayText, { color: getDayTextColor() }]}>
        {day}
      </Text>

      {/* Date */}
      <Text style={[styles.dateText, { color: getTextColor() }]}>
        {date}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 80,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeContainer: {
    backgroundColor: '#0891B2',
    borderColor: '#0891B2',
    transform: [{ scale: 1.05 }],
    elevation: 4,
    shadowOpacity: 0.2,
  },
  completedContainer: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
