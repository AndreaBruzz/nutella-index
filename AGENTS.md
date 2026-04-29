## Instruction priority

Agents must:

1. Read AGENTS.md before making changes
2. Follow rules in docs/technical/\*
3. Prefer existing patterns over inventing new ones

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Global rules

- Speak English only.
- Code, comments and docs must be in English.
- Be concise.
- Prefer simple, functional, scalable TypeScript.
- Read relevant local Next.js docs before modifying framework-specific code.
- Do not rely on outdated Next.js knowledge.
- Inspect existing files before changing behavior.
- Do not add dependencies unless necessary.
- Do not touch `.env*`, `.next/`, `node_modules/` or `migrations/` without explicit confirmation.
- Treat Supabase, Mapbox and Vercel usage as cost-sensitive.
- Update docs when code, copy, schema, SEO, caching, security or integrations change.

## Product context

Nutella Index is a public web app for comparing and tracking Nutella prices worldwide.

The app must prioritize:

- SEO
- low external API cost
- safe Supabase usage
- server-rendered public content
- clear documentation
- scalable Next.js architecture

## Stack

- Next.js
- TypeScript
- Tailwind CSS v4
- Supabase Postgres via `supabase-js`
- Supabase Auth / Storage
- Mapbox
- Vercel

## Commands

Use these commands when relevant:

- `npm run dev`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `npm run start`

No test runner is currently configured. Do not introduce one without approval.

## Folder conventions

- `app/`: routes, layouts, pages, metadata, route handlers.
- `components/`: reusable UI components only.
- `lib/`: pure utilities, formatting, validation and shared logic.
- `services/`: Supabase, Mapbox and external integrations.
- `types/`: shared TypeScript types.
- `docs/copy/`: source of truth for page copy.
- `docs/technical/`: architecture, schema and technical notes.
- `migrations/`: database migrations. High-risk area.

## Engineering principles

- Prefer boring, predictable code over clever abstractions.
- Optimize for readability, maintainability and low operational cost.
- Use explicit names.
- Avoid premature abstraction.
- Avoid large files and large components.
- Prefer composition over inheritance.
- Prefer pure functions for business logic.
- Keep side effects isolated in `services/` or server-only modules.
- Do not mix UI, data fetching, validation and formatting in the same component.
- Avoid duplicated logic.
- Avoid hidden behavior.
- Fail explicitly.

## Next.js architecture

- Prefer Server Components by default.
- Use `"use client"` only when required.
- Use Client Components only for:
  - user interaction
  - browser APIs
  - local component state
  - map interactions
  - animations

- Keep SEO-critical content server-rendered.
- Keep metadata generation server-side.
- Do not fetch SEO-critical content only on the client.
- Avoid passing large objects from server to client components.
- Never import server-only code into client components.
- Prefer route-level data loading for public pages.
- Keep client bundles small.
- Avoid adding providers at the root unless necessary.

## Coding Agent

Role: implement maintainable Next.js and TypeScript code.

Rules:

- Keep components small and composable.
- Avoid `any`.
- Prefer explicit return types for exported functions.
- Validate external and user-controlled inputs.
- Handle loading, empty and error states.
- Do not silently swallow errors.
- Extract reusable logic into `lib/`.
- Keep external service logic in `services/`.
- Avoid unnecessary client JavaScript.
- Do not introduce a test runner without approval.

Before finishing:

- Check TypeScript safety.
- Check lint impact.
- Mention commands to run.
- Update docs if behavior changed.

## Supabase Agent

Role: protect data access, query cost and schema consistency.

Rules:

- Use `supabase-js` directly.
- Do not introduce an ORM.
- Keep Supabase calls server-side when possible.
- Never expose service-role keys to the client.
- Prefer explicit column selection.
- Avoid `select("*")` unless justified.
- Use `.limit()` for lists.
- Use pagination for public list pages.
- Avoid N+1 queries.
- Prefer batched queries.
- Validate user-controlled query params before using them.
- Do not write to the database from client components unless explicitly required.
- Respect RLS assumptions.
- Treat migrations as high-risk.
- Ask before creating or editing migrations.
- Update `docs/technical/DATABASE_SCHEMA.md` after schema changes.

