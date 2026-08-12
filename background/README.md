# Handoff: The Countdown — "How We Get to the Matrix"

## Overview

A speculative-fiction reading site. A live countdown to **7 August 2068** ("day zero" — the day the last waking human is connected to a shared simulation) frames a timeline (currently 59 entries, and growing) running from today to that date. Every entry is invented fiction; every cited source is a real, already-published document. Five recurring themes ("seeds") thread through the story and are navigable on their own.

The visual world: a printed shortwave-radio artifact. Clinical paper, hard rules, halftone film grain, marquee tickers, and CMYK-screened Renaissance frescoes printed directly into the paper. Radiohead *OK Computer* / Stanley Donwood adjacent — cold instrument chrome with a humanist counterweight.

## About the Design Files

The files in this bundle are **design references created in HTML** — prototypes that show intended look and behavior. They are **not production code to copy**. They use a bespoke streaming-template runtime (`support.js`, `<x-dc>`, `{{ }}` holes) that exists only in the design tool; do not port that runtime.

The task is to **recreate these designs in the target codebase's own environment** (React, Vue, Svelte, SwiftUI, native — whatever the project already uses), following its established component patterns, styling approach, and routing. If no environment exists yet, choose the framework best suited to a content-driven, animation-heavy reading site (Next.js/React with CSS Modules or Tailwind is a reasonable default) and implement there.

Everything in this README is framework-agnostic: exact values, exact behavior, exact copy.

## Fidelity

**High-fidelity (hifi).** Colors, typography, spacing, motion timings, and interaction rules are all final and intentional. Recreate the UI pixel-accurately using the codebase's libraries. Where this document and the HTML disagree, this document wins — it reflects the last round of decisions.

Design canvas width is **1400px** for desktop screens and **390×844** for mobile. Desktop screens are fixed-width mocks; see *Responsive behavior*.

---

## Global System

### Type

Five faces, each with one job. Never mix roles.

| Face | Weight / tracking | Used for |
|---|---|---|
| **Geist** | 700, letter-spacing −2px, uppercase | Headlines, entry titles, menu destinations, day numbers in headers |
| **Geist** | 600, 19px, letter-spacing +0.5px | The scrubber readout plate only |
| **Oswald** | 500–600, letter-spacing +2–3px, uppercase | Chrome labels, seed names, buttons, section kickers |
| **Atkinson Hyperlegible Mono** | 400, line-height 1.9 (body) / 1.7 (small) | All body copy, metadata, captions, footnotes |
| **Major Mono Display** | 400, 13–22px | Live counts, day numbers, tick labels, stat blocks |
| **Archivo Black** | 400, 28–40px, uppercase | Stripe-band statements only — one per screen maximum |

Google Fonts import:

```
https://fonts.googleapis.com/css2?family=Archivo+Black&family=Oswald:wght@300;400;500;600;700&family=Geist:wght@300;400;500;600;700;800;900&family=Major+Mono+Display&family=Atkinson+Hyperlegible+Mono:wght@300;400;500;600;700&display=swap
```

**Hard rules**
- **Numbers never carry thousands separators.** `15337`, not `15,337`. Anywhere on the site.
- Negative day numbers use the **minus sign U+2212 (−)**, not a hyphen: `DAY −14500`.
- Body copy measure stays in the **45–75 character** band (≈600–720px at 14–16px).
- Geist text sitting on a fresco plate carries `text-shadow: 1px 1px 0px #FFFFFFB7`.

### Color

| Token | Hex | On dark surfaces | Use |
|---|---|---|---|
| Paper | `#EDF1F2` | — | Every light surface; type on dark grounds |
| Ink | `#0b0b0b` | — | Rules, chrome bars, map ground, footers |
| Brand red | `#B31E2C` | `#E8556A` | The only accent. CTAs, live counts, scrubber handle, highlights |
| Signal yellow | `#E3D51F` | — | Day zero, exhibit tabs. Never body text |
| Body ink | `#1a1a1a` | — | Long-form body copy on paper |
| KOMPUTILO (seed 01) | `#2A5EA8` | `#7FAAE8` | Seed identity |
| LABORO (seed 02) | `#B8860B` | `#E3B44A` | Seed identity |
| CERBO (seed 03) | `#1F7A6B` | `#4FC2AC` | Seed identity |
| SONĜO (seed 04) | `#6A4C93` | `#B199D6` | Seed identity |
| AŬTORITATO (seed 05) | `#7A1E28` | `#E8556A` | Seed identity |

Dark surfaces must use the AA-compliant variant, never the base hue. Common alpha ramps on paper: `rgba(11,11,11,0.4)` metadata, `0.5–0.6` secondary, `0.12–0.2` hairlines. On ink: `rgba(237,241,242,0.4–0.5)` metadata, `0.12–0.16` hairlines.

### Spacing & structure

- Desktop page gutter: **48px** (some legacy screens use 32px in chrome bars — standardize on 48px).
- Chrome bar padding: `18px 48px`, bottom border `2.5px solid #0b0b0b`.
- Section rules: `2.5px solid #0b0b0b` for major, `1px solid rgba(11,11,11,0.12)` for row dividers.
- Card borders: `2.5px solid #0b0b0b`, no border-radius anywhere except the scrubber plate (3px) and handle circles.
- **No rounded corners, no drop shadows on layout elements.** The only shadows in the system are the scrubber's red glow and the halftone grain.
- Layout uses flex/grid with `gap` throughout.

### Fresco plates (the humanist motif)

Eight background images, each a Renaissance fresco run through a CMYK halftone screen (C 15° / Y 0° / K 45°, ~7px cell, grid noise, sharp dots). Files ship as baked PNGs in `humanist/`:

```
fresco_athens_halftone.png       I    · The School of Athens
fresco_creation_halftone.png     II   · The Creation of Adam
fresco_lastjudgment_halftone.png III  · The Last Judgment
fresco_grotesque_halftone.png    IV   · Grotesques, Uffizi
fresco_banquet_halftone.png      V    · The Wedding Banquet
fresco_vault_halftone.png        VI   · The Painted Vault
fresco_gallery_halftone.png      VII  · Gallery of Maps
fresco_vatican_halftone.png      VIII · Vatican Corridor
```

**Printing rules — these are the whole point, do not soften them:**

```css
.plate {
  position: absolute; inset: 0;              /* or a zoned band */
  background: url(...) center 20%/cover no-repeat;
  filter: saturate(1.15);
  mix-blend-mode: multiply;                  /* NOT opacity */
  pointer-events: none;
}
```

- **Full strength via `multiply`, never a translucent wash.** A low-opacity plate reads as gray fog; multiply prints the ink into the paper so whites stay clean.
- **Zoned to hero regions only** — the top band of a screen, never behind long body copy. Reading surfaces (timeline read view, entry detail body) stay clinical.
- **Anything sitting on a plate gets a solid paper slab** (`background: rgba(237,241,242,0.92); padding: 8–16px`). No text glows, no soft halos — those were tried and rejected.
- **Rotation**: all eight advance one position on every page load, persisted in `localStorage` under `omFrescoIdx`. Each screen renders `pool[(idx + screenOffset) % 8]` so adjacent screens never share a plate. Plates carry **no captions** — they are background imagery, not a museum gallery.

### Devotional seed panels

Five **square** painted panels (`humanist/<seed>_icon.png`, 1:1 aspect) represent the seeds as Renaissance devotional figures. Frame treatment:

```css
border: 2px solid rgba(11,11,11,0.18);
box-shadow: 0 1px 4px rgba(0,0,0,0.12);
aspect-ratio: 1;
object-fit: cover;
object-position: center;
```

Rendered sizes: 100×100 (landing seed row), full column-width square (seeds index cards, seed profile), 52×52 (mobile lists).

Each seed also has a small line-art SVG glyph (circuit node, worker, brain/organoid, headset, warning triangle) in the seed's color. **Panels carry human meaning; glyphs stay as machine taxonomy.** Both appear together; the glyph is the smaller, subordinate mark.

**There are no Latin/Greek "doctrine" inscriptions anywhere** — that motif was removed late in the design. Seed labels are the Esperanto name + footnote only. If you find DOCTRINA strings in older exploration files, ignore them.

### Film grain

A `<canvas>` overlay on red and black surfaces, redrawn every **90ms** with random monochrome noise at alpha 55–80 (0–255 scale). Implementation: `createImageData`, fill each pixel with a random gray, `putImageData`. Canvas is `position:absolute; inset:0; z-index:0; image-rendering:pixelated; pointer-events:none`; content above it needs `position:relative`. Cheap sizes (e.g. 220×24 stretched to fill) are intentional — the grain should be chunky.

Respect `prefers-reduced-motion`: freeze the grain on a single frame.

---

## Chrome (present on every screen)

```
┌──────────────────────────────────────────────────────────────────┐
│ THE COUNTDOWN            15337 DAYS LEFT   [ CHANNELS ⠿ ]        │
└──────────────────────────────────────────────────────────────────┘  ← 2.5px rule
```

- **Left**: wordmark `THE COUNTDOWN`, Oswald 600, 14px, +3px tracking, ink. On sub-pages a breadcrumb sits beside it (`← ALL DAYS`, `← ALL FIVE SEEDS`), Atkinson Mono 11px, `rgba(11,11,11,0.5)`.
- **Right**: live count in Major Mono 17px brand red, `white-space: nowrap`; then the CHANNELS trigger.
- **CHANNELS trigger**: black block, `padding: 8px 16px`, label `CHANNELS` in Oswald 600 13px +3px tracking paper — followed by a **six-hole punch-card glyph**: two rows of three 4×4px squares, `gap: 2px`, all paper except the center-bottom hole which is brand red. It is deliberately *not* a hamburger: it opens a broadcast index, not a drawer.
- On the landing page the chrome also carries a **carrier-lock cluster**: four 2.5px equalizer bars animating `eqBar` (scaleY .25→1, 0.7–1.3s, staggered negative delays), a 7px red dot blinking `carrierBlink` (3.7s steps(1), brief dropout at 71–80%), and `CARRIER LOCKED · AUG 11 2026`.

### The four channels

`TODAY` · `THE TIMELINE` · `THE FIVE SEEDS` · `ABOUT`

The timeline's read/map split is a **view toggle inside that destination** (`READ ≡` / `MAP ▦`), not a fifth channel.

---

## Screens

### 01 · Landing (`/`)

**Purpose**: establish the premise, show the live number, introduce the five seeds, push into the timeline.

**Layout** (1400×1070):
- Chrome bar (63px) with carrier cluster.
- **Fresco plate** zoned to the top 452px, full-print multiply.
- **Left**, from y≈128: intro paragraph on a paper slab, `max-width: 440px`, Atkinson Mono 19px/1.5, `rgba(11,11,11,0.7)`, `text-align: justify`.
  > Day zero is 7 August 2068. Forty-two years, told one day at a time. Every entry is invented. Every source is real.
