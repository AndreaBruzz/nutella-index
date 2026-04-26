import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { logAnalyticsEvent } from '@/lib/analytics';
import type { UserSubmissionInput } from '@/types';
import { getCountryNameFromIso, isValidIsoCountry } from '@/lib/countries';
import { isValidCurrencyCode } from '@/lib/currencies';
import { isValidEmail } from '@/lib/validation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SUBMISSION_RATE_LIMIT = Number(process.env.SUBMISSION_RATE_LIMIT_PER_HOUR ?? 5);
const SUBMISSION_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

const isNonEmpty = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

type NormalizedSubmission = UserSubmissionInput;

const validateAndNormalize = (payload: unknown): { data?: NormalizedSubmission; error?: string } => {
  if (!payload || typeof payload !== 'object') {
    return { error: 'Invalid payload.' };
  }

  const data = payload as Partial<UserSubmissionInput>;

  if (!isNonEmpty(data.iso_country)) return { error: 'ISO country is required.' };
  if (!isNonEmpty(data.currency)) return { error: 'Currency is required.' };
  if (!isNonEmpty(data.submitter_name)) return { error: 'Submitter name is required.' };
  if (!isNonEmpty(data.submitter_email)) return { error: 'Submitter email is required.' };
  if (!isNonEmpty(data.image_path)) return { error: 'Image path is required.' };

  const email = data.submitter_email.trim().toLowerCase();
  if (!isValidEmail(email)) {
    return { error: 'Invalid email.' };
  }

  const isoCountry = data.iso_country.trim().toUpperCase();
  if (!isValidIsoCountry(isoCountry)) {
    return { error: 'ISO country must be 2 letters.' };
  }

  const currency = data.currency.trim().toUpperCase();
  if (!isValidCurrencyCode(currency)) {
    return { error: 'Invalid currency code.' };
  }

  const price = Number(data.price);
  if (!Number.isFinite(price) || price < 0) {
    return { error: 'Price must be 0 or greater.' };
  }

  const weight = Number(data.weight_g);
  if (!Number.isFinite(weight) || weight <= 0) {
    return { error: 'Weight must be greater than 0.' };
  }

  return {
    data: {
      city: isNonEmpty(data.city) ? data.city.trim() : undefined,
      country: '',
      iso_country: isoCountry,
      price,
      currency,
      weight_g: weight,
      submitter_name: data.submitter_name.trim(),
      submitter_email: email,
      image_path: data.image_path.trim(),
    },
  };
};

export async function POST(request: Request) {
  try {
    const userAgent = request.headers.get('user-agent') ?? undefined;

    const clientIp = getClientIp(request.headers);
    const limit = checkRateLimit(clientIp, SUBMISSION_RATE_LIMIT, SUBMISSION_RATE_LIMIT_WINDOW_MS);
    const supabaseAdmin = getSupabaseAdmin();

    if (!limit.allowed) {
      await logAnalyticsEvent(supabaseAdmin, {
        eventName: 'form_submit_failure',
        route: '/api/submissions',
        reason: 'ip_rate_limit_exceeded',
        userAgent,
      });

      return NextResponse.json(
        {
          error: 'Too many submissions from this IP. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(limit.retryAfterSeconds),
            'X-RateLimit-Limit': String(SUBMISSION_RATE_LIMIT),
            'X-RateLimit-Remaining': String(limit.remaining),
          },
        }
      );
    }

    // Check Content-Length header for server-side file size validation
    const contentLength = request.headers.get('content-length');
    if (contentLength && Number(contentLength) > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `Request body exceeds maximum size of 5MB.` },
        { status: 413 }
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      await logAnalyticsEvent(supabaseAdmin, {
        eventName: 'form_submit_failure',
        route: '/api/submissions',
        reason: 'json_parse_failed',
        userAgent,
      });

      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const result = validateAndNormalize(payload);

    if (!result.data) {
      await logAnalyticsEvent(supabaseAdmin, {
        eventName: 'form_submit_failure',
        route: '/api/submissions',
        reason: result.error,
        userAgent,
      });

      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const countryName = getCountryNameFromIso(result.data.iso_country, 'en');
    if (!countryName) {
      await logAnalyticsEvent(supabaseAdmin, {
        eventName: 'form_submit_failure',
        route: '/api/submissions',
        reason: 'unknown_iso_country',
        userAgent,
      });

      return NextResponse.json({ error: 'Unknown ISO country code.' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('user_submissions')
      .insert({
        ...result.data,
        country: countryName,
        status: 'pending',
      });

    if (error) {
      await logAnalyticsEvent(supabaseAdmin, {
        eventName: 'form_submit_failure',
        route: '/api/submissions',
        reason: error.message,
        userAgent,
      });

      return NextResponse.json({ error: 'Failed to save submission.' }, { status: 500 });
    }

    await logAnalyticsEvent(supabaseAdmin, {
      eventName: 'form_submit',
      route: '/api/submissions',
      userAgent,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const message = err instanceof Error ? err.message : 'Unknown server error';
      const userAgent = request.headers.get('user-agent') ?? undefined;

      await logAnalyticsEvent(supabaseAdmin, {
        eventName: 'form_submit_failure',
        route: '/api/submissions',
        reason: message,
        userAgent,
      });
    } catch {
      // Best effort logging only.
    }

    const message = err instanceof Error ? err.message : 'Unknown server error';
    const errorMessage =
      process.env.NODE_ENV === 'production'
        ? 'Server configuration error.'
        : `Server configuration error: ${message}`;

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
