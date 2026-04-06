import { colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput, TextInputProps, StyleSheet, Platform, ViewStyle, StyleProp, View, Animated } from 'react-native';

interface InputProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  label?: string; // Support for Floating Labels
}

// Inject global CSS once to override browser autofill styling
let autofillStyleInjected = false;
const injectAutofillCSS = () => {
  if (autofillStyleInjected || Platform.OS !== 'web') return;
  autofillStyleInjected = true;
  const style = document.createElement('style');
  style.textContent = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    textarea:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px #1E293B inset !important;
      -webkit-text-fill-color: #F8FAFC !important;
      transition: background-color 5000s ease-in-out 0s !important;
      caret-color: #F8FAFC !important;
    }
  `;
  document.head.appendChild(style);
};

export const Input = React.forwardRef<TextInput, InputProps>(({ style, containerStyle, leftIcon, label, onFocus, onBlur, value, ...props }, ref) => {
  const { colors, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    injectAutofillCSS();
  }, []);

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: (isFocused || !!value) ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: 'absolute' as const,
    left: leftIcon ? 44 : 16,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 6],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 11],
    }),
    fontWeight: '500' as const,
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.textTertiary || '#94A3B8', colors.primary || '#3B82F6'],
    }),
    zIndex: 1,
  };

  return (
    <View style={[styles.container, containerStyle, isFocused && styles.containerFocused]}>
      {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
      
      {label && (
        <Animated.Text style={labelStyle} pointerEvents="none">
          {label}
        </Animated.Text>
      )}

      <TextInput
        ref={ref}
        value={value}
        style={[
          styles.input,
          style,
          label ? { paddingTop: 14 } : {},
          Platform.OS === 'web' ? { outline: 'none' } as any : {}
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur && onBlur(e);
        }}
        placeholderTextColor={label ? 'transparent' : (props.placeholderTextColor || colors.textTertiary || '#9CA3AF')}
        {...props}
      />
    </View>
  );
});

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.authInputBackground || '#1E293B',
    borderWidth: 1,
    borderColor: colors.authInputBorder || '#334155',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    position: 'relative',
    ...(Platform.OS === 'web' ? { transition: 'all 0.2s ease' } as any : {})
  },
  containerFocused: {
    borderColor: colors.primary || '#3B82F6',
    backgroundColor: colors.authInputBackground || '#1E293B',
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 0 0 2px ${(colors.primary || '#3B82F6')}40`
    } : {
      elevation: 2,
      shadowColor: colors.primary || '#3B82F6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    })
  } as any,
  input: {
    flex: 1,
    width: '100%',
    fontSize: 15,
    color: colors.authTextPrimary || '#F8FAFC',
    fontWeight: '500',
    height: '100%',
    letterSpacing: 0.3,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  iconContainer: {
    marginRight: 12,
    zIndex: 2,
  }
});
