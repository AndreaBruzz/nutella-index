import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';

export type AnalyticsEventName =
  | 'page_view'
  | 'form_submit'
  | 'language_switch'
  | 'form_submit_failure';

export type AnalyticsEvent = {
  eventName: AnalyticsEventName;
  route?: string;
  reason?: string;
  userAgent?: string;
};

function truncate(value: string | undefined, max: number): string | null {
  if (!value) return null;
  return value.length > max ? value.slice(0, max) : value;
}

export async function logAnalyticsEvent(
  supabase: SupabaseClient,
  event: AnalyticsEvent
): Promise<void> {
  try {
    await supabase.from('analytics_events').insert({
      event_name: event.eventName,
      route: event.route ?? '/',
      reason: truncate(event.reason, 240),
      user_agent: truncate(event.userAgent, 512),
    });
  } catch (err) {
    // Analytics must never block product flows.
    // Log error for debugging (safe to ignore in production).
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.debug(`[analytics] Failed to log event "${event.eventName}": ${message}`);
  }
}
