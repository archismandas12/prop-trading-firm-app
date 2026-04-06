import { useTheme } from '../theme/ThemeContext';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { AppHeader } from '../components/ui/AppHeader';
import { PlatformService, PlatformDownload, EssentialTool } from '../services/PlatformService';
import { typography } from '../theme/typography';
import { LinearGradient } from 'expo-linear-gradient';



export const DownloadsScreen = () => {
  const { colors, isDark } = useTheme();
  const [platforms, setPlatforms] = React.useState<PlatformDownload[]>([]);
  const [tools, setTools] = React.useState<EssentialTool[]>([]);
  React.useEffect(() => { Promise.all([PlatformService.getPlatforms(), PlatformService.getTools()]).then(([p, t]) => { setPlatforms(p); setTools(t); }); }, []);
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();

  return (
    <View style={s.container}>
      <AppHeader title="Downloads" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
        <View style={s.pad}>


          {/* Section: Trading Platforms */}
          <View style={s.sectionHeader}>
            <Feather name="monitor" size={16} color={colors.textSecondary} />
            <Text style={s.sectionTitle}>TRADING PLATFORMS</Text>
          </View>

          <View style={s.platformGrid}>
            {platforms.map(platform => (
              <View key={platform.id} style={s.platformCard}>

                <View style={s.platformRowBetween}>
                  <View style={s.versionBadge}>
                    <Text style={s.versionText}>{platform.version}</Text>
                  </View>
                  <View style={[s.badgeLabel, { backgroundColor: platform.tagBg }]}>
                    <Text style={[s.badgeLabelText, { color: platform.tagColor }]}>{platform.tag}</Text>
                  </View>
                </View>

                <View style={s.platformContent}>
                  <Text style={s.platformTitle}>{platform.title}</Text>
                  <Text style={s.platformDesc}>{platform.description}</Text>
                </View>

                <View style={s.platformButtonGroup}>
                  {platform.buttons.map(btn => (
                    <TouchableOpacity
                      key={btn.id}
                      style={[
                        s.downloadBtn,
                        btn.primary ? s.downloadBtnPrimary : s.downloadBtnOutline
                      ]}
                      activeOpacity={0.7}
                    >
                      {btn.primary && (
                        <LinearGradient
                          colors={['#60A5FA', '#3B82F6', '#60A5FA']}
                          start={{ x: 0, y: 0.5 }}
                          end={{ x: 1, y: 0.5 }}
                          style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                        />
                      )}
                      <Feather
                        name={btn.icon as any}
                        size={16}
                        color={btn.primary ? '#000000' : colors.textPrimary}
                        style={{ zIndex: 1 }}
                      />
                      <Text style={[
                        s.downloadBtnText,
                        btn.primary ? { color: '#000000', fontWeight: '800' } : { color: colors.textPrimary },
                        { zIndex: 1 }
                      ]}>
                        {btn.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

              </View>
            ))}
          </View>

          {/* Mobile Promo Banner (Dark Slate with Golden Button Concept) */}
          <View style={s.promoBanner}>
            <Feather name="smartphone" size={80} color="rgba(255,255,255,0.03)" style={{ position: 'absolute', right: 20, bottom: -10 }} />

            <Text style={s.promoTitle}>Trade on the go</Text>
            <Text style={s.promoDesc}>Never miss a trade with our powerful mobile apps. Available for iOS and Android devices with full functionality.</Text>

            <View style={s.promoBtnRow}>
              <TouchableOpacity style={s.appStoreBtn} activeOpacity={0.8}>
                <Feather name="box" size={16} color={colors.primary} />
                <Text style={s.appStoreBtnText}>App Store</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.playStoreBtn} activeOpacity={0.8}>
                <Feather name="play" size={16} color="#fff" />
                <Text style={s.playStoreBtnText}>Google Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Section: Essential Tools */}
          <View style={s.sectionHeader}>
            <Feather name="chevron-right" size={16} color={colors.textSecondary} />
            <Text style={s.sectionTitle}>ESSENTIAL TOOLS</Text>
          </View>

          <View style={s.toolsGrid}>
            {tools.map(tool => (
              <TouchableOpacity key={tool.id} style={s.toolCard} activeOpacity={0.8}>
                <View style={[s.toolIconBox, { backgroundColor: tool.bg }]}>
                  <Feather name={tool.icon as any} size={24} color={tool.color} />
                </View>
                <Text style={s.toolTitle}>{tool.title}</Text>
                <Text style={s.toolSubTitle}>{tool.subtitle}</Text>
              </TouchableOpacity>
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
  pad: { paddingHorizontal: 24 },

  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 28, color: colors.textSecondary, fontWeight: '800', letterSpacing: -1, flexShrink: 1 },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 32 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 11, color: colors.textSecondary, fontWeight: '800', letterSpacing: 1 },

  platformGrid: { gap: 20, marginBottom: 32 },
  platformCard: { backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: colors.border },
  platformRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  versionBadge: { backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  versionText: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },
  badgeLabel: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  badgeLabelText: { fontSize: 10, fontWeight: '800' },

  platformContent: { marginBottom: 24 },
  platformTitle: { fontSize: 22, fontWeight: '800',  color: colors.textPrimary, marginBottom: 8, letterSpacing: -0.5 },
  platformDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 22 },

  platformButtonGroup: { gap: 12 },
  downloadBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingVertical: 16, borderRadius: 999 },
  downloadBtnOutline: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  downloadBtnPrimary: { borderWidth: 1, borderColor: colors.warning, shadowColor: colors.warning, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  downloadBtnText: { fontSize: 14, fontWeight: '800' },

  promoBanner: { backgroundColor: colors.primary, borderRadius: 32, padding: 32, marginBottom: 32, overflow: 'hidden', elevation: 8, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16 },
  promoTitle: { ...typography.h2, color: colors.textInverse, marginBottom: 12 },
  promoDesc: { fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 24, marginBottom: 32, width: '90%' },
  promoBtnRow: { flexDirection: 'row', gap: 16 },
  appStoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.cardBackground, paddingVertical: 14, paddingHorizontal: 20, borderRadius: 999 },
  appStoreBtnText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  playStoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 999 },
  playStoreBtnText: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },

  toolsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 40 },
  toolCard: { width: '47%', backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.border, elevation: 4, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
  toolIconBox: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  toolTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 4, textAlign: 'center' },
  toolSubTitle: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' }

});




