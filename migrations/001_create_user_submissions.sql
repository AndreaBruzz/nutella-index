-- Migration 001: Create user_submissions table for photo submissions
-- Run this in Supabase SQL Editor to set up the submission intake table

BEGIN;

-- Create user_submissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT,
  country TEXT NOT NULL,
  iso_country TEXT NOT NULL CHECK (length(iso_country) = 2),
  price NUMERIC(14,2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL,
  weight_g NUMERIC(10,2) NOT NULL CHECK (weight_g > 0),
  submitter_name TEXT NOT NULL,
  submitter_email TEXT NOT NULL,
  image_path TEXT NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'promoted')),
  promoted_event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_submissions_status 
  ON user_submissions(status);

CREATE INDEX IF NOT EXISTS idx_user_submissions_email 
  ON user_submissions(submitter_email);

CREATE INDEX IF NOT EXISTS idx_user_submissions_country 
  ON user_submissions(iso_country);

CREATE INDEX IF NOT EXISTS idx_user_submissions_status_submitted 
  ON user_submissions(status, submitted_at DESC);

-- Add image_url column to nutella_index if it doesn't exist (for optional images)
ALTER TABLE nutella_index 
  ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMIT;