- **Right**, `top: 96px; right: 48px` — the **countdown lockup**. One composed unit whose job is to orient a first-time visitor instantly; do not separate its pieces:
  1. The **odometer** — the day count in Geist 700 at 250px line-height, digits overlapping by `margin-left: -12px`, each digit in an `overflow:hidden` window, `text-shadow: 2px 2px 0 rgba(237,241,242,0.85)`. On mount it starts at `daysLeft + 111` and animates down to the true value after 800ms (a mechanical settle). The number fits fully on the 1400px canvas — it does not bleed off the edge.
  2. Directly beneath, right-aligned: a solid black band (`#0b0b0b`, padding `10px 18px`) reading `DAYS UNTIL THE LAST HUMAN IS CONNECTED` — Oswald 600 23px, +4px tracking, paper text. This label is what makes the hero glanceable; never ship the number without it.
  3. Beneath the band: `DAY ZERO · 7 AUGUST 2068 · COUNTING DOWN DAILY` — Atkinson Mono 11px, +3px tracking, `rgba(11,11,11,0.55)` on a translucent paper slab (`rgba(237,241,242,0.85)`, padding `4px 8px`).
- **Ghost phrase** in the left column **flow** (22px below the intro slab — never absolutely positioned; it must not be able to overlap the intro), 88px clipped: Geist 700 27px uppercase at `rgba(11,11,11,0.32)`, continuously decoding/decaying (see Motion). Cycles four phrases:
  `YOUR BRAIN IS YOUR MOST UNDERUTILIZED ASSET` · `WE CAN TURN THEM OFF` · `SHE DIED ON TUESDAY. HER CHILDREN REMEMBER AUGUST.` · `THERE IS NO FOREST, ONLY SEEDS`
- **Stripe band** at y=452, full-bleed, 132px: `repeating-linear-gradient(115deg, #0b0b0b 0 13px, #EDF1F2 13px 26px)` drifting `stripeDrift 46s linear infinite` (background-position 0 → −287px). Inside, a paper card: `How we get to the Matrix` in Archivo Black 40px, plus `48 days out of 15337 · every source real`.
- **Marquee** at y=584, 38px tall, `marqueeL 68s linear infinite` (translateX 0 → −50%, content duplicated twice). Content: `compute is compute · earn while idle · no chance of escape · now self-employed · the plumbing starts working · why are we waking them up · i'm considerably less dead than i was before · sleeping well, no bad dreams · there is no forest, only seeds ·`
- **Seed row** at y=640: header rule with `FIVE SEEDS ALREADY PLANTED · TOMORROW'S WORLD TODAY`. Then five equal flex columns separated by 1px hairlines; each column is `[100×100 square devotional panel] [18px glyph / seed name / footnote]`. Glyphs animate `glyphBreath 7s ease-in-out infinite` with staggered negative delays (0, −1.4s, −2.8s, −4.2s, −5.6s).
- **CTA row** at bottom 86px: red block (`#B31E2C`, grain canvas) reading `Begin at today` in Geist 700 26px, with `day −15337 · only seeds →`; beside it a paper block with `Follow one seed` and `About` in Oswald 500 15px.
- **Footer** (bottom 0): `48 entries · 5 seeds · 87 real sources` left, `the number only goes down` right.

Seed row copy:

| Seed | Footnote |
|---|---|
| KOMPUTILO* | *the box in your house |
| LABORO* | *who owns the machines |
| CERBO* | *wetware pays the mortgage |
| SONĜO* | *a place a person lives |
| AŬTORITATO* | *nobody is driving |

---

### 02 · Timeline — read view (`/timeline`)

**Purpose**: the primary reading experience. A vertical focus-scroll where one entry is legible and neighbors fade.

**Layout** (1400×1700):
- Chrome bar with `TIMELINE · ALL SEEDS · DEEP READ` and a `MAP VIEW ▦` toggle.
- **No fresco plate** — this is a clinical reading surface.
- Left rail at x=44: a 3px vertical track, `rgba(11,11,11,0.08)`, with a brand-red progress segment and a 15px red dot marking the focused entry (`glyphBreath 5s`), plus a rotated part label (`writing-mode: vertical-rl`) reading `PART I · ONLY SEEDS · 2026 → 2031`.
- **Entry stack**, `flex-direction: column; gap: 44px`, left padding 120px, right 100px:
  - **Focused entry**: full opacity, on a paper band, with a 2.5px red left rule. Day number Geist 700 52px brand red; date line Atkinson Mono 11px; seed chips (22px bordered squares with the seed glyph) right-aligned; body Atkinson Mono 16px/2, `max-width: 720px`; a highlighted sentence uses `background:#B31E2C; color:#EDF1F2; padding:0 6px`; then an `EVIDENCE ▸ 2 DOCUMENTS` button and source names.
  - **Neighbors**: progressively `opacity: 0.32 → 0.13`, `filter: blur(1px → 2.2px)`, `transform: scale(0.94 → 0.87)` with `transform-origin: left center`.
  - **Time-gap markers** between entries: a rule plus Major Mono 17px text, e.g. `300 DAYS PASS · CONTAINMENT IMPROVES · SO DO THE AGENTS`.
- Top and bottom gradient masks (paper → transparent) fade the stack in and out.
- Progress footer (ink): `ENTRY 2 OF 48 · PART I OF V · SCROLL TO ADVANCE ONE DAY` and a 600px progress bar with a red fill and `4%`.
- **Scrubber** pinned to the bottom (see *The Scrubber*).

---

### 03 · Timeline — map view (`/timeline?view=map`)

**Purpose**: see all 48 entries and all five seed threads at once.

**Layout** (1400×1230), ground `#0b0b0b`:
- Same chrome, inverted for dark.
- The timeline is drawn as a **punch card**: a grid where columns are entries and rows are the five seeds. A filled cell means that entry belongs to that seed; cells pulse `cellPulse` at low opacity. Part boundaries (I–V) are labeled across the top; day zero is marked in signal yellow.
- Row labels use the seed's **dark-surface** color variant.
- Footer + scrubber as on read view.

---

### 04 · Entry detail / day page (`/day/[dayNumber]`)

