import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import { createLocalizedMetadata } from '@/lib/seo';

type DocsPageProps = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = 'https://nutella-index.vercel.app';

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: '/info/docs',
    title:
      locale === 'it'
        ? 'Guida - Come usare Nutella Index'
        : 'Guide - How to use Nutella Index',
    description:
      locale === 'it'
        ? 'Scopri come navigare la mappa interattiva, leggere le classifiche globali e contribuire con i tuoi dati di Nutella.'
        : 'Learn how to navigate the interactive map, read global rankings, and contribute your Nutella price data.',
  });
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 12H21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C14.5 5.6 15.9 8.7 15.9 12C15.9 15.3 14.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 3C9.5 5.6 8.1 8.7 8.1 12C8.1 15.3 9.5 18.4 12 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

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

function LightbulbIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18H9.01M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 6V12L15.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: dict.meta.siteTitle,
        item: `${SITE_URL}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: dict.info.heading,
        item: `${SITE_URL}/${locale}/info`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: locale === 'it' ? 'Guida' : 'Guide',
        item: `${SITE_URL}/${locale}/info/docs`,
      },
    ],
  };

  return (
    <main className="bg-[var(--nutella-cocoa)] px-4 pb-10 pt-4 text-[var(--nutella-cream)] md:px-8 md:pt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="mx-auto max-w-none md:max-w-4xl">
        <section className="mb-6 rounded-2xl border border-[var(--nutella-gold)]/35 bg-[rgba(90,44,10,0.42)] p-4 md:p-5">
          <header>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {locale === 'it' ? 'Guida di Nutella Index' : 'Nutella Index Guide'}
            </h1>
            <p className="mt-3 text-sm text-[color:rgba(255,231,155,0.88)]">
                {locale === 'it' ? (
                  <>
                    Scopri come navigare la{' '}
                    <Link href={`/${locale}/map`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                      mappa interattiva
                    </Link>
                    , leggere la{' '}
                    <Link href={`/${locale}/ranking`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                      classifica globale
                    </Link>
                    {' '}e contribuire con i{' '}
                    <Link href={`/${locale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                      tuoi dati
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Learn how to navigate the{' '}
                    <Link href={`/${locale}/map`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                      interactive map
                    </Link>
                    , read the{' '}
                    <Link href={`/${locale}/ranking`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                      global ranking
                    </Link>
                    , and contribute your{' '}
                    <Link href={`/${locale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                      Nutella price data
                    </Link>
                    .
                  </>
                )}
            </p>
          </header>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <MapIcon />
              {locale === 'it' ? 'Mappa Interattiva' : 'Interactive Map'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">
              {locale === 'it'
                ? 'La mappa interattiva visualizza i dati di Nutella Index su una cartografia mondiale. Puoi esplorare i prezzi medi per paese, cercare specifiche regioni e analizzare i dati visivamente.'
                : 'The interactive map displays Nutella Index data on a world map. You can explore average prices by country, search for specific regions, and analyze data visually.'}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>
                {locale === 'it'
                  ? 'Clicca su una nazione per vedere il prezzo medio e il numero di osservazioni'
                  : 'Click on a country to see the average price and number of observations'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Usa la ricerca per trovare rapidamente un paese specifico'
                  : 'Use the search to quickly find a specific country'}
              </li>
              <li>
                {locale === 'it'
                  ? 'I colori della mappa indicano la fascia di prezzo: verde per prezzi bassi, rosso per prezzi alti'
                  : 'Map colors indicate price ranges: green for low prices, red for high prices'}
              </li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <RankIcon />
              {locale === 'it' ? 'Ranking Globale' : 'Global Ranking'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">
              {locale === 'it'
                ? 'La classifica globale ordina i paesi dal prezzo più basso al più alto, normalizzato a EUR/100g. Questo permette un confronto equo indipendentemente dal peso della confezione o dalla valuta locale.'
                : 'The global ranking sorts countries from lowest to highest price, normalized to EUR/100g. This allows a fair comparison regardless of package weight or local currency.'}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>
                {locale === 'it'
                  ? 'EUR/100g: prezzo standardizzato per permettere confronti tra paesi'
                  : 'EUR/100g: standardized price to enable country comparisons'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Campioni: numero di osservazioni usate per calcolare la media'
                  : 'Samples: number of observations used to calculate the average'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Ultimo update: data più recente di un osservazione da quel paese'
                  : 'Latest update: most recent observation date from that country'}
              </li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <SubmitIcon />
              {locale === 'it' ? 'Invia Dati' : 'Submit Data'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">
              {locale === 'it'
                ? 'Aiuta a migliorare il dataset condividendo i tuoi dati. Puoi inviare il prezzo della Nutella che hai trovato nel tuo paese insieme a una foto come prova.'
                : 'Help improve the dataset by sharing your data. You can submit the Nutella price you found in your country along with a photo as proof.'}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>
                {locale === 'it'
                  ? 'Seleziona il paese e la città dove hai trovato la Nutella'
                  : 'Select the country and city where you found the Nutella'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Inserisci il prezzo in valuta locale e il peso della confezione'
                  : 'Enter the price in local currency and the package weight'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Carica una foto del prodotto come riferimento'
                  : 'Upload a photo of the product as reference'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Ogni contributo viene revisionato dai moderatori prima di essere aggiunto'
                  : 'Every contribution is reviewed by moderators before being added'}
              </li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <InfoIcon />
              {locale === 'it' ? 'Informazioni sui Dati' : 'Data Information'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">
              {locale === 'it' ? (
                <>
                  Vuoi approfondire come nascono i dati? Nella sezione{' '}
                  <Link href={`/${locale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    Informazioni sui dati
                  </Link>
                  {' '}troverai una guida completa sul sourcing, la normalizzazione e i limiti di accuratezza dei dati.
                </>
              ) : (
                <>
                  Want to learn more about how the data is created? In{' '}
                  <Link href={`/${locale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    Data Information
                  </Link>
                  {' '}you\'ll find a comprehensive guide on data sourcing, normalization, and accuracy limits.
                </>
              )}
            </p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <LightbulbIcon />
              {locale === 'it' ? 'Suggerimenti Utili' : 'Helpful Tips'}
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>
                {locale === 'it'
                  ? 'Filtra i dati per paese sulla mappa per vedere solo i prezzi di quella regione'
                  : 'Filter data by country on the map to see only that region\'s prices'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Usa il ranking per identificare i paesi con i prezzi più convenienti'
                  : 'Use the ranking to identify countries with the best prices'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Ricorda che i prezzi variano nel tempo e per negozio: i dati sono una fotografia del momento'
                  : 'Remember that prices vary over time and by store: data is a snapshot in time'}
              </li>
              <li>
                {locale === 'it'
                  ? 'Più dati contribuisci, più accurato diventa il ranking per il tuo paese'
                  : 'The more data you contribute, the more accurate the ranking becomes for your country'}
              </li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <p className="text-sm leading-relaxed text-[color:rgba(255,239,200,0.92)]">
              {locale === 'it' ? (
                <>
                  Hai altre domande? Esplora le diverse sezioni del progetto oppure{' '}
                  <Link href={`/${locale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    contribuisci con i tuoi dati
                  </Link>
                  {' '}per aiutare la comunità a capire meglio come cambiano i prezzi della Nutella nel mondo.
                </>
              ) : (
                <>
                  Have more questions? Explore the different sections of the project or{' '}
                  <Link href={`/${locale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    contribute your data
                  </Link>
                  {' '}to help the community better understand how Nutella prices change around the world.
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
