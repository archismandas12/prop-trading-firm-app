// src/services/TradersService.ts
// ─────────────────────────────────────────────────
// Replace the mock `fetch` calls below with your
// real API base URL when the backend is ready.
// e.g. const BASE = 'https://api.yopips.com/v1';
// ─────────────────────────────────────────────────
const BASE = ''; // TODO: set to your API base URL

export interface TraderEntry {
  id: string;
  rank: number;
  name: string;
  initials: string;
  country: string;
  profit: string;
  profitPercent: string;
  gain: string;
  winRate: string;
  totalTrades: number;
  accountSize: string;
  accountLabel?: string;
  badge?: string;
  badgeColor?: string;
  status?: 'FUNDED' | 'ACTIVE';
}

export interface LeaderboardFilters {
  periods: string[];
  programs: string[];
}

export interface LeaderboardStats {
  totalPayouts: string;
  activeTraders: string;
  winRateAvg: string;
}

// ─── Mock data (replace with real API calls) ───
const _mockTraders: TraderEntry[] = [
  { id: 't1', rank: 1, name: 'Alexander Petrov', initials: 'AP', country: 'RU', profit: '$142,850', profitPercent: '+185.1%', gain: '+185.1%', winRate: '72.3%', totalTrades: 242, accountSize: '$50,000', accountLabel: '#8 • 2-Step', badge: '🥇', badgeColor: '#FFD700', status: 'FUNDED' },
  { id: 't2', rank: 2, name: 'Yuki Tanaka', initials: 'YT', country: 'JP', profit: '$98,420', profitPercent: '+196.8%', gain: '+196.8%', winRate: '80.2%', totalTrades: 135, accountSize: '$50,000', accountLabel: '#3 • Instant', badge: '🥈', badgeColor: '#C0C0C0', status: 'FUNDED' },
  { id: 't3', rank: 3, name: 'James Cooper', initials: 'JC', country: 'US', profit: '$87,650', profitPercent: '+175.3%', gain: '+175.3%', winRate: '52.1%', totalTrades: 213, accountSize: '$50,000', accountLabel: '#16 • Evolution', badge: '🥉', badgeColor: '#CD7F32', status: 'FUNDED' },
  { id: 't4', rank: 4, name: 'Carlos Mendez', initials: 'CM', country: 'MX', profit: '$76,300', profitPercent: '+134.4%', gain: '+134.4%', winRate: '48.0%', totalTrades: 278, accountSize: '$50,000', accountLabel: '#7 • Express', status: 'FUNDED' },
  { id: 't5', rank: 5, name: 'Priya Sharma', initials: 'PS', country: 'IN', profit: '$60,800', profitPercent: '+80.7%', gain: '+80.7%', winRate: '73.4%', totalTrades: 156, accountSize: '$75,000', accountLabel: '#2 • 2-Step', status: 'FUNDED' },
  { id: 't6', rank: 6, name: 'Michael Zhang', initials: 'MZ', country: 'CN', profit: '$58,900', profitPercent: '+74.7%', gain: '+74.7%', winRate: '68.3%', totalTrades: 195, accountSize: '$75,000', accountLabel: '#11 • Instant', status: 'FUNDED' },
  { id: 't7', rank: 7, name: 'Fatima Al Hassan', initials: 'FH', country: 'AE', profit: '$54,200', profitPercent: '+12.8%', gain: '+12.8%', winRate: '68.4%', totalTrades: 157, accountSize: '$100,000', accountLabel: '#3 • Evolution', status: 'FUNDED' },
  { id: 't8', rank: 8, name: 'Luca Fontaine', initials: 'LF', country: 'FR', profit: '$48,750', profitPercent: '+10.4%', gain: '+10.4%', winRate: '62.6%', totalTrades: 142, accountSize: '$100,000', accountLabel: '#9 • 2-Step', status: 'ACTIVE' },
  { id: 't9', rank: 9, name: 'Sarah Mitchell', initials: 'SM', country: 'GB', profit: '$45,630', profitPercent: '+11.4%', gain: '+11.4%', winRate: '65.8%', totalTrades: 224, accountSize: '$100,000', accountLabel: '#5 • Express', status: 'FUNDED' },
  { id: 't10', rank: 10, name: 'David Kim', initials: 'DK', country: 'KR', profit: '$42,100', profitPercent: '+8.4%', gain: '+8.4%', winRate: '62.8%', totalTrades: 175, accountSize: '$100,000', accountLabel: '#1 • Instant', status: 'ACTIVE' },
];

const _mockFilters: LeaderboardFilters = {
  periods: ['This Week', 'This Month', 'All Time'],
  programs: ['All Programs', 'Evolution', 'Express', 'Instant'],
};

const _mockStats: LeaderboardStats = {
  totalPayouts: '$2,847,930',
  activeTraders: '1,284',
  winRateAvg: '67.4%',
};

// ─── Service ───────────────────────────────────
export class TradersService {

  /** Fetch the ranked leaderboard, optionally filtered by period and program. */
  static async getLeaderboard(period?: string, program?: string): Promise<TraderEntry[]> {
    // TODO: Swap mock for real API call:
    // const res = await fetch(`${BASE}/leaderboard?period=${period}&program=${program}`);
    // return res.json();
    return new Promise(resolve =>
      setTimeout(() => {
        let data = [..._mockTraders];
        // Simulate program filter
        if (program && program !== 'All Programs') {
          data = data.filter(t => t.accountLabel?.includes(program));
        }
        resolve(data);
      }, 400)
    );
  }

  /** Fetch filter options (periods, programs). */
  static async getFilters(): Promise<LeaderboardFilters> {
    // TODO: const res = await fetch(`${BASE}/leaderboard/filters`);
    return new Promise(resolve => setTimeout(() => resolve(_mockFilters), 100));
  }

  /** Fetch community-wide leaderboard stats shown in the header. */
  static async getLeaderboardStats(): Promise<LeaderboardStats> {
    // TODO: const res = await fetch(`${BASE}/leaderboard/stats`);
    return new Promise(resolve => setTimeout(() => resolve(_mockStats), 200));
  }

  /** @deprecated Use getLeaderboardStats() */
  static async getCommunityStats() {
    return this.getLeaderboardStats();
  }
}