**Purpose**: one entry, its sources, and navigation to adjacent days.

**Layout** (1400×1450):
- Chrome bar.
- **Day box** top-right (`top: 90px; right: 60px`): `5px solid #B31E2C` frame on paper, `DAY −14500` in Geist 700 42px brand red, and beneath, centered, `NOVEMBER 25 2028 · 839 DAYS FROM NOW` in Atkinson Mono 11px.
- **Title**: Geist 700, uppercase, animated in on the word-blur effect (`blurWords`).
- **Seed tag**: 32px black square holding the seed glyph in paper, then `AŬTORITATO*` in Oswald 600 14px with the footnote in `rgba(11,11,11,0.5)`.
- **Body**: Atkinson Mono 16px/2, `max-width: 720px`, right padding 340px to clear the day box. Highlighted sentence uses the red-block treatment.
- **Echo phrase**: a low-contrast Geist 700 32px line at `rgba(11,11,11,0.18)`, continuously corrupting: `IT OPTIMIZED CONTINUITY · IT OPTIMIZED CONTINUITY · IT OPTIMIZED`.
- **Right margin column**: a 170px column of 9px `rgba(...,0.07)` monospace text repeating the entry's key phrases — printed-through-the-page ghosting.
- **EVIDENCE section**: label in a 2.5px bordered block, Oswald 700 22px +4px tracking; caption `this part is not fiction · published before AUG 11 2026 · 2 documents`; then evidence cards in a flex row, each `2.5px solid #0b0b0b` on paper with a signal-yellow `EXHIBIT A/B` tab overhanging the top-left (`top:-12px; left:14px`), Oswald 500 16px summary, and an Atkinson Mono 10px citation line that occasionally corrupts.
- **Prev/next**: two full-width halves at the bottom — previous on ink, next on brand red, each with a kicker (`◄ EARLIER · DAY −14800`, `LATER · DAY −14200 ►`) and a Geist 600 22px title.
- **Meta line**: `ENTRY 4 OF 48 · READING FORWARD FROM TODAY` left, `④ WAKE UP ✕` in brand red right.
- **Scrubber** pinned to the bottom.

---

### 05 · Seeds index (`/seeds`)

**Purpose**: explain what the seeds *are* — five real, currently-underway trends — and route into each.

**Layout** (1400×~1400):
- Chrome bar with `THE FIVE SEEDS`.
- **Fresco plate** zoned to the hero band, full-print multiply.
- **Hero**, on paper slabs: `Nothing here is science fiction — yet.` in Geist 700 (the word `yet` in brand red), with the standing text-shadow.
- Explanatory copy, Atkinson Mono, ≤720px measure. The argument: each of the five is separately reasonable and already funded; the story is what happens when they **interlock**. Nothing requires a machine that hates you — only markets, insurers, voters and institutions behaving as they always have.
- **Five seed rows**, each: square devotional panel, glyph, seed name in its color, the footnote, an entry count and span (`15 entries · 2046 → day 0`), and a `▸` affordance. Rows are separated by 1px hairlines.
- Ink footer: `EVERY THREAD ENDS ON THE SAME DAY` / `ALL 48 ▸`.

---

### 06 · Seed profile (`/seeds/[slug]`)

**Purpose**: one seed's full thread.

**Layout** (1400×1280) — paper ground with a zoned fresco hero (this replaced an earlier dark pigment-field version):
- Chrome with `← ALL FIVE SEEDS`.
- **Left column (260px)**: the square devotional panel on a paper slab, and beneath it a museum-style caption:
  `PANEL III OF V · CERBO` / `BIOCOMPUTING · pigment on data`
- **Center**: kicker `SEED 03 OF 05 · BIOCOMPUTING`; the seed name in **Geist 700 96px, letter-spacing −4px**, in the seed color, beside a 34px glyph, on a paper slab; the footnote in Oswald 500 20px +3px tracking; then the definition paragraph (Atkinson Mono 14px/1.9, ≤600px) and a pull-quote with a 2.5px left rule in the seed color.
- **Right column (210px)**: a bordered stat card — glyph + `TAXON 03`, then Major Mono 16px stats (`15 ENTRIES / FIRST · 2046 / LAST · DAY 0 / SPAN · 22 YRS`), then a `Follow only this seed ▸` button filled with the seed color.
- **The thread**: a full-width table under a rule (`THE THREAD · HOW A MEDICAL DEVICE BECOMES A MORTGAGE PAYMENT BECOMES A POD`). Each row: day number (Major Mono 19px, 120px wide) · year (90px) · title (Geist 600 17px uppercase) · note (Atkinson Mono 11px, right). The **day-zero row is filled brand red** with paper text and a signal-yellow note. Below: `+ 7 MORE ENTRIES IN THIS THREAD`.
- **Prev/next seeds** at the bottom: ink half and paper half.

---

### 07 · About (`/about`)

**Layout** (1400×1250):
- Chrome with `ABOUT THIS TRANSMISSION`.
- **Fresco plate** zoned to the top 620px.
- **Manifesto** on a paper slab: `This is a work of / speculative fiction. / The footnotes are not.` — Geist 700 66px, line-height 1.02, letter-spacing −2.5px, the third line in brand red.
- Two explanatory paragraphs on slabs, ≤680px measure.
- **Stripe band** with `The number only goes down` in Archivo Black 28px.
- **Four numbered cards** (`①②③④`), 2.5px bordered, the fourth filled brand red with grain:
  1. **Begin at today** — the timeline always starts on the day you arrive. The countdown is live. It was different yesterday.
  2. **Follow one seed** — five threads run through the story; each is a complete story on its own.
  3. **Check the sources** — every entry carries EVIDENCE: the real documents the fiction grows from.
  4. **Wake up ✕** — the seeds are real and being planted now. Which futures get built is still a choice. For now.
