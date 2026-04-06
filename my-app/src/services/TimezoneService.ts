// src/services/TimezoneService.ts

export interface TimezoneOption {
  value: string;
  label: string;
}

export interface TimezoneData {
  area: string;
  currentTime: string;
  cetOffset: string;
  startHour: string;
  endHour: string;
}

export class TimezoneService {
  static getAvailableTimezones(): TimezoneOption[] {
    return [
      { value: 'auto', label: 'Autodetect (Local Time)' },
      { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
      { value: 'EST', label: 'EST (Eastern Standard Time)' },
      { value: 'PST', label: 'PST (Pacific Standard Time)' },
      { value: 'AEST', label: 'AEST (Australian Eastern Standard Time)' },
      { value: 'JST', label: 'JST (Japan Standard Time)' },
    ];
  }

  // Returns CET, Platform Time, and User Local Time (Mocked)
  static getTimezoneData(userTimezone: string = 'auto'): TimezoneData[] {
    const now = new Date();
    
    // Helper to format mock times
    const formatTime = (d: Date) => {
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      const s = d.getSeconds().toString().padStart(2, '0');
      return `${h}:${m}:${s}`;
    };

    // Calculate a mock CET time (UTC+1 assumed for demo)
    const cetTime = new Date(now);
    cetTime.setUTCHours(cetTime.getUTCHours() + 1);

    // Platform time (e.g., UTC+2/EET)
    const platformTime = new Date(now);
    platformTime.setUTCHours(platformTime.getUTCHours() + 2);

    return [
      {
        area: 'CET Time (Base)',
        currentTime: formatTime(cetTime),
        cetOffset: '-',
        startHour: '00:00:01',
        endHour: '23:59:59',
      },
      {
        area: 'Platform Time',
        currentTime: formatTime(platformTime),
        cetOffset: '+1 hr',
        startHour: '01:00:01',
        endHour: '00:59:59',
      },
      {
        area: 'Your Local Time',
        currentTime: formatTime(now),
        cetOffset: 'Auto', // Assuming auto or calculate offset manually
        startHour: '--:--:--',
        endHour: '--:--:--',
      }
    ];
  }

  // Calculates seconds until midnight CET
  static getSecondsUntilReset(): number {
    const now = new Date();
    // In a real app, this would be until CET midnight. Mocking it to end of current local day for demo.
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  }

  static formatCountdown(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
}
