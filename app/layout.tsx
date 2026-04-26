import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from 'next/headers';
import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import { metadataBase } from '@/lib/seo';
import { hasLocale, type Locale } from '@/lib/i18n/config';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://nutella-index.vercel.app/#organization',
      name: 'Nutella Index',
      url: 'https://nutella-index.vercel.app/',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://nutella-index.vercel.app/#website',
      url: 'https://nutella-index.vercel.app/',
      name: 'Nutella Index',
      publisher: {
        '@id': 'https://nutella-index.vercel.app/#organization',
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase,
  title: "Nutella Index",
  description: "Global Nutella price tracking with an interactive map and dynamic rankings.",
  openGraph: {
    title: "Nutella Index",
    description: "Compare Nutella prices worldwide with a live map and updated rankings.",
    type: "website",
    siteName: 'Nutella Index',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const currentLocale = requestHeaders.get('x-current-locale');
  const lang = hasLocale(currentLocale ?? '') ? (currentLocale as Locale) : 'en';

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
        {children}
        <AnalyticsTracker />
      </body>
    </html>
  );
}
