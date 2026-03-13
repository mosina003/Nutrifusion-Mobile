import React, { useRef, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { DayPill } from './DayPill';

interface DayData {
  day: number;
  date: string; // ISO format "2026-02-26"
  weekday: string; // Short weekday "Thu"
  dateNum: number; // Date number 26
  completed: boolean;
}

interface DaySelectorProps {
  days: DayData[];
  selectedDay: number;
  onDaySelect: (dayIndex: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  selectedDay,
  onDaySelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to selected day
  useEffect(() => {
    if (scrollViewRef.current && selectedDay) {
      // Calculate the position of the selected day
      // Each pill is 64px wide + 12px margin = 76px
      const position = (selectedDay - 1) * 76;
      scrollViewRef.current.scrollTo({
        x: position - 50, // Center it a bit
        animated: true,
      });
    }
  }, [selectedDay]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={76} // Width + margin
      >
        {days.map((dayData) => (
          <DayPill
            key={dayData.day}
            day={dayData.weekday}
            date={dayData.dateNum}
            isActive={selectedDay === dayData.day}
            isCompleted={dayData.completed}
            onClick={() => onDaySelect(dayData.day)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: -8, // Negative margin to allow edge pills to show
  },
  scrollContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
