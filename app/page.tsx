import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getPreferredLocale, type Locale } from '@/lib/i18n/config';

export default async function RootPage() {
  const requestHeaders = await headers();
  const acceptLanguage = requestHeaders.get('x-current-locale') ?? requestHeaders.get('accept-language') ?? 'en';
  const locale = (getPreferredLocale(acceptLanguage) ?? 'en') as Locale;

  redirect(`/${locale}`);
}
