import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Clipboard
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { typography } from '../theme/typography';
import { Input } from '../components/ui/Input';
import { PartnerService, PartnerStats, PartnerTier, PartnerProgram } from '../services/PartnerService';
import { AppHeader } from '../components/ui/AppHeader';



export const PartnershipDealsScreen = () => {
  const { colors, isDark } = useTheme();
  const [partnerData, setPartnerData] = React.useState<PartnerStats | null>(null);
  const [tiers, setTiers] = React.useState<PartnerTier[]>([]);
  const [programs, setPrograms] = React.useState<PartnerProgram[]>([]);
  React.useEffect(() => { Promise.all([PartnerService.getStats(), PartnerService.getTiers(), PartnerService.getPrograms()]).then(([s, t, p]) => { setPartnerData(s); setTiers(t); setPrograms(p); }); }, []);
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('Programs');

  const copyToClipboard = () => {
    Clipboard.setString(partnerData?.referralLink || '');
    // You could add a toast notification here later
  };

  return (
    <View style={s.container}>
      <AppHeader title="Partnership Deals" showBack={true} />
      <AppBackground />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={s.pad}>

          {/* Main Golden Card - Partner Program */}
          <View style={s.goldenCard}>
            <Text style={s.goldenCardTitle}>Partner Program</Text>
            <Text style={s.goldenCardDesc}>Share Yo Pips with your network and earn rewards</Text>

            <View style={s.referralBox}>
              <Text style={s.referralLabel}>Your Referral Link</Text>
              <View style={s.referralInputRow}>
                <View style={{ flex: 1 }}>
                  <Input
                    value={partnerData?.referralLink || ''}
                    editable={false}
                  />
                </View>
                <TouchableOpacity style={s.copyBtn} onPress={copyToClipboard} activeOpacity={0.8}>
                  <Feather name="copy" size={16} color="#fff" />
                  <Text style={s.copyBtnText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.statsGrid}>
              <View style={s.statBox}>
                <Text style={s.statValue}>{partnerData?.totalEarned || '$0'}</Text>
                <Text style={s.statLabel}>Total Earned</Text>
              </View>
              <View style={[s.statBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }]}>
                <Text style={s.statValue}>{partnerData?.totalReferrals || '0'}</Text>
                <Text style={s.statLabel}>Total Referrals</Text>
              </View>
              <View style={s.statBox}>
                <Text style={s.statValue}>{partnerData?.avgPerClient || '$0'}</Text>
                <Text style={s.statLabel}>Avg per Client</Text>
              </View>
            </View>
          </View>

          {/* Partner Tiers Card */}
          <View style={s.whiteCard}>
            <Text style={s.cardTitle}>Partner Tiers</Text>

            <View style={s.tiersList}>
              {tiers.map((tier, index) => (
                <View key={tier.id} style={s.tierRow}>
                  {/* Left connection line if not last */}
                  {index < tiers.length - 1 && (
                    <View style={s.tierLine} />
                  )}

                  <View style={[s.tierBlock, { backgroundColor: tier.color }]}>
                    <View>
                      <Text style={s.tierTitle}>{tier.name}</Text>
                      <Text style={s.tierClients}>{tier.clients}</Text>
                    </View>
                    <Text style={s.tierPercent}>{tier.percent}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Tabs */}
          <View style={s.tabsRow}>
            {['Programs', 'Benefits', 'Payouts'].map(tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={[s.tabPill, isActive && s.tabPillActive]}
                  onPress={() => setActiveTab(tab)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.tabText, isActive && s.tabTextActive]}>{tab}</Text>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Programs List */}
          {activeTab === 'Programs' && (
            <View style={s.programsContainer}>
              {programs.map(prog => (
                <View key={prog.id} style={[s.progCard, prog.isPopular && s.progCardFeatured]}>

                  {prog.isPopular && (
                    <View style={s.popularBadge}>
                      <Text style={s.popularBadgeText}>Most Popular</Text>
                    </View>
                  )}

                  <View style={s.progHeader}>
                    <View style={s.handshakeIcon}>
                      <MaterialCommunityIcons name="handshake" size={20} color={colors.warning} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.progTitle}>{prog.title}</Text>
                      <Text style={s.progSubtitle}>{prog.subtitle}</Text>
                    </View>
                  </View>

                  <Text style={s.progDesc}>{prog.desc}</Text>

                  <View style={s.featuresList}>
                    {prog.features.map((feat, i) => (
                      <View key={i} style={s.featureRow}>
                        <Feather name="check" size={16} color="#10B981" />
                        <Text style={s.featureText}>{feat}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={s.applyBtn} activeOpacity={0.8}>
                    <Text style={s.applyBtnText}>Apply Now</Text>
                  </TouchableOpacity>

                </View>
              ))}
            </View>
          )}

          {/* Footer Promo */}
          <View style={s.footerPromo}>
            <View style={s.footerPromoHeader}>
              <View style={s.boltIconBox}>
                <Feather name="zap" size={24} color={colors.textPrimary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.footerPromoTitle}>Ready to Start Earning?</Text>
                <Text style={s.footerPromoDesc}>
                  Join our partner program today and start earning commissions on every trader you refer.
                </Text>
              </View>
            </View>

            <View style={s.footerBtns}>
              <TouchableOpacity style={s.getStartedBtn} activeOpacity={0.9}>
                <Text style={s.getStartedBtnText}>Get Started Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.partnerDashBtn} activeOpacity={0.7}>
                <Feather name="external-link" size={16} color="#fff" />
                <Text style={s.partnerDashBtnText}>Partner Dashboard</Text>
              </TouchableOpacity>
            </View>
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

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  goldenCard: { backgroundColor: colors.warning, borderRadius: 32, padding: 24, marginBottom: 24, elevation: 8, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 },
  goldenCardTitle: { ...typography.h2, color: colors.textPrimary, marginBottom: 4 },
  goldenCardDesc: { fontSize: 14, color: 'rgba(0,0,0,0.6)', fontWeight: '500', marginBottom: 24 },

  referralBox: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 16, borderRadius: 20, marginBottom: 24 },
  referralLabel: { fontSize: 12, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  referralInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  referralInput: { flex: 1, backgroundColor: colors.cardBackground, borderRadius: 12, height: 44, paddingHorizontal: 16, fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.textPrimary, height: 44, paddingHorizontal: 16, borderRadius: 12 },
  copyBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

  statsGrid: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 20, paddingVertical: 16 },
  statBox: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  statValue: { fontSize: 18, fontWeight: '900', color: colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(0,0,0,0.6)' },

  whiteCard: { backgroundColor: colors.cardBackground, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: colors.border, marginBottom: 32, elevation: 4, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 20 },

  tiersList: { position: 'relative' },
  tierLine: { position: 'absolute', left: 24, top: 40, bottom: -40, width: 2, backgroundColor: 'rgba(148,163,184,0.06)', zIndex: 0 },
  tierRow: { marginBottom: 12, position: 'relative', zIndex: 1 },
  tierBlock: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderRadius: 16 },
  tierTitle: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  tierClients: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  tierPercent: { fontSize: 24, fontWeight: '900', color: '#fff' },

  tabsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  tabPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  tabPillActive: { backgroundColor: colors.warning },
  tabText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  tabTextActive: { color: colors.textPrimary },

  programsContainer: { gap: 16, marginBottom: 40 },
  progCard: { backgroundColor: colors.cardBackground, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  progCardFeatured: { borderColor: colors.warning, borderWidth: 2 },
  popularBadge: { position: 'absolute', top: -12, alignSelf: 'center', backgroundColor: colors.warning, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999 },
  popularBadgeText: { fontSize: 10, fontWeight: '800', color: colors.textPrimary },

  progHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16, marginTop: 8 },
  handshakeIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.cardBackground, justifyContent: 'center', alignItems: 'center' },
  progTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  progSubtitle: { fontSize: 16, fontWeight: '900', color: colors.warning },
  progDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 22, height: 44, marginBottom: 20 },

  featuresList: { gap: 12, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },

  applyBtn: { backgroundColor: colors.textPrimary, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  applyBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },

  footerPromo: { backgroundColor: colors.primary, borderRadius: 32, padding: 24, marginBottom: 40 },
  footerPromoHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 24 },
  boltIconBox: { backgroundColor: colors.warning, width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  footerPromoTitle: { ...typography.h3, color: '#fff', marginBottom: 8 },
  footerPromoDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20 },

  footerBtns: { flexDirection: 'row', alignItems: 'center', gap: 16, flexWrap: 'wrap' },
  getStartedBtn: { backgroundColor: colors.warning, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16 },
  getStartedBtnText: { color: colors.textPrimary, fontSize: 14, fontWeight: '800' },
  partnerDashBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 14 },
  partnerDashBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' }
});




