// src/services/AcademyService.ts

export interface Course {
  id: string;
  category: string;
  level: string;
  title: string;
  description: string;
  progress: number;
  duration: string;
  lessons: number;
  color: string;
  showPlayBtn?: boolean;
  author?: string;
  authorRole?: string;
  authorInitials?: string;
  rating?: string;
  students?: string;
  featured?: boolean;
  status?: string;
}

export interface LearningStats {
  id: string;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  bg: string;
  tint: string;
  darkText: boolean;
}

const mockCourses: Course[] = [
  { id: '1', category: 'BASICS', level: 'BEGINNER', title: 'Forex Trading Bootcamp: Zero to Hero', description: 'The complete guide to starting your forex journey. Learn terminology, chart reading, and basic analysis.', progress: 85, duration: '4h 30m', lessons: 24, color: '#3B82F6', author: 'John Smith', authorRole: 'Senior Trading Coach', authorInitials: 'JS', rating: '4.8', students: '2,450', featured: true, status: 'Continue' },
  { id: '2', category: 'TECHNICAL', level: 'INTERMEDIATE', title: 'Technical Analysis Mastery', description: 'Master chart patterns, indicators, and multi-timeframe analysis to predict price action.', progress: 60, duration: '6h 15m', lessons: 32, color: '#F59E0B', author: 'Sarah Johnson', authorRole: 'Technical Analyst', authorInitials: 'SJ', rating: '4.9', students: '1,890', featured: true, status: 'Continue' },
  { id: '3', category: 'PSYCHOLOGY', level: 'ALL', title: 'Trading Psychology & Discipline', description: 'Overcome fear, greed, and emotional trading. Build the mindset of a professional trader.', progress: 100, duration: '3h 00m', lessons: 18, color: '#A855F7', author: 'Dr. Michael Chen', authorRole: 'Trading Psychologist', authorInitials: 'DMC', rating: '4.7', students: '3,200', featured: false, status: 'Review Course' },
  { id: '4', category: 'RISK', level: 'BEGINNER', title: 'Risk Management Mastery', description: 'The most important skill in trading. Learn position sizing, R-multiples, and portfolio protection.', progress: 0, duration: '2h 45m', lessons: 14, color: '#10B981', author: 'Emma Wilson', authorRole: 'Risk Specialist', authorInitials: 'EW', rating: '4.6', students: '1,560', featured: false, status: 'Start Course' },
  { id: '5', category: 'STRATEGY', level: 'EXPERT', title: 'Scalping the 1-Minute Chart', description: 'High-intensity strategy for quick profits. Learn to execute fast with precision on lower timeframes.', progress: 0, duration: '5h 20m', lessons: 22, color: '#EF4444', author: 'Alex Rivera', authorRole: 'Professional Trader', authorInitials: 'AR', rating: '4.9', students: '980', featured: true, status: 'Start Course' },
  { id: '6', category: 'NEWS', level: 'ADVANCED', title: 'News Trading: NFP & CPI', description: 'How to trade NFP, CPI, and interest rate decisions without getting wrecked by slippage.', progress: 0, duration: '3h 30m', lessons: 16, color: '#14B8A6', showPlayBtn: true, author: 'David Park', authorRole: 'Institutional Trader', authorInitials: 'DP', rating: '4.9', students: '650', featured: false, status: 'Start Course' },
];

const mockCategories = ['All', 'Basics', 'Technical', 'Psychology', 'Risk', 'Strategy', 'News'];
const mockMainTabs = ['Courses', 'Live', 'Mentors', 'Resources'];
const mockFilterTabs = ['All Courses', 'Beginner', 'Intermediate', 'Advanced', 'Trading Psychology', 'Strategy'];

const mockStats: LearningStats[] = [
  { id: '1', title: 'My Learning', value: '6', subtitle: 'Total Courses', icon: 'book-open', bg: '#FACC15', tint: '#fff', darkText: true },
  { id: '2', title: 'Completed', value: '1', subtitle: 'Courses finished', icon: 'award', bg: '#fff', tint: '#10B981', darkText: false },
  { id: '3', title: 'In Progress', value: '2', subtitle: 'Courses ongoing', icon: 'play-circle', bg: '#fff', tint: '#FACC15', darkText: false },
  { id: '4', title: 'Learning Time', value: '24h', subtitle: 'This month', icon: 'clock', bg: '#fff', tint: '#3B82F6', darkText: false },
];

export class AcademyService {
  static async getCourses(category?: string): Promise<Course[]> {
    return new Promise(r => setTimeout(() => {
      if (!category || category === 'All') r(mockCourses);
      else r(mockCourses.filter(c => c.category.toLowerCase() === category.toLowerCase()));
    }, 400));
  }
  static async getCategories(): Promise<string[]> {
    return new Promise(r => setTimeout(() => r(mockCategories), 200));
  }
  static async getMainTabs(): Promise<string[]> {
    return new Promise(r => setTimeout(() => r(mockMainTabs), 100));
  }
  static async getFilterTabs(): Promise<string[]> {
    return new Promise(r => setTimeout(() => r(mockFilterTabs), 100));
  }
  static async getLearningStats(): Promise<LearningStats[]> {
    return new Promise(r => setTimeout(() => r(mockStats), 300));
  }
}
