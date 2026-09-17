import { Currency } from '../types';

// Baseline transparent conversion rates (as of current reference period)
// Base currency reference: 1 EUR
export const EXCHANGE_RATES: Record<Currency, Record<Currency, number>> = {
  EUR: {
    EUR: 1,
    USD: 1.08,
    AOA: 985.50,
    BRL: 6.10,
  },
  USD: {
    USD: 1,
    EUR: 1 / 1.08, // approx 0.9259
    AOA: 985.50 / 1.08, // approx 912.50
    BRL: 6.10 / 1.08, // approx 5.648
  },
  AOA: {
    AOA: 1,
    USD: 1.08 / 985.50, // approx 0.001096
    EUR: 1 / 985.50, // approx 0.001015
    BRL: 6.10 / 985.50, // approx 0.00619
  },
  BRL: {
    BRL: 1,
    USD: 1.08 / 6.10, // approx 0.1770
    EUR: 1 / 6.10, // approx 0.1639
    AOA: 985.50 / 6.10, // approx 161.557
  },
};

export const EXCHANGE_LAST_UPDATED = '06/09/2026 12:00 UTC';

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): { convertedAmount: number; rate: number } {
  if (from === to) {
    return { convertedAmount: amount, rate: 1 };
  }
  const rate = EXCHANGE_RATES[from][to];
  const convertedAmount = amount * rate;
  return {
    convertedAmount: Math.round(convertedAmount * 100) / 100,
    rate,
  };
}

export function formatCurrency(
  amount: number,
  currency: Currency,
  showCode: boolean = false
): string {
  if (currency === 'AOA') {
    const formatted = new Intl.NumberFormat('pt-AO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
    return showCode ? `${formatted} Kz (AOA)` : `${formatted} Kz`;
  }

  if (currency === 'EUR') {
    const formatted = new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
    return showCode ? `${formatted} (EUR)` : formatted;
  }

  if (currency === 'USD') {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
    return showCode ? `${formatted} (USD)` : formatted;
  }

  if (currency === 'BRL') {
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(amount);
    return showCode ? `${formatted} (BRL)` : formatted;
  }

  return `${amount} ${currency}`;
}
