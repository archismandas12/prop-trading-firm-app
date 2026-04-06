// src/services/BillingService.ts

export interface AccountSizeOption {
  id: string;
  label: string;
  value: string;
}

export interface PriceComparison {
  market: string;
  yo: string;
  save: string;
  percent: string;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  description: string;
}

export interface PayoutRecord {
  id: string;
  date: string;
  amount: string;
  method: string;
  status: 'Completed' | 'Processing' | 'Pending';
}

export interface BillingOverview {
  profitSplit: number;
  nextPayoutDate: string;
  totalPaidOut: string;
  pendingPayout: string;
}

export interface GraphData {
  yLabels: string[];
  xLabels: string[];
}

export interface PlanRules {
  profitSplit: string;
  maxDrawdown: string;
  dailyLoss: string;
}

// Mock data
const mockAccountSizes: AccountSizeOption[] = [
  { id: 's1', label: '$10,000', value: '$10,000' },
  { id: 's2', label: '$25,000', value: '$25,000' },
  { id: 's3', label: '$50,000', value: '$50,000' },
  { id: 's4', label: '$100,000', value: '$100,000' },
  { id: 's5', label: '$200,000', value: '$200,000' },
];

const mockPricing: Record<string, PriceComparison> = {
  '$10,000': { market: '$100', yo: '$69', save: '$31', percent: '-31%' },
  '$25,000': { market: '$150', yo: '$119', save: '$31', percent: '-20%' },
  '$50,000': { market: '$280', yo: '$169', save: '$111', percent: '-40%' },
  '$100,000': { market: '$500', yo: '$299', save: '$201', percent: '-40%' },
  '$200,000': { market: '$1000', yo: '$499', save: '$501', percent: '-50%' },
};

const mockInvoices: Invoice[] = [
  { id: 'INV-001', date: 'Feb 25, 2026', amount: '$169', status: 'Paid', description: '2-Step Challenge - $50,000' },
  { id: 'INV-002', date: 'Feb 10, 2026', amount: '$69', status: 'Paid', description: '2-Step Challenge - $10,000' },
];

const mockPayouts: PayoutRecord[] = [
  { id: 'PO-001', date: 'Feb 20, 2026', amount: '$1,250', method: 'Crypto', status: 'Completed' },
  { id: 'PO-002', date: 'Feb 15, 2026', amount: '$800', method: 'Bank Transfer', status: 'Completed' },
];

const mockOverview: BillingOverview = {
  profitSplit: 80,
  nextPayoutDate: 'Mar 1, 2026',
  totalPaidOut: '$2,050',
  pendingPayout: '$450',
};

export class BillingService {
  static async getAccountSizes(): Promise<AccountSizeOption[]> {
    return new Promise(r => setTimeout(() => r(mockAccountSizes), 300));
  }
  static async getPricing(size: string): Promise<PriceComparison> {
    return new Promise(r => setTimeout(() => r(mockPricing[size] || mockPricing['$50,000']), 200));
  }
  static async getInvoices(): Promise<Invoice[]> {
    return new Promise(r => setTimeout(() => r(mockInvoices), 400));
  }
  static async getPayouts(): Promise<PayoutRecord[]> {
    return new Promise(r => setTimeout(() => r(mockPayouts), 400));
  }
  static async getOverview(): Promise<BillingOverview> {
    return new Promise(r => setTimeout(() => r(mockOverview), 300));
  }
  static async getGraphData(): Promise<GraphData> {
    return new Promise(r => setTimeout(() => r({ yLabels: ['$4k', '$3k', '$2k', '$1k', '$0'], xLabels: ['Start', 'Now'] }), 100));
  }
  static async getPlanRules(): Promise<PlanRules> {
    return new Promise(r => setTimeout(() => r({ profitSplit: '80%', maxDrawdown: '10% (EOD)', dailyLoss: '5%' }), 100));
  }
}
