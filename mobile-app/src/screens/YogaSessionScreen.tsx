import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const YogaSessionScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yoga Sessions</Text>
        <Text style={styles.subtitle}>
          Find balance and wellness through yoga
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardIcon}>🧘‍♀️</Text>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardDescription}>
            Personalized yoga sessions will be available here based on your
            health profile and Ayurvedic constitution.
          </Text>
        </View>

        <View style={styles.featuresList}>
          <Text style={styles.featuresTitle}>What's Coming:</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>✓</Text>
            <Text style={styles.featureText}>
              Personalized yoga routines based on your dosha
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>✓</Text>
            <Text style={styles.featureText}>
              Morning and evening session recommendations
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>✓</Text>
            <Text style={styles.featureText}>
              Video guides for each asana
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>✓</Text>
            <Text style={styles.featureText}>
              Progress tracking and mindfulness tips
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.notifyButton}>
          <Text style={styles.notifyButtonText}>Notify Me When Available</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Spacer for floating bottom nav */}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#0891b2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0f2fe',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresList: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 16,
    color: '#0891b2',
    fontWeight: 'bold',
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  notifyButton: {
    backgroundColor: '#0891b2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  notifyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default YogaSessionScreen;
