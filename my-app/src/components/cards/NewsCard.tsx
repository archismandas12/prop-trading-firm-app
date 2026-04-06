import { useTheme } from '../../theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';


import { typography } from '../../theme/typography';

export const NewsCard = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>Latest News</Text>
        <Text style={[typography.caption, { color: colors.textSecondary }]}>See More</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <View style={styles.circle}>
            {/* Simulating the 3D money icon from the design */}
            <Text style={styles.emoji}>💸</Text>
            <View style={styles.notificationDot} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[typography.bodyLarge, { color: colors.textPrimary, marginBottom: 8 }]}>
            Start your streak strong –{'\n'}your first reward is here!
          </Text>
          <View style={styles.tagsRow}>
            <View style={styles.prizeTag}>
              <Text style={styles.prizeText}>$100</Text>
            </View>
            <Text style={styles.timeText}>1 day left</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 100, // padding for the bottom tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.cardBackground, // Light background as in design
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  emoji: {
    fontSize: 28,
  },
  notificationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.cardBackground,
  },
  content: {
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prizeTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Gold tint
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  prizeText: {
    color: '#3B82F6', // Gold text
    fontWeight: '700',
    fontSize: 12,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
});



