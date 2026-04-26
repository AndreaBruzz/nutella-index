import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { logAnalyticsEvent, type AnalyticsEventName } from '@/lib/analytics';

const ALLOWED_EVENTS: AnalyticsEventName[] = [
  'page_view',
  'form_submit',
  'language_switch',
  'form_submit_failure',
];

function isAllowedEventName(value: unknown): value is AnalyticsEventName {
  return typeof value === 'string' && ALLOWED_EVENTS.includes(value as AnalyticsEventName);
}

const isString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') ?? undefined;

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });
    }

    const data = payload as Record<string, unknown>;

    if (!isAllowedEventName(data.eventName)) {
      return NextResponse.json({ error: 'Invalid event name.' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    await logAnalyticsEvent(supabaseAdmin, {
      eventName: data.eventName,
      route: isString(data.route) ? data.route.trim() : '/',
      reason: isString(data.reason) ? data.reason.trim() : undefined,
      userAgent,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to log analytics event.' }, { status: 500 });
  }
}
