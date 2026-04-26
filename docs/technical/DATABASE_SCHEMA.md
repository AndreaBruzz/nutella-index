# Nutella Index Database Structure

## Purpose

This document describes the database structure used by the Nutella Index pipeline.

It covers:

- Core production tables used by the uploader.
- User-submission table for manual review.
- Analytics event table used by product telemetry.
- Relationships between tables.
- Data lifecycle from ingestion to final approval.

## Schema Overview

The database currently uses three core canonical tables:

- `locations`
- `sources`
- `nutella_index`

The application also uses operational tables:

- `user_submissions`
- `analytics_events`

## Entity Relationship Model

### locations

Reference table for country/location metadata.

Primary key:

- `iso_code`

Used by:

- `nutella_index.location_iso` (foreign key)

### sources

Reference table for source content (video-level metadata).

Primary key:

- `video_id`

Used by:

- `nutella_index.video_id` (foreign key)

### nutella_index

Main canonical table for approved observations.

Primary key:

- `event_id`

Foreign keys:

- `video_id` -> `sources.video_id`
- `location_iso` -> `locations.iso_code`

### user_submissions

Lean staging table for user-provided data pending moderation.

Primary key:

- `id`

Optional foreign key:

- `promoted_event_id` -> `nutella_index.event_id`

Note:

- The relationship is documented but not currently enforced as a DB foreign key in migrations.

### analytics_events

Lean telemetry table for product analytics events.

Primary key:

- `id`

## Table Specifications

## 1) locations

Stores normalized location metadata.

Columns:

- `iso_code` (text, PK, length 2)
- `name` (text, not null)
- `slug` (text, unique, not null)
- `created_at` (timestamptz, not null, default `now()`)
- `updated_at` (timestamptz, not null, default `now()`)

Rules:

- One row per ISO alpha-2 code.
- `slug` should be URL-safe and unique.

## 2) sources

Stores source metadata (currently video-level).

Columns:

- `video_id` (text, PK)
- `published_at` (date, nullable)
- `created_at` (timestamptz, not null, default `now()`)
- `updated_at` (timestamptz, not null, default `now()`)

Rules:

- One row per source video ID.

## 3) nutella_index

Main canonical table containing finalized and review-approved observations.

Columns:

- `event_id` (text, PK)
- `source_event_id` (text, not null)
- `video_id` (text, not null, FK -> `sources.video_id`)
- `location_iso` (text, not null, FK -> `locations.iso_code`)
- `location_name` (text, nullable)
- `collected_at` (date, nullable)
- `weight_g` (numeric(10,2), not null, check `> 0`)
- `local_price` (numeric(14,2), not null, check `>= 0`)
- `local_currency` (text, not null)
- `reported_eur_price` (numeric(14,2), nullable)
- `computed_eur_price` (numeric(14,2), nullable)
- `selected_eur_price` (numeric(14,2), not null, check `>= 0`)
- `eur_price` (numeric(14,2), compatibility field, mirrors selected EUR)
- `fx_rate_used` (numeric(20,8), nullable)
- `fx_rate_source` (text, nullable)
- `price_per_100g_eur` (numeric(14,2), not null, check `>= 0`)
- `merge_status` (text, not null)
- `merge_reason` (text, not null)
- `eur_mismatch_flag` (boolean, not null, default `false`)
- `review_origin` (text, nullable)
- `data_provider` (text, not null, set by uploader; default intended value: `Human Safari`)
- `image_url` (text, nullable) - Optional storage path to image from user submissions or external source
- `created_at` (timestamptz, not null, default `now()`)
- `updated_at` (timestamptz, not null, default `now()`)

Recommended integrity checks:

- `eur_price` should match `selected_eur_price` when populated.
- `weight_g` strictly positive.
- `selected_eur_price` non-negative.

## 4) user_submissions

Simple intake table for user-provided entries before moderation and promotion.

Columns:

- `id` (uuid, PK, default `gen_random_uuid()`)
- `city` (text, nullable)
- `country` (text, not null)
- `iso_country` (text, not null, check length 2)
- `price` (numeric(14,2), not null, check `>= 0`)
- `currency` (text, not null)
- `weight_g` (numeric(10,2), not null, check `> 0`)
- `submitter_name` (text, not null)
- `submitter_email` (text, not null)
- `image_path` (text, not null) - Storage path to image in private Supabase bucket showing price and weight clearly
- `submitted_at` (timestamptz, not null, default `now()`)
- `status` (text, not null, default `pending`, allowed: `pending`, `approved`, `rejected`, `promoted`)
- `promoted_event_id` (text, nullable, FK -> `nutella_index.event_id`)
- `created_at` (timestamptz, not null, default `now()`)
- `updated_at` (timestamptz, not null, default `now()`)

Constraint status:

- `promoted_event_id` exists but no foreign key constraint is currently created by the app migration.

## 5) analytics_events

MVP analytics event logger table.

Columns:

- `id` (bigint identity, PK)
- `event_name` (text, not null, allowed: `page_view`, `form_submit`, `language_switch`, `form_submit_failure`)
- `route` (text, not null, default `/`)
- `user_agent` (text, nullable)
- `reason` (text, nullable)
- `created_at` (timestamptz, not null, default `now()`)

Notes:

- Previous analytics columns such as `status`, `http_status`, `country_iso`, and `page_path` are intentionally removed in migration 002.

Why these fields are enough:

- Includes all minimum business info for review and promotion.
- Keeps submission process simple.
- Maintains traceability via `submitter_*`, `submitted_at`, and `promoted_event_id`.

## Data Lifecycle

1. Pipeline produces canonical records.
2. Uploader writes reference rows to `locations` and `sources`.
3. Uploader writes canonical rows to `nutella_index` (image_url optional for video-sourced data).
4. User submits observation with photo to `user_submissions` with `status='pending'` and `image_path` pointing to private storage.
5. Moderator reviews submission and generates signed URLs (1-hour expiry) to view private images.
6. Reviewer marks each submission as `approved` or `rejected`.
7. Approved submission is promoted into `nutella_index`, promoted_event_id is set, and status marked `promoted`.
8. Frontend and API routes emit lightweight telemetry rows into `analytics_events`.

## Operational Notes

- Uploader should always provide `data_provider` explicitly.
- Keep FX provenance fields (`fx_rate_used`, `fx_rate_source`) populated whenever computed conversion is used.
- Maintain deterministic behavior by using manual overrides and fallbacks where market FX is unavailable.
- Private storage bucket `user-submission-images` prevents unauthorized direct access to submission photos.
- Moderator dashboard uses `getSignedImageUrl(image_path)` to generate temporary 1-hour signed URLs for review.
- Signed URLs expire automatically after 1 hour for security.

## Recommended Indexes

Core:

- `nutella_index(video_id)`
- `nutella_index(location_iso)`
- `nutella_index(collected_at)`
- `nutella_index(source_event_id)`

User submissions:

- `user_submissions(status, submitted_at desc)`
- `user_submissions(iso_country)`
- `user_submissions(submitter_email)`

Analytics:

- `analytics_events(created_at desc)`
- `analytics_events(event_name, created_at desc)`

## Versioning

Schema version: v1.2

- Added `data_provider` in main table handling.
- Added implemented `user_submissions` model for review-before-promotion flow.
- Added `analytics_events` table model used by API and product telemetry.
- Corrected `user_submissions.status` nullability and documented `created_at`/`updated_at`.
- Documented that `promoted_event_id` relationship is not currently enforced by a DB foreign key constraint.
