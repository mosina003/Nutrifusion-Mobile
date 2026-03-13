import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AssessmentResultBlocksProps {
  assessmentResults: any;
  showHeader?: boolean;
  showHeaderIcon?: boolean;
  showHeaderTitle?: boolean;
  showHeaderSubtitle?: boolean;
  showSuccessMessage?: boolean;
}

const AssessmentResultBlocks: React.FC<AssessmentResultBlocksProps> = ({
  assessmentResults,
  showHeader = true,
  showHeaderIcon = true,
  showHeaderTitle = true,
  showHeaderSubtitle = true,
  showSuccessMessage = true,
}) => {
  if (!assessmentResults) {
    return null;
  }

  const resultsData = assessmentResults.results || assessmentResults;
  const { framework, scores, healthProfile } = resultsData;

  return (
    <View style={styles.resultsContainer}>
      {showHeader && (
        <View style={styles.resultsHeader}>
          {showHeaderIcon && <Text style={styles.resultsIcon}>✅</Text>}
          {showHeaderTitle && <Text style={styles.resultsTitle}>Assessment Complete!</Text>}
          {showHeaderSubtitle && (
            <Text style={styles.resultsSubtitle}>
              Your personalized health profile has been created
            </Text>
          )}
        </View>
      )}

      {framework === 'ayurveda' && healthProfile?.prakriti && (
        <View style={styles.resultsCard}>
          <Text style={styles.resultsCardTitle}>Your Dosha Constitution (Prakriti)</Text>

          <View style={styles.constitutionBadge}>
            <Text style={styles.constitutionType}>
              {healthProfile.prakriti.dosha_type || healthProfile.prakriti.type || 'Balanced'}
            </Text>
          </View>

          <View style={styles.doshaGrid}>
            <View style={styles.doshaItem}>
              <Text style={styles.doshaName}>Vata</Text>
              <Text style={styles.doshaPercentage}>
                {Math.round(healthProfile.prakriti.percentages?.vata || 0)}%
              </Text>
            </View>
            <View style={styles.doshaItem}>
              <Text style={styles.doshaName}>Pitta</Text>
              <Text style={styles.doshaPercentage}>
                {Math.round(healthProfile.prakriti.percentages?.pitta || 0)}%
              </Text>
            </View>
            <View style={styles.doshaItem}>
              <Text style={styles.doshaName}>Kapha</Text>
              <Text style={styles.doshaPercentage}>
                {Math.round(healthProfile.prakriti.percentages?.kapha || 0)}%
              </Text>
            </View>
          </View>

          {healthProfile.vikriti && (
            <View style={styles.vikritiBadge}>
              <Text style={styles.vikritLabel}>Current Imbalance (Vikriti):</Text>
              <Text style={styles.vikritType}>
                {healthProfile.vikriti.dominant || healthProfile.vikriti.primary_imbalance || 'Balanced'}
              </Text>
            </View>
          )}

          {healthProfile.agni && (
            <View style={styles.agniContainer}>
              <Text style={styles.agniTitle}>Digestive Fire (Agni):</Text>
              <Text style={styles.agniType}>{healthProfile.agni.name || healthProfile.agni.type}</Text>
              <Text style={styles.agniDescription}>{healthProfile.agni.description}</Text>
            </View>
          )}
        </View>
      )}

      {framework === 'unani' && (healthProfile?.mizaj || scores?.mizaj) && (
        <View style={styles.resultsCard}>
          <Text style={styles.resultsCardTitle}>Your Temperament (Mizaj)</Text>

          <View style={styles.constitutionBadge}>
            <Text style={styles.constitutionType}>
              {(healthProfile?.mizaj || scores?.mizaj)?.temperament_type ||
                (healthProfile?.mizaj || scores?.mizaj)?.type ||
                'Balanced'}
            </Text>
          </View>

          {(healthProfile?.mizaj || scores?.mizaj)?.percentages && (
            <View style={styles.doshaGrid}>
              {Object.entries((healthProfile?.mizaj || scores?.mizaj).percentages).map(([key, value]) => (
                <View key={key} style={styles.doshaItem}>
                  <Text style={styles.doshaName}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.doshaPercentage}>{Math.round(value as number)}%</Text>
                </View>
              ))}
            </View>
          )}

          {(healthProfile?.dominant_humor || scores?.dominant_humor) && (
            <View style={styles.humorBadge}>
              <Text style={styles.humorLabel}>Dominant Humor:</Text>
              <Text style={styles.humorValue}>
                {healthProfile?.dominant_humor || scores?.dominant_humor}
              </Text>
            </View>
          )}
        </View>
      )}

      {framework === 'tcm' && (healthProfile?.constitution || scores?.constitution) && (
        <View style={styles.resultsCard}>
          <Text style={styles.resultsCardTitle}>Your TCM Constitution</Text>

          <View style={styles.constitutionBadge}>
            <Text style={styles.constitutionType}>
              {(healthProfile?.constitution || scores?.constitution)?.primary_type ||
                scores?.primary_pattern ||
                'Balanced'}
            </Text>
          </View>

          {(healthProfile?.constitution || scores?.constitution)?.patterns &&
            (healthProfile?.constitution || scores?.constitution).patterns.length > 0 && (
              <View style={styles.patternsContainer}>
                <Text style={styles.patternsTitle}>Primary Patterns:</Text>
                {(healthProfile?.constitution || scores?.constitution).patterns
                  .slice(0, 3)
                  .map((pattern: string, idx: number) => (
                    <Text key={idx} style={styles.patternItem}>
                      • {pattern}
                    </Text>
                  ))}
              </View>
            )}

          {scores?.secondary_pattern && (
            <View style={styles.secondaryPattern}>
              <Text style={styles.secondaryLabel}>Secondary Pattern:</Text>
              <Text style={styles.secondaryValue}>{scores.secondary_pattern}</Text>
            </View>
          )}
        </View>
      )}

      {framework === 'modern' && (healthProfile || scores) && (
        <View style={styles.resultsCard}>
          <Text style={styles.resultsCardTitle}>Health Profile Summary</Text>

          {healthProfile?.bmi && (
            <View style={styles.healthMetric}>
              <Text style={styles.healthMetricLabel}>BMI</Text>
              <Text style={styles.healthMetricValue}>
                {typeof healthProfile.bmi === 'number'
                  ? healthProfile.bmi.toFixed(1)
                  : healthProfile.bmi.value?.toFixed(1) || 'N/A'}
              </Text>
              {healthProfile.bmi.category && (
                <Text style={styles.healthMetricCategory}>({healthProfile.bmi.category})</Text>
              )}
            </View>
          )}

          {scores?.bmi && !healthProfile?.bmi && (
            <View style={styles.healthMetric}>
              <Text style={styles.healthMetricLabel}>BMI</Text>
              <Text style={styles.healthMetricValue}>{scores.bmi.toFixed(1)}</Text>
              {scores.bmi_category && (
                <Text style={styles.healthMetricCategory}>({scores.bmi_category})</Text>
              )}
            </View>
          )}

          {healthProfile?.nutritionalNeeds && (
            <View style={styles.nutritionalNeeds}>
              <Text style={styles.nutritionalNeedsTitle}>Daily Nutritional Needs:</Text>
              <Text style={styles.nutritionalNeedsText}>
                Calories: {healthProfile.nutritionalNeeds.calories || scores?.recommended_calories || scores?.tdee || 'N/A'} kcal
              </Text>
              {healthProfile.nutritionalNeeds.protein && (
                <Text style={styles.nutritionalNeedsText}>
                  Protein: {healthProfile.nutritionalNeeds.protein}g
                </Text>
              )}
            </View>
          )}

          {scores?.recommended_calories && !healthProfile?.nutritionalNeeds && (
            <View style={styles.nutritionalNeeds}>
              <Text style={styles.nutritionalNeedsTitle}>Daily Calorie Target:</Text>
              <Text style={styles.nutritionalNeedsText}>{scores.recommended_calories} kcal</Text>
            </View>
          )}
        </View>
      )}

      {showSuccessMessage && (
        <View style={styles.successMessage}>
          <Text style={styles.successMessageText}>
            Your personalized diet plan has been generated based on your{' '}
            {framework === 'ayurveda'
              ? 'dosha constitution'
              : framework === 'unani'
                ? 'mizaj temperament'
                : framework === 'tcm'
                  ? 'TCM constitution'
                  : 'health profile'}
            .
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  resultsContainer: {
    gap: 24,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  resultsIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultsSubtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  resultsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resultsCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  constitutionBadge: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#86efac',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  constitutionType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
  },
  doshaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  doshaItem: {
    alignItems: 'center',
    gap: 8,
  },
  doshaName: {
    fontSize: 14,
    color: '#64748b',
  },
  doshaPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  patternsContainer: {
    marginTop: 16,
    gap: 8,
  },
  patternsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  patternItem: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  healthMetric: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  healthMetricLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  healthMetricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  nutritionalNeeds: {
    marginTop: 16,
    gap: 8,
  },
  nutritionalNeedsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  nutritionalNeedsText: {
    fontSize: 14,
    color: '#475569',
  },
  vikritiBadge: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  vikritLabel: {
    fontSize: 13,
    color: '#92400e',
    fontWeight: '500',
    marginBottom: 4,
  },
  vikritType: {
    fontSize: 15,
    color: '#78350f',
    fontWeight: '700',
  },
  humorBadge: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  humorLabel: {
    fontSize: 14,
    color: '#0c4a6e',
    fontWeight: '500',
  },
  humorValue: {
    fontSize: 14,
    color: '#0369a1',
    fontWeight: '700',
  },
  secondaryPattern: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secondaryLabel: {
    fontSize: 14,
    color: '#14532d',
    fontWeight: '500',
  },
  secondaryValue: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '700',
  },
  healthMetricCategory: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  successMessage: {
    marginTop: 24,
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  successMessageText: {
    fontSize: 15,
    color: '#047857',
    lineHeight: 22,
    textAlign: 'center',
  },
  agniContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  agniTitle: {
    fontSize: 14,
    color: '#92400e',
    fontWeight: '600',
    marginBottom: 4,
  },
  agniType: {
    fontSize: 16,
    color: '#78350f',
    fontWeight: '700',
    marginBottom: 4,
  },
  agniDescription: {
    fontSize: 13,
    color: '#a16207',
    lineHeight: 18,
  },
});

export default AssessmentResultBlocks;
