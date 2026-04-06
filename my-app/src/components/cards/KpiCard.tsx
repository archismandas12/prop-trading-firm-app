import { colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Platform, Animated, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';


interface KpiCardProps {
  label: string;
  value: string;
  icon?: keyof typeof Feather.glyphMap;
  showInfo?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, showInfo }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 5,
    }).start();
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} style={{ flex: 1 }}>
      <Animated.View style={[s.card, { transform: [{ scale: scaleValue }] }]}>
        <View style={s.content}>
          <View style={s.header}>
            {icon && (
              <View style={s.iconWrap}>
                <Feather name={icon} size={14} color="#3B82F6" />
              </View>
            )}
            <Text style={s.labelText}>{label}</Text>
            {showInfo && <Feather name="info" size={13} color={colors.textTertiary} style={{ marginLeft: 'auto' }} />}
          </View>
          <Text style={s.valueText} numberOfLines={1} adjustsFontSizeToFit>{value}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24, // Matching Image 1 rounded style
    flex: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(15, 23, 42, 0.04)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: { elevation: 2 },
      web: {
        boxShadow: '0px 8px 24px rgba(15, 23, 42, 0.04)',
      } as any,
    }),
  },
  content: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.successBg, // Soft teal ring
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  labelText: {
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  valueText: {
    fontSize: 28,
    color: colors.textPrimary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
});
