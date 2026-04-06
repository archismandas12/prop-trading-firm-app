// src/services/CoachingService.ts

export interface CoachingStat { id: string; title: string; value: string; subtitle: string; icon: string; bg: string; tint: string; darkText: boolean; }
export interface Skill { label: string; score: number; }
export interface Improvement { id: string; title: string; priority: string; desc: string; bg: string; textColor: string; }
export interface AIInsight { id: string; title: string; desc: string; icon: string; bg: string; color: string; }
export interface Goal { id: string; title: string; status: string; statusColor: string; statusBg: string; daysLeft: string; current: number; target: number; }
export interface ScheduleDay { id: string; day: string; desc: string; completed: boolean; num: string; tasks: string[]; }
export interface Achievement { id: string; title: string; desc: string; icon: string; status: 'Earned' | 'In Progress'; }

const mockStats: CoachingStat[] = [
  { id: '1', title: 'Total Profit', value: '+$0', subtitle: 'This week', icon: 'trending-up', bg: '#10B981', tint: '#fff', darkText: false },
  { id: '2', title: 'Win Rate', value: '0%', subtitle: '0 / 0 trades', icon: 'target', bg: '#fff', tint: '#FACC15', darkText: true },
  { id: '3', title: 'Profit Factor', value: '0.0', subtitle: 'Gross profit / Gross loss', icon: 'activity', bg: '#fff', tint: '#10B981', darkText: true },
  { id: '4', title: 'Best Day', value: 'N/A', subtitle: 'Avg: +$0', icon: 'hexagon', bg: '#fff', tint: '#A855F7', darkText: true },
];
const mockSkills: Skill[] = [
  { label: 'Entry Timing', score: 85 }, { label: 'Risk Management', score: 78 },
  { label: 'Trade Selection', score: 72 }, { label: 'Emotional Control', score: 68 },
  { label: 'Exit Timing', score: 65 }, { label: 'Position Sizing', score: 70 },
];
const mockImprovements: Improvement[] = [
  { id: '1', title: 'Journaling', priority: 'High Priority', desc: 'Only 60% of trades logged with analysis', bg: '#FEE2E2', textColor: '#EF4444' },
  { id: '2', title: 'Stop Loss Adherence', priority: 'Medium Priority', desc: '2 instances of moving stops this week', bg: '#FEF3C7', textColor: '#D97706' },
  { id: '3', title: 'Overtrading', priority: 'High Priority', desc: 'Trade frequency up 20% vs last week', bg: '#FEE2E2', textColor: '#EF4444' },
];
const mockInsights: AIInsight[] = [
  { id: '1', title: 'Strong Week for EURUSD', desc: 'Your win rate on EURUSD pairs improved by 15% this week.', icon: 'trending-up', bg: '#ECFDF5', color: '#10B981' },
  { id: '2', title: 'Risk Management Alert', desc: 'Your average risk per trade increased to 2.5%. Consider reducing to 2%.', icon: 'alert-circle', bg: '#FEF3C7', color: '#D97706' },
  { id: '3', title: 'Optimal Trading Hours', desc: 'Best performance occurs between 9-11 AM EST.', icon: 'clock', bg: '#EFF6FF', color: '#3B82F6' },
  { id: '4', title: 'Streak Achievement', desc: 'Longest winning streak of 8 trades this month!', icon: 'award', bg: '#ECFDF5', color: '#10B981' },
];
const mockGoals: Goal[] = [
  { id: '1', title: 'Reach 10% monthly return', status: 'on track', statusColor: '#3B82F6', statusBg: '#EFF6FF', daysLeft: '5 days left', current: 8.75, target: 10 },
  { id: '2', title: 'Maintain 60% win rate', status: 'at risk', statusColor: '#D97706', statusBg: '#FEF3C7', daysLeft: '5 days left', current: 58, target: 60 },
  { id: '3', title: 'Complete 100 trades this month', status: 'completed', statusColor: '#10B981', statusBg: '#ECFDF5', daysLeft: '5 days left', current: 112, target: 100 },
  { id: '4', title: 'Keep drawdown under 5%', status: 'on track', statusColor: '#3B82F6', statusBg: '#EFF6FF', daysLeft: 'Ongoing', current: 3.2, target: 5 },
];
const mockSchedule: ScheduleDay[] = [
  { id: '1', day: 'Monday', desc: 'Market Review & Planning', completed: true, num: '1', tasks: ['Review weekend news', 'Identify key levels', 'Set weekly goals'] },
  { id: '2', day: 'Tuesday', desc: 'Active Trading', completed: true, num: '2', tasks: ['Monitor EURUSD setup', 'Watch for GBPJPY signal', 'Review trades'] },
  { id: '3', day: 'Wednesday', desc: 'Analysis & Learning', completed: false, num: '3', tasks: ['Study winning trades', 'Practice on demo', 'Update journal'] },
  { id: '4', day: 'Thursday', desc: 'Active Trading', completed: false, num: '4', tasks: ['Execute planned setups', 'Risk management review', 'End day analysis'] },
  { id: '5', day: 'Friday', desc: 'Weekly Review', completed: false, num: '5', tasks: ['Close all trades', 'Weekly stats review', 'Plan next week'] },
];
const mockAchievements: Achievement[] = [
  { id: '1', title: 'First 100 Trades', desc: 'Completed 100 trades', icon: '🎯', status: 'Earned' },
  { id: '2', title: '10% Monthly Return', desc: 'Achieved 10% monthly profit', icon: '💰', status: 'Earned' },
  { id: '3', title: 'Perfect Week', desc: '100% win rate for a week', icon: '⭐', status: 'In Progress' },
  { id: '4', title: 'Streak Master', desc: '10 winning trades in a row', icon: '🔥', status: 'In Progress' },
  { id: '5', title: 'Disciplined Trader', desc: '30 days without overtrading', icon: '🎖️', status: 'In Progress' },
  { id: '6', title: 'Risk Manager', desc: 'Zero breach days in a month', icon: '🛡️', status: 'Earned' },
];

export class CoachingService {
  static async getStats(timeframe?: string): Promise<CoachingStat[]> { return new Promise(r => setTimeout(() => r(mockStats), 300)); }
  static async getSkills(): Promise<Skill[]> { return new Promise(r => setTimeout(() => r(mockSkills), 200)); }
  static async getImprovements(): Promise<Improvement[]> { return new Promise(r => setTimeout(() => r(mockImprovements), 200)); }
  static async getInsights(): Promise<AIInsight[]> { return new Promise(r => setTimeout(() => r(mockInsights), 300)); }
  static async getGoals(): Promise<Goal[]> { return new Promise(r => setTimeout(() => r(mockGoals), 300)); }
  static async getSchedule(): Promise<ScheduleDay[]> { return new Promise(r => setTimeout(() => r(mockSchedule), 200)); }
  static async getAchievements(): Promise<Achievement[]> { return new Promise(r => setTimeout(() => r(mockAchievements), 200)); }
  static async getTabs(): Promise<string[]> { return new Promise(r => setTimeout(() => r(['Overview', 'Goals', 'Schedule', 'Achievements']), 100)); }
}
