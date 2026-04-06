import { useTheme } from '../theme/ThemeContext';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl, ScrollView, Platform, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollContext } from '../navigation/AppNavigator';

import { CustomToggle } from '../components/ui/CustomToggle';
import { typography } from '../theme/typography';
import { Badge } from '../components/ui/Badge';
import { GlassCard as NeumorphicCard } from '../components/ui/GlassCard';
import { AppHeader } from '../components/ui/AppHeader';
import { DashboardService, ActiveAccount, KpiStat, ChallengeProgress, TradingRules, AccountHistoryItem, PlatformStats, PayoutOption, UserProfile } from '../services/DashboardService';
import { YoPipsLogo } from '../components/ui/Logo';
import { AppBackground } from '../components/ui/AppBackground';

const FILTERS = ['All', 'Free Trial', 'Evolution', 'Express', 'Instant'];

export const ActiveDashboardScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors), [colors]); const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeAccount, setActiveAccount] = useState<ActiveAccount | null>(null);
  const [kpis, setKpis] = useState<KpiStat[]>([]);
  const [challengeProgress, setChallengeProgress] = useState<ChallengeProgress | null>(null);
  const [tradingRules, setTradingRules] = useState<TradingRules | null>(null);
  const [history, setHistory] = useState<AccountHistoryItem[]>([]);
  const [historyFilter, setHistoryFilter] = useState('All');
  const [showVisibleOnly, setShowVisibleOnly] = useState(false);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);
  const [payoutOptions, setPayoutOptions] = useState<PayoutOption[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => { loadData(); }, [historyFilter, showVisibleOnly]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [acc, kpiData, cp, tr, hist, pStats, opts, profile] = await Promise.all([
        DashboardService.getActiveAccount(),
        DashboardService.getKpis(),
        DashboardService.getChallengeProgress(),
        DashboardService.getTradingRules(),
        DashboardService.getAccountHistory(historyFilter, showVisibleOnly),
        DashboardService.getPlatformStats(),
        DashboardService.getPayoutOptions(),
        DashboardService.getUserProfile()
      ]);
      setActiveAccount(acc);
      setKpis(kpiData);
      setChallengeProgress(cp);
      setTradingRules(tr);
      setHistory(hist);
      setPlatformStats(pStats);
      setPayoutOptions(opts);
      setUserProfile(profile);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [historyFilter, showVisibleOnly]);

  const toggleAccountVisibility = async (id: string, currentVal: boolean) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, visible: !currentVal } : item));
    await DashboardService.updateAccountVisibility(id, !currentVal);
  };

  // ─────────────────────────────────────────────────────────────────
  // IMAGE 2 MOCKUP: THE STATIC EMPTY STATE (NO ACTIVE ACCOUNT)
  // ─────────────────────────────────────────────────────────────────
  const renderEmptyState = () => {
    return (
      <View style={s.pad}>
        <View style={s.headerBar}>
          <YoPipsLogo width={120} height={32} color={colors.textPrimary} animate={false} />
          <View style={s.rowStart}>
            <TouchableOpacity style={s.iconBtn} activeOpacity={0.8}><Feather name="bell" size={24} color="#3B82F6" /></TouchableOpacity>
            <TouchableOpacity style={s.iconBtn} onPress={() => navigation.navigate('Settings')} activeOpacity={0.8}><Feather name="user" size={24} color="#3B82F6" /></TouchableOpacity>
          </View>
        </View>

        <View style={{ marginTop: 24, marginBottom: 24 }}>
          <Text style={s.img2Header}>Active Dashboard</Text>
          <Text style={s.img2Subtitle}>Real-time overview of your trading activity</Text>
        </View>

        <NeumorphicCard style={s.emptyHero}>
          <View style={s.emptyIconCircle}>
            <Feather name="briefcase" size={32} color={colors.textTertiary} />
          </View>
          <Text style={s.emptyHeroTitle}>No Active Account</Text>
          <Text style={s.emptyHeroSub}>Start a challenge to see your dashboard.</Text>
          <TouchableOpacity style={s.btnGoldContainer} onPress={() => navigation.navigate('NewChallenge')} activeOpacity={0.8}>
            <LinearGradient colors={['#60A5FA', '#3B82F6', '#60A5FA']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.btnGoldGradient}>
              <Text style={s.btnGoldTxt}>Start Your Challenge</Text>
              <Feather name="arrow-right" size={20} color="#000000" />
            </LinearGradient>
          </TouchableOpacity>
        </NeumorphicCard>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  // ACTIVE STATE MAP: HEADER, HERO, KPI, RULES, FILTERS
  // ─────────────────────────────────────────────────────────────────
  const renderHeader = () => {
    if (!activeAccount) return renderEmptyState();

    return (
      <View style={{ flex: 1 }}>
        {/* Huge Neumorphic Hero Card mapping Image 1 */}
        <View style={[s.pad, { paddingTop: 24 }]}>
          <NeumorphicCard style={{ marginTop: 12, padding: 28, paddingBottom: 32 }}>
            {/* Top Info */}
            <View style={s.rowBetween}>
              <View style={s.rowStart}>
                <Badge label={activeAccount.type} type="info" size="sm" />
                <View style={{ width: 8 }} />
                <Badge label={activeAccount.status} type={activeAccount.status === 'Active' ? 'success' : 'default'} size="sm" />
              </View>
              <Text style={s.accountNumber}>#{activeAccount.id}</Text>
            </View>

            <Text style={s.balanceText}>${activeAccount.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>

            {/* Safe to trade Pill */}
            <View style={[s.rowStart, { marginTop: 16 }]}>
              <Text style={s.safeToTradeText}>Safe to trade: YES</Text>
              <View style={s.goldPlayCircle}>
                <Feather name="play" size={12} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </View>
            </View>

            {/* Progress Bars (Target / Loss) */}
            <View style={s.progressSection}>
              <View style={s.progressRow}>
                <View style={s.progressDetail}>
                  <View style={[s.progressColorBar, { backgroundColor: '#4B88BD', height: '88%' }]} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={[s.rowBetween, { marginBottom: 4 }]}>
                    <Text style={s.progressLabel}>${(activeAccount.balance * 0.03).toLocaleString('en-US', { minimumFractionDigits: 2 })}/2,000</Text>
                    <Text style={s.progressPercent}>88%</Text>
                  </View>
                  <View style={[s.progressTrack, { backgroundColor: 'rgba(75, 136, 189, 0.2)' }]}>
                    <View style={[s.progressFill, { width: '88%', backgroundColor: '#4B88BD' }]} />
                  </View>
                </View>
              </View>

              <View style={s.progressRow}>
                <View style={s.progressDetail}>
                  <View style={[s.progressColorBar, { backgroundColor: '#22D3EE', height: '100%' }]} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={[s.rowBetween, { marginBottom: 4 }]}>
                    <Text style={s.progressLabel}>$500/$500</Text>
                    <Text style={s.progressPercent}>100%</Text>
                  </View>
                  <View style={[s.progressTrack, { backgroundColor: 'rgba(34, 211, 238, 0.2)' }]}>
                    <View style={[s.progressFill, { width: '100%', backgroundColor: '#22D3EE' }]} />
                  </View>
                </View>
              </View>

              <View style={s.progressRow}>
                <View style={s.progressDetail}>
                  <View style={[s.progressColorBar, { backgroundColor: colors.primary, height: '95%' }]} />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <View style={[s.rowBetween, { marginBottom: 4 }]}>
                    <Text style={s.progressLabel}>$4,759/$5,000</Text>
                    <Text style={s.progressPercent}>95%</Text>
                  </View>
                  <View style={[s.progressTrack, { backgroundColor: 'rgba(227, 201, 137, 0.2)' }]}>
                    <View style={[s.progressFill, { width: '95%', backgroundColor: colors.primary }]} />
                  </View>
                </View>
              </View>
            </View>

            {/* Reset Timer */}
            <View style={[s.rowBetween, { marginTop: 24, alignItems: 'flex-start' }]}>
              <View style={[s.rowStart, { alignItems: 'flex-start' }]}>
                <View style={s.dotWarning} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={s.resetTitle}>Resets in 7h 28m</Text>
                  <Text style={s.resetSub}>8 / 8 Minimum Trading Days{'\n'}Completed</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={16} color={colors.textSecondary} style={{ marginTop: 2 }} />
            </View>

            {/* View Details Primary Pill Button */}
            <TouchableOpacity style={s.viewDetailsContainer} onPress={() => navigation.navigate('AccountDetails')} activeOpacity={0.8}>
              <LinearGradient colors={['#60A5FA', '#3B82F6', '#60A5FA']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={s.viewDetailsGradient}>
                <Text style={s.viewDetailsTxt}>View Full Details</Text>
                <Feather name="arrow-right" size={20} color="#000000" />
              </LinearGradient>
            </TouchableOpacity>
          </NeumorphicCard>

          {/* Action Buttons Row */}
          <View style={[s.rowBetween, { marginTop: 16 }]}>
            <TouchableOpacity style={s.secondaryActionBtn} onPress={() => navigation.navigate('Credentials')}>
              <View style={s.secondaryActionIcon}><Feather name="key" size={14} color={colors.primary} /></View>
              <Text style={s.secondaryActionTxt}>Credentials</Text>
            </TouchableOpacity>
            <View style={{ width: 12 }} />
            <TouchableOpacity style={s.secondaryActionBtn} onPress={() => navigation.navigate('AccountMetrics')}>
              <View style={s.secondaryActionIcon}><Feather name="bar-chart-2" size={14} color={colors.primary} /></View>
              <Text style={s.secondaryActionTxt}>Metrics</Text>
            </TouchableOpacity>
          </View>

          {/* KPI Cards section */}
          {kpis.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -24, marginTop: 32 }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 16, gap: 12 }}>
              {kpis.map((kpi, idx) => (
                <View key={idx} style={{ minWidth: 150 }}>
                  <NeumorphicCard style={{ padding: 20 }}>
                    <Feather name={kpi.icon as any} size={24} color={colors.primary} />
                    <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 12, fontWeight: '700' }}>{kpi.label}</Text>
                    <Text style={{ fontSize: 22, color: colors.textPrimary, fontWeight: '900', marginTop: 4 }}>${kpi.value.toLocaleString('en-US')}</Text>
                  </NeumorphicCard>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Challenge Progress + Trading Rules Sections */}
          {challengeProgress && tradingRules && (
            <View style={{ marginTop: 24, gap: 16 }}>
              <NeumorphicCard style={{ padding: 24 }}>
                <Text style={s.cardLabel}>CHALLENGE PROGRESS</Text>
                <View style={[s.rowBetween, { marginTop: 16 }]}>
                  <Text style={{ fontSize: 14, color: colors.textTertiary, fontWeight: '700' }}>Profit Target</Text>
                  <Text style={{ fontSize: 16, color: colors.textPrimary, fontWeight: '800' }}>${challengeProgress.profitTargetAmount} ({challengeProgress.profitTargetPercent}%)</Text>
                </View>
                <View style={{ marginTop: 16 }}>
                  <View style={{ height: 10, borderRadius: 5, backgroundColor: colors.background, padding: 2, borderWidth: 1, borderColor: colors.border, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4 }}>
                    <View style={{ width: `${challengeProgress.completionPercent}%`, height: '100%', backgroundColor: colors.primary, borderRadius: 4 }} />
                  </View>
                  <Text style={{ fontSize: 13, textAlign: 'right', marginTop: 8, color: colors.textSecondary, fontWeight: '700' }}>{challengeProgress.completionPercent}% Completed</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
                  <View style={s.statsMiniBox}>
                    <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' }}>Current Profit</Text>
                    <Text style={{ fontSize: 18, color: '#10B981', fontWeight: '900', marginTop: 4 }}>${challengeProgress.currentProfit}</Text>
                  </View>
                  <View style={s.statsMiniBox}>
                    <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '700', textTransform: 'uppercase' }}>To Go</Text>
                    <Text style={{ fontSize: 18, color: colors.textPrimary, fontWeight: '900', marginTop: 4 }}>${challengeProgress.toGo}</Text>
                  </View>
                </View>
              </NeumorphicCard>

              <NeumorphicCard style={{ padding: 24 }}>
                <Text style={s.cardLabel}>TRADING RULES</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
                  <View style={s.ruleBox}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '800' }}>MAX DAILY LOSS</Text>
                    <Text style={{ fontSize: 22, color: colors.textPrimary, fontWeight: '900', marginTop: 4 }}>{tradingRules.maxDailyLossPercent}%</Text>
                  </View>
                  <View style={s.ruleBox}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '800' }}>MAX DRAWDOWN</Text>
                    <Text style={{ fontSize: 22, color: colors.textPrimary, fontWeight: '900', marginTop: 4 }}>{tradingRules.maxDrawdownPercent}%</Text>
                  </View>
                  <View style={s.ruleBox}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '800' }}>MIN DAYS</Text>
                    <Text style={{ fontSize: 22, color: colors.textPrimary, fontWeight: '900', marginTop: 4 }}>{tradingRules.minDays}</Text>
                  </View>
                  <View style={s.ruleBox}>
                    <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: '800' }}>TARGET</Text>
                    <Text style={{ fontSize: 22, color: colors.textPrimary, fontWeight: '900', marginTop: 4 }}>{tradingRules.targetPercent}%</Text>
                  </View>
                </View>
              </NeumorphicCard>
            </View>
          )}

          {/* Account History Section Header */}
          <View style={{ marginTop: 40, marginBottom: 16 }}>
            <Text style={s.sectionHeaderTitle}>Account History</Text>
          </View>

          {/* Filters */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={FILTERS}
            style={{ marginBottom: 20, marginHorizontal: -24 }}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[s.filterChip, historyFilter === item && s.filterChipActive]}
                onPress={() => setHistoryFilter(item)}>
                <Text style={[s.filterChipText, historyFilter === item && s.filterChipTextActive]}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
          />

          <View style={[s.rowBetween, { marginBottom: 20 }]}>
            <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '800' }}>SHOW VISIBLE ACCOUNTS ONLY</Text>
            <CustomToggle value={showVisibleOnly} onValueChange={setShowVisibleOnly} />
          </View>

        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!platformStats || !activeAccount) return null;
    return (
      <View style={[s.pad, { marginTop: 32 }]}>
        {/* Platform Stats */}
        <Text style={s.sectionHeaderTitle}>Platform Stats</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 16, marginBottom: 32 }}>
          {[
            { label: 'Payouts This Week', val: platformStats.payoutsThisWeek },
            { label: 'Avg Payout Time', val: platformStats.avgPayoutTime },
            { label: 'Active Traders', val: platformStats.activeTraders },
            { label: 'Total Funded', val: platformStats.totalFunded },
          ].map((stat, i) => (
            <View key={i} style={{ flexBasis: '46%', flexGrow: 1 }}>
              <NeumorphicCard style={{ padding: 18 }}>
                <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '700' }}>{stat.label}</Text>
                <Text style={{ fontSize: 18, color: colors.textPrimary, fontWeight: '900', marginTop: 6 }}>{stat.val}</Text>
              </NeumorphicCard>
            </View>
          ))}
        </View>

        {/* Payout Options */}
        <Text style={s.sectionHeaderTitle}>Payout Options</Text>
        <View style={{ gap: 16, marginTop: 16, marginBottom: 40 }}>
          {payoutOptions.map(opt => (
            <NeumorphicCard key={opt.id} style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
              <View style={[s.payoutIcon, opt.isPromo && { borderColor: colors.primary, borderWidth: 2 }]}>
                <Feather name={opt.icon as any} size={20} color={opt.isPromo ? colors.primary : colors.textPrimary} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: opt.isPromo ? colors.primary : colors.textPrimary }}>{opt.title}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginTop: 4 }}>{opt.description}</Text>
              </View>
            </NeumorphicCard>
          ))}
        </View>

        <View style={s.footerLinks}>
          <Text style={s.footerLinkText}>Cookie Settings</Text>
          <Text style={{ color: colors.textTertiary, fontWeight: '900' }}>·</Text>
          <Text style={s.footerLinkText}>Privacy Policy</Text>
          <Text style={{ color: colors.textTertiary, fontWeight: '900' }}>·</Text>
          <Text style={s.footerLinkText}>Terms & Conditions</Text>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textTertiary, fontWeight: '600', marginBottom: 40 }}>© 2025 YoPips. All rights reserved.</Text>
      </View>
    );
  };

  const renderHistoryItem = ({ item }: { item: AccountHistoryItem }) => (
    <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
      <NeumorphicCard style={{ padding: 20 }}>
        <View style={s.rowBetween}>
          <View style={[s.rowStart, { gap: 8 }]}>
            <Badge label={item.status} type={item.status === 'PASSED' ? 'success' : item.status === 'BREACHED' ? 'danger' : 'default'} size="sm" />
            <Badge label={item.program} type="info" size="sm" />
          </View>
          <View style={[s.rowStart, { gap: 12 }]}>
            <CustomToggle value={item.visible} onValueChange={() => toggleAccountVisibility(item.id, item.visible)} />
            <TouchableOpacity onPress={() => navigation.navigate('AccountDetails')}><Feather name="chevron-right" size={20} color={colors.textTertiary} /></TouchableOpacity>
          </View>
        </View>

        <View style={[s.rowStart, { marginTop: 16, gap: 8 }]}>
          <Feather name="monitor" size={14} color={colors.textTertiary} />
          <Text style={{ fontSize: 16, color: colors.textPrimary, fontWeight: '800' }}>{item.accountId}</Text>
          <Feather name="copy" size={14} color={colors.textTertiary} />
        </View>
        <Text style={{ fontSize: 14, color: colors.textSecondary, fontWeight: '600', marginTop: 4 }}>{item.phase}  ┬╖  ${item.balance.toLocaleString('en-US')}</Text>
      </NeumorphicCard>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // RENDER ─────────────────────────────────────────────────────────────────
  const scrollContext = React.useContext(ScrollContext);
  const scrollY = scrollContext && scrollContext.scrollY ? scrollContext.scrollY : new Animated.Value(0);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <AppHeader title={`Hi, ${userProfile?.firstName || 'Trader'}`} showBack={false} />
      <AppBackground />

      <View style={{ flex: 1, backgroundColor: 'transparent', overflow: 'hidden' }}>
        <Animated.FlatList
          data={activeAccount ? history : []}
          keyExtractor={(item: any) => item.id}
          renderItem={renderHistoryItem}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={activeAccount ? renderFooter : null}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListEmptyComponent={
            activeAccount ? (
              <View style={s.loader}>
                <Feather name="inbox" size={40} color={colors.textTertiary} />
                <Text style={{ fontSize: 14, color: colors.textSecondary, fontWeight: '700', marginTop: 12 }}>No accounts found.</Text>
              </View>
            ) : null
          }
        />
      </View>
    </View>
  );
};

