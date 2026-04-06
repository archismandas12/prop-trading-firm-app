// src/services/SocialService.ts

export interface SocialLink {
  id: string;
  title: string;
  stats: string;
  desc: string;
  btnLabel: string;
  url: string;
  icon: string;
  color: string;
  bg: string;
}

const mockSocialLinks: SocialLink[] = [
  { id: 'discord', title: 'Discord', stats: '15,000+ followers', desc: 'Join our trading community, chat with other traders, and get live updates.', btnLabel: 'Follow on Discord', url: 'https://discord.com', icon: 'message-square', color: '#5865F2', bg: '#EEF0FD' },
  { id: 'twitter', title: 'Twitter / X', stats: '25,000+ followers', desc: 'Follow us for the latest news, announcements, and market insights.', btnLabel: 'Follow on Twitter / X', url: 'https://twitter.com', icon: 'twitter', color: '#0F1419', bg: '#F3F4F6' },
  { id: 'instagram', title: 'Instagram', stats: '50,000+ followers', desc: 'Check out our daily stories, trading setups, and behind-the-scenes content.', btnLabel: 'Follow on Instagram', url: 'https://instagram.com', icon: 'instagram', color: '#E1306C', bg: '#FDF2F5' },
  { id: 'telegram', title: 'Telegram', stats: '30,000+ followers', desc: 'Get instant alerts and join our large community of traders.', btnLabel: 'Follow on Telegram', url: 'https://telegram.org', icon: 'send', color: '#2AABEE', bg: '#EAF6FD' },
  { id: 'youtube', title: 'YouTube', stats: '100,000+ followers', desc: 'Watch educational videos, market breakdowns, and tutorials.', btnLabel: 'Follow on YouTube', url: 'https://youtube.com', icon: 'youtube', color: '#FF0000', bg: '#FFECEC' },
  { id: 'tiktok', title: 'TikTok', stats: '75,000+ followers', desc: 'Short trading tips, quick analysis, and educational content.', btnLabel: 'Follow on TikTok', url: 'https://tiktok.com', icon: 'music', color: '#000000', bg: '#F3F4F6' },
];

export class SocialService {
  static async getSocialLinks(): Promise<SocialLink[]> {
    return new Promise(r => setTimeout(() => r(mockSocialLinks), 300));
  }
}
