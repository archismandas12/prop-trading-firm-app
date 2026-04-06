// src/services/CertificateService.ts

export interface Certificate {
  id: string;
  status: 'PASSED' | 'IN_PROGRESS' | 'NOT_STARTED';
  title: string;
  userName: string;
  typeTitle: string;
  subType: string;
  dateReceived: string;
  rewardSize: string;
  isEarned: boolean;
}

const mockCertificates: Certificate[] = [
  {
    id: 'cert-1',
    status: 'PASSED',
    title: 'YOPIPS PHASE 1',
    userName: 'Siddhartha Test',
    typeTitle: 'Phase 1 Passed - Siddhartha Test',
    subType: 'Phase 1 Certificate',
    dateReceived: '2 Feb 2026',
    rewardSize: '$2000.00',
    isEarned: true,
  },
];

export class CertificateService {
  static async getCertificates(): Promise<Certificate[]> {
    return new Promise(r => setTimeout(() => r(mockCertificates), 400));
  }
}
