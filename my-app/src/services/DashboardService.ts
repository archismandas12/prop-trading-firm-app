export interface ActiveAccount {
  id: string;
  type: string;
  balance: number;
  originalBalance: number;
  endDate: string;
  status: 'Active' | 'Inactive';
  visible: boolean;
  progressPercent: number;
}

export interface KpiStat {
  label: string;
  value: number;
  currency: boolean;
  icon?: string;
}

export interface ChallengeProgress {
  profitTargetAmount: number;
  profitTargetPercent: number;
  currentProfit: number;
  toGo: number;
  completionPercent: number;
}

export interface TradingRules {
  maxDailyLossPercent: number;
  maxDrawdownPercent: number;
  minDays: number;
  targetPercent: number;
}

export interface AccountHistoryItem {
  id: string;
  status: 'ONGOING' | 'BREACHED' | 'PASSED';
  program: string;
  phase: string;
  accountId: string;
  balance: number;
  visible: boolean;
}

export interface PlatformStats {
  payoutsThisWeek: string;
  avgPayoutTime: string;
  activeTraders: string;
  totalFunded: string;
}

export interface PayoutOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  isPromo?: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  status: 'Active' | 'Inactive';
  memberSince: string;
  points: number;
  connectedAccounts: number;
}

// ── Metrics Screen Interfaces ──

export interface MetricsOverview {
  balance: number;
  equity: number;
  todayPnL: number;
}

export interface ConsistencyScore {
  score: number;
  status: string;
}

export interface Objective {
  label: string;
  current: string;
  target: string;
  status: 'passed' | 'ongoing' | 'failed';
}

export interface AccountStatistics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  avgWin: number;
  avgLoss: number;
  totalLots: number;
  expectancy: number;
  riskReward: number;
}

export interface DailyPnLEntry {
  date: string;
  profit: number;
}

export interface PerformanceMetric {
  label: string;
  value: string | number;
  icon: string;
}

export interface HourlyPnLEntry {
  hour: number;
  value: number;
}

export interface SymbolPerf {
  symbol: string;
  volume: number;
  winRate: number;
  pnl: number;
}

export interface TradeHistoryEntry {
  ticket: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  openTime: string;
  closeTime: string;
  lots: number;
  pnl: number;
}

// ----------------------------------------------------------------------
// Mock Data (values match reference screenshot)

export const mockActiveAccount: ActiveAccount = {
  id: '900676',
  type: '2-STEP EVALUATION',
  balance: 5000.00,
  originalBalance: 5000.00,
  endDate: 'Feb 25, 2026',
  status: 'Active',
  visible: true,
  progressPercent: 15,
};

export const mockKpis: KpiStat[] = [
  { label: "TODAY'S PROFIT", value: 0.00, currency: true, icon: 'trending-up' },
  { label: 'EQUITY', value: 5000.00, currency: true, icon: 'copy' },
  { label: 'UNREALIZED PNL', value: 0.00, currency: true, icon: 'dollar-sign' },
];

export const mockChallengeProgress: ChallengeProgress = {
  profitTargetAmount: 500,
  profitTargetPercent: 10,
  currentProfit: 0,
  toGo: 500,
  completionPercent: 0,
};

export const mockTradingRules: TradingRules = {
  maxDailyLossPercent: 5,
  maxDrawdownPercent: 10,
  minDays: 4,
  targetPercent: 10,
};

