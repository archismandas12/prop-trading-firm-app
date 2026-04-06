import { useTheme } from '../theme/ThemeContext';
import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Linking
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { SocialService, SocialLink } from '../services/SocialService';
import { typography } from '../theme/typography';
import { AppHeader } from '../components/ui/AppHeader';


export const SocialMediaScreen = () => {
  const { colors, isDark } = useTheme();
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { SocialService.getSocialLinks().then(d => { setSocialLinks(d); setLoading(false); }); }, []);
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();

  const openLink = async (url: string) => {
    try {
      if (await Linking.canOpenURL(url)) {
        await Linking.openURL(url);
      }
    } catch (e) {
      console.error("Couldn't open URL", e);
    }
  };

  return (
    <View style={s.container}>
      <AppHeader title="Social Media" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, paddingTop: 24 }}>
        <View style={s.pad}>


          {/* Hero Banner Request (Stay Connected) */}
          <View style={s.heroBanner}>
            <Text style={s.heroTitle}>Stay Connected with YoPips</Text>
            <Text style={s.heroDesc}>
              Join our fast-growing community on your favorite platforms. Get updates, market insights, and exclusive content!
            </Text>
          </View>

          {/* Social Links Cards */}
          <View style={s.grid}>
            {socialLinks.map((item) => (
              <View key={item.id} style={s.card}>

                {/* Top Section */}
                <View style={s.cardHeader}>
                  <View style={[s.iconWrap, { backgroundColor: item.color }]}>
                    <Feather name={item.icon as any} size={20} color="#FFFFFF" />
                  </View>
                  <View style={s.titleWrap}>
                    <Text style={s.cardTitle}>{item.title}</Text>
                    <View style={s.statsRow}>
                      <Feather name="users" size={12} color={colors.textSecondary} />
                      <Text style={s.statsText}>{item.stats}</Text>
                    </View>
                  </View>
                </View>

                {/* Description Space */}
                <Text style={s.cardDesc} numberOfLines={3}>{item.desc}</Text>

                {/* Custom Branded Buttons matching the Web screenshot exactly */}
                <TouchableOpacity
                  style={[s.followBtn, { backgroundColor: item.color }]}
                  onPress={() => openLink(item.url)}
                  activeOpacity={0.8}
                >
                  <Text style={s.followBtnText}>{item.btnLabel}</Text>
                  <Feather name="external-link" size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>

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

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 24 },

  heroBanner: { backgroundColor: colors.primary, borderRadius: 24, padding: 32, marginBottom: 32, elevation: 8, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16 },
  heroTitle: { ...typography.h1, color: '#fff', fontSize: 24, marginBottom: 12 },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },

  grid: { gap: 16 },
  card: { backgroundColor: colors.cardBackground, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: colors.border, elevation: 3, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.05, shadowRadius: 8 },

  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  iconWrap: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  titleWrap: { flex: 1, justifyContent: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statsText: { fontSize: 12, color: '#10B981', fontWeight: '700' }, // Greenish tint like website stats

  cardDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, height: 66, marginBottom: 20 },

  followBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 14, borderRadius: 12 },
  followBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' }
});




