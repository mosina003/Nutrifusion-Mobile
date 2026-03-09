import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('Assessment');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Welcome to NutriFusion</Text>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '0%' }]} />
          </View>
          <Text style={styles.progressText}>0%</Text>
        </View>

        {/* Main Content Card */}
        <View style={styles.card}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name="nutrition" size={48} color="#fff" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome to NutriFusion!</Text>
          <Text style={styles.subtitle}>
            Let's create your personalized nutrition profile
          </Text>

          {/* What to Expect Section */}
          <View style={styles.expectSection}>
            <Text style={styles.expectTitle}>What to expect:</Text>
            
            <View style={styles.expectItem}>
              <Icon name="checkmark-circle-outline" size={20} color="#0891b2" />
              <Text style={styles.expectText}>
                Choose a medical framework that resonates with you
              </Text>
            </View>

            <View style={styles.expectItem}>
              <Icon name="checkmark-circle-outline" size={20} color="#0891b2" />
              <Text style={styles.expectText}>
                Answer questions about your health, lifestyle, and preferences
              </Text>
            </View>

            <View style={styles.expectItem}>
              <Icon name="checkmark-circle-outline" size={20} color="#0891b2" />
              <Text style={styles.expectText}>
                Receive personalized nutrition recommendations
              </Text>
            </View>

            <View style={styles.expectItem}>
              <Icon name="checkmark-circle-outline" size={20} color="#0891b2" />
              <Text style={styles.expectText}>
                Access your customized dashboard and meal plans
              </Text>
            </View>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Icon name="time-outline" size={24} color="#0891b2" />
              <Text style={styles.infoCardTitle}>Time Required</Text>
              <Text style={styles.infoCardText}>5-10 minutes</Text>
            </View>

            <View style={styles.infoCard}>
              <Icon name="clipboard-outline" size={24} color="#0891b2" />
              <Text style={styles.infoCardTitle}>Questions</Text>
              <Text style={styles.infoCardText}>16-20 questions</Text>
            </View>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedButtonText}>Let's Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0891b2',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  expectSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  expectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  expectItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expectText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    marginLeft: 8,
    lineHeight: 20,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  infoCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 8,
    marginBottom: 4,
  },
  infoCardText: {
    fontSize: 13,
    color: '#64748b',
  },
  getStartedButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default WelcomeScreen;
