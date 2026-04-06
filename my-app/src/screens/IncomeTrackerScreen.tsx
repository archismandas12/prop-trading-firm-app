import { useTheme } from '../theme/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { UserService, UserProfile } from '../services/UserService';
import { ToolsService, IncomeOverview } from '../services/ToolsService';
import { Feather, Ionicons } from '@expo/vector-icons';

export const IncomeTrackerScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [income, setIncome] = React.useState<IncomeOverview | null>(null);
  React.useEffect(() => { UserService.getCurrentUser().then(setUser); ToolsService.getIncomeOverview().then(setIncome); }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="Income Tracker" showBack={true} />
      <AppBackground />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>

        {/* Large Green Chart Area */}
        <View style={styles.chartArea}>
          <View style={styles.chartHeader}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Feather name="plus-circle" size={16} color={colors.iconDark} />
              </View>
              <Text style={[typography.h3, styles.chartTitle]}>Income Tracker</Text>
            </View>
            <View style={styles.trendBadge}>
              <Feather name="trending-up" size={14} color="#FFFFFF" />
              <Text style={styles.trendText}>{income?.trendPercent || '0%'}</Text>
            </View>
          </View>

          <Text style={styles.balanceText}>{income?.balance || '$0'}</Text>

          {/* Custom Bar Chart Simulation */}
          <View style={styles.barsContainer}>
            {/* Y Axis */}
            <View style={styles.yAxis}>
              <Text style={styles.axisText}>50</Text>
              <Text style={styles.axisText}>40</Text>
              <Text style={styles.axisText}>30</Text>
              <Text style={styles.axisText}>20</Text>
              <Text style={styles.axisText}>10</Text>
            </View>

            {/* Bars */}
            <View style={styles.barGraph}>
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: '30%' }]} />
                <Text style={styles.monthText}>Jan</Text>
              </View>
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: '60%' }]} />
                <Text style={styles.monthText}>Feb</Text>
              </View>
              <View style={styles.barColumn}>
                <View style={[styles.bar, styles.activeBar, { height: '80%' }]}>
                  {/* Floating popover for the active bar */}
                  <View style={styles.tooltip}>
                    <Text style={styles.tooltipEmoji}>💸</Text>
                  </View>
                  <View style={styles.tooltipLabel}>
                    <Text style={styles.tooltipText}>{income?.barData?.[2]?.tooltipValue || '$0'}</Text>
                  </View>
                </View>
                <Text style={[styles.monthText, { color: colors.textInverse, fontWeight: 'bold' }]}>Mart</Text>
                <View style={styles.activeDot} />
              </View>
              <View style={styles.barColumn}>
                <View style={[styles.bar, { height: '50%' }]} />
                <Text style={styles.monthText}>Apr</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={[typography.h2, { color: colors.textPrimary }]}>{income?.savingsPercent || '0%'}</Text>
              <View style={styles.statIconContainer}>
                <Ionicons name="layers" size={20} color={colors.primary} />
              </View>
            </View>
            <Text style={styles.statLabel}>Last Month</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statHeader}>
              <Text style={[typography.h2, { color: colors.textPrimary }]}>{income?.investmentsPercent || '0%'}</Text>
              <View style={[styles.statIconContainer, { backgroundColor: colors.cardBackground }]}>
                <Ionicons name="layers" size={20} color="#FFCC00" />
              </View>
            </View>
            <Text style={styles.statLabel}>Last Quarter</Text>
          </View>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          <View style={styles.cardImagePlaceholder}>
            <Text>💳</Text>
          </View>
          <View style={styles.bottomCardContent}>
            <Text style={styles.bottomCardTitle}>Get a new card type</Text>
            <Text style={styles.bottomCardLink}>View More</Text>
          </View>
          <TouchableOpacity style={styles.arrowButton}>
            <Feather name="arrow-right" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cardBackground, // Light greyish green
  },
  container: {
    flex: 1,
  },
  chartArea: {
    backgroundColor: colors.accent, // Assuming it's a solid/gradient block of green
    borderRadius: 32,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 24,
    minHeight: 380,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTitle: {
    color: colors.textInverse,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trendText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  balanceText: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -1,
    marginTop: 12,
    marginBottom: 24,
  },
  barsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingBottom: 24, // to align with bars (exclude month labels)
  },
  axisText: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    fontWeight: '500',
  },
  barGraph: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    paddingBottom: 4,
  },
  barColumn: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 48,
    position: 'relative',
  },
  bar: {
    width: 40,
    backgroundColor: 'rgba(0,0,0,0.05)', // The inactive bars have a very light/transparent overlay in the design
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    marginBottom: 8,
    position: 'relative',
  },
  activeBar: {
    backgroundColor: colors.cardBackground, // The highlighted black bar
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  tooltip: {
    position: 'absolute',
    top: -40,
    left: -10, // Adjust to pull it out over the edge
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  tooltipEmoji: {
    fontSize: 24,
  },
  tooltipLabel: {
    position: 'absolute',
    bottom: 24, // Inside the black bar near the bottom
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tooltipText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  monthText: {
    color: 'rgba(0,0,0,0.5)',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textInverse,
    position: 'absolute',
    bottom: -12,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  bottomCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImagePlaceholder: {
    width: 60,
    height: 48,
    backgroundColor: colors.border,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bottomCardContent: {
    flex: 1,
  },
  bottomCardTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  bottomCardLink: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  }
});




