'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { logClientAnalytics } from '@/lib/analyticsClient';

const PAGE_VIEW_DEDUPE_WINDOW_MS = 30 * 60 * 1000;

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    void logClientAnalytics({
      eventName: 'page_view',
      route: pathname,
      dedupeKey: `page_view:${pathname}`,
      dedupeWindowMs: PAGE_VIEW_DEDUPE_WINDOW_MS,
    });
  }, [pathname]);

  return null;
}
