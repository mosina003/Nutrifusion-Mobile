import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MealCardProps {
  mealType: string;
  mealName: string;
  foods: string[];
  time: string;
  icon: string;
  explanation: string;
  isCompleted: boolean;
  onToggleCompletion: () => void;
  onReplaceMeal: () => Promise<void>;
}

export const MealCard: React.FC<MealCardProps> = ({
  mealType,
  mealName,
  foods,
  time,
  icon,
  explanation,
  isCompleted,
  onToggleCompletion,
  onReplaceMeal,
}) => {
  const [isReplacing, setIsReplacing] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isReplacing) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [isReplacing]);

  useEffect(() => {
    if (isCompleted) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [isCompleted]);

  const handleReplace = async () => {
    setIsReplacing(true);
    try {
      await onReplaceMeal();
    } finally {
      setIsReplacing(false);
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <View style={styles.header}>
        <View style={styles.mealInfo}>
          <Text style={styles.icon}>{icon}</Text>
          <View style={styles.mealDetails}>
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.mealName}>{mealName}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {/* Replace Button */}
          <TouchableOpacity
            style={styles.replaceButton}
            onPress={handleReplace}
            disabled={isReplacing}
            activeOpacity={0.7}
          >
            {isReplacing ? (
              <ActivityIndicator size="small" color="#0891B2" />
            ) : (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Icon name="refresh" size={18} color="#0891B2" />
              </Animated.View>
            )}
          </TouchableOpacity>

          {/* Checkbox */}
          <TouchableOpacity
            style={[
              styles.checkbox,
              isCompleted && styles.checkboxCompleted,
            ]}
            onPress={onToggleCompletion}
            activeOpacity={0.7}
          >
            {isCompleted && (
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Icon name="check" size={20} color="#FFFFFF" />
              </Animated.View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Foods List */}
      <View style={styles.foodsList}>
        {foods.map((food, idx) => (
          <View
            key={idx}
            style={[
              styles.foodChip,
              isCompleted && styles.foodChipCompleted,
            ]}
          >
            <Text
              style={[
                styles.foodText,
                isCompleted && styles.foodTextCompleted,
              ]}
            >
              {food}
            </Text>
          </View>
        ))}
      </View>

      {/* Explanation */}
      <View style={styles.explanationContainer}>
        <Icon name="leaf" size={16} color="#10B981" style={styles.leafIcon} />
        <Text style={styles.explanationText}>{explanation}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Icon name="lightning-bolt" size={14} color="#94A3B8" />
        <Text style={styles.footerText}>Personalized for you</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedContainer: {
    opacity: 0.75,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 40,
    marginRight: 12,
  },
  mealDetails: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  replaceButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#93C5FD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkbox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  foodsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  foodChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  foodChipCompleted: {
    backgroundColor: '#E2E8F0',
  },
  foodText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  foodTextCompleted: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  explanationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  leafIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  explanationText: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
