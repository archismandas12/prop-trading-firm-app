import { colors } from '../../theme/colors';
const isDark = true;
import { useTheme } from '../../theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';



interface BadgeProps {
  label: string;
  type?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, type = 'default', size = 'md' }) => {
  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  let bgColor = colors.appAccentLight;
  let textColor = colors.textPrimary;

  switch (type) {
    case 'success':
      bgColor = 'rgba(22, 163, 74, 0.1)';
      textColor = colors.success;
      break;
    case 'warning':
      bgColor = 'rgba(250, 204, 21, 0.1)';
      textColor = colors.warning;
      break;
    case 'danger':
      bgColor = 'rgba(220, 38, 38, 0.1)';
      textColor = colors.danger;
      break;
    case 'info':
      bgColor = 'rgba(59, 130, 246, 0.1)';
      textColor = colors.info;
      break;
    default:
      bgColor = colors.appAccentLight;
      textColor = colors.textPrimary;
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.text, { color: textColor }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSm: {
    fontSize: 10,
  }
});