export const mockAccountHistory: AccountHistoryItem[] = [
  { id: '1',  status: 'ONGOING',  program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-90067',  balance: 5000,   visible: true },
  { id: '2',  status: 'BREACHED', program: 'Express',   phase: 'Express',          accountId: 'EXP-8953',   balance: 10000,  visible: false },
  { id: '3',  status: 'BREACHED', program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-88412',  balance: 25000,  visible: true },
  { id: '4',  status: 'BREACHED', program: 'Instant',   phase: 'Instant Funding',  accountId: 'INST-7721',  balance: 50000,  visible: false },
  { id: '5',  status: 'BREACHED', program: 'Express',   phase: 'Express',          accountId: 'EXP-6609',   balance: 10000,  visible: true },
  { id: '6',  status: 'BREACHED', program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-5504',   balance: 100000, visible: false },
  { id: '7',  status: 'ONGOING',  program: 'Free Trial',phase: 'Free Trial',       accountId: 'FT-4401',    balance: 5000,   visible: true },
  { id: '8',  status: 'BREACHED', program: 'Express',   phase: 'Express',          accountId: 'EXP-3312',   balance: 25000,  visible: false },
  { id: '9',  status: 'BREACHED', program: 'Instant',   phase: 'Instant Funding',  accountId: 'INST-2201',  balance: 10000,  visible: true },
  { id: '10', status: 'ONGOING',  program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-11098',  balance: 50000,  visible: true },
  { id: '11', status: 'BREACHED', program: 'Express',   phase: 'Express',          accountId: 'EXP-9981',   balance: 5000,   visible: false },
  { id: '12', status: 'PASSED',   program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-8870',   balance: 100000, visible: true },
  { id: '13', status: 'BREACHED', program: 'Instant',   phase: 'Instant Funding',  accountId: 'INST-7760',  balance: 25000,  visible: false },
  { id: '14', status: 'ONGOING',  program: 'Free Trial',phase: 'Free Trial',       accountId: 'FT-6650',    balance: 10000,  visible: true },
  { id: '15', status: 'BREACHED', program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-5541',   balance: 50000,  visible: false },
  { id: '16', status: 'BREACHED', program: 'Express',   phase: 'Express',          accountId: 'EXP-4431',   balance: 5000,   visible: true },
  { id: '17', status: 'ONGOING',  program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-3321',   balance: 25000,  visible: true },
  { id: '18', status: 'BREACHED', program: 'Instant',   phase: 'Instant Funding',  accountId: 'INST-2211',  balance: 10000,  visible: false },
  { id: '19', status: 'PASSED',   program: 'Express',   phase: 'Express',          accountId: 'EXP-1101',   balance: 50000,  visible: true },
  { id: '20', status: 'BREACHED', program: 'Evolution', phase: '2-Step Evaluation', accountId: 'EVO-0091',   balance: 100000, visible: false },
];

export const mockPlatformStats: PlatformStats = {
  payoutsThisWeek: '$1.2M+',
  avgPayoutTime: '< 12 Hours',
  activeTraders: '25,000+',
  totalFunded: '$50M+',
};

export const mockPayoutOptions: PayoutOption[] = [
  { id: '1', title: 'Same-Day Payouts', description: 'Get your profits within 24 hours, hassle-free.', icon: 'zap' },
  { id: '2', title: 'Flash Payout', description: 'Available for a 2% processing fee on demand.', icon: 'clock' },
  { id: '3', title: 'Payout Guarantee Policy', description: 'Bonus tiers applied based on consistency.', icon: 'shield' },
  { id: '4', title: 'Double Day', description: 'Get 2x payouts this Friday!', icon: 'gift', isPromo: true },
];

export const mockUserProfile: UserProfile = {
  id: '8c5e5974a9b',
  firstName: 'Siddhartha',
  lastName: 'Test',
  email: 'sawsiddhartha@gmail.com',
  phone: 'Not set',
  country: 'Not set',
  status: 'Active',
  memberSince: 'Feb 2026',
  points: 0,
  connectedAccounts: 28,
};

// ── Metrics Mock Data ──

export const mockMetricsOverview: MetricsOverview = {
  balance: 50000.00,
  equity: 50000.00,
  todayPnL: 0.00,
};

export const mockConsistencyScore: ConsistencyScore = {
  score: 0,
  status: 'In Progress',
};

export const mockObjectives: Objective[] = [
  { label: 'Trading Days', current: '0 days', target: '4 days minimum', status: 'ongoing' },
  { label: 'Profit Target', current: '$0.00', target: '$5,000.00 (10%)', status: 'ongoing' },
  { label: 'Max Daily Loss', current: '$0.00', target: '-$2,500.00 (5%)', status: 'passed' },
  { label: 'Max Drawdown', current: '$0.00', target: '-$5,000.00 (10%)', status: 'passed' },
];

export const mockStatistics: AccountStatistics = {
  totalTrades: 0,
  winRate: 0,
  profitFactor: 0,
  avgWin: 0,
  avgLoss: 0,
  totalLots: 0,
  expectancy: 0,
  riskReward: 0,
};

export const mockDailyPnL: DailyPnLEntry[] = [
  { date: '2026-02-01', profit: 0 }, { date: '2026-02-02', profit: 0 },
  { date: '2026-02-03', profit: 120 }, { date: '2026-02-04', profit: -45 },
  { date: '2026-02-05', profit: 0 }, { date: '2026-02-06', profit: 230 },
  { date: '2026-02-07', profit: 0 }, { date: '2026-02-08', profit: 0 },
  { date: '2026-02-09', profit: 0 }, { date: '2026-02-10', profit: -80 },
  { date: '2026-02-11', profit: 0 }, { date: '2026-02-12', profit: 310 },
  { date: '2026-02-13', profit: 0 }, { date: '2026-02-14', profit: 0 },
  { date: '2026-02-15', profit: 0 }, { date: '2026-02-16', profit: 0 },
  { date: '2026-02-17', profit: -150 }, { date: '2026-02-18', profit: 0 },
  { date: '2026-02-19', profit: 0 }, { date: '2026-02-20', profit: 510 },
  { date: '2026-02-21', profit: 0 }, { date: '2026-02-22', profit: 0 },
  { date: '2026-02-23', profit: 0 }, { date: '2026-02-24', profit: 0 },
  { date: '2026-02-25', profit: 0 }, { date: '2026-02-26', profit: 0 },
  { date: '2026-02-27', profit: 0 }, { date: '2026-02-28', profit: 0 },
];

export const mockPerformanceMetrics: PerformanceMetric[] = [
  { label: 'Current Streak', value: '0', icon: 'trending-up' },
  { label: 'Longest Win Run', value: '0', icon: 'award' },
  { label: 'Longest Drawdown', value: '$0.00', icon: 'trending-down' },
  { label: 'Net P/L', value: '$0.00', icon: 'bar-chart-2' },
];

export const mockHourlyPnL: HourlyPnLEntry[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  value: i >= 8 && i <= 16 ? Math.round((Math.random() - 0.4) * 200) : 0,
}));

export const mockSymbolPerf: SymbolPerf[] = [
  { symbol: 'EURUSD', volume: 2.5, winRate: 65, pnl: 320.50 },
  { symbol: 'GBPUSD', volume: 1.8, winRate: 58, pnl: -120.30 },
  { symbol: 'XAUUSD', volume: 3.2, winRate: 72, pnl: 890.00 },
  { symbol: 'USDJPY', volume: 1.0, winRate: 50, pnl: 45.20 },
  { symbol: 'BTCUSD', volume: 0.5, winRate: 40, pnl: -210.00 },
];

export const mockTradeHistory: TradeHistoryEntry[] = [
  { ticket: '10284', type: 'BUY', symbol: 'EURUSD', openTime: '2026-02-20 09:14', closeTime: '2026-02-20 11:30', lots: 0.50, pnl: 125.40 },
  { ticket: '10285', type: 'SELL', symbol: 'GBPUSD', openTime: '2026-02-20 10:02', closeTime: '2026-02-20 13:45', lots: 0.30, pnl: -42.10 },
  { ticket: '10286', type: 'BUY', symbol: 'XAUUSD', openTime: '2026-02-21 08:30', closeTime: '2026-02-21 09:15', lots: 1.00, pnl: 310.00 },
  { ticket: '10287', type: 'SELL', symbol: 'USDJPY', openTime: '2026-02-21 14:10', closeTime: '2026-02-21 16:00', lots: 0.20, pnl: 18.50 },
  { ticket: '10288', type: 'BUY', symbol: 'BTCUSD', openTime: '2026-02-22 11:00', closeTime: '2026-02-22 14:30', lots: 0.10, pnl: -85.20 },
  { ticket: '10289', type: 'SELL', symbol: 'EURUSD', openTime: '2026-02-23 09:00', closeTime: '2026-02-23 10:45', lots: 0.80, pnl: 195.00 },
  { ticket: '10290', type: 'BUY', symbol: 'XAUUSD', openTime: '2026-02-24 08:15', closeTime: '2026-02-24 11:00', lots: 0.50, pnl: 580.00 },
];

// ----------------------------------------------------------------------
// API Stubs — TODO: replace with real endpoints

export class DashboardService {
  static async getUserProfile(): Promise<UserProfile> {
    return new Promise(resolve => setTimeout(() => resolve(mockUserProfile), 600));
  }

  static async getActiveAccount(): Promise<ActiveAccount> {
    return new Promise(resolve => setTimeout(() => resolve(mockActiveAccount), 500));
  }

  static async getKpis(): Promise<KpiStat[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockKpis), 500));
  }

  static async getAccountHistory(filter: string = 'All', visibleOnly: boolean = false): Promise<AccountHistoryItem[]> {
    return new Promise(resolve => setTimeout(() => {
      let data = [...mockAccountHistory];
      if (filter !== 'All') {
        data = data.filter(item => item.program === filter);
      }
      if (visibleOnly) {
        data = data.filter(item => item.visible);
      }
      resolve(data);
    }, 500));
  }

  static async updateAccountVisibility(id: string, visible: boolean): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 200));
  }

  static async getPlatformStats(): Promise<PlatformStats> {
    return new Promise(resolve => setTimeout(() => resolve(mockPlatformStats), 500));
  }

  static async getPayoutOptions(): Promise<PayoutOption[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockPayoutOptions), 500));
  }

  static async getChallengeProgress(): Promise<ChallengeProgress> {
    return new Promise(resolve => setTimeout(() => resolve(mockChallengeProgress), 500));
  }

  static async getTradingRules(): Promise<TradingRules> {
    return new Promise(resolve => setTimeout(() => resolve(mockTradingRules), 500));
  }

  // ── Metrics Screen Methods ──

  static async getMetricsOverview(): Promise<MetricsOverview> {
    return new Promise(resolve => setTimeout(() => resolve(mockMetricsOverview), 400));
  }

  static async getConsistencyScore(): Promise<ConsistencyScore> {
    return new Promise(resolve => setTimeout(() => resolve(mockConsistencyScore), 400));
  }

  static async getObjectives(): Promise<Objective[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockObjectives), 400));
  }

  static async getStatistics(): Promise<AccountStatistics> {
    return new Promise(resolve => setTimeout(() => resolve(mockStatistics), 400));
  }

  static async getDailyPnL(): Promise<DailyPnLEntry[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockDailyPnL), 400));
  }

  static async getPerformanceMetrics(): Promise<PerformanceMetric[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockPerformanceMetrics), 400));
  }

  static async getHourlyPnL(): Promise<HourlyPnLEntry[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockHourlyPnL), 400));
  }

  static async getSymbolPerformance(): Promise<SymbolPerf[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockSymbolPerf), 400));
  }

  static async getTradeHistory(): Promise<TradeHistoryEntry[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockTradeHistory), 400));
  }
}
