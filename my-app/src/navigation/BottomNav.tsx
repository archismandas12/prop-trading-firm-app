import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Animated } from 'react-native';

interface BottomNavProps {
  currentRoute: string;
  scrollY?: Animated.Value;
}

/**
 * ─────────────────────────────────────────────────────────────────
 * Neumorphic Bottom Navbar -> Floating Pill Navbar
 * ─────────────────────────────────────────────────────────────────
 */
export const BottomNav: React.FC<BottomNavProps> = ({ currentRoute, scrollY }) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  const isOverview = currentRoute === 'ActiveDashboard';
  const isJournal = currentRoute === 'TradingJournal';
  const isNewChallenge = currentRoute === 'NewChallenge';
  const isMetrics = currentRoute === 'AccountMetrics';
  const isSettings = currentRoute === 'Settings' || currentRoute === 'ProfileScreen' || currentRoute === 'EditProfile';

  const TabItem = ({ icon, active, onPress }: { icon: string; active: boolean; onPress: () => void }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 1.25,
        useNativeDriver: true,
        speed: 20,
        bounciness: 12,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }).start();
    };

    const handleHoverIn = () => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
          speed: 14,
          bounciness: 10,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const handleHoverOut = () => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 14,
          bounciness: 8,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Pressable
        style={s.navItem}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {/* Glow circle behind icon on hover */}
          <Animated.View
            style={[
              s.hoverGlow,
              { opacity: glowAnim },
            ]}
          />
          {active ? (
            <View style={s.navIconWrap}>
              <View style={s.activeIconContainer}>
                <LinearGradient
                  colors={[colors.secondary, colors.primary, colors.secondary]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={s.activeIconGradient}
                >
                  <Feather name={icon as any} size={20} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={s.activeDot} />
            </View>
          ) : (
            <View style={s.navIconWrap}>
              <Feather name={icon as any} size={24} color={colors.textTertiary} />
            </View>
          )}
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={[s.navBar, { paddingBottom: Math.max(insets.bottom + 16, 32) }]} pointerEvents="box-none">
      <View style={s.blurWrapper}>
        <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFillObject} />
        <View style={s.navContainer}>
          <TabItem icon="layout" active={isOverview} onPress={() => navigation.navigate('ActiveDashboard')} />
          <TabItem icon="book-open" active={isJournal} onPress={() => navigation.navigate('TradingJournal')} />
          <TabItem icon="zap" active={isNewChallenge} onPress={() => navigation.navigate('NewChallenge')} />
          <TabItem icon="bar-chart-2" active={isMetrics} onPress={() => navigation.navigate('AccountMetrics')} />
          <TabItem icon="user" active={isSettings} onPress={() => navigation.navigate('Settings')} />
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  blurWrapper: {
    width: '85%',
    maxWidth: 400,
    height: 72,
    borderRadius: 999,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.4)', // Soft border for depth
    ...Platform.select({
      ios: { shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.8, shadowRadius: 24 },
      android: { elevation: 12 },
      web: { boxShadow: `0px 8px 32px rgba(0, 0, 0, 0.4)` } as any,
    }),
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(30, 41, 59, 0.4)', // Slate 800 heavily transparent
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 8,
  },
  navIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoverGlow: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 211, 238, 0.12)', // Cyan
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    ...Platform.select({
      ios: { shadowColor: colors.accent, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 12 },
      android: { elevation: 6, shadowColor: colors.accent },
      web: { boxShadow: `0px 0px 20px rgba(34, 211, 238, 0.4)` } as any,
    }),
  },
  activeIconContainer: {
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 16 },
      android: { elevation: 8, shadowColor: colors.primary },
      web: { boxShadow: `0px 4px 16px rgba(59, 130, 246, 0.6)` } as any,
    }),
  },
  activeIconGradient: {
    width: 44, height: 44, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center'
  },
  activeDot: {
    width: 4, height: 4, borderRadius: 2, backgroundColor: colors.accent, marginTop: 4,
  },
});
