# Velvet Pour

*(repository: `mojito-cocktail`)*

A production-style, CMS-driven marketing site for a premium cocktail brand — Next.js on the
front, an embedded Sanity Studio managing every piece of content including which locales exist,
with GSAP-driven scroll storytelling and a real-time 3D glass visualization in the Art section.

**Live:** [mojito-cocktail.vercel.app](https://mojito-cocktail.vercel.app)

## Overview

This isn't a static animation showcase — every section on the page (hero copy, the cocktail
slider, the gallery, the Art section's imagery) is editorial content pulled from Sanity, not
hardcoded JSX. The engineering focus is on two things that don't usually appear together on a
marketing site: content localization that a non-technical editor can extend without a
redeployment, and a hard performance budget enforced at build time rather than left to hope.

Locales aren't a hardcoded array in the source — they're Sanity documents, fetched at request
time via `getLocales()`, each with its own currency for price formatting. Adding a market is a
content operation, not a code change.

## Features

- CMS-driven page content across every section — hero, cocktail slider, gallery, Art — sourced
  from Sanity via `next-sanity`, with draft-mode/live preview support
- Locale routing (`/[locale]/...`) where the *set of supported locales* is itself CMS data, with
  per-locale currency-aware price formatting
- A real-time 3D glass visualization (Three.js via React Three Fiber + Drei) rendered in the Art
  section, not a static image
- GSAP-driven scroll storytelling throughout the page (ScrollTrigger, SplitText-style reveals)
- A CI performance budget gate (`scripts/budget.mjs`) that fails a build if `public/` total size,
  any single asset, or first-load JS exceeds a fixed threshold — enforced, not aspirational
- Consent-gated PostHog analytics with granular section-scroll tracking, and a custom analytics
  panel embedded directly inside the Sanity Studio admin so an editor can see traffic data without
  leaving the CMS
- `llms.txt` for AI-crawler discoverability, Vercel Speed Insights

## Tech Stack

**Frontend**
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, styled-components

**CMS**
Sanity 6 (embedded Studio, `@sanity/document-internationalization`,
`sanity-plugin-internationalized-array`, GROQ, live preview)

**3D / Animation**
Three.js, React Three Fiber, Drei, GSAP + `@gsap/react`

**Analytics**
PostHog (consent-gated, with a custom Studio-embedded analytics tool), Vercel Speed Insights

**Developer Tooling**
A custom CI performance-budget script, Sanity TypeGen (`npm run typegen`) for generated query
types

## Project Structure

```
src/
├── app/
│   ├── (site)/[locale]/     # Localized public routes
│   ├── (studio)/            # Embedded Sanity Studio
│   └── llms.txt/
├── components/
│   ├── sections/             # Hero, cocktail slider, gallery, Art (+ 3D scene)
│   ├── motion/                # GSAP animation wrappers
│   ├── consent/                # Cookie consent, PostHog gating, section tracking
│   └── ui/
├── lib/                       # Locale helpers, price formatting
└── sanity/
    ├── schemas/                # Content types, including the Locale document type
    ├── components/               # Studio-embedded tools (e.g. the analytics tab)
    └── lib/

scripts/
├── budget.mjs                 # CI performance budget gate
└── seed.mjs                   # Sanity content seeding
```

## Getting Started

### Prerequisites

- Node.js 20+
- A [Sanity](https://sanity.io) project (`npx sanity init`)

### Install

```bash
npm install
```

### Environment variables

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_READ_TOKEN        # server-only, needed for draft mode / live preview
NEXT_PUBLIC_DEFAULT_LOCALE
NEXT_PUBLIC_SITE_URL
SANITY_API_WRITE_TOKEN       # used only by scripts/, e.g. seeding
POSTHOG_PERSONAL_API_KEY     # server-only, powers the Studio Analytics tab
```

### Run

```bash
npm run dev
```

### Other scripts

```bash
npm run typegen   # extract the Sanity schema and generate query types
npm run budget     # run the performance budget check locally
npm run seed       # seed Sanity content from scripts/seed-assets
```

## Deployment

Deployed on Vercel. `npm run build` is the standard `next build` — no custom build steps beyond
what Sanity TypeGen and the budget script provide separately in CI.

## Current Status

Actively developed. The CMS-driven content, locale system, and 3D/animation work are implemented
and deployed. A custom domain has been purchased for this project but isn't currently pointed at
the deployment — the Vercel URL above is the verified live site.