- Ink footer: `48 ENTRIES · 5 SEEDS · 87 SOURCES · 2026 → 2068` / `© W.A.K.E. PRODUCTS LTD 2068`.

---

### 08 · CHANNELS overlay (open state)

**Purpose**: primary navigation. A full-takeover broadcast index.

**Layout**: the chrome bar stays fixed and visible; the trigger swaps to a brand-red `CLOSE ✕` block with the same punch glyph (center hole ink). Everything below the bar is replaced by an ink panel:
- **Right edge**: a 270px strip of a fresco plate at `mix-blend-mode: screen; opacity: 0.5; filter: saturate(1.3)` — the humanist motif inverted for dark. Beside it, a 10px vertical signal-yellow diagonal stripe band.
- **Destinations**, `padding: 64px`, `max-width: 900px`, each row: ordinal in Major Mono 14px `rgba(237,241,242,0.35)` (40px column) · title in **Geist 700 48px, line-height 1.08, letter-spacing −2px, uppercase** · meta in Atkinson Mono 11px. The current destination's meta is brand-red-on-dark (`#E8556A`); others are `rgba(237,241,242,0.4)`.

| # | Destination | Meta |
|---|---|---|
| 01 | Begin at today | day −15337 |
| 02 | The timeline | 48 entries · read ≡ or map ▦ |
| 03 | The five seeds | five threads · one ending |
| 04 | About | the footnotes are not fiction |

- **Panel footer**: `ESC OR ✕ TO CLOSE · CARRIER LOCKED · AUG 11 2026` / `THE NUMBER ONLY GOES DOWN`.

**Critical**: `line-height: 1.08` on the destination spans and a `min-height: 52px` on their containers. Without both, rows shift vertically as scrambled text arrives.

---

### 09 · Mobile (390×844)

Three key screens are specified; the rest follow the same reductions.

**Shared mobile chrome**: 12px/16px padding, 2px bottom rule. Wordmark stacked over a context line (Oswald 11px over Atkinson Mono 9px). Right side: the day count in Major Mono 13px and a **glyph-only** CHANNELS trigger (3.5px squares, `padding: 7px 8px`).

- **Landing**: plate zoned to a 300px band; count reduced to Geist 700 54px on a slab with `DAYS UNTIL THE LAST HUMAN IS CONNECTED` beneath (Oswald 600 10px, +2px tracking); intro paragraph 12px/1.65; stripe band 64px with Archivo Black 17px; the five seeds become a **vertical list** — 52×52 square panel, seed name, footnote, `▸`; bottom CTA bar in brand red.
- **Day page**: day number Geist 700 30px, date beneath; title Geist 700 34px; seed tag 24px; body 12.5px/1.85; a single evidence card; and the **scrubber docked to the bottom** at 86px tall with a 16px margin, plate at 14px, `TODAY` / `DAY 0` end labels only.
- **Seeds index**: plate zoned to 230px; hero Geist 700 30px on a slab; explanatory paragraph; the same five-row vertical list with entry counts; ink footer.

Touch targets are ≥44px throughout.

---

### 10 · System page

An internal spec page (not shipped) documenting type, color, chrome anatomy, motion table, the eight plates, and a **BUILD NOTES — LIVE SITE** table (canvas + breakpoints, spacing scale, countdown math, font loading, layer model, routes + state, the scrubber contract, assets, accessibility, performance budget). Its content is reproduced and expanded in this README.

---

## The Scrubber

The most interaction-sensitive component. It appears on **all three timeline surfaces** (read view, map view, day page), pinned to the bottom.

### Anatomy

```
┌ ink ─────────────────────────────────────────────────────────────┐
│ GRAB AND DRAG · ◄ ► STEPS ONE ENTRY      27th · PART III · June 4, 2051 │
├──────────────────────────────────────────────────────────────────┤
│                    ┌────────┐                                     │
│                    │ −6100  │  ← readout plate (Geist 600 19px)   │
│                    └───▼────┘                                     │
│                        │      ← 2px stem                          │
│                       (◉)     ← bearing: 18px black disc,         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  3px track          │
│  ││││ ││ │││││ ││││││ ││││││││ ││││││││││││││  ← 48 entry ticks   │
│  TODAY   PART I    PART II   PART III  PART IV  PART V      0     │
└──────────────────────────────────────────────────────────────────┘
```

- **Track**: 3px, `rgba(237,241,242,0.16)`, radius 2px. Fill from 0 to the handle in brand red with `box-shadow: 0 0 10px rgba(179,30,44,0.75)`.
- **Readout plate**: brand red, radius 3px, `border: 1px solid rgba(255,255,255,0.22)`, `box-shadow: 0 0 16px rgba(179,30,44,0.6), inset 0 1px 0 rgba(255,255,255,0.18)`, padding `6px 16px 5px`. Contains a **grain canvas** at `mix-blend-mode: overlay; opacity: 0.55` — the same film grain as the CTA. Text: **Geist 600 19px, letter-spacing 0.5px, paper, nowrap**.
- Below the plate: a 14px-wide CSS triangle pointer in brand red with `drop-shadow(0 3px 5px rgba(179,30,44,0.5))`, then a 2px stem, then the **bearing**: concentric — 18px black disc with a red glow, a 15px ring `2.5px solid #B31E2C`, and a 7px white center dot.
- **Part labels** at `top: 86px` in Atkinson Mono 9.5px `rgba(237,241,242,0.3)`, positioned at 0%, 9%, 26%, 47%, 68%, 84%. Right end shows `0` in signal yellow over `AUG 7 2068`.
- Above the track, a status line: left `GRAB AND DRAG · ◄ ► STEPS ONE ENTRY`, right `{ordinal} · {part} · {full date}`.

