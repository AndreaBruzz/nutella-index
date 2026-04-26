import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPreferredLocale } from '@/lib/i18n/config';

export default async function InfoPage() {
  const locale = getPreferredLocale((await headers()).get('accept-language'));
  redirect(`/${locale}/info`);
}
