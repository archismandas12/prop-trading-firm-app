// src/services/SupportService.ts

export interface Ticket {
  id: string;
  title: string;
  status: 'OPEN' | 'REPLIED' | 'SOLVED' | 'CLOSED';
  updatedAt: string;
  priority: string;
  priorityColor: string;
  priorityBg: string;
  statusColor: string;
  statusBg: string;
  actionRequired?: boolean;
}

export interface LanguageOption {
  id: string;
  label: string;
}

const mockTickets: Ticket[] = [
  {
    id: '#TKT-361371', title: 'helo team', status: 'OPEN',
    updatedAt: '2/18/2026, 5:57:58 PM', priority: 'High Priority',
    priorityColor: '#EF4444', priorityBg: 'rgba(239, 68, 68, 0.1)',
    statusColor: '#3B82F6', statusBg: 'rgba(59, 130, 246, 0.1)',
  },
  {
    id: '#TKT-416508', title: 'xgtdtrhyth', status: 'REPLIED',
    updatedAt: '2/18/2026, 5:46:44 PM', priority: 'High Priority',
    actionRequired: true, priorityColor: '#EF4444', priorityBg: 'rgba(239, 68, 68, 0.1)',
    statusColor: '#FACC15', statusBg: 'rgba(255, 183, 19, 0.1)',
  },
];

const mockLanguages: LanguageOption[] = [
  { id: 'en', label: 'English' }, { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' }, { id: 'de', label: 'German' },
  { id: 'it', label: 'Italian' }, { id: 'pt', label: 'Portuguese' },
  { id: 'ar', label: 'Arabic' }, { id: 'hi', label: 'Hindi' },
  { id: 'zh', label: 'Chinese' }, { id: 'ja', label: 'Japanese' },
];

export class SupportService {
  static async getTickets(filter?: string): Promise<Ticket[]> {
    return new Promise(r => setTimeout(() => {
      if (filter === 'Solved History') r([]);
      else r(mockTickets);
    }, 400));
  }
  static async getLanguages(): Promise<LanguageOption[]> {
    return new Promise(r => setTimeout(() => r(mockLanguages), 200));
  }
  static async createTicket(title: string, description: string): Promise<{ success: boolean; id: string }> {
    return new Promise(r => setTimeout(() => r({ success: true, id: `#TKT-${Date.now()}` }), 500));
  }
}
