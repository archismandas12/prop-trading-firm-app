import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { CustomToggle } from '../components/ui/CustomToggle';
import { SettingsService, MenuSection, UserPreferences } from '../services/SettingsService';
import { typography } from '../theme/typography';
import { BackButton } from '../components/ui/BackButton';
import { AppHeader } from '../components/ui/AppHeader';
import { AppBackground } from '../components/ui/AppBackground';
import { LinearGradient } from 'expo-linear-gradient';

export const SettingsScreen = () => {
  const s = React.useMemo(() => getStyles(colors, false), [colors]);

  const navigation = useNavigation<any>();
  const [sections, setSections] = useState<MenuSection[]>([]);
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => { Promise.all([SettingsService.getMenuSections(), SettingsService.getPreferences()]).then(([s, p]) => { setSections(s); setPrefs(p); setLoading(false); }); }, []);
  const [isDarkMode, setIsDarkMode] = useState(false);
  React.useEffect(() => { if (prefs) setIsDarkMode(prefs.darkMode); }, [prefs]);

  const toggleSection = (id: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === id ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="Settings" showBack={true} />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
        {/* New Challenge Standalone Pill */}
        <TouchableOpacity
          style={s.newChallengeContainer}
          onPress={() => navigation.navigate('NewChallenge')}
          activeOpacity={0.85}
        >
          <LinearGradient colors={['#60A5FA', '#3B82F6', '#60A5FA']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.newChallengeGradient}>
            <Text style={s.newChallengeText}>New Yo Pips Challenge</Text>
            <Feather name="arrow-right" size={20} color="#000000" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Sections */}
        {sections.map(section => (
          <View key={section.id} style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{section.title}</Text>
            </View>

            <View style={s.sectionContent}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[s.menuItem, idx === section.items.length - 1 && { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.label === 'Accounts Overview') {
                      navigation.navigate('ActiveDashboard');
                    } else if (item.label === 'Profile') {
                      navigation.navigate('ProfileScreen');
                    } else if (item.label === 'Yo Pips Traders') {
                      navigation.navigate('Traders');
                    } else if (item.label === 'Academy' || item.label === 'Yo Pips Academy') {
                      navigation.navigate('Academy');
                    } else if (item.label === 'Billing') {
                      navigation.navigate('Billing');
                    } else if (item.label === 'Certificates') {
                      navigation.navigate('Certificates');
                    } else if (item.label === 'Downloads') {
                      navigation.navigate('Downloads');
                    } else if (item.label === 'Social Media') {
                      navigation.navigate('SocialMedia');
                    } else if (item.label === 'Economic Calendar') {
                      navigation.navigate('EconomicCalendar');
                    } else if (item.label === 'Symbols & Tickets') {
                      navigation.navigate('SymbolsTickets');
                    } else if (item.label === 'Ticker') {
                      navigation.navigate('Ticker');
                    } else if (item.label === 'Timezone Converter') {
                      navigation.navigate('TimezoneConverter');
                    } else if (item.label === "Trader's Analysis") {
                      navigation.navigate('TradersAnalysis');
                    } else if (item.label === 'Partnership Deals') {
                      navigation.navigate('PartnershipDeals');
                    } else if (item.label === 'Equity Simulator') {
                      navigation.navigate('EquitySimulator');
                    } else if (item.label === 'Calculators') {
                      navigation.navigate('Calculators');
                    } else if (item.label === 'Mentor App') {
                      navigation.navigate('MentorApp');
                    } else if (item.label === 'Performance Coaching') {
                      navigation.navigate('PerformanceCoaching');
                    } else if (item.label === 'Helpdesk Tickets') {
                      navigation.navigate('HelpdeskTickets');
                    } else if (item.label === 'Live Chat') {
                      navigation.navigate('LiveChatModal');
                    } else if (item.label === 'Trading Journal') {
                      navigation.navigate('TradingJournal');
                    } else if (item.label === 'Leaderboard') {
                      navigation.navigate('Leaderboard');
                    }
                  }}
                >
                  <View style={s.menuItemLeft}>
                    <View style={s.iconBox}>
                      <Feather
                        name={item.icon as any}
                        size={18}
                        color="#3B82F6"
                      />
                    </View>
                    <Text style={s.menuItemText}>
                      {item.label}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {item.dot && (
                      <View style={s.dot} />
                    )}
                    {item.badge && (
                      <View style={s.badge}>
                        <Text style={s.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    {/* Universal gray forward chevron for all items */}
                    <Feather name="chevron-right" size={16} color={colors.textTertiary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Configurations Block */}
        <View style={s.settingsBlock}>
          <Text style={s.settingsTitle}>PREFERENCES</Text>

          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Feather name="moon" size={20} color="#3B82F6" />
              <Text style={s.settingText}>Dark Mode</Text>
            </View>
            <CustomToggle
              value={isDarkMode}
              onValueChange={setIsDarkMode}
            />
          </View>

          <TouchableOpacity style={s.settingRow} activeOpacity={0.7} onPress={() => alert('Language selection coming soon!')}>
            <View style={s.settingLeft}>
              <Feather name="globe" size={20} color="#3B82F6" />
              <Text style={s.settingText}>English</Text>
            </View>
            <Feather name="chevron-down" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.settingRow, { marginTop: 12 }]}
            activeOpacity={0.7}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
          >
            <View style={s.settingLeft}>
              <Feather name="log-out" size={20} color="#EF4444" />
              <Text style={[s.settingText, { color: '#EF4444', fontWeight: '600' }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

// ══════════════ STYLES (Liquid Glass Neobank) ══════════════
function getStyles(colors: any, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background, // Match the lighter airy cream background
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 24,
    },
    headerTitle: {
      ...typography.h2,
      fontSize: 24,
      color: colors.textPrimary,
      marginLeft: 12,
    },
    backRow: {
      width: 44,
      height: 44,
      borderRadius: 22, // Perfect circle
      backgroundColor: colors.cardBackground,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12 },
        android: { elevation: 2 },
      }),
    },
    scroll: {
      flex: 1,
    },

    // Standalone New Challenge Pill
    newChallengeContainer: {
      marginHorizontal: 24,
      borderRadius: 999,
      marginBottom: 24,
      ...Platform.select({
        ios: { shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 24 },
        android: { elevation: 8 },
        web: { boxShadow: `0px 8px 24px rgba(239, 203, 115, 0.6)` } as any,
      }),
    },
    newChallengeGradient: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderRadius: 999,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    newChallengeText: {
      fontSize: 16,
      fontWeight: '800',
      color: '#000000',
    },

    section: {
      marginHorizontal: 24,
      marginBottom: 24,
      backgroundColor: colors.cardBackground,
      borderRadius: 24, // Super-ellipse
      paddingVertical: 8,
      ...Platform.select({
        ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 24 },
        android: { elevation: 3 },
      }),
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    sectionContent: {
      paddingHorizontal: 8,
    },

    // Menu Items (Unified List)
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider, // Extremely subtle separator
    },
    menuItemActive: {
      backgroundColor: 'transparent',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
    },
    iconBoxActive: {
      backgroundColor: 'transparent',
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    menuItemTextActive: {
      color: colors.textPrimary,
    },

    // Badges & Indicators
    dot: {
      width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning,
    },
    badge: {
      backgroundColor: 'rgba(79, 209, 197, 0.15)', // Light sea-glass aqua
      paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
    },
    badgeText: {
      fontSize: 11, fontWeight: '800', color: '#0D9488', letterSpacing: 0.5,
    },

    // Settings/Preferences Block (Matches Section style)
    settingsBlock: {
      marginHorizontal: 24,
      marginBottom: 48,
      backgroundColor: colors.cardBackground,
      borderRadius: 24,
      paddingTop: 8,
      paddingBottom: 8,
      ...Platform.select({
        ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 24 },
        android: { elevation: 3 },
      }),
    },
    settingsTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: colors.textTertiary,
      letterSpacing: 1,
      paddingHorizontal: 24,
      paddingVertical: 16,
      textTransform: 'uppercase',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 18,
      paddingHorizontal: 24,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    settingText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
    }
  });
}
