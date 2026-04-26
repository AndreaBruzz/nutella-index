import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { hasLocale } from '@/lib/i18n/config';

type InfoAboutUsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function InfoAboutUsPage({ params }: InfoAboutUsPageProps) {
  const { locale: rawLocale } = await params;
  if (!hasLocale(rawLocale)) notFound();

  redirect(`/${rawLocale}/about`);
}
