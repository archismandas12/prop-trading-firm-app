// src/services/PlatformService.ts

export interface PlatformDownload {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagColor: string;
  tagBg: string;
  version: string;
  buttons: { id: string; label: string; icon: string; primary: boolean; url?: string }[];
}

export interface EssentialTool {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
}

const mockPlatforms: PlatformDownload[] = [
  { id: 'mt4', title: 'MetaTrader 4', description: "The world's most popular trading platform for forex and CFDs.", tag: 'Classic', tagColor: '#10B981', tagBg: 'rgba(16, 185, 129, 0.1)', version: 'MT4', buttons: [{ id: 'mt4-win', label: 'Windows', icon: 'monitor', primary: false }, { id: 'mt4-mac', label: 'macOS', icon: 'monitor', primary: false }] },
  { id: 'mt5', title: 'MetaTrader 5', description: 'Next-generation multi-asset platform with advanced analysis tools.', tag: 'Recommended', tagColor: '#6B7280', tagBg: '#F3F4F6', version: 'MT5', buttons: [{ id: 'mt5-win', label: 'Windows', icon: 'monitor', primary: true }, { id: 'mt5-mac', label: 'macOS', icon: 'monitor', primary: false }] },
  { id: 'ct', title: 'cTrader', description: 'Intuitive interface with advanced order types and fast execution.', tag: 'Modern', tagColor: '#B45309', tagBg: 'rgba(245, 158, 11, 0.15)', version: 'CT', buttons: [{ id: 'ct-win', label: 'Windows', icon: 'monitor', primary: false }, { id: 'ct-web', label: 'Web Trader', icon: 'globe', primary: false }] },
];

const mockTools: EssentialTool[] = [
  { id: 't1', icon: 'grid', title: 'Risk Calc', subtitle: 'Lot size helper', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.1)' },
  { id: 't2', icon: 'file-text', title: 'Journal', subtitle: 'Excel template', color: '#34D399', bg: 'rgba(52, 211, 153, 0.1)' },
  { id: 't3', icon: 'image', title: 'Wallpapers', subtitle: 'HD Graphics', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
  { id: 't4', icon: 'terminal', title: 'Magic Keys', subtitle: 'On-screen tool', color: '#F43F5E', bg: 'rgba(244, 63, 94, 0.1)' },
];

export class PlatformService {
  static async getPlatforms(): Promise<PlatformDownload[]> { return new Promise(r => setTimeout(() => r(mockPlatforms), 300)); }
  static async getTools(): Promise<EssentialTool[]> { return new Promise(r => setTimeout(() => r(mockTools), 200)); }
}
