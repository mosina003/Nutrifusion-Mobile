import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Ayurveda health profile
interface AyurvedaHealthProfile {
  prakriti: {
    dosha_type: string;
  };
  vikriti: {
    dominant: string;
  };
  agni: {
    name: string;
    type: string;
  };
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

interface StatusChipsProps {
  healthProfile: HealthProfile;
  framework?: string;
}

export const StatusChips: React.FC<StatusChipsProps> = ({
  healthProfile,
  framework = 'ayurveda',
}) => {
  // Ayurveda rendering
  if (framework === 'ayurveda' && 'prakriti' in healthProfile) {
    return (
      <View style={[styles.container, styles.ayurvedaContainer]}>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Constitution:</Text>
          <View style={[styles.chip, styles.blueChip]}>
            <Text style={styles.chipText}>{healthProfile.prakriti.dosha_type}</Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Current State:</Text>
          <View style={[styles.chip, styles.amberChip]}>
            <Text style={styles.chipText}>{healthProfile.vikriti.dominant} elevated</Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Digestive Fire:</Text>
          <View style={[styles.chip, styles.greenChip]}>
            <Text style={styles.chipText}>{healthProfile.agni.name}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Unani rendering
  if (framework === 'unani' && 'primary_mizaj' in healthProfile) {
    return (
      <View style={[styles.container, styles.unaniContainer]}>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Mizaj:</Text>
          <View style={[styles.chip, styles.purpleChip]}>
            <Text style={styles.chipText}>{healthProfile.primary_mizaj}</Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Dominant Humor:</Text>
          <View style={[styles.chip, styles.indigoChip]}>
            <Text style={styles.chipText}>{healthProfile.dominant_humor}</Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Digestive:</Text>
          <View style={[styles.chip, styles.greenChip]}>
            <Text style={styles.chipText}>{healthProfile.digestive_strength}</Text>
          </View>
        </View>
      </View>
    );
  }

  // TCM rendering
  if (framework === 'tcm' && 'primary_pattern' in healthProfile) {
    return (
      <View style={[styles.container, styles.tcmContainer]}>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Pattern:</Text>
          <View style={[styles.chip, styles.redChip]}>
            <Text style={styles.chipText}>{healthProfile.primary_pattern}</Text>
          </View>
        </View>
        {healthProfile.secondary_pattern && (
          <View style={styles.chipRow}>
            <Text style={styles.label}>Secondary:</Text>
            <View style={[styles.chip, styles.orangeChip]}>
              <Text style={styles.chipText}>{healthProfile.secondary_pattern}</Text>
            </View>
          </View>
        )}
        <View style={styles.chipRow}>
          <Text style={styles.label}>Nature:</Text>
          <View style={[styles.chip, styles.cyanChip]}>
            <Text style={styles.chipText}>{healthProfile.cold_heat}</Text>
          </View>
        </View>
      </View>
    );
  }

  // Modern rendering
  if (framework === 'modern' && 'bmi' in healthProfile) {
    return (
      <View style={[styles.container, styles.modernContainer]}>
        <View style={styles.chipRow}>
          <Text style={styles.label}>BMI:</Text>
          <View style={[styles.chip, styles.slateChip]}>
            <Text style={styles.chipText}>
              {healthProfile.bmi.toFixed(1)} ({healthProfile.bmi_category})
            </Text>
          </View>
        </View>
        <View style={styles.chipRow}>
          <Text style={styles.label}>Risk Level:</Text>
          <View style={[styles.chip, styles.amberChip]}>
            <Text style={styles.chipText}>{healthProfile.metabolic_risk_level}</Text>
          </View>
        </View>
        {healthProfile.primary_goal && (
          <View style={styles.chipRow}>
            <Text style={styles.label}>Goal:</Text>
            <View style={[styles.chip, styles.greenChip]}>
              <Text style={styles.chipText}>{healthProfile.primary_goal}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  ayurvedaContainer: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  unaniContainer: {
    backgroundColor: '#F5F3FF',
    borderColor: '#DDD6FE',
  },
  tcmContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  modernContainer: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginRight: 8,
    minWidth: 100,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  blueChip: {
    backgroundColor: '#DBEAFE',
  },
  amberChip: {
    backgroundColor: '#FEF3C7',
  },
  greenChip: {
    backgroundColor: '#D1FAE5',
  },
  purpleChip: {
    backgroundColor: '#E9D5FF',
  },
  indigoChip: {
    backgroundColor: '#E0E7FF',
  },
  redChip: {
    backgroundColor: '#FEE2E2',
  },
  orangeChip: {
    backgroundColor: '#FFEDD5',
  },
  cyanChip: {
    backgroundColor: '#CFFAFE',
  },
  slateChip: {
    backgroundColor: '#E2E8F0',
  },
});
