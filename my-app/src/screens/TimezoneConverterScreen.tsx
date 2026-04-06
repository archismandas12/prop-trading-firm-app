import { useTheme } from '../theme/ThemeContext';
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { TimezoneService, TimezoneData, TimezoneOption } from '../services/TimezoneService';
import { BackButton } from '../components/ui/BackButton';
import { AppHeader } from '../components/ui/AppHeader';

export const TimezoneConverterScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);
  const navigation = useNavigation<any>();

  const [timezoneOptions] = useState<TimezoneOption[]>(TimezoneService.getAvailableTimezones());
  const [selectedTz, setSelectedTz] = useState(timezoneOptions[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [timezoneData, setTimezoneData] = useState<TimezoneData[]>([]);
  const [countdown, setCountdown] = useState<number>(0);

  // Live timer tick
  useEffect(() => {
    // Initial fetch
    setTimezoneData(TimezoneService.getTimezoneData(selectedTz.value));
    setCountdown(TimezoneService.getSecondsUntilReset());

    // Tick every second
    const interval = setInterval(() => {
      setTimezoneData(TimezoneService.getTimezoneData(selectedTz.value));
      setCountdown(prev => (prev > 0 ? prev - 1 : TimezoneService.getSecondsUntilReset()));
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTz]);

  // We won't use Modal, instead inline rendering

  return (
    <View style={s.container}>
      <AppHeader title="Timezone Converter" showBack={true} />
      <AppBackground />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={s.contentPad}>


        {/* Dropdown Selector */}
        <View style={[s.section, { zIndex: 10 }]}>
          <Text style={s.sectionLabel}>YOUR SELECTED TIMEZONE</Text>
          <TouchableOpacity
            style={[s.selectBtn, showDropdown && s.selectBtnOpen]}
            activeOpacity={0.7}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text style={s.selectBtnText}>{selectedTz.label}</Text>
            <Feather name={showDropdown ? "chevron-up" : "chevron-down"} size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          {showDropdown && (
            <View style={s.dropdownBoxInline}>
              {timezoneOptions.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={[s.dropdownItem, selectedTz.value === opt.value && s.dropdownItemActive]}
                  onPress={() => {
                    setSelectedTz(opt);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={[s.dropdownItemText, selectedTz.value === opt.value && s.dropdownItemTextActive]}>
                    {opt.label}
                  </Text>
                  {selectedTz.value === opt.value && <Feather name="check" size={18} color={colors.textPrimary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Warning Alert Box (styled like reference, adapted to Theme) */}
        <View style={s.section}>
          <Text style={[s.sectionTitle, { marginBottom: 12 }]}>Timezones & Max Daily Loss Reset</Text>
          <View style={s.alertBox}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
              <View style={s.alertIconOval}>
                <Feather name="info" size={16} color={colors.warning} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.alertText}>
                  It appears that you are in a different timezone, which is essential to consider for our Max Daily Loss objective. Our Max Daily Loss is calculated based on the <Text style={{ fontWeight: '800', color: colors.textPrimary }}>Central European Time (CET)</Text>, which serves as the base timezone for Yo Pips traders.
                </Text>
                <Text style={[s.alertText, { marginTop: 12 }]}>
                  Use the table below to determine when the Max Daily Loss objective resets in your specific timezone.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Comparative Time Table (Mobile friendly list layout) */}
        <View style={s.tableContainer}>
          {timezoneData.map((row, i) => (
            <View key={i} style={[s.tableRow, i !== timezoneData.length - 1 && s.tableRowBorder]}>
              <View style={s.tableColLeft}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  {row.area === 'Your Local Time' && <View style={s.dotGreen} />}
                  <Text style={s.areaText}>{row.area}</Text>
                </View>
                <Text style={s.currentTimeText}>{row.currentTime}</Text>
                <Text style={[s.offsetText, row.cetOffset !== '-' && { color: colors.warning }]}>
                  {row.cetOffset !== '-' ? `Offset: ${row.cetOffset}` : 'Base'}
                </Text>
              </View>

              <View style={s.tableColRight}>
                <View style={s.hourBox}>
                  <Text style={s.hourLabel}>START (MAX LOSS)</Text>
                  <Text style={s.hourVal}>{row.startHour}</Text>
                </View>
                <View style={s.hourBox}>
                  <Text style={s.hourLabel}>END (MAX LOSS)</Text>
                  <Text style={s.hourVal}>{row.endHour}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Big Yellow Countdown Box */}
        <View style={s.countdownBox}>
          <Feather name="info" size={20} color={colors.warning} style={{ marginBottom: 8 }} />
          <Text style={s.countdownLabel}>Today's permitted loss will reset in</Text>
          <Text style={[s.countdownValue, { fontVariant: ['tabular-nums'] }]}>
            {TimezoneService.formatCountdown(countdown)}
          </Text>
        </View>

        {/* Acknowledge Button */}
        <TouchableOpacity style={s.ackBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={s.ackBtnText}>Acknowledge & Close</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

// ────────────────────── STYLES ──────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  contentPad: { paddingHorizontal: 16, paddingBottom: 120, paddingTop: 24 },

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12, marginBottom: 32 },
  iconBox: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(59, 130, 246, 0.15)', borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6 },
  pageSubtitle: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' },

  selectBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  selectBtnOpen: { borderColor: colors.primary, borderBottomWidth: 1 },
  selectBtnText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },

  dropdownBoxInline: { position: 'absolute', top: 76, left: 0, right: 0, backgroundColor: colors.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', zIndex: 100, elevation: 12, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16, paddingVertical: 8, marginTop: 4 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14 },
  dropdownItemActive: { backgroundColor: colors.border },
  dropdownItemText: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },
  dropdownItemTextActive: { fontWeight: '700', color: colors.textPrimary },

  alertBox: { backgroundColor: 'rgba(250, 204, 21, 0.05)', borderWidth: 1, borderColor: colors.warning, borderRadius: 16, padding: 16 },
  alertIconOval: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(250, 204, 21, 0.1)', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  alertText: { fontSize: 13, lineHeight: 20, color: colors.textSecondary, fontWeight: '500' },

  tableContainer: { backgroundColor: colors.cardBackground, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 24, elevation: 1, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 16, paddingHorizontal: 16 },
  tableRowBorder: { borderBottomWidth: 1, borderColor: colors.border },

  tableColLeft: { flex: 1.2, paddingRight: 16, justifyContent: 'center' },
  dotGreen: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  areaText: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  currentTimeText: { fontSize: 16, fontWeight: '800', color: colors.textSecondary, marginTop: 6, fontVariant: ['tabular-nums'] },
  offsetText: { fontSize: 12, fontWeight: '600', color: colors.textTertiary, marginTop: 4 },

  tableColRight: { flex: 1, gap: 12 },
  hourBox: {},
  hourLabel: { fontSize: 10, fontWeight: '800', color: colors.textTertiary, marginBottom: 4 },
  hourVal: { fontSize: 13, fontWeight: '700', color: colors.textPrimary, fontVariant: ['tabular-nums'] },

  countdownBox: { backgroundColor: 'rgba(250, 204, 21, 0.08)', borderWidth: 2, borderColor: colors.warning, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 32 },
  countdownLabel: { fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  countdownValue: { fontSize: 40, fontWeight: '900', color: colors.textPrimary, letterSpacing: 2 },

  ackBtn: { backgroundColor: colors.warning, borderRadius: 999, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: colors.warning, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
  ackBtnText: { fontSize: 16, fontWeight: '800', color: colors.textPrimary }
});
