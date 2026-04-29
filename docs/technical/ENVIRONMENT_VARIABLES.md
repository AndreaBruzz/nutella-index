# Environment Variables

This document defines all environment variables used by Nutella Index and their configuration requirements.

## Configuration

Environment variables are loaded from `.env.local` (development) or deployment secrets (production).

### Naming Convention

- `NEXT_PUBLIC_*` — Browser-visible environment variables (safe for client-side code)
- No prefix — Server-only environment variables (private keys, service secrets)

## Public Variables

These are safe to expose to the browser and must be prefixed with `NEXT_PUBLIC_`.

### NEXT_PUBLIC_SUPABASE_URL

**Purpose**: Supabase project URL for authentication and client-side storage access.

**Type**: String (URL)

**Required**: Yes

**Example**: `https://abc123.supabase.co`

**Used by**: [lib/supabase.ts](../../lib/supabase.ts)

---

### NEXT_PUBLIC_SUPABASE_ANON_KEY

**Purpose**: Supabase anonymous (public) API key for client-side operations.

**Type**: String (API key)

**Required**: Yes

**Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

**Used by**: [lib/supabase.ts](../../lib/supabase.ts) for client-side queries and Supabase Storage uploads

**Security Notes**:

- This key is intentionally public and limited to specific RLS (Row-Level Security) policies
- Never use the service-role key here
- Supabase Storage bucket RLS must be correctly configured to prevent unauthorized access

---

### NEXT_PUBLIC_MAPBOX_TOKEN

**Purpose**: Mapbox public access token for rendering maps on the client.

**Type**: String (API token)

**Required**: No (map component gracefully degrades if missing)

**Example**: `pk.eyJ1IjoiYWNtZSIsImEiOiJjbDF...`

**Used by**: [components/NutellaMap.tsx](../../components/NutellaMap.tsx)

**Security Notes**:

- Public tokens are restricted to specific URL origins and usage limits in Mapbox dashboard
- Keep token scope minimal (read-only, specific map styles)

---

## Private Variables

These must never be exposed to the browser and are used only in server-side code.

### SUPABASE_SERVICE_ROLE_KEY

**Purpose**: Supabase service-role key for server-side admin operations (full database access).

**Type**: String (API key)

**Required**: Yes (for server-side operations only)

**Used by**: [lib/supabaseAdmin.ts](../../lib/supabaseAdmin.ts)

**Security Notes**:

- **CRITICAL**: Never expose this key to client-side code or browser bundles
- Never commit this to version control
- Rotate regularly in Supabase dashboard
- Use only in server components, API routes, and server-only modules
- Keep this in deployment secrets, not `.env.local` in repositories

---

### SUBMISSION_RATE_LIMIT_PER_HOUR

**Purpose**: Maximum number of user submissions allowed per IP address per hour.

**Type**: Integer

**Required**: No

**Default**: `5`

**Example**: `10`

**Used by**: [app/api/submissions/route.ts](../../app/api/submissions/route.ts#L11)

**Notes**:

- Used to prevent spam and abuse of the submission form
- Rate limit is tracked per IP address
- Adjust based on expected usage patterns and abuse history

---

## Deployment Variables

These variables may differ between environments.

### NODE_ENV

**Purpose**: Node.js environment identifier.

**Type**: String (`development` | `production`)

**Required**: Yes

**Default**: Set by deployment platform

**Used by**: Error handling, logging, feature flags

**Notes**:

- Automatically set by Next.js / Vercel
- Controls whether detailed errors are shown to users

---

## Missing Variables

If required variables are missing during startup:

- **NEXT_PUBLIC_SUPABASE_URL**: Throws error in [lib/supabaseAdmin.ts](../../lib/supabaseAdmin.ts)
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Throws error in [lib/supabase.ts](../../lib/supabase.ts)
- **SUPABASE_SERVICE_ROLE_KEY**: Throws error in [lib/supabaseAdmin.ts](../../lib/supabaseAdmin.ts)
- **NEXT_PUBLIC_MAPBOX_TOKEN**: Component gracefully renders error message (no map available)
- **SUBMISSION_RATE_LIMIT_PER_HOUR**: Falls back to default value of `5`

---

## Development Setup

To run locally with correct env vars:

1. Copy `.env.example` to `.env.local` (if provided)
2. Fill in Supabase credentials from your Supabase project dashboard
3. Fill in Mapbox token from Mapbox account dashboard (optional for development)
4. Never commit `.env.local` to version control
5. Run `npm run dev`

---

## Production Deployment

On Vercel or other platforms:

1. Set all required variables in deployment secret manager
2. Never include service-role keys in client-facing configs
3. Use environment-specific values (different URL/keys per environment)
4. Rotate keys periodically

Vercel-specific: Environment variables are managed in Project Settings → Environment Variables.

## CI Requirements

GitHub Actions build checks need the same Supabase variables as production when the app prerenders locale routes:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Store them as repository secrets so `next build` can complete in CI.

---

## Updates to This Document

Update this file whenever:

- New environment variables are added or removed
- Environment variable purposes or requirements change
- Security assumptions change
- Defaults change

See [AGENTS.md](../../AGENTS.md#documentation-rules) for documentation change rules.
