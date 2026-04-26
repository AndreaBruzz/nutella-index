'use client';

type AnalyticsEventName =
  | 'page_view'
  | 'form_submit'
  | 'language_switch'
  | 'form_submit_failure';

type ClientAnalyticsEvent = {
  eventName: AnalyticsEventName;
  route?: string;
  reason?: string;
  dedupeKey?: string;
  dedupeWindowMs?: number;
};

const DEDUPE_STORAGE_PREFIX = 'nutella-index:analytics:';

function shouldSkipDedupe(event: ClientAnalyticsEvent): boolean {
  if (!event.dedupeKey || !event.dedupeWindowMs || typeof window === 'undefined') {
    return false;
  }

  try {
    const storageKey = `${DEDUPE_STORAGE_PREFIX}${event.dedupeKey}`;
    const storedValue = window.localStorage.getItem(storageKey);
    const timestamp = storedValue ? Number(storedValue) : Number.NaN;

    if (Number.isFinite(timestamp) && Date.now() - timestamp < event.dedupeWindowMs) {
      return true;
    }

    window.localStorage.setItem(storageKey, String(Date.now()));
  } catch {
    return false;
  }

  return false;
}

export async function logClientAnalytics(event: ClientAnalyticsEvent): Promise<void> {
  try {
    if (shouldSkipDedupe(event)) {
      return;
    }

    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true,
    });
  } catch {
    // Best effort logging only.
  }
}
