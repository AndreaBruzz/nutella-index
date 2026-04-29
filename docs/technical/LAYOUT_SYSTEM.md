# Layout System

## Overview

This document defines the unified layout system established in April 2026 to ensure consistency across all pages, components, and responsive breakpoints.

**Key principle**: All page layouts must align header, footer, and content using shared container constants. This prevents width drift and ensures seamless visual hierarchy.

## Shared Container Constants

Located in `lib/layout.ts`:

```typescript
export const PAGE_CONTAINER_CLASS = "mx-auto w-full max-w-6xl";
export const PAGE_HORIZONTAL_PADDING_CLASS = "px-4 md:px-8";
```

### Usage

**Rule**: Every page route, header, footer, and major content wrapper must import and apply both constants together:

```typescript
import { PAGE_CONTAINER_CLASS, PAGE_HORIZONTAL_PADDING_CLASS } from '@/lib/layout';

// In component
<div className={`${PAGE_CONTAINER_CLASS} ${PAGE_HORIZONTAL_PADDING_CLASS}`}>
  {/* content */}
</div>
```

**Applied in**:

- `components/LocaleHeader.tsx` (wraps SiteHeader)
- `components/SiteHeader.tsx` (responsive sizing)
- `components/SiteFooter.tsx` (footer alignment)
- All page routes: `app/[locale]/page.tsx`, `ranking/page.tsx`, `submit/page.tsx`, `info/*`, etc.

### Values Explained

- `mx-auto w-full`: Centers the container, full width on small screens
- `max-w-6xl`: Desktop max-width (1536px in Tailwind), prevents lines from becoming too long
- `px-4 md:px-8`: Mobile 16px, desktop 32px horizontal padding (balances content from edges)

## Responsive Breakpoints

Standard Tailwind breakpoints used throughout:

| Breakpoint       | Usage                                                        |
| ---------------- | ------------------------------------------------------------ |
| Mobile (default) | `px-4`, `py-3`, `text-2xl`, `gap-2`, `rounded-lg`            |
| `sm:` (640px)    | `sm:text-3xl` (typography scaling)                           |
| `md:` (768px)    | `md:px-8`, `md:py-4`, `md:text-4xl`, `md:gap-4` (main shift) |
| `lg:` (1024px)   | Used sparingly; desktop layout typically sufficient          |

## Typography Scale

All heading sizes must follow this unified scale:

### Page Headings (h1)

```
text-2xl sm:text-3xl md:text-4xl
```

Mobile: 24px, Tablet: 30px, Desktop: 36px

### Section Headings (h2)

```
text-xl sm:text-2xl md:text-3xl
```

### Subheadings (h3)

```
text-lg sm:text-xl md:text-2xl
```

**Note**: Avoid custom text sizes like `text-[1.05rem]` or `text-[2.15rem]`. Stick to Tailwind standard scale.

## Spacing System

### Vertical Spacing

**Page sections**: `space-y-6` (24px between sections)
**Related items**: `space-y-4` (16px)
**Tight grouping**: `space-y-2` (8px)

**Page padding**:

- Top: `pt-4 md:pt-6`
- Bottom: `pb-10` (40px)

**Header/Footer padding**:

- Vertical: `py-3 md:py-4` (header), `py-4 md:py-8` (footer)

### Horizontal Spacing (Gaps)

**Navigation/Button groups**: `gap-3 md:gap-4` (12px → 16px)
**Component nesting**: `gap-2` (8px) for tight layouts
**Card columns**: `gap-4` (16px)

**Note**: Never use custom gap values like `gap-2.25` or `gap-2.5`. Standard gaps only.

### Card/Component Padding

**Primary cards** (featured content):

```
p-6 md:p-8
```

Mobile: 24px, Desktop: 32px

**Secondary cards** (list items):

```
p-4 md:p-5
```

**Button/Nav items**:

```
px-4 py-2 md:py-3
```

## Color & Border System

### Border Opacities (Brand Color)

Use these consistent opacity levels with `var(--nutella-gold)`:

| Level | Usage                           | Example                           |
| ----- | ------------------------------- | --------------------------------- |
| `/50` | Primary borders, featured cards | `border-[var(--nutella-gold)]/50` |
| `/35` | Secondary borders, dividers     | `border-[var(--nutella-gold)]/35` |
| `/25` | Subtle accents, blockquotes     | `border-[var(--nutella-gold)]/25` |

**Pattern**: Border opacity decreases as visual weight decreases.

### Background Opacities

| Level | Usage                             |
| ----- | --------------------------------- |
| `0.6` | Primary card backgrounds          |
| `0.5` | Blockquotes, highlighted sections |
| `0.4` | Secondary actions                 |
| `0.3` | Hover states, subtle backgrounds  |

