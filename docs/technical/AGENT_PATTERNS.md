# AGENT_PATTERNS.md

## Purpose

This document defines implementation patterns that agents should follow when modifying the project.

Use this file before writing new code.

## General code pattern

Prefer this structure:

1. Validate input.
2. Call service or pure logic.
3. Handle errors explicitly.
4. Return minimal data.
5. Keep UI separate from data access.

Avoid this:

- data fetching inside reusable UI components
- direct Supabase calls spread across many components
- client-side fetching for SEO-critical content
- repeated API calls without caching
- unclear error handling

## Naming conventions

Use these prefixes consistently:

- `getX`: read one or more records
- `createX`: insert a new record
- `updateX`: update an existing record
- `deleteX`: delete or soft-delete a record
- `formatX`: display formatting
- `parseX`: parse unknown input
- `validateX`: validate external or user input
- `mapXToY`: transform data shape
- `isX`: boolean check
- `hasX`: boolean capability/ownership check

Examples:

- `getLatestPrices`
- `getCountryPriceHistory`
- `createPriceReport`
- `formatCurrency`
- `validateCountryCode`
- `mapPriceRowToPriceCard`

## Layout & Spacing Pattern

**Rule**: All page layouts must use shared container constants to ensure header, footer, and content alignment.

### Shared Constants

Import from `lib/layout.ts`:

```typescript
import {
  PAGE_CONTAINER_CLASS,
  PAGE_HORIZONTAL_PADDING_CLASS,
} from "@/lib/layout";
```

Apply both together on every page root and all major content wrappers:

```typescript
<div className={`${PAGE_CONTAINER_CLASS} ${PAGE_HORIZONTAL_PADDING_CLASS}`}>
  {/* page content */}
</div>
```

**Why**: Prevents width drift across pages. One change in `lib/layout.ts` updates header, footer, and all content consistently.

### Spacing Scale

Never use custom values. Only Tailwind standard scale:

**Avoid**: `px-3`, `py-2.5`, `gap-2.25`, `pt-[6.25rem]`, `rounded-[0.7rem]`

**Use**: `px-4`, `py-3`, `gap-3`, `pt-4`, `rounded-lg`

Common spacing patterns:

| Element         | Pattern          | Notes                        |
| --------------- | ---------------- | ---------------------------- |
| Page sections   | `space-y-6`      | 24px between sections        |
| Header/footer   | `py-3 md:py-4`   | Mobile 12px, desktop 16px    |
| Card padding    | `p-6 md:p-8`     | Mobile 24px, desktop 32px    |
| Navigation gaps | `gap-3 md:gap-4` | 12px → 16px at md breakpoint |

### Typography Scale

All headings must use standard Tailwind scale:

**Page h1**: `text-2xl sm:text-3xl md:text-4xl`  
**Section h2**: `text-xl sm:text-2xl md:text-3xl`  
**Subheading h3**: `text-lg sm:text-xl md:text-2xl`

Avoid custom text sizes: `text-[1.05rem]`, `text-[2.15rem]`

### Border & Background Opacities

Brand color borders use only these opacity levels:

| Opacity | Usage                           |
| ------- | ------------------------------- |
| `/50`   | Primary borders, featured cards |
| `/35`   | Secondary borders               |
| `/25`   | Subtle accents                  |

Background colors: `0.6` (primary), `0.5` (secondary), `0.4` (tertiary)

### Mobile Menu Pattern

For header dropdown menus:

1. Use single `useState` toggle (not multiple listeners)
2. Wrap menu in relative header container
3. Position menu absolutely below header
4. Use ref-based outside-click listener (not document-level):

```typescript
const headerRef = useRef<HTMLDivElement>(null);
const [menuOpen, setMenuOpen] = useState(false);

useEffect(() => {
  if (!menuOpen) return;

  const handlePointerDown = (e: PointerEvent) => {
    if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("pointerdown", handlePointerDown, true);
  return () =>
    document.removeEventListener("pointerdown", handlePointerDown, true);
}, [menuOpen]);
```

**Why**: Ref-based prevents menu from closing instantly when button is clicked.

### Glass Header Effect

Default header styling (all pages):

```
bg-[rgba(46,10,0,0.05)] shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur-lg
```

For `/map` page only, use transparent variant:

```
bg-transparent shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur-lg
```

**See**: `docs/technical/LAYOUT_SYSTEM.md` for full details.

## File placement

Use:

