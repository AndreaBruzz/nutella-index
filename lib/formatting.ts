/**
 * Shared formatting utilities for displaying data.
 * Extracted from pages to avoid duplication.
 */

export const formatPrice = (value: number): string => `${value.toFixed(2)} EUR`;

export const formatDate = (value: string | null, locale: string): string => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};
