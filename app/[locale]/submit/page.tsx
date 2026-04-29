import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import SubmitForm from '@/components/submit/SubmitForm';
import { getCountryOptions } from '@/lib/countries';
import { getCurrencyOptions } from '@/lib/currencies';
import { createLocalizedMetadata } from '@/lib/seo';
import { PAGE_CONTAINER_CLASS, PAGE_HORIZONTAL_PADDING_CLASS } from '@/lib/layout';

type SubmitPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: SubmitPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: '/submit',
    title: locale === 'it' ? 'Invia i tuoi dati' : 'Submit your data',
    description:
      locale === 'it'
        ? 'Contribuisci con nuovi prezzi Nutella e aiuta ad ampliare il dataset globale del progetto.'
        : 'Contribute new Nutella prices and help expand the global dataset for the project.',
    ogDescription: dict.meta.siteOgDescription,
  });
}

export default async function SubmitPage({ params }: SubmitPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const dict = await getDictionary(rawLocale);
  const countries = getCountryOptions(rawLocale);
  const currencies = getCurrencyOptions();

  return (
    <main className={`bg-[var(--nutella-cocoa)] ${PAGE_HORIZONTAL_PADDING_CLASS} pb-10 pt-4 text-[var(--nutella-cream)] md:pt-6`}>
      <div className={`${PAGE_CONTAINER_CLASS} rounded-2xl border border-[var(--nutella-gold)]/50 bg-[rgba(75,32,6,0.6)] p-6 md:p-8`}>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">{dict.submit.heading}</h1>
        <p className="mt-3 text-sm text-[color:rgba(255,231,155,0.85)]">{dict.submit.description}</p>

        <SubmitForm locale={rawLocale} copy={dict.submit} countries={countries} currencies={currencies} />
      </div>
    </main>
  );
}
