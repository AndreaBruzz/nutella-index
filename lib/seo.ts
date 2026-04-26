import type { Metadata } from 'next';
import type { Locale } from '@/lib/i18n/config';

export const SITE_URL = 'https://nutella-index.vercel.app';
export const metadataBase = new URL(SITE_URL);

type SeoPageOptions = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogDescription?: string;
  twitterDescription?: string;
  keywords?: string[];
  titleTemplate?: string;
};

const normalizePath = (path: string) => (path.startsWith('/') ? path : `/${path}`);

const toAbsoluteUrl = (path: string) => new URL(normalizePath(path), metadataBase).toString();

export function buildLocalizedPath(locale: Locale, path: string) {
  return `/${locale}${normalizePath(path)}`;
}

export function buildLocalizedAlternates(locale: Locale, path: string): Metadata['alternates'] {
  const normalizedPath = normalizePath(path);

  return {
    canonical: toAbsoluteUrl(buildLocalizedPath(locale, normalizedPath)),
    languages: {
      it: toAbsoluteUrl(buildLocalizedPath('it', normalizedPath)),
      en: toAbsoluteUrl(buildLocalizedPath('en', normalizedPath)),
      'x-default': toAbsoluteUrl(buildLocalizedPath('en', normalizedPath)),
    },
  };
}

export function createLocalizedMetadata(options: SeoPageOptions): Metadata {
  const alternates = buildLocalizedAlternates(options.locale, options.path);
  const ogDescription = options.ogDescription ?? options.description;
  const twitterDescription = options.twitterDescription ?? ogDescription;
  const canonical = alternates?.canonical;
  const openGraphUrl =
    typeof canonical === 'string' || canonical instanceof URL
      ? canonical
      : toAbsoluteUrl(buildLocalizedPath(options.locale, options.path));

  return {
    title: options.titleTemplate ? options.titleTemplate.replace('%s', options.title) : options.title,
    description: options.description,
    keywords: options.keywords,
    alternates,
    openGraph: {
      title: options.title,
      description: ogDescription,
      type: 'website',
      url: openGraphUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: options.title,
      description: twitterDescription,
    },
  };
}
