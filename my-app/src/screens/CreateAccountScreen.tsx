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

export const CreateAccountScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // --- Animations ---
  const fadeAnim1 = useRef(new Animated.Value(0)).current;
  const slideAnim1 = useRef(new Animated.Value(30)).current;

  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const slideAnim2 = useRef(new Animated.Value(30)).current;

  const fadeAnim3 = useRef(new Animated.Value(0)).current;
  const slideAnim3 = useRef(new Animated.Value(30)).current;

  const fadeAnim4 = useRef(new Animated.Value(0)).current;
  const slideAnim4 = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Staggered Entry Animation grouped for smoother rendering
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(fadeAnim1, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim1, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim2, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim2, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim3, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim3, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim4, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(slideAnim4, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true })
      ])
    ]).start();
  }, []);

  const handleCreateAccount = () => {
    navigation.replace('ActiveDashboard');
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
          <View style={s.card}>

            <Animated.View style={[{ opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
              <View style={s.headerTextContainer}>
                <Text style={s.title}>Create Account</Text>
                <Text style={s.subtitle}>Join the elite prop trading firm today</Text>
              </View>
            </Animated.View>

            <Animated.View style={[{ opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
              {/* Full Name Field */}
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Full Name</Text>
                <Input
                  style={s.textInput}
                  placeholder="John Doe"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  leftIcon={<Feather name="user" size={18} color={colors.authTextSecondary || '#8A93A6'} />}
                />
              </View>

              {/* Email Field */}
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Email Address</Text>
                <Input
                  style={s.textInput}
                  placeholder="name@example.com"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  leftIcon={<Feather name="mail" size={18} color={colors.authTextSecondary || '#8A93A6'} />}
                />
              </View>
            </Animated.View>

            <Animated.View style={[{ opacity: fadeAnim3, transform: [{ translateY: slideAnim3 }] }]}>
              {/* Row: Country & Phone */}
              <View style={s.rowGroup}>
                {/* Simulated Country Dropdown */}
                <View style={[s.inputGroup, { flex: 0.55, marginRight: 12 }]}>
                  <Text style={s.inputLabel}>Country</Text>
                  <TouchableOpacity activeOpacity={0.7} style={[s.dropdownWrapper, { paddingHorizontal: 12, justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Feather name="globe" size={16} color={colors.authTextSecondary || '#8A93A6'} style={{ marginRight: 8 }} />
                      <Text
                        style={[
                          { flex: 1, fontSize: 16, fontWeight: '500', marginRight: 4 },
                          !country ? { color: colors.authTextSecondary || '#8A93A6' } : { color: colors.authTextPrimary || '#FFFFFF' }
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                      >
                        {country || "Select"}
                      </Text>
                    </View>
                    <Feather name="chevron-down" size={16} color={colors.authTextSecondary || '#8A93A6'} />
                  </TouchableOpacity>
                </View>

                {/* Phone Field */}
                <View style={[s.inputGroup, { flex: 1 }]}>
                  <Text style={s.inputLabel}>Phone Number</Text>
                  <Input
                    style={s.textInput}
                    placeholder="+1 (555) 000"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    leftIcon={<Feather name="phone" size={16} color={colors.authTextSecondary || '#8A93A6'} />}
                  />
                </View>
              </View>

              {/* Password Field */}
              <View style={s.inputGroup}>
                <Text style={s.inputLabel}>Password</Text>
                <Input
                  style={s.textInput}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  leftIcon={<Feather name="lock" size={18} color={colors.authTextSecondary || '#8A93A6'} />}
                />
              </View>
            </Animated.View>

            <Animated.View style={[{ opacity: fadeAnim4, transform: [{ translateY: slideAnim4 }] }]}>
              {/* Create Account Button */}
              <TouchableOpacity activeOpacity={0.8} onPress={handleCreateAccount}>
                <LinearGradient
                  colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={s.primaryButton}
                >
                  <Text style={s.primaryButtonText}>Create Account</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={s.dividerContainer}>
                <View style={s.divider} />
              </View>

              {/* Back to Login Link */}
              <View style={s.loginRow}>
                <Text style={s.loginText}>Already have an account? </Text>
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('Login')}>
                  <Text style={s.signInText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

          </View>

          {/* Footer Links */}
          <Animated.View style={[s.footer, { opacity: fadeAnim4, transform: [{ translateY: slideAnim4 }] }]}>
            <TouchableOpacity onPress={() => alert('Privacy Policy\n\nYour data is protected under our privacy standards. Visit yopips.com/privacy for details.')}><Text style={s.footerLink}>Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Terms of Service\n\nBy using Yo Pips you agree to our terms. Visit yopips.com/terms for details.')}><Text style={s.footerLink}>Terms of Service</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Help Center\n\nNeed help? Contact support@yopips.com or visit yopips.com/help')}><Text style={s.footerLink}>Help Center</Text></TouchableOpacity>
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
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.authTextSecondary || '#A1A1AA',
    textAlign: 'center',
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.authTextPrimary || '#FFFFFF',
    marginBottom: 4,
  },
  rowGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.authInputBackground || '#11141B',
    borderWidth: 1,
    borderColor: colors.authInputBorder || '#1C1F26',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48, // matching the new Input global height
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.authTextPrimary || '#FFFFFF',
    fontWeight: '500',
    height: '100%',
  },
  primaryButton: {
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    gap: 8,
    marginTop: 12,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },
  dividerContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: colors.authInputBorder || '#1C1F26',
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.authTextSecondary || '#8A93A6',
    fontWeight: '500',
  },
  signInText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.authTextPrimary || '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  footerLink: {
    fontSize: 12,
    color: colors.authTextSecondary || '#8A93A6',
    fontWeight: '500',
  },
});




