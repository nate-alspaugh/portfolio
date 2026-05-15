---
version: alpha
name: Naterade
description: A dark, editorial portfolio for Nathan Alspaugh — display serif over technical mono, signed with a single chartreuse accent.
colors:
  background: "#151614"
  surface: "#1A1B19"
  surface-deep: "#0E0F0D"
  surface-elevated: "#1C1E1C"
  foreground: "#FFFFFF"
  accent: "#99CC00"
  accent-particle-canvas: "#99CC00"
  accent-component-forge: "#00E6C8"
  accent-voze: "#E6399B"
  keycard-edge-light: "#D4D4D4"
  keycard-edge-dark: "#B8B8B8"
typography:
  display-hero:
    fontFamily: Pirata One
    fontSize: 14vw
    fontWeight: 400
    lineHeight: 1
  display-title:
    fontFamily: Panchang
    fontSize: 7vw
    fontWeight: 600
    lineHeight: 1
  heading-section:
    fontFamily: Panchang
    fontSize: 1.5rem
    fontWeight: 600
    lineHeight: 1.15
  body-md:
    fontFamily: Geist Mono
    fontSize: 0.95rem
    lineHeight: 1.7
  body-sm:
    fontFamily: Geist Mono
    fontSize: 0.85rem
    lineHeight: 1.6
  eyebrow:
    fontFamily: Geist Mono
    fontSize: 0.75rem
    fontWeight: 400
    letterSpacing: 0.12em
  label-caps:
    fontFamily: Geist Mono
    fontSize: 0.7rem
    fontWeight: 400
    letterSpacing: 0.14em
rounded:
  sm: 12px
  md: 16px
  lg: 20px
  pill: 999px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 80px
components:
  case-study-feature:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 16px
  case-study-callout:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: 28px
  back-button:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    typography: "{typography.label-caps}"
    rounded: "{rounded.pill}"
    padding: 8px 14px 8px 10px
  carousel:
    backgroundColor: "{colors.surface-deep}"
    rounded: "{rounded.sm}"
---

## Overview

Naterade is the design language of Nathan Alspaugh's portfolio. The aim is editorial weight without preciousness: a near-black canvas, a single saturated accent, and a typographic pairing that treats display type as ornament and mono as signal. The hero is a three-column layout — outlined display name, a holographic key card, and a rail of work + contact links — pulled directly from the Paper file the site was sketched in.

Everything is dark by default. There is no light mode and no plan for one; the surfaces are tuned for OLED black with subtle warm tint (`#151614`, not `#000`).

## Colors

The palette is two-axis: warm near-black surfaces stepping from `#0E0F0D` to `#1C1E1C`, and white at varying alphas for content. There is exactly one chromatic color in the resting UI — the chartreuse accent `#99CC00` — used for links, active states, and the key card chip.

Per-project accents (`accent-particle-canvas`, `accent-component-forge`, `accent-voze`) live on `projects-meta.js` and are surfaced as `--accent` inside case-study pages. Treat them as one-off project signatures, not part of the global palette.

White-on-dark text uses alpha steps rather than solid grays: `0.7` for body copy, `0.5` for eyebrows, `0.35` for placeholders, `0.08` for borders. Don't introduce new gray hex values — extend the alpha ladder instead.

## Typography

Four families, each with a specific job:

- **Pirata One** — display only, used at huge sizes for the outlined hero name. Never set below ~96px.
- **Panchang** (variable 200–800) — case study titles and section headings. Always weight 600.
- **Geist Mono** (variable) — the default body and UI font. Carries almost everything.
- **Geist Pixel** (Square / Grid / Circle / Triangle / Line) — reserved for accent moments on the key card. Not for prose.

Heading sizes use `clamp()` with a viewport term so the same token spans hero and mobile without per-breakpoint overrides — see `display-hero` and `display-title`.

## Layout

The home page is a 3-column grid (`372px / auto / 408px`) capped at `1400px`, collapsing to a 2-column then 1-column stack at `1024px` and `767px`. Side columns push their content down by `clamp(110px, 22vh, 200px)` to align to the key card's vertical center — that offset is intentional and should not be normalized away.

Case study content is centered in a `960px` column with `120px` top padding. Use the spacing scale (`xs`–`3xl`) for gaps between sections; ad-hoc pixel values are fine inside a component but should not appear at the page level.

## Elevation & Depth

Surfaces are layered by darkness, not by shadow. There are no drop shadows in the resting UI. Depth cues are:

- `1px solid rgba(255,255,255,0.05–0.12)` borders to separate cards from the canvas
- `backdrop-filter: blur(8–12px)` on glass elements (back button, carousel chrome)
- Diagonal repeating-gradients on placeholder feature images

The key card is the one exception — its depth comes from a holographic foil shader and a tilt effect, not from box-shadow.

## Shapes

Four radius tokens cover everything: `sm` for inline cards and callouts, `md` for hero images, `lg` for case-study feature cards, `pill` for buttons and dot indicators. Avoid intermediate values.

## Components

- **`<key-card>`** — the holographic centerpiece. Owns its own shader, tilt, and haptics; do not restyle from outside.
- **`<home-bio>`, `<work-list>`, `<contact-links>`** — light/shadow DOM hybrids; visible content lives in shadow, with a `.seo-fallback` clone in light DOM for crawlers. Keep both in sync when editing copy.
- **`case-study-page`** — light DOM, served via the prerender plugin. Class names are namespaced `cs-*`. Variants: `cs-section`, `cs-feature`, `cs-callout`, `cs-carousel`, `cs-bare-image`.
- **`<main-nav>`** — top navigation. Active links use the chartreuse accent.
- **`<foil-tweaker>`** — dev-only panel for tuning the key card's foil parameters; gated, not part of production UI.

## Do's and Don'ts

- **Do** use the alpha ladder (`0.7 / 0.5 / 0.35 / 0.08`) for white-on-dark hierarchy.
- **Do** reach for `clamp()` over media queries when scaling type or spacing.
- **Don't** add a second chromatic color to the global palette. Project accents are scoped to their case study only.
- **Don't** use box-shadow for depth — layer surfaces by darkness and use a hairline border.
- **Don't** introduce new font families. Four is already the ceiling.
