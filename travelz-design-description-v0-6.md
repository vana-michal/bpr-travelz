# Design Description — TRAVEL Z
*Gen Z offshoot of BPR Travel · definitive draft description · v0.6*

**Sources of truth:** the mockup **WEB_NAVRH-03.jpg** defines the typographic system (lockup, chrome, hover choreography); the delivered footage — **loop.mp4**, **video_hp.mp4**, **TRAVEL_Z_VIDEO_BALI.mp4** — now defines the visual world; the built prototype (index.html / bali.html / style.css / app.js) defines the working mechanics. v0.5 added the confirmed typefaces and the external-film production model. **v0.6 records the decisions taken in the first build round: the lighter identity, the tap-anywhere ritual with crossfade, the walkthrough replacing the sea section, the light experiences section, the cameo model for unreleased products, the Bali journey template change with measured shot-cut chapters, the full-length scrub, the confirmed form, and the single-point asset configuration.** Where v0.6 contradicts v0.5, v0.6 wins.

---

## 1. What this site is

TRAVEL Z is the digital flagship of BPR Travel's Gen Z offshoot: private journeys, hidden access and effortless escapes "for the ones who do not wait in line." The site is a cinematic scroll-narrative with an entry ritual: the visitor arrives at a door, opens it with a touch, scrolls through the walkthrough film, chooses one of three signature experiences, and ends at a single conversion point — a private proposal request. The BPR DNA lives in the copy: "One message. Everything arranged." / "One itinerary. Zero decisions."

## 2. Brand & verbal identity

Wordmark TRAVEL **Z** per the Logo Manual v1.0 (Proxima Nova Extrabold wordmark + Kunstler Script Z in TravelZ Orange), centered in the persistent chrome with EXPERIENCES left and CONTACT right — the entire navigation. Voice: quiet-confident, second person, aphoristic. The mockup typo is fixed: **"START YOUR JOURNEY."** Language: the build is EN; the CZ/EN decision remains open but is constrained by the diacritics finding (§3).

## 3. Visual language — DECIDED: the lighter identity (v0.6)

**The delivered footage is light — light-oak door, bright Bali daylight, a near-white walkthrough end frame — and the decision is to accept it** rather than force the v0.5 ink-dark grade. The identity shifts from "ink base with photographic scenes" to "photographic light with ink type":

### Color (updated)

