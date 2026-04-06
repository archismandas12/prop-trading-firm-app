import { colors } from '../../theme/colors';
const isDark = true;
//import { useTheme } from '../../theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { typography } from '../../theme/typography';

interface HeaderProps {
  userName: string;
  avatarUrl?: string;
}

export const DashboardHeader: React.FC<HeaderProps> = ({ userName, avatarUrl }) => {
  const insets = useSafeAreaInsets();
  const styles = React.useMemo(() => getStyles(colors, isDark, insets), [colors, isDark, insets]);

  return (
    <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
      <View style={styles.container}>
        <View style={styles.profileSection}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require('../../../assets/icon.png')
            }
            style={styles.avatar}
          />
          <Text style={[typography.h3, styles.greeting]}>Hi, {userName}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="user-plus" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
};

const getStyles = (colors: any, isDark: boolean, insets: any) => StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Math.max(insets.top, 16),
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)', // Very soft border
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  greeting: {
    color: colors.appTextPrimary,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)', // Light blue background
    justifyContent: 'center',
    alignItems: 'center',
  },
});
