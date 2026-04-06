// src/services/PartnerService.ts

export interface PartnerStats {
  referralLink: string;
  totalEarned: string;
  totalReferrals: string;
  avgPerClient: string;
}

export interface PartnerTier {
  id: string;
  name: string;
  clients: string;
  percent: string;
  color: string;
  bg: string;
}

export interface PartnerProgram {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  features: string[];
  isPopular: boolean;
}

const mockStats: PartnerStats = { referralLink: 'https://yopips.com/ref/YOPIPS2024', totalEarned: '$7,490', totalReferrals: '47', avgPerClient: '$159.36' };

const mockTiers: PartnerTier[] = [
  { id: 'bronze', name: 'Bronze', clients: '0-5 active clients', percent: '10%', color: '#EA580C', bg: '#FFF7ED' },
  { id: 'silver', name: 'Silver', clients: '6-20 active clients', percent: '12%', color: '#6B7280', bg: '#F3F4F6' },
  { id: 'gold', name: 'Gold', clients: '21-50 active clients', percent: '15%', color: '#D97706', bg: '#FFFBEB' },
  { id: 'platinum', name: 'Platinum', clients: '50+ active clients', percent: '18%', color: '#0EA5E9', bg: '#F0F9FF' },
];

const mockPrograms: PartnerProgram[] = [
  { id: 'p1', title: 'IB Partner Program', subtitle: 'Up to 15%', desc: 'Earn recurring commissions for every client you refer', features: ['15% commission on spreads', 'Monthly payouts', 'Dedicated support', 'Marketing materials'], isPopular: false },
  { id: 'p2', title: 'Affiliate Partner', subtitle: 'Up to $500 CPA', desc: 'One-time payout for each qualified trader referral', features: ['$100-$500 per client', '30-day cookie tracking', 'Real-time tracking', 'Performance bonuses'], isPopular: true },
  { id: 'p3', title: 'White Label Partner', subtitle: 'Custom Revenue Share', desc: 'Launch your own trading brand with our technology', features: ['Full white-label solution', 'Custom branding', 'API access', 'Dedicated account manager'], isPopular: false },
];

export class PartnerService {
  static async getStats(): Promise<PartnerStats> { return new Promise(r => setTimeout(() => r(mockStats), 300)); }
  static async getTiers(): Promise<PartnerTier[]> { return new Promise(r => setTimeout(() => r(mockTiers), 200)); }
  static async getPrograms(): Promise<PartnerProgram[]> { return new Promise(r => setTimeout(() => r(mockPrograms), 300)); }
}
