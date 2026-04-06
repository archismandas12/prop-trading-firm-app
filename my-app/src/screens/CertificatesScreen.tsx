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
import { CertificateService, Certificate } from '../services/CertificateService';
import { BackButton } from '../components/ui/BackButton';



import { AppHeader } from '../components/ui/AppHeader';

export const CertificatesScreen = () => {
  const { colors, isDark } = useTheme();
  const [certificates, setCertificates] = React.useState<Certificate[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { CertificateService.getCertificates().then(d => { setCertificates(d); setLoading(false); }); }, []);
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();

  return (
    <View style={s.container}>
      <AppHeader title="Certificates" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
        <View style={s.pad}>


          {/* Toolbar & Search */}
          <View style={s.toolbarLayout}>
            <View style={s.actionRow}>
              <TouchableOpacity style={s.actionButton} activeOpacity={0.7}>
                <Feather name="refresh-cw" size={14} color={colors.textPrimary} style={{ flexShrink: 0 }} />
                <Text style={s.actionButtonText} numberOfLines={1} adjustsFontSizeToFit>Sync Data</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Input
                placeholder="Search awards..."
              />
            </View>
          </View>

          {/* Certificates List */}
          <View style={s.certificateList}>
            {/* Dark Golden Certificate Card */}
            <View style={s.certCard}>

              {/* Card Banner (Dark part) */}
              <View style={s.certBanner}>
                {/* Simulated Watermark Badge */}
                <View style={s.watermarkBadge}>
                  <Text style={s.watermarkText}>Y</Text>
                </View>

                <View>
                  <Text style={s.certStatusLabel}>{certificates[0]?.status}</Text>
                  <Text style={s.certMainTitle}>{certificates[0]?.title}</Text>
                  <Text style={s.certName}>{certificates[0]?.userName}</Text>
                </View>

                <Text style={s.clickPreviewHint}>Click to preview</Text>
              </View>

              {/* Card Body (White part) */}
              <View style={s.certBody}>
                <View style={s.certBodyHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.certTypeTitle} numberOfLines={2}>{certificates[0]?.typeTitle}</Text>
                    <Text style={s.certSubType}>{certificates[0]?.subType}</Text>
                  </View>
                  {certificates[0]?.isEarned && (
                    <View style={s.earnedBadge}>
                      <Text style={s.earnedBadgeText}>Earned</Text>
                    </View>
                  )}
                </View>

                <View style={s.keyValRow}>
                  <View style={s.iconKey}>
                    <Feather name="calendar" size={14} color={colors.textSecondary} />
                    <Text style={s.keyText}>Date Received</Text>
                  </View>
                  <Text style={s.valTextDark}>{certificates[0]?.dateReceived}</Text>
                </View>

                <View style={s.keyValRow}>
                  <View style={s.iconKey}>
                    <Feather name="award" size={14} color={colors.textSecondary} />
                    <Text style={s.keyText}>Reward Size</Text>
                  </View>
                  <Text style={s.valTextDark}>{certificates[0]?.rewardSize}</Text>
                </View>

                <TouchableOpacity style={s.downloadBtn} activeOpacity={0.8}>
                  <Feather name="download" size={16} color={colors.primary} style={{ marginRight: 8 }} />
                  <Text style={s.downloadBtnText}>Download PDF</Text>
                  <Feather name="external-link" size={16} color={colors.primary} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>

              </View>
            </View>
          </View>

          {/* Achievement Statistics Panel */}
          <View style={s.statsPanel}>
            <Text style={s.statsPanelTitle}>Achievement Statistics</Text>

            <View style={s.statsGrid}>
              <View style={[s.statCell, { borderRightWidth: 1, borderRightColor: colors.divider }]}>
                <Text style={s.statGiantNum}>1</Text>
                <Text style={s.statSubLabel}>TOTAL AWARDS</Text>
              </View>
              <View style={s.statCell}>
                <Text style={[s.statGiantNum, { color: colors.success }]}>-</Text>
                <Text style={s.statSubLabel}>COMPLETION</Text>
              </View>
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

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 24 },

  toolbarLayout: { marginBottom: 24, gap: 16 },
  actionRow: { flexDirection: 'row', gap: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.cardBackground, borderWidth: 2, borderColor: colors.border, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 999, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  actionButtonText: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, borderWidth: 2, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 16, height: 52, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: '500', color: colors.textPrimary },

  certificateList: { marginBottom: 32 },
  certCard: { backgroundColor: colors.cardBackground, borderRadius: 32, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, elevation: 6, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16 },

  certBanner: { backgroundColor: colors.primary, padding: 32, paddingBottom: 40, height: 200, justifyContent: 'center' },
  watermarkBadge: { position: 'absolute', top: 20, right: 20, width: 28, height: 28, borderRadius: 6, borderWidth: 1, borderColor: colors.warning, justifyContent: 'center', alignItems: 'center' },
  watermarkText: { color: colors.warning, fontSize: 14, fontWeight: '900' },
  certStatusLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '800', letterSpacing: 1, marginBottom: 8 },
  certMainTitle: { ...typography.h1, color: '#fff', fontSize: 28, marginBottom: 8 },
  certName: { fontSize: 16, color: colors.warning, fontWeight: '700' },
  clickPreviewHint: { position: 'absolute', bottom: 16, right: 20, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },

  certBody: { padding: 24 },
  certBodyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 1, borderBottomColor: colors.divider, paddingBottom: 20, marginBottom: 12 },
  certTypeTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  certSubType: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  earnedBadge: { backgroundColor: colors.cardBackground, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  earnedBadgeText: { color: '#10B981', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  keyValRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  iconKey: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  keyText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  valTextDark: { fontSize: 14, color: colors.textPrimary, fontWeight: '800' },

  downloadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.warning, paddingVertical: 16, paddingHorizontal: 20, borderRadius: 999, marginTop: 20, elevation: 4 },
  downloadBtnText: { color: colors.textPrimary, fontSize: 15, fontWeight: '800' },

  statsPanel: { backgroundColor: colors.cardBackground, borderRadius: 32, borderWidth: 1, borderColor: colors.border, padding: 32, elevation: 4, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, marginTop: 12 },
  statsPanelTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 24 },
  statsGrid: { flexDirection: 'row', alignItems: 'center' },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statGiantNum: { fontSize: 32, fontWeight: '900', color: colors.textPrimary, marginBottom: 8 },
  statSubLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '800', letterSpacing: 1 },

});




