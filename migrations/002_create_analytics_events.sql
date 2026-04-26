-- Migration 002: Lean analytics event logger for MVP

BEGIN;

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_name TEXT NOT NULL CHECK (
    event_name IN ('page_view', 'form_submit', 'language_switch', 'form_submit_failure')
  ),
  route TEXT NOT NULL DEFAULT '/',
  user_agent TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE analytics_events
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS http_status,
  DROP COLUMN IF EXISTS country_iso,
  DROP COLUMN IF EXISTS page_path,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE analytics_events
  DROP CONSTRAINT IF EXISTS analytics_events_event_name_check;

ALTER TABLE analytics_events
  ADD CONSTRAINT analytics_events_event_name_check
  CHECK (event_name IN ('page_view', 'form_submit', 'language_switch', 'form_submit_failure'));

CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
  ON analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_events_name_created
  ON analytics_events (event_name, created_at DESC);

COMMIT;
