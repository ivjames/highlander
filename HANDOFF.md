# Highlander Auditorium — redesign handoff

Static multi-page site — `index.html` plus a page per section, sharing one
stylesheet, one script, and one logo symbol. **No build step, no framework, and
— except the Google Maps iframe and the `/edu/` Google Form/Drive links — no
third-party requests.** Serve the folder statically (directory-style URLs like
`/tickets/` need a static server, e.g. the included nginx config — see `deploy/`).

### Pages
`/` home · `/tickets/` · `/ticket-policies/` · `/seating-chart/` · `/about/` ·
`/about/staff/` · `/edu/` · `/rentals/` · `/visit/` · `/visit/accessibility/` ·
`/gallery/` · `/lost/` · `/contact/`. All page content is pulled faithfully from
the live site (thin/empty live pages — gallery, seating — are rebuilt from the
venue's own photos + chart). Shared chrome lives in `assets/css/site.css`,
`assets/js/site.js`, and `assets/ha-logo.svg` (referenced via `<use>` so the logo
is defined once). `/about/staff/` and `/lost/` are the pages the live site hides
in dropdown menus.

The `/visit/` page carries a small **weather widget** (our own UI, not an embed)
that fetches current Upland conditions from the keyless, CORS-friendly Open-Meteo
API client-side — replacing the live site's external Weather-Underground link. It
stays hidden if the fetch fails, so it never shows a broken state.

```
highlander/
├─ index.html
├─ HANDOFF.md
└─ assets/
   ├─ fonts/                       self-hosted variable fonts (latin subset, ~102 KB total)
   │   ├─ spacegrotesk.woff2       display / headings
   │   ├─ inter.woff2              body
   │   └─ jetbrainsmono.woff2      mono labels
   └─ img/
       ├─ hero.jpg                 stage/band shot — hero
       ├─ interior.jpg             empty house — behind the "The House" panel
       ├─ aerial.jpg               drone exterior (venue signage) — behind the "Rental" panel
       ├─ favicon.jpg / apple-touch-icon.jpg   tab + iOS icons (venue mark)
       ├─ Header-Logo-sm.png       real venue logo, raster — reference only (see Logo)
       ├─ logoblack.jpg            venue mark source (favicon origin)
       └─ UUSD_Logo_Horizontal-150px.png   district logo — reference, not yet placed
```

## What this page is now

A truthful rebuild of the Highlander Auditorium homepage, re-anchored to what the
venue actually is (verified against the live site + technical info): a **1,073-seat
proscenium theatre in Upland, 30 min east of downtown LA, operated by Upland Unified
School District**, functioning as a **ticketed-shows + educational-events + rental**
house. Ticketing runs through **Ludus** and is dormant when no events are on sale.

### Content rewritten to real framing
- **Hero / run-strip:** real descriptor (1,073 seats, proscenium, location, UUSD).
  The invented "2026 Season / Now booking" line is gone.
- **Programs grid** repurposed from fictional genres → the three real paths:
  **See a Show** (`/tickets/`), **Educational Events** (`/edu/`), **Rent the Venue**
  (inquiry → `/contact/`).
- **The House panel:** real specs — 1,073 seats, ETC lighting, Yamaha console, 27-ft
  HD screen. **Footer:** real phone `(909) 985-9462` + `info@highlanderauditorium.com`.

### Media (self-hosted from the live site)
Three real photos pulled local and used: the **stage/band** shot (hero), the **empty
house** (behind "The House"), and the **drone exterior** with venue signage (behind
"Rental"), each under a heavy dark wash so the text stays legible. (The site's 4th
slider asset, `midi_2.png`, was a 161×60 graphic, not a photo — omitted.)

### Fonts self-hosted
Space Grotesk / Inter / JetBrains Mono are now local variable woff2 (latin subset),
mirroring the sibling `bonita` repo's pattern (`@font-face` + `font-display:swap`,
primary faces preloaded). The Google Fonts CDN link is gone — **zero third-party font
requests.**

### Links fixed to the real IA
The original mockup's nav 404'd against the live site. All internal links now resolve
(verified 200): `/tickets/`, `/about/philosophy/`, `/visit/directions/`,
`/visit/accessibility/`, `/edu/`, `/seating-chart/`, `/ticket-policies/`, `/contact/`,
`/gallery/`. Remaps applied: `/about-us/`→`/about/philosophy/`,
`/plan-your-visit/`→`/visit/*`.

## Logo
The venue's real logo is a **raster** PNG (`Header-Logo-sm.png`, white on transparent) —
no vector exists on the live site. The inline SVG in the page is a faithful potrace
reconstruction of it, kept as primary because it's scalable. Swap for a client-supplied
`.ai/.svg` if one turns up.

## Open items before launch
1. **Rentals link is unresolved on the live site.** There is **no working rental page** —
   the live site's own "Facility Rental" button points at `/rentals`, which **404s**
   (as do `/rental-inquiry/`, `/facility-rental/`, etc.). I've pointed all rental links
   to `/contact/` (rentals are inquiry-gated) as a working fallback. **Confirm the real
   rental URL** with the venue and update the 4 rental links.
2. **Social handles unverified.** The Facebook/Instagram/LinkedIn footer links are
   guesses — verify the real accounts or remove.
3. **ZIP discrepancy.** Used **91786** (homepage/directions). The live `/contact/` page
   shows **91764** — looks like a typo there; confirm the correct ZIP.
4. **Ticketing state.** Copy says tickets sell "through Ludus when events go on sale,"
   which matches today's dormant state. No live events exist to feature yet.
5. **Real logo vector** if obtainable (see Logo).

## Provenance
All media/fonts fetched 2026-07-03 — photos from `https://www.highlanderauditorium.com`,
fonts from Google Fonts (latin subset, then self-hosted). Palette accent `#DC764B`
sampled from the venue stage wash (hue ~18°), visible in the hero's house lights.