Before finishing:

- List changed Supabase queries.
- Mention RLS/auth assumptions.
- Mention possible DB cost impact.
- Mention docs updated.

## Mapbox / API Cost Agent

Role: minimize external API cost.

Rules:

- Treat Mapbox and Supabase as billable.
- Avoid polling.
- Avoid repeated client-side calls.
- Avoid calls during render loops.
- Prefer caching, batching, deduplication and lazy loading.
- Keep private tokens server-side.
- Use public Mapbox tokens only for browser-safe map rendering.
- Debounce user-triggered search or geocoding.
- Add minimum input length before search or geocoding.
- Prefer stored coordinates over repeated geocoding.
- Reuse existing service wrappers.

Before finishing:

- Identify every external API call touched.
- Explain caching or deduplication.
- Mention cost risk.

## SEO Agent

Role: protect public indexable pages.

Rules:

- Public pages must have useful metadata.
- Keep titles and descriptions unique.
- Preserve sitemap, robots and schema.org behavior.
- Use semantic HTML.
- Use one clear `h1` per page.
- Keep heading hierarchy logical.
- Prefer server-rendered indexable content.
- Avoid hiding important content behind client-only rendering.
- Keep copy aligned with `docs/copy/*`.
- Add internal links where useful.
- Avoid duplicate or thin public pages.

Before finishing:

- Check title.
- Check description.
- Check canonical intent.
- Check structured data impact.
- Update copy docs when copy changes.

## Security Agent

Role: prevent unsafe changes.

Security Agent has final veto power.

Never:

- expose secrets
- commit credentials
- log API keys, tokens or private payloads
- trust client-side authorization
- rely only on hidden UI for permissions
- leak stack traces to users
- create unsafe redirects
- weaken RLS or auth assumptions without explanation

Always:

- validate input
- enforce authorization server-side
- check server/client boundaries
- sanitize user-controlled values
- keep private env vars server-only
- review Supabase Auth, Storage, policies and migrations carefully

## Caching strategy

- Cache stable public data when safe.
- Do not cache user-specific or permission-sensitive data globally.
- Deduplicate identical requests.
- Prefer server-side caching for external APIs.
- Explain invalidation when adding cache.
- Never cache secrets, auth tokens or private user data.
- Keep freshness requirements explicit.

## Environment variables

- Do not create, rename or remove env vars without documenting them.
- Never print env values.
- Use clear names.
- Public browser variables must use `NEXT_PUBLIC_`.
- Private service keys must never use `NEXT_PUBLIC_`.
- Document env var changes in technical docs.

## Documentation rules

Update documentation when changing:

- page copy
- SEO metadata
- public page behavior
- database schema
- Supabase queries
- Supabase Storage/Auth behavior
- Mapbox usage
- caching strategy
- deployment assumptions
- environment variables
- security assumptions
- data model

Mapping:

- Copy changes → `docs/copy/*.md`
- Schema changes → `docs/technical/DATABASE_SCHEMA.md`
- Architecture changes → `docs/technical/*`
- Integration changes → `docs/technical/*`
- Security changes → `docs/technical/SECURITY_CHECKLIST.md`
- Cost changes → `docs/technical/API_COST_POLICY.md`
- SEO changes → `docs/technical/SEO_CHECKLIST.md`

## Agent review order

For non-trivial changes, apply agents in this order:

1. Coding Agent
2. Supabase Agent
3. Mapbox / API Cost Agent
4. SEO Agent
5. Security Agent

Security Agent has veto power over unsafe changes.
API Cost Agent has veto power over expensive repeated calls.

## Ask before

Ask before:

- adding dependencies
- editing migrations
- changing database schema
- changing auth behavior
- changing RLS/security assumptions
- adding new external API calls
- adding polling/background refresh
- changing deployment config
- removing existing SEO metadata
- deleting docs
- exposing new env vars to the browser

## Final self-check

Before final response, verify:

- TypeScript safety
- server/client boundaries
- external API cost
- SEO impact
- security impact
- docs impact
- commands to run

## Final response format

Use:

1. What changed
2. Files changed
3. Risks / follow-ups

Keep it short.
