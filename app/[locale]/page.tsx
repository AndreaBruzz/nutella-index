import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { PAGE_CONTAINER_CLASS, PAGE_HORIZONTAL_PADDING_CLASS } from '@/lib/layout';

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 text-[var(--nutella-gold)]" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C14.5 5.6 15.9 8.7 15.9 12C15.9 15.3 14.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C9.5 5.6 8.1 8.7 8.1 12C8.1 15.3 9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function RankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 text-[var(--nutella-gold)]" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.9497 17.9497L15 13H22C22 14.933 21.2165 16.683 19.9497 17.9497Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 10C20 6.13401 16.866 3 13 3V10H20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12C2 16.4183 5.58172 20 10 20C12.2091 20 14.2091 19.1046 15.6569 17.6569L10 12V4C5.58172 4 2 7.58172 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 text-[var(--nutella-gold)]" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="5" width="16" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 14H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

function SubmitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6 text-[var(--nutella-gold)]" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.5 8.5L12 5L15.5 8.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="14" width="16" height="6" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return {
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.siteOgDescription,
      url: `https://nutella-index.vercel.app/${locale}`,
      type: 'website',
      images: [
        {
          url: 'https://nutella-index.vercel.app/og-image.jpg',
          width: 1200,
          height: 630,
          alt: dict.meta.siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.siteTitle,
      description: dict.meta.siteOgDescription,
      images: ['https://nutella-index.vercel.app/og-image.jpg'],
    },
  };
}

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `https://nutella-index.vercel.app/${locale}#webpage`,
    url: `https://nutella-index.vercel.app/${locale}`,
    name: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    isPartOf: {
      '@id': 'https://nutella-index.vercel.app/#website',
    },
    inLanguage: locale,
  };

  return (
    <main className={`flex-1 bg-[var(--nutella-cocoa)] ${PAGE_HORIZONTAL_PADDING_CLASS} pb-10 pt-4 text-[var(--nutella-cream)] md:pt-6`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />

      <div className={`${PAGE_CONTAINER_CLASS} space-y-6`}>
        <section className="rounded-2xl border border-[var(--nutella-gold)]/50 bg-[rgba(75,32,6,0.6)] p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[color:rgba(255,231,155,0.86)]">
            Global Nutella Price Index
          </p>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            {locale === 'it'
              ? 'Scopri come cambiano i prezzi della Nutella nel mondo.'
              : 'Discover how Nutella prices change around the world.'}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[color:rgba(255,239,200,0.92)] sm:text-base">
            {locale === 'it'
              ? 'Nutella Index è un progetto che monitora i prezzi della Nutella in tempo reale da paesi di tutto il mondo. Che tu sia un data enthusiast, un viaggiatore curioso o semplicemente un amante di Nutella, qui puoi esplorare dati affascinanti, scoprire i prezzi più bassi e contribuire ai nostri dati.'
              : 'Nutella Index is a project that monitors Nutella prices in real time across countries worldwide. Whether you\'re a data enthusiast, a curious traveler, or simply a Nutella lover, here you can explore fascinating data, discover the best prices, and contribute to our dataset.'}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">
            {locale === 'it' ? 'Cosa puoi fare' : 'What you can do'}
          </h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href={`/${locale}/map`}
              className="group flex min-h-32 items-center gap-4 rounded-xl border border-[var(--nutella-gold)]/35 bg-[rgba(75,32,6,0.4)] p-4 transition-all hover:border-[var(--nutella-gold)]/50 hover:bg-[rgba(75,32,6,0.55)] sm:gap-5 sm:p-5"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[rgba(250,179,11,0.1)] text-[var(--nutella-gold)] transition-colors group-hover:bg-[rgba(250,179,11,0.18)]">
                <MapIcon />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--nutella-cream)]">{dict.nav.links.worldMap}</h3>
                <p className="text-xs text-[color:rgba(255,231,155,0.72)]">
                  {locale === 'it' ? 'Esplora i prezzi su mappa interattiva' : 'Explore prices on interactive map'}
                </p>
              </div>
            </Link>

            <Link
              href={`/${locale}/ranking`}
              className="group flex min-h-32 items-center gap-4 rounded-xl border border-[var(--nutella-gold)]/40 bg-[rgba(75,32,6,0.3)] p-4 transition-all hover:border-[var(--nutella-gold)]/60 hover:bg-[rgba(75,32,6,0.5)] sm:gap-5 sm:p-5"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[rgba(250,179,11,0.1)] text-[var(--nutella-gold)] transition-colors group-hover:bg-[rgba(250,179,11,0.18)]">
                <RankIcon />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--nutella-cream)]">{dict.nav.links.ranking}</h3>
                <p className="text-xs text-[color:rgba(255,231,155,0.72)]">
                  {locale === 'it' ? 'Classifica globale EUR/100g' : 'Global ranking by EUR/100g'}
                </p>
              </div>
            </Link>

            <Link
              href={`/${locale}/info/docs`}
              className="group flex min-h-32 items-center gap-4 rounded-xl border border-[var(--nutella-gold)]/40 bg-[rgba(75,32,6,0.3)] p-4 transition-all hover:border-[var(--nutella-gold)]/60 hover:bg-[rgba(75,32,6,0.5)] sm:gap-5 sm:p-5"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[rgba(250,179,11,0.1)] text-[var(--nutella-gold)] transition-colors group-hover:bg-[rgba(250,179,11,0.18)]">
                <DataIcon />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--nutella-cream)]">{locale === 'it' ? 'Guida' : 'Guide'}</h3>
                <p className="text-xs text-[color:rgba(255,231,155,0.72)]">
                  {locale === 'it' ? 'Leggi la documentazione' : 'Read the documentation'}
                </p>
              </div>
            </Link>

            <Link
              href={`/${locale}/submit`}
              className="group flex min-h-32 items-center gap-4 rounded-xl border border-[var(--nutella-gold)]/40 bg-[rgba(75,32,6,0.3)] p-4 transition-all hover:border-[var(--nutella-gold)]/60 hover:bg-[rgba(75,32,6,0.5)] sm:gap-5 sm:p-5"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-[rgba(250,179,11,0.1)] text-[var(--nutella-gold)] transition-colors group-hover:bg-[rgba(250,179,11,0.18)]">
                <SubmitIcon />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-[var(--nutella-cream)]">{dict.nav.links.submit}</h3>
                <p className="text-xs text-[color:rgba(255,231,155,0.72)]">
                  {locale === 'it' ? 'Condividi una nuova scoperta' : 'Share a new finding'}
                </p>
              </div>
            </Link>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">
            {locale === 'it' ? 'Scegli la tua lingua' : 'Choose your language'}
          </h2>
          <LanguageSelector locale={locale} isLandingPage={true} />
        </section>
      </div>
    </main>
  );
}
