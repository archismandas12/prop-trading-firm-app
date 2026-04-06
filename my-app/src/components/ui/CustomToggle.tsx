import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, View } from 'react-native';

interface CustomToggleProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
}

export const CustomToggle = ({ value, onValueChange }: CustomToggleProps) => {
  const { colors, isDark } = useTheme();
  const animVal = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animVal, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      tension: 60,
      friction: 8,
    }).start();
  }, [value]);

  const trackBg = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: ['#3F3F46', colors.primary || '#3B82F6'],
  });

  const thumbTranslate = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 20],
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, { backgroundColor: trackBg }]}>
        <Animated.View
          style={[styles.thumb, { transform: [{ translateX: thumbTranslate }] }]}
        />
      </Animated.View>
    </TouchableOpacity >
  );
};

const styles = StyleSheet.create({
  track: {
    width: 42,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
