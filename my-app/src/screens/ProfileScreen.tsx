import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { typography } from '../theme/typography';
import { Badge } from '../components/ui/Badge';
import { DashboardService, UserProfile } from '../services/DashboardService';
import { ActivityIndicator } from 'react-native';
import { BackButton } from '../components/ui/BackButton';
import { AppBackground } from '../components/ui/AppBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { AppHeader } from '../components/ui/AppHeader';

type NavTab = 'Personal Info' | 'Security & Login' | 'Activity Log';

export const ProfileScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<NavTab>('Personal Info');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await DashboardService.getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  if (loading || !profile) {
    return (
      <SafeAreaView style={[s.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* App Header */}
      <AppHeader title="Profile" subtitle={`Hello, ${profile.firstName}`} showBack={true}>
        <View style={s.actionRow}>
          <TouchableOpacity style={[s.actionButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.25)' }]} activeOpacity={0.7} onPress={() => navigation.navigate('EditProfile')}>
            <Feather name="edit-2" size={14} color="#F8FAFC" />
            <Text style={[s.actionButtonText, { color: '#F8FAFC' }]}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionButton, { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(59, 130, 246, 0.25)' }]} activeOpacity={0.7}>
            <Feather name="refresh-cw" size={14} color="#F8FAFC" />
            <Text style={[s.actionButtonText, { color: '#F8FAFC' }]}>Refresh</Text>
          </TouchableOpacity>
        </View>
      </AppHeader>
      <AppBackground />

      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, borderTopLeftRadius: 36, borderTopRightRadius: 36, overflow: 'hidden' }}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
          <View style={s.pad}>

            {/* Section Tabs */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll} contentContainerStyle={s.tabScrollContainer}>
              {['Personal Info', 'Security & Login', 'Activity Log'].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab as NavTab)}
                    activeOpacity={0.8}
                  >
                    {isActive ? (
                      <LinearGradient
                        colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                        start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                        style={[s.tabItem, s.tabItemActive]}
                      >
                        <Text style={[s.tabText, s.tabTextActive]}>{tab}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={s.tabItem}>
                        <Text style={s.tabText}>{tab}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Tab Content */}
            {activeTab === 'Personal Info' && (
              <View style={s.cardsGrid}>

                {/* Basic Information Card */}
                <View style={s.card}>
                  <View style={s.cardHeader}>
                    <Text style={s.cardTitle}>Basic Information</Text>
                    <View style={s.idBadge}>
                      <Text style={s.idBadgeText}>ID: {profile.id.substring(0, 8)}...</Text>
                    </View>
                  </View>

                  <View style={s.infoRow}>
                    <Text style={s.infoLabel}>First Name</Text>
                    <Text style={s.infoValue}>{profile.firstName}</Text>
                  </View>
                  <View style={s.infoRow}>
                    <Text style={s.infoLabel}>Last Name</Text>
                    <Text style={s.infoValue}>{profile.lastName}</Text>
                  </View>
                  <View style={[s.infoRow, { alignItems: 'center' }]}>
                    <Text style={s.infoLabel}>Status</Text>
                    <Badge label={profile.status} type={profile.status === 'Active' ? 'success' : 'danger'} size="sm" />
                  </View>
                  <View style={[s.infoRow, s.lastInfoRow]}>
                    <Text style={s.infoLabel}>Member Since</Text>
                    <Text style={s.infoValue}>{profile.memberSince}</Text>
                  </View>
                </View>

                {/* Account Summary Card */}
                <View style={s.card}>
                  <View style={s.cardHeader}>
                    <Text style={s.cardTitle}>Account Summary</Text>
                  </View>

                  <View style={[s.infoRow, { alignItems: 'center' }]}>
                    <Text style={s.infoLabel}>Account Status</Text>
                    <Badge label={profile.status} type={profile.status === 'Active' ? 'success' : 'danger'} size="sm" />
                  </View>
                  <View style={s.infoRow}>
                    <Text style={s.infoLabel}>Yo Pips Points</Text>
                    <Text style={[s.infoValue, { color: colors.primary }]}>{profile.points}</Text>
                  </View>
                  <View style={[s.infoRow, s.lastInfoRow]}>
                    <Text style={s.infoLabel}>Connected Accounts</Text>
                    <Text style={[s.infoValue, { color: colors.warning }]}>{profile.connectedAccounts}</Text>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'Security & Login' && (
              <View style={s.cardsGrid}>
                <View style={s.card}>
                  <View style={[s.cardHeader, { marginBottom: 12 }]}>
                    <Text style={s.cardTitle}>Security Settings</Text>
                  </View>

                  <View style={s.securityRow}>
                    <View style={s.securityIcon}>
                      <Feather name="shield" size={20} color={colors.textSecondary} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 16 }}>
                      <Text style={s.securityTitle}>Two-Factor Authentication</Text>
                      <Text style={s.securityDesc}>Enhance account security</Text>
                    </View>
                    <Badge label="To be implemented" type="info" size="sm" />
                  </View>
                </View>

                {/* Need Help Card */}
                <View style={s.card}>
                  <View style={s.cardHeader}>
                    <Text style={s.cardTitle}>Need Help?</Text>
                  </View>
                  <Text style={s.helpSubtitle}>Contact support for sensitive account changes.</Text>
                  <TouchableOpacity activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={s.helpLink}
                    >
                      <Text style={s.helpLinkText}>Contact Support</Text>
                      <Feather name="arrow-up-right" size={16} color="#000000" style={{ marginLeft: 4 }} />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {activeTab === 'Activity Log' && (
              <View style={s.cardsGrid}>
                <View style={s.card}>
                  <View style={[s.cardHeader, { marginBottom: 12 }]}>
                    <Text style={s.cardTitle}>Recent Login Activity</Text>
                  </View>

                  {/* Mobile-Friendly List */}
                  <View style={s.logItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.logDeviceName}>Current Session (Local)</Text>
                      <Text style={s.logDeviceIp}>127.0.0.1</Text>
                      <Text style={s.logTime}>Just now</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Badge label="Active" type="success" size="sm" />
                    </View>
                  </View>

                  <View style={[s.logItemRow, s.lastInfoRow]}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.logDeviceName}>Chrome on Windows (India)</Text>
                      <Text style={s.logDeviceIp}>192.168.1.5</Text>
                      <Text style={s.logTime}>Yesterday</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Badge label="Success" type="info" size="sm" />
                    </View>
                  </View>
                </View>
              </View>
            )}


            {/* Footer inside scroll view */}
            <View style={s.footer}>
              <View style={s.footerLinksRow}>
                <Text style={s.footerLink}>Cookie settings</Text>
                <Text style={s.footerDot}>·</Text>
                <Text style={s.footerLink}>Privacy policy</Text>
                <Text style={s.footerDot}>·</Text>
                <Text style={s.footerLink}>Terms & Conditions</Text>
              </View>
              <Text style={s.footerCopyright}>2026 © Copyright - YoPips.com</Text>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ══════════════ STYLES (Liquid Glass Neobank) ══════════════
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pad: {
    paddingHorizontal: 20,
  },
  scroll: {
    flex: 1,
  },
  headerNav: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerNavText: {
    fontSize: 28,
    color: colors.textSecondary,
    fontWeight: '800', letterSpacing: -1,
  },

  // Greeting Block (Liquid Glass Card)
  greetingBlock: {
    marginTop: 8,
    marginBottom: 32,
    backgroundColor: colors.cardBackground,
    borderRadius: 32, // Massive rounding
    padding: 32,
    ...Platform.select({
      ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 1, shadowRadius: 32 },
      android: { elevation: 6 },
    }),
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  nameIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.background,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },

  // Tabs
  tabScroll: {
    marginBottom: 24,
  },
  tabScrollContainer: {
    gap: 10,
    paddingRight: 20,
  },
  tabItem: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: colors.cardBackground,
    ...Platform.select({
      ios: { shadowColor: 'rgba(0,0,0,0.04)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  tabItemActive: {
    paddingHorizontal: 26,
    borderWidth: 0,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '800',
  },

  // Cards & Layout
  cardsGrid: {
    gap: 20,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 24 },
      android: { elevation: 3 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  idBadge: {
    backgroundColor: colors.background, // Match airy background
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  idBadgeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  lastInfoRow: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 20,
  },
  infoValueEmpty: {
    color: colors.textTertiary,
  },

  // Help Section
  helpSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '600',
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    ...Platform.select({
      ios: { shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16 },
      android: { elevation: 4 },
      web: { boxShadow: `0px 8px 32px rgba(59, 130, 246, 0.3)` } as any,
    }),
  },
  helpLinkText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 48,
    paddingVertical: 24,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  footerLink: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  footerDot: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '600',
  },

  // Security & Activity Specific
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  securityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  securityDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    fontWeight: '600',
  },
  logItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  logDeviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  logDeviceIp: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textTertiary,
    marginTop: 6,
  },
  logTime: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    marginTop: 8,
  }
});




