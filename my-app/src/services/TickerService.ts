// src/services/TickerService.ts

export interface TickerSymbol {
  id: string;
  symbol: string;
  description: string;
  bid: string;
  ask: string;
  spread: string;
  tickerValue?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface TickerCategory {
  id: string;
  title: string;
  icon: string; // Feather icon name
  symbols: TickerSymbol[];
}

const generateMockSymbols = (count: number, prefix: string, descPrefix: string): TickerSymbol[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i}`,
    symbol: `${prefix}${i + 1 > 9 ? i + 1 : '0' + (i + 1)}`,
    description: `${descPrefix} Asset ${i + 1}`,
    bid: (Math.random() * 100).toFixed(4),
    ask: (Math.random() * 100 + 0.005).toFixed(4),
    spread: (Math.random() * 2).toFixed(1) + ' pts',
    tickerValue: (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 2).toFixed(2) + '%',
    trend: Math.random() > 0.5 ? 'up' : 'down'
  }));
};

const mockCategories: TickerCategory[] = [
  {
    id: 'c1',
    title: 'Forex',
    icon: 'dollar-sign',
    symbols: [
      { id: 'f1', symbol: 'EURUSD', description: 'Euro vs US Dollar', bid: '1.08542', ask: '1.08544', spread: '0.2 pts', tickerValue: '+0.12%', trend: 'up' },
      { id: 'f2', symbol: 'GBPUSD', description: 'British Pound vs US Dollar', bid: '1.26431', ask: '1.26435', spread: '0.4 pts', tickerValue: '-0.04%', trend: 'down' },
      { id: 'f3', symbol: 'USDJPY', description: 'US Dollar vs Japanese Yen', bid: '150.231', ask: '150.234', spread: '0.3 pts', tickerValue: '+0.34%', trend: 'up' },
      { id: 'f4', symbol: 'USDCHF', description: 'US Dollar vs Swiss Franc', bid: '0.88421', ask: '0.88425', spread: '0.4 pts', tickerValue: '-0.10%', trend: 'down' },
      { id: 'f5', symbol: 'AUDUSD', description: 'Australian Dollar vs US Dollar', bid: '0.65342', ask: '0.65345', spread: '0.3 pts', tickerValue: '+0.05%', trend: 'up' },
      { id: 'f6', symbol: 'USDCAD', description: 'US Dollar vs Canadian Dollar', bid: '1.35211', ask: '1.35215', spread: '0.4 pts', tickerValue: '-0.21%', trend: 'down' },
    ]
  },
  {
    id: 'c2',
    title: 'Metals',
    icon: 'target', // using target or something like zap for metals
    symbols: [
      { id: 'm1', symbol: 'XAUUSD', description: 'Gold vs US Dollar', bid: '2034.50', ask: '2034.75', spread: '0.25 pts', tickerValue: '+0.45%', trend: 'up' },
      { id: 'm2', symbol: 'XAGUSD', description: 'Silver vs US Dollar', bid: '22.45', ask: '22.48', spread: '0.03 pts', tickerValue: '-0.12%', trend: 'down' },
    ]
  },
  {
    id: 'c3',
    title: 'Indices',
    icon: 'bar-chart-2',
    symbols: [
      { id: 'i1', symbol: 'US30', description: 'Dow Jones Industrial Average', bid: '39054.2', ask: '39055.8', spread: '1.6 pts', tickerValue: '+0.60%', trend: 'up' },
      { id: 'i2', symbol: 'US100', description: 'NASDAQ 100', bid: '17950.4', ask: '17951.2', spread: '0.8 pts', tickerValue: '+1.10%', trend: 'up' },
      { id: 'i3', symbol: 'US500', description: 'S&P 500', bid: '5080.5', ask: '5081.0', spread: '0.5 pts', tickerValue: '+0.85%', trend: 'up' },
      { id: 'i4', symbol: 'GER40', description: 'Germany 40 (DAX)', bid: '17420.0', ask: '17421.5', spread: '1.5 pts', tickerValue: '-0.20%', trend: 'down' },
    ]
  },
  {
    id: 'c4',
    title: 'Crypto',
    icon: 'activity',
    symbols: [
      { id: 'cr1', symbol: 'BTCUSD', description: 'Bitcoin vs US Dollar', bid: '51200.0', ask: '51210.0', spread: '10.0 pts', tickerValue: '+2.40%', trend: 'up' },
      { id: 'cr2', symbol: 'ETHUSD', description: 'Ethereum vs US Dollar', bid: '2980.5', ask: '2982.0', spread: '1.5 pts', tickerValue: '+1.80%', trend: 'up' },
    ]
  },
  {
    id: 'c5',
    title: 'Energy',
    icon: 'zap',
    symbols: [
      { id: 'e1', symbol: 'USOIL', description: 'US Crude Oil', bid: '76.40', ask: '76.43', spread: '0.03 pts', tickerValue: '-0.50%', trend: 'down' },
      { id: 'e2', symbol: 'UKOIL', description: 'UK Brent Oil', bid: '81.20', ask: '81.24', spread: '0.04 pts', tickerValue: '-0.40%', trend: 'down' },
    ]
  }
];

export class TickerService {
  static async getTickerCategories(): Promise<TickerCategory[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 400);
    });
  }

  static async getMarketStatus(): Promise<{ status: string; lastUpdated: string; symbolCount: number }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
        
        let count = 0;
        mockCategories.forEach(cat => count += cat.symbols.length);

        resolve({
          status: 'Live',
          lastUpdated: timeString,
          symbolCount: count
        });
      }, 200);
    });
  }
}
