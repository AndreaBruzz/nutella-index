export interface Location {
  iso_code: string;
  name: string;
  slug: string;
}

export interface LocationSummary {
  iso_code: string;
  name: string;
}

export interface CountryOption {
  iso_code: string;
  name: string;
}

export interface CurrencyOption {
  code: string;
  name: string;
}

export interface NutellaEntry {
  event_id: string;
  source_event_id: string;
  location_iso: string;
  location_name: string | null;
  video_id: string;
  collected_at: string | null;
  weight_g: number;
  local_price: number;
  local_currency: string;
  reported_eur_price: number | null;
  computed_eur_price: number | null;
  selected_eur_price: number;
  eur_price: number | null;
  fx_rate_used: number | null;
  fx_rate_source: string | null;
  merge_status: string;
  merge_reason: string;
  eur_mismatch_flag: boolean;
  review_origin: string | null;
  data_provider: string;
  created_at: string;
  updated_at: string;
  price_per_100g_eur: number;
  image_url: string | null;
  locations?: LocationSummary;
}

export type UserSubmissionStatus = 'pending' | 'approved' | 'rejected' | 'promoted';

export interface UserSubmissionInput {
  city?: string;
  country: string;
  iso_country: string;
  price: number;
  currency: string;
  weight_g: number;
  submitter_name: string;
  submitter_email: string;
  image_path: string;
}

export type RankingSort = 'expensive' | 'cheap' | 'recent';

export interface CountryRanking {
  location_iso: string;
  location_name: string;
  sample_count: number;
  avg_price_per_100g_eur: number;
  min_price_per_100g_eur: number;
  max_price_per_100g_eur: number;
  latest_collected_at: string | null;
  latest_price_per_100g_eur: number;
  volatility_per_100g_eur: number;
}
