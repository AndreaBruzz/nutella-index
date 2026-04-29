import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import { createLocalizedMetadata } from '@/lib/seo';
import { PAGE_CONTAINER_CLASS, PAGE_HORIZONTAL_PADDING_CLASS } from '@/lib/layout';

type InfoLegalPageProps = {
  params: Promise<{ locale: string }>;
};

const SITE_URL = 'https://nutella-index.vercel.app';

export async function generateMetadata({ params }: InfoLegalPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: '/info/terms-and-ip',
    title: dict.info.legal.heading,
    description:
      locale === 'it'
        ? 'Termini di utilizzo, diritti sui contenuti e informazioni legali essenziali del progetto.'
        : 'Usage terms, content rights, and essential legal information for the project.',
  });
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 3H14L19 8V20H8C6.9 20 6 19.1 6 18V5C6 3.9 6.9 3 8 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3V8H19" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 12H16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 16H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L19 6V11C19 15.5 16.2 19.4 12 21C7.8 19.4 5 15.5 5 11V6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 10V5H8L19 16L14 21L3 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ScaleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4V20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 8H18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 8L5.5 13H10.5L8 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M16 8L13.5 13H18.5L16 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 4L21 20H3L12 4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9V13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
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

export default async function InfoLegalPage({ params }: InfoLegalPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const dict = await getDictionary(rawLocale);
  const legal = dict.info.legal;
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
        name: legal.heading,
        item: `${SITE_URL}/${rawLocale}/info/terms-and-ip`,
      },
    ],
  };

  return (
    <main className={`bg-[var(--nutella-cocoa)] ${PAGE_HORIZONTAL_PADDING_CLASS} pb-10 pt-4 text-[var(--nutella-cream)] md:pt-6`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className={PAGE_CONTAINER_CLASS}>
        <section className="mb-6 rounded-2xl border border-[var(--nutella-gold)]/35 bg-[rgba(90,44,10,0.42)] p-4 md:p-5">
          <header>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{legal.heading}</h1>
            <p className="mt-3 text-sm text-[color:rgba(255,231,155,0.88)]">{legal.intro}</p>
          </header>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <DocumentIcon />
              {legal.generalUse.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.generalUse.paragraph1}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.generalUse.paragraph2}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <ShieldIcon />
              {legal.noAffiliation.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.noAffiliation.paragraph1}</p>
            <p className="mt-2 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.noAffiliation.paragraph2}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{legal.noAffiliation.bullets.identification}</li>
              <li>{legal.noAffiliation.bullets.analysis}</li>
              <li>{legal.noAffiliation.bullets.commentary}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <TagIcon />
              {legal.dataContent.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.dataContent.intro}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{legal.dataContent.bullets.source}</li>
              <li>{legal.dataContent.bullets.processing}</li>
              <li>{legal.dataContent.bullets.quality}</li>
            </ul>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.dataContent.note}</p>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">
              {rawLocale === 'it' ? (
                <>
                  Per una spiegazione più pratica di come usare questi dati, visita la{' '}
                  <Link href={`/${rawLocale}/info/docs`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    guida
                  </Link>
                  {' '}o la sezione{' '}
                  <Link href={`/${rawLocale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    informazioni sui dati
                  </Link>
                  .
                </>
              ) : (
                <>
                  For a more practical explanation of how to use this data, visit the{' '}
                  <Link href={`/${rawLocale}/info/docs`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    guide
                  </Link>
                  {' '}or the{' '}
                  <Link href={`/${rawLocale}/info/data-info`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    data information
                  </Link>
                  {' '}section.
                </>
              )}
            </p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <ScaleIcon />
              {legal.intellectualProperty.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.intellectualProperty.intro}</p>
            <p className="mt-3 text-sm font-semibold text-[color:rgba(255,231,155,0.96)]">{legal.intellectualProperty.owned.heading}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{legal.intellectualProperty.owned.bullets.structure}</li>
              <li>{legal.intellectualProperty.owned.bullets.dataset}</li>
              <li>{legal.intellectualProperty.owned.bullets.text}</li>
            </ul>
            <p className="mt-3 text-sm font-semibold text-[color:rgba(255,231,155,0.96)]">{legal.intellectualProperty.allowed.heading}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{legal.intellectualProperty.allowed.bullet}</li>
            </ul>
            <p className="mt-3 text-sm font-semibold text-[color:rgba(255,231,155,0.96)]">{legal.intellectualProperty.forbidden.heading}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{legal.intellectualProperty.forbidden.bullets.redistribute}</li>
              <li>{legal.intellectualProperty.forbidden.bullets.commercial}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <AlertIcon />
              {legal.liability.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.liability.intro}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[color:rgba(255,231,155,0.88)]">
              <li>{legal.liability.bullets.inaccuracies}</li>
              <li>{legal.liability.bullets.decisions}</li>
              <li>{legal.liability.bullets.damages}</li>
            </ul>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <RefreshIcon />
              {legal.changes.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">{legal.changes.paragraph}</p>
          </div>

          <div className="mt-5 border-t border-[var(--nutella-gold)]/30 pt-5">
            <p className="text-sm leading-relaxed text-[color:rgba(255,239,200,0.92)]">{legal.contact}</p>
            <p className="mt-3 text-sm leading-relaxed text-[color:rgba(255,239,200,0.9)]">
              {rawLocale === 'it' ? (
                <>
                  Se vuoi aggiungere una nuova rilevazione, puoi farlo dalla pagina{' '}
                  <Link href={`/${rawLocale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    Invia i tuoi dati
                  </Link>
                  .
                </>
              ) : (
                <>
                  If you want to add a new observation, you can do it from the{' '}
                  <Link href={`/${rawLocale}/submit`} className="underline decoration-[rgba(255,231,155,0.55)] underline-offset-2 hover:text-[var(--nutella-gold)]">
                    Submit your data
                  </Link>
                  {' '}page.
                </>
              )}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