**Syntax**: `bg-[rgba(75,32,6,0.6)]` (Nutella brown at 60% opacity)

### Border Radius

Only use Tailwind standard values:

- `rounded-lg`: 8px (default for most elements)
- `rounded-xl`: 12px (cards, larger components)
- `rounded-2xl`: 16px (hero sections, emphasis)

**Never**: Custom values like `rounded-[0.7rem]`

## Header & Navigation

### Desktop Layout

Three-column grid: `grid-cols-3 gap-3`

- Left: Logo/title
- Center: Navigation items (align-center)
- Right: Language selector

**Spacing**: `gap-3` between nav items

### Mobile Layout

Flex row with icon button to toggle dropdown menu:

- Logo/title
- Menu button (flex-right)
- Dropdown (absolute, below header)

**Menu styling**:

- Container: `bg-[rgba(46,10,0,0.05)] shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur-lg` (translucent glass)
- Items: `min-h-12 px-4 py-3` (touch-friendly 48px min height)
- Item spacing: `gap-3`

**Menu dismissal**: Use ref-based outside-click listener on header wrapper. Avoid document-level listeners (causes instant-close regressions).

## Translucent Glass Header

### Default Style (All Pages)

```
bg-[rgba(46,10,0,0.05)] shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur-lg
```

Components: `SiteHeader.tsx`, passed by default in `LocaleHeader.tsx`

**Effect**: Subtle cocoa background with frosted glass blur, light shadow

### Transparent Variant (/map Page Only)

Conditional prop: `transparent={true}` passed to SiteHeader

**For `/map`**: Same backdrop-blur, but no background color:

```
bg-transparent shadow-[0_14px_36px_rgba(0,0,0,0.05)] backdrop-blur-lg
```

**Rationale**: Map background should show through; backdrop-blur provides separation.

**Implementation** in `LocaleHeader.tsx`:

```typescript
<SiteHeader transparent={params.locale === 'locale' && pathname === '/map'} />
```

## Map Page Layout

The map page uses full viewport layout:

- No max-width container (full-screen)
- Fixed header (positioned over map)
- Full-height map viewport below header
- Footer hidden on map
- Header uses `transparent={true}` to blend with map

## Mobile Menu Behavior

### State Management

Single `useState` for menu open/close state. Avoid multiple event listeners.

```typescript
const [menuOpen, setMenuOpen] = useState(false);
```

### Outside-Click Dismissal

Use ref-based listener on header wrapper, not document:

```typescript
const headerRef = useRef<HTMLDivElement>(null);

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

**Key points**:

- Use `pointerdown` (more reliable than click/mousedown for touch)
- Use capture phase (third `true` arg) for earliest interception
- Check if click is outside header wrapper
- Cleanup listener in return

**Why ref-based?** Document-level listeners often conflict with button click handlers, causing instant-close regressions.

## Common Pitfalls

### Avoid These

❌ Custom padding/sizing: `px-3 py-2 md:px-6.5 md:py-3.25`, `pt-[6.25rem]`  
❌ Custom border-radius: `rounded-[0.7rem]`  
❌ Custom text sizes: `text-[1.05rem]`, `text-[2.15rem]`  
❌ Custom gaps: `gap-2.25`, `gap-2.5`  
❌ Document-level outside-click listeners (use ref-based)  
❌ Page-specific max-widths: Always import `PAGE_CONTAINER_CLASS`  
❌ Inconsistent header/footer padding across pages

### Correct Patterns

✅ Standard padding: `px-4 md:px-8`, `py-3 md:py-4`  
✅ Tailwind spacing scale: `gap-2`, `gap-3`, `gap-4`, `space-y-4`, `space-y-6`  
✅ Shared container constants in all page layouts  
✅ Typography from standard scale: `text-2xl sm:text-3xl md:text-4xl`  
✅ Border/bg opacities: `/50`, `/35`, `/25`, `0.6`, `0.5`, `0.4`  
✅ Ref-based outside-click listeners on component refs  
✅ One `useState` toggle for menu open/close

## Future Enhancements

Potential improvements (not yet implemented):

1. Extract card component wrapper (primary, secondary, accent variants)
2. Create nav button component (standardizes nav item styling)
3. Define heading component (enforces typography scale)
4. Add CSS custom properties for spacing scale values
5. Consider component-level shadow hierarchy

These should be considered only if complexity increases significantly.

## References

- Shared constants: `lib/layout.ts`
- Header component: `components/SiteHeader.tsx`
- Locale wrapper: `components/LocaleHeader.tsx`
- Footer component: `components/SiteFooter.tsx`
- All page routes: `app/[locale]/**/page.tsx`
