import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { nutellaService } from '@/services/nutellaService';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { getCountryNameFromIso } from '@/lib/countries';
import { hasLocale } from '@/lib/i18n/config';
import type { Locale } from '@/lib/i18n/config';
import { createLocalizedMetadata } from '@/lib/seo';
import { formatPrice, formatDate } from '@/lib/formatting';

export const revalidate = 1800;

type CountryEntriesPageProps = {
  params: Promise<{ locale: string; iso: string }>;
};


export async function generateMetadata({ params }: CountryEntriesPageProps): Promise<Metadata> {
  const { locale: rawLocale, iso } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const dict = await getDictionary(rawLocale);
  const countryName = getCountryNameFromIso(iso, rawLocale as Locale) ?? iso;

  return createLocalizedMetadata({
    locale: rawLocale as Locale,
    path: `/ranking/${iso}`,
    title: `${dict.entries.heading} ${countryName}`,
    description: `Detailed entries for Nutella prices from ${countryName}`,
  });
}

export default async function CountryEntriesPage({ params }: CountryEntriesPageProps) {
  const { locale: rawLocale, iso } = await params;

  if (!hasLocale(rawLocale)) {
    notFound();
  }

  const dict = await getDictionary(rawLocale);
  const entries = await nutellaService.getCountryEntries(iso, rawLocale as Locale);

  if (entries.length === 0) {
    notFound();
  }

  const countryName = entries[0]?.location_name || getCountryNameFromIso(iso, rawLocale as Locale) || iso;

  return (
    <main className="bg-[var(--nutella-cocoa)] px-4 pb-10 pt-4 text-[var(--nutella-cream)] md:px-8 md:pt-6">
      <div className="mx-auto max-w-none md:max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {dict.entries.heading} {countryName}
            </h1>
            <p className="mt-2 text-sm text-[color:rgba(255,231,155,0.84)]">
              {entries.length} {dict.entries.totalEntries}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/${rawLocale}/ranking`}
              className="rounded-lg border border-[var(--nutella-gold)]/60 px-3 py-2 text-sm hover:bg-[rgba(250,179,11,0.12)]"
            >
              {dict.entries.backToRanking}
            </Link>
          </div>
        </header>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-[var(--nutella-gold)]/40 bg-[rgba(75,32,6,0.45)] p-6 text-center">
            <p className="text-[color:rgba(255,231,155,0.88)]">{dict.entries.noEntries}</p>
          </div>
        ) : (
          <section
            aria-labelledby="entries-table-title"
            className="overflow-hidden rounded-2xl border border-[var(--nutella-gold)]/50 bg-[rgba(75,32,6,0.55)]"
          >
            <h2 id="entries-table-title" className="sr-only">
              {dict.entries.heading} {countryName}
            </h2>

            {/* Mobile view */}
            <div className="md:hidden divide-y divide-[var(--nutella-gold)]/15">
              {entries.map((entry) => (
                <article
                  key={entry.event_id}
                  className="space-y-2 border-b border-[var(--nutella-gold)]/15 px-4 py-3 text-sm hover:bg-[rgba(75,32,6,0.8)]"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-[var(--nutella-gold)]">{entry.weight_g}g</span>
                    <span className="font-semibold text-[var(--nutella-red)]">{formatPrice(entry.price_per_100g_eur)}</span>
                  </div>
                  <div className="text-xs text-[color:rgba(255,231,155,0.7)]">
                    <p>{entry.local_price} {entry.local_currency}</p>
                    <p>{formatDate(entry.collected_at, rawLocale)}</p>
                    <p>{entry.data_provider}</p>
                  </div>
                </article>
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden md:block">
              <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] gap-3 border-b border-[var(--nutella-gold)]/35 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[color:rgba(255,231,155,0.78)]">
                <span>{dict.entries.heading} {dict.ranking.details.entryTable.weight}</span>
                <span>{dict.ranking.details.entryTable.localPrice}</span>
                <span>{dict.ranking.details.entryTable.eurPrice}</span>
                <span>{dict.ranking.details.entryTable.collectedAt}</span>
                <span>{dict.ranking.details.entryTable.provider}</span>
              </div>

              <div className="divide-y divide-[var(--nutella-gold)]/15">
                {entries.map((entry) => (
                  <article
                    key={entry.event_id}
                    className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr] gap-3 px-4 py-3 text-sm hover:bg-[rgba(75,32,6,0.8)]"
                  >
                    <span className="font-semibold text-[var(--nutella-gold)]">{entry.weight_g}g</span>
                    <div className="text-xs text-[color:rgba(255,231,155,0.88)]">
                      <p className="font-medium">{entry.local_price}</p>
                      <p className="text-[color:rgba(255,231,155,0.7)]">{entry.local_currency}</p>
                    </div>
                    <span className="font-semibold text-[var(--nutella-red)]">{formatPrice(entry.price_per_100g_eur)}</span>
                    <span className="text-xs text-[color:rgba(255,231,155,0.84)]">
                      {formatDate(entry.collected_at, rawLocale)}
                    </span>
                    <span className="text-xs text-[color:rgba(255,231,155,0.7)]">{entry.data_provider}</span>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
