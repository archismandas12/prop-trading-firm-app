// src/theme/typography.ts

import { StyleSheet, Platform } from 'react-native';

const fontFamily = Platform.OS === 'ios' ? 'System' : 'sans-serif';
const fontHeading = Platform.OS === 'ios' ? 'System' : 'sans-serif';

export const typography = StyleSheet.create({
  h1: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
    fontFamily: fontHeading,
  },
  h2: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontFamily: fontHeading,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    fontFamily: fontHeading,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0,
    fontFamily,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.1,
    fontFamily,
  },
  caption: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    fontFamily,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
    fontFamily,
  },
  balanceLarge: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    fontFamily,
  },
  balance: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    fontFamily,
  }
});
