import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Image
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { AppBackground } from '../components/ui/AppBackground';
import { AcademyService, Course } from '../services/AcademyService';
import { UserService, UserProfile } from '../services/UserService';
import { typography } from '../theme/typography';
import { AppHeader } from '../components/ui/AppHeader';


export const AcademyScreen = () => {
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [allCourses, setAllCourses] = React.useState<Course[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  React.useEffect(() => { Promise.all([AcademyService.getCourses(), AcademyService.getCategories(), UserService.getCurrentUser()]).then(([c, cats, u]) => { setAllCourses(c); setCategories(cats); setUser(u as UserProfile); }); }, []);
  const s = React.useMemo(() => getStyles(colors, false), [colors]);

  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = React.useState('All Courses');

  const TABS = ['All Courses', 'Basics', 'Technical', 'Psychology', 'Strategy'];

  const filteredCourses = React.useMemo(() => {
    if (activeTab === 'All Courses') return allCourses;
    // The tabs roughly map to the `category` strings in the COURSES mock data
    return allCourses.filter(c => c.category === activeTab.toUpperCase());
  }, [activeTab, allCourses]);

  return (
    <View style={s.container}>
      <AppHeader title="Academy" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={s.pad}>

          {/* Hero Banner (App Theme) */}
          <View style={s.heroBanner}>
            <View style={s.heroLogoRow}>
              <View style={s.heroLogoRing}>
                <Feather name="book-open" size={14} color={colors.primary} />
              </View>
              <Text style={s.heroLogoText}>Yo Pips Academy</Text>
            </View>

            <Text style={s.heroTitle}>
              Master the Markets{'\n'}
              <Text style={s.heroTitleHighlight}>One Pip at a Time</Text>
            </Text>

            <Text style={s.heroDesc}>
              Comprehensive trading education to take you from beginner to funded trader. Start your journey today.
            </Text>

            <View style={s.heroActionRow}>
              <TouchableOpacity style={s.resumeBtn} activeOpacity={0.8}>
                <Text style={s.resumeBtnText} numberOfLines={1} adjustsFontSizeToFit>Resume Learning</Text>
                <Feather name="arrow-up-right" size={16} color={colors.primary} style={{ marginLeft: 4, flexShrink: 0 }} />
              </TouchableOpacity>
              <TouchableOpacity style={s.catalogBtn} activeOpacity={0.8}>
                <Text style={s.catalogBtnText} numberOfLines={1} adjustsFontSizeToFit>Browse Catalog</Text>
              </TouchableOpacity>
            </View>

            {/* Performance Stats Cards (Stacked for mobile) */}
            <View style={s.heroStatsRow}>
              <View style={s.heroStatCard}>
                <View style={s.statIconCircleYellow}>
                  <Feather name="award" size={16} color={colors.warning} />
                </View>
                <Text style={s.heroStatNum}>12</Text>
                <Text style={s.heroStatLabel}>Courses Completed</Text>
              </View>

              <View style={s.heroStatCard}>
                <View style={s.statIconCircleGreen}>
                  <Feather name="target" size={16} color={colors.success} />
                </View>
                <Text style={s.heroStatNum}>85%</Text>
                <Text style={s.heroStatLabel}>Average Quiz Score</Text>
              </View>
            </View>

            {/* Current Course Strip */}
            <View style={s.currentCourseStrip}>
              <View style={s.courseIconBox}>
                <Feather name="book" size={20} color={colors.info} />
              </View>
              <View style={s.currentCourseInfo}>
                <Text style={s.currentCourseLabel}>CURRENT COURSE</Text>
                <Text style={s.currentCourseTitle}>Advanced Price Action Patterns</Text>
                <View style={s.progressBarBg}>
                  <View style={[s.progressBarFill, { width: '65%' }]} />
                </View>
              </View>
            </View>

          </View>

          {/* Course Library Header & Tabs */}
          <View style={s.libraryHeader}>
            <Text style={s.libraryTitle}>Course Library</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll} contentContainerStyle={s.tabScrollContainer}>
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[s.tabButton, isActive && s.tabButtonActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[s.tabText, isActive && s.tabTextActive]}>{tab}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Course Cards Vertical Grid (List on Mobile) */}
          <View style={s.courseGrid}>
            {filteredCourses.length === 0 ? (
              <Text style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 20 }}>No courses found in this category.</Text>
            ) : (
              filteredCourses.map((course) => (
                <TouchableOpacity key={course.id} style={s.courseCard} activeOpacity={0.9}>
                  {/* Colored Header Banner */}
                  <View style={[s.courseCardBanner, { backgroundColor: course.color }]}>
                    <View style={s.courseBadgeRow}>
                      <View style={s.courseBadgeDark}>
                        <Text style={s.courseBadgeDarkText}>{course.category}</Text>
                      </View>
                      <View style={s.courseBadgeWhite}>
                        <Text style={s.courseBadgeWhiteText}>{course.level}</Text>
                      </View>
                    </View>

                    {course.showPlayBtn && (
                      <View style={s.playBtnOverlay}>
                        <Feather name="play" size={24} color="#fff" style={{ marginLeft: 4 }} />
                      </View>
                    )}
                  </View>

                  {/* Card Content */}
                  <View style={s.courseCardBody}>
                    <Text style={s.courseCardTitle} numberOfLines={2}>{course.title}</Text>
                    <Text style={s.courseCardDesc} numberOfLines={2}>{course.description}</Text>

                    {/* Progress Line */}
                    <View style={s.courseProgressContainer}>
                      <Text style={s.courseProgressText}>
                        {course.progress > 0 ? `${course.progress}% Complete` : ''}
                      </Text>
                      <View style={s.courseProgressBarBg}>
                        <View style={[s.courseProgressBarFill, { width: `${course.progress}%` }]} />
                      </View>
                    </View>

                    {/* Card Footer (Time & Completion) */}
                    <View style={s.courseCardFooter}>
                      <View style={s.courseMetaRow}>
                        <Feather name="clock" size={12} color={colors.textSecondary} />
                        <Text style={s.courseMetaText}>{course.duration}</Text>
                        <Feather name="book-open" size={12} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                        <Text style={s.courseMetaText}>{course.lessons} Lessons</Text>
                      </View>

                      {course.progress === 100 && (
                        <View style={s.completedBadge}>
                          <Feather name="check" size={12} color="#10B981" />
                          <Text style={s.completedBadgeText}>Completed</Text>
                        </View>
                      )}
                    </View>

                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const getStyles = (colors: any, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  pad: { paddingHorizontal: 16 },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, paddingRight: 10 },
  headerNavText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600', flexShrink: 1 },

  heroBanner: { backgroundColor: colors.primary, borderRadius: 40, padding: 24, marginTop: 12, marginBottom: 32, elevation: 8, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16 },
  heroLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, marginBottom: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  heroLogoRing: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.warning, justifyContent: 'center', alignItems: 'center' },
  heroLogoText: { fontSize: 12, color: '#fff', fontWeight: '800', letterSpacing: 0.5 },

  heroTitle: { ...typography.h1, color: '#fff', lineHeight: 40, marginBottom: 16 },
  heroTitleHighlight: { color: colors.warning },
  heroDesc: { ...typography.bodyLarge, color: 'rgba(255,255,255,0.6)', lineHeight: 24, marginBottom: 32 },

  heroActionRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  resumeBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.warning, paddingVertical: 14, paddingHorizontal: 8, borderRadius: 999, elevation: 4 },
  resumeBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', flexShrink: 1, textAlign: 'center' },
  catalogBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingVertical: 14, paddingHorizontal: 8, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  catalogBtnText: { color: '#fff', fontSize: 13, fontWeight: '700', flexShrink: 1, textAlign: 'center' },

  heroStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  heroStatCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20 },
  statIconCircleYellow: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.warning, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  statIconCircleGreen: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.success, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  heroStatNum: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4 },
  heroStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: '600' },

  currentCourseStrip: { backgroundColor: colors.cardBackground, borderRadius: 24, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 8 },
  courseIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(234, 179, 8, 0.15)', justifyContent: 'center', alignItems: 'center' },
  currentCourseInfo: { flex: 1 },
  currentCourseLabel: { fontSize: 11, color: colors.warning, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  currentCourseTitle: { fontSize: 15, fontWeight: '800', color: colors.textPrimary, marginBottom: 12 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(148,163,184,0.06)', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: colors.warning, borderRadius: 3 },

  libraryHeader: { marginBottom: 24 },
  libraryTitle: { fontSize: 24, fontWeight: '900', color: colors.textPrimary, marginBottom: 20 },
  tabScroll: {},
  tabScrollContainer: { gap: 12, paddingRight: 20 },
  tabButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999, backgroundColor: colors.cardBackground, borderWidth: 2, borderColor: colors.border, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  tabButtonActive: { backgroundColor: colors.warning, borderColor: colors.warning, elevation: 4 },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '900' },

  courseGrid: { gap: 20 },
  courseCard: { backgroundColor: colors.cardBackground, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, elevation: 6, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16 },
  courseCardBanner: { height: 160, padding: 20, justifyContent: 'space-between' },
  courseBadgeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  courseBadgeDark: { backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  courseBadgeDarkText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  courseBadgeWhite: { backgroundColor: colors.cardBackground, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  courseBadgeWhiteText: { color: colors.textPrimary, fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  playBtnOverlay: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 16 },

  courseCardBody: { padding: 20 },
  courseCardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  courseCardDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: 20 },

  courseProgressContainer: { marginBottom: 20 },
  courseProgressText: { fontSize: 12, fontWeight: '800', color: colors.textPrimary, marginBottom: 8, minHeight: 14 },
  courseProgressBarBg: { height: 6, backgroundColor: colors.divider, borderRadius: 3 },
  courseProgressBarFill: { height: 6, backgroundColor: colors.warning, borderRadius: 3 },

  courseCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 16 },
  courseMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  courseMetaText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  completedBadgeText: { fontSize: 12, fontWeight: '800', color: '#10B981' }
});




