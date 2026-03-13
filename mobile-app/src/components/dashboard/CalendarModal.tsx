import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  planStartDate: Date | null;
  planEndDate: Date | null;
  completions: Map<string, any>;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'perfect':
      return '⭐';
    case 'completed':
      return '✔';
    case 'partial':
      return '⚠';
    case 'skipped':
      return '✖';
    default:
      return '';
  }
};

const getStatusForDate = (dateStr: string, completions: Map<string, any>) => {
  const completion = completions.get(dateStr);
  if (!completion) return 'skipped'; // No meals completed
  const completedMeals = completion.completedMeals ? completion.completedMeals.length : 0;
  if (completedMeals === 3) return 'completed'; // All meals done
  if (completedMeals > 0) return 'partial'; // 1 or 2 meals done
  return 'skipped';
};

const getMonthMatrix = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix: (Date | null)[][] = [];
  let week: (Date | null)[] = [];
  let dayOfWeek = firstDay.getDay();
  // Fill initial empty days
  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(new Date(year, month, d));
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
};

export const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  planStartDate,
  planEndDate,
  completions,
}) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthMatrix = getMonthMatrix(year, month);
  const monthName = today.toLocaleString('default', { month: 'long' });

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{monthName} {year}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          {/* Show plan start/end for debugging */}
          {(planStartDate || planEndDate) && (
            <View style={{alignItems: 'center', marginBottom: 8}}>
              {planStartDate && (
                <Text style={{fontSize: 12, color: '#64748b'}}>
                  Plan Start: {planStartDate.toLocaleDateString()}
                </Text>
              )}
              {planEndDate && (
                <Text style={{fontSize: 12, color: '#64748b'}}>
                  Plan End: {planEndDate.toLocaleDateString()}
                </Text>
              )}
            </View>
          )}
          <View style={styles.calendarGrid}>
            <View style={styles.weekRow}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
                <Text key={d} style={styles.weekday}>{d}</Text>
              ))}
            </View>
            <ScrollView>
              {monthMatrix.map((week, i) => (
                <View key={i} style={styles.weekRow}>
                  {week.map((date, j) => {
                    if (!date) return <View key={j} style={styles.dayCell} />;
                    const dateStr = date.toISOString().split('T')[0];
                    const status = getStatusForDate(dateStr, completions);
                    // Highlight if date is within planStartDate and planEndDate
                    let isActive = false;
                    if (planStartDate && planEndDate) {
                      // Always treat all dates as local midnight for comparison
                      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                      const start = new Date(planStartDate.getFullYear(), planStartDate.getMonth(), planStartDate.getDate());
                      const end = new Date(planEndDate.getFullYear(), planEndDate.getMonth(), planEndDate.getDate());
                      isActive = d >= start && d <= end;
                    }
                    // Only show progress for past and current days
                    const today = new Date();
                    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    const showStatus = isActive && (localDate <= todayMidnight);
                    return (
                      <TouchableOpacity
                        key={j}
                        style={[styles.dayCell, isActive && styles.activeDayCell]}
                        onPress={() => isActive && onSelectDate(date)}
                        disabled={!isActive}
                      >
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                          <Text style={[styles.dayNum, isActive && styles.activeDayNum]}>{date.getDate()}</Text>
                          {showStatus && status && (
                            <Text style={[styles.statusIcon, {marginLeft: 2}]}>{getStatusIcon(status)}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 6,
  },
  closeButtonText: {
    color: '#0891b2',
    fontWeight: '600',
    fontSize: 15,
  },
  calendarGrid: {
    marginTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    color: '#64748b',
    fontSize: 13,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    minWidth: 32,
    minHeight: 40,
    borderRadius: 8,
  },
  activeDayCell: {
    backgroundColor: '#e0f2fe',
  },
  dayNum: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
  },
  activeDayNum: {
    color: '#0891b2',
    fontWeight: 'bold',
  },
  statusIcon: {
    fontSize: 16,
    marginTop: 2,
  },
});
