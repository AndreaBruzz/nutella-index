'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { logClientAnalytics } from '@/lib/analyticsClient';
import { hasLocale, type Locale } from '@/lib/i18n/config';

type LanguageSelectorProps = {
  locale: Locale;
  isCompact?: boolean;
  isLandingPage?: boolean;
};

function buildLocalizedHref(pathname: string, locale: Locale, searchParams: URLSearchParams): string {
  const segments = pathname.split('/').filter(Boolean);
  const cleanSegments = hasLocale(segments[0] ?? '') ? segments.slice(1) : segments;
  const basePath = `/${[locale, ...cleanSegments].join('/')}`;
  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function buildLandingPageHref(locale: Locale): string {
  return `/${locale}`;
}

export default function LanguageSelector({ locale, isCompact = false, isLandingPage = false }: LanguageSelectorProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const itHref = isLandingPage ? buildLandingPageHref('it') : buildLocalizedHref(pathname, 'it', searchParams);
  const enHref = isLandingPage ? buildLandingPageHref('en') : buildLocalizedHref(pathname, 'en', searchParams);

  if (isCompact) {
    // Slider/toggle style for header
    return (
      <div className="inline-flex rounded-full border border-[var(--nutella-gold)]/55 bg-[rgba(75,32,6,0.5)] p-0.5 backdrop-blur-sm md:p-1">
        <Link
          href={itHref}
          onClick={() => {
            if (locale !== 'it') {
              void logClientAnalytics({
                eventName: 'language_switch',
                route: pathname,
                reason: 'to_it',
              });
            }
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-all md:px-4 md:py-2 md:text-sm ${
            locale === 'it'
              ? 'bg-[var(--nutella-gold)] text-[var(--nutella-cocoa)] shadow-[0_4px_12px_rgba(250,179,11,0.25)]'
              : 'text-[color:rgba(255,231,155,0.75)] hover:text-[var(--nutella-cream)]'
          }`}
        >
          IT
        </Link>
        <Link
          href={enHref}
          onClick={() => {
            if (locale !== 'en') {
              void logClientAnalytics({
                eventName: 'language_switch',
                route: pathname,
                reason: 'to_en',
              });
            }
          }}
          className={`rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest transition-all md:px-4 md:py-2 md:text-sm ${
            locale === 'en'
              ? 'bg-[var(--nutella-gold)] text-[var(--nutella-cocoa)] shadow-[0_4px_12px_rgba(250,179,11,0.25)]'
              : 'text-[color:rgba(255,231,155,0.75)] hover:text-[var(--nutella-cream)]'
          }`}
        >
          EN
        </Link>
      </div>
    );
  }

  // Full-width buttons for landing page
  return (
    <div className="flex w-full gap-3 sm:gap-4">
      <Link
        href={itHref}
        onClick={() => {
          if (locale !== 'it') {
            void logClientAnalytics({
              eventName: 'language_switch',
              route: pathname,
              reason: 'to_it',
            });
          }
        }}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-all sm:px-5 sm:py-3 ${
          locale === 'it'
            ? 'border-[var(--nutella-gold)]/70 bg-[rgba(250,179,11,0.22)] text-[var(--nutella-cream)]'
            : 'border-[var(--nutella-gold)]/35 bg-[rgba(75,32,6,0.35)] text-[color:rgba(255,231,155,0.85)] hover:-translate-y-0.5 hover:border-[var(--nutella-gold)]/55 hover:bg-[rgba(99,42,10,0.55)]'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 3C14.5 5.6 15.9 8.7 15.9 12C15.9 15.3 14.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 3C9.5 5.6 8.1 8.7 8.1 12C8.1 15.3 9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold uppercase tracking-wide sm:text-base">Italiano</span>
      </Link>
      <Link
        href={enHref}
        onClick={() => {
          if (locale !== 'en') {
            void logClientAnalytics({
              eventName: 'language_switch',
              route: pathname,
              reason: 'to_en',
            });
          }
        }}
        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-all sm:px-5 sm:py-3 ${
          locale === 'en'
            ? 'border-[var(--nutella-gold)]/70 bg-[rgba(250,179,11,0.22)] text-[var(--nutella-cream)]'
            : 'border-[var(--nutella-gold)]/35 bg-[rgba(75,32,6,0.35)] text-[color:rgba(255,231,155,0.85)] hover:-translate-y-0.5 hover:border-[var(--nutella-gold)]/55 hover:bg-[rgba(99,42,10,0.55)]'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 3C14.5 5.6 15.9 8.7 15.9 12C15.9 15.3 14.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 3C9.5 5.6 8.1 8.7 8.1 12C8.1 15.3 9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="text-sm font-semibold uppercase tracking-wide sm:text-base">English</span>
      </Link>
    </div>
  );
}
