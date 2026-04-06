// src/services/SymbolsService.ts

export interface SymbolData {
  id: string;
  symbol: string;
  basePrefix: string;
  bid: string;
  ask: string;
  spread: string;
  description: string;
}

const mockSymbols: SymbolData[] = [
  { id: '1', symbol: 'EURUSD', basePrefix: 'EU', bid: '1.08542', ask: '1.08544', spread: '0.2', description: 'Euro vs US Dollar' },
  { id: '2', symbol: 'GBPUSD', basePrefix: 'GB', bid: '1.26431', ask: '1.26435', spread: '0.4', description: 'British Pound vs US Dollar' },
  { id: '3', symbol: 'USDJPY', basePrefix: 'US', bid: '150.231', ask: '150.234', spread: '0.3', description: 'US Dollar vs Japanese Yen' },
  { id: '4', symbol: 'USDCHF', basePrefix: 'US', bid: '0.88421', ask: '0.88425', spread: '0.4', description: 'US Dollar vs Swiss Franc' },
  { id: '5', symbol: 'AUDUSD', basePrefix: 'AU', bid: '0.65342', ask: '0.65345', spread: '0.3', description: 'Australian Dollar vs US Dollar' },
  { id: '6', symbol: 'USDCAD', basePrefix: 'US', bid: '1.35211', ask: '1.35215', spread: '0.4', description: 'US Dollar vs Canadian Dollar' },
  { id: '7', symbol: 'NZDUSD', basePrefix: 'NZ', bid: '0.60921', ask: '0.60925', spread: '0.4', description: 'New Zealand Dollar vs US Dollar' },
  { id: '8', symbol: 'EURGBP', basePrefix: 'EU', bid: '0.85842', ask: '0.85846', spread: '0.4', description: 'Euro vs British Pound' },
  { id: '9', symbol: 'EURJPY', basePrefix: 'EU', bid: '163.051', ask: '163.056', spread: '0.5', description: 'Euro vs Japanese Yen' },
  { id: '10', symbol: 'GBPJPY', basePrefix: 'GB', bid: '189.921', ask: '189.928', spread: '0.7', description: 'British Pound vs Japanese Yen' },
];

export class SymbolsService {
  static async getSymbols(): Promise<SymbolData[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockSymbols);
      }, 400);
    });
  }

  static async getMarketStatus(): Promise<{ status: string; lastUpdated: string }> {
    return new Promise(resolve => {
      setTimeout(() => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' });
        resolve({
          status: 'Live',
          lastUpdated: timeString
        });
      }, 200);
    });
  }
}