- **TravelZ Orange `#F49A1A`** — locked from the Logo Manual (supersedes v0.5's provisional ≈`#F09000`). Script accents, the Z, hover fills, highlights.
- **TravelZ Black `#030304`** and **Off-Black `#1E1E1D`** — type and dark grounds, per the manual.
- **Paper `#F2F1EF`** — the light section ground, matched to the walkthrough film's end frame so the film hands off into the page invisibly.
- Scene palettes now come from the footage: warm oak, tropic teal/sand, plus the two cameo worlds (carbon-and-amber for F1, arctic blue for Lapland).
- Over footage, type stays **white with a soft dark grade** (radial + top/bottom gradient at reduced strength ~35% after entry) and, over bright frames, a **radial contrast scrim** behind text blocks — the accessibility scrims of v0.5 §7, now standard.

### Typography (unchanged system, plus prototype substitutes)

The four-face system stands: Gill Sans Ultra Bold (display), Kunstler Script (script accent, always orange, always layered), Source Sans 3 VF (utility, tracking ≈0.32em), DejaVu Sans (fallback). The layered lockup remains the signature and must be reproduced exactly. **Prototype substitutes in the current build — Archivo Black ≈ Gill Sans Ultra Bold, Pinyon Script ≈ Kunstler Script — are placeholders only**; production still requires Monotype webfont licenses, WOFF2 conversion, and (if CZ is adopted) extended-character cuts, per v0.5. The diacritics finding stands unchanged.

### Imagery

Full-bleed conceptual footage where the scene is the metaphor. The art-direction rule holds: one object or landscape, frontal and monumental, carrying one idea. The heavy dark grading recipe of v0.5 is **retired in favor of the light grade + scrim model above**; film grain remains optional per slot. Films remain externally produced; the three delivered films are integrated in the prototype.

## 4. The homepage flow (updated to the built mechanics)

**Beat 0 — The Door (loop.mp4, 6.0 s idle loop).** The site opens on the looping door film — a hand resting on the handle. Over it: eyebrow "A PRIVATE TRAVEL UNIVERSE", the layered lockup "YOUR NEXT *Life* EXPERIENCE", the tagline, the frosted pill **"START YOUR JOURNEY"**, and the pulsing instruction **"TAP ANYWHERE — OR PRESS ANY KEY — TO BEGIN."** Scrolling is locked. **DECIDED: entry is tap/click anywhere on every device (desktop included), any key, or the pill — all equivalent triggers.** **DECIDED (v0.6.1): the ritual runs on every plain page load and refresh.** Only anchored navigation (e.g. `#experiences` via the Bali back-link) and reduced-motion users land unlocked at the film start — so in-site return trips are never re-locked.

**Beat 1 — The Entry (crossfade, ≈380 ms).** **DECIDED: the loop crossfades into the walkthrough film's first frame** (the two shots match closely but not frame-perfectly; the crossfade absorbs the difference). The hero rises out (26 px, 600 ms). The entry gesture doubles as the mobile video-seek primer.

**Beat 2 — The Walkthrough (video_hp.mp4, 6.6 s, scroll-scrubbed).** The visitor plays the film by scrolling — **3 viewports of scrub**, playhead eased with lerp ≈0.18. The v0.5 "first meeting film" is realized as this walkthrough. **The former sea section is retired; its typographic beat "NOT A TRIP. *A private world.*" now lives inside the scrub** (center ≈0.55 of progress), fading on the ^1.35 falloff with ±26 px drift. The film ends on its near-white frame.

**Beat 3 — The Three Experiences (DECIDED: light section).** The white end frame dissolves into the Paper ground — the film literally becomes the page. Section head: "THREE JOURNEYS" + script *Choose yours.* Layout: **stacked editorial rows** (mobile stacks identically), each row = hollow number, name + meta line, 16:9 media, arrow. Hover/focus choreography per the mockup: name slides right 14 px, hollow number fills orange, arrow eases in, media scales.

**The cameo model (v0.6).** Products without cleared footage ship as **cameos**: a placeholder visual (generated still with a slow Ken Burns drift, later replaceable by AI-generated or licensed footage) + a "COMING SOON" tag, rendered at 55% opacity and non-interactive. Currently: 01 F1 Paddock Energy (carbon/amber speed-streak cameo) and 03 Lapland Porsche Ice Experience (frozen-lake/aurora cameo). **02 Bali Creator & Wellness Hub is live**, carrying a 4.5 s muted loop excerpt of its film, and opens its journey page.

**Beat 4 — Closing.** "Begin with *a conversation.*" / "One message. Everything arranged." / concierge CTA + minimal footer carrying the interim trademark note.

## 5. Scroll & motion mechanics (confirmed in build)

Scroll-scrubbed video with eased playhead (lerp 0.18, rAF loop, seek threshold 33 ms); center-distance beat fades (^1.35 falloff, ±26 px drift); one-time reveals (26 px rise at 12% visibility, 0.9 s); 1 px right-edge progress line in blend-difference; adaptive chrome (white over footage, off-black over light sections, switching on section arrival); pulsing entry cue; **scroll cue (v0.6.3): a half-circle of 21 short radial lines at bottom centre of every scrubbed film, breathing gently from the centre outwards, eroding ends-first as you scroll (gone after ≈750 px, distance-based so it reads identically on the 3-viewport homepage film and the 10-viewport Bali film).** Reduced motion: entry ritual skipped (graceful cut), scrub un-eased (direct set), reveals and Ken Burns static. Mobile seek priming on first gesture. Beats are force-hidden once light content is in view.

**Scrubbing encoding (confirmed):** delivered films are re-encoded muted, H.264, keyframe every 8 frames (⅓ s), faststart — this supersedes v0.5's 2–3 s keyframe guidance, which proved too sparse for smooth scrubbing. Mobile renditions remain to be produced.

## 6. The three products

**01 — F1 Paddock Energy** (cameo). **02 — Bali Creator & Wellness Hub** (live). **03 — Lapland Porsche Ice Experience** (cameo). The legal note stands: F1 and Porsche are third-party marks pending clearance; the footer carries an interim notice.

### The journey template (CHANGED in v0.6)

The v0.5 template (cinematic intro → four moments 01 DEPARTURE → 04 THE LIFESTYLE → THE PLAN → form) is **replaced by the chaptered-scrub template**: one continuous film scrubbed at full length, with **chapters placed on the film's real shot cuts**, each chapter = orange utility label + short display line + one sentence, presented over a radial contrast scrim.

### Bali — the built reference implementation

Film TRAVEL_Z_VIDEO_BALI.mp4, 22.1667 s, scrubbed across **10 viewports (full length — DECIDED)**. **v0.6.2: the center chapter overlays are removed — chapters are communicated solely by the right-edge light timeline** (labels ACCOMMODATION / ACTIVITIES / MINDSET, orange progress fill, click-to-jump). The measured cuts below still drive the timeline's active state (scene detection; valid only for this exact edit — re-measure after any re-cut):

| # | Chapter | Film time | Progress | Center | Spread |
|---|---------|-----------|----------|--------|--------|
| 1 | ACCOMMODATION — "A villa featuring tropical architecture and an infinity pool." | 0 – 7.917 s | 0 – 0.357 | 0.179 | 0.205 |
| 2 | ACTIVITIES — "Daily surfing lessons with professionals, access to a state-of-the-art gym, parties." | 7.917 – 15.167 s | 0.357 – 0.684 | 0.521 | 0.188 |
| 3 | MINDSET — "Meditation and evening community BBQs/networking by the pool, Savaya parties." | 15.167 – 22.167 s | 0.684 – 1.0 | 0.842 | 0.182 |

Opacity = max(0, 1 − (|p − center| / spread)^1.35); spread = (half chapter duration / total) × 1.15, the multiplier giving a slight crossfade at each cut (set to 1.0 for a hard handoff). After the film: "One itinerary. *Zero decisions.*" → the form.

### The conversion form (DECIDED)

"No prices. No packages. Tell us how to reach you and we will design the rest." Fields: **Name, Email, Phone/WhatsApp — all required**, underline style, inline validation. Submit: **"Request private proposal"** → form is replaced by script **"Received."** + "We reply within 24 hours. One message — everything arranged." Prototype submit is mocked (payload logged); production wires to CRM/inbox honoring the 24 h promise. Fixed "← Back to experiences."

## 7. Designer's notes — remaining open decisions

CZ/EN (typographically constrained); WhatsApp escape hatch beside the form (the phone field currently absorbs it); "No prices" vs one honest pricing sentence; absent "by BPR Travel" endorsement (footer currently reads "a private line of BPR Travel" — confirm or remove); real cameo footage for 01 and 03; production fonts and licenses; F1/Porsche clearance.

## 8. Film & asset integration model (updated)

Three of four film slots are now filled by delivered footage (door loop, walkthrough, Bali); cameo slots follow the placeholder-first model until their films exist. **All media resolves through a single configuration point — `window.TZ_ASSET_BASE` in each page head** — so moving between local, hosted, and design-tool environments is a one-line change per page, and film integration remains a swap of sources, not a redesign. Asset inventory: loop.mp4 · walkthrough.mp4 · bali.mp4 · bali_card.mp4 · poster_door.jpg · poster_bali.jpg · cameo_f1.jpg · cameo_lapland.jpg.

---

# Next steps — from prototype to production

1. **Clear the trademarks** (unchanged; also unlocks real cameo films for 01 and 03).
2. **Lock the remaining §7 decisions** — CZ/EN, WhatsApp, pricing sentence, endorsement line.
3. **Resolve production typography** — licensed webfonts replacing the prototype substitutes; WOFF2 + subsetting; role split per v0.5.
4. **Produce the two missing films** (F1, Lapland) to the chaptered-scrub template; measure their shot cuts on delivery.
5. **Extract the design system** — tokens now confirmed (Orange #F49A1A, Black #030304, Off-Black #1E1E1D, Paper #F2F1EF), components as built (frosted pill, eyebrow, lockup, trip row states, underline field, progress line, door/entry states, chapter scrim).
6. **Design remaining states** — form loading state, error states beyond validation, mobile recomposition polish of the layered lockups.
7. **Production scroll engine** — the prototype engine meets the spec values; validate the budget (60 fps mid-range phone, LCP < 2 s on 4G) on hosted assets with mobile renditions.
8. **Final content + GDPR/legal.**
9. **Connect conversion** — form → CRM/inbox, 24 h promise, funnel analytics (entry rate → walkthrough depth → Bali opens → form starts → proposals).
10. **User test 5–8 target users on their phones** — does the tap-to-enter delight; is TRAVEL Z understood within the walkthrough; is "No prices" trusted enough to submit. Iterate and hand off.

---
*Sources: WEB_NAVRH-03.jpg (typographic system) · delivered footage loop.mp4 / video_hp.mp4 / TRAVEL_Z_VIDEO_BALI.mp4 (visual world) · TravelZ Logo Manual v1.0 (colors, wordmark) · client decisions v0.6 (lighter identity; tap-anywhere entry + crossfade; walkthrough replaces sea section; light experiences section; cameo model; chaptered-scrub journey template on measured cuts; full-length Bali scrub; Name/Email/Phone form) · built prototype index.html / bali.html / style.css / app.js (mechanics).*
