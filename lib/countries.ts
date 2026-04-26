import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import itLocale from 'i18n-iso-countries/langs/it.json';
import type { CountryOption } from '@/types';
import type { Locale } from '@/lib/i18n/config';

let localesRegistered = false;

function ensureLocales() {
  if (localesRegistered) return;
  countries.registerLocale(enLocale);
  countries.registerLocale(itLocale);
  localesRegistered = true;
}

export function getCountryOptions(locale: Locale): CountryOption[] {
  ensureLocales();

  const names = countries.getNames(locale, { select: 'official' }) as Record<string, string>;

  return Object.entries(names)
    .map(([iso_code, name]) => ({ iso_code, name }))
    .sort((a, b) => a.name.localeCompare(b.name, locale === 'it' ? 'it-IT' : 'en-US'));
}

export function getCountryNameFromIso(isoCode: string, locale: Locale = 'en'): string | null {
  ensureLocales();
  const normalized = isoCode.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) return null;

  return countries.getName(normalized, locale, { select: 'official' }) || null;
}

export function isValidIsoCountry(isoCode: string): boolean {
  return getCountryNameFromIso(isoCode, 'en') !== null;
}
