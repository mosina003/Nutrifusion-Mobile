import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import AssessmentResultBlocks from '../components/assessment/AssessmentResultBlocks';
import { 
  getAssessmentFrameworks, 
  getAssessmentQuestions, 
  submitAssessment,
  getAssessmentHistory,
} from '../services/api';
import { useAuth } from '../context/AuthContext';

type AssessmentNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Assessment'>;
type AssessmentStep = 'selection' | 'assessment' | 'results';

interface Framework {
  id: string;
  label: string;
  description: string;
  icon: string;
  questionCount?: string;
}

const AssessmentScreen = () => {
  const navigation = useNavigation<AssessmentNavigationProp>();
  const route = useRoute<any>();
  const { user, setAuthUser, logout } = useAuth();
  
  // State management
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('selection');
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.showLatestResult) {
      loadLatestAssessmentResult();
      return;
    }
    loadFrameworks();
  }, [route.params?.showLatestResult]);

  const loadLatestAssessmentResult = async () => {
    try {
      setLoading(true);
      const response = await getAssessmentHistory();
      const assessments = response?.assessments || [];

      if (!assessments.length) {
        Alert.alert('No Report Found', 'No assessment result is available yet.');
        navigation.goBack();
        return;
      }

      const latest = assessments[0];
      setSelectedFramework(latest.framework || '');
      setAssessmentResults(latest);
      setCurrentStep('results');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load assessment report');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const loadFrameworks = async () => {
    try {
      setLoading(true);
      const response = await getAssessmentFrameworks();
      if (response.success && response.data?.frameworks) {
        const frameworksData = response.data.frameworks.map((fw: any) => ({
          ...fw,
          icon: getFrameworkIcon(fw.id),
          questionCount: getQuestionCount(fw.id),
        }));
        setFrameworks(frameworksData);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load frameworks');
    } finally {
      setLoading(false);
    }
  };

  const getFrameworkIcon = (id: string) => {
    switch (id) {
      case 'ayurveda': return '🌿';
      case 'unani': return '❤️';
      case 'tcm': return '💡';
      case 'modern': return '🔬';
      default: return '📋';
    }
  };

  const getQuestionCount = (id: string) => {
    switch (id) {
      case 'ayurveda': return '18 questions • 5 categories';
      case 'unani': return '16 questions • 5 categories';
      case 'tcm': return '18 questions • 5 categories';
      case 'modern': return '20 questions • Clinical assessment';
      default: return '';
    }
  };

  const handleFrameworkSelection = async (frameworkId: string) => {
    setSelectedFramework(frameworkId);
    setLoading(true);
    setError(null);

    try {
      const response = await getAssessmentQuestions(frameworkId);
      if (response.success && response.data?.questions) {
        const questionsData = response.data.questions.questions || [];
        setQuestions(questionsData);
        setCurrentStep('assessment');
        setCurrentQuestionIndex(0);
        setResponses({});
      } else {
        Alert.alert('Error', 'No questions available for this framework');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to load assessment questions');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
    setSelectedFramework('');
    setQuestions([]);
    setResponses({});
    setCurrentQuestionIndex(0);
    setError(null);
  };

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    if (error) setError(null);
  };

  const isCurrentQuestionAnswered = () => {
    if (!questions[currentQuestionIndex]) return false;
    const question = questions[currentQuestionIndex];
    const response = responses[question.id];
    
    if (!response) return false;
    
    // For modern framework with structured responses
    if (selectedFramework === 'modern' && response.value !== undefined) {
      if (Array.isArray(response.value)) {
        return response.value.length > 0;
      }
      return response.value !== '' && response.value !== null;
    }
    
    // For traditional frameworks (Ayurveda, Unani, TCM) - check if option object exists
    if (typeof response === 'object' && response.dosha) {
      return true;
    }
    
    return response !== undefined && response !== '';
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (currentQuestion?.required && !isCurrentQuestionAnswered()) {
      setError('Please answer this question before proceeding');
      return;
    }
    
    setError(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setError(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all required questions are answered
    const unansweredQuestions = questions.filter(q => !responses[q.id]);
    if (unansweredQuestions.length > 0) {
      Alert.alert(
        'Incomplete Assessment',
        `Please answer all ${questions.length} questions before submitting. You have ${unansweredQuestions.length} unanswered questions.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Debug logging
      console.log('📤 Submitting assessment:');
      console.log('   Framework:', selectedFramework);
      console.log('   Total questions:', questions.length);
      console.log('   Total responses:', Object.keys(responses).length);
      console.log('   Response keys:', Object.keys(responses));
      console.log('   First 3 responses:', JSON.stringify(
        Object.entries(responses).slice(0, 3).reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {}),
        null,
        2
      ));

      const response = await submitAssessment({
        framework: selectedFramework,
        responses
      });

      console.log('✅ Submission response:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        console.log('📊 Setting assessment results:', JSON.stringify(response.data, null, 2));
        setAssessmentResults(response.data);
        setCurrentStep('results');
        
        // Don't update hasCompletedAssessment here - do it when user clicks "View Dashboard"
        // This prevents the navigator from auto-redirecting before showing results
      } else {
        const errorMsg = response.message || response.error || 'Failed to submit assessment';
        console.error('❌ Submission failed:', errorMsg);
        Alert.alert('Submission Failed', errorMsg);
      }
    } catch (err: any) {
      console.error('❌ Submission error:', err);
      const errorMsg = err.message || 'An error occurred while submitting assessment';
      Alert.alert('Submission Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDashboard = () => {
    // Update user context to mark assessment as complete
    if (user) {
      setAuthUser({
        ...user,
        hasCompletedAssessment: true,
        preferredMedicalFramework: selectedFramework
      });
    }
    // Navigate to dashboard (will trigger MainTabs to appear)
    navigation.navigate('MainTabs');
  };

  const progressPercentage = questions.length > 0 
    ? ((currentQuestionIndex + 1) / questions.length) * 100 
    : 0;

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? Your assessment progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  // RENDER: Framework Selection
  if (currentStep === 'selection') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Medical Framework</Text>
          <Text style={styles.subtitle}>
            Select the approach that best aligns with your health philosophy
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0891b2" />
          </View>
        ) : (
          <View style={styles.frameworksGrid}>
            {frameworks.map((framework) => {
              const isSelected = selectedFramework === framework.id;
              return (
                <TouchableOpacity
                  key={framework.id}
                  style={[
                    styles.frameworkCard,
                    isSelected && styles.frameworkCardSelected,
                  ]}
                  onPress={() => setSelectedFramework(framework.id)}
                  activeOpacity={0.7}
                >
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓ Selected</Text>
                    </View>
                  )}
                  
                  <Text style={styles.frameworkIcon}>{framework.icon}</Text>
                  
                  <View style={styles.frameworkContent}>
                    <Text style={styles.frameworkName}>{framework.label}</Text>
                    <Text style={styles.frameworkDescription}>
                      {framework.description}
                    </Text>
                    
                    {framework.questionCount && (
                      <Text style={styles.frameworkMeta}>
                        {framework.questionCount}
                      </Text>
                    )}
                  </View>
                  
                  <TouchableOpacity
                    style={[
                      styles.selectButton,
                      isSelected && styles.selectButtonSelected
                    ]}
                    onPress={() => handleFrameworkSelection(framework.id)}
                  >
                    <Text style={[
                      styles.selectButtonText,
                      isSelected && styles.selectButtonTextSelected
                    ]}>
                      {isSelected ? 'Continue' : 'Select'}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    );
  }

  // RENDER: Assessment Form
  if (currentStep === 'assessment' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const currentResponse = responses[currentQuestion?.id];

    return (
      <View style={styles.container}>
        {/* Header with Progress */}
        <View style={styles.assessmentHeader}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.assessmentBody} contentContainerStyle={styles.scrollContent}>
          {/* Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionCategory}>{currentQuestion?.category}</Text>
            <Text style={styles.questionText}>
              {currentQuestion?.question}
              {currentQuestion?.required && <Text style={styles.requiredStar}> *</Text>}
            </Text>

            {/* Answer Input */}
            <View style={styles.answerContainer}>
              {selectedFramework === 'modern' ? (
                renderModernQuestionInput(currentQuestion, currentResponse)
              ) : (
                renderTraditionalQuestionInput(currentQuestion, currentResponse)
              )}
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationFooter}>
          <TouchableOpacity
            style={[styles.navButton, styles.backButtonNav]}
            onPress={currentQuestionIndex === 0 ? handleBackToSelection : handlePrevious}
          >
            <Text style={styles.backButtonText}>
              {currentQuestionIndex === 0 ? '← Back to Selection' : '← Previous'}
            </Text>
          </TouchableOpacity>

          {isLastQuestion ? (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Assessment</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // RENDER: Results
  if (currentStep === 'results' && assessmentResults) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.resultsContainer}>
          <AssessmentResultBlocks assessmentResults={assessmentResults} />

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleViewDashboard}
          >
            <Text style={styles.primaryButtonText}>View Dashboard →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBackToSelection}
          >
            <Text style={styles.secondaryButtonText}>Take Another Assessment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Default loading state
  return (
    <View style={[styles.container, styles.centered]}>
      <ActivityIndicator size="large" color="#0891b2" />
    </View>
  );

  // Helper render functions
  function renderModernQuestionInput(question: any, currentResponse: any) {
    switch (question.type) {
      case 'number':
        return (
          <TextInput
            style={styles.numberInput}
            keyboardType="numeric"
            value={currentResponse?.value?.toString() || ''}
            onChangeText={(text) => handleResponse(question.id, { value: text })}
            placeholder={`Enter ${question.question.toLowerCase()}`}
            placeholderTextColor="#94a3b8"
          />
        );

      case 'select':
      case 'multiselect':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option: any, idx: number) => {
              const isSelected = question.type === 'multiselect'
                ? currentResponse?.value?.includes(option.value)
                : currentResponse?.value === option.value;
                
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => {
                    if (question.type === 'multiselect') {
                      const currentValues = currentResponse?.value || [];
                      const newValues = isSelected
                        ? currentValues.filter((v: string) => v !== option.value)
                        : [...currentValues, option.value];
                      handleResponse(question.id, { value: newValues });
                    } else {
                      handleResponse(question.id, { value: option.value });
                    }
                  }}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      default:
        return null;
    }
  }

  function renderTraditionalQuestionInput(question: any, currentResponse: any) {
    if (!question.options || question.options.length === 0) return null;

    return (
      <View style={styles.optionsContainer}>
        {question.options.map((option: any, idx: number) => {
          // Check if this option is selected by comparing text or dosha
          const isSelected = currentResponse && 
            (currentResponse.text === option.text || 
             currentResponse.dosha === option.dosha);
          
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
              onPress={() => handleResponse(question.id, option)}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.text || option.label || option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fff1f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecdd3',
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Selection Screen
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  frameworksGrid: {
    gap: 16,
  },
  frameworkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  frameworkCardSelected: {
    borderColor: '#0891b2',
    backgroundColor: '#f0f9ff',
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#0891b2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  frameworkIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  frameworkContent: {
    marginBottom: 16,
  },
  frameworkName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  frameworkDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  frameworkMeta: {
    fontSize: 12,
    color: '#94a3b8',
  },
  selectButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectButtonSelected: {
    backgroundColor: '#0891b2',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0891b2',
  },
  selectButtonTextSelected: {
    color: '#ffffff',
  },
  
  // Assessment Screen
  assessmentHeader: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0891b2',
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  assessmentBody: {
    flex: 1,
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  questionCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0891b2',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 24,
    lineHeight: 26,
  },
  requiredStar: {
    color: '#ef4444',
  },
  answerContainer: {
    gap: 12,
  },
  numberInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#0f172a',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
  },
  optionButtonSelected: {
    backgroundColor: '#f0f9ff',
    borderColor: '#0891b2',
  },
  optionText: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
  },
  optionTextSelected: {
    color: '#0891b2',
    fontWeight: '600',
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
  },
  navigationFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  navButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonNav: {
    backgroundColor: '#f1f5f9',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  nextButton: {
    backgroundColor: '#0891b2',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  submitButton: {
    backgroundColor: '#0891b2',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  
  // Results Screen
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
  primaryButton: {
    backgroundColor: '#0891b2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  agniContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  agniTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9a3412',
    marginBottom: 8,
  },
  agniType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c2410c',
    marginBottom: 4,
  },
  agniDescription: {
    fontSize: 14,
    color: '#7c2d12',
    lineHeight: 20,
  },
});

export default AssessmentScreen;
