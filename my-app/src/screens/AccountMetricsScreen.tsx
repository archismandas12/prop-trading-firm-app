import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
  ActivityIndicator, Dimensions, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { BackButton } from '../components/ui/BackButton';
import { AppBackground } from '../components/ui/AppBackground';
import { AppHeader } from '../components/ui/AppHeader';
import {
  DashboardService,
  MetricsOverview, ConsistencyScore, Objective, AccountStatistics,
  DailyPnLEntry, PerformanceMetric, HourlyPnLEntry, SymbolPerf, TradeHistoryEntry, ActiveAccount,
} from '../services/DashboardService';

const { width: SW } = Dimensions.get('window');
const TABS = ['Overview', 'Trades'];

export const AccountMetricsScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors), [colors]); const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  const [account, setAccount] = useState<ActiveAccount | null>(null);
  const [overview, setOverview] = useState<MetricsOverview | null>(null);
  const [consistency, setConsistency] = useState<ConsistencyScore | null>(null);
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [stats, setStats] = useState<AccountStatistics | null>(null);
  const [dailyPnL, setDailyPnL] = useState<DailyPnLEntry[]>([]);
  const [perfMetrics, setPerfMetrics] = useState<PerformanceMetric[]>([]);
  const [hourlyPnL, setHourlyPnL] = useState<HourlyPnLEntry[]>([]);
  const [symbols, setSymbols] = useState<SymbolPerf[]>([]);
  const [trades, setTrades] = useState<TradeHistoryEntry[]>([]);
  const [tradeFilter, setTradeFilter] = useState('All');

  const loadData = useCallback(async () => {
    setLoading(true);
    const [acc, ov, cs, obj, st, dp, pm, hp, sp, th] = await Promise.all([
      DashboardService.getActiveAccount(),
      DashboardService.getMetricsOverview(),
      DashboardService.getConsistencyScore(),
      DashboardService.getObjectives(),
      DashboardService.getStatistics(),
      DashboardService.getDailyPnL(),
      DashboardService.getPerformanceMetrics(),
      DashboardService.getHourlyPnL(),
      DashboardService.getSymbolPerformance(),
      DashboardService.getTradeHistory(),
    ]);
    setAccount(acc); setOverview(ov); setConsistency(cs); setObjectives(obj);
    setStats(st); setDailyPnL(dp); setPerfMetrics(pm); setHourlyPnL(hp);
    setSymbols(sp); setTrades(th); setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const fmt = (v: number) => `$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const fmtSigned = (v: number) => `${v >= 0 ? '+' : '-'}$${Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const pnlColor = (v: number) => v > 0 ? '#22C55E' : v < 0 ? '#EF4444' : '#9CA3AF';

  if (loading) {
    return (
      <View style={[s.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#FFFFFF" style={{ flex: 1 }} />
      </View>
    );
  }

  const filteredTrades = tradeFilter === 'All' ? trades : trades.filter(t => t.type === tradeFilter.toUpperCase());
  const maxHourly = Math.max(...hourlyPnL.map(h => Math.abs(h.value)), 1);
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const cellSize = (SW - 80) / 7;

  return (
    <View style={s.container}>
      <AppHeader title="Account Metrics" subtitle={`#${account?.id} · ${account?.type?.toUpperCase()}`} showBack={true} />
      <AppBackground />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* ═══ BALANCE / EQUITY / PNL CARD ═══ */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 }}>
          <View style={s.balanceCard}>
            <View style={s.heroBigRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.heroLabel}>BALANCE</Text>
                <Text style={s.heroBigValue}>{fmt(overview?.balance ?? 0)}</Text>
              </View>
              <View style={s.heroDivider} />
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text style={s.heroLabel}>EQUITY</Text>
                <Text style={s.heroBigValue}>{fmt(overview?.equity ?? 0)}</Text>
              </View>
            </View>

            <View style={s.pnlChip}>
              <Feather
                name={(overview?.todayPnL ?? 0) >= 0 ? 'trending-up' : 'trending-down'}
                size={16}
                color={colors.primary}
              />
              <Text style={s.pnlChipText}>
                Today's P/L: {fmtSigned(overview?.todayPnL ?? 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* ═══ TAB SWITCHER ═══ */}
        <View style={s.segmentControl}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[s.segment, activeTab === tab && s.segmentActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[s.segmentText, activeTab === tab && s.segmentTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Overview' ? (
          <>
            {/* ═══ CONSISTENCY SCORE ═══ */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Consistency Score</Text>
              <View style={s.consistencyCard}>
                <View style={s.circularGauge}>
                  <Text style={s.gaugePercent}>{consistency?.score ?? 0}%</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                  <Text style={s.consistencyStatus}>{consistency?.status}</Text>
                  <View style={s.miniBar}>
                    <View style={[s.miniBarFill, { width: `${Math.max(consistency?.score ?? 0, 2)}%` }]} />
                  </View>
                  <Text style={s.consistencyHint}>Complete objectives to increase score</Text>
                </View>
              </View>
            </View>

            {/* ═══ OBJECTIVES ═══ */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Objectives</Text>
              {objectives.map((obj, i) => {
                const statusColor = obj.status === 'passed' ? '#22C55E' : obj.status === 'failed' ? '#EF4444' : colors.warning;
                const statusBg = obj.status === 'passed' ? 'rgba(34,197,94,0.1)' : obj.status === 'failed' ? 'rgba(239,68,68,0.1)' : 'rgba(250,204,21,0.1)';
                return (
                  <View key={i} style={s.objCard}>
                    <View style={[s.objDot, { backgroundColor: statusColor }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.objTitle}>{obj.label}</Text>
                      <Text style={s.objSub}>{obj.current} / {obj.target}</Text>
                    </View>
                    <View style={[s.objBadge, { backgroundColor: statusBg }]}>
                      <Text style={[s.objBadgeText, { color: statusColor }]}>
                        {obj.status === 'passed' ? '✓ Passed' : obj.status === 'failed' ? '✗ Failed' : '● Ongoing'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* ═══ QUICK STATS — 2x2 Neumorphic Grid ═══ */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Statistics</Text>
              <View style={s.statGrid}>
                {[
                  { label: 'Trades', value: `${stats?.totalTrades}`, icon: 'activity' },
                  { label: 'Win Rate', value: `${stats?.winRate}%`, icon: 'target' },
                  { label: 'Profit Factor', value: `${stats?.profitFactor}`, icon: 'trending-up' },
                  { label: 'Avg Win', value: fmt(stats?.avgWin ?? 0), icon: 'arrow-up-circle' },
                  { label: 'Avg Loss', value: fmt(stats?.avgLoss ?? 0), icon: 'arrow-down-circle' },
                  { label: 'Lots', value: `${stats?.totalLots}`, icon: 'layers' },
                  { label: 'Expectancy', value: fmt(stats?.expectancy ?? 0), icon: 'bar-chart' },
                  { label: 'R:R', value: `${stats?.riskReward}:1`, icon: 'shield' },
                ].map((item, i) => (
                  <View key={i} style={s.statChip}>
                    <View style={s.statChipIcon}>
                      <Feather name={item.icon as any} size={18} color={colors.warning} />
                    </View>
                    <Text style={s.statChipVal}>{item.value}</Text>
                    <Text style={s.statChipLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ═══ PERFORMANCE METRICS ═══ */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Performance</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 12 }}>
                {perfMetrics.map((m, i) => (
                  <View key={i} style={s.perfItem}>
                    <View style={s.perfIconCircle}>
                      <Feather name={m.icon as any} size={18} color={colors.warning} />
                    </View>
                    <Text style={s.perfVal}>{m.value}</Text>
                    <Text style={s.perfLbl}>{m.label}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* ═══ DAILY PROFIT CALENDAR ═══ */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Daily P/L</Text>
              <View style={s.calendarCard}>
                <View style={s.calMonthRow}>
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Feather name="chevron-left" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  <Text style={s.calMonthText}>February 2026</Text>
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={s.calDayNames}>
                  {dayNames.map((d, i) => <Text key={i} style={[s.calDayNameTxt, { width: cellSize }]}>{d}</Text>)}
                </View>

                <View style={s.calGrid}>
                  {/* Offset for February 2026 starting on Sunday — 6 empty cells (Mon-Sat) */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <View key={`e${i}`} style={s.calCellWrapper} />
                  ))}
                  {dailyPnL.map((day, i) => {
                    const num = parseInt(day.date.split('-')[2]);
                    const isProfit = day.profit > 0;
                    const isLoss = day.profit < 0;
                    return (
                      <View key={i} style={s.calCellWrapper}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          style={[
                            s.calCell,
                            isProfit && s.calCellGreen,
                            isLoss && s.calCellRed,
                          ]}
                        >
                          <Text style={[
                            s.calCellNum,
                            isProfit && { color: '#16A34A' },
                            isLoss && { color: '#DC2626' },
                          ]}>{num}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* ═══ HOURLY PnL ═══ */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Hourly Activity</Text>
              <View style={s.hourlyCard}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 4 }}>
                  <View style={s.hourlyChartContainer}>
                    {hourlyPnL.map((h, i) => {
                      const barH = h.value === 0 ? 4 : Math.max((Math.abs(h.value) / maxHourly) * 60, 4);
                      const isPos = h.value >= 0;
                      return (
                        <View key={i} style={s.hourlyCol}>
                          <View style={s.hourlyBarWrap}>
                            <View style={[
                              s.hourlyBar,
                              { height: barH, backgroundColor: h.value === 0 ? colors.border : isPos ? '#22C55E' : '#EF4444' }
                            ]} />
                          </View>
                          <Text style={s.hourTxt}>{h.hour}</Text>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
              </View>
            </View>

            {/* ═══ SYMBOL PERFORMANCE ═══ */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>Symbols</Text>
              {symbols.map((sym, i) => (
                <TouchableOpacity key={i} style={s.symbolRow} activeOpacity={0.7}>
                  <View style={s.symbolBadge}>
                    <Text style={s.symbolBadgeText}>{sym.symbol.substring(0, 3)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.symbolName}>{sym.symbol}</Text>
                    <Text style={s.symbolMeta}>{sym.volume} lots · {sym.winRate}% win</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[s.symbolPnl, { color: pnlColor(sym.pnl) }]}>{fmtSigned(sym.pnl)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <>
            {/* ═══ TRADES TAB ═══ */}
            <View style={s.section}>
              {/* Filter Chips */}
              <View style={s.chipRow}>
                {['All', 'Buy', 'Sell'].map(f => (
                  <TouchableOpacity
                    key={f}
                    style={[s.filterChip, tradeFilter === f && s.filterChipActive]}
                    onPress={() => setTradeFilter(f)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.filterChipText, tradeFilter === f && s.filterChipTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Trade Cards */}
              {filteredTrades.map((t, i) => (
                <TouchableOpacity key={i} style={s.tradeCard} activeOpacity={0.7}>
                  <View style={s.tradeTop}>
                    <View style={[s.tradeTypeBadge, { backgroundColor: t.type === 'BUY' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }]}>
                      <Feather
                        name={t.type === 'BUY' ? 'arrow-up-right' : 'arrow-down-right'}
                        size={14}
                        color={t.type === 'BUY' ? '#22C55E' : '#EF4444'}
                      />
                      <Text style={[s.tradeTypeText, { color: t.type === 'BUY' ? '#22C55E' : '#EF4444' }]}>{t.type}</Text>
                    </View>
                    <Text style={s.tradeSymbol}>{t.symbol}</Text>
                    <Text style={[s.tradePnl, { color: pnlColor(t.pnl) }]}>{fmtSigned(t.pnl)}</Text>
                  </View>
                  <View style={s.tradeBottom}>
                    <View style={s.tradeMeta}>
                      <Feather name="hash" size={12} color="#9CA3AF" />
                      <Text style={s.tradeMetaText}>{t.ticket}</Text>
                    </View>
                    <View style={s.tradeMeta}>
                      <Feather name="layers" size={12} color="#9CA3AF" />
                      <Text style={s.tradeMetaText}>{t.lots} lots</Text>
                    </View>
                    <View style={s.tradeMeta}>
                      <Feather name="clock" size={12} color="#9CA3AF" />
                      <Text style={s.tradeMetaText}>{t.closeTime.split(' ')[1]}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {filteredTrades.length === 0 && (
                <View style={[s.emptyState, { alignItems: 'center', padding: 40 }]}>
                  <Feather name="inbox" size={48} color="#D1D5DB" />
                  <Text style={[s.emptyText, { color: colors.textSecondary }]}>No trades found</Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// ══════════════ STYLES (Cream/Gold Neumorphic) ══════════════
const getStyles = (colors: any) => StyleSheet.create({
  glassHeader: {
    position: 'absolute', top: 0, left: 0, right: 0,
    paddingTop: Platform.OS === 'ios' ? 64 : 48, paddingBottom: 20, paddingHorizontal: 24,
    zIndex: 1000, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 120 },

  // Balance/Equity Card
  balanceCard: {
    backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },

  // Base Neumorphic Card Component Map
  neumorphicCard: {
    backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginHorizontal: 24,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },

  // ── Hero Card (Neumorphic Style) ──
  heroCard: {
    backgroundColor: colors.cardBackground,
    borderBottomLeftRadius: 0, borderBottomRightRadius: 0,
    paddingTop: Platform.OS === 'ios' ? 8 : 16, paddingBottom: 32, paddingHorizontal: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  heroHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  heroBackBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', marginRight: 16,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 13, color: colors.textSecondary, fontWeight: '700', marginTop: 4, letterSpacing: 0.5 },

  heroBigRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  heroLabel: { fontSize: 13, fontWeight: '800', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroBigValue: { fontSize: 28, fontWeight: '900', color: colors.textPrimary, marginTop: 4, letterSpacing: -0.5 },
  heroDivider: { width: 1, height: 48, backgroundColor: colors.divider, marginHorizontal: 20 },

  pnlChip: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, gap: 10,
    backgroundColor: 'rgba(34, 211, 238, 0.1)', // Gold tint
  },
  pnlChipText: { fontSize: 15, fontWeight: '800', color: colors.primary },

  // ── Segment Control (Floating Pill matching Journal Mockup) ──
  segmentControl: {
    flexDirection: 'row', marginHorizontal: 24, marginTop: 24, marginBottom: 16,
    backgroundColor: colors.cardBackground, borderRadius: 999, padding: 6,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  segment: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: 999 },
  segmentActive: {
    backgroundColor: colors.background,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4,
    borderWidth: 1, borderColor: colors.border
  },
  segmentText: { fontSize: 15, fontWeight: '700', color: colors.textTertiary },
  segmentTextActive: { color: colors.textPrimary, fontWeight: '800' },

  // ── Section ──
  section: { marginTop: 32 },
  sectionLabel: {
    fontSize: 18, fontWeight: '900', color: colors.textPrimary,
    marginHorizontal: 24, marginBottom: 16, letterSpacing: -0.3,
  },

  // ── Consistency (Super-Ellipse Card) ──
  consistencyCard: { // Applies Neumorphic
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  circularGauge: {
    width: 80, height: 80, borderRadius: 40,
    borderWidth: 6, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
  },
  gaugePercent: { fontSize: 22, fontWeight: '900', color: colors.textPrimary },
  consistencyStatus: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  miniBar: { height: 8, backgroundColor: colors.background, borderRadius: 4, overflow: 'hidden', marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  miniBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  consistencyHint: { fontSize: 12, color: colors.textTertiary, fontWeight: '600' },

  // ── Objectives ──
  objCard: { // Applies Neumorphic
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginBottom: 16, backgroundColor: colors.cardBackground,
    borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  objDot: { width: 12, height: 12, borderRadius: 6, marginRight: 16 },
  objTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  objSub: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  objBadge: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  objBadgeText: { fontSize: 12, fontWeight: '800' },

  // ── Stat Chips & Performance (Neumorphic 2x2 Logic adaptation) ──
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 24 },
  statChip: { // Half measure for grid (used in modified render)
    width: '47%', backgroundColor: colors.cardBackground, borderRadius: 20, padding: 18,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 12,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  statChipIcon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
  },
  statChipVal: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, marginBottom: 4, letterSpacing: -0.5 },
  statChipLabel: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Keep old single axis scroll styles just in case for Performance
  perfItem: {
    width: 140, backgroundColor: colors.cardBackground, borderRadius: 20, padding: 18,
    alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  perfIconCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  perfVal: { fontSize: 20, fontWeight: '900', color: colors.textPrimary, marginBottom: 4, letterSpacing: -0.5 },
  perfLbl: { fontSize: 11, fontWeight: '700', color: colors.textTertiary, textAlign: 'center' },

  // ── Calendar ──
  calendarCard: { // Applies Neumorphic
    marginHorizontal: 24, backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  calMonthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  calMonthText: { fontSize: 18, fontWeight: '900', color: colors.textPrimary },
  calDayNames: { flexDirection: 'row', marginBottom: 16 },
  calDayNameTxt: { flex: 1, textAlign: 'center', fontSize: 13, fontWeight: '800', color: colors.textTertiary },
  calGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calCellWrapper: { width: '14.28%', aspectRatio: 1, padding: 4 },
  calCell: { flex: 1, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  calCellGreen: { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.3)' },
  calCellRed: { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  calCellNum: { fontSize: 14, fontWeight: '800', color: colors.textSecondary },

  // ── Hourly ──
  hourlyCard: { // Applies Neumorphic
    marginHorizontal: 24, backgroundColor: colors.cardBackground, borderRadius: 24, paddingVertical: 24,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  hourlyChartContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  hourlyCol: { alignItems: 'center', marginHorizontal: 8, width: 24 },
  hourlyBarWrap: { height: 80, justifyContent: 'flex-end', alignItems: 'center' },
  hourlyBar: { width: 16, borderRadius: 8 },
  hourTxt: { fontSize: 11, color: colors.textTertiary, marginTop: 10, fontWeight: '800' },

  // ── Symbols ──
  symbolRow: { // Applies Neumorphic
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 24, marginBottom: 16, backgroundColor: colors.cardBackground,
    borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  symbolBadge: {
    width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 16,
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8
  },
  symbolBadgeText: { fontSize: 13, fontWeight: '900', color: colors.textPrimary },
  symbolName: { fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  symbolMeta: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', marginTop: 4 },
  symbolPnl: { fontSize: 18, fontWeight: '900' },

  // ── Trades Tab ──
  chipRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 20 },
  filterChip: {
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999,
    backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: 14, fontWeight: '800', color: colors.textSecondary },
  filterChipTextActive: { color: colors.textPrimary, fontWeight: '900' },

  tradeCard: { // Applies Neumorphic
    marginHorizontal: 24, marginBottom: 16, backgroundColor: colors.cardBackground,
    borderRadius: 24, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 4
  },
  tradeTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  tradeTypeBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, gap: 6, marginRight: 16 },
  tradeTypeText: { fontSize: 13, fontWeight: '900' },
  tradeSymbol: { flex: 1, fontSize: 16, fontWeight: '900', color: colors.textPrimary },
  tradePnl: { fontSize: 18, fontWeight: '900' },

  tradeBottom: { flexDirection: 'row', gap: 20 },
  tradeMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tradeMetaText: { fontSize: 13, color: colors.textTertiary, fontWeight: '700' },

  emptyState: { alignItems: 'center', paddingVertical: 64 },
  emptyText: { fontSize: 15, color: colors.textSecondary, fontWeight: '700', marginTop: 16 },
});




