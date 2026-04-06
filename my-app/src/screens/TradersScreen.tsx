import { useTheme } from '../theme/ThemeContext';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { Input } from '../components/ui/Input';
import { LeaderboardStats, TradersService, TraderEntry, LeaderboardFilters } from '../services/TradersService';
import { AppHeader } from '../components/ui/AppHeader';
import { BackButton } from '../components/ui/BackButton';

export const TradersScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [traders, setTraders] = React.useState<TraderEntry[]>([]);
  const [filters, setFilters] = React.useState<LeaderboardFilters | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [communityStats, setCommunityStats] = React.useState<LeaderboardStats | null>(null);
  React.useEffect(() => { Promise.all([TradersService.getLeaderboard(), TradersService.getFilters(), TradersService.getLeaderboardStats()]).then(([t, f, cs]) => { setTraders(t); setFilters(f); setCommunityStats(cs as LeaderboardStats); setLoading(false); }); }, []);

  return (
    <View style={s.container}>
      <AppHeader title="YoPips Traders" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
        <View style={s.pad}>


          {/* Toolbar & Search */}
          <View style={s.toolbarLayout}>
            <View style={s.actionRow}>
              <TouchableOpacity style={s.actionButton} activeOpacity={0.7}>
                <Feather name="trending-up" size={14} color={colors.textPrimary} style={{ flexShrink: 0 }} />
                <Text style={s.actionButtonText} numberOfLines={1} adjustsFontSizeToFit>Top Performers</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.actionButton} activeOpacity={0.7}>
                <Feather name="refresh-cw" size={14} color={colors.textPrimary} style={{ flexShrink: 0 }} />
                <Text style={s.actionButtonText} numberOfLines={1} adjustsFontSizeToFit>Refresh</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Input
                placeholder="Search traders..."
              />
            </View>
          </View>

          {/* Statistics Grid (Simulating responsiveness linearly if on narrow screen) */}
          <View style={s.statsGrid}>
            {/* Stat: Total Payouts */}
            <View style={s.statCard}>
              <View style={s.statContent}>
                <Text style={s.statLabel}>TOTAL PAYOUTS</Text>
                <Text style={s.statValue}>{communityStats?.totalPayouts || '$0'}</Text>
              </View>
              <View style={[s.statIconWrap, { backgroundColor: colors.cardBackground }]}>
                <Feather name="arrow-up-right" size={16} color="#4ADE80" />
              </View>
            </View>

            {/* Stat: Active Traders */}
            <View style={s.statCard}>
              <View style={s.statContent}>
                <Text style={s.statLabel}>ACTIVE TRADERS</Text>
                <Text style={s.statValue}>{communityStats?.activeTraders || '0'}</Text>
              </View>
              <View style={[s.statIconWrap, { backgroundColor: colors.cardBackground }]}>
                <Feather name="users" size={16} color="#60A5FA" />
              </View>
            </View>

            {/* Stat: Win Rate Avg */}
            <View style={s.statCard}>
              <View style={s.statContent}>
                <Text style={s.statLabel}>WIN RATE AVG</Text>
                <Text style={s.statValue}>{communityStats?.winRateAvg || '0%'}</Text>
              </View>
              <View style={[s.statIconWrap, { backgroundColor: colors.cardBackground }]}>
                <Feather name="bar-chart-2" size={16} color="#FBBF24" />
              </View>
            </View>
          </View>

          {/* Empty State Panel */}
          <View style={s.emptyStatePanel}>
            <View style={s.emptyIconCircle}>
              <Feather name="users" size={32} color={colors.textTertiary} />
            </View>
            <Text style={s.emptyStateTitle}>No Data</Text>
            <Text style={s.emptyStateText}>
              Traders can enable "Visibility" in their Dashboard settings to appear here.
            </Text>
          </View>

          {/* Footer inside scroll view */}
          <View style={s.footer}>
            <View style={s.footerLinksRow}>
              <Text style={s.footerLink}>Support</Text>
              <Text style={s.footerDot}>·</Text>
              <Text style={s.footerLink}>Rules</Text>
              <Text style={s.footerDot}>·</Text>
              <Text style={s.footerLink}>Funding</Text>
            </View>
            <Text style={s.footerCopyright}>2026 © Copyright - YoPips.com</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  pad: {
    paddingHorizontal: 16,
  },
  headerNav: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  toolbarLayout: {
    marginBottom: 24,
    gap: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    elevation: 2,
    shadowColor: colors.appSurfaceShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 52,
    elevation: 2,
    shadowColor: colors.appSurfaceShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'column',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    elevation: 6,
    shadowColor: colors.appSurfaceShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  statContent: {
    gap: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },
  statValue: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  statIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStatePanel: {
    backgroundColor: colors.cardBackground,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 40,
    alignItems: 'center',
    marginTop: 8,
    elevation: 4,
    shadowColor: colors.appSurfaceShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.warning,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 20,
  },
  footerLinksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  footerLink: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footerDot: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  footerCopyright: {
    fontSize: 11,
    color: colors.textTertiary,
    fontWeight: '500',
  },
});




