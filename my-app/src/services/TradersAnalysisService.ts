// src/services/TradersAnalysisService.ts
export interface TradeKPI {
  id: string;
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  colorType?: 'success' | 'danger' | 'neutral' | 'primary';
}

export interface TradeDistribution {
  buyPercentage: number;
  buyCount: number;
  sellPercentage: number;
  sellCount: number;
}

export interface KeyValueMetric {
  label: string;
  value: string;
  colorType?: 'success' | 'danger' | 'warning' | 'neutral' | 'primary';
}

export interface RecentTrade {
  ticket: string;
  symbol: string;
  type: string;
  volume: string;
  openPrice: string;
  closePrice: string;
  sl: string;
  tp: string;
  profit: string;
  duration: string;
  profitIsPositive: boolean;
}

export class TradersAnalysisService {
  
  static async getKPIs(timeFilter: string): Promise<TradeKPI[]> {
    // Mock varying data based on timeFilter (1d, 7d, 30d, 90d, 1y)
    return [
      { id: '1', label: 'Total Trades', value: '1', colorType: 'neutral' },
      { id: '2', label: 'Win Rate', value: '100.0%', colorType: 'success' },
      { id: '3', label: 'Profit Factor', value: '∞', colorType: 'neutral' },
      { id: '4', label: 'Avg Win', value: '+$50000.00', colorType: 'success' },
      { id: '5', label: 'Avg Loss', value: '-$0', colorType: 'danger' },
      { id: '6', label: 'Expectancy', value: '+$50000.00', colorType: 'success' },
    ];
  }

  static async getTradeDistribution(timeFilter: string): Promise<TradeDistribution> {
    return {
      buyPercentage: 0,
      buyCount: 0,
      sellPercentage: 0,
      sellCount: 0,
    };
  }

  static async getPerformanceMetrics(timeFilter: string): Promise<KeyValueMetric[]> {
    return [
      { label: 'Largest Win', value: '+$50000.00', colorType: 'success' },
      { label: 'Largest Loss', value: '-$0', colorType: 'danger' },
      { label: 'Avg Duration', value: '4h 32m', colorType: 'neutral' },
      { label: 'Avg Daily P&L', value: '+$50000.00', colorType: 'success' },
    ];
  }

  static async getDayAnalysis(timeFilter: string): Promise<KeyValueMetric[]> {
    return [
      { label: 'Best Day', value: '3/2/2026', colorType: 'success' },
      { label: 'Worst Day', value: '3/2/2026', colorType: 'danger' },
      { label: 'Current Streak', value: '2 days', colorType: 'warning' },
      { label: 'Trading Days', value: '12 days', colorType: 'neutral' },
    ];
  }

  static async getRecentTrades(timeFilter: string): Promise<RecentTrade[]> {
    return [
      {
        ticket: '1844875',
        symbol: 'N/A',
        type: 'BALANCE',
        volume: '0',
        openPrice: '0',
        closePrice: '0',
        sl: '-',
        tp: '-',
        profit: '+$50000.00',
        duration: '0h 0m',
        profitIsPositive: true
      },
      // You can add more mock records here if needed
    ];
  }
}
