import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { nutellaService } from '@/services/nutellaService';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale } from '@/lib/i18n/config';
import type { RankingSort } from '@/types';
import type { Locale } from '@/lib/i18n/config';
import RankingSortTabs from '@/components/ranking/RankingSortTabs';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 1800;

const SORTS: RankingSort[] = ['expensive', 'cheap', 'recent'];

type RankingPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ sort?: string }>;
};

const formatPrice = (value: number) => `${value.toFixed(2)} EUR`;

const formatDate = (value: string | null, locale: string) => {
  if (!value) return 'N/A';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
};

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 21H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C8.68629 3 6 5.68629 6 9C6 11.0913 7.07066 12.9325 8.6929 14.0017C9.30522 14.4053 9.66667 15.063 9.66667 15.7963V16H14.3333V15.7963C14.3333 15.063 14.6948 14.4053 15.3071 14.0017C16.9293 12.9325 18 11.0913 18 9C18 5.68629 15.3137 3 12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C14.5 5.6 15.9 8.7 15.9 12C15.9 15.3 14.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C9.5 5.6 8.1 8.7 8.1 12C8.1 15.3 9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 6L10.2 4.5H13.8L15 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 12A8 8 0 1 1 17.3 6.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M20 4V8H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export async function generateMetadata({ params, searchParams }: RankingPageProps): Promise<Metadata> {
  const [{ locale: rawLocale }, query] = await Promise.all([params, searchParams]);

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const dict = await getDictionary(rawLocale);
  const rawSort = query?.sort;
  const sort = SORTS.includes(rawSort as RankingSort) ? (rawSort as RankingSort) : 'expensive';
  const label = dict.ranking.sortLabels[sort];
  const canonicalPath = sort === 'expensive' ? `/${rawLocale}/ranking` : `/${rawLocale}/ranking?sort=${sort}`;

  return {
    title: `${dict.ranking.metadata.titlePrefix} | ${label}`,
    description: dict.ranking.metadata.description,
    keywords: ['nutella index', 'nutella ranking', 'nutella price', 'average price 100g', 'country ranking'],
    alternates: {
      canonical: canonicalPath,
      languages: {
        it: sort === 'expensive' ? '/it/ranking' : `/it/ranking?sort=${sort}`,
        en: sort === 'expensive' ? '/en/ranking' : `/en/ranking?sort=${sort}`,
      },
    },
    openGraph: {
      title: `${dict.ranking.metadata.titlePrefix} | ${label}`,
      description: dict.ranking.metadata.ogDescription,
      type: 'website',
      url: new URL(canonicalPath, SITE_URL).toString(),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.ranking.metadata.titlePrefix} | ${label}`,
      description: dict.ranking.metadata.twitterDescription,
    },
  };
}

export default async function RankingPage({ params, searchParams }: RankingPageProps) {
  const [{ locale: rawLocale }, query] = await Promise.all([params, searchParams]);

  if (!hasLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);
  const rawSort = query?.sort;
  const sort: RankingSort = SORTS.includes(rawSort as RankingSort) ? (rawSort as RankingSort) : 'expensive';
  const rankings = await nutellaService.getCountryRankings(sort, locale);

  // Fetch all entries for each country
  const countriesWithEntries = await Promise.all(
    rankings.map(async (ranking) => ({
      ...ranking,
      entries: await nutellaService.getCountryEntries(ranking.location_iso, locale),
    }))
  );

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${dict.ranking.metadata.titlePrefix} - ${dict.ranking.sortLabels[sort]}`,
    itemListOrder:
      sort === 'cheap' ? 'https://schema.org/ItemListOrderAscending' : 'https://schema.org/ItemListOrderDescending',
    numberOfItems: rankings.length,
    itemListElement: rankings.map((row, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: row.location_name,
      description: `${dict.ranking.columns.average}: ${formatPrice(row.avg_price_per_100g_eur)}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.meta.siteTitle,
        item: new URL(`/${locale}/map`, SITE_URL).toString(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.ranking.heading,
        item: new URL(`/${locale}/ranking`, SITE_URL).toString(),
      },
    ],
  };

  return (
    <main className="bg-[var(--nutella-cocoa)] px-4 pb-10 pt-[6.25rem] text-[var(--nutella-cream)] md:px-8 md:pt-[8rem]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mx-auto max-w-none md:max-w-6xl">
        <section className="mb-5 rounded-2xl border border-[var(--nutella-gold)]/35 bg-[rgba(90,44,10,0.42)] p-4 md:p-5">
          <header>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{dict.ranking.heading}</h1>
            <p className="mt-2 text-base font-semibold text-[color:rgba(255,231,155,0.92)]">{dict.ranking.intro.question}</p>
            <p className="mt-2 text-sm text-[color:rgba(255,231,155,0.84)]">{dict.ranking.intro.paragraph1}</p>
            <p className="mt-2 text-sm text-[color:rgba(255,231,155,0.84)]">{dict.ranking.intro.paragraph2}</p>
          </header>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <BulbIcon />
              {dict.ranking.guide.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dict.ranking.guide.intro}</p>
            <ul className="mt-3 space-y-2 text-sm text-[color:rgba(255,239,200,0.9)]">
              <li><strong>{dict.ranking.guide.points.metricLabel}:</strong> {dict.ranking.guide.points.metricText}</li>
              <li><strong>{dict.ranking.guide.points.samplesLabel}:</strong> {dict.ranking.guide.points.samplesText}</li>
              <li><strong>{dict.ranking.guide.points.latestLabel}:</strong> {dict.ranking.guide.points.latestText}</li>
            </ul>
            <p className="mt-3 text-sm text-[color:rgba(255,239,200,0.9)]">{dict.ranking.guide.detailsIntro}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{dict.ranking.guide.detailsList.size}</li>
              <li>{dict.ranking.guide.detailsList.localPrice}</li>
              <li>{dict.ranking.guide.detailsList.eurValue}</li>
              <li>{dict.ranking.guide.detailsList.collectedDate}</li>
              <li>{dict.ranking.guide.detailsList.source}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <GlobeIcon />
              {dict.ranking.insights.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dict.ranking.insights.paragraph}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{dict.ranking.insights.premiumPoint}</li>
              <li>{dict.ranking.insights.affordablePoint}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <CameraIcon />
              {dict.ranking.inspiration.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dict.ranking.inspiration.paragraph1}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dict.ranking.inspiration.paragraph2}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <RefreshIcon />
              {dict.ranking.freshness.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dict.ranking.freshness.paragraph}</p>
            <p className="mt-3 text-sm font-semibold text-[color:rgba(255,231,155,0.96)]">{dict.ranking.freshness.cta}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{dict.ranking.sortLabels.expensive}</li>
              <li>{dict.ranking.sortLabels.cheap}</li>
              <li>{dict.ranking.sortLabels.recent}</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">
              {locale === 'it' ? (
                <>
                  Se vuoi capire come vengono normalizzati i valori, leggi le{' '}
                  <Link href={`/${locale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    informazioni sui dati
                  </Link>
                  {' '}oppure{' '}
                  <Link href={`/${locale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    contribuisci con un nuovo prezzo
                  </Link>
                  .
                </>
              ) : (
                <>
                  If you want to understand how values are normalized, read the{' '}
                  <Link href={`/${locale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    data information
                  </Link>
                  {' '}or{' '}
                  <Link href={`/${locale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    contribute a new price
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </section>

        <RankingSortTabs locale={locale} activeSort={sort} labels={dict.ranking.sortLabels} />


        <div className="space-y-4">
          {countriesWithEntries.map((country, index) => (
            <details
              key={country.location_iso}
              className="group rounded-2xl border border-[var(--nutella-gold)]/50 bg-[rgba(75,32,6,0.55)] overflow-hidden"
            >
              <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 hover:bg-[rgba(75,32,6,0.8)] transition-colors list-none marker:content-none">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="text-lg font-bold text-[var(--nutella-gold)]">{index + 1}.</span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold sm:text-lg">{country.location_name}</h3>
                    <p className="text-xs text-[color:rgba(255,231,155,0.7)]">{country.location_iso}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-[var(--nutella-red)]">{formatPrice(country.avg_price_per_100g_eur)}</p>
                    <p className="text-xs text-[color:rgba(255,231,155,0.7)]">{country.sample_count} {dict.ranking.columns.samples}</p>
                  </div>
                  <span className="text-lg text-[var(--nutella-gold)] transition-transform group-open:rotate-180">⌄</span>
                </div>
              </summary>

              <div className="border-t border-[var(--nutella-gold)]/25 bg-[rgba(75,32,6,0.35)] px-4 py-4">
                {country.entries.length === 0 ? (
                  <p className="text-sm text-[color:rgba(255,231,155,0.7)]">{dict.entries.noEntries}</p>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Mobile view */}
                    <div className="md:hidden space-y-2">
                      {country.entries.map((entry) => (
                        <div
                          key={entry.event_id}
                          className="rounded border border-[var(--nutella-gold)]/25 bg-[rgba(75,32,6,0.55)] p-3 text-xs space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-[var(--nutella-gold)]">{entry.weight_g}g</span>
                            <span className="font-semibold text-[var(--nutella-red)]">{formatPrice(entry.price_per_100g_eur)}</span>
                          </div>
                          <p className="text-[color:rgba(255,231,155,0.7)]">
                            {entry.local_price} {entry.local_currency}
                          </p>
                          <p className="text-[color:rgba(255,231,155,0.6)]">{formatDate(entry.collected_at, locale)}</p>
                          <p className="text-[color:rgba(255,231,155,0.6)]">{entry.data_provider}</p>
                        </div>
                      ))}
                    </div>

                    {/* Desktop view */}
                    <div className="hidden md:block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold uppercase tracking-wide text-[color:rgba(255,231,155,0.78)] border-b border-[var(--nutella-gold)]/25">
                            <th className="text-left py-2 px-3">{dict.ranking.details.entryTable.weight}</th>
                            <th className="text-left py-2 px-3">{dict.ranking.details.entryTable.localPrice}</th>
                            <th className="text-left py-2 px-3">{dict.ranking.details.entryTable.eurPrice}</th>
                            <th className="text-left py-2 px-3">{dict.ranking.details.entryTable.collectedAt}</th>
                            <th className="text-left py-2 px-3">{dict.ranking.details.entryTable.provider}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--nutella-gold)]/15">
                          {country.entries.map((entry) => (
                            <tr key={entry.event_id} className="hover:bg-[rgba(75,32,6,0.8)] transition-colors">
                              <td className="py-2 px-3 font-semibold text-[var(--nutella-gold)]">{entry.weight_g}g</td>
                              <td className="py-2 px-3 text-xs">
                                <div className="font-medium text-[color:rgba(255,231,155,0.88)]">{entry.local_price}</div>
                                <div className="text-[color:rgba(255,231,155,0.7)]">{entry.local_currency}</div>
                              </td>
                              <td className="py-2 px-3 font-semibold text-[var(--nutella-red)]">
                                {formatPrice(entry.price_per_100g_eur)}
                              </td>
                              <td className="py-2 px-3 text-xs text-[color:rgba(255,231,155,0.84)]">
                                {formatDate(entry.collected_at, locale)}
                              </td>
                              <td className="py-2 px-3 text-xs text-[color:rgba(255,231,155,0.7)]">
                                {entry.data_provider}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </main>
  );
}
