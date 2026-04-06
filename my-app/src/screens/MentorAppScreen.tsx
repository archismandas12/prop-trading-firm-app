import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Image, FlatList
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { AcademyService, Course, LearningStats } from '../services/AcademyService';
import { typography } from '../theme/typography';
import { AppHeader } from '../components/ui/AppHeader';



export const MentorAppScreen = () => {
  const { colors, isDark } = useTheme();
  const [stats, setStats] = React.useState<LearningStats[]>([]);
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [mainTabs, setMainTabs] = React.useState<string[]>([]);
  const [filterTabs, setFilterTabs] = React.useState<string[]>([]);
  React.useEffect(() => { Promise.all([AcademyService.getLearningStats(), AcademyService.getCourses(), AcademyService.getMainTabs(), AcademyService.getFilterTabs()]).then(([s, c, mt, ft]) => { setStats(s); setCourses(c); setMainTabs(mt); setFilterTabs(ft); }); }, []);
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [mainTab, setMainTab] = useState('Courses');
  const [filterTab, setFilterTab] = useState('All Courses');

  // Filter the courses array based on the active filterTab
  const filteredCourses = courses.filter(course => {
    if (filterTab === 'All Courses') return true;
    return course.category.toLowerCase() === filterTab.toLowerCase();
  });

  return (
    <View style={s.container}>
      <AppHeader title="Mentor App" showBack={true} />
      <AppBackground />

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Top Stats Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.statsScroll}>
          {stats.map(stat => (
            <View key={stat.id} style={[s.statCard, { backgroundColor: stat.bg }]}>
              <View style={s.statHeader}>
                <Feather name={stat.icon as any} size={18} color={stat.darkText ? colors.textInverse : stat.tint} />
                <Text style={[s.statTitle, { color: stat.darkText ? colors.textInverse : colors.textSecondary }]}>{stat.title}</Text>
              </View>
              <Text style={[s.statValue, { color: stat.darkText ? colors.textInverse : colors.textPrimary }]}>{stat.value}</Text>
              <Text style={[s.statSubtitle, { color: stat.darkText ? 'rgba(0,0,0,0.6)' : colors.textTertiary }]}>{stat.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Main Navigation (Courses, Live, Mentors...) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.mainTabsContainer}>
          {mainTabs.map(tab => {
            const isActive = mainTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[s.mainTabPill, isActive && s.mainTabPillActive]}
                onPress={() => setMainTab(tab)}
                activeOpacity={0.8}
              >
                <Text style={[s.mainTabText, isActive && s.mainTabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {mainTab === 'Courses' && (
          <>
            {/* Filter Navigation (All, Beginner, Intermediate...) */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterScroll}>
              {filterTabs.map(tab => {
                const isActive = filterTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[s.filterPill, isActive && s.filterPillActive]}
                    onPress={() => setFilterTab(tab)}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.filterText, isActive && s.filterTextActive]}>{tab}</Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            {/* Courses List */}
            <View style={s.coursesGrid}>
              {filteredCourses.map(course => (
                <View key={course.id} style={s.courseCard}>

                  {/* Video Thumbnail Area */}
                  <View style={s.thumbnailArea}>
                    {course.featured && (
                      <View style={s.featuredBadge}>
                        <Text style={s.featuredText}>Featured</Text>
                      </View>
                    )}
                    <View style={s.playBtnShadow}>
                      <View style={s.playBtn}>
                        <Feather name="play" size={24} color={colors.warning} style={{ marginLeft: 4 }} />
                      </View>
                    </View>
                  </View>

                  {/* Course Content */}
                  <View style={s.courseBody}>
                    <View style={s.courseTagsRow}>
                      <View style={[s.categoryBadge, { backgroundColor: course.color + '15' }]}>
                        <Text style={[s.categoryText, { color: course.color }]}>{course.category.toLowerCase()}</Text>
                      </View>
                      <View style={s.ratingRow}>
                        <MaterialCommunityIcons name="star" size={16} color={colors.warning} />
                        <Text style={s.ratingText}>{course.rating}</Text>
                      </View>
                    </View>

                    <Text style={s.courseTitle} numberOfLines={2}>{course.title}</Text>
                    <Text style={s.courseDesc} numberOfLines={2}>{course.description}</Text>

                    {/* Author Box */}
                    <View style={s.authorBox}>
                      <View style={s.authorAvatar}>
                        <Text style={s.authorInitials}>{course.authorInitials}</Text>
                      </View>
                      <View>
                        <Text style={s.authorName}>{course.author}</Text>
                        <Text style={s.authorRole}>{course.authorRole}</Text>
                      </View>
                    </View>

                    {/* Metrics Row */}
                    <View style={s.metricsRow}>
                      <View style={s.metricItem}>
                        <Feather name="clock" size={14} color={colors.textTertiary} />
                        <Text style={s.metricText}>{course.duration}</Text>
                      </View>
                      <View style={s.metricItem}>
                        <Feather name="file-text" size={14} color={colors.textTertiary} />
                        <Text style={s.metricText}>{course.lessons}</Text>
                      </View>
                      <View style={s.metricItem}>
                        <Feather name="users" size={14} color={colors.textTertiary} />
                        <Text style={s.metricText}>{course.students}</Text>
                      </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity style={s.actionBtn} activeOpacity={0.9}>
                      <Text style={s.actionBtnText}>{course.status}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {filteredCourses.length === 0 && (
                <View style={s.emptyState}>
                  <Feather name="video-off" size={48} color={colors.textTertiary} />
                  <Text style={s.emptyStateText}>No courses found for this category.</Text>
                </View>
              )}
            </View>
          </>
        )}

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

  // Stats Scroll
  statsScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 24 },
  statCard: { width: 170, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: colors.border, elevation: 2, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  statTitle: { fontSize: 13, fontWeight: '700' },
  statValue: { fontSize: 32, fontWeight: '900', letterSpacing: -1, marginBottom: 4 },
  statSubtitle: { fontSize: 12, fontWeight: '500' },

  // Main Tabs (Courses, Live, Mentors...)
  mainTabsContainer: { paddingHorizontal: 16, gap: 8, marginBottom: 20 },
  mainTabPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  mainTabPillActive: { backgroundColor: colors.warning },
  mainTabText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  mainTabTextActive: { color: colors.textInverse },

  // Filter Tabs (All, Beginner...)
  filterScroll: { paddingHorizontal: 16, gap: 8, marginBottom: 24 },
  filterPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: 'transparent' },
  filterPillActive: { backgroundColor: colors.appAccentLight }, // Dark pill
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: colors.textPrimary },

  // Courses List
  coursesGrid: { paddingHorizontal: 16, gap: 20 },
  courseCard: { backgroundColor: colors.cardBackground, borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, elevation: 4, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },

  thumbnailArea: { height: 160, backgroundColor: colors.cardBackground, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  featuredBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: colors.warning, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  featuredText: { fontSize: 10, fontWeight: '800', color: colors.textInverse, textTransform: 'uppercase', letterSpacing: 0.5 },
  playBtnShadow: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,183,19,0.1)', justifyContent: 'center', alignItems: 'center' },
  playBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.cardBackground, justifyContent: 'center', alignItems: 'center', shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },

  courseBody: { padding: 20 },
  courseTagsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '800', color: colors.textPrimary },

  courseTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 },
  courseDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: 16 },

  authorBox: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  authorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  authorInitials: { fontSize: 14, fontWeight: '800', color: colors.warning },
  authorName: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  authorRole: { fontSize: 11, color: colors.textTertiary, marginTop: 2 },

  metricsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  metricItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricText: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },

  actionBtn: { backgroundColor: colors.warning, borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  actionBtnText: { color: colors.textInverse, fontSize: 14, fontWeight: '800' },

  emptyState: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center' },
  emptyStateText: { fontSize: 14, color: colors.textTertiary, fontWeight: '600', marginTop: 12, textAlign: 'center' }
});