### Tick geometry

48 ticks, one per entry. **Position is story-weighted, not calendar-weighted** — entries cluster where the years compress:

```js
tickX(i) = 2 + Math.pow(i / 47, 1.15) * 96   // → percent
```

Every 6th tick (and the last) is **major**: 1.5px wide, base height 13px, with a Major Mono label. Minor ticks are 1px, base height 7px. Day zero's tick is signal yellow.

**Magnet field** — ticks within 7% of the handle grow and brighten, so you feel an entry before you land on it:

```js
near = Math.max(0, 1 - Math.abs(tickX(i) - handlePct) / 7)
height = (major ? 13 : 7) + near * (major ? 9 : 15)   // both reach 22px
opacity = 0.22 + near * 0.6
```

### Interaction rules

These were iterated hard; each one fixes a specific complaint.

1. **Relative dragging, never a jump.** `pointerdown` records `startX` and the handle's current position and sets `dragging: true` — it does **not** move the handle. Movement is `startPct + (clientX - startX) / trackWidth * 100`, clamped 0–100. A click therefore cannot teleport the reader to another decade.
2. **Pointer capture** (`setPointerCapture`) keeps the drag alive outside the bar.
3. **The readout never lies.** During a drag the handle follows the pointer continuously (`frac`), but the displayed day number is always `entries[nearestTo(frac)]` — the entry you would land on. It changes only as you cross a tick, so pressing, holding and releasing never move the number by surprise.
4. **Text waits for release.** Entry title, part, ordinal, date and body update only on `pointerup`. Numbers reward the drag; text never strobes.
5. **On release** the handle animates to the committed tick over `240ms cubic-bezier(0.16,0.84,0.24,1)`; during the drag the transition is `none`.
6. **Title decode on commit**: the new title resolves with the landing page's exact ghost-phrase scramble — same glyph set, **42ms frame, 2 characters per frame**.
7. **Keyboard**: the track is focusable (`tabIndex=0`); `◄`/`►` step one entry and commit immediately.
8. **Grab/hover feedback** over 180ms `cubic-bezier(0.2,0.8,0.3,1)`: bearing `scale(1.22)` while dragging (`1.12` on hover), readout plate `scale(1.05)`, cursor `grab` → `grabbing`, and two expanding ripple rings (`ripple 1.5s ease-out infinite`, second offset 0.55s) appear only while dragging.
9. `touch-action: none` on the track; `user-select: none`.

---

## Motion

| What | Timing | Curve / detail |
|---|---|---|
| Menu open — panel | 140ms | `menuIn`: blur 14px → 0, opacity 0 → 1, ease-out |
| Menu open — destinations | 30ms/frame | ghost scramble, 4 chars per frame, rows staggered 30ms; settled ≤300ms |
| Menu close | 310ms total | rows erode bottom-up (5 chars/frame, 26ms stagger, reverse order), panel blurs out, then unmount |
| Entry title on scrub release | 42ms/frame | ghost scramble, 2 chars per frame |
| Scrubber handle release | 240ms | `cubic-bezier(0.16,0.84,0.24,1)` |
| Scrubber grab / hover | 180ms | `cubic-bezier(0.2,0.8,0.3,1)` |
| Ghost phrases, ticker, citations | 42ms/frame | continuous decode then decay |
| Word-blur intro (`wordIn`) | 0.9s | `cubic-bezier(.2,.8,.2,1)`, 0.13s stagger per word, from `opacity:0; blur(10px); translateY(14px)` |
| Line cycle (`lineCycle`) | 8s | holds to 88%, fades out by 97% |
| Odometer settle | 800ms after mount | count starts at `daysLeft + 111`, lands on true value |
| Stripe drift | 46s linear infinite | background-position 0 → −287px |
| Marquee | 68s linear infinite | translateX 0 → −50%, content duplicated |
| Glyph breath | 7s ease-in-out infinite | scale 1 → 1.035, opacity .9 → 1; staggered negative delays |
| Carrier blink | 3.7s `steps(1)` infinite | opacity 1, dropout at 71–80% |
| Equalizer bars | 0.7–1.3s ease-in-out | `scaleY(.25 → 1)`, `transform-origin: bottom` |
| Cell pulse (map) | — | opacity .25 → 1 |
| Film grain | 90ms interval | full canvas redraw, alpha 55–80 |

### The scramble (used in three places — implement once)

```js
const GLYPHS = '▓▒░█<>/#%0123456789·—';

// resolve: characters lock left-to-right; unresolved positions show random glyphs;
// spaces always stay spaces.
function frame(target, progress) {
  let out = '';
  for (let i = 0; i < target.length; i++) {
    out += i < progress ? target[i]
         : (target[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
  }
  return out;
}
```

- Entry titles: `progress += 2` every **42ms**.
- Menu rows: `progress += 4` every **30ms**.
- Menu close (erode): characters unlock right-to-left, `progress += 5` every frame, resolved positions become a space 55% of the time.

Wrap all of this in `prefers-reduced-motion` guards: skip scrambles (set final text immediately), freeze grain, stop marquee/stripe drift, disable ripples.

---

## State Management

**Global / app-level**
- `daysLeft: number` — `Math.ceil((Date.UTC(2068,7,7) - Date.now()) / 86400000)`. Recomputed at local midnight + 2s via a scheduled timer, so an open tab ticks over.
- `frescoIdx: number` — read from `localStorage['omFrescoIdx']`, incremented mod 8 on load, written back. Each screen consumes `pool[(frescoIdx + offset) % 8]`.
- `menuPhase: 'closed' | 'open' | 'closing'` and `menuRowText: string[4]`.

