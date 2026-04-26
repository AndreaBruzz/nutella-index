import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import { createLocalizedMetadata } from '@/lib/seo';

type InfoPageProps = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = 'https://nutella-index.vercel.app';

export async function generateMetadata({ params }: InfoPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: '/info',
    title: dict.info.heading,
    description:
      locale === 'it'
        ? 'Panoramica delle sezioni informative del progetto: chi siamo, dati e termini legali.'
        : 'Overview of the project info hub, including about, data, and legal pages.',
  });
}

function AboutIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10 text-[var(--nutella-gold)] sm:h-12 sm:w-12 md:h-14 md:w-14" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 20C5 16.8 7.8 14.2 12 14.2C16.2 14.2 19 16.8 19 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M3 12V8.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M21 12V8.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10 text-[var(--nutella-gold)] sm:h-12 sm:w-12 md:h-14 md:w-14" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 14H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function LegalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10 text-[var(--nutella-gold)] sm:h-12 sm:w-12 md:h-14 md:w-14" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L18 6.4V11.6C18 15.4 15.6 18.8 12 20C8.4 18.8 6 15.4 6 11.6V6.4L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.4 12L11.2 13.8L14.8 10.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DocsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-10 w-10 text-[var(--nutella-gold)] sm:h-12 sm:w-12 md:h-14 md:w-14" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4.8H14.8L18 8V19.2C18 20 17.3 20.8 16.4 20.8H7.6C6.7 20.8 6 20 6 19.2V6.4C6 5.6 6.7 4.8 7.6 4.8H7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14.8 4.8V8H18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 11.2H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 14.4H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 17.6H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default async function InfoPage({ params }: InfoPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const dict = await getDictionary(rawLocale);
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.meta.siteTitle,
        item: `${SITE_URL}/${rawLocale}/map`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.info.heading,
        item: `${SITE_URL}/${rawLocale}/info`,
      },
    ],
  };

  const links = [
    { href: `/${rawLocale}/about`, label: dict.info.links.aboutUs, Icon: AboutIcon },
    { href: `/${rawLocale}/info/data-info`, label: dict.info.links.dataInfo, Icon: DataIcon },
    { href: `/${rawLocale}/info/terms-and-ip`, label: dict.info.links.termsIp, Icon: LegalIcon },
    { href: `/${rawLocale}/info/docs`, label: dict.info.links.docs, Icon: DocsIcon },
  ];

  return (
    <main className="bg-[var(--nutella-cocoa)] px-4 pb-10 pt-4 text-[var(--nutella-cream)] md:px-8 md:pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mx-auto max-w-none md:max-w-4xl rounded-2xl border border-[var(--nutella-gold)]/60 bg-[rgba(75,32,6,0.7)] p-4 sm:p-6">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{dict.info.heading}</h1>
        <p className="mt-3 text-sm text-[color:rgba(255,231,155,0.85)]">{dict.info.intro}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group aspect-square rounded-xl border border-[var(--nutella-gold)]/40 bg-[linear-gradient(155deg,rgba(99,42,10,0.55),rgba(62,22,3,0.55))] p-3 sm:p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--nutella-gold)]/70 hover:bg-[linear-gradient(155deg,rgba(122,53,12,0.6),rgba(72,26,4,0.6))]"
            >
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center sm:gap-4">
                <item.Icon />
                <p className="text-sm font-bold leading-tight tracking-tight text-[var(--nutella-cream)] sm:text-base">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