// ────────────────────── DIRECT INLINE STYLES FOR EXACT PRECISION ──────────────────────
const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  pad: { paddingHorizontal: 24 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },

  // Helpers
  rowStart: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  // Headers
  headerBar: { marginTop: 24, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageGreeting: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -1, flex: 1, marginTop: 4 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.appSurfaceBorder, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center' },
  iconBtnTrans: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.appSurfaceBorder, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center' },

  // Top elements
  accountNumber: { fontSize: 20, fontWeight: '500', color: colors.textPrimary },
  balanceText: { fontSize: 36, fontWeight: '500', color: colors.textPrimary, marginTop: 16, letterSpacing: -0.5 },

  safeToTradeText: { fontSize: 16, color: colors.textPrimary, fontWeight: '500' },
  goldPlayCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },

  // Progress Section Image 1
  progressSection: { marginTop: 32, gap: 20 },
  progressRow: { flexDirection: 'row', alignItems: 'center' },
  progressDetail: { width: 4, height: 28, borderRadius: 2, backgroundColor: colors.border, justifyContent: 'flex-end', overflow: 'hidden' },
  progressColorBar: { width: '100%', borderRadius: 2 },
  progressLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  progressPercent: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },

  // Reset Timer
  dotWarning: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 5 },
  resetTitle: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  resetSub: { fontSize: 12, color: colors.textSecondary, marginTop: 4, lineHeight: 16 },

  // View Details Primary Pill Button
  viewDetailsContainer: { marginTop: 32, borderRadius: 999, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 24, elevation: 8 },
  viewDetailsGradient: { paddingVertical: 18, paddingHorizontal: 24, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  viewDetailsTxt: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },

  // Secondary Action Buttons (Credentials, Metrics)
  secondaryActionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardBackground, paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 },
  secondaryActionIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  secondaryActionTxt: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  // Challenge Progress & Rules Cards
  cardLabel: { fontSize: 13, fontWeight: '800', color: colors.primary, textTransform: 'uppercase', letterSpacing: 1 },
  statsMiniBox: { flex: 1, backgroundColor: colors.background, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  ruleBox: { flexBasis: '47%', flexGrow: 1, backgroundColor: colors.background, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },

  // Generic Headers
  sectionHeaderTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.3 },

  // Filters
  filterChip: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 1 },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  filterChipTextActive: { color: colors.textPrimary, fontWeight: '800' },

  // Payout section
  payoutIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },

  // Footer Links
  footerLinks: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 12 },
  footerLinkText: { color: colors.textPrimary, fontSize: 13, fontWeight: '800' },

  // Empty State from previous implementation
  img2Header: { ...typography.h2 },
  img2Subtitle: { ...typography.body, color: colors.textSecondary, marginTop: 4 },
  emptyHero: { alignItems: 'center', paddingVertical: 48 },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 8, elevation: 1 },
  emptyHeroTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 8 },
  emptyHeroSub: { ...typography.body, color: colors.textSecondary, marginBottom: 24, textAlign: 'center' },
  btnGoldContainer: { borderRadius: 999, shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.6, shadowRadius: 24, elevation: 8 },
  btnGoldGradient: { paddingHorizontal: 24, paddingVertical: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnGoldTxt: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});
