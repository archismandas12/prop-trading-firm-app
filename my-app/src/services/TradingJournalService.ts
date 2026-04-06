// src/services/TradingJournalService.ts

export interface JournalAccount {
  id: string;
  label: string;
}

export interface JournalKPI {
  label: string;
  value: string;
  subLabel?: string;
  subValue?: string;
}

export interface SecondaryMetric {
  label: string;
  value: string;
  icon: 'trending-up' | 'trending-down' | 'repeat' | 'award';
  color: string;
}

export interface PerformanceMetrics {
  currentStreak: string;
  streakColor: string;
  longestWinRun: number;
  longestDrawdown: number;
  netProfit: string;
  netProfitColor: string;
}

export interface HourlyPnLEntry {
  hour: number;
  value: number;
}

export interface SessionSummary {
  session: string;
  value: string;
  color: string;
}

export interface SymbolPerformance {
  symbol: string;
  netPnl: string;
  pnlColor: string;
  volume: string;
  trades: number;
  winRate: string;
}

export interface TradeHistoryItem {
  id: string;
  symbol: string;
  direction: 'BUY' | 'SELL';
  openTime: string;
  closeTime: string;
  entryPrice: string;
  exitPrice: string;
  pnl: string;
  pnlColor: string;
  volume: string;
}

// ──────────────────────── Mock Data ────────────────────────

const mockAccounts: JournalAccount[] = [
  { id: '900670', label: '#900670' },
  { id: '900676', label: '#900676' },
  { id: '888412', label: '#888412' },
];

const mockKPIs: JournalKPI[] = [
  { label: 'NET PNL', value: '$0.00', subLabel: '0 Trades' },
  { label: 'WIN RATE', value: '0%' },
  { label: 'PROFIT FACTOR', value: '0' },
  { label: 'EXPECTANCY', value: '$0' },
];

const mockSecondaryMetrics: SecondaryMetric[] = [
  { label: 'AVG WIN', value: '$0', icon: 'trending-up', color: '#16A34A' },
  { label: 'AVG LOSS', value: '$0', icon: 'trending-down', color: '#DC2626' },
  { label: 'RISK:REWARD', value: '-', icon: 'repeat', color: '#6B7280' },
  { label: 'BEST TRADE', value: '+$0', icon: 'award', color: '#16A34A' },
];

const mockPerformanceMetrics: PerformanceMetrics = {
  currentStreak: 'L0',
  streakColor: '#DC2626',
  longestWinRun: 0,
  longestDrawdown: 0,
  netProfit: '+$0.00',
  netProfitColor: '#16A34A',
};

const mockHourlyPnL: HourlyPnLEntry[] = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  value: 0,
}));

const mockSessionSummaries: SessionSummary[] = [
  { session: 'ASIAN', value: '$0', color: '#16A34A' },
  { session: 'LONDON', value: '$0', color: '#16A34A' },
  { session: 'NEW YORK', value: '$0', color: '#16A34A' },
];

const mockSymbolPerformance: SymbolPerformance[] = [
  { symbol: 'EURUSD', netPnl: '+$0.00', pnlColor: '#16A34A', volume: '0.00', trades: 0, winRate: '0%' },
  { symbol: 'GBPUSD', netPnl: '+$0.00', pnlColor: '#16A34A', volume: '0.00', trades: 0, winRate: '0%' },
  { symbol: 'XAUUSD', netPnl: '+$0.00', pnlColor: '#16A34A', volume: '0.00', trades: 0, winRate: '0%' },
  { symbol: 'USDJPY', netPnl: '+$0.00', pnlColor: '#16A34A', volume: '0.00', trades: 0, winRate: '0%' },
  { symbol: 'NAS100', netPnl: '+$0.00', pnlColor: '#16A34A', volume: '0.00', trades: 0, winRate: '0%' },
];

const mockTradeHistory: TradeHistoryItem[] = [];

// ──────────────────────── Service ────────────────────────

export class TradingJournalService {
  static async getAccounts(): Promise<JournalAccount[]> {
    return new Promise(r => setTimeout(() => r(mockAccounts), 300));
  }

  static async getKPIs(accountId: string): Promise<JournalKPI[]> {
    return new Promise(r => setTimeout(() => r(mockKPIs), 400));
  }

  static async getSecondaryMetrics(accountId: string): Promise<SecondaryMetric[]> {
    return new Promise(r => setTimeout(() => r(mockSecondaryMetrics), 300));
  }

  static async getPerformanceMetrics(accountId: string): Promise<PerformanceMetrics> {
    return new Promise(r => setTimeout(() => r(mockPerformanceMetrics), 300));
  }

  static async getHourlyPnL(accountId: string): Promise<HourlyPnLEntry[]> {
    return new Promise(r => setTimeout(() => r(mockHourlyPnL), 400));
  }

  static async getSessionSummaries(accountId: string): Promise<SessionSummary[]> {
    return new Promise(r => setTimeout(() => r(mockSessionSummaries), 200));
  }

  static async getSymbolPerformance(accountId: string): Promise<SymbolPerformance[]> {
    return new Promise(r => setTimeout(() => r(mockSymbolPerformance), 400));
  }

  static async getTradeHistory(accountId: string): Promise<TradeHistoryItem[]> {
    return new Promise(r => setTimeout(() => r(mockTradeHistory), 500));
  }

  static async syncTrades(accountId: string): Promise<boolean> {
    return new Promise(r => setTimeout(() => r(true), 1000));
  }
}
