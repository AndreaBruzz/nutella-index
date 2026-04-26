'use client';

import { useMemo, useRef, useState, type TouchEvent } from 'react';
import Map, { Marker, Popup, type MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { NutellaEntry } from '@/types';
import { COUNTRY_COORDS } from '@/lib/coordinates';
import { useSyncExternalStore } from 'react';
import type { Locale, Messages } from '@/lib/i18n/config';

type NutellaMapProps = {
  data: NutellaEntry[];
  locale: Locale;
  copy: Messages['map'];
};

type LocationGroup = {
  locationIso: string;
  locationName: string;
  entries: NutellaEntry[];
  averagePricePer100g: number;
  latestCollectedAt: string | null;
};

export default function NutellaMap({ data, locale, copy }: NutellaMapProps) {
  const mapRef = useRef<MapRef | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [popupInfo, setPopupInfo] = useState<LocationGroup | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const uiText = locale === 'it'
    ? {
        mapUnavailableTitle: 'Mappa non disponibile',
        mapUnavailableMessage: 'Impossibile caricare la mappa in questo momento.',
        mapTokenMissing: 'Token Mapbox mancante nella configurazione del deploy.',
        mapLoadError: 'Errore durante il caricamento della mappa.',
        noDataTitle: 'Nessun dato disponibile',
        noDataMessage: 'Non ci sono ancora rilevazioni da mostrare sulla mappa.',
        latestPrefix: 'Ultimo aggiornamento',
      }
    : {
        mapUnavailableTitle: 'Map unavailable',
        mapUnavailableMessage: 'We could not load the map right now.',
        mapTokenMissing: 'Missing Mapbox token in deployment configuration.',
        mapLoadError: 'An error occurred while loading the map.',
        noDataTitle: 'No data yet',
        noDataMessage: 'There are no observations to display on the map yet.',
        latestPrefix: 'Latest update',
      };

  const entriesWithCoords = useMemo(
    () => data.filter((entry) => Boolean(COUNTRY_COORDS[entry.location_iso])),
    [data]
  );

  const toTimestamp = (value: string | null) => {
    if (!value) return 0;
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const groupedEntries = useMemo(() => {
    const byLocation = new globalThis.Map<string, LocationGroup>();

    entriesWithCoords.forEach((entry) => {
      const current = byLocation.get(entry.location_iso);
      if (current) {
        current.entries.push(entry);
        const totalPrice = current.entries.reduce((sum, item) => sum + item.price_per_100g_eur, 0);
        current.averagePricePer100g = totalPrice / current.entries.length;
        current.latestCollectedAt =
          toTimestamp(entry.collected_at) > toTimestamp(current.latestCollectedAt)
            ? entry.collected_at
            : current.latestCollectedAt;
        return;
      }

      byLocation.set(entry.location_iso, {
        locationIso: entry.location_iso,
        locationName: entry.location_name || entry.location_iso,
        entries: [entry],
        averagePricePer100g: entry.price_per_100g_eur,
        latestCollectedAt: entry.collected_at,
      });
    });

    const values = Array.from(byLocation.values());
    values.forEach((group) => {
      group.entries.sort(
        (a, b) => toTimestamp(b.collected_at) - toTimestamp(a.collected_at)
      );
    });

    values.sort((a, b) => a.locationName.localeCompare(b.locationName, locale === 'it' ? 'it-IT' : 'en-US'));
    return values;
  }, [entriesWithCoords, locale]);

  const focusLocation = (group: LocationGroup) => {
    const coords = COUNTRY_COORDS[group.locationIso];
    if (!coords) return;

    mapRef.current?.flyTo({
      center: coords,
      zoom: 4.2,
      duration: 1200,
      essential: true,
    });
    setPopupInfo(group);
  };

  const formatDate = (raw: string | null) => {
    if (!raw) return copy.notAvailable;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return raw;
    return new Intl.DateTimeFormat(locale === 'it' ? 'it-IT' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(parsed);
  };


  const handleSheetTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0].clientY;
  };

  const handleSheetTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const swipeDelta = event.changedTouches[0]?.clientY;
    if (typeof swipeDelta !== 'number') {
      touchStartYRef.current = null;
      return;
    }

    const deltaY = swipeDelta - touchStartYRef.current;
    const threshold = 28;
    if (deltaY <= -threshold) setIsMobileSheetOpen(true);
    if (deltaY >= threshold) setIsMobileSheetOpen(false);
    touchStartYRef.current = null;
  };

  if (!isMounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--nutella-cocoa)] animate-pulse">
        <p className="font-medium text-[var(--nutella-cream)]">🌍 {copy.loading}</p>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-[rgba(229,1,1,0.5)] bg-[rgba(75,32,6,0.72)] p-5 text-center">
          <h2 className="text-xl font-extrabold text-[var(--nutella-cream)]">{uiText.mapUnavailableTitle}</h2>
          <p className="mt-2 text-sm text-[color:rgba(255,231,155,0.9)]">{uiText.mapUnavailableMessage}</p>
          <p className="mt-2 text-xs text-[color:rgba(255,231,155,0.72)]">{uiText.mapTokenMissing}</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-[rgba(229,1,1,0.5)] bg-[rgba(75,32,6,0.72)] p-5 text-center">
          <h2 className="text-xl font-extrabold text-[var(--nutella-cream)]">{uiText.mapUnavailableTitle}</h2>
          <p className="mt-2 text-sm text-[color:rgba(255,231,155,0.9)]">{uiText.mapLoadError}</p>
          <p className="mt-2 text-xs text-[color:rgba(255,231,155,0.72)]">{mapError}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-[var(--nutella-gold)]/45 bg-[rgba(75,32,6,0.72)] p-5 text-center">
          <h2 className="text-xl font-extrabold text-[var(--nutella-cream)]">{uiText.noDataTitle}</h2>
          <p className="mt-2 text-sm text-[color:rgba(255,231,155,0.9)]">{uiText.noDataMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        style={{ width: '100%', height: '100%' }}
        projection="mercator"
        initialViewState={{
          longitude: 10,
          latitude: 30,
          zoom: 1.5
        }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        onError={(event) => {
          const message = event.error?.message ?? uiText.mapLoadError;
          setMapError(message);
        }}
      >
        {groupedEntries.map((group) => {
          const coords = COUNTRY_COORDS[group.locationIso];
          if (!coords) return null;

          return (
            <Marker
              key={group.locationIso}
              longitude={coords[0]}
              latitude={coords[1]}
            >
              <button
                type="button"
                aria-label={`${copy.openDetailsAria} ${group.locationName}`}
                className="relative h-6 w-6 cursor-pointer rounded-full border-2 border-[var(--nutella-cream)] bg-[var(--nutella-gold)] shadow-[0_0_0_3px_rgba(46,10,0,0.4)] transition-all hover:scale-110 hover:bg-[var(--nutella-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nutella-red)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--nutella-cocoa)] md:h-7 md:w-7"
                onClick={e => {
                  e.stopPropagation();
                  focusLocation(group);
                }}
              />
            </Marker>
          );
        })}

        {popupInfo && (
          <Popup
            anchor="bottom"
            longitude={COUNTRY_COORDS[popupInfo.locationIso][0]}
            latitude={COUNTRY_COORDS[popupInfo.locationIso][1]}
            onClose={() => setPopupInfo(null)}
            closeButton={false}
            className="nutella-popup text-black"
            maxWidth="min(420px, calc(100vw - 1.5rem))"
          >
            <div className="p-2 text-[var(--nutella-brown)]">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold leading-tight">{popupInfo.locationName || copy.unknownLocation}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => setPopupInfo(null)}
                  className="hidden h-6 w-6 items-center justify-center rounded-full border border-[rgba(75,32,6,0.35)] bg-[rgba(255,255,255,0.8)] text-base font-bold leading-none text-[var(--nutella-brown)] transition-colors hover:bg-white md:flex"
                  aria-label={copy.closeDetailsAria}
                >
                  ×
                </button>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[color:rgba(75,32,6,0.74)]">
                {copy.averagePrice}
              </p>
              <p className="mt-1 text-2xl font-black text-[var(--nutella-red)]">
                {typeof popupInfo.averagePricePer100g === 'number'
                  ? `${popupInfo.averagePricePer100g.toFixed(2)}€ / 100g`
                  : copy.notAvailable}
              </p>
              <p className="mt-1 text-xs text-[color:rgba(75,32,6,0.74)]">
                {uiText.latestPrefix}: {formatDate(popupInfo.latestCollectedAt)}
              </p>
            </div>
          </Popup>
        )}
      </Map>

      <aside
        className={`absolute bottom-0 left-0 right-0 z-20 flex h-[45dvh] max-h-[560px] flex-col overflow-hidden overscroll-y-contain rounded-t-2xl border border-b-0 border-[var(--nutella-gold)]/60 bg-[rgba(46,10,0,0.88)] p-3 pt-2 backdrop-blur-md transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform touch-none md:bottom-auto md:left-auto md:right-4 md:top-[12.5dvh] md:h-[75dvh] md:w-[320px] md:max-h-none md:max-w-[calc(100vw-2rem)] md:!translate-y-0 md:rounded-2xl md:border-b md:pt-3 md:touch-auto ${
          isMobileSheetOpen ? 'translate-y-0' : 'translate-y-[calc(100%-5.5rem)]'
        }`}
      >
        <div
          className="mb-3 cursor-grab touch-none select-none border-b border-[var(--nutella-gold)]/35 pb-2 active:cursor-grabbing"
          onTouchStart={handleSheetTouchStart}
          onTouchEnd={handleSheetTouchEnd}
        >
          <button
            type="button"
            onClick={() => setIsMobileSheetOpen((current) => !current)}
            className="mx-auto mb-2 block h-1.5 w-12 rounded-full bg-[var(--nutella-gold)]/70 md:hidden"
            aria-label={copy.toggleEntriesAria}
          />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--nutella-cream)]">{copy.entries}</h2>
          <p className="text-xs text-[color:rgba(255,231,155,0.78)] md:hidden">
            {isMobileSheetOpen ? copy.swipeDownToClose : copy.swipeUpToOpen}
          </p>
          <p className="hidden text-xs text-[color:rgba(255,231,155,0.78)] md:block">{copy.clickRowToZoom}</p>
        </div>

        <div
          ref={listContainerRef}
          className={`nutella-scrollbar flex-1 min-h-0 space-y-3 overflow-y-auto overscroll-y-contain pr-1 touch-pan-y transition-opacity duration-200 md:opacity-100 md:pointer-events-auto ${
            isMobileSheetOpen
              ? 'h-[calc(100%-5.5rem)] opacity-100'
              : 'pointer-events-none h-0 opacity-0'
          }`}
        >
          {groupedEntries.map((group) => {
            const isLocationActive = popupInfo?.locationIso === group.locationIso;
            const latestEntry = group.entries[0];

            return (
              <div
                key={`group-${group.locationIso}`}
                className={`rounded-xl border p-2 transition-colors ${
                  isLocationActive
                    ? 'border-[var(--nutella-red)] bg-[rgba(229,1,1,0.12)]'
                    : 'border-[var(--nutella-gold)]/25 bg-[rgba(75,32,6,0.55)]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => focusLocation(group)}
                  className="w-full rounded-lg px-2 py-2 text-left hover:bg-[rgba(75,32,6,0.9)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-[var(--nutella-cream)]">{group.locationName}</p>
                  </div>
                  <p className="mt-1 truncate text-xs font-semibold text-[color:rgba(255,231,155,0.9)]">
                    {copy.listAveragePrefix}: {group.averagePricePer100g.toFixed(2)}€ / 100g
                  </p>
                  <p className="mt-1 text-[11px] text-[color:rgba(255,231,155,0.72)]">{copy.listLatestPrefix}: {formatDate(latestEntry.collected_at)}</p>
                </button>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
