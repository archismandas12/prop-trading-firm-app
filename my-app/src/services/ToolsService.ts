// src/services/ToolsService.ts

export interface BillData {
  amount: string;
  originalAmount: string;
  date: string;
  merchant: string;
  merchantIcon: string;
}

export interface IncomeOverview {
  balance: string;
  trendPercent: string;
  savingsPercent: string;
  investmentsPercent: string;
  barData: { month: string; heightPercent: string; active: boolean; tooltipValue?: string }[];
}

export interface SimulationDetail {
  percentiles: { label: string; value: string; color: string }[];
  probabilities: { label: string; value: string; color: string }[];
  maxDrawdown: string;
}

export interface Friend {
  id: string;
  name: string;
  image: string;
  selected: boolean;
}

export interface SimulationResults {
  successRate: string;
  avgBalance: string;
  bestCase: string;
  worstCase: string;
}

export interface CalculatorPreset {
  id: string;
  name: string;
  pair: string;
  risk: number;
}

export interface IncomeTransaction {
  id: string;
  amount: number;
  date: string;
  merchant: string;
  category: string;
  icon: string;
}

const mockBillData: BillData = { amount: '$1,230.00', originalAmount: '$1,450.00', date: '15 May, 2025', merchant: "Le Ju'", merchantIcon: '☕' };

const mockIncomeOverview: IncomeOverview = {
  balance: '$5,230.00', trendPercent: '13%', savingsPercent: '43%', investmentsPercent: '15%',
  barData: [
    { month: 'Jan', heightPercent: '30%', active: false },
    { month: 'Feb', heightPercent: '60%', active: false },
    { month: 'Mar', heightPercent: '80%', active: true, tooltipValue: '$1,500' },
    { month: 'Apr', heightPercent: '50%', active: false },
    { month: 'May', heightPercent: '40%', active: false },
    { month: 'Jun', heightPercent: '35%', active: false },
  ],
};

const mockSimDetail: SimulationDetail = {
  percentiles: [
    { label: '10th %', value: '$0', color: 'danger' },
    { label: '25th %', value: '$0', color: 'warning' },
    { label: 'Median', value: '$0', color: 'success' },
    { label: '75th %', value: '$0', color: 'success' },
    { label: '90th %', value: '$0', color: 'success' },
  ],
  probabilities: [
    { label: 'Profit ($10K+)', value: '0%', color: 'success' },
    { label: 'Profit ($5K+)', value: '0%', color: 'success' },
    { label: 'Break Even (±$1K)', value: '0%', color: 'warning' },
    { label: 'Loss ($5K+)', value: '0%', color: 'danger' },
  ],
  maxDrawdown: '0.0%',
};

const mockFriends: Friend[] = [
  { id: '1', name: 'Jony L.', image: 'https://i.pravatar.cc/150?img=11', selected: true },
  { id: '2', name: 'Amy J.', image: 'https://i.pravatar.cc/150?img=5', selected: true },
  { id: '3', name: 'Lisa M.', image: 'https://i.pravatar.cc/150?img=9', selected: false },
  { id: '4', name: 'Drake G.', image: 'https://i.pravatar.cc/150?img=12', selected: false },
  { id: '5', name: 'Sarah T.', image: 'https://i.pravatar.cc/150?img=20', selected: false },
];

const mockSimResults: SimulationResults = {
  successRate: '68.5%',
  avgBalance: '$108,450',
  bestCase: '$125,000',
  worstCase: '$92,000',
};

const mockTransaction: IncomeTransaction[] = [
  { id: 't1', amount: 15.00, date: '15 May, 2025', merchant: "Le Ju'", category: 'Coffee', icon: '☕' },
  { id: 't2', amount: 120.50, date: '14 May, 2025', merchant: "TradingView", category: 'Software', icon: '💻' },
];

export class ToolsService {
  static async getFriends(): Promise<Friend[]> {
    return new Promise(r => setTimeout(() => r(mockFriends), 200));
  }
  static async runSimulation(params: any): Promise<SimulationResults> {
    return new Promise(r => setTimeout(() => r(mockSimResults), 600));
  }
  static async getIncomeTransactions(): Promise<IncomeTransaction[]> {
    return new Promise(r => setTimeout(() => r(mockTransaction), 300));
  }
  static async getBillData(): Promise<BillData> {
    return new Promise(r => setTimeout(() => r(mockBillData), 200));
  }
  static async getIncomeOverview(): Promise<IncomeOverview> {
    return new Promise(r => setTimeout(() => r(mockIncomeOverview), 300));
  }
  static async getSimulationDetail(): Promise<SimulationDetail> {
    return new Promise(r => setTimeout(() => r(mockSimDetail), 300));
  }
}
