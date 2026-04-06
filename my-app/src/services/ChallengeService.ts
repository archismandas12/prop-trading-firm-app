// src/services/ChallengeService.ts
// Backend-driven data layer for the "Configure Your Challenge" screen.
// All mock data mirrors the yopips.com web UI and will be replaced with real API calls.

// ─────────────────── INTERFACES ───────────────────

export interface ChallengePlan {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
}

export interface ChallengeModel {
  id: string;
  name: string;
  description: string;
}

export interface CurrencyOption {
  id: string;
  code: string;
  symbol: string;
}

export interface AccountSize {
  id: string;
  balance: number;
  price: number;
  currency: string;
}

export interface TradingPlatform {
  id: string;
  name: string;
  description?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
}

export interface ChallengeOrderSummary {
  planName: string;
  balance: string;
  basePrice: number;
  discount: number;
  total: number;
}

export interface PromoCodeResult {
  valid: boolean;
  discount: number;
  message: string;
}

export interface ChallengeConfig {
  planId: string;
  modelId: string;
  currency: string;
  accountSizeId: string;
  platformId: string;
  paymentMethodId: string;
  promoCode?: string;
}

// ─────────────────── MOCK DATA ───────────────────

const mockPlans: ChallengePlan[] = [
  { id: 'two-step', name: '2-Step Challenge', description: 'Standard two-phase evaluation', badge: 'Best Sellers', badgeColor: '#3B82F6' },
  { id: 'one-step', name: '1-Step Challenge', description: 'Prove your skills in a single phase', badge: 'Fastest', badgeColor: '#8B5CF6' },
  { id: 'instant', name: 'Instant Funding', description: 'Skip evaluation and start earning', badge: 'Fast', badgeColor: '#F59E0B' },
];

const mockModels: Record<string, ChallengeModel[]> = {
  'two-step': [
    { id: 'standard', name: 'Standard', description: 'Regular execution' },
    { id: 'swing', name: 'Swing', description: 'Overnight holding allowed' },
  ],
  'one-step': [
    { id: 'standard', name: 'Standard', description: 'Regular execution' },
    { id: 'swing', name: 'Swing', description: 'Overnight holding allowed' },
  ],
  'instant': [
    { id: 'standard', name: 'Standard', description: 'Regular execution' },
    { id: 'swing', name: 'Swing', description: 'Overnight holding allowed' },
  ],
};

const mockCurrencies: CurrencyOption[] = [
  { id: 'usd', code: 'USD', symbol: '$' },
  { id: 'eur', code: 'EUR', symbol: '€' },
  { id: 'gbp', code: 'GBP', symbol: '£' },
];

