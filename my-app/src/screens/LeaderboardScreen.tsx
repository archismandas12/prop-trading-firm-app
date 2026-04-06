import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { AppHeader } from '../components/ui/AppHeader';
import {
  TradersService,
  TraderEntry,
  LeaderboardFilters,
  LeaderboardStats,
} from '../services/TradersService';

// Medal styling per rank
const MEDALS: Record<number, { bg: string; text: string; ring: string }> = {
  1: { bg: '#F59E0B', text: '#1A1511', ring: '#3B82F6' },
  2: { bg: '#C0C0C0', text: '#1A1511', ring: '#9E9E9E' },
  3: { bg: '#CD7F32', text: '#FFF', ring: '#A0522D' },
};

export const LeaderboardScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors), [colors]); const navigation = useNavigation<any>();

  // ── State ──
  const [traders, setTraders] = useState<TraderEntry[]>([]);
  const [filters, setFilters] = useState<LeaderboardFilters | null>(null);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activePeriod, setActivePeriod] = useState('This Week');
  const [activeProgram, setActiveProgram] = useState('All Programs');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProgramMenu, setShowProgramMenu] = useState(false);

  // ── Data loading ──
  const loadData = useCallback(async () => {
    try {
      const [traderData, filterData, statsData] = await Promise.all([
        TradersService.getLeaderboard(activePeriod, activeProgram),
        TradersService.getFilters(),
        TradersService.getLeaderboardStats(),
      ]);
      setTraders(traderData);
      setFilters(filterData);
      setStats(statsData);
    } catch (e) {
      console.error('Leaderboard load error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activePeriod, activeProgram]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  // ── Derived data ──
  const filtered = traders.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.country?.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const top3 = filtered.slice(0, 3);
  const rest = filtered;

  // Podium display order: 2nd left, 1st center (elevated), 3rd right
  const podiumOrder = top3.length === 3
    ? [top3[1], top3[0], top3[2]]
    : top3;

  // ─────────────────────────────────────────────────────
  const renderPodiumCard = (trader: TraderEntry, podiumIdx: number) => {
    const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3;
    const medal = MEDALS[rank];
    const isFirst = rank === 1;
    return (
      <LinearGradient
        key={trader.id}
        colors={[colors.appAccentLight, colors.cardBackground]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[s.podiumCard, isFirst && s.podiumCardFirst]}
      >
        {/* Medal */}
        <View style={[s.medalCircle, { backgroundColor: medal.bg, borderColor: medal.ring }]}>
          <Text style={[s.medalText, { color: medal.text }]}>{rank}</Text>
        </View>

        {/* Avatar */}
        <View style={[s.podiumAvatar, isFirst && s.podiumAvatarFirst]}>
          <Text style={[s.podiumAvatarText, isFirst && { fontSize: 18 }]}>
            {trader.initials}
          </Text>
        </View>

        <Text style={s.podiumName} numberOfLines={1}>{trader.name}</Text>
        {!!trader.accountLabel && (
          <Text style={s.podiumAccount}>{trader.accountLabel}</Text>
        )}

        <Text style={s.podiumProfit}>{trader.profit}</Text>
        <Text style={s.podiumPct}>{trader.profitPercent}</Text>

        <View style={s.podiumStatRow}>
          <Text style={s.podiumStatLabel}>Win Rate</Text>
          <Text style={s.podiumStatValue}>{trader.winRate}</Text>
        </View>
        <View style={s.podiumStatRow}>
          <Text style={s.podiumStatLabel}>Trades</Text>
          <Text style={s.podiumStatValue}>{trader.totalTrades}</Text>
        </View>
      </LinearGradient>
    );
  };

  const renderTraderRow = (trader: TraderEntry, idx: number) => {
    const medal = MEDALS[trader.rank];
    const isMedal = trader.rank <= 3;
    return (
      <TouchableOpacity key={trader.id} style={s.rankRow} activeOpacity={0.75}>
        {/* Rank badge */}
        <View style={[s.rankBadge, isMedal && { backgroundColor: medal.bg }]}>
          <Text style={[s.rankBadgeText, isMedal && { color: medal.text }]}>
            {trader.rank}
          </Text>
        </View>

        {/* Avatar + info */}
        <View style={s.rankTraderInfo}>
          <View style={[s.rankAvatar, isMedal && { borderColor: medal.ring, borderWidth: 2 }]}>
            <Text style={s.rankAvatarText}>{trader.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.rankName} numberOfLines={1}>{trader.name}</Text>
            <Text style={s.rankMeta} numberOfLines={1}>
              {trader.country}{trader.accountLabel ? ` · ${trader.accountLabel}` : ''}
            </Text>
          </View>
        </View>

        {/* Profit */}
        <View style={{ width: 76, alignItems: 'flex-end' }}>
          <Text style={s.rankProfit}>{trader.profit}</Text>
          <Text style={s.rankPct}>{trader.profitPercent}</Text>
        </View>

        {/* Win Rate */}
        <Text style={s.rankWinRate}>{trader.winRate}</Text>

        {/* Status badge */}
        <View style={[
          s.statusBadge,
          trader.status === 'FUNDED'
            ? { backgroundColor: 'rgba(250,204,21,0.1)', borderColor: colors.warning }
            : { backgroundColor: 'rgba(16,185,129,0.1)', borderColor: '#10B981' },
        ]}>
          <Text style={[
            s.statusText,
            { color: trader.status === 'FUNDED' ? colors.warning : '#10B981' },
          ]}>
            {trader.status ?? 'ACTIVE'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // ── RENDER ──
  return (
    <View style={s.container}>
      <AppHeader title="Leaderboard" showBack={true} />
      <AppBackground />
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.warning]}
            tintColor={colors.warning}
          />
        }
      >
        {/* ── Community Stats (from backend) ── */}
        {stats && (
          <View style={s.statsRow}>
            {[
              { label: 'Total Payouts', value: stats.totalPayouts, icon: 'dollar-sign', iconBg: 'rgba(34, 197, 94, 0.15)', iconColor: '#22C55E' },
              { label: 'Active Traders', value: stats.activeTraders, icon: 'users', iconBg: 'rgba(96, 165, 250, 0.15)', iconColor: '#60A5FA' },
              { label: 'Avg Win Rate', value: stats.winRateAvg, icon: 'bar-chart-2', iconBg: 'rgba(251, 191, 36, 0.15)', iconColor: '#FBBF24' },
            ].map(stat => (
              <View key={stat.label} style={s.statCard}>
                <View style={[s.statIcon, { backgroundColor: stat.iconBg }]}>
                  <Feather name={stat.icon as any} size={14} color={stat.iconColor} />
                </View>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Period Filter Pills ── */}
        {filters && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.pillRow}
          >
            {filters.periods.map(p => (
              <TouchableOpacity
                key={p}
                style={[s.pill, activePeriod === p && s.pillActive]}
                onPress={() => setActivePeriod(p)}
                activeOpacity={0.8}
              >
                <Text style={[s.pillText, activePeriod === p && s.pillTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}

            {/* Program filter */}
            <TouchableOpacity
              style={[s.pill, s.pillDropdown, showProgramMenu && s.pillActive]}
              onPress={() => setShowProgramMenu(v => !v)}
              activeOpacity={0.8}
            >
              <Text style={[s.pillText, showProgramMenu && s.pillTextActive]}>
                {activeProgram}
              </Text>
              <Feather
                name={showProgramMenu ? 'chevron-up' : 'chevron-down'}
                size={12}
                color={showProgramMenu ? colors.textPrimary : colors.textSecondary}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Program dropdown panel */}
        {showProgramMenu && filters && (
          <View style={s.dropdownPanel}>
            {filters.programs.map(prog => (
              <TouchableOpacity
                key={prog}
                style={[s.dropdownItem, activeProgram === prog && s.dropdownItemActive]}
                onPress={() => { setActiveProgram(prog); setShowProgramMenu(false); }}
                activeOpacity={0.7}
              >
                <Text style={[s.dropdownItemText, activeProgram === prog && s.dropdownItemTextActive]}>
                  {prog}
                </Text>
                {activeProgram === prog && <Feather name="check" size={14} color={colors.warning} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Search ── */}
        <View style={s.searchWrap}>
          <Feather name="search" size={16} color={colors.textTertiary} style={{ marginRight: 10 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search traders..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Feather name="x" size={16} color={colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Loading ── */}
        {loading ? (
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={s.loadingText}>Loading rankings...</Text>
          </View>
        ) : (
          <>
            {/* ── Top 3 Podium ── */}
            {podiumOrder.length === 3 && (
              <View style={s.podiumSection}>
                <View style={s.rankingsTitleRow}>
                  <View style={[s.rankingsIconCircle, { backgroundColor: colors.warning }]}>
                    <Feather name="trending-up" size={15} color="#1A1511" />
                  </View>
                  <Text style={s.rankingsTitle}>Top Performers</Text>
                </View>
                <View style={s.podiumRow}>
                  {podiumOrder.map((trader, i) => renderPodiumCard(trader, i))}
                </View>
              </View>
            )}

            {/* ── Full Rankings ── */}
            <View style={s.rankingsSection}>
              <View style={s.rankingsTitleRow}>
                <View style={[s.rankingsIconCircle, { backgroundColor: colors.textPrimary }]}>
                  <Feather name="list" size={15} color="#fff" />
                </View>
                <Text style={s.rankingsTitle}>Full Rankings</Text>
                <Text style={s.rankingsCount}>{filtered.length} traders</Text>
              </View>

              {/* Column headers */}
              <View style={s.tableHeader}>
                <Text style={[s.tableHeaderText, { width: 36 }]}>#</Text>
                <Text style={[s.tableHeaderText, { flex: 1 }]}>TRADER</Text>
                <Text style={[s.tableHeaderText, { width: 76, textAlign: 'right' }]}>PROFIT</Text>
                <Text style={[s.tableHeaderText, { width: 56, textAlign: 'right' }]}>WIN%</Text>
                <Text style={[s.tableHeaderText, { width: 58, textAlign: 'right' }]}>STATUS</Text>
              </View>

              {/* Rows from backend */}
              {filtered.length > 0
                ? filtered.map((trader, idx) => renderTraderRow(trader, idx))
                : (
                  <View style={s.emptyWrap}>
                    <Feather name="search" size={32} color={colors.textTertiary} />
                    <Text style={s.emptyText}>No traders found</Text>
                    <Text style={s.emptySubText}>Try adjusting the filters or search query</Text>
                  </View>
                )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

// ─────────────── STYLES ───────────────
const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.background,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardBackground,
    justifyContent: 'center', alignItems: 'center',
    elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4,
  },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },

  // Stats row
  statsRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 16, marginBottom: 4 },
  statCard: {
    flex: 1, backgroundColor: colors.cardBackground, borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
    elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6,
  },
  statIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 14, fontWeight: '900', color: colors.textPrimary, marginBottom: 2, textAlign: 'center' },
  statLabel: { fontSize: 9, fontWeight: '700', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' },

  // Pills
  pillRow: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999,
    backgroundColor: colors.cardBackground, borderWidth: 1.5, borderColor: colors.border,
    elevation: 1, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
  },
  pillActive: { backgroundColor: colors.appAccentLight, borderColor: colors.appAccentLight },
  pillDropdown: {},
  pillText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  pillTextActive: { color: colors.textPrimary },

  // Dropdown
  dropdownPanel: {
    marginHorizontal: 16, marginTop: -4, marginBottom: 12,
    backgroundColor: colors.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
    elevation: 8, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  dropdownItemActive: { backgroundColor: 'rgba(250,204,21,0.08)' },
  dropdownItemText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  dropdownItemTextActive: { color: colors.textPrimary, fontWeight: '800' },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 20,
    backgroundColor: colors.cardBackground, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border,
    paddingHorizontal: 16, height: 48,
    elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6,
  },
  searchInput: { flex: 1, fontSize: 14, fontWeight: '500', color: colors.textPrimary },

  // Loading
  loadingWrap: { paddingVertical: 60, alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },

  // Podium
  podiumSection: { paddingHorizontal: 16, marginBottom: 24 },
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  podiumCard: {
    flex: 1, borderRadius: 24, padding: 12, alignItems: 'center',
    elevation: 6, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12,
  },
  podiumCardFirst: { paddingVertical: 18, borderWidth: 2, borderColor: colors.warning },
  medalCircle: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  medalText: { fontSize: 12, fontWeight: '900' },
  podiumAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  podiumAvatarFirst: { width: 54, height: 54, borderRadius: 27 },
  podiumAvatarText: { fontSize: 13, fontWeight: '900', color: colors.textPrimary },
  podiumName: { fontSize: 11, fontWeight: '800', color: colors.textPrimary, textAlign: 'center' },
  podiumAccount: { fontSize: 9, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, textAlign: 'center' },
  podiumProfit: { fontSize: 13, fontWeight: '900', color: colors.warning, marginBottom: 2, textAlign: 'center' },
  podiumPct: { fontSize: 10, fontWeight: '700', color: colors.textSecondary, marginBottom: 6, textAlign: 'center' },
  podiumStatRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingTop: 4 },
  podiumStatLabel: { fontSize: 9, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase' },
  podiumStatValue: { fontSize: 10, fontWeight: '800', color: colors.textPrimary },

  // Rankings
  rankingsSection: { paddingHorizontal: 16 },
  rankingsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  rankingsIconCircle: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  rankingsTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary, flex: 1 },
  rankingsCount: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },

  tableHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 9, marginBottom: 6,
    backgroundColor: colors.divider, borderRadius: 12,
  },
  tableHeaderText: { fontSize: 9, fontWeight: '800', color: colors.textTertiary, letterSpacing: 0.5, textTransform: 'uppercase' },

  rankRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.cardBackground, borderRadius: 16, marginBottom: 10,
    paddingVertical: 12, paddingHorizontal: 12,
    borderWidth: 1, borderColor: colors.border,
    elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6,
  },
  rankBadge: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: colors.divider, justifyContent: 'center', alignItems: 'center', marginRight: 8,
  },
  rankBadgeText: { fontSize: 11, fontWeight: '900', color: colors.textPrimary },
  rankTraderInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  rankAvatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: colors.appAccentLight, justifyContent: 'center', alignItems: 'center',
  },
  rankAvatarText: { fontSize: 11, fontWeight: '800', color: colors.textPrimary },
  rankName: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  rankMeta: { fontSize: 10, color: colors.textTertiary, fontWeight: '500' },
  rankProfit: { fontSize: 12, fontWeight: '800', color: '#10B981' },
  rankPct: { fontSize: 10, fontWeight: '600', color: '#10B981' },
  rankWinRate: { width: 56, textAlign: 'right', fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  statusBadge: {
    width: 58, paddingHorizontal: 4, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1, alignItems: 'center', marginLeft: 6,
  },
  statusText: { fontSize: 8, fontWeight: '800', letterSpacing: 0.3 },

  // Empty
  emptyWrap: { paddingVertical: 40, alignItems: 'center', gap: 10 },
  emptyText: { fontSize: 15, fontWeight: '700', color: colors.textSecondary },
  emptySubText: { fontSize: 12, fontWeight: '500', color: colors.textTertiary, textAlign: 'center' },
});




