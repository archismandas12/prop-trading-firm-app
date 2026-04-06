import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Animated, TextInput
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { YoPipsLogo } from '../components/ui/Logo';
import { AuthBackground } from '../components/ui/AuthBackground';
import { LinearGradient } from 'expo-linear-gradient';

const OTP_LENGTH = 6;

export const OTPVerificationScreen = () => {
    const { colors, isDark } = useTheme();
    const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const email = route.params?.email || 'your email';

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(59);

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

        // Timer logic
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text: string, index: number) => {
        // Basic array copy
        const newOtp = [...otp];
        let actualText = text;

        // Handle pasting multiple digits (basic)
        if (text.length > 1) {
            const digits = text.replace(/[^0-9]/g, '').split('').slice(0, OTP_LENGTH);
            for (let i = 0; i < digits.length; i++) {
                newOtp[i] = digits[i];
            }
            setOtp(newOtp);
            // Focus the last filled or next empty
            const focusIndex = Math.min(digits.length, OTP_LENGTH - 1);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        // Normal typing entry
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-advance
        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length === OTP_LENGTH) {
            navigation.replace('ActiveDashboard'); // Adjust based on your flow
        } else {
            alert('Please enter a valid 6-digit OTP.');
        }
    };

    return (
        <SafeAreaView style={s.safeArea}>
            <AuthBackground />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={s.scrollContainer} showsVerticalScrollIndicator={false}>

                    {/* Header / Logo Area */}
                    <Animated.View style={[s.logoContainer, { opacity: fadeAnim1, transform: [{ translateY: slideAnim1 }] }]}>
                        <YoPipsLogo width={220} />
                    </Animated.View>

                    {/* Main Card */}
                    <Animated.View style={[s.card, { opacity: fadeAnim2, transform: [{ translateY: slideAnim2 }] }]}>
                        <View style={s.headerTextContainer}>
                            <Text style={s.title}>OTP Verification</Text>
                            <Text style={s.subtitle}>Enter the 6-digit code sent to {email}</Text>
                        </View>

                        {/* OTP Input Row */}
                        <View style={s.otpContainer}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => { inputRefs.current[index] = ref; }}
                                    style={[s.otpInput, digit ? s.otpInputFilled : null]}
                                    keyboardType="number-pad"
                                    maxLength={6}
                                    value={digit}
                                    onChangeText={(text) => handleChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    selectTextOnFocus
                                />
                            ))}
                        </View>

                        {/* Timer */}
                        <View style={s.resendContainer}>
                            <Text style={s.resendText}>
                                {timer > 0 ? `Resend code in 00:${timer.toString().padStart(2, '0')}` : 'Resend code now'}
                            </Text>
                        </View>

                        {/* Verify Button */}
                        <TouchableOpacity activeOpacity={0.8} onPress={handleVerify}>
                            <LinearGradient
                                colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                                start={{ x: 0, y: 0.5 }}
                                end={{ x: 1, y: 0.5 }}
                                style={s.primaryButton}
                            >
                                <Text style={s.primaryButtonText}>Verify</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Back to Login Link */}
                        <TouchableOpacity
                            style={s.backRow}
                            activeOpacity={0.6}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={s.backText}>Back to Login</Text>
                        </TouchableOpacity>

                    </Animated.View>

                </ScrollView>
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
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 60,
        zIndex: 1,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    card: {
        backgroundColor: colors.authCardBackground || 'transparent',
        paddingHorizontal: 8,
    },
    headerTextContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.authTextPrimary || '#FFFFFF',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: colors.authTextSecondary || '#8A93A6',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpInput: {
        width: 48,
        height: 56,
        borderRadius: 12,
        backgroundColor: colors.authInputBackground || '#11141B',
        borderWidth: 1,
        borderColor: colors.authInputBorder || '#1C1F26',
        color: colors.authTextPrimary || '#FFFFFF',
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        ...(Platform.OS === 'web' ? { outline: 'none' } as any : {})
    },
    otpInputFilled: {
        borderColor: colors.authPrimaryButton || '#0052FF',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.authTextSecondary || '#8A93A6',
    },
    primaryButton: {
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 56,
        gap: 8,
        marginBottom: 24,
        ...Platform.select({
            ios: { shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
            android: { elevation: 4 },
            web: { boxShadow: `0px 4px 12px rgba(59, 130, 246, 0.2)` } as any,
        }),
    },
    primaryButtonText: {
        fontSize: 16,
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
        color: colors.authPrimaryButton || '#0052FF',
    }
});