**Timeline / scrubber**
- `idx: number` — the entry the handle currently reads (0–47).
- `committed: number` — the entry actually displayed. Diverges from `idx` during a drag.
- `frac: number | null` — the handle's free position in percent while dragging; `null` snaps it to `tickX(idx)`.
- `dragging: boolean`.
- `titleText: string` — the scrambling title buffer.

**Ambient**
- `ghostPhrase`, `echoPhrase`, `ticker`, `citationA` — scramble buffers on independent timers.
- `odo: number` — odometer display value.
- `blurKey: number` — increments to replay the word-blur intro.

**Data fetching**: all content is static — build the site from the two JSON files below. No runtime API.

---

## Wiring to the real data

Production content lives in two JSON files, included in this bundle under `data/`. **The JSON is the source of truth**; the 48-title array embedded in the mock's script was a design-time subset for canvas space. Ship the site so adding, editing, or reordering JSON entries requires zero code changes.

```
data/matrix_reverse_timeline.json    ← the timeline · currently 59 entries, and growing
data/matrix_seed_descriptions.json   ← the five seeds · { id, name, description }
```

### Timeline entry schema

```jsonc
{
  "date": "2068-08-07",              // ISO date, UTC
  "dayNumber": 0,                    // 0 at day zero; NEGATIVE before it (−15341 … 0)
  "title": "Biological Participant Infrastructure",
  "text": "…\n\n…",                  // plain text; \n\n is a paragraph break
  "links": [                          // 1–13 per entry, never empty
    {
      "url": "https://…",
      "description": "What the real document is.",
      "relevance": "Why it grounds this fictional beat."
    }
  ],
  "seeds": ["distributed_compute"]    // 1–5 seed ids (see mapping below)
}
```

File order is day 0 first (reverse chronological). **Sort ascending by `date` at build time** — that is the reading order everywhere.

### Seed id mapping — the contract between data and design

| JSON id | Display name | Route slug | Footnote | Color / on-dark |
|---|---|---|---|---|
| `distributed_compute` | KOMPUTILO* | `komputilo` | *the box in your house | `#2A5EA8` / `#7FAAE8` |
| `labor_and_compute_ownership` | LABORO* | `laboro` | *who owns the machines | `#B8860B` / `#E3B44A` |
| `biocomputing` | CERBO* | `cerbo` | *wetware pays the mortgage | `#1F7A6B` / `#4FC2AC` |
| `neural_interfaces_and_simulation` | SONĜO* | `songo` | *a place a person lives | `#6A4C93` / `#B199D6` |
| `agent_autonomy_and_machine_governance` | AŬTORITATO* | `autoritato` | *nobody is driving | `#7A1E28` / `#E8556A` |

`matrix_seed_descriptions.json` supplies each seed's long `description` — it is the definition paragraph on the seed profile. The one-line summaries on the seeds index are its first sentence (or add an editorial `summary` field).

### Build-time transform

Run one normalization pass at build; components consume only its output.

1. **Display day number** — `Math.abs(dayNumber)` prefixed with minus sign **U+2212**: `DAY −14500`. Never render the JSON's ASCII hyphen; never add thousands separators.
2. **Countdown / TODAY** — `daysLeft = Math.ceil((Date.UTC(2068,7,7) − Date.now()) / 86400000)` in UTC. Today's timeline position is `−daysLeft`; the `YOU ARE HERE` row and the scrubber's default handle position sit between the two entries bracketing that value.
3. **Dates** — format the `date` field with `{ timeZone: 'UTC' }`. Validate at build: `dayNumber === (Date.UTC(entry.date) − Date.UTC('2068-08-07')) / 86400000`; **fail the build** on mismatch (local-time arithmetic drifts across DST).
4. **Parts I–V** — not in the JSON; they are a design-side grouping. Derive from entry year, or (better) stamp an explicit `part` field in the transform and commit it:
   `I · Only Seeds` ≤ 2031 · `II · The Ownership Turn` 2032–2039 · `III · The Wet Economy` 2040–2058 · `IV · The War Nobody Named` 2059–2062 · `V · The Quiet Transition` ≥ 2063.
   The year spans and entry counts printed in part headers (`2046–2056 · 13 ENTRIES`) are **computed from data**, not copied from the mock.
5. **Evidence cards** — `links[]` → exhibits lettered A, B, C… in array order. Card headline = `description`; citation line = URL hostname + ` · ` + `relevance`. Entry detail shows the first 2 cards; the rest collapse behind `+N MORE DOCUMENTS`. The `EVIDENCE ▸ N DOCUMENTS` count is `links.length`. All external: `target="_blank" rel="noopener"`.
6. **Time-gap markers** (read view) — gap = `dayNumber` delta between adjacent entries; render a marker when gap ≥ 100: `{gap} DAYS PASS · {gapNote}`. `gapNote` is editorial (optional field on the later entry); omit the suffix when absent.
7. **Highlighted sentence** (the red-block treatment) — editorial, not derivable. Optional `highlight` field: an exact substring of `text`; wrap its first occurrence. Skip when absent.
8. **Thread notes** (seed profile right column, e.g. `biology becomes an accelerator`) — optional `note` field per entry.
9. **Every count is computed** — the mock's `48 ENTRIES · 5 SEEDS · 87 SOURCES` is placeholder. Real values: `entries.length` (59 today), `seeds.length` (5), count of **unique** link URLs (28 today). Same for per-seed stat cards (`N ENTRIES / FIRST · year / LAST · DAY 0 / SPAN · N YRS`) — filter by seed membership and compute. Same for the CHANNELS meta line and the landing stripe caption.
10. **Scrubber ticks** — one per entry: `entries.length` ticks, not a hardcoded 48. Position formula generalizes to `x(i) = 2 + (i / (N − 1))^1.15 × 96` (%).
11. **Map view** — columns are entries in ascending order; a cell is filled when `entry.seeds` includes that row's seed id; the day-0 column renders in signal yellow.

