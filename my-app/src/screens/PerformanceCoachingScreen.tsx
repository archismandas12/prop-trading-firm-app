import { useTheme } from '../theme/ThemeContext';
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { AppBackground } from '../components/ui/AppBackground';
import { CoachingService, CoachingStat, Skill, Improvement, AIInsight, Goal, ScheduleDay, Achievement } from '../services/CoachingService';
import { typography } from '../theme/typography';
import { AppHeader } from '../components/ui/AppHeader';

const MAIN_TABS = ['Overview', 'Goals', 'Schedule', 'Achievements'];

export const PerformanceCoachingScreen = () => {
  const { colors, isDark } = useTheme();
  const s = React.useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const navigation = useNavigation<any>();
  const [topStats, setTopStats] = React.useState<CoachingStat[]>([]);
  const [skills, setSkills] = React.useState<Skill[]>([]);
  const [improvements, setImprovements] = React.useState<Improvement[]>([]);
  const [aiInsights, setAiInsights] = React.useState<AIInsight[]>([]);
  const [goals, setGoals] = React.useState<Goal[]>([]);
  const [schedule, setSchedule] = React.useState<ScheduleDay[]>([]);
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [mainTab, setMainTab] = useState('Overview');
  const [timeframe, setTimeframe] = useState('Week');
  React.useEffect(() => { Promise.all([CoachingService.getStats(timeframe), CoachingService.getSkills(), CoachingService.getImprovements(), CoachingService.getInsights(), CoachingService.getGoals(), CoachingService.getSchedule(), CoachingService.getAchievements()]).then(([s, sk, im, ai, g, sc, ac]) => { setTopStats(s); setSkills(sk); setImprovements(im); setAiInsights(ai); setGoals(g); setSchedule(sc); setAchievements(ac); }); }, [timeframe]); // 'Week' or 'Month'

  return (
    <View style={s.container}>
      <AppHeader title="Performance Coaching" showBack={true} />
      <AppBackground />
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* Top Stats Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.statsScroll}>
          {topStats.map(stat => (
            <View key={stat.id} style={[s.statCard, { backgroundColor: stat.bg }]}>
              <View style={s.statHeader}>
                <Feather name={stat.icon as any} size={18} color={stat.tint} />
                <Text style={[s.statTitle, { color: stat.darkText ? colors.textSecondary : 'rgba(255,255,255,0.8)' }]}>{stat.title}</Text>
              </View>
              <Text style={[s.statValue, { color: stat.darkText ? colors.textPrimary : '#fff' }]}>{stat.value}</Text>
              <Text style={[s.statSubtitle, { color: stat.darkText ? colors.textTertiary : 'rgba(255,255,255,0.7)' }]}>{stat.subtitle}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={s.pad}>

          {/* Main Navigation & Timeframe Controls */}
          <View style={s.navRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.mainTabsContainer}>
              {MAIN_TABS.map(tab => {
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

            {/* Timeframe Pill */}
            <View style={s.timeframeContainer}>
              <TouchableOpacity
                style={[s.timeframeBtn, timeframe === 'Week' && s.timeframeBtnActive]}
                onPress={() => setTimeframe('Week')}
              >
                <Text style={[s.timeframeText, timeframe === 'Week' && s.timeframeTextActive]}>Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.timeframeBtn, timeframe === 'Month' && s.timeframeBtnActive]}
                onPress={() => setTimeframe('Month')}
              >
                <Text style={[s.timeframeText, timeframe === 'Month' && s.timeframeTextActive]}>Month</Text>
              </TouchableOpacity>
            </View>
          </View>

          {mainTab === 'Overview' && (
            <>
              {/* Performance Breakdown */}
              <View style={[s.card, s.breakdownCardSpecific]}>
                <Text style={s.cardHeaderTitle}>Performance Breakdown</Text>
                <View style={s.breakdownGrid}>
                  <View style={s.breakdownBox}>
                    <Text style={s.breakdownLabel}>Avg Win</Text>
                    <Text style={[s.breakdownValue, { color: '#10B981' }]}>{topStats?.[0]?.value || '+$0'}</Text>
                  </View>
                  <View style={s.breakdownBox}>
                    <Text style={s.breakdownLabel}>Avg Loss</Text>
                    <Text style={[s.breakdownValue, { color: '#EF4444' }]}>{'-' + (topStats?.[0]?.value || '$0').replace('+', '')}</Text>
                  </View>
                  <View style={s.breakdownBox}>
                    <Text style={s.breakdownLabel}>Win Streak</Text>
                    <Text style={[s.breakdownValue, { color: '#F59E0B' }]}>0</Text>
                  </View>
                  <View style={s.breakdownBox}>
                    <Text style={s.breakdownLabel}>Loss Streak</Text>
                    <Text style={[s.breakdownValue, { color: '#3B82F6' }]}>0</Text>
                  </View>
                </View>
              </View>

              {/* Skill Assessment */}
              <View style={s.card}>
                <Text style={s.cardHeaderTitle}>Skill Assessment</Text>

                <View style={s.skillsList}>
                  {skills.map((skill, idx) => (
                    <View key={idx} style={s.skillRow}>
                      <View style={s.skillLabelRow}>
                        <Text style={s.skillLabel}>{skill.label}</Text>
                        <Text style={s.skillScore}>{skill.score}%</Text>
                      </View>
                      <View style={s.skillBarBg}>
                        <View
                          style={[
                            s.skillBarFill,
                            { width: `${skill.score}%` },
                            skill.score >= 80 ? { backgroundColor: '#10B981' } : { backgroundColor: colors.warning }
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Areas for Improvement */}
              <View style={s.card}>
                <Text style={s.cardHeaderTitle}>Areas for Improvement</Text>

                <View style={s.improvementList}>
                  {improvements.map(item => (
                    <View key={item.id} style={s.alertBox}>
                      <View style={[s.alertIconBox, { backgroundColor: item.bg }]}>
                        <Feather name="alert-circle" size={16} color={item.textColor} />
                      </View>
                      <View style={s.alertBody}>
                        <View style={s.alertBodyHeader}>
                          <Text style={s.alertTitle}>{item.title}</Text>
                          <View style={[s.priorityBadge, { backgroundColor: item.bg }]}>
                            <Text style={[s.priorityText, { color: item.textColor }]}>{item.priority}</Text>
                          </View>
                        </View>
                        <Text style={s.alertDesc}>{item.desc}</Text>
                      </View>
                      <TouchableOpacity>
                        <Text style={s.alertLink}>View Tips</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>

              {/* AI Insights (Right side on Web, stacked on mobile) */}
              <View style={s.card}>
                <Text style={s.cardHeaderTitle}>AI Insights</Text>

                <View style={s.insightsList}>
                  {aiInsights.map((insight) => (
                    <View key={insight.id} style={[s.insightCard, { backgroundColor: insight.bg }]}>
                      <View style={s.insightHeader}>
                        <Feather name={insight.icon as any} size={18} color={insight.color} />
                        <Text style={[s.insightTitle, { color: colors.textPrimary }]}>{insight.title}</Text>
                      </View>
                      <Text style={s.insightDesc}>{insight.desc}</Text>
                    </View>
                  ))}
                </View>
              </View>

            </>
          )}

          {mainTab === 'Goals' && (
            <View style={s.tabContent}>

              {/* Set New Goal CTA */}
              <View style={[s.card, { backgroundColor: colors.warning, borderWidth: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <MaterialCommunityIcons name="target" size={24} color="#000" />
                  <Text style={[s.cardHeaderTitle, { marginBottom: 0, color: '#000' }]}>Set New Goal</Text>
                </View>
                <Text style={{ fontSize: 13, color: 'rgba(0,0,0,0.7)', marginBottom: 20 }}>Define specific, measurable goals to track your trading improvement.</Text>
                <TouchableOpacity style={{ backgroundColor: '#000', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignSelf: 'flex-start' }} activeOpacity={0.8}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Create Goal</Text>
                </TouchableOpacity>
              </View>

              {/* Goal Cards */}
              {goals.map(goal => (
                <View key={goal.id} style={s.card}>
                  <View style={s.goalHeader}>
                    <View style={[s.goalStatusBadge, { backgroundColor: goal.statusBg }]}>
                      <Text style={[s.goalStatusText, { color: goal.statusColor }]}>{goal.status}</Text>
                    </View>
                    <Text style={s.goalDaysLeft}>{goal.daysLeft}</Text>
                  </View>

                  <Text style={s.goalTitle}>{goal.title}</Text>

                  <View style={s.goalProgressRow}>
                    <Text style={s.goalProgressLabel}>Progress</Text>
                    <Text style={s.goalProgressValue}>{goal.current} / {goal.target}</Text>
                  </View>

                  <View style={s.skillBarBg}>
                    <View
                      style={[
                        s.skillBarFill,
                        { width: `${Math.min((goal.current / goal.target) * 100, 100)}%` },
                        { backgroundColor: goal.status === 'completed' ? '#10B981' : colors.warning }
                      ]}
                    />
                  </View>

                  <View style={s.goalActionRow}>
                    <TouchableOpacity style={s.goalUpdateBtn} activeOpacity={0.9}>
                      <Text style={s.goalUpdateBtnText}>Update Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.goalEditBtn} activeOpacity={0.7}>
                      <Text style={s.goalEditBtnText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            </View>
          )}

          {mainTab === 'Schedule' && (
            <View style={s.card}>
              <Text style={s.cardHeaderTitle}>Weekly Trading Schedule</Text>

              <View style={s.scheduleList}>
                {schedule.map((day, idx) => (
                  <View key={day.id} style={[s.scheduleRow, idx === schedule.length - 1 && { borderBottomWidth: 0, paddingBottom: 0 }]}>
                    <View style={s.scheduleDayInfo}>
                      <View style={[s.scheduleIcon, day.completed ? { backgroundColor: '#10B981' } : { backgroundColor: colors.border }]}>
                        {day.completed ? (
                          <Feather name="check" size={16} color="#fff" />
                        ) : (
                          <Text style={s.scheduleNum}>{day.num}</Text>
                        )}
                      </View>
                      <View>
                        <Text style={s.scheduleDayText}>{day.day}</Text>
                        <Text style={s.scheduleDescText}>{day.desc}</Text>
                      </View>
                    </View>

                    {/* Task pills horizontally scrollable for mobile format */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scheduleTaskScroll}>
                      {day.tasks.map((task, tIdx) => (
                        <View key={tIdx} style={s.scheduleTaskPill}>
                          <Text style={s.scheduleTaskText}>{task}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                ))}
              </View>
            </View>
          )}

          {mainTab === 'Achievements' && (
            <View style={s.tabContent}>
              <View style={s.achievementsGrid}>
                {achievements.map(ach => (
                  <TouchableOpacity key={ach.id} style={[s.achievementCard, ach.status === 'Earned' && s.achievementCardEarned]} activeOpacity={0.8}>
                    <Text style={s.achievementIcon}>{ach.icon}</Text>
                    <Text style={s.achievementTitle}>{ach.title}</Text>
                    <Text style={s.achievementDesc}>{ach.desc}</Text>

                    <View style={{ flex: 1 }} />

                    {ach.status === 'Earned' ? (
                      <View style={s.achievementStatusRow}>
                        <Feather name="award" size={14} color="#10B981" />
                        <Text style={[s.achievementStatusText, { color: '#10B981' }]}>Earned</Text>
                      </View>
                    ) : (
                      <View style={[s.achievementStatusRow, { justifyContent: 'center' }]}>
                        <Text style={s.achievementStatusText}>In Progress</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
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

  // Navigation Row
  navRow: { marginBottom: 20 },
  mainTabsContainer: { gap: 8, paddingRight: 16 },
  mainTabPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999 },
  mainTabPillActive: { backgroundColor: colors.warning },
  mainTabText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary },
  mainTabTextActive: { color: '#000' },

  timeframeContainer: { flexDirection: 'row', backgroundColor: colors.cardBackground, borderRadius: 999, padding: 4, alignSelf: 'flex-start', borderWidth: 1, borderColor: colors.border, marginTop: 12 },
  timeframeBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999 },
  timeframeBtnActive: { backgroundColor: colors.border },
  timeframeText: { fontSize: 13, fontWeight: '600', color: colors.textTertiary },
  timeframeTextActive: { color: colors.textPrimary },

  // Generic Card Container
  card: { backgroundColor: colors.cardBackground, borderRadius: 28, padding: 24, borderWidth: 1, borderColor: colors.border, elevation: 4, shadowColor: colors.appSurfaceShadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, marginBottom: 20 },
  cardHeaderTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary, marginBottom: 20 },

  // Performance Breakdown
  breakdownCardSpecific: { marginHorizontal: 20, padding: 24, borderRadius: 24 },
  breakdownGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  breakdownBox: { width: '47%', backgroundColor: colors.cardBackground, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  breakdownLabel: { fontSize: 13, color: colors.textTertiary, fontWeight: '800', marginBottom: 8 },
  breakdownValue: { fontSize: 24, fontWeight: '800' },

  // Skill Assessment
  skillsList: { gap: 16 },
  skillRow: { width: '100%' },
  skillLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  skillLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  skillScore: { fontSize: 13, color: colors.textPrimary, fontWeight: '800' },
  skillBarBg: { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  skillBarFill: { height: '100%', borderRadius: 4 },

  // Areas for Improvement
  improvementList: { gap: 16 },
  alertBox: { flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  alertIconBox: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  alertBody: { flex: 1 },
  alertBodyHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  alertTitle: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  priorityBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  priorityText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  alertDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  alertLink: { fontSize: 13, fontWeight: '700', color: colors.warning, marginLeft: 12, marginTop: 2 },

  // AI Insights
  insightsList: { gap: 12 },
  insightCard: { padding: 16, borderRadius: 16 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightTitle: { fontSize: 14, fontWeight: '700' },
  insightDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  // Tabs layout
  tabContent: { gap: 16 },

  // Goals
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  goalStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  goalStatusText: { fontSize: 11, fontWeight: '700', textTransform: 'lowercase' },
  goalDaysLeft: { fontSize: 12, color: colors.textTertiary, fontWeight: '500' },
  goalTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  goalProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalProgressLabel: { fontSize: 13, color: colors.textSecondary },
  goalProgressValue: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  goalActionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 24 },
  goalUpdateBtn: { flex: 1, backgroundColor: colors.appAccentLight, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  goalUpdateBtnText: { color: colors.textPrimary, fontSize: 13, fontWeight: '700' },
  goalEditBtn: { paddingVertical: 14, paddingHorizontal: 20 },
  goalEditBtnText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },

  // Schedule
  scheduleList: { gap: 0 },
  scheduleRow: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  scheduleDayInfo: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  scheduleIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  scheduleNum: { fontSize: 14, fontWeight: '800', color: colors.textPrimary },
  scheduleDayText: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  scheduleDescText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  scheduleTaskScroll: { gap: 8 },
  scheduleTaskPill: { backgroundColor: 'rgba(20,28,50,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  scheduleTaskText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  // Achievements
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 16 },
  achievementCard: { width: '48%', backgroundColor: colors.cardBackground, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: colors.border, minHeight: 180 },
  achievementCardEarned: { borderColor: colors.warning },
  achievementIcon: { fontSize: 32, marginBottom: 12 },
  achievementTitle: { fontSize: 14, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 },
  achievementDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 18, marginBottom: 16 },
  achievementStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 'auto' },
  achievementStatusText: { fontSize: 12, fontWeight: '700', color: colors.textTertiary }
});




