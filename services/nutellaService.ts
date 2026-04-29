import 'server-only';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { getCountryNameFromIso } from '@/lib/countries';
import type { Locale } from '@/lib/i18n/config';
import { CountryRanking, NutellaEntry, RankingSort } from '@/types';

const toTimestamp = (value: string | null): number => {
  if (!value) return 0;
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

function getLocalizedLocationName(entry: NutellaEntry, locale: Locale): string {
  if (locale === 'en') {
    return getCountryNameFromIso(entry.location_iso, 'en') ?? entry.location_name ?? entry.location_iso;
  }

  return entry.location_name ?? entry.location_iso;
}

export const nutellaService = {
  async getAllEntries(locale: Locale = 'en'): Promise<NutellaEntry[]> {
    const supabaseAdmin = getSupabaseAdmin();

    const { data, error } = await supabaseAdmin
      .from('nutella_index')
      .select(`
        event_id,
        source_event_id,
        video_id,
        location_iso,
        location_name,
        collected_at,
        weight_g,
        local_price,
        local_currency,
        reported_eur_price,
        computed_eur_price,
        selected_eur_price,
        eur_price,
        fx_rate_used,
        fx_rate_source,
        price_per_100g_eur,
        merge_status,
        merge_reason,
        eur_mismatch_flag,
        review_origin,
        data_provider,
        created_at,
        updated_at,
        image_url
      `)
      .order('collected_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch Nutella entries: ${error.message}`);
    }

    return (data ?? []).map((entry) => ({
      ...(entry as NutellaEntry),
      location_name: getLocalizedLocationName(entry as NutellaEntry, locale),
    }));
  },

  async getCountryRankings(sortBy: RankingSort = 'expensive', locale: Locale = 'en'): Promise<CountryRanking[]> {
    const entries = await this.getAllEntries(locale);

    const grouped = new Map<string, NutellaEntry[]>();
    entries.forEach((entry) => {
      const list = grouped.get(entry.location_iso);
      if (list) {
        list.push(entry);
      } else {
        grouped.set(entry.location_iso, [entry]);
      }
    });

    const rankings: CountryRanking[] = Array.from(grouped.entries()).map(([locationIso, locationEntries]) => {
      const sortedByDate = [...locationEntries].sort(
        (a, b) => toTimestamp(b.collected_at) - toTimestamp(a.collected_at)
      );

      const prices = locationEntries.map((entry) => entry.price_per_100g_eur).filter(Number.isFinite);
      const total = prices.reduce((acc, value) => acc + value, 0);
      const avg = prices.length > 0 ? total / prices.length : 0;
      const min = prices.length > 0 ? Math.min(...prices) : 0;
      const max = prices.length > 0 ? Math.max(...prices) : 0;

      return {
        location_iso: locationIso,
        location_name: sortedByDate[0]?.location_name || locationIso,
        sample_count: locationEntries.length,
        avg_price_per_100g_eur: avg,
        min_price_per_100g_eur: min,
        max_price_per_100g_eur: max,
        latest_collected_at: sortedByDate[0]?.collected_at || null,
        latest_price_per_100g_eur: sortedByDate[0]?.price_per_100g_eur || 0,
        volatility_per_100g_eur: max - min,
      };
    });

    switch (sortBy) {
      case 'cheap':
        return rankings.sort((a, b) => a.avg_price_per_100g_eur - b.avg_price_per_100g_eur);
      case 'recent':
        return rankings.sort(
          (a, b) => toTimestamp(b.latest_collected_at) - toTimestamp(a.latest_collected_at)
        );
      case 'expensive':
      default:
        return rankings.sort((a, b) => b.avg_price_per_100g_eur - a.avg_price_per_100g_eur);
    }
  },

  async getCountryEntries(locationIso: string, locale: Locale = 'en'): Promise<NutellaEntry[]> {
    const entries = await this.getAllEntries(locale);
    return entries
      .filter((entry) => entry.location_iso.toUpperCase() === locationIso.toUpperCase())
      .sort((a, b) => {
        const aTime = a.collected_at ? new Date(a.collected_at).getTime() : 0;
        const bTime = b.collected_at ? new Date(b.collected_at).getTime() : 0;
        return bTime - aTime;
      });
  },
};
