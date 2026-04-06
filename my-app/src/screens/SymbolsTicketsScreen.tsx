import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, TextInput, RefreshControl
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { SymbolsService, SymbolData } from '../services/SymbolsService';
import { BackButton } from '../components/ui/BackButton';
import { AppHeader } from '../components/ui/AppHeader';

export const SymbolsTicketsScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [marketStatus, setMarketStatus] = useState({ status: '', lastUpdated: '' });
  const [activeTab, setActiveTab] = useState('Symbols');

  const loadData = async () => {
    try {
      const [data, status] = await Promise.all([
        SymbolsService.getSymbols(),
        SymbolsService.getMarketStatus()
      ]);
      setSymbols(data);
      setMarketStatus(status);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const filteredSymbols = symbols.filter(sym =>
    sym.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sym.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderHeader = () => (
    <View style={s.pad}>

      {/* Tabs & Search Card */}
      <View style={s.controlsCard}>
        {/* Tabs */}
        <View style={s.tabsRow}>
          <TouchableOpacity
            style={[s.tabButton, activeTab === 'Symbols' && s.tabButtonActive]}
            onPress={() => setActiveTab('Symbols')}
            activeOpacity={0.7}
          >
            <Feather name="tag" size={14} color={activeTab === 'Symbols' ? colors.primary : colors.textSecondary} />
            <Text style={[s.tabText, activeTab === 'Symbols' && s.tabTextActive]}>Symbols ({symbols.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tabButton, activeTab === 'Open Positions' && s.tabButtonActive]}
            onPress={() => setActiveTab('Open Positions')}
            activeOpacity={0.7}
          >
            <Feather name="briefcase" size={14} color={activeTab === 'Open Positions' ? colors.primary : colors.textSecondary} />
            <Text style={[s.tabText, activeTab === 'Open Positions' && s.tabTextActive]}>Open Positions (0)</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={s.searchContainer}>
          <Feather name="search" size={18} color={colors.textTertiary} style={s.searchIcon} />
          <TextInput
            style={s.searchInput}
            placeholder="Search symbols..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Table Header Row (Mobile adapted) */}
      <View style={s.tableHeader}>
        <Text style={[s.tableHeadText, { flex: 1.2 }]}>SYMBOL</Text>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}><Text style={s.tableHeadText}>BID</Text></View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}><Text style={s.tableHeadText}>ASK</Text></View>
      </View>
    </View>
  );

  const renderSymbolRow = ({ item }: { item: SymbolData }) => (
    <TouchableOpacity style={s.symbolRow} activeOpacity={0.7}>
      {/* Symbol Column */}
      <View style={s.symbolCol}>
        <View style={s.baseCoin}>
          <Text style={s.baseCoinText}>{item.basePrefix}</Text>
        </View>
        <View>
          <Text style={s.symbolName}>{item.symbol}</Text>
          <Text style={s.symbolDesc} numberOfLines={1}>{item.description}</Text>
        </View>
      </View>

      {/* Bid Column */}
      <View style={s.priceCol}>
        <Text style={s.priceText}>{item.bid}</Text>
      </View>

      {/* Ask Column */}
      <View style={s.priceColAsk}>
        <Text style={s.priceText}>{item.ask}</Text>
        <Text style={s.spreadText}>Sp: {item.spread}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={s.container}>
        <AppHeader title="Symbols & Tickets" showBack={true} />
        <AppBackground />
        <View style={s.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.updatedText, { marginTop: 12 }]}>Loading market data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <AppHeader title="Symbols & Tickets" showBack={true} />
      <AppBackground />

      <FlatList
        data={activeTab === 'Symbols' ? filteredSymbols : []}
        keyExtractor={item => item.id}
        renderItem={renderSymbolRow}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Feather name="search" size={40} color={colors.textTertiary} />
            <Text style={[s.updatedText, { marginTop: 12 }]}>
              {activeTab === 'Symbols' ? 'No symbols found matching your search.' : 'You have no open positions.'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

// ────────────────────── STYLES ──────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  pad: { paddingHorizontal: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 12, marginBottom: 24 },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: colors.warning, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },

  liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  liveText: { fontSize: 12, fontWeight: '700', color: colors.success },
  updatedText: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },

  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },

  controlsCard: { backgroundColor: colors.cardBackground, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 20 },
  tabsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  tabButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: 'transparent' },
  tabButtonActive: { backgroundColor: colors.cardBackground, borderColor: colors.border, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  tabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.textPrimary, fontWeight: '800' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 16, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: colors.border },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary, height: '100%' },

  tableHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderColor: colors.border, marginBottom: 8 },
  tableHeadText: { fontSize: 10, fontWeight: '800', color: colors.textTertiary, letterSpacing: 1 },

  symbolRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: colors.cardBackground, marginHorizontal: 16, marginBottom: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, elevation: 1, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4 },
  symbolCol: { flex: 1.5, flexDirection: 'row', alignItems: 'center', gap: 12 },
  baseCoin: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  baseCoinText: { fontSize: 12, fontWeight: '800', color: colors.textPrimary },
  symbolName: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 2 },
  symbolDesc: { fontSize: 11, fontWeight: '500', color: colors.textSecondary, flexShrink: 1, paddingRight: 8 },

  priceCol: { flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 4 },
  priceColAsk: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
  priceText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  spreadText: { fontSize: 10, fontWeight: '600', color: colors.textTertiary, marginTop: 4 },

  emptyState: { padding: 40, alignItems: 'center', justifyContent: 'center' }
});
