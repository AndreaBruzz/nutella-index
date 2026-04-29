import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import { createLocalizedMetadata } from '@/lib/seo';
import { PAGE_CONTAINER_CLASS, PAGE_HORIZONTAL_PADDING_CLASS } from '@/lib/layout';

type InfoDataPageProps = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = 'https://nutella-index.vercel.app';

export async function generateMetadata({ params }: InfoDataPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: '/info/data-info',
    title: dict.info.dataInfo.heading,
    description:
      locale === 'it'
        ? 'Come nascono i dati di Nutella Index, come vengono normalizzati e quali limiti di accuratezza tenere a mente.'
        : 'How Nutella Index data is sourced, normalized, and what accuracy limits to keep in mind.',
  });
}

function SourceIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 8H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 12H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 16H12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.8 18.5C4.3 15.9 6 14.5 8.5 14.5C11 14.5 12.7 15.9 13.2 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12.8 18.5C13.2 16.5 14.5 15.4 16.4 15.4C18.3 15.4 19.7 16.5 20.2 18.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L21 20H3L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L19 6V11C19 15.5 16.2 19.4 12 21C7.8 19.4 5 15.5 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 12.5L11.2 14.2L14.8 10.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function InfoDataPage({ params }: InfoDataPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const dict = await getDictionary(rawLocale);
  const dataInfo = dict.info.dataInfo;
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
      {
        '@type': 'ListItem',
        position: 3,
        name: dataInfo.heading,
        item: `${SITE_URL}/${rawLocale}/info/data-info`,
      },
    ],
  };

  return (
    <main className={`bg-[var(--nutella-cocoa)] ${PAGE_HORIZONTAL_PADDING_CLASS} pb-10 pt-4 text-[var(--nutella-cream)] md:pt-6`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className={PAGE_CONTAINER_CLASS}>
        <section className="mb-6 rounded-2xl border border-[var(--nutella-gold)]/35 bg-[rgba(90,44,10,0.42)] p-4 md:p-5">
          <header>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{dataInfo.heading}</h1>
            <p className="mt-3 text-sm text-[color:rgba(255,231,155,0.88)]">{dataInfo.intro}</p>
          </header>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <SourceIcon />
              {dataInfo.source.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dataInfo.source.paragraph1}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dataInfo.source.paragraph2}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <CommunityIcon />
              {dataInfo.community.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dataInfo.community.intro}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{dataInfo.community.bullets.review}</li>
              <li>{dataInfo.community.bullets.consistency}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <WarningIcon />
              {dataInfo.accuracy.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dataInfo.accuracy.intro}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{dataInfo.accuracy.bullets.approximate}</li>
              <li>{dataInfo.accuracy.bullets.inaccuracies}</li>
              <li>{dataInfo.accuracy.bullets.factors}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <ShieldIcon />
              {dataInfo.responsibility.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dataInfo.responsibility.paragraph1}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{dataInfo.responsibility.paragraph2}</p>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,231,155,0.95)]">{dataInfo.responsibility.note}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <p className="text-sm leading-relaxed text-[color:rgba(255,239,200,0.92)]">{dataInfo.closing}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <p className="text-sm leading-relaxed text-[color:rgba(255,239,200,0.92)]">
              {rawLocale === 'it' ? (
                <>
                  Vuoi capire come usare questi dati nel progetto? Leggi la{' '}
                  <Link href={`/${rawLocale}/info/docs`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    guida
                  </Link>
                  {' '}oppure{' '}
                  <Link href={`/${rawLocale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    invia un nuovo rilevamento
                  </Link>
                  .
                </>
              ) : (
                <>
                  Want to see how to use this data in the project? Read the{' '}
                  <Link href={`/${rawLocale}/info/docs`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    guide
                  </Link>
                  {' '}or{' '}
                  <Link href={`/${rawLocale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    submit a new observation
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