- `components/PriceCard.tsx` for UI.
- `lib/format-currency.ts` for pure formatting.
- `lib/validation.ts` for shared validation.
- `services/supabase/prices.ts` for Supabase price queries.
- `services/mapbox/geocoding.ts` for Mapbox geocoding.
- `types/price.ts` for shared price types.

Avoid:

- Supabase queries inside `components/`
- Mapbox calls inside render paths
- business logic inside JSX
- duplicated types across files

## Server Component pattern

Use Server Components for public SEO pages.

Pattern:

```ts
export default async function Page() {
  const data = await getPublicData()

  return (
    <main>
      {/* server-rendered SEO content */}
    </main>
  )
}
```

Rules:

- Fetch SEO-critical data server-side.
- Keep page content crawlable.
- Pass only minimal props to Client Components.
- Do not use browser APIs here.

## Client Component pattern

Use Client Components only when needed.

Pattern:

```ts
"use client"

import { useState } from "react"

type ExampleClientProps = {
  initialValue: string
}

export function ExampleClient({ initialValue }: ExampleClientProps) {
  const [value, setValue] = useState(initialValue)

  return (
    <button onClick={() => setValue("updated")}>
      {value}
    </button>
  )
}
```

Rules:

- Keep Client Components small.
- Avoid direct external API calls.
- Avoid large props.
- Avoid moving entire pages to the client.
- Use them for interaction, not initial SEO content.

## Supabase service pattern

Supabase queries should live in `services/`.

Pattern:

```ts
import { createClient } from "@/services/supabase/server";

export async function getLatestPrices(limit = 20) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prices")
    .select("id,country_code,price,currency,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to fetch latest prices", error);
    throw new Error("Failed to fetch latest prices");
  }

  return data;
}
```

Rules:

- Select only required columns.
- Use `.limit()` for lists.
- Validate public params before query.
- Do not expose internal errors to users.
- Log enough context for debugging, but never secrets.
- Keep service-role clients server-only.

## Supabase anti-patterns

Avoid:

```ts
await supabase.from("prices").select("*");
```

Avoid:

```ts
items.map(async (item) => {
  await supabase.from("prices").select("...");
});
```

Avoid:

```ts
"use client";

const { data } = await supabase.from("private_table").select("*");
```

## Error handling pattern

Use explicit errors.

Pattern:

```ts
if (error) {
  console.error("Operation failed", {
    operation: "getLatestPrices",
    message: error.message,
  });

  throw new Error("Failed to load price data");
}
```

Rules:

- Internal logs may contain technical context.
- User-facing errors must be safe and generic.
- Never log tokens, keys or private payloads.
- Never silently ignore errors.

## Validation pattern

Validate external input before use.

Pattern:

```ts
export function validateCountryCode(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Invalid country code");
  }

  const normalized = value.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalized)) {
    throw new Error("Invalid country code");
  }

  return normalized;
}
```

Rules:

- Validate route params.
- Validate search params.
- Validate form input.
- Validate webhook payloads.
- Validate data before using it in queries.

## Mapbox geocoding pattern

Pattern:

```ts
export async function geocodeLocation(query: string) {
  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 3) {
    return null;
  }

  // Use existing cache or stored coordinates before calling Mapbox.
  // Call Mapbox only when necessary.
}
```

Rules:

- Minimum input length.
- Debounce user-triggered queries.
- Cache results.
- Store stable coordinates.
- Never geocode during render loops.
- Never expose private tokens.

## Formatting pattern

Use pure formatting helpers.

Pattern:

```ts
export function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
  }).format(value);
}
```

Rules:

- Keep formatting outside JSX when reused.
- Use standard platform APIs where possible.
- Avoid adding libraries for basic formatting.

## Documentation pattern

When code behavior changes, update docs in the same task.

Examples:

- New public page copy → update `docs/copy/*`.
- New Supabase column → update `docs/technical/DATABASE_SCHEMA.md`.
- New Mapbox usage → update `docs/technical/API_COST_POLICY.md`.
- New metadata behavior → update `docs/technical/SEO_CHECKLIST.md`.
- New security assumption → update `docs/technical/SECURITY_CHECKLIST.md`.

## Final implementation checklist

Before finishing:

- Is the code server-rendered where SEO matters?
- Are client components minimal?
- Are external API calls minimized?
- Are Supabase queries selective and limited?
- Are inputs validated?
- Are errors handled explicitly?
- Are secrets protected?
- Are docs updated?
- Are commands listed for verification?
