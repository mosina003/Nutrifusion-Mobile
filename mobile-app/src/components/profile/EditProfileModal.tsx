import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView as RNScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createHealthProfile, updateMyProfile } from '../../services/api';

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentData: any;
  onSave: () => void;
}

type TabType = 'basic' | 'health' | 'lifestyle' | 'dietary';

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isVisible,
  onClose,
  currentData,
  onSave,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    bloodPressure: '',
    bloodSugar: '',
    cholesterol: '',
    waist: '',
    sleepHours: '',
    stressLevel: 'Medium',
    activityLevel: 'Moderate',
    appetite: 'Normal',
    allergies: [] as string[],
    chronicConditions: [] as string[],
  });

  const [currentInput, setCurrentInput] = useState({ allergy: '', condition: '' });

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleClose = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
      return;
    }

    bottomSheetModalRef.current?.dismiss();
  }, [isVisible]);

  useEffect(() => {
    if (currentData) {
      setFormData({
        name: currentData.identity?.name || currentData.name || '',
        age: currentData.identity?.age?.toString() || currentData.age?.toString() || '',
        gender: currentData.identity?.gender || currentData.gender || '',
        height:
          currentData.clinicalMetrics?.anthropometric?.height?.toString() ||
          currentData.height?.toString() ||
          '',
        weight:
          currentData.clinicalMetrics?.anthropometric?.weight?.toString() ||
          currentData.weight?.toString() ||
          '',
        bloodPressure:
          currentData.clinicalMetrics?.metabolic?.bloodPressure ||
          currentData.bloodPressure?.toString() ||
          '',
        bloodSugar:
          currentData.clinicalMetrics?.metabolic?.bloodSugar ||
          currentData.bloodSugar?.toString() ||
          '',
        cholesterol:
          currentData.clinicalMetrics?.metabolic?.cholesterol ||
          currentData.cholesterol?.toString() ||
          '',
        waist:
          currentData.clinicalMetrics?.anthropometric?.waist?.toString() ||
          currentData.waist?.toString() ||
          '',
        sleepHours:
          currentData.lifestyleIndicators?.sleepDuration?.toString() ||
          currentData.sleepHours?.toString() ||
          '',
        stressLevel: currentData.lifestyleIndicators?.stressLevel || 'Medium',
        activityLevel: currentData.lifestyleIndicators?.activityLevel || 'Moderate',
        appetite: currentData.lifestyleIndicators?.appetite || 'Normal',
        allergies: currentData.dietaryInfo?.restrictions || currentData.allergies || [],
        chronicConditions:
          currentData.dietaryInfo?.chronicConditions || currentData.chronicConditions || [],
      });
    }
  }, [currentData]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const parsedAge = parseInt(formData.age, 10);
      const parsedHeight = parseFloat(formData.height);
      const parsedWeight = parseFloat(formData.weight);
      const parsedSleepHours = parseFloat(formData.sleepHours);
      const parsedWaist = parseFloat(formData.waist);

      // 1) Update basic profile
      await updateMyProfile({
        name: formData.name,
        age: Number.isNaN(parsedAge) ? undefined : parsedAge,
        gender: formData.gender || undefined,
        height: Number.isNaN(parsedHeight) ? undefined : parsedHeight,
        weight: Number.isNaN(parsedWeight) ? undefined : parsedWeight,
        allergies: formData.allergies,
        chronicConditions: formData.chronicConditions,
      });

      // 2) Create a fresh health profile snapshot
      await createHealthProfile({
        lifestyle: {
          sleepHours: Number.isNaN(parsedSleepHours) ? undefined : parsedSleepHours,
          stressLevel: formData.stressLevel,
          activityLevel: formData.activityLevel,
        },
        digestionIndicators: {
          appetite: formData.appetite,
        },
        metabolicMarkers: {
          bloodPressure: formData.bloodPressure || undefined,
          bloodSugar: formData.bloodSugar || undefined,
          cholesterol: formData.cholesterol || undefined,
        },
        anthropometric: {
          waist: Number.isNaN(parsedWaist) ? undefined : parsedWaist,
        },
      });

      Alert.alert('Success', 'Profile updated successfully!');
      onSave();
      bottomSheetModalRef.current?.dismiss();
    } catch (error: any) {
      const message =
        error?.message ||
        'Unable to save profile. Please check your connection and backend server.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const addAllergy = () => {
    if (
      currentInput.allergy.trim() &&
      !formData.allergies.includes(currentInput.allergy.trim())
    ) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, currentInput.allergy.trim()],
      });
      setCurrentInput({ ...currentInput, allergy: '' });
    }
  };

  const removeAllergy = (index: number) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== index),
    });
  };

  const addCondition = () => {
    if (
      currentInput.condition.trim() &&
      !formData.chronicConditions.includes(currentInput.condition.trim())
    ) {
      setFormData({
        ...formData,
        chronicConditions: [...formData.chronicConditions, currentInput.condition.trim()],
      });
      setCurrentInput({ ...currentInput, condition: '' });
    }
  };

  const removeCondition = (index: number) => {
    setFormData({
      ...formData,
      chronicConditions: formData.chronicConditions.filter((_, i) => i !== index),
    });
  };

  const calculateBMI = () => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height) / 100;
      const bmi = parseFloat(formData.weight) / Math.pow(heightInMeters, 2);
      return bmi.toFixed(1);
    }
    return null;
  };

  const renderTabButton = (tab: TabType, label: string, iconName: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
      activeOpacity={0.7}
    >
      <Icon
        name={iconName}
        size={20}
        color={activeTab === tab ? '#0891b2' : '#64748b'}
      />
      <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      keyboardBehavior={Platform.OS === 'ios' ? 'interactive' : 'extend'}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View style={styles.sheetContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Icon name="account-edit" size={24} color="#ffffff" />
              <Text style={styles.headerTitle}>Edit Profile</Text>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <RNScrollView
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.tabsContainer}
            contentContainerStyle={styles.tabsContent}
          >
            {renderTabButton('basic', 'Basic', 'account')}
            {renderTabButton('health', 'Health', 'heart-pulse')}
            {renderTabButton('lifestyle', 'Lifestyle', 'run')}
            {renderTabButton('dietary', 'Dietary', 'food-apple')}
          </RNScrollView>

          {/* Form Content */}
          <BottomSheetScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.formContentContainer}
          >
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(text) => setFormData({ ...formData, name: text })}
                    placeholder="Enter your full name"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.age}
                      onChangeText={(text) => setFormData({ ...formData, age: text })}
                      placeholder="Age"
                      keyboardType="numeric"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.pickerContainer}>
                      {['Male', 'Female', 'Other'].map((gender) => (
                        <TouchableOpacity
                          key={gender}
                          style={[
                            styles.pickerOption,
                            formData.gender === gender && styles.pickerOptionActive,
                          ]}
                          onPress={() => setFormData({ ...formData, gender })}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              styles.pickerText,
                              formData.gender === gender && styles.pickerTextActive,
                            ]}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                          >
                            {gender}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Height (cm)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.height}
                      onChangeText={(text) => setFormData({ ...formData, height: text })}
                      placeholder="170"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={[styles.inputGroup, styles.halfWidth]}>
                    <Text style={styles.label}>Weight (kg)</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.weight}
                      onChangeText={(text) => setFormData({ ...formData, weight: text })}
                      placeholder="70"
                      keyboardType="decimal-pad"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                {calculateBMI() && (
                  <View style={styles.bmiCard}>
                    <Text style={styles.bmiLabel}>Calculated BMI</Text>
                    <Text style={styles.bmiValue}>{calculateBMI()}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Health Metrics Tab */}
            {activeTab === 'health' && (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Waist Circumference (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.waist}
                    onChangeText={(text) => setFormData({ ...formData, waist: text })}
                    placeholder="Optional"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Blood Pressure</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.bloodPressure}
                    onChangeText={(text) => setFormData({ ...formData, bloodPressure: text })}
                    placeholder="e.g., 120/80"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Blood Sugar (mg/dL)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.bloodSugar}
                    onChangeText={(text) => setFormData({ ...formData, bloodSugar: text })}
                    placeholder="e.g., 95 mg/dL"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Cholesterol (mg/dL)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.cholesterol}
                    onChangeText={(text) => setFormData({ ...formData, cholesterol: text })}
                    placeholder="e.g., 180 mg/dL"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              </View>
            )}

            {/* Lifestyle Tab */}
            {activeTab === 'lifestyle' && (
              <View style={styles.tabContent}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Sleep Hours (per night)</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.sleepHours}
                    onChangeText={(text) => setFormData({ ...formData, sleepHours: text })}
                    placeholder="8"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#94a3b8"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Stress Level</Text>
                  <View style={styles.pickerContainer}>
                    {['Low', 'Medium', 'High'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.pickerOption,
                          formData.stressLevel === level && styles.pickerOptionActive,
                        ]}
                        onPress={() => setFormData({ ...formData, stressLevel: level })}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            formData.stressLevel === level && styles.pickerTextActive,
                          ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Activity Level</Text>
                  <View style={styles.pickerContainer}>
                    {['Sedentary', 'Moderate', 'Active'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.pickerOption,
                          formData.activityLevel === level && styles.pickerOptionActive,
                        ]}
                        onPress={() => setFormData({ ...formData, activityLevel: level })}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            formData.activityLevel === level && styles.pickerTextActive,
                          ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Appetite</Text>
                  <View style={styles.pickerContainer}>
                    {['Low', 'Normal', 'High'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.pickerOption,
                          formData.appetite === level && styles.pickerOptionActive,
                        ]}
                        onPress={() => setFormData({ ...formData, appetite: level })}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.pickerText,
                            formData.appetite === level && styles.pickerTextActive,
                          ]}
                          numberOfLines={1}
                          adjustsFontSizeToFit
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {/* Dietary & Health Tab */}
            {activeTab === 'dietary' && (
              <View style={styles.tabContent}>
                {/* Allergies */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Food Restrictions / Allergies</Text>
                  <View style={styles.addInputContainer}>
                    <TextInput
                      style={[styles.input, styles.addInput]}
                      value={currentInput.allergy}
                      onChangeText={(text) =>
                        setCurrentInput({ ...currentInput, allergy: text })
                      }
                      placeholder="e.g., Dairy, Nuts, Gluten"
                      placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tagsContainer}>
                    {formData.allergies.map((allergy, index) => (
                      <View key={index} style={[styles.tag, styles.tagDanger]}>
                        <Text style={styles.tagText}>{allergy}</Text>
                        <TouchableOpacity onPress={() => removeAllergy(index)}>
                          <Icon name="close-circle" size={18} color="#dc2626" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {formData.allergies.length === 0 && (
                      <Text style={styles.emptyText}>None reported</Text>
                    )}
                  </View>
                </View>

                {/* Chronic Conditions */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Chronic Health Conditions</Text>
                  <View style={styles.addInputContainer}>
                    <TextInput
                      style={[styles.input, styles.addInput]}
                      value={currentInput.condition}
                      onChangeText={(text) =>
                        setCurrentInput({ ...currentInput, condition: text })
                      }
                      placeholder="e.g., Diabetes Type 2"
                      placeholderTextColor="#94a3b8"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addCondition}>
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tagsContainer}>
                    {formData.chronicConditions.map((condition, index) => (
                      <View key={index} style={[styles.tag, styles.tagWarning]}>
                        <Text style={styles.tagText}>{condition}</Text>
                        <TouchableOpacity onPress={() => removeCondition(index)}>
                          <Icon name="close-circle" size={18} color="#ea580c" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {formData.chronicConditions.length === 0 && (
                      <Text style={styles.emptyText}>None reported</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </BottomSheetScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.saveButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <Icon name="content-save" size={20} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#f0f9ff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handleIndicator: {
    backgroundColor: '#7dd3fc',
    width: 44,
  },
  sheetContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: '#0891b2',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#bae6fd',
    backgroundColor: '#f0f9ff',
    maxHeight: 50,
  },
  tabsContent: {
    paddingVertical: 0,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0891b2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#0891b2',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  formContentContainer: {
    paddingBottom: 24,
  },
  tabContent: {
    paddingTop: 12,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#0f172a',
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
    marginBottom: 0,
  },
  pickerContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'nowrap',
  },
  pickerOption: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerOptionActive: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  pickerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  pickerTextActive: {
    color: '#ffffff',
  },
  bmiCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  bmiLabel: {
    fontSize: 14,
    color: '#0e7490',
    marginBottom: 4,
  },
  bmiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  addInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#0891b2',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  tagDanger: {
    backgroundColor: '#fee2e2',
  },
  tagWarning: {
    backgroundColor: '#ffedd5',
  },
  tagText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#bae6fd',
    backgroundColor: '#f0f9ff',
    shadowColor: '#0369a1',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e7490',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#0891b2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default EditProfileModal;
