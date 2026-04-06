import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, ActivityIndicator, Dimensions, RefreshControl,
  Animated, Easing
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { TickerService, TickerCategory, TickerSymbol } from '../services/TickerService';
import { BackButton } from '../components/ui/BackButton';
import { AppHeader } from '../components/ui/AppHeader';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = width - 32; // Full width minus horizontal padding

export const TickerScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<TickerCategory[]>([]);
  const [allSymbols, setAllSymbols] = useState<TickerSymbol[]>([]);
  const [marketStatus, setMarketStatus] = useState({ status: '', lastUpdated: '', symbolCount: 0 });
  const [isPaused, setIsPaused] = useState(false);

  // Marquee animation
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const startMarquee = useCallback((symbolCount: number) => {
    // Rough estimation of total width:
    const itemWidth = 120; // Avg px width of each ticker item + gap
    const totalWidth = itemWidth * symbolCount;
    const duration = totalWidth * 30; // 30ms per pixel, roughly

    scrollX.setValue(0);
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -totalWidth,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [scrollX]);

  const loadData = async () => {
    try {
      const [cats, status] = await Promise.all([
        TickerService.getTickerCategories(),
        TickerService.getMarketStatus()
      ]);
      setCategories(cats);
      setMarketStatus(status);

      // Flatten symbols for the marquee
      const flatSymbols = cats.reduce((acc, cat) => [...acc, ...cat.symbols], [] as TickerSymbol[]);
      setAllSymbols(flatSymbols);
      startMarquee(flatSymbols.length);
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

  useEffect(() => {
    if (isPaused) {
      scrollX.stopAnimation();
    } else {
      if (allSymbols.length > 0) startMarquee(allSymbols.length);
    }
  }, [isPaused, allSymbols.length, startMarquee]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, []);

  const renderHeader = () => (
    <View style={s.pad}>

      {/* Control Buttons */}
      <View style={s.controlsRow}>
        <TouchableOpacity
          style={[s.controlBtnOutline, isPaused && s.controlBtnActive]}
          onPress={() => setIsPaused(!isPaused)}
          activeOpacity={0.7}
        >
          <Feather name={isPaused ? "play" : "pause"} size={14} color={isPaused ? colors.warning : colors.success} />
          <Text style={[s.controlBtnText, isPaused && { color: colors.warning }]}>{isPaused ? "Resume" : "Pause"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.controlBtnPrimary}
          onPress={onRefresh}
          activeOpacity={0.8}
        >
          <Feather name="refresh-cw" size={14} color={colors.textInverse} />
          <Text style={s.controlBtnPrimaryText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Marquee Ticker */}
      <View style={s.marqueeContainer}>
        <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 24,
            paddingHorizontal: 16,
            transform: [{ translateX: scrollX }]
          }}
        >
          {/* We render it twice physically to create a seamless infinite loop look */}
          {[...allSymbols, ...allSymbols].map((item, index) => (
            <TouchableOpacity key={`mq-${index}-${item.id}`} style={s.marqueeItem} activeOpacity={0.7} onPress={() => setIsPaused(!isPaused)}>
              <Text style={s.marqueeSymbol}>{item.symbol}</Text>
              <Text style={[s.marqueeValue, { color: item.trend === 'up' ? colors.success : colors.danger }]}>
                {item.tickerValue}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </View>
    </View>
  );

  const renderCategory = (category: TickerCategory) => (
    <View key={category.id} style={s.categorySection}>
      {/* Category Header */}
      <View style={s.categoryHeader}>
        <View style={s.categoryIconBox}>
          <Feather name={category.icon as any} size={16} color={colors.warning} />
        </View>
        <Text style={s.categoryTitle}>{category.title}</Text>
        <Text style={s.categoryCount}>({category.symbols.length})</Text>
      </View>

      {/* Symbol Cards Grid */}
      <View style={s.gridContainer}>
        {category.symbols.map((item) => (
          <TouchableOpacity key={item.id} style={s.tickerCard} activeOpacity={0.7}>
            <View style={s.cardHeader}>
              <Text style={s.cardSymbol}>{item.symbol}</Text>
              <Text style={s.cardDesc} numberOfLines={1}>{item.description}</Text>
            </View>

            <View style={s.cardRow}>
              <Text style={s.cardLabel}>Bid</Text>
              <Text style={s.cardValue}>{item.bid}</Text>
            </View>
            <View style={s.cardRow}>
              <Text style={s.cardLabel}>Ask</Text>
              <Text style={s.cardValue}>{item.ask}</Text>
            </View>
            <View style={[s.cardRow, { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderColor: colors.border }]}>
              <Text style={s.cardLabel}>Spread</Text>
              <Text style={s.cardSpread}>{item.spread}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={s.container}>
        <AppHeader title="Ticker" showBack={true} />
        <AppBackground />
        <View style={s.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[s.updatedText, { marginTop: 12 }]}>Loading ticker data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <AppHeader title="Ticker" showBack={true} />
      <AppBackground />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {renderHeader()}

        <View style={s.pad}>
          {categories.map(cat => renderCategory(cat))}
        </View>
      </ScrollView>
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

  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 12, marginBottom: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },

  liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  liveText: { fontSize: 11, fontWeight: '700', color: colors.success },
  updatedText: { fontSize: 11, fontWeight: '500', color: colors.textSecondary },

  controlsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginBottom: 20 },
  controlBtnOutline: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, borderWidth: 1, borderColor: colors.success, backgroundColor: 'rgba(16, 185, 129, 0.05)' },
  controlBtnActive: { borderColor: colors.warning, backgroundColor: 'rgba(250, 204, 21, 0.05)' },
  controlBtnText: { fontSize: 13, fontWeight: '700', color: colors.success },

  controlBtnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999, backgroundColor: colors.warning, elevation: 2, shadowColor: colors.warning, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  controlBtnPrimaryText: { fontSize: 13, fontWeight: '800', color: colors.textInverse },

  marqueeContainer: { backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 14, marginBottom: 32, overflow: 'hidden' },
  marqueeItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  marqueeSymbol: { fontSize: 14, fontWeight: '700', color: '#fff' },
  marqueeValue: { fontSize: 13, fontWeight: '800' },

  categorySection: { marginBottom: 32 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  categoryIconBox: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  categoryTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  categoryCount: { fontSize: 14, fontWeight: '600', color: colors.textTertiary },

  gridContainer: { flexDirection: 'column', gap: 16 },
  tickerCard: { width: '100%', backgroundColor: colors.cardBackground, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, elevation: 1, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4 },
  cardHeader: { marginBottom: 16 },
  cardSymbol: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 2 },
  cardDesc: { fontSize: 10, fontWeight: '500', color: colors.textSecondary },

  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  cardLabel: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  cardValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, fontVariant: ['tabular-nums'] },
  cardSpread: { fontSize: 12, fontWeight: '800', color: '#F59E0B' }, // Warning/Orange color for spread like the reference
});
