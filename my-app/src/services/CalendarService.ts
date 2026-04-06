// src/services/CalendarService.ts

export interface CalendarEvent {
  id: string;
  time: string;
  impact: string;
  impactColor: string;
  impactBg: string;
  currency: string;
  event: string;
  actual: string;
  previous: string;
  forecast: string;
}

const mockEvents: CalendarEvent[] = [
  { id: 'e1', time: '08:30 AM', impact: 'High', impactColor: '#EF4444', impactBg: '#FEE2E2', currency: 'USD', event: 'Core PCE Price Index m/m', actual: '0.2%', previous: '0.1%', forecast: '0.2%' },
  { id: 'e2', time: '10:00 AM', impact: 'Medium', impactColor: '#F59E0B', impactBg: '#FEF3C7', currency: 'EUR', event: 'ECB President Lagarde Speaks', actual: '-', previous: '-', forecast: '-' },
  { id: 'e3', time: '02:00 PM', impact: 'Low', impactColor: '#10B981', impactBg: '#D1FAE5', currency: 'GBP', event: 'MPC Member Pill Speaks', actual: '-', previous: '-', forecast: '-' },
  { id: 'e4', time: '06:45 PM', impact: 'High', impactColor: '#EF4444', impactBg: '#FEE2E2', currency: 'NZD', event: 'Retail Sales q/q', actual: '-0.1%', previous: '1.2%', forecast: '0.4%' },
];

export class CalendarService {
  static async getEvents(day?: string, currency?: string, impact?: string): Promise<CalendarEvent[]> {
    return new Promise(r => setTimeout(() => r(mockEvents), 400));
  }
  static async getWeekDays(): Promise<string[]> {
    return new Promise(r => setTimeout(() => r(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']), 100));
  }
  static async getCurrentDate(): Promise<string> {
    const now = new Date();
    const opts: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Promise(r => setTimeout(() => r(now.toLocaleDateString('en-US', opts)), 100));
  }
  static async getTimezone(): Promise<string> {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -(new Date().getTimezoneOffset());
    const sign = offset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    return new Promise(r => setTimeout(() => r(`UTC${sign}${hours}:${mins.toString().padStart(2, '0')} (${tz})`), 100));
  }
}
