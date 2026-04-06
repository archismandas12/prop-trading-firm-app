import { useTheme } from '../../theme/ThemeContext';
import { colors } from '../../theme/colors';
import React, { useEffect } from 'react';
import { Image, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface YoPipsLogoProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
  animate?: boolean;
}

// Logo image natural aspect ratio (approx 811:258 ≈ 3.14)
const LOGO_ASPECT = 3.14;

export const YoPipsLogo = ({
  width = 220,
  height,
  style,
  color,
  animate = true,
}: YoPipsLogoProps) => {
  const { colors, isDark } = useTheme();
  const actualHeight = height || width / LOGO_ASPECT;

  // Animation
  const opacity = useSharedValue(animate ? 0 : 1);
  const translateY = useSharedValue(animate ? 18 : 0);
  const scale = useSharedValue(animate ? 0.92 : 1);
  const breathScale = useSharedValue(1);

  useEffect(() => {
    if (!animate) return;

    // Initial entry animations
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.exp) });
    translateY.value = withSpring(0, { damping: 16, stiffness: 90 });
    scale.value = withDelay(100, withSpring(1, { damping: 14, stiffness: 100 }));

    // Continuous breathing animation after entry
    breathScale.value = withDelay(
      800, // wait for entry animation to finish
      withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // Loop infinitely
        true // Reverse
      )
    );
  }, [animate, opacity, translateY, scale, breathScale]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { scale: scale.value * breathScale.value },
      ] as any,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height: actualHeight,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
        animatedStyle,
      ]}
    >
      <Image
        source={require('../../../assets/yo_pips_logo.png')}
        style={{
          width,
          height: actualHeight,
          resizeMode: 'contain',
          tintColor: color || '#FFFFFF',
        }}
      />
    </Animated.View>
  );
};
