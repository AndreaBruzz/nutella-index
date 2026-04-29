import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import { createLocalizedMetadata } from '@/lib/seo';
import { PAGE_CONTAINER_CLASS, PAGE_HORIZONTAL_PADDING_CLASS } from '@/lib/layout';

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = 'https://nutella-index.vercel.app';

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: '/about',
    title: dict.about.heading,
    description:
      locale === 'it'
        ? 'La storia dietro Nutella Index, il metodo con cui sono stati raccolti i dati e il risultato finale del progetto.'
        : 'The story behind Nutella Index, how the dataset was built, and what the project reveals about global Nutella prices.',
  });
}

function IntroIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 13V21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 21h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 9L4 12L8 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 9L20 12L16 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 6L10 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ResultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12.5L9.2 16.7L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const dict = await getDictionary(rawLocale);
  const about = dict.about;
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
        name: about.heading,
        item: `${SITE_URL}/${rawLocale}/about`,
      },
    ],
  };

  return (
    <main className={`bg-[var(--nutella-cocoa)] ${PAGE_HORIZONTAL_PADDING_CLASS} pb-10 pt-4 text-[var(--nutella-cream)] md:pt-6`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className={PAGE_CONTAINER_CLASS}>
        <section className="mb-6 rounded-2xl border border-[var(--nutella-gold)]/50 bg-[rgba(75,32,6,0.6)] p-6 md:p-8">
          <header>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{about.heading}</h1>
          </header>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/35 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <IntroIcon />
              {about.intro.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{about.intro.paragraph1}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{about.intro.paragraph2}</p>
            <blockquote className="mt-4 rounded-xl border border-[var(--nutella-gold)]/35 bg-[rgba(75,32,6,0.5)] px-4 py-3 text-sm italic text-[color:rgba(255,231,155,0.92)]">
              {about.intro.quote}
            </blockquote>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <CodeIcon />
              {about.technical.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{about.technical.intro}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{about.technical.bullets.transcripts}</li>
              <li>{about.technical.bullets.regex}</li>
              <li>{about.technical.bullets.contextWindow}</li>
              <li>{about.technical.bullets.normalize}</li>
              <li>{about.technical.bullets.inferCountry}</li>
              <li>{about.technical.bullets.aiLabeling}</li>
              <li>{about.technical.bullets.manualReview}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <ResultIcon />
              {about.result.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{about.result.paragraph1}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{about.result.paragraph2}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <p className="text-sm leading-relaxed text-[color:rgba(255,239,200,0.92)]">{about.closing}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <p className="text-sm leading-relaxed text-[color:rgba(255,239,200,0.92)]">
              {rawLocale === 'it' ? (
                <>
                  Se vuoi esplorare il progetto da un altro punto di vista, vai alla{' '}
                  <Link href={`/${rawLocale}/info/docs`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    guida
                  </Link>
                  , leggi le{' '}
                  <Link href={`/${rawLocale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    informazioni sui dati
                  </Link>
                  {' '}oppure{' '}
                  <Link href={`/${rawLocale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    contribuisci con una nuova segnalazione
                  </Link>
                  .
                </>
              ) : (
                <>
                  If you want to explore the project from another angle, open the{' '}
                  <Link href={`/${rawLocale}/info/docs`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    guide
                  </Link>
                  , read the{' '}
                  <Link href={`/${rawLocale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    data information
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
