import currencyCodes from 'currency-codes';
import type { CurrencyOption } from '@/types';

export function getCurrencyOptions(): CurrencyOption[] {
  return currencyCodes.data
    .filter((entry) => Boolean(entry.code) && entry.code.length === 3)
    .map((entry) => ({
      code: entry.code,
      name: entry.currency,
    }))
    .sort((a, b) => {
      if (a.code === 'EUR') return -1;
      if (b.code === 'EUR') return 1;
      return a.code.localeCompare(b.code, 'en-US');
    });
}

export function isValidCurrencyCode(value: string): boolean {
  const code = value.trim().toUpperCase();
  return currencyCodes.code(code) !== undefined;
}
