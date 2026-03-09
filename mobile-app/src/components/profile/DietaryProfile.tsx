import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
  const renderTags = (items: string[], color: string, bgColor: string) => {
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
            <Text style={[styles.tagText, { color }]}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Dietary Profile</Text>

      <View style={styles.card}>
        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>PREFERENCES</Text>
          {renderTags(preferences, '#0891b2', '#ecfeff')}
        </View>

        {/* Restrictions */}
        <View style={styles.section}>
          <Text style={styles.subsectionTitle}>RESTRICTIONS</Text>
          {renderTags(restrictions, '#ef4444', '#fee2e2')}
        </View>

        {/* Health Conditions */}
        <View style={[styles.section, { borderBottomWidth: 0 }]}>
          <Text style={styles.subsectionTitle}>HEALTH CONDITIONS</Text>
          {renderTags(healthConditions, '#f59e0b', '#fef3c7')}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
