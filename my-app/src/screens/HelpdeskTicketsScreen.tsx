import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { AppBackground } from '../components/ui/AppBackground';
import { SupportService, Ticket } from '../services/SupportService';
import { typography } from '../theme/typography';
import { AppHeader } from '../components/ui/AppHeader';

const TABS = ['Open Tickets', 'Solved History', 'All Tickets'];

export const HelpdeskTicketsScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Open Tickets');
  const [tickets, setTickets] = React.useState<Ticket[]>([]);
  React.useEffect(() => { SupportService.getTickets(activeTab).then(setTickets); }, [activeTab]);

  // Filter logic placeholder (mock data driven)
  const displayTickets = tickets;

  return (
    <View style={s.container}>
      <AppHeader title="Support Helpdesk" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>

        {/* Page Description */}
        <View style={s.pageHeader}>
          <Text style={s.pageSubtitle}>Facing an issue? Create a support ticket and our admin team will resolve it as soon as possible.</Text>

          <TouchableOpacity style={s.createBtn} activeOpacity={0.8}>
            <Feather name="plus" size={16} color={colors.textSecondary} />
            <Text style={s.createBtnText}>Create New Ticket</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabScrollContainer}>
          <LinearGradient
            colors={[colors.appAccentLight, colors.cardBackground]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.tabGroup}
          >
            {TABS.map((tab, idx) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[s.tabPill, isActive && s.tabPillActive, idx === 0 && { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }, idx === TABS.length - 1 && { borderTopRightRadius: 10, borderBottomRightRadius: 10 }]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.tabPillText, isActive && s.tabPillTextActive]}>{tab}</Text>
                </TouchableOpacity>
              )
            })}
          </LinearGradient>
        </ScrollView>

        {/* Ticket List or Empty State */}
        <View style={s.listContainer}>
          {displayTickets.length > 0 ? (
            displayTickets.map((ticket, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.8}>
                <LinearGradient
                  colors={[colors.appAccentLight, colors.cardBackground]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.ticketCard}
                >
                  <View style={s.ticketTopRow}>
                    <Text style={s.ticketIdText}>{ticket.id}</Text>
                    <View style={[s.statusBadge, { backgroundColor: ticket.statusBg }]}>
                      <Text style={[s.statusText, { color: ticket.statusColor }]}>{ticket.status}</Text>
                    </View>
                    {ticket.actionRequired && (
                      <View style={s.actionBadge}>
                        <Feather name="alert-circle" size={12} color={colors.warning} style={{ marginRight: 4 }} />
                        <Text style={s.actionText}>Action Required</Text>
                      </View>
                    )}
                  </View>

                  <View style={s.ticketTitleRow}>
                    <Text style={s.ticketTitle}>{ticket.title}</Text>
                    <View style={s.chevronCol}>
                      <View style={s.chevronCircle}>
                        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
                      </View>
                    </View>
                  </View>

                  <View style={s.ticketBottomRow}>
                    <View style={s.metaGroup}>
                      <Feather name="clock" size={12} color={colors.textSecondary} />
                      <Text style={s.metaText}>Updated {ticket.updatedAt}</Text>
                    </View>
                    <View style={[s.priorityBadge, { backgroundColor: ticket.priorityBg }]}>
                      <Feather name="alert-circle" size={12} color={ticket.priorityColor} style={{ marginRight: 4 }} />
                      <Text style={[s.priorityText, { color: ticket.priorityColor }]}>{ticket.priority}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            <View style={s.emptyStateCard}>
              <View style={s.emptyIconOuter}>
                <View style={s.emptyIconInner}>
                  <Feather name="check" size={24} color="#10B981" />
                </View>
              </View>
              <Text style={s.emptyTitle}>No Ticket History</Text>
              <Text style={s.emptySubtitle}>You haven't raised any tickets in this category yet.</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
};

// ────────────────────── STYLES ──────────────────────
const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  pageHeader: { paddingHorizontal: 16, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 24 },
  pageHeaderTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  pageSubtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 20 },

  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.divider, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignSelf: 'flex-start' },
  createBtnText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },

  tabScrollContainer: { paddingHorizontal: 16, marginBottom: 24 },
  tabGroup: { flexDirection: 'row', borderRadius: 12, padding: 4 },
  tabPill: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  tabPillActive: { backgroundColor: 'rgba(0,0,0,0.08)' },
  tabPillText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  tabPillTextActive: { color: colors.textPrimary },

  listContainer: { paddingHorizontal: 16, gap: 16 },

  // Ticket Card
  ticketCard: { borderRadius: 16, padding: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  ticketTopRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' },
  ticketIdText: { fontSize: 12, fontWeight: '800', color: colors.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  actionBadge: { flexDirection: 'row', alignItems: 'center', borderColor: colors.warning, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: 'rgba(255,183,19,0.05)' },
  actionText: { fontSize: 10, fontWeight: '700', color: colors.warning },

  ticketTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  ticketTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, flex: 1, paddingRight: 16 },
  chevronCol: { justifyContent: 'center' },
  chevronCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' },

  ticketBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaGroup: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  priorityText: { fontSize: 11, fontWeight: '700' },

  // Empty State
  emptyStateCard: { backgroundColor: colors.cardBackground, borderRadius: 16, paddingVertical: 60, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  emptyIconOuter: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyIconInner: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.7)', textAlign: 'center' }

});




