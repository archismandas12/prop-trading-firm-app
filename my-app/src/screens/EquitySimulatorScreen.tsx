import { colors } from '../theme/colors';
const isDark = true;
import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { ToolsService, SimulationResults } from '../services/ToolsService';
import { AppHeader } from '../components/ui/AppHeader';

// Standardized common input component for this form
const InputField = ({ label, value, prefix = "", onChangeText, keyboardType = "numeric" }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={s.inputContainer}>
      <Text style={s.inputLabel}>{label}</Text>
      <View style={[s.inputWrapper, isFocused && s.inputWrapperFocused]}>
        {prefix ? <Text style={s.inputPrefix}>{prefix}</Text> : null}
        <TextInput
          style={[s.inputBox, prefix ? { paddingLeft: 4 } : {}, Platform.OS === 'web' ? { outline: 'none', outlineStyle: 'none' } as any : {}]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={colors.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

export const EquitySimulatorScreen = () => {
  const { colors, isDark } = useTheme();

  const navigation = useNavigation<any>();

  // State mapping to the form
  const [initialBalance, setInitialBalance] = useState('100000');
  const [winRate, setWinRate] = useState('55');
  const [avgWin, setAvgWin] = useState('150');
  const [avgLoss, setAvgLoss] = useState('120');
  const [numTrades, setNumTrades] = useState('100');
  const [simulations, setSimulations] = useState('1000');
  const [riskPerTrade, setRiskPerTrade] = useState('1');

  const [results, setResults] = React.useState<SimulationResults | null>(null);
  React.useEffect(() => { ToolsService.runSimulation({}).then(setResults); }, []);

  return (
    <View style={s.container}>
      <AppHeader title="Equity Simulator" showBack={true} />
      <AppBackground />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
          <View style={s.pad}>


            {/* Layout: We stack the form first on mobile, then the results beneath it */}
            <View style={s.card}>

              <InputField label="Initial Balance" value={initialBalance} prefix="$" onChangeText={setInitialBalance} />
              <InputField label="Win Rate (%)" value={winRate} prefix="%" onChangeText={setWinRate} />

              <View style={s.rowSplit}>
                <View style={{ flex: 1 }}>
                  <InputField label="Avg Win ($)" value={avgWin} onChangeText={setAvgWin} />
                </View>
                <View style={{ width: 16 }} />
                <View style={{ flex: 1 }}>
                  <InputField label="Avg Loss ($)" value={avgLoss} onChangeText={setAvgLoss} />
                </View>
              </View>

              <InputField label="Number of Trades" value={numTrades} onChangeText={setNumTrades} />
              <InputField label="Simulations" value={simulations} onChangeText={setSimulations} />
              <InputField label="Risk per Trade (%)" value={riskPerTrade} onChangeText={setRiskPerTrade} />

              <View style={s.actionRow}>
                <TouchableOpacity style={s.runBtn} activeOpacity={0.8}>
                  <Feather name="play" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={s.runBtnText}>Run</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.resetBtn} activeOpacity={0.7}>
                  <Feather name="refresh-ccw" size={18} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Stats Grid (2x2) */}
            <View style={s.quickStatsGrid}>
              <View style={s.quickStatBox}>
                <Text style={s.qStatLabel}>Success Rate</Text>
                <Text style={[s.qStatValue, { color: colors.danger }]}>{results?.successRate || '0.0%'}</Text>
              </View>
              <View style={s.quickStatBox}>
                <Text style={s.qStatLabel}>Average Balance</Text>
                <Text style={s.qStatValue}>{results?.avgBalance || '$0'}</Text>
              </View>
              <View style={s.quickStatBox}>
                <Text style={s.qStatLabel}>Best Case</Text>
                <Text style={[s.qStatValue, { color: colors.success }]}>{results?.bestCase || '$0'}</Text>
              </View>
              <View style={s.quickStatBox}>
                <Text style={s.qStatLabel}>Worst Case</Text>
                <Text style={[s.qStatValue, { color: colors.danger }]}>{results?.worstCase || '$0'}</Text>
              </View>
            </View>

            {/* Equity Distribution Graph Placeholder */}
            <View style={[s.card, { paddingHorizontal: 0 }]}>
              <View style={[s.cardHeader, { paddingHorizontal: 20 }]}>
                <Text style={s.cardTitle}>Equity Distribution</Text>
                <View style={s.legendRow}>
                  <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: colors.danger }]} /><Text style={s.legendText}>Worst 10%</Text></View>
                  <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: colors.warning }]} /><Text style={s.legendText}>25th Percentile</Text></View>
                  <View style={s.legendItem}><View style={[s.legendDot, { backgroundColor: colors.success }]} /><Text style={s.legendText}>Median</Text></View>
                </View>
              </View>

              {/* Chart Placeholder Area */}
              <View style={s.chartPlaceholder}>
                <Text style={s.chartPlaceholderText}>Run simulation to see results</Text>
              </View>

              {/* X-Axis Labels */}
              <View style={s.xAxisRow}>
                <View style={s.xLabelCol}><Text style={s.xLabelTitle}>10th %</Text><Text style={[s.xLabelValue, { color: colors.danger }]}>$0</Text></View>
                <View style={s.xLabelCol}><Text style={s.xLabelTitle}>25th %</Text><Text style={[s.xLabelValue, { color: colors.warning }]}>$0</Text></View>
                <View style={s.xLabelCol}><Text style={s.xLabelTitle}>Median</Text><Text style={[s.xLabelValue, { color: colors.success }]}>$0</Text></View>
                <View style={s.xLabelCol}><Text style={s.xLabelTitle}>75th %</Text><Text style={[s.xLabelValue, { color: colors.success }]}>$0</Text></View>
                <View style={s.xLabelCol}><Text style={s.xLabelTitle}>90th %</Text><Text style={[s.xLabelValue, { color: colors.success }]}>$0</Text></View>
              </View>
            </View>

            {/* Bottom 2 Columns on Web -> Stacked on Mobile */}

            {/* Probability Analysis */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Probability Analysis</Text>

              <View style={s.probRow}>
                <Text style={s.probLabel}>Profit ($10K+)</Text>
                <Text style={[s.probValue, { color: colors.success }]}>0%</Text>
              </View>
              <View style={s.probRow}>
                <Text style={s.probLabel}>Profit ($5K+)</Text>
                <Text style={[s.probValue, { color: colors.success }]}>0%</Text>
              </View>
              <View style={s.probRow}>
                <Text style={s.probLabel}>Break Even (±$1K)</Text>
                <Text style={[s.probValue, { color: colors.warning }]}>0%</Text>
              </View>
              <View style={s.probRow}>
                <Text style={s.probLabel}>Loss ($5K+)</Text>
                <Text style={[s.probValue, { color: colors.danger }]}>0%</Text>
              </View>
            </View>

            {/* Statistics Summary */}
            <View style={s.card}>
              <Text style={s.cardTitle}>Statistics Summary</Text>

              <View style={s.probRow}>
                <Text style={s.probLabel}>Total Simulations</Text>
                <Text style={[s.probValue, { color: colors.textPrimary }]}>0</Text>
              </View>
              <View style={s.probRow}>
                <Text style={s.probLabel}>Profit Factor</Text>
                <Text style={[s.probValue, { color: colors.textPrimary }]}>0</Text>
              </View>
              <View style={s.probRow}>
                <Text style={s.probLabel}>Avg Drawdown</Text>
                <Text style={[s.probValue, { color: colors.danger }]}>0.0%</Text>
              </View>
              <View style={s.probRow}>
                <Text style={s.probLabel}>Profitable Runs</Text>
                <Text style={[s.probValue, { color: colors.success }]}>0/0</Text>
              </View>

              <TouchableOpacity style={s.exportBtn} activeOpacity={0.8}>
                <Feather name="download" size={16} color={colors.textPrimary} style={{ marginRight: 8 }} />
                <Text style={s.exportBtnText}>Export Results</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ────────────────────── STYLES ──────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  pad: { paddingHorizontal: 16 },

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 24 },
  iconBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.warning },

  card: { backgroundColor: colors.cardBackground, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: colors.border, elevation: 4, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, marginBottom: 20 },
  cardHeader: { marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },

  inputContainer: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(20,28,50,0.6)', borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 16, height: 48 },
  inputWrapperFocused: {
    borderColor: colors.primary,
    ...(Platform.OS === 'web' ? { boxShadow: `0 0 0 3px ${colors.primary}30` } : { elevation: 4, shadowColor: colors.primary, shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } })
  } as any,
  inputPrefix: { fontSize: 15, fontWeight: '600', color: colors.textSecondary, marginRight: 4 },
  inputBox: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.textPrimary, height: '100%' },

  rowSplit: { flexDirection: 'row', alignItems: 'flex-start' },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  runBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.warning, paddingVertical: 16, borderRadius: 16, elevation: 2 },
  runBtnText: { color: colors.primary, fontSize: 16, fontWeight: '800' },
  resetBtn: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.divider, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },

  quickStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  quickStatBox: { width: '48%', backgroundColor: colors.cardBackground, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, elevation: 2 },
  qStatLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '700', marginBottom: 8 },
  qStatValue: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },

  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: -4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },

  chartPlaceholder: { height: 200, justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.divider },
  chartPlaceholderText: { fontSize: 13, color: colors.textTertiary, fontWeight: '600' },

  xAxisRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  xLabelCol: { alignItems: 'center' },
  xLabelTitle: { fontSize: 10, color: colors.textSecondary, fontWeight: '700', marginBottom: 6 },
  xLabelValue: { fontSize: 12, fontWeight: '800' },

  probRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.divider },
  probLabel: { fontSize: 14, color: colors.textSecondary, fontWeight: '600' },
  probValue: { fontSize: 14, fontWeight: '800' },

  exportBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.divider, paddingVertical: 14, borderRadius: 16, marginTop: 24, borderWidth: 1, borderColor: colors.border },
  exportBtnText: { color: colors.textPrimary, fontSize: 14, fontWeight: '700' }
});

const s = getStyles(colors, isDark);




