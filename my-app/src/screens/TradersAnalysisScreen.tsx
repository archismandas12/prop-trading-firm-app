import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Dimensions, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { BackButton } from '../components/ui/BackButton';
import { AppHeader } from '../components/ui/AppHeader';
import {
  TradersAnalysisService, TradeKPI, TradeDistribution,
  KeyValueMetric, RecentTrade
} from '../services/TradersAnalysisService';

const { width } = Dimensions.get('window');

// Filter mock
const TIME_FILTERS = ['1d', '7d', '30d', '90d', '1y'];
const MOCK_ACCOUNTS = ['Account 900670', 'Account 900671'];

export const TradersAnalysisScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('1d');
  const [selectedAccount, setSelectedAccount] = useState(MOCK_ACCOUNTS[0]);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Data state
  const [kpis, setKpis] = useState<TradeKPI[]>([]);
  const [distribution, setDistribution] = useState<TradeDistribution | null>(null);
  const [performance, setPerformance] = useState<KeyValueMetric[]>([]);
  const [dayAnalysis, setDayAnalysis] = useState<KeyValueMetric[]>([]);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);

  useEffect(() => {
    loadData();
  }, [activeFilter, selectedAccount]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [k, d, p, da, r] = await Promise.all([
        TradersAnalysisService.getKPIs(activeFilter),
        TradersAnalysisService.getTradeDistribution(activeFilter),
        TradersAnalysisService.getPerformanceMetrics(activeFilter),
        TradersAnalysisService.getDayAnalysis(activeFilter),
        TradersAnalysisService.getRecentTrades(activeFilter)
      ]);
      setKpis(k);
      setDistribution(d);
      setPerformance(p);
      setDayAnalysis(da);
      setRecentTrades(r);
    } catch (e) {
      console.warn("Error loading trader analysis:", e);
    } finally {
      setLoading(false);
    }
  };

  const getMetricColor = (type?: string) => {
    switch (type) {
      case 'success': return colors.success;
      case 'danger': return colors.danger;
      case 'warning': return colors.warning;
      case 'primary': return colors.primary;
      default: return colors.textPrimary;
    }
  };

  const renderHeader = () => (
    <View style={s.headerContainer}>

      {/* Control Bar: Time filters & Account Select */}
      <View style={s.controlRow}>
        <View style={s.filterGroup}>
          {TIME_FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterBtn, activeFilter === f && s.filterBtnActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[s.filterBtnText, activeFilter === f && s.filterBtnTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={s.accountBtn}
          onPress={() => setShowAccountDropdown(!showAccountDropdown)}
        >
          <Text style={s.accountBtnText}>{selectedAccount}</Text>
          <Feather name={showAccountDropdown ? "chevron-up" : "chevron-down"} size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Account Dropdown Inline */}
      {showAccountDropdown && (
        <View style={s.accountDropdownList}>
          {MOCK_ACCOUNTS.map(acc => (
            <TouchableOpacity
              key={acc}
              style={[s.accDropItem, selectedAccount === acc && s.accDropItemActive]}
              onPress={() => {
                setSelectedAccount(acc);
                setShowAccountDropdown(false);
              }}
            >
              <Text style={[s.accDropText, selectedAccount === acc && { fontWeight: '700' }]}>{acc}</Text>
              {selectedAccount === acc && <Feather name="check" size={16} color={colors.textPrimary} />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderKPIs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.kpiScroll}>
      {kpis.map((kpi, i) => (
        <View key={kpi.id} style={s.kpiCard}>
          <Text style={s.kpiLabel}>{kpi.label}</Text>
          <Text style={[s.kpiValue, { color: getMetricColor(kpi.colorType) }]}>
            {kpi.value}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderDistribution = () => {
    if (!distribution) return null;
    return (
      <View style={s.gridCard}>
        <Text style={s.cardTitle}>Trade Distribution</Text>

        <View style={s.distRow}>
          <Text style={s.distLabel}>Buy Trades</Text>
          <Text style={[s.distValue, { color: colors.success }]}>{distribution.buyCount} ({distribution.buyPercentage}%)</Text>
        </View>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${distribution.buyPercentage}%`, backgroundColor: colors.success }]} />
        </View>

        <View style={[s.distRow, { marginTop: 16 }]}>
          <Text style={s.distLabel}>Sell Trades</Text>
          <Text style={[s.distValue, { color: colors.danger }]}>{distribution.sellCount} ({distribution.sellPercentage}%)</Text>
        </View>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${distribution.sellPercentage}%`, backgroundColor: colors.danger }]} />
        </View>
      </View>
    );
  };

  const renderMetricList = (title: string, data: KeyValueMetric[]) => (
    <View style={s.gridCard}>
      <Text style={s.cardTitle}>{title}</Text>
      {data.map((item, idx) => (
        <View key={idx} style={s.metricListRow}>
          <Text style={s.metricListLabel}>{item.label}</Text>
          <Text style={[s.metricListValue, { color: getMetricColor(item.colorType) }]}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderRecentTrades = () => (
    <View style={[s.gridCard, { marginTop: 16 }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={s.cardTitle}>Recent Trades</Text>
        <TouchableOpacity style={s.filterSmallBtn}>
          <Feather name="filter" size={14} color={colors.textSecondary} />
          <Text style={s.filterSmallBtnText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ minWidth: width }}>
          <View style={s.tableHeaderRow}>
            {['TICKET', 'SYMBOL', 'TYPE', 'VOLUME', 'OPEN PRICE', 'CLOSE PRICE', 'PROFIT', 'DURATION'].map(h => (
              <Text key={h} style={s.tableHeaderCell}>{h}</Text>
            ))}
          </View>

          {recentTrades.map((t, i) => (
            <View key={i} style={s.tableDataRow}>
              <Text style={[s.tableDataCell, { fontWeight: '700' }]}>{t.ticket}</Text>
              <Text style={s.tableDataCell}>{t.symbol}</Text>
              <View style={[s.tableDataCell, { alignItems: 'flex-start' }]}>
                <View style={s.typePill}>
                  <Text style={s.typePillText}>{t.type}</Text>
                </View>
              </View>
              <Text style={s.tableDataCell}>{t.volume}</Text>
              <Text style={s.tableDataCell}>{t.openPrice}</Text>
              <Text style={s.tableDataCell}>{t.closePrice}</Text>
              <Text style={[s.tableDataCell, { color: t.profitIsPositive ? colors.success : colors.danger, fontWeight: '800' }]}>
                {t.profit}
              </Text>
              <Text style={s.tableDataCell}>{t.duration}</Text>
            </View>
          ))}
          {recentTrades.length === 0 && (
            <Text style={{ textAlign: 'center', padding: 20, color: colors.textSecondary }}>No recent trades found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={s.container}>
      <AppHeader title="Trader's Analysis" showBack={true} />
      <AppBackground />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {renderHeader()}

        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {renderKPIs()}

            <View style={s.pad}>
              {/* Stack the 3 main grid cards for Mobile instead of 3 columns */}
              {renderDistribution()}
              {renderMetricList("Performance Metrics", performance)}
              {renderMetricList("Day Analysis", dayAnalysis)}

              {renderRecentTrades()}
            </View>
          </>
        )}
      </ScrollView>

    </View>
  );
};

// ────────────────────── STYLES ──────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 120, paddingTop: 24 },
  pad: { paddingHorizontal: 16 },

  topNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  topNavText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', flexShrink: 1 },

  headerContainer: { paddingHorizontal: 16, marginBottom: 20, zIndex: 10 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 24 },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  pageSubtitle: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },

  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8, backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border },
  exportBtnText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  controlRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 5 },
  filterGroup: { flexDirection: 'row', backgroundColor: colors.cardBackground, borderRadius: 8, padding: 4, borderWidth: 1, borderColor: colors.border },
  filterBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  filterBtnActive: { backgroundColor: colors.warning },
  filterBtnText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  filterBtnTextActive: { color: colors.primary, fontWeight: '800' },

  accountBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 12 },
  accountBtnText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  accountDropdownList: { position: 'absolute', top: 120, right: 16, width: 200, backgroundColor: colors.cardBackground, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingVertical: 8, zIndex: 100, elevation: 8, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
  accDropItem: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  accDropItemActive: { backgroundColor: colors.border },
  accDropText: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },

  kpiScroll: { paddingHorizontal: 16, gap: 12, marginBottom: 20 },
  kpiCard: { minWidth: 140, backgroundColor: colors.cardBackground, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border, elevation: 1, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  kpiLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 },
  kpiValue: { fontSize: 22, fontWeight: '900', fontVariant: ['tabular-nums'] },

  gridCard: { backgroundColor: colors.cardBackground, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 16, elevation: 1, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },

  distRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  distLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  distValue: { fontSize: 13, fontWeight: '800' },
  progressTrack: { height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },

  metricListRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.border },
  metricListLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  metricListValue: { fontSize: 14, fontWeight: '800', textAlign: 'right', fontVariant: ['tabular-nums'] },

  filterSmallBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.03)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  filterSmallBtnText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  // Table Styling for mobile
  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 12, marginBottom: 8 },
  tableHeaderCell: { flex: 1, minWidth: 90, fontSize: 10, fontWeight: '800', color: colors.textTertiary, textTransform: 'uppercase' },
  tableDataRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.border },
  tableDataCell: { flex: 1, minWidth: 90, fontSize: 12, fontWeight: '500', color: colors.textPrimary, fontVariant: ['tabular-nums'] },

  typePill: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  typePillText: { fontSize: 10, fontWeight: '800', color: colors.danger }
});
