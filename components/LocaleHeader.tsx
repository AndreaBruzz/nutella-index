'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import type { Locale, Messages } from '@/lib/i18n/config';
import { PAGE_CONTAINER_CLASS, PAGE_HORIZONTAL_PADDING_CLASS } from '@/lib/layout';

type LocaleHeaderProps = {
  locale: Locale;
  nav: Messages['nav'];
};

export default function LocaleHeader({ locale, nav }: LocaleHeaderProps) {
  const pathname = usePathname();
  const isMapPage = pathname.startsWith(`/${locale}/map`);

  if (isMapPage) {
    return (
      <div className={`pointer-events-none fixed inset-x-0 top-0 z-50 ${PAGE_HORIZONTAL_PADDING_CLASS} py-3 md:py-4`}>
        <div className={`pointer-events-auto ${PAGE_CONTAINER_CLASS}`}>
          <SiteHeader locale={locale} nav={nav} transparent={true} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${PAGE_HORIZONTAL_PADDING_CLASS} py-3 md:py-4`}>
      <div className={PAGE_CONTAINER_CLASS}>
        <SiteHeader locale={locale} nav={nav} />
      </div>
    </div>
  );
}
