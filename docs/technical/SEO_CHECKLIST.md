# SEO_CHECKLIST.md

## Purpose

This document defines SEO rules for public pages.

The project has public indexable pages and should preserve:

- sitemap behavior
- robots behavior
- schema.org structured data
- server-rendered important content
- useful metadata
- consistent page copy

## Public page checklist

Every public page should have:

- clear title
- unique description
- one clear `h1`
- logical heading hierarchy
- semantic HTML
- crawlable main content
- useful internal links
- correct canonical intent
- relevant Open Graph metadata when useful
- schema.org compatibility when relevant

## Metadata rules

- Titles must be specific.
- Descriptions must be useful and not duplicated across key pages.
- Do not remove existing metadata without reason.
- Keep metadata aligned with page content.
- Keep metadata server-side.
- Avoid generic titles such as "Home" or "Page".
- Avoid keyword stuffing.

## Content rules

- Important public content must not be client-only.
- Important copy must align with `docs/copy/*`.
- Avoid thin pages.
- Avoid duplicated copy across many pages.
- Prefer helpful explanations over keyword repetition.
- Use natural English.

## Heading rules

- Use one `h1`.
- Use `h2` for major sections.
- Do not skip heading levels without reason.
- Do not use headings purely for styling.
- Keep headings descriptive.

## Structured data

Rules:

- Preserve existing schema.org behavior.
- Keep structured data accurate.
- Do not add fake or unverifiable data.
- Keep structured data aligned with visible content.
- Validate impact when changing layout-level metadata.

## Sitemap and robots

Rules:

- Do not remove sitemap or robots behavior.
- Do not accidentally block public pages.
- Do not index private or low-value pages.
- Keep generated URLs canonical and stable.

## Copy docs

When changing public copy:

- update the relevant file in `docs/copy/*`
- keep docs as the source of truth
- preserve the intended page message
- avoid unexplained drift between code and docs

## Required agent output for SEO changes

The agent must report:

1. Pages affected
2. Metadata changed
3. Copy docs updated
4. Structured data impact
5. Indexing risk
