import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DietaryProfileProps {
  preferences?: string[];
  restrictions?: string[];
  healthConditions?: string[];
}

export const DietaryProfile: React.FC<DietaryProfileProps> = ({
  preferences = [],
  restrictions = [],
  healthConditions = [],
}) => {
  const renderTags = (items: string[], color: string, bgColor: string, icon: string) => {
    if (!items || items.length === 0) {
      return <Text style={styles.emptyText}>None specified</Text>;
    }

    return (
      <View style={styles.tagsContainer}>
        {items.map((item, index) => (
          <View 
            key={index} 
            style={[styles.tag, { backgroundColor: bgColor, borderColor: color }]}
          >
            <Ionicons name={icon as any} size={12} color={color} />
            <Text style={[styles.tagText, { color }]}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Ionicons name="nutrition-outline" size={20} color="#0f172a" />
        <Text style={styles.sectionTitle}>Dietary Profile</Text>
      </View>

      <View style={styles.card}>
        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>PREFERENCES</Text>
          {renderTags(preferences, '#0891b2', '#ecfeff', 'heart')}
        </View>

        {/* Restrictions */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>RESTRICTIONS</Text>
          {renderTags(restrictions, '#ef4444', '#fee2e2', 'close-circle')}
        </View>

        {/* Health Conditions */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.subsectionTitle}>HEALTH CONDITIONS</Text>
          {renderTags(healthConditions, '#f59e0b', '#fef3c7', 'medkit')}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  subsectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});
