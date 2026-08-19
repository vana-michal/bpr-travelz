# TRAVEL Z — interactive prototype

Open `index.html` in a browser (Chrome/Safari/Firefox). Everything is local except Google Fonts, so an internet connection is needed for the correct typefaces; without it the site falls back to system fonts.

## What it implements

**Homepage** — the door loop plays on load with the hero lockup over it. Tap anywhere, press any key, or use the "Start your journey" pill: the loop crossfades (~380 ms) into the walkthrough film, which you then play by scrolling (3 viewports of scrub, eased with lerp 0.18). The beat "NOT A TRIP. *A private world.*" fades in mid-film. The film ends on its near-white frame and hands off to the light Experiences section: three trips with the mockup's hover choreography (name slides right, hollow number fills orange, arrow eases in). Only Bali is active; F1 and Lapland carry generated placeholder cameos with a slow Ken Burns drift and a "Coming soon" tag. Closing: "Begin with *a conversation.*" The entry ritual runs once per session (sessionStorage); revisits and reduced-motion users land unlocked.

**Bali page** — the 22.2 s film scrubbed across 10 viewports (full length, as decided). The three chapters sit on the footage's real shot cuts: Accommodation 0–7.9 s (villa/pool), Activities 7.9–15.2 s (beach/surf), Mindset 15.2–22.2 s (beach party). Chapter text uses a radial contrast scrim over the bright footage. After the film: "One itinerary. *Zero decisions.*" and the proposal form (name, email, phone/WhatsApp — all required) → "Request private proposal" → "*Received.*" + 24 h promise. Submit is mocked: the payload is logged to the console for later CRM wiring.

## Decisions baked in (from our conversation)

Lighter identity accepted (light oak door footage, paper-light sections, TravelZ Orange #F49A1A from the logo manual, Off-Black #1E1E1D). Tap-anywhere entry on all devices, pill as an equal trigger, JOURNEY typo fixed. Crossfade for the loop→walkthrough cut. Chapters on shot cuts, not equal thirds. Full-length Bali scrub.

## Prototype substitutions — replace for production

- **Fonts:** Archivo Black stands in for Gill Sans Ultra Bold; Pinyon Script for Kunstler Script. The real faces need Monotype webfont licenses + WOFF2 conversion (spec v0.5, step 3).
- **Cameos:** `cameo_f1.jpg` and `cameo_lapland.jpg` are generated placeholders — swap for real or AI-generated footage/photos.
- **Videos:** re-encoded with a keyframe every ⅓ s for smooth scrubbing, muted, faststart. For a live site, add lower-bitrate mobile renditions.
- **Form:** no backend. Wire to CRM/inbox honoring the 24 h promise.
- **Legal:** F1/Porsche marks pending clearance; the footer carries an interim note.

## Hosting note

To rebuild this as a live artifact or in Claude Design, the four videos must be hosted at public URLs first — browser artifacts cannot embed local files.
# bpr-travelz
