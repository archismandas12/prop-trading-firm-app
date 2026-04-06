import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { AppHeader } from '../components/ui/AppHeader';
import { CustomToggle } from '../components/ui/CustomToggle';
import { CalendarService, CalendarEvent } from '../services/CalendarService';
import { typography } from '../theme/typography';



export const EconomicCalendarScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [weekDays, setWeekDays] = React.useState<string[]>([]);
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = React.useState('');
  const [timezone, setTimezone] = React.useState('');
  const [activeDay, setActiveDay] = useState('Thu');
  const [showPassedEvents, setShowPassedEvents] = useState(false);
  React.useEffect(() => { Promise.all([CalendarService.getEvents(), CalendarService.getWeekDays(), CalendarService.getCurrentDate(), CalendarService.getTimezone()]).then(([e, w, d, tz]) => { setEvents(e); setWeekDays(w); setCurrentDate(d); setTimezone(tz); }); }, []);

  return (
    <View style={s.container}>
      <AppHeader title="Economic Calendar" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
        <View style={s.pad}>


          {/* Top Actions Row: Date & Set Alerts (Mimicking Web) */}
          <View style={s.dateAlertRow}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={s.currentDateText}>{currentDate}</Text>
              <View style={s.timezoneRow}>
                <Feather name="globe" size={12} color={colors.textSecondary} />
                <Text style={s.timezoneText}>{timezone}</Text>
              </View>
            </View>

            <TouchableOpacity style={s.setAlertsBtn} activeOpacity={0.8}>
              <Feather name="bell" size={14} color="#fff" />
              <Text style={s.setAlertsText}>Set Alerts</Text>
            </TouchableOpacity>
          </View>

          {/* Big Filter Block */}
          <View style={s.filterBlock}>

            <View style={s.filterSection}>
              <Text style={s.filterLabel}>CURRENCY</Text>
              <TouchableOpacity style={s.currencyDropdown} activeOpacity={0.7}>
                <Feather name="globe" size={16} color={colors.textSecondary} />
                <Text style={s.currencyDropdownText}>All Currencies</Text>
                <Feather name="chevron-down" size={16} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
              </TouchableOpacity>
            </View>

            <View style={s.filterSection}>
              <Text style={s.filterLabel}>DAY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.daysRow}>
                {weekDays.map((day) => {
                  const isActive = activeDay === day;
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => setActiveDay(day)}
                      style={[s.dayPill, isActive && s.dayPillActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.dayText, isActive && s.dayTextActive]}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={s.filterSection}>
              <Text style={s.filterLabel}>IMPACT LEVEL</Text>
              <View style={s.impactRow}>
                <View style={[s.impactBadge, { backgroundColor: colors.cardBackground }]}>
                  <Feather name="alert-circle" size={12} color="#EF4444" />
                  <Text style={[s.impactText, { color: '#EF4444' }]}>High</Text>
                </View>
                <View style={[s.impactBadge, { backgroundColor: colors.cardBackground }]}>
                  <Feather name="alert-triangle" size={12} color="#F59E0B" />
                  <Text style={[s.impactText, { color: '#F59E0B' }]}>Medium</Text>
                </View>
                <View style={[s.impactBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Feather name="activity" size={12} color="#10B981" />
                  <Text style={[s.impactText, { color: '#10B981' }]}>Low</Text>
                </View>
                <Text style={s.impactNoneText}>None</Text>
              </View>
            </View>

            <View style={s.filterSectionFlex}>
              <Text style={s.filterLabel}>PASSED EVENTS</Text>
              <View style={s.switchRow}>
                <Text style={s.switchLabel}>Show</Text>
                <CustomToggle
                  value={showPassedEvents}
                  onValueChange={setShowPassedEvents}
                />
              </View>
            </View>

          </View>

          {/* Events List (Table mapped to Mobile Cards) */}
          <View style={s.eventsContainer}>
            {events.map(ev => (
              <View key={ev.id} style={s.eventCard}>

                {/* Event Header: Time & Impact */}
                <View style={s.eventHeaderRow}>
                  <Text style={s.eventTime}>{ev.time}</Text>
                  <View style={[s.eventImpactBadge, { backgroundColor: ev.impactBg }]}>
                    <Text style={[s.eventImpactText, { color: ev.impactColor }]}>{ev.impact}</Text>
                  </View>
                </View>

                {/* Event Main: Currency & Title */}
                <View style={s.eventMainRow}>
                  <View style={s.currencyCoin}>
                    <Text style={s.currencyCoinText}>{ev.currency}</Text>
                  </View>
                  <Text style={s.eventName}>{ev.event}</Text>
                </View>

                {/* Event Footer: Stats (Actual/Prev/Forecast) */}
                <View style={s.eventStatsGrid}>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>ACTUAL</Text>
                    <Text style={s.statValue}>{ev.actual}</Text>
                  </View>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>PREVIOUS</Text>
                    <Text style={s.statValue}>{ev.previous}</Text>
                  </View>
                  <View style={s.statBox}>
                    <Text style={s.statLabel}>FORECAST</Text>
                    <Text style={s.statValue}>{ev.forecast}</Text>
                  </View>
                </View>

              </View>
            ))}
          </View>

        </View>
      </ScrollView>
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

  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 12, marginBottom: 20 },
  iconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.15)', justifyContent: 'center', alignItems: 'center' },
  pageSubtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },

  dateAlertRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  currentDateText: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  timezoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  timezoneText: { fontSize: 11, color: colors.textSecondary, fontWeight: '500' },
  setAlertsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#5865F2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  setAlertsText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  filterBlock: { backgroundColor: colors.cardBackground, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: colors.border, elevation: 6, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.05, shadowRadius: 16, marginBottom: 24 },
  filterSection: { marginBottom: 24 },
  filterSectionFlex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterLabel: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 1, marginBottom: 12 },

  currencyDropdown: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(20,28,50,0.6)', borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 999 },
  currencyDropdownText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },

  daysRow: { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  dayPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.divider },
  dayPillActive: { backgroundColor: '#5865F2' },
  dayText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  dayTextActive: { color: '#fff', fontWeight: '800' },

  impactRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  impactBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  impactText: { fontSize: 12, fontWeight: '700' },
  impactNoneText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600', marginLeft: 8 },

  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  switchLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },

  eventsContainer: { gap: 16, marginBottom: 40 },
  eventCard: { backgroundColor: colors.cardBackground, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: colors.border, elevation: 3, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.04, shadowRadius: 8 },
  eventHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  eventTime: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  eventImpactBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  eventImpactText: { fontSize: 11, fontWeight: '800' },

  eventMainRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  currencyCoin: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.divider, justifyContent: 'center', alignItems: 'center' },
  currencyCoinText: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  eventName: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.textPrimary, lineHeight: 22 },

  eventStatsGrid: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(20,28,50,0.6)', borderRadius: 16, padding: 16 },
  statBox: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 10, fontWeight: '800', color: colors.textSecondary, letterSpacing: 0.5, marginBottom: 4 },
  statValue: { fontSize: 14, fontWeight: '800', color: colors.textPrimary }
});