const mockAccountSizes: Record<string, AccountSize[]> = {
  'instant-usd': [
    { id: 'sz-2500', balance: 2500, price: 50, currency: 'USD' },
    { id: 'sz-5000', balance: 5000, price: 80, currency: 'USD' },
    { id: 'sz-10000', balance: 10000, price: 190, currency: 'USD' },
    { id: 'sz-25000', balance: 25000, price: 440, currency: 'USD' },
    { id: 'sz-50000', balance: 50000, price: 835, currency: 'USD' },
    { id: 'sz-100000', balance: 100000, price: 1630, currency: 'USD' },
  ],
  'instant-eur': [
    { id: 'sz-2500', balance: 2500, price: 45, currency: 'EUR' },
    { id: 'sz-5000', balance: 5000, price: 72, currency: 'EUR' },
    { id: 'sz-10000', balance: 10000, price: 170, currency: 'EUR' },
    { id: 'sz-25000', balance: 25000, price: 395, currency: 'EUR' },
    { id: 'sz-50000', balance: 50000, price: 750, currency: 'EUR' },
    { id: 'sz-100000', balance: 100000, price: 1465, currency: 'EUR' },
  ],
  'instant-gbp': [
    { id: 'sz-2500', balance: 2500, price: 40, currency: 'GBP' },
    { id: 'sz-5000', balance: 5000, price: 65, currency: 'GBP' },
    { id: 'sz-10000', balance: 10000, price: 155, currency: 'GBP' },
    { id: 'sz-25000', balance: 25000, price: 360, currency: 'GBP' },
    { id: 'sz-50000', balance: 50000, price: 680, currency: 'GBP' },
    { id: 'sz-100000', balance: 100000, price: 1330, currency: 'GBP' },
  ],
  'two-step-usd': [
    { id: 'sz-5000', balance: 5000, price: 35, currency: 'USD' },
    { id: 'sz-10000', balance: 10000, price: 69, currency: 'USD' },
    { id: 'sz-25000', balance: 25000, price: 149, currency: 'USD' },
    { id: 'sz-50000', balance: 50000, price: 249, currency: 'USD' },
    { id: 'sz-100000', balance: 100000, price: 449, currency: 'USD' },
    { id: 'sz-200000', balance: 200000, price: 849, currency: 'USD' },
  ],
  'one-step-usd': [
    { id: 'sz-5000', balance: 5000, price: 50, currency: 'USD' },
    { id: 'sz-10000', balance: 10000, price: 99, currency: 'USD' },
    { id: 'sz-25000', balance: 25000, price: 199, currency: 'USD' },
    { id: 'sz-50000', balance: 50000, price: 349, currency: 'USD' },
    { id: 'sz-100000', balance: 100000, price: 599, currency: 'USD' },
    { id: 'sz-200000', balance: 200000, price: 999, currency: 'USD' },
  ],
};

const mockPlatforms: TradingPlatform[] = [
  { id: 'mt5', name: 'MetaTrader 5', description: 'Industry standard trading platform' },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'crypto', name: 'Crypto (CoinPayments)', description: 'Bitcoin, Litecoin, USDT, etc.' },
  { id: 'card', name: 'Credit / Debit Card', description: 'Visa, Mastercard, Amex' },
  { id: 'bank', name: 'Bank Transfer', description: 'Direct wire transfer' },
];

// ─────────────────── SERVICE ───────────────────

export class ChallengeService {
  static async getPlans(): Promise<ChallengePlan[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockPlans), 400));
  }

  static async getModels(planId: string): Promise<ChallengeModel[]> {
    return new Promise(resolve =>
      setTimeout(() => resolve(mockModels[planId] || mockModels['two-step']), 300)
    );
  }

  static async getCurrencies(): Promise<CurrencyOption[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockCurrencies), 200));
  }

  static async getAccountSizes(planId: string, currency: string): Promise<AccountSize[]> {
    const key = `${planId}-${currency.toLowerCase()}`;
    const fallbackKey = `${planId}-usd`;
    return new Promise(resolve =>
      setTimeout(() => resolve(mockAccountSizes[key] || mockAccountSizes[fallbackKey] || mockAccountSizes['instant-usd']), 300)
    );
  }

  static async getPlatforms(): Promise<TradingPlatform[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockPlatforms), 200));
  }

  static async getPaymentMethods(): Promise<PaymentMethod[]> {
    return new Promise(resolve => setTimeout(() => resolve(mockPaymentMethods), 200));
  }

  static async applyPromoCode(code: string): Promise<PromoCodeResult> {
    return new Promise(resolve =>
      setTimeout(() => {
        if (code.toUpperCase() === 'YOPIPS10') {
          resolve({ valid: true, discount: 10, message: '10% discount applied!' });
        } else if (code.toUpperCase() === 'SAVE20') {
          resolve({ valid: true, discount: 20, message: '20% discount applied!' });
        } else {
          resolve({ valid: false, discount: 0, message: 'Invalid promo code' });
        }
      }, 500)
    );
  }

  static async submitOrder(config: ChallengeConfig): Promise<{ success: boolean; orderId: string }> {
    return new Promise(resolve =>
      setTimeout(() => resolve({ success: true, orderId: `YP-${Date.now()}` }), 1000)
    );
  }
}
