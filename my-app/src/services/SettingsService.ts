// src/services/SettingsService.ts

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  badge?: string;
  dot?: boolean;
  route?: string;
}

export interface MenuSection {
  id: string;
  title: string;
  expanded: boolean;
  items: MenuItem[];
}

export interface UserPreferences {
  darkMode: boolean;
  language: string;
  notifications: boolean;
}

const mockMenuSections: MenuSection[] = [
  {
    id: 'main', title: 'MAIN MENU', expanded: true,
    items: [
      { id: 'm1', label: 'Accounts Overview', icon: 'grid', active: true, route: 'ActiveDashboard' },
      { id: 'm2', label: 'Trading Journal', icon: 'book-open', route: 'TradingJournal' },
      { id: 'm3', label: 'Profile', icon: 'user', route: 'ProfileScreen' },
      { id: 'm4', label: 'Yo Pips Traders', icon: 'users', route: 'Traders' },
      { id: 'm5', label: 'Yo Pips Academy', icon: 'book', route: 'Academy' },
      { id: 'm6', label: 'Billing', icon: 'credit-card', route: 'Billing' },
      { id: 'm7', label: 'Leaderboard', icon: 'award', route: 'Traders' },
      { id: 'm8', label: 'Certificates', icon: 'file-text', route: 'Certificates' },
      { id: 'm9', label: 'Downloads', icon: 'download', route: 'Downloads' },
      { id: 'm10', label: 'Social Media', icon: 'share-2', route: 'SocialMedia' },
    ],
  },
  {
    id: 'tools', title: 'TOOLS & SERVICES', expanded: true,
    items: [
      { id: 't1', label: 'Economic Calendar', icon: 'calendar', route: 'EconomicCalendar' },
      { id: 't2', label: 'Symbols & Tickets', icon: 'tag', route: 'SymbolsTickets' },
      { id: 't3', label: 'Ticker', icon: 'activity', route: 'Ticker' },
      { id: 't4', label: 'Timezone Converter', icon: 'clock', route: 'TimezoneConverter' },
      { id: 't5', label: "Trader's Analysis", icon: 'trending-down', route: 'TradersAnalysis' },
      { id: 't6', label: 'Partnership Deals', icon: 'briefcase', route: 'PartnershipDeals' },
      { id: 't7', label: 'Equity Simulator', icon: 'bar-chart-2', route: 'EquitySimulator' },
      { id: 't8', label: 'Calculators', icon: 'sidebar', route: 'Calculators' },
      { id: 't9', label: 'Mentor App', icon: 'monitor', route: 'MentorApp' },
      { id: 't10', label: 'Performance Coaching', icon: 'target', route: 'PerformanceCoaching' },
    ],
  },
  {
    id: 'support', title: 'SUPPORT', expanded: true,
    items: [
      { id: 's1', label: 'Helpdesk Tickets', icon: 'message-square', route: 'HelpdeskTickets' },
      { id: 's2', label: 'Live Chat', icon: 'message-circle', dot: true, route: 'LiveChatModal' },
      { id: 's3', label: 'Discord', icon: 'message-circle', badge: 'JOIN' },
    ],
  },
];

const mockPrefs: UserPreferences = { darkMode: false, language: 'English', notifications: true };

export class SettingsService {
  static async getMenuSections(): Promise<MenuSection[]> {
    return new Promise(r => setTimeout(() => r(mockMenuSections), 300));
  }
  static async getPreferences(): Promise<UserPreferences> {
    return new Promise(r => setTimeout(() => r(mockPrefs), 200));
  }
  static async updatePreference(key: string, value: any): Promise<boolean> {
    return new Promise(r => setTimeout(() => r(true), 200));
  }
}
