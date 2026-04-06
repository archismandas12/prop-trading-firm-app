import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Input } from '../components/ui/Input';
import { LinearGradient } from 'expo-linear-gradient';
import { YoPipsLogo } from '../components/ui/Logo';
import { AuthBackground } from '../components/ui/AuthBackground';

export const ForgotPasswordScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');

  // --- Animations ---
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(30)).current;

  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim1, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim1, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim2, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ])
    ]).start();
  }, []);

  const handleSendOTP = () => {
    if (!email.trim()) {
      alert('Please enter your email address.');
      return;
    }
    alert('OTP Sent! Check your email.');
    navigation.navigate('OTPVerification', { email: email.trim() });
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <AuthBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={s.scrollContainer}>

          {/* Header / Logo Area */}
          <Animated.View style={[s.logoContainer, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
            <View style={{ alignItems: 'center' }}>
              <YoPipsLogo width={200} />
              <Text style={s.goatTraderText}>GOAT TRADER</Text>
            </View>
          </Animated.View>

          {/* Main Card */}
          <Animated.View style={[s.card, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
            <View style={s.headerTextContainer}>
              <Text style={s.title}>Forgot Password?</Text>
              <Text style={s.subtitle}>{email.trim() ? `We'll send a verification code to ${email.trim()}` : 'Enter your email to receive a verification code'}</Text>
            </View>

            {/* Email Field */}
            <View style={s.inputGroup}>
              <Text style={s.inputLabel}>Email Address</Text>
              <Input
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                leftIcon={<Feather name="mail" size={20} color={colors.authTextSecondary || '#8A93A6'} />}
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity activeOpacity={0.8} onPress={handleSendOTP}>
              <LinearGradient
                colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={s.primaryButton}
              >
                <Text style={s.primaryButtonText}>Send OTP</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Login Link */}
            <TouchableOpacity
              style={s.backRow}
              activeOpacity={0.6}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={16} color={colors.authTextSecondary || '#8A93A6'} />
              <Text style={s.backText}>Back to Login</Text>
            </TouchableOpacity>

          </Animated.View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.authBackground || '#090A0E',
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: -40,
  },
  goatTraderText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 4,
    marginTop: 8,
  },
  card: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  headerTextContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.authTextPrimary || '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.authTextSecondary || '#A1A1AA',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.authTextPrimary || '#FFFFFF',
    marginBottom: 4,
  },
  primaryButton: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    gap: 8,
    marginTop: 8,
    marginBottom: 24,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },
  backRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.authTextSecondary || '#8A93A6',
  }
});




