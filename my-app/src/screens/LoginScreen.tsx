import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { Input } from '../components/ui/Input';
import { LinearGradient } from 'expo-linear-gradient';
import { YoPipsLogo } from '../components/ui/Logo';
import { AuthBackground } from '../components/ui/AuthBackground';

export const LoginScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Animations ---
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(30)).current;

  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;

  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim3 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeAnim1, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim1, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim2, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(slideAnim3, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ])
    ]).start();
  }, []);

  const handleLogin = () => {
    console.log("Login button pressed. Navigating to ActiveDashboard...");
    navigation.replace('ActiveDashboard');
  };

  return (
    <SafeAreaView style={s.safeArea}>
      <AuthBackground />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={s.scrollContainer} keyboardShouldPersistTaps="handled" bounces={false}>

          {/* Header / Logo Area */}
          <Animated.View style={[s.logoContainer, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }], zIndex: 10 }]}>
            <View style={{ alignItems: 'center' }}>
              <YoPipsLogo width={200} />
              <Text style={s.goatTraderText}>GOAT TRADER</Text>
            </View>
          </Animated.View>

          {/* Main Content Area (Seamless) */}
          <Animated.View style={[s.card, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
            <View style={s.headerTextContainer}>
              <Text style={s.title}>Welcome Back,{'\n'}Legend</Text>
              <Text style={s.subtitle}>Access your elite trading dashboard</Text>
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

            {/* Password Field */}
            <View style={s.inputGroup}>
              <View style={s.passwordLabelRow}>
                <Text style={s.inputLabel}>Password</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('ForgotPassword')}>
                  <Text style={s.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                leftIcon={<Feather name="lock" size={20} color={colors.authTextSecondary || '#8A93A6'} />}
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity activeOpacity={0.8} onPress={handleLogin} style={{ zIndex: 10 }}>
              <LinearGradient
                colors={['#60A5FA', '#3B82F6']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={s.loginButton}
              >
                <Text style={s.loginButtonText}>Sign In</Text>
              </LinearGradient>
            </TouchableOpacity>


            {/* Sign Up Link */}
            <View style={s.signupRow}>
              <Text style={s.signupText}>New to the elite circle? </Text>
              <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('CreateAccount')}>
                <Text style={s.createAccountText}>Create an Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

            {/* Footer Links */}
          <Animated.View style={[s.footer, { opacity: fadeAnim3, transform: [{ translateY: slideAnim3 }], zIndex: 10 }]}>
            <TouchableOpacity onPress={() => alert('Privacy Policy\n\nYour data is protected under our privacy standards. Visit yopips.com/privacy for details.')}><Text style={s.footerLink}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Terms of Service\n\nBy using Yo Pips you agree to our terms. Visit yopips.com/terms for details.')}><Text style={s.footerLink}>Terms of Service</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Help Center\n\nNeed help? Contact support@yopips.com or visit yopips.com/help')}><Text style={s.footerLink}>Help Center</Text></TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.authBackground || '#0d0f11',
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
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.authTextPrimary || '#FFFFFF',
    marginBottom: 4,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.authPrimaryButton || '#3B82F6',
  },
  loginButton: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    gap: 8,
    marginTop: 12,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.authInputBorder || '#2A2C2E',
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.authTextSecondary || '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.authInputBorder || '#2A2C2E',
    backgroundColor: 'transparent',
    gap: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.authTextPrimary || '#FFFFFF',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  signupText: {
    fontSize: 14,
    color: colors.authTextSecondary || '#A1A1AA',
  },
  createAccountText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.authPrimaryButton || '#3B82F6',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 60,
  },
  footerLink: {
    fontSize: 12,
    color: colors.authTextSecondary || '#8A93A6',
    fontWeight: '500',
  },
});




