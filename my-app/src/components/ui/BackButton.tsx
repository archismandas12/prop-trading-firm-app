import { colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


interface BackButtonProps {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const BackButton = ({ onPress, style }: BackButtonProps) => {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[styles.backButton, style]}
      onPress={onPress || (() => navigation.goBack())}
      activeOpacity={0.7}
    >
      <Feather name="chevron-left" size={20} color="#3B82F6" style={{ marginLeft: -2 }} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: '#2A2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'transparent',
    elevation: 0,
  }
});
