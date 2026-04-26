import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import LocaleHeader from '@/components/LocaleHeader';
import SiteFooter from '@/components/SiteFooter';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, LOCALES, type Locale } from '@/lib/i18n/config';

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const dict = await getDictionary(rawLocale);

  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteOgDescription,
      type: 'website',
      siteName: dict.meta.siteTitle,
    },
    alternates: {
      languages: {
        it: '/it',
        en: '/en',
        'x-default': '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense>
        <LocaleHeader locale={locale} nav={dict.nav} />
      </Suspense>

      <div className="min-h-0 flex-1">{children}</div>

      <SiteFooter locale={locale} nav={dict.nav} footer={dict.common.footer} />
    </div>
  );
}
