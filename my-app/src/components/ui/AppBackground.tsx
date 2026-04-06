import { useTheme } from '../../theme/ThemeContext';
import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import Svg, { Path, Defs, Pattern, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height } = Dimensions.get('window');

/**
 * AppBackground — subtle dark space background for inner-app screens.
 * Lighter version of AuthBackground (no animated graphs, weaker particles).
 */
export const AppBackground = () => {
    const { colors, isDark } = useTheme();
    return (
        <View style={styles.container} pointerEvents="none">
            {/* Base Deep Dark Layer */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.appBackground }]} />

            {/* Faint Golden Core Glow */}
            <View style={StyleSheet.absoluteFill}>
                <LinearGradient
                    colors={['rgba(59, 130, 246, 0.15)', 'rgba(59, 130, 246, 0.02)', 'transparent']}
                    locations={[0, 0.4, 0.8]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ flex: 1 }}
                />
            </View>

            {/* Faint Grid Overlay */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width="100%" height="100%">
                    <Defs>
                        <Pattern id="appGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <Path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                        </Pattern>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#appGrid)" />
                </Svg>
            </View>

            {/* Subtle Star Dots */}
            <View style={StyleSheet.absoluteFill}>
                <View style={[styles.star, { top: '12%', left: '15%', opacity: 0.3, width: 2, height: 2 }]} />
                <View style={[styles.star, { top: '28%', left: '75%', opacity: 0.2 }]} />
                <View style={[styles.star, { top: '55%', left: '8%', opacity: 0.25, width: 1.5, height: 1.5 }]} />
                <View style={[styles.star, { top: '78%', left: '65%', opacity: 0.15 }]} />
                <View style={[styles.star, { top: '42%', left: '90%', opacity: 0.3, width: 2.5, height: 2.5 }]} />
                <View style={[styles.star, { top: '68%', left: '35%', opacity: 0.1 }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        zIndex: 0,
    },
    star: {
        position: 'absolute',
        width: 1.5,
        height: 1.5,
        backgroundColor: '#F8FAFC',
        borderRadius: 2,
        ...Platform.select({
            ios: { shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 4 },
            android: { elevation: 1 },
            web: { boxShadow: `0px 0px 6px rgba(59, 130, 246, 0.5)` } as any,
        })
    }
});
