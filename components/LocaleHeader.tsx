'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import type { Locale, Messages } from '@/lib/i18n/config';

type LocaleHeaderProps = {
  locale: Locale;
  nav: Messages['nav'];
};

export default function LocaleHeader({ locale, nav }: LocaleHeaderProps) {
  const pathname = usePathname();
  const isMapPage = pathname.startsWith(`/${locale}/map`);

  if (isMapPage) {
    return (
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 py-4 md:px-8 md:py-4.5">
        <div className="pointer-events-auto mx-auto w-full max-w-6xl">
          <SiteHeader locale={locale} nav={nav} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-4 md:px-8 md:py-4.5">
      <SiteHeader locale={locale} nav={nav} />
    </div>
  );
}
