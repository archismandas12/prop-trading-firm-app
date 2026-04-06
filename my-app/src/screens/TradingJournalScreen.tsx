import { useTheme } from '../theme/ThemeContext';
import { BlurView } from 'expo-blur';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform, RefreshControl, Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { BackButton } from '../components/ui/BackButton';
import { AppHeader } from '../components/ui/AppHeader';
import {
  TradingJournalService,
  JournalKPI, SecondaryMetric, PerformanceMetrics, HourlyPnLEntry, SessionSummary, SymbolPerformance, TradeHistoryItem, JournalAccount
} from '../services/TradingJournalService';

export const TradingJournalScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Data state
  const [selectedTab, setSelectedTab] = useState<'Pair' | 'Session' | 'Strategy'>('Pair');
  const [accounts, setAccounts] = useState<JournalAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [kpis, setKpis] = useState<JournalKPI[]>([]);
  const [secondaryMetrics, setSecondaryMetrics] = useState<SecondaryMetric[]>([]);
  const [perfMetrics, setPerfMetrics] = useState<PerformanceMetrics | null>(null);
  const [hourlyPnL, setHourlyPnL] = useState<HourlyPnLEntry[]>([]);
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [symbols, setSymbols] = useState<SymbolPerformance[]>([]);
  const [trades, setTrades] = useState<TradeHistoryItem[]>([]);

  const loadData = useCallback(async (accountId: string) => {
    const [k, sm, pm, hp, ss, sp, th] = await Promise.all([
      TradingJournalService.getKPIs(accountId),
      TradingJournalService.getSecondaryMetrics(accountId),
      TradingJournalService.getPerformanceMetrics(accountId),
      TradingJournalService.getHourlyPnL(accountId),
      TradingJournalService.getSessionSummaries(accountId),
      TradingJournalService.getSymbolPerformance(accountId),
      TradingJournalService.getTradeHistory(accountId),
    ]);
    setKpis(k); setSecondaryMetrics(sm); setPerfMetrics(pm);
    setHourlyPnL(hp); setSessions(ss); setSymbols(sp); setTrades(th);
  }, []);

  useEffect(() => {
    (async () => {
      const accs = await TradingJournalService.getAccounts();
      setAccounts(accs);
      const defaultId = accs[0]?.id || '';
      setSelectedAccount(defaultId);
      await loadData(defaultId);
      setLoading(false);
    })();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(selectedAccount);
    setRefreshing(false);
  };

  const onSync = async () => {
    setSyncing(true);
    await TradingJournalService.syncTrades(selectedAccount);
    await loadData(selectedAccount);
    setSyncing(false);
    Alert.alert('Synced', 'Trades synced successfully.');
  };

  const selectAccount = async (id: string) => {
    setSelectedAccount(id);
    setShowAccountPicker(false);
    setLoading(true);
    await loadData(id);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={s.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="Journal" showBack={true}>
        {/* Pills Row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 4 }}>
          {/* Account Dropdown */}
          <TouchableOpacity
            style={[s.accountPicker, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', paddingVertical: 6, paddingHorizontal: 12 }]}
            onPress={() => setShowAccountPicker(!showAccountPicker)}
          >
            <Text style={[s.accountPickerText, { color: '#3B82F6', fontSize: 13 }]}>#{selectedAccount}</Text>
            <Feather name="chevron-down" size={14} color="#3B82F6" />
          </TouchableOpacity>

          {/* Sync Button */}
          <TouchableOpacity
            style={[s.syncButton, { backgroundColor: 'transparent', borderColor: 'rgba(59, 130, 246, 0.3)', paddingVertical: 6, paddingHorizontal: 12 }]}
            onPress={onSync} disabled={syncing}
          >
            <Feather name="refresh-cw" size={13} color="#3B82F6" />
            <Text style={[s.syncText, { color: '#3B82F6', fontSize: 13 }]}>{syncing ? '...' : 'Sync'}</Text>
          </TouchableOpacity>
        </View>
      </AppHeader>
      {/* Account Picker Dropdown (Absolute Float) */}
      {showAccountPicker && (
        <View style={[s.pickerDropdown, { zIndex: 200, top: Platform.OS === 'ios' ? 124 : 100, left: 84, width: 140 }]}>
          {accounts.map(acc => (
            <TouchableOpacity key={acc.id} style={s.pickerItem} onPress={() => selectAccount(acc.id)}>
              <Text style={[s.pickerItemText, acc.id === selectedAccount && { fontWeight: '800', color: colors.textPrimary }]}>
                {acc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ flex: 1, backgroundColor: colors.background, overflow: 'hidden' }}>
        <ScrollView
          style={s.container}
          contentContainerStyle={[s.content, { paddingTop: 24 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.warning} />}
        >

          {/* ────────── TAB SELECTOR (Pair, Session, Strategy) ────────── */}
          <View style={s.journalTabControl}>
            <TouchableOpacity
              style={[s.journalTabSegment, selectedTab === 'Pair' && s.journalTabSegmentActive]}
              onPress={() => setSelectedTab('Pair')}
            >
              <Text style={selectedTab === 'Pair' ? s.journalTabSegmentTextActive : s.journalTabSegmentText}>Pair</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.journalTabSegment, selectedTab === 'Session' && s.journalTabSegmentActive]}
              onPress={() => setSelectedTab('Session')}
            >
              <Text style={selectedTab === 'Session' ? s.journalTabSegmentTextActive : s.journalTabSegmentText}>Session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.journalTabSegment, selectedTab === 'Strategy' && s.journalTabSegmentActive]}
              onPress={() => setSelectedTab('Strategy')}
            >
              <Text style={selectedTab === 'Strategy' ? s.journalTabSegmentTextActive : s.journalTabSegmentText}>Strategy</Text>
            </TouchableOpacity>
          </View>

          {/* ────────── SECTION 1: TOP KPI CARDS (2x2) ────────── */}
          <View style={s.kpiGrid}>
            {kpis.map((kpi, i) => (
              <TouchableOpacity key={i} style={s.kpiCard} activeOpacity={0.7}>
                <Text style={[s.kpiLabel, { minHeight: 28 }]}>{kpi.label}</Text>
                <View style={{ alignItems: 'center', gap: 6 }}>
                  <Text style={s.kpiValue} numberOfLines={1} adjustsFontSizeToFit>{kpi.value}</Text>
                  {kpi.subLabel && <Text style={s.kpiBadge}>{kpi.subLabel}</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ────────── SECTION 2: SECONDARY METRICS ────────── */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.secondaryScroll} contentContainerStyle={{ gap: 10, paddingRight: 4 }}>
            {secondaryMetrics.map((m, i) => (
              <TouchableOpacity key={i} style={s.secondaryCard} activeOpacity={0.7}>
                <Text style={s.secondaryLabel}>{m.label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name={m.icon} size={14} color={m.color} />
                  <Text style={[s.secondaryValue, { color: m.color }]}>{m.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ────────── SECTION 3: PERFORMANCE METRICS ────────── */}
          {perfMetrics && (
            <View style={s.card}>
              <Text style={s.sectionTitle}>PERFORMANCE METRICS</Text>
              <View style={s.perfRow}>
                <Text style={s.perfLabel}>Current Streak</Text>
                <Text style={[s.perfValue, { color: perfMetrics.streakColor }]}>{perfMetrics.currentStreak}</Text>
              </View>
              <View style={s.perfDivider} />
              <View style={s.perfRow}>
                <Text style={s.perfLabel}>Longest Win Run</Text>
                <Text style={s.perfValue}>{perfMetrics.longestWinRun}</Text>
              </View>
              <View style={s.perfDivider} />
              <View style={s.perfRow}>
                <Text style={s.perfLabel}>Longest Drawdown</Text>
                <Text style={s.perfValue}>{perfMetrics.longestDrawdown}</Text>
              </View>
              <View style={s.perfDivider} />
              <View style={s.perfRow}>
                <Text style={s.perfLabel}>Net Profit</Text>
                <Text style={[s.perfValue, { color: perfMetrics.netProfitColor }]}>{perfMetrics.netProfit}</Text>
              </View>
            </View>
          )}

          {/* ────────── SECTION 4: HOURLY PNL ────────── */}
          <View style={s.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="clock" size={16} color={colors.textSecondary} />
                <Text style={s.sectionTitle}>Hourly PnL</Text>
              </View>
              <Text style={s.utcLabel}>UTC TIME</Text>
            </View>

            {/* Simplified Bar Chart */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={s.barChartContainer}>
                {hourlyPnL.map((entry, i) => (
                  <TouchableOpacity key={i} style={s.barColumn} activeOpacity={0.7}>
                    <View style={[s.bar, {
                      height: Math.max(4, Math.abs(entry.value) * 2),
                      backgroundColor: entry.value >= 0 ? colors.warning : '#DC2626',
                    }]} />
                    <Text style={s.barLabel}>{entry.hour}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Session Summary */}
            <View style={s.sessionRow}>
              {sessions.map((sess, i) => (
                <TouchableOpacity key={i} style={s.sessionCard} activeOpacity={0.7}>
                  <Text style={s.sessionLabel}>{sess.session}</Text>
                  <Text style={[s.sessionValue, { color: sess.color }]}>{sess.value}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ────────── SECTION 5: SYMBOL PERFORMANCE ────────── */}
          <View style={s.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={s.sectionTitle}>SYMBOL PERFORMANCE</Text>
              <View style={s.volBadge}>
                <Text style={s.volBadgeText}>Top 5 by Vol</Text>
              </View>
            </View>

            {/* Table Header */}
            <View style={s.tableHeader}>
              <Text style={[s.thCell, { flex: 1.2 }]}>SYMBOL</Text>
              <Text style={[s.thCell, { flex: 1 }]}>NET PNL</Text>
              <Text style={[s.thCell, { flex: 0.8 }]}>VOL</Text>
              <Text style={[s.thCell, { flex: 0.7 }]}>TRADES</Text>
              <Text style={[s.thCell, { flex: 0.8 }]}>WIN %</Text>
            </View>
            {symbols.map((sym, i) => (
              <TouchableOpacity key={i} style={s.tableRow} activeOpacity={0.7}>
                <Text style={[s.tdCell, { flex: 1.2, fontWeight: '700' }]}>{sym.symbol}</Text>
                <Text style={[s.tdCell, { flex: 1, color: sym.pnlColor }]}>{sym.netPnl}</Text>
                <Text style={[s.tdCell, { flex: 0.8 }]}>{sym.volume}</Text>
                <Text style={[s.tdCell, { flex: 0.7 }]}>{sym.trades}</Text>
                <Text style={[s.tdCell, { flex: 0.8 }]}>{sym.winRate}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ────────── SECTION 6: TRADE HISTORY ────────── */}
          <View style={s.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Feather name="trending-up" size={16} color={colors.textPrimary} />
                <Text style={s.sectionTitle}>Trade History</Text>
              </View>
              <Text style={s.syncedLabel}>{trades.length} trades synced</Text>
            </View>

            {trades.length === 0 ? (
              <View style={s.emptyState}>
                <Feather name="inbox" size={36} color={colors.textTertiary} />
                <Text style={s.emptyText}>No trades recorded yet</Text>
                <Text style={s.emptySubText}>Sync your account to load trade history</Text>
              </View>
            ) : (
              trades.map(trade => (
                <TouchableOpacity key={trade.id} style={s.tradeRow} activeOpacity={0.7}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text style={s.tradeSymbol}>{trade.symbol}</Text>
                      <View style={[s.directionBadge, { backgroundColor: trade.direction === 'BUY' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)' }]}>
                        <Text style={[s.directionText, { color: trade.direction === 'BUY' ? '#22C55E' : '#EF4444' }]}>{trade.direction}</Text>
                      </View>
                    </View>
                    <Text style={s.tradeTime}>{trade.openTime} → {trade.closeTime}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[s.tradePnl, { color: trade.pnlColor }]}>{trade.pnl}</Text>
                    <Text style={s.tradeVol}>{trade.volume} lots</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Bottom Spacer */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
};

// ──────────────────────────── DIRECT INLINE STYLES FOR EXACT PRECISION ────────────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  glassHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingBottom: 20, paddingHorizontal: 24,
    zIndex: 1000, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 24, paddingVertical: 16, paddingTop: Platform.OS === 'ios' ? 60 : 32 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },

  // Header
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 10 },
  backButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardBackground,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  accountPicker: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.cardBackground, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  accountPickerText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  syncButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.cardBackground, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  syncText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  pickerDropdown: {
    backgroundColor: colors.cardBackground, borderRadius: 16, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  pickerItem: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.divider },
  pickerItemText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },

  // Title
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 32 },
  titleIcon: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12
  },
  titleText: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  subtitleText: { display: 'none' }, // Hiding based on mockup minimalism

  journalTabControl: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground, // Cream surface
    borderRadius: 999,
    padding: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  journalTabSegment: { flex: 1, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  journalTabSegmentActive: {
    backgroundColor: colors.background,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4,
    borderWidth: 1, borderColor: colors.border
  },
  journalTabSegmentText: { fontSize: 13, fontWeight: '700', color: colors.textTertiary },
  journalTabSegmentTextActive: { color: colors.textPrimary, fontWeight: '800' },

  // KPI Grid
  kpiGrid: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  kpiCard: {
    flex: 1, backgroundColor: colors.cardBackground, borderRadius: 20,
    paddingVertical: 16, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4,
    alignItems: 'center'
  },
  kpiLabel: { fontSize: 10, fontWeight: '800', color: colors.textTertiary, letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase', textAlign: 'center' },
  kpiValue: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5, textAlign: 'center' },
  kpiBadge: {
    fontSize: 10, fontWeight: '700', color: '#15803D',
    backgroundColor: 'rgba(34,197,94,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
  },

  // Secondary Metrics
  secondaryScroll: { marginBottom: 24 },
  secondaryCard: {
    backgroundColor: colors.cardBackground, borderRadius: 20, padding: 18,
    minWidth: 130, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  secondaryLabel: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.6, marginBottom: 8, textTransform: 'uppercase' },
  secondaryValue: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },

  // Base Neumorphic Card container for bottom sections
  card: {
    backgroundColor: colors.cardBackground, borderRadius: 32, padding: 24,
    marginBottom: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  sectionTitle: {
    fontSize: 14, fontWeight: '800', color: colors.textPrimary, letterSpacing: 0.8, textTransform: 'uppercase'
  },

  // Performance Metrics
  perfRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  perfLabel: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
  perfValue: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  perfDivider: { height: 1, backgroundColor: colors.divider },

  // Hourly PnL
  utcLabel: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.6 },
  barChartContainer: { flexDirection: 'row', alignItems: 'flex-end', height: 100, gap: 4, marginBottom: 24, justifyContent: 'center' },
  barColumn: { alignItems: 'center', width: 32 },
  bar: { width: 16, borderRadius: 8, minHeight: 8, backgroundColor: colors.primary },
  barLabel: { fontSize: 11, color: colors.textTertiary, marginTop: 8, fontWeight: '700' },

  // Sessions
  sessionRow: { flexDirection: 'row', gap: 12 },
  sessionCard: {
    flex: 1, backgroundColor: colors.background, borderRadius: 16, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: colors.border,
  },
  sessionLabel: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' },
  sessionValue: { fontSize: 18, fontWeight: '800' },

  // Symbol Performance Table
  volBadge: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
  },
  volBadgeText: { fontSize: 12, fontWeight: '700', color: colors.primary },
  tableHeader: {
    flexDirection: 'row', paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.divider, marginBottom: 8,
  },
  thCell: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, letterSpacing: 0.5 },
  tableRow: {
    flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  tdCell: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  // Trade History List directly mirroring mockup Screen 3
  syncedLabel: { fontSize: 13, fontWeight: '600', color: colors.textTertiary },
  emptyState: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '700', color: colors.textSecondary },
  emptySubText: { fontSize: 14, color: colors.textTertiary },
  tradeRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  tradeSymbol: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  directionBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  directionText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  tradeTime: { fontSize: 13, color: colors.textTertiary, fontWeight: '600' },
  tradePnl: { fontSize: 18, fontWeight: '800', marginBottom: 4 },
  tradeVol: { fontSize: 13, color: colors.textTertiary, fontWeight: '600', textAlign: 'right' },
});
