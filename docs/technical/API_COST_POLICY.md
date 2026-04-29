# API_COST_POLICY.md

## Purpose

This document defines rules for minimizing paid API and infrastructure costs.

Cost-sensitive services:

- Supabase Database
- Supabase Storage
- Supabase Auth
- Mapbox
- Vercel runtime/build usage

## Global cost rules

- Treat every external API call as billable.
- Avoid unnecessary client-side calls.
- Avoid polling unless explicitly approved.
- Avoid repeated calls for the same data.
- Prefer server-side fetching, caching and deduplication.
- Prefer stored data over recalculating or refetching.
- Explain cost impact when adding or changing external calls.

## Supabase cost rules

Use:

- explicit column selection
- `.limit()` for lists
- pagination for public pages
- batched queries
- indexed lookup fields where appropriate
- server-side reads for public SEO pages

Avoid:

- `select("*")`
- N+1 queries
- unbounded list queries
- repeated queries in component trees
- client-side queries for public content
- unnecessary writes
- storing duplicate large payloads

## Mapbox cost rules

Use Mapbox only when needed.

Rules:

- Do not geocode repeatedly for the same input.
- Store coordinates when they are stable.
- Cache geocoding results.
- Debounce user search.
- Require minimum input length before geocoding.
- Avoid geocoding during page render.
- Avoid geocoding in loops.
- Avoid loading map code on pages that do not need maps.
- Keep private tokens server-side.
- Use public tokens only for browser-safe map rendering.

## Vercel cost rules

- Avoid expensive server work on every request.
- Cache stable public data.
- Avoid unnecessary dynamic rendering.
- Avoid large serverless payloads.
- Avoid heavy dependencies.
- Avoid slow blocking calls during initial render.
- Keep build-time and runtime behavior intentional.

## Caching policy

Cache when:

- data is public
- data changes infrequently
- data is expensive to fetch
- stale data is acceptable for a defined period

Do not cache globally when:

- data is user-specific
- data depends on permissions
- data contains private information
- data contains auth/session details

Every cache must document:

- cached data
- cache key
- freshness requirement
- invalidation strategy
- security assumptions

## Required agent output for API changes

When an agent changes external API behavior, it must report:

1. Which API calls changed
2. Whether calls happen server-side or client-side
3. Caching/deduplication strategy
4. Possible cost impact
5. Any remaining risk

## High-risk changes

Ask before:

- adding polling
- adding background refresh
- adding new Mapbox calls
- adding new Supabase write paths
- changing Storage behavior
- loading maps on more pages
- fetching large datasets
- removing caching
- making static pages dynamic
