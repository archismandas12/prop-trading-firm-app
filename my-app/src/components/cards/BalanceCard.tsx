import { colors } from '../../theme/colors';
const isDark = true;
import { useTheme } from '../../theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';


import { typography } from '../../theme/typography';
import { BackButton } from '../ui/BackButton';

interface BalanceCardProps {
  balance: string;
  name: string;
  id: string;
  status: 'Active' | 'Inactive';
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ balance, name, id, status }) => {
  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  return (
    <View style={styles.cardContainer}>
      {/* Top Section */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="lock" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
          <Text style={[typography.body, { color: colors.textSecondary }]}>Total Balance</Text>
        </View>
        <TouchableOpacity style={styles.eyeBtn} accessible={true} accessibilityLabel="Toggle balance visibility">
          <Feather name="eye" size={16} color={colors.iconDark} />
        </TouchableOpacity>
      </View>

      {/* Balance */}
      <Text style={[typography.balanceLarge, { color: colors.textPrimary, marginTop: 4 }]}>
        ${balance}
      </Text>

      {/* Badges Overlay */}
      <View style={styles.badgesContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Name: <Text style={{ color: colors.textPrimary }}>{name}</Text></Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>ID: <Text style={{ color: colors.textPrimary }}>{id}</Text></Text>
        </View>
      </View>
      <View style={[styles.badge, { width: 100, marginTop: 8 }]}>
        <Text style={styles.badgeText}>Status: <Text style={{ color: colors.primary }}>{status}</Text></Text>
      </View>

      {/* Abstract Design Element - Bottom Right */}
      {/* We represent this with a big styled text in the background to match the glowing green S in the reference */}
      <View style={styles.abstractGraphicContainer}>
        <Text style={styles.abstractGraphicText}>$</Text>
      </View>

      {/* Bottom Controls */}
      <View style={styles.footerControls}>
        <BackButton />

        <View style={styles.pillControl}>
          <Text style={[typography.caption, { color: colors.textPrimary, fontWeight: '600' }]}>All Cards</Text>
          <View style={styles.dots}>
            <View style={[styles.dot, { backgroundColor: colors.textPrimary }]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        <TouchableOpacity style={styles.circleBtn}>
          <Feather name="arrow-right" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 32,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    height: 380, // Giving it explicit height to match the vertical presence in design
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border, // subtle edge
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  badge: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  abstractGraphicContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: -1,
    opacity: 0.9,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  abstractGraphicText: {
    fontSize: 220,
    fontWeight: '900',
    color: colors.primary,
    fontStyle: 'italic',
    lineHeight: 220,
    transform: [{ rotate: '15deg' }, { translateY: 40 }, { translateX: 20 }],
  },
  footerControls: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillControl: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textTertiary,
  },
});



