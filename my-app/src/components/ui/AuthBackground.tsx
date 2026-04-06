import { colors } from '../../theme/colors';
import { useTheme } from '../../theme/ThemeContext';
import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import ReanimatedAnimated, {
    Easing as ReanimatedEasing,
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Defs, Circle, Pattern, Rect, Line } from 'react-native-svg';
import * as d3Shape from 'd3-shape';


const { width, height } = Dimensions.get('window');

const AnimatedSvgGroup = Animated.createAnimatedComponent(View);
const curveGenerator = d3Shape.line().curve(d3Shape.curveMonotoneX);

// Gold brand color for forex lines
const GOLD = colors.accent || '#22D3EE';
const GOLD_LIGHT = colors.secondary || '#60A5FA';

// --- Forex chart paths (candlestick-style price lines) ---
const chart1Data: [number, number][] = [
    [-50, height * 0.55],
    [width * 0.1, height * 0.48],
    [width * 0.2, height * 0.52],
    [width * 0.35, height * 0.38],
    [width * 0.45, height * 0.42],
    [width * 0.55, height * 0.35],
    [width * 0.7, height * 0.45],
    [width * 0.85, height * 0.32],
    [width * 1.0, height * 0.4],
    [width * 1.2, height * 0.28],
    [width * 1.5, height * 0.35],
    [width * 2 + 50, height * 0.3],
];
const chart1String = curveGenerator(chart1Data) as string;

const chart2Data: [number, number][] = [
    [-50, height * 0.72],
    [width * 0.15, height * 0.65],
    [width * 0.3, height * 0.7],
    [width * 0.45, height * 0.58],
    [width * 0.6, height * 0.62],
    [width * 0.75, height * 0.55],
    [width * 0.9, height * 0.6],
    [width * 1.1, height * 0.5],
    [width * 1.4, height * 0.55],
    [width * 2 + 50, height * 0.48],
];
const chart2String = curveGenerator(chart2Data) as string;

const chart3Data: [number, number][] = [
    [-50, height * 0.85],
    [width * 0.2, height * 0.78],
    [width * 0.4, height * 0.82],
    [width * 0.6, height * 0.75],
    [width * 0.8, height * 0.8],
    [width * 1.0, height * 0.72],
    [width * 1.3, height * 0.76],
    [width * 2 + 50, height * 0.7],
];
const chart3String = curveGenerator(chart3Data) as string;

// --- Candlestick bars data ---
const candlesticks = [
    { x: width * 0.12, y1: height * 0.42, y2: height * 0.50, bull: true },
    { x: width * 0.22, y1: height * 0.46, y2: height * 0.54, bull: false },
    { x: width * 0.32, y1: height * 0.36, y2: height * 0.44, bull: true },
    { x: width * 0.42, y1: height * 0.38, y2: height * 0.48, bull: false },
    { x: width * 0.52, y1: height * 0.30, y2: height * 0.40, bull: true },
    { x: width * 0.62, y1: height * 0.40, y2: height * 0.48, bull: false },
    { x: width * 0.72, y1: height * 0.34, y2: height * 0.44, bull: true },
    { x: width * 0.82, y1: height * 0.28, y2: height * 0.38, bull: true },
];

// --- Floating price dots (Reanimated) ---
type PriceDot = {
    id: number;
    size: number;
    x: number;
    duration: number;
    delay: number;
    opacity: number;
};

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function PriceDotItem({ dot }: { dot: PriceDot }) {
    const y = useSharedValue(height + dot.size);
    const scale = useSharedValue(0.8);

    useEffect(() => {
        y.value = withDelay(
            dot.delay,
            withRepeat(
                withTiming(-dot.size, {
                    duration: dot.duration,
                    easing: ReanimatedEasing.linear,
                }),
                -1,
                false
            )
        );
        scale.value = withDelay(
            dot.delay,
            withRepeat(
                withTiming(1.2, {
                    duration: Math.max(1200, dot.duration / 3),
                    easing: ReanimatedEasing.inOut(ReanimatedEasing.quad),
                }),
                -1,
                true
            )
        );
    }, [dot, y, scale]);

    const style = useAnimatedStyle(() => {
        const progress = 1 - (y.value + dot.size) / (height + dot.size);
        const fade = Math.max(0, Math.min(1, progress * 2));
        const fadeOut = Math.max(0, Math.min(1, (1 - progress) * 2));
        const opacity = dot.opacity * fade * fadeOut;
        return {
            transform: [
                { translateX: dot.x },
                { translateY: y.value },
                { scale: scale.value },
            ] as any,
            opacity,
        };
    });

    return (
        <ReanimatedAnimated.View
            style={[dotStyles.dot, style, { width: dot.size, height: dot.size, borderRadius: dot.size / 2 }]}
        />
    );
}

function FloatingDots({ count = 12 }: { count?: number }) {
    const dots = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => {
            const size = Math.round(rand(2, 8));
            return {
                id: i,
                size,
                x: rand(0, width - size),
                duration: Math.round(rand(6000, 14000)),
                delay: Math.round(rand(0, 4000)),
                opacity: rand(0.1, 0.3),
            };
        });
    }, [count]);

    return (
        <ReanimatedAnimated.View pointerEvents="none" style={StyleSheet.absoluteFill}>
            {dots.map((d) => (
                <PriceDotItem key={d.id} dot={d} />
            ))}
        </ReanimatedAnimated.View>
    );
}

