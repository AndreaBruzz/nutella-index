# SECURITY_CHECKLIST.md

## Purpose

This document defines security rules for agents working on the project.

Security-sensitive areas:

- Supabase Auth
- Supabase RLS/policies
- Supabase Storage
- database migrations
- API routes
- route handlers
- middleware/proxy logic
- environment variables
- Mapbox tokens
- Vercel deployment settings

## Hard rules

Never:

- expose secrets to the browser
- commit credentials
- print `.env` values
- log API keys or tokens
- trust client-side authorization
- rely only on hidden UI for permissions
- leak stack traces to users
- create unsafe redirects
- weaken RLS without explanation
- use service-role keys in client code

Always:

- validate user input
- enforce authorization server-side
- sanitize user-controlled values
- keep private tokens server-side
- return safe user-facing errors
- keep technical errors in server logs only
- review server/client boundaries

## Environment variables

Rules:

- `NEXT_PUBLIC_` means browser-visible.
- Never put secrets in `NEXT_PUBLIC_` variables.
- Private Supabase keys must be server-only.
- Service-role keys must never reach client bundles.
- Mapbox private tokens must stay server-side.
- Document new env vars.

## Supabase Auth

Rules:

- Do not trust user IDs from the client.
- Get authenticated user from the server/session.
- Check ownership server-side.
- Check permissions before reads/writes.
- Do not expose private user data in public queries.

## Supabase Storage

Rules:

- Validate file type.
- Validate file size.
- Validate ownership.
- Avoid public buckets unless explicitly intended.
- Do not expose private storage paths.
- Be careful with signed URLs.
- Keep signed URL expiration short when used.

## RLS and database policies

Rules:

- Treat RLS changes as high-risk.
- Ask before weakening policies.
- Document policy assumptions.
- Test access from allowed and denied users when possible.
- Never assume UI restrictions are sufficient.

## API routes and route handlers

Rules:

- Validate method.
- Validate body.
- Validate query params.
- Authenticate when needed.
- Authorize before data access.
- Return safe errors.
- Do not expose internal exception messages.
- Avoid open redirects.
- Avoid accepting arbitrary external URLs without validation.

## Logging

Allowed:

- operation name
- safe IDs
- safe status codes
- generic error messages

Forbidden:

- API keys
- tokens
- cookies
- private payloads
- full auth sessions
- passwords
- `.env` values

## Security review checklist

Before finishing security-sensitive work:

- Are secrets server-only?
- Are inputs validated?
- Is authorization enforced server-side?
- Are Supabase queries protected by RLS or explicit checks?
- Are Storage operations permission-checked?
- Are errors safe for users?
- Are logs safe?
- Are redirects safe?
- Are docs updated?

## Required agent output for security-sensitive changes

The agent must report:

1. Security-sensitive files changed
2. Authorization assumptions
3. Input validation added or reused
4. Secret exposure risk
5. Remaining risks or follow-ups
