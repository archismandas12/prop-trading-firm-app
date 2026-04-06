import { colors } from '../../theme/colors';
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number;
  color?: string; // Ignored for Fintech gradient
  trackColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = 8, 
  color = colors.primary, 
  trackColor = colors.border 
}) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: Math.min(Math.max(progress, 0), 100),
      useNativeDriver: false,
      bounciness: 4,
      speed: 12,
    }).start();
  }, [progress]);

  const widthInterpolated = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }]}>
      <Animated.View style={[styles.fillContainer, { width: widthInterpolated }]}>
        <LinearGradient
          colors={[colors.secondary, colors.accent]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.fill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  fillContainer: {
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  fill: {
    width: '100%',
    height: '100%',
  },
});
