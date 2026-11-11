# ARGON 4 / CODING AGENT — ASD IV MASTER PROMPT

Build and refine a polished, production-quality Next.js (App Router, TypeScript, Tailwind) website for **All-Star Debate IV (ASD IV)**, organized by The Great Debaters ENSA Fès. Begin by reading this whole repository, `docs/FIGMA_REFERENCE.md`, `docs/ASSET_MANIFEST.md`, and `docs/CONTENT_AND_SOURCES.md` before editing. Inspect relevant source files. Implement and run checks, do not stop at a plan.

## Original Figma (CRITICAL VISUAL SOURCE)
https://www.figma.com/design/yTsG6wqORyTr7tkaYG0edf/Event---Music-Landing-Pages-%E2%80%94-6-Website-Templates--Community-?node-id=14-2277
Node **14:2277**, frame **Signal Summit — Conference Landing**, 1440×11080 px. If connected to Figma MCP, call `get_design_context` and screenshot at this exact node and inspect child nodes when necessary. Treat the screenshot as visual guidance, not a page-sized background. Re-create the layout responsively with real components, using geometric graphic elements, giant compressed **Anton** headlines, strong display typography, layered textures, kinetic marquees, and eccentric geometric motifs. Keep the reference's creative art direction, page rhythm, information density, section transitions and graphic personality, but transform conference content into a debate event. Do not blindly copy the original purple/lavender palette or conference registration/price content. Original Figma binary assets and font files are NOT included.

## Theme
Palette: black #0C0C0C, deep charcoal #191919, bright yellow #F7D51E, warm white #EEE9D9; red #FF4545 is **only** for overtime/emergency timer states. No purple, violet, orange, blue or gradients copied from reference. Typography: Anton for high-impact headlines, DM Sans for body text, Space Mono for counters and micro-labels. Fonts should be loaded via `next/font/google` (not bundled font files). Present as a premium editorial event website, not a SaaS dashboard. Responsive, accessible, touch friendly. Prioritize animation performance, reduced-motion preferences, thoughtful transitions, parallax only where warranted, and semantic navigation.

## Content and information architecture
1. Sticky branded header; official ASD logo if obtained, otherwise a clearly provisional typographic mark. Navigation to Event, Live Timer, Social.
2. Cinematic hero: ALL STAR DEBATE / IV, ENSA Fès / The Great Debaters, large event graphics, animated typography, social CTA. No invented date, place, sponsors, or speakers.
3. About / event overview with verified history and 18 debaters, 3 language sections (Arabic / French / English).
4. MAIN FEATURE: live debate console using three language section tabs, each with **3 Proposition vs 3 Opposition** speakers, total **18 independent timers**. Names must stay empty and editable until confirmed; no invented participants.
5. Event culture / gallery only with approved photos; otherwise designed placeholders (not falsely attributed as official content).
6. Social: link to https://www.instagram.com/allstardebate/ and https://www.youtube.com/@TheGreatDebatersENSAF . Show real last Instagram post preview ONLY if officially verified and reachable (embed official public post URL, or use an approved locally stored image + link). If access fails, a well-designed follow card, never a fake 'latest' image. For YouTube, embed a verified video only after finding its real ID.
7. Footer with organizer attribution, verified links and editorial details.

## Timer interaction / functional acceptance
- Three tabs: Arabic, French, English; precisely 6 speakers per tab, 3 FOR and 3 AGAINST. Use stable unique IDs; immutable state.
- Each speaker has an editable name, Start, Pause/Resume, Reset with confirmation, +10 sec and -10 sec adjustment, time `MM:SS` counting upward; screen-reader labels and keyboard access.
- The limit is exactly 05:00 = 300,000 ms. At **strictly > 05:00**, apply glowing red accent to digits, circular dial and status, and display `OVERTIME`. Keep the counter counting UP indefinitely until explicitly paused; do not autostop. Prior to that use yellow/neutral styling.
- Use wall-clock timestamp plus accumulated elapsed milliseconds, not naive interval increment. Tabs should not reset or pause other clocks. Persist speaker names and timers in localStorage; calculate elapsed accurately on reload. Implement a small analog/vintage chronograph ring (tick marks, circular track, lap-time feel), without sacrificing readability. Zero lag when many clocks are running.
- Make live operation clear: local browser clocks are NOT synchronized among devices. If real shared stage administration is required, add authenticated admin + realtime persistence, with an authoritative server time. Do not suggest localStorage is shared.
- Add safe safeguards: reset confirmation, no negative elapsed, handle browser resume, large elapsed hours, mobile landscape, optional speaker-exclusive mode, and consider a focus / projection screen for organizers.

## Engineering / completion
Use clear components, typed domain models, SEO metadata, Next Image when local approved images exist, accessible animations and proper loading. No API credentials in client. Run `npm install`, `npm run build`, fix errors, and test timer math at start/pause/resume/reload/5:00/5:01 if environment supports execution. Deliver changed file list and any still-unverified social media asset dependencies. Do not fabricate that live Instagram fetching or official logo scraping succeeded. When assets become available, save them into `public/assets/`, with provenance documented in the asset manifest.
