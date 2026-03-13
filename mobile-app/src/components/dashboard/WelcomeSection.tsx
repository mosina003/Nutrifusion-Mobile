import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface WelcomeSectionProps {
  userName?: string;
  userEmail?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName, userEmail }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = userName || userEmail?.split('@')[0] || 'User';

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>{getGreeting()}, {displayName}</Text>
          <Text style={styles.leafIcon}>🍃</Text>
        </View>
        <Text style={styles.subtitle}>Your personalized wellness journey</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  textContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginRight: 8,
  },
  leafIcon: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default WelcomeSection;
