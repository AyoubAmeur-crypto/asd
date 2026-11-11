# ALL-STAR DEBATE IV (ASD IV 2026)

Official event website and stage chronometer interface for **ALL-STAR DEBATE IV**, organized by **The Great Debaters ENSA Fès (TGD)**.

Built with **Next.js (App Router), TypeScript, Tailwind CSS, GSAP / ScrollTrigger, and Lucide Icons**.

---

## 1. Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public landing page, or [http://localhost:3000/timer](http://localhost:3000/timer) for the dedicated stage chronograph console.

### Production Build & Verification

```bash
npm run build
npm run start
```

### Run Chronograph & Logic Test Suite

```bash
node scripts/test-timer.js
```

---

## 2. Architecture & Experiences

The website provides two cohesive experiences:

1. **Public Landing Page (`/`):**
   - **Hero:** Anton display headline, official white ASD logo, Edition 2026 badge, theme introduction, featured orator visual, and organizer signature.
   - **Kinetic Marquee:** Continuous marquee ticker with themes, formats, and event mottos.
   - **About ASD:** Trilingual Moroccan university championship overview, key stats (18 debaters, 3 arenas, 8-minute speeches, 4 editions).
   - **The Theme (2026):** *THE DECEPTION OF TRUTH: WE ARE ALL FOOLS*. Three conceptual pillars: *Truth* (الحقيقة), *Illusion* (الوهم), *Perception* (الإدراك).
   - **The Three Confrontations:** Official motions and verified team rosters for the English, French, and Arabic arenas. Rendered with clean typographic avatars (no participant portraits in roster cards).
   - **Previous Editions & Gallery:** Asymmetric editorial photo exhibition using authentic photography from previous editions (podium speeches, jury deliberation, audience reactions, and awards ceremonies).
   - **The Debate Experience (WSD Format):** Comprehensive breakdown of World Schools Debate rules, protected minutes, Points of Information (POIs), and reply speeches.
   - **Live Timer Preview:** Embedded debate console allowing spectators or moderators to test the clock directly.
   - **Media & Socials:** Verified links to official Instagram (`@allstardebate`) and YouTube (`@TheGreatDebatersENSAF`).
   - **Organizer Signature & Footer:** The Great Debaters ENSA Fès attribution with the official transparent club podium emblem, navigation links, and *“MAY THE BEST WIN”* motto.

2. **Dedicated Live Debate Timer (`/timer`):**
   - **18 Independent Debaters:** 6 speakers per language section across Government and Opposition.
   - **WSD Standard & Reply Timing:** Configurable toggle between 8-minute standard speeches and 4-minute reply speeches.
   - **Classic Chronograph Design:** High-contrast bezel, 60 mechanical tick marks, cardinal axes, concentric tracks, and smooth 60s sweep indicator.
   - **Dual Warning & Overtime System:**
     - `00:00 – 04:59`: Standard warm-amber/cream digits and dial.
     - `05:00`: Visible amber-red warning indicator and status change.
     - Strictly past `08:00` (or `04:00` for reply): Glowing red (`#E0443E`) overtime state, counting upward indefinitely until paused.
   - **Wall-Clock Accuracy:** Elapsed time is calculated using timestamps (`Date.now()`) plus accumulated milliseconds, remaining drift-proof even when browser tabs are inactive or devices sleep.
   - **Local-First Persistence:** Names, speech modes, and elapsed timers persist across page reloads via `localStorage`.
   - **Single-Floor Lock (Exclusive Mode):** Optional toggle ensuring only one debater speaks on the floor at a time.
   - **Stage Projection (Focus Mode):** Fullscreen modal dialog (`<dialog closedby="any">` with fallback) designed for stage projectors and podium monitors.
   - **Confirmation Modals:** Reset operations require explicit confirmation to avoid accidental clearing during live debate rounds.

---

## 3. Visual Identity & Palette

Inspired by the editorial direction and geometric typography of Figma frame `14:2277` (Signal Summit) while adopting ASD's warm-amber palette:

| Token | Hex | Role |
|---|---|---|
| Primary Background | `#0B0B0C` | Deep dark foundation |
| Warm Amber | `#F0A526` | Primary brand accent and action CTAs |
| Burnt Orange | `#D87825` | Gradients, badges, and secondary accents |
| Cream White | `#F6F0E5` | High-contrast editorial headlines & text |
| Muted Gray | `#A8A29B` | Supporting labels, rules, and captions |
| Deep Brown | `#25150D` | Atmospheric cards and backgrounds |
| Overtime Red | `#E0443E` | Chronograph overtime warning state |

### Typography

- **Anton** (`next/font/google`): Giant display headlines and section titles.
- **DM Sans** (`next/font/google`): Editorial copy and navigational elements.
- **Space Mono** (`next/font/google`): Timers, micro-labels, and stats.

---

## 4. Official Content & Participants

Sourced directly from the official dossier (`docs/ASD_IV_OFFICIAL_CONTENT.md` and `content/asd-iv.json`):

- **English Section:**
  - *Motion:* "TH, as the last generation with access to humanity's unaltered history, would erase it and allow future generations to construct their own understanding of the past." (Value motion)
  - *Government:* Lina Detsouli (1), Ibtihal Toufik (2), Yassmine Abouali (3)
  - *Opposition:* Rhita Tarhzouti (1), Mohammad Mahjoubi (2), Mariam Chihabi (3)
- **French Section:**
  - *Motion:* "Cette assemblée croit que les sociétés ont davantage besoin de récits communs que de vérités communes."
  - *Gouvernement:* Yousra Badaoui (1), Mehdi Dinari (2), Aya Taghzouti (3)
  - *Opposition:* Imane Gouzi (1), Ismail Chakir (2), Mohammed Boukharta (3)
- **Arabic Section:**
  - *Motion:* "يؤمن هذا المجلس بأن المجتمعات العربية تعيش في عوالم سياسية متوازية : عالم تحتفي فيه بما ترفضه في واقعها."
  - *الموالاة:* Abderrahmane Lefzari (1), Soumaya Hte (2), Salma Alloul (3)
  - *المعارضة:* Riad Tajeddine (1), Douae Essat (2), Abdelaali Mouid (3)

---

## 5. Adding New Photos to the Gallery

The photographic gallery is data-driven through `lib/gallery.ts` and `public/assets/`:

1. Copy the new image file (e.g. `NEW_PHOTO.JPG`) into `public/assets/`.
2. Open `lib/gallery.ts`.
3. Add a new item to `GALLERY_ITEMS`:
   ```ts
   {
     id: 'new-photo-id',
     src: '/assets/NEW_PHOTO.JPG',
     title: 'Descriptive Title',
     category: 'podium', // 'podium' | 'audience' | 'jury' | 'ceremony' | 'atmosphere'
     caption: 'Detailed editorial caption.',
     orientation: 'landscape', // 'landscape' | 'portrait'
   }
   ```
4. If this should replace the hero or featured about image, update `HERO_FEATURED_IMAGE` or `ABOUT_FEATURED_IMAGE`.
5. Run `npm run build` to verify Next.js image optimization.