// --- Main Auth Background ---
export const AuthBackground = () => {
  const { colors, isDark } = useTheme();
    const pan1 = useRef(new Animated.Value(0)).current;
    const pan2 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pan1, { toValue: 1, duration: 20000, useNativeDriver: true }),
                Animated.timing(pan1, { toValue: 0, duration: 20000, useNativeDriver: true }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pan2, { toValue: 1, duration: 30000, useNativeDriver: true }),
                Animated.timing(pan2, { toValue: 0, duration: 30000, useNativeDriver: true }),
            ])
        ).start();
    }, [pan1, pan2]);

    const translateX1 = pan1.interpolate({ inputRange: [0, 1], outputRange: [0, -width * 0.7] });
    const translateX2 = pan2.interpolate({ inputRange: [0, 1], outputRange: [-width * 0.5, 0] });

    return (
        <View style={styles.container} pointerEvents="none">
            {/* Base Background */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.authBackground || '#F6F5F2' }]} />

            {/* Subtle Grid */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width="100%" height="100%">
                    <Defs>
                        <Pattern id="fxgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <Path d="M 40 0 L 0 0 0 40" fill="none" stroke={`${GOLD}10`} strokeWidth="0.5" />
                        </Pattern>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#fxgrid)" />
                </Svg>
            </View>

            {/* Candlestick Bars (static, faint) */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width} height={height}>
                    {candlesticks.map((c, i) => (
                        <React.Fragment key={i}>
                            {/* Wick */}
                            <Line
                                x1={c.x} y1={c.y1 - 8} x2={c.x} y2={c.y2 + 8}
                                stroke={GOLD} strokeWidth={0.5} strokeOpacity={0.08}
                            />
                            {/* Body */}
                            <Rect
                                x={c.x - 3} y={c.y1} width={6} height={c.y2 - c.y1}
                                fill={c.bull ? `${GOLD}12` : `${colors.danger || '#D15B5B'}10`}
                                stroke={c.bull ? `${GOLD}20` : `${colors.danger || '#D15B5B'}18`}
                                strokeWidth={0.5}
                            />
                        </React.Fragment>
                    ))}
                </Svg>
            </View>

            {/* Animated Chart Line 1 (Main price action) */}
            <AnimatedSvgGroup style={[StyleSheet.absoluteFill, { transform: [{ translateX: translateX1 }] }]}>
                <Svg width={width * 2 + 100} height={height}>
                    {/* Glow */}
                    <Path d={chart1String} stroke={GOLD} strokeWidth={8} fill="none" strokeOpacity={0.06} />
                    {/* Line */}
                    <Path d={chart1String} stroke={GOLD} strokeWidth={1.5} fill="none" strokeOpacity={0.2} />
                    {/* Price dots */}
                    <Circle cx={chart1Data[3][0]} cy={chart1Data[3][1]} r="3" fill={GOLD} opacity={0.4} />
                    <Circle cx={chart1Data[5][0]} cy={chart1Data[5][1]} r="4" fill={GOLD} opacity={0.5} />
                    <Circle cx={chart1Data[7][0]} cy={chart1Data[7][1]} r="3" fill={GOLD} opacity={0.35} />
                </Svg>
            </AnimatedSvgGroup>

            {/* Animated Chart Line 2 (Secondary trend) */}
            <AnimatedSvgGroup style={[StyleSheet.absoluteFill, { transform: [{ translateX: translateX2 }] }]}>
                <Svg width={width * 2 + 100} height={height}>
                    <Path d={chart2String} stroke={GOLD_LIGHT} strokeWidth={10} fill="none" strokeOpacity={0.04} />
                    <Path d={chart2String} stroke={GOLD_LIGHT} strokeWidth={1} fill="none" strokeOpacity={0.12} />
                    <Circle cx={chart2Data[2][0]} cy={chart2Data[2][1]} r="3" fill={GOLD_LIGHT} opacity={0.3} />
                    <Circle cx={chart2Data[5][0]} cy={chart2Data[5][1]} r="4" fill={GOLD_LIGHT} opacity={0.4} />
                </Svg>
            </AnimatedSvgGroup>

            {/* Static Chart Line 3 (Support level) */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={width * 2 + 100} height={height}>
                    <Path d={chart3String} stroke={GOLD} strokeWidth={6} fill="none" strokeOpacity={0.03} />
                    <Path d={chart3String} stroke={GOLD} strokeWidth={0.8} fill="none" strokeOpacity={0.08} />
                </Svg>
            </View>

            {/* Floating price dots */}
            <FloatingDots count={10} />
        </View>
    );
};

const dotStyles = StyleSheet.create({
    dot: {
        position: 'absolute',
        backgroundColor: GOLD,
        ...Platform.select({
            ios: { shadowColor: GOLD, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 0 } },
            android: { elevation: 2 },
            web: { boxShadow: `0 0 8px ${GOLD}80` } as any,
        }),
    },
});

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        zIndex: 0,
    },
});
