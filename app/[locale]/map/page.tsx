import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import NutellaMap from '@/components/NutellaMap';
import { nutellaService } from '@/services/nutellaService';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import { createLocalizedMetadata } from '@/lib/seo';

type MapPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: MapPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!hasLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const dict = await getDictionary(locale);

  return createLocalizedMetadata({
    locale,
    path: '/map',
    title: locale === 'it' ? 'Mappa Nutella Index' : 'Nutella Index Map',
    description:
      locale === 'it'
        ? 'Esplora la mappa interattiva dei prezzi Nutella nel mondo con dettaglio per paese e aggiornamenti recenti.'
        : 'Explore the interactive Nutella price map with country-level detail and recent updates.',
    ogDescription: dict.meta.siteOgDescription,
  });
}

export const revalidate = 1800;

export default async function MapPage({ params }: MapPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  const [data, dict] = await Promise.all([
    nutellaService.getAllEntries(rawLocale),
    getDictionary(rawLocale),
  ]);

  return (
    <main className="relative h-dvh w-screen overflow-hidden overscroll-none bg-[var(--nutella-cocoa)] font-sans text-[var(--nutella-cream)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(250,179,11,0.18),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(229,1,1,0.12),transparent_35%)]" />
      <NutellaMap data={data} locale={rawLocale} copy={dict.map} />
    </main>
  );
}
