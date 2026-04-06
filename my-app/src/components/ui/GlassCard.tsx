import { colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import React, { useRef } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform, Animated, Pressable } from 'react-native';


interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    glow?: boolean;
    noPadding?: boolean;
    interactive?: boolean; // Toggles the spring animation
}

/**
 * ─────────────────────────────────────────────────────────────────
 * NeumorphicCard Implementation -> Converted to Modern GlassCard
 * ─────────────────────────────────────────────────────────────────
 */
export const GlassCard: React.FC<GlassCardProps> = ({ children, style, glow = false, noPadding = false, interactive = false }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (!interactive) return;
        Animated.spring(scaleValue, {
            toValue: 0.97,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const handlePressOut = () => {
        if (!interactive) return;
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            speed: 20,
        }).start();
    };

    const CardContent = (
        <Animated.View
            style={[
                styles.neumorphicCard,
                glow && styles.cardGlow,
                noPadding && { padding: 0 },
                style,
                { transform: [{ scale: scaleValue }] }
            ]}
        >
            {children}
        </Animated.View>
    );

    if (interactive) {
        return (
            <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
                {CardContent}
            </Pressable>
        );
    }

    return CardContent;
};

const styles = StyleSheet.create({
    neumorphicCard: {
        backgroundColor: colors.cardBackground, 
        borderRadius: 24, 
        borderWidth: 1,
        borderColor: colors.border,
        padding: 24,
        overflow: 'hidden',
        // Fintech soft shadow
        ...Platform.select({
            ios: {
                shadowColor: colors.appSurfaceDeepShadow,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.6,
                shadowRadius: 16,
            },
            android: { elevation: 4 },
            web: {
                boxShadow: `0px 12px 24px ${colors.appSurfaceDeepShadow}`,
            } as any,
        }),
    },
    cardGlow: {
        borderWidth: 1.5,
        borderColor: colors.accent, // Cyan Glow
        ...Platform.select({
            ios: {
                shadowColor: colors.accent,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 18,
            },
            android: { elevation: 6 },
            web: {
                boxShadow: `0px 8px 24px rgba(34, 211, 238, 0.25)`,
            } as any,
        }),
    },
});
