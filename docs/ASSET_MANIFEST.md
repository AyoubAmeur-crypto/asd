# ASD IV — Asset & Media Manifest

Authoritative inventory and provenance documentation for visual assets used across **ALL-STAR DEBATE IV (2026)**.

## 1. Official Logos

| File Name | Format | Dimensions | Usage | Provenance / Attribution |
|---|---|---|---|---|
| `public/assets/logo-white.png` | PNG (RGBA) | 1683 × 1226 | Primary header wordmark, hero branding, and footer emblem on dark backgrounds. | Official All-Star Debate event identity (star with microphone). Supplied by organizer. |
| `public/assets/logo-black.png` | PNG (RGBA) | 1683 × 1226 | Alternative high-contrast ASD emblem for light background contexts. | Official All-Star Debate event identity. Supplied by organizer. |
| `public/assets/logo tgd no bg.png` | PNG (RGBA) | 1088 × 1360 | Organizer signature in header, hero, and dedicated footer section. | Official The Great Debaters ENSA Fès club emblem (rostrum with dual microphones). Transparent background. |
| `public/assets/png.png` | PNG (RGBA) | 612 × 612 | Solid dark variant of The Great Debaters ENSA Fès club emblem. | Official The Great Debaters ENSA Fès identity asset. |

---

## 2. Official Event Photography Inventory

All photographs below are authentic images from previous All-Star Debate editions organized by The Great Debaters at ENSA Fès.

| Asset File | Native Dimensions | Category | Orientation | Current Placement & Purpose |
|---|---|---|---|---|
| `Copy of IMG_4476.JPG` | 3456 × 2304 | Podium / Speech | Landscape | **Hero Featured Image**: University debater in checkered suit speaking passionately at rostrum with amphitheater screen behind. |
| `Copy of IMG_4712.JPG` | 3456 × 2304 | Ceremony / Stage | Landscape | **About / Gallery Lead**: Full stage delegation lineup holding certificates with official All-Star Debate backdrop. |
| `Copy of IMG_4622.JPG` | 3456 × 2304 | Jury / Adjudication | Landscape | **Gallery Lead (The Critical Bench)**: Adjudicators scrutinizing arguments, note-taking in row with badges. |
| `Copy of IMG_4568.JPG` | 3456 × 2304 | Podium / Speech | Landscape | **Gallery Item (Rhetoric & Conviction)**: Orator at podium with microphone and Moroccan flag. |
| `DSC_1475.JPG` | 4496 × 3000 | Ceremony / Awards | Portrait | **Gallery Item (Triumph & Recognition)**: Debaters celebrating with trophies, medals, and ASD banner. |
| `Copy of IMG_4593.JPG` | 3456 × 2304 | Atmosphere / Focus | Landscape | **Gallery Item (The Anatomy of Refutation)**: Debater in deep contemplation listening to opposing case. |
| `Copy of IMG_4451.JPG` | 3456 × 2304 | Atmosphere / Strategy | Landscape | **Gallery Item (Real-Time Cross-Analysis)**: Rapid refutation note-taking during active floor clash. |
| `Copy of IMG_4400.JPG` | 3456 × 2304 | Audience | Landscape | **Gallery Item (The Captivated Assembly)**: Amphitheater audience immersed in debate rounds. |
| `DSC_1404.JPG` | 4496 × 3000 | Ceremony / Honors | Portrait | **Gallery Item (Best Speaker Distinction)**: Best speaker laureate holding the star trophy. |
| `DSC_1453.JPG` | 4496 × 3000 | Ceremony / Team | Portrait | **Gallery Item (Collective Excellence)**: Finalists and laureates commemorating achievement. |
| `Copy of IMG_4642.JPG` | 3456 × 2304 | Audience / Students | Landscape | **Gallery Item (Audience in Focus)**: Students and debate enthusiasts watching proceedings. |
| `Copy of IMG_4594.JPG` | 3456 × 2304 | Podium / Clash | Landscape | **Gallery Item (Dialectical Friction)**: Poised orator addressing the house. |
| `Copy of IMG_4597.JPG` | 3456 × 2304 | Atmosphere / Prep | Landscape | **Archive Item (Team Strategy Session)**: Debaters refining cases in consultation. |
| `Copy of IMG_4616.JPG` | 3456 × 2304 | Jury / Evaluation | Landscape | **Archive Item (Adjudication in Progress)**: Judges evaluating comparative weighing. |
| `DSC_1485.JPG` | 4496 × 3000 | Ceremony / Podium | Portrait | **Archive Item (Celebrating Merit)**: Awarding commemorative honors. |
| `DSC_1491.JPG` | 4496 × 3000 | Ceremony / Closing | Portrait | **Archive Item (The Final Ovation)**: Final applause and event closing ceremony. |

---

## 3. Workflow for Adding New Images

When new photos or graphics are placed into `public/assets/`:

1. Place the new JPG or PNG file in `public/assets/`.
2. Open `lib/gallery.ts`.
3. Add a new `GalleryItem` entry in `GALLERY_ITEMS` with unique ID, filename, descriptive title, category, caption, and orientation.
4. If the new image is a preferred hero or featured photo, update `HERO_FEATURED_IMAGE`, `ABOUT_FEATURED_IMAGE`, or `EXPERIENCE_FEATURED_IMAGE` in `lib/gallery.ts`.
5. Run `npm run build` to confirm Next.js image optimization and static rendering pass cleanly.
