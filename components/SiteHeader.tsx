'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import type { Locale, Messages } from '@/lib/i18n/config';

type SiteHeaderProps = {
  locale: Locale;
  nav: Messages['nav'];
  transparent?: boolean;
};

function RankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9497 17.9497L15 13H22C22 14.933 21.2165 16.683 19.9497 17.9497Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 10C20 6.13401 16.866 3 13 3V10H20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12C2 16.4183 5.58172 20 10 20C12.2091 20 14.2091 19.1046 15.6569 17.6569L10 12V4C5.58172 4 2 7.58172 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SubmitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 8.5L12 5L15.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="14" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 17V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill="currentColor" />
      <path d="M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function WorldMapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C14.5 5.6 15.9 8.7 15.9 12C15.9 15.3 14.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C9.5 5.6 8.1 8.7 8.1 12C8.1 15.3 9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function SiteHeader({ locale, nav, transparent = false }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const languageLabel = locale === 'it' ? 'Lingua' : 'Language';
  const isLandingPage = pathname === `/${locale}`;

  const isOnMap = pathname.startsWith(`/${locale}/map`);
  const isOnRanking = pathname.startsWith(`/${locale}/ranking`);
  const isOnSubmit = pathname.startsWith(`/${locale}/submit`);
  const isOnInfo = pathname.startsWith(`/${locale}/info`) || pathname.startsWith(`/${locale}/about`);

  const navItems = [
    {
      href: `/${locale}/map`,
      label: nav.links.worldMap,
      Icon: WorldMapIcon,
      hidden: !isLandingPage && isOnMap,
    },
    {
      href: `/${locale}/ranking`,
      label: nav.links.ranking,
      Icon: RankIcon,
      hidden: !isLandingPage && isOnRanking,
    },
    {
      href: `/${locale}/submit`,
      label: nav.links.submit,
      Icon: SubmitIcon,
      hidden: !isLandingPage && isOnSubmit,
    },
    {
      href: `/${locale}/info`,
      label: nav.links.info,
      Icon: InfoIcon,
      hidden: !isLandingPage && isOnInfo,
    },
  ].filter((item) => !item.hidden);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((current) => !current);
  };

  const headerClassName = [
    'w-full rounded-2xl border border-[var(--nutella-gold)]/55 px-3 py-2 md:rounded-[1.35rem] md:px-6.5 md:py-3.25',
    transparent
      ? 'bg-transparent shadow-none backdrop-blur-0'
      : 'bg-[rgba(46,10,0,0.05)] shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur-lg md:shadow-[0_15px_40px_rgba(0,0,0,0.05)]',
  ].join(' ');

  return (
    <header className={headerClassName}>
      <div className="md:hidden" ref={menuRef}>
        <div className="flex items-center gap-2.5">
          <Link href={`/${locale}`} onClick={closeMobileMenu} className="min-w-0 flex-1 rounded-xl px-1 py-0.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nutella-gold)]/80">
            <span className="block truncate text-[1.05rem] font-extrabold tracking-tight text-[var(--nutella-cream)] sm:text-lg">{nav.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-header-menu"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--nutella-gold)]/65 bg-[rgba(250,179,11,0.2)] text-[var(--nutella-cream)] shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[rgba(250,179,11,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nutella-gold)]"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav id="mobile-header-menu" className="mt-3 flex flex-col gap-2 border-t border-[var(--nutella-gold)]/35 pt-3 items-center">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:rgba(255,231,155,0.68)]">Navigation</p>
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeMobileMenu} className="group flex min-h-15 items-center gap-3 rounded-xl bg-[rgba(75,32,6,0.34)] px-3.5 py-3.5 text-[1rem] font-semibold text-[var(--nutella-cream)] transition-all hover:bg-[rgba(250,179,11,0.12)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(250,179,11,0.14)] text-[var(--nutella-gold)] transition-colors group-hover:bg-[rgba(250,179,11,0.22)]">
                    <item.Icon />
                  </span>
                  <span className="truncate">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="mt-1 flex items-center justify-between border-t border-[var(--nutella-gold)]/25 px-1 pt-3 w-full max-w-xs">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:rgba(255,231,155,0.68)]">{languageLabel}</span>
              <LanguageSelector locale={locale} isCompact={true} />
            </div>
          </nav>
        )}
      </div>

      <div className="hidden items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--nutella-cream)] md:text-[2.15rem]">
            <Link href={`/${locale}`} className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nutella-gold)]">
              {nav.title}
            </Link>
          </h1>
        </div>

        <nav className="justify-self-center flex flex-wrap items-center gap-2 md:gap-2.25">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-[var(--nutella-cream)] transition-colors hover:bg-[rgba(250,179,11,0.15)] hover:text-[var(--nutella-gold)] md:gap-2.25 md:rounded-[0.7rem] md:px-3.25 md:py-2.25 md:text-[1.08rem]">
              <item.Icon />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="justify-self-end">
          <LanguageSelector locale={locale} isCompact={true} />
        </div>
      </div>
    </header>
  );
}
