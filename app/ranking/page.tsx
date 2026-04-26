import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPreferredLocale } from '@/lib/i18n/config';

type RankingFallbackProps = {
  searchParams?: Promise<{ sort?: string }>;
};

export default async function RankingPage({ searchParams }: RankingFallbackProps) {
  const locale = getPreferredLocale((await headers()).get('accept-language'));
  const sort = (await searchParams)?.sort;

  if (sort) {
    redirect(`/${locale}/ranking?sort=${sort}`);
  }

  redirect(`/${locale}/ranking`);
}