### Validation (fail the build, loudly)

- exactly one entry with `dayNumber === 0`; all `dayNumber`s unique; dates parse and match their `dayNumber`
- every `seeds[]` value is one of the five known ids; every entry has ≥ 1 link with a valid URL
- optional editorial fields, when present, are well-formed (`highlight` is a substring of its `text`; `part` ∈ I–V)

### Suggested editorial extensions (all optional)

The design uses four things the JSON does not yet carry — safe to add incrementally; the transform must tolerate their absence: `highlight` (string), `gapNote` (string), `note` (string), `part` ("I"–"V") on entries; `summary` (string) on seed descriptions.

## Design Tokens

```css
/* Color */
--paper:        #EDF1F2;
--ink:          #0b0b0b;
--body-ink:     #1a1a1a;
--red:          #B31E2C;
--red-on-dark:  #E8556A;
--yellow:       #E3D51F;

--seed-komputilo:   #2A5EA8;  --seed-komputilo-dark:   #7FAAE8;
--seed-laboro:      #B8860B;  --seed-laboro-dark:      #E3B44A;
--seed-cerbo:       #1F7A6B;  --seed-cerbo-dark:       #4FC2AC;
--seed-songo:       #6A4C93;  --seed-songo-dark:       #B199D6;
--seed-autoritato:  #7A1E28;  --seed-autoritato-dark:  #E8556A;

/* Rules */
--rule-major: 2.5px solid #0b0b0b;
--rule-minor: 1px solid rgba(11,11,11,0.12);

/* Spacing */
--gutter: 48px;          /* desktop page margin */
--gutter-mobile: 16px;
--chrome-y: 18px;
--gap-section: 48px;
--gap-row: 20px;

/* Type sizes actually in use */
96, 66, 52, 48, 44, 42, 40, 34, 32, 30, 29, 26, 22, 20, 19, 18, 17, 16, 15,
14, 13, 12, 11, 10.5, 10, 9.5, 9 px   /* 9px floor — nothing smaller anywhere */

/* Radius */
--radius: 0;             /* everything except: */
--radius-plate: 3px;     /* scrubber readout */

/* Shadows — the only two in the system */
--glow-red:  0 0 16px rgba(179,30,44,0.6);
--glow-rail: 0 0 10px rgba(179,30,44,0.75);

/* Text shadow for Geist on a fresco plate */
--plate-text-shadow: 1px 1px 0px #FFFFFFB7;
```

---

## Assets

All in `humanist/` (copied into this bundle):

**Fresco plates** — 8 baked CMYK-halftone PNGs, 2000px wide. Source photographs are Unsplash (Calvin Craig, Ezgi Deliklitas, Albert Canite, Lorenzo Turroni, mana5280, Rhamely, Sebastiano Raciti, Sui Xu) of Renaissance frescoes; **verify licensing before shipping** and re-bake from licensed sources if needed. The halftone bake is a canvas process: per-channel dot screens at C 15° / Y 0° / K 45°, ~5–7px cells, dot radius `cell * 0.58 * sqrt(value)`, drawn with `globalCompositeOperation: 'multiply'` over a `#f4f1ea` ground.

**Devotional seed panels** — 5 square PNGs (1:1):
```
komputilo_icon.png    → KOMPUTILO
laboro_icon.png       → LABORO
cerbo_icon.png        → CERBO
songo_icon.png        → SONĜO
autoritato_icon.png   → AŬTORITATO
```
`object-fit: cover; object-position: center` with the dark 2px frame + soft shadow (see *Devotional seed panels*).

**Seed glyphs** — inline SVG, 34×34 viewBox, stroke-width 2–2.5, drawn in the seed color. Definitions are in the HTML (search for the seed name).

**Fonts** — Google Fonts (see Type).

---

## Files

```
design_handoff_ai_countdown/
├─ README.md                      ← this document
├─ AI Countdown Final.dc.html     ← the definitive mock: all 10 screens
├─ AI Countdown Nav.dc.html       ← navigation explorations (menu concepts, scrubber study)
├─ AI Countdown Living.dc.html    ← visual-language explorations (fresco/halftone studies)
├─ humanist/                      ← all image assets (8 fresco plates + 5 square seed panels)
└─ data/
   ├─ matrix_reverse_timeline.json    ← the real timeline content (source of truth)
   └─ matrix_seed_descriptions.json   ← the five seeds' canonical descriptions
```

**`AI Countdown Final.dc.html` is the source of truth.** Open it in a browser: screens are stacked and labeled `01 · LANDING` through `10 · SYSTEM`. The countdown and the scrubber are live — grab the handle and drag it to feel the intended interaction before implementing. Reload to see the fresco plates rotate.

The two exploration files are included for context on *why* things are the way they are (rejected glow halos, rejected translucent washes, rejected hamburger menu, earlier scrubber geometry). Do not implement from them.

Ignore `support.js` and the `<x-dc>` / `{{ }}` / `<sc-for>` syntax entirely — that is design-tool scaffolding, not an architecture to reproduce.

---

## Responsive behavior

Desktop mocks are drawn at 1400px. Between 1400px and mobile, the intent is:

- The chrome bar, stripe bands, marquee, and scrubber are full-bleed and fluid.
- Content columns hold their **measure** (45–75ch) and center; gutters absorb the extra space.
- The landing seed row goes 5-up → 3-up → vertical list below ~900px.
- Entry detail's day box moves from a floating top-right box to inline above the title below ~1000px, and the right ghost-text column drops.
- The map view scrolls horizontally on narrow viewports rather than compressing columns.
- The scrubber keeps its full tick set at all widths; only the part labels drop below ~600px.
