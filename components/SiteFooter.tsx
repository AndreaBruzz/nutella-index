'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale, Messages } from '@/lib/i18n/config';

type SiteFooterProps = {
  locale: Locale;
  nav: Messages['nav'];
  footer: Messages['common']['footer'];
};

export default function SiteFooter({ locale, nav, footer }: SiteFooterProps) {
  const contactEmail = 'info.nutellaindex@gmail.com';
  const pathname = usePathname();

  if (pathname === `/${locale}/map`) {
    return null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-[var(--nutella-gold)]/35 bg-[rgba(46,10,0,0.72)] px-4 py-6 text-[var(--nutella-cream)] md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold">{nav.title}</p>
          <p className="mt-1 text-xs text-[color:rgba(255,231,155,0.82)]">{footer.builtWith}</p>
          <p className="mt-1 text-xs text-[color:rgba(255,231,155,0.82)]">
            Contact:{' '}
            <a href={`mailto:${contactEmail}`} className="underline decoration-[rgba(255,231,155,0.42)] underline-offset-2 hover:text-[var(--nutella-gold)]">
              {contactEmail}
            </a>
          </p>
          <p className="mt-1 text-xs text-[color:rgba(255,231,155,0.68)]">© {year} Nutella Index. {footer.rights}</p>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href={`/${locale}/map`} className="rounded-md px-2 py-1 hover:bg-[rgba(250,179,11,0.12)]">
            {nav.links.worldMap}
          </Link>
          <Link href={`/${locale}/ranking`} className="rounded-md px-2 py-1 hover:bg-[rgba(250,179,11,0.12)]">
            {nav.links.ranking}
          </Link>
          <Link href={`/${locale}/submit`} className="rounded-md px-2 py-1 hover:bg-[rgba(250,179,11,0.12)]">
            {nav.links.submit}
          </Link>
          <Link href={`/${locale}/info`} className="rounded-md px-2 py-1 hover:bg-[rgba(250,179,11,0.12)]">
            {nav.links.info}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
