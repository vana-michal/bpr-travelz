# TRAVEL Z — Claude Design hand-off

Goal: continue iterating on THIS prototype in Claude Design, not rebuild it.

## Step 1 — Host the assets (must happen first)

Upload the entire `assets/` folder to any static host (your webserver, Netlify,
Vercel, Cloudflare Pages/R2, GitHub Pages). You need a public HTTPS base URL like:

    https://cdn.yourhost.com/travelz/assets/

Verify one file loads in the browser, e.g. .../assets/loop.mp4

CORS note: if videos load but scrubbing/display fails in an embedded preview,
enable CORS on the host (`Access-Control-Allow-Origin: *` for the assets path).

## Step 2 — Start from the current version

In Claude Design, create the project and provide, as files or pasted content:

1. `index.html`, `bali.html`, `style.css`, `app.js`  (the working build)
2. `travelz-design-description-v0-5.md` and the Logo Manual  (the design truth)
3. `README.md`  (documents every decision and substitution already made)

Then instruct it explicitly, for example:

    This is a working prototype — continue from this exact code and design.
    Do not redesign or restructure. Set window.TZ_ASSET_BASE in both HTML
    files to: https://cdn.yourhost.com/travelz/assets/
    Then [your next change request].

## Bali chapter timing — measured shot cuts (do not redistribute)

The three chapter overlays on bali.html sit on the film's real shot cuts,
measured by scene detection on TRAVEL_Z_VIDEO_BALI.mp4 (22.1667 s). These
values are already implemented in app.js (the ch-1/ch-2/ch-3 beats with
the c() and s() helpers). If Claude Design touches that code, give it this
prompt verbatim so the values are preserved:

    The Bali journey page (bali.html) scrubs a 22.1667 s film across the
    #bali-track section. The three chapter overlays must sit on the film's
    real shot cuts, NOT on equal thirds. The measured cuts are:

      Chapter 1 — ACCOMMODATION (villa / infinity pool):
        0.000 s → 7.917 s   = scroll progress 0.000 → 0.357, center 0.179
      Chapter 2 — ACTIVITIES (beach / surfboard):
        7.917 s → 15.167 s  = scroll progress 0.357 → 0.684, center 0.521
      Chapter 3 — MINDSET (beach party):
        15.167 s → 22.167 s = scroll progress 0.684 → 1.000, center 0.842

    Each chapter's opacity peaks at its center and falls off with the
    existing formula: opacity = max(0, 1 − (|p − center| / spread)^1.35),
    with spread = (half chapter duration / 22.1667) × 1.15, giving spreads
    of 0.205 / 0.188 / 0.182. This is already implemented in app.js
    (the ch-1/ch-2/ch-3 beats with c() and s() helpers) — preserve those
    values exactly. Do not redistribute chapters evenly, do not move text
    across a shot boundary, and keep the ±26 px vertical drift and the
    lerp-0.18 scrub easing unchanged.

Notes:
- The 1.15 spread multiplier lets adjacent chapters crossfade slightly at
  the cut. For a cleaner handoff (text fully clears before the next
  appears), change it to 1.0 — in both app.js and the prompt above.
- These timestamps are valid ONLY for this exact bali.mp4. If the film is
  re-edited or trimmed, the cuts move and must be re-measured before the
  prompt is reused.

## Step 3 — The one-line swap

All media resolves through a single config at the top of each HTML file:

    window.TZ_ASSET_BASE = "assets/";   // local
    window.TZ_ASSET_BASE = "https://cdn.yourhost.com/travelz/assets/";  // hosted

Nothing else changes. Locally the bundle still works exactly as before.

## Asset inventory (what must be at the hosted URL)

    loop.mp4          door idle loop (intro)
    walkthrough.mp4   scrubbed homepage film
    bali.mp4          scrubbed Bali journey film (22.2 s)
    bali_card.mp4     Bali trip-card loop excerpt
    poster_door.jpg   intro poster frame
    poster_bali.jpg   Bali poster frame
    cameo_f1.jpg      F1 placeholder cameo
    cameo_lapland.jpg Lapland placeholder cameo

## Caveat

Exact import/upload steps inside Claude Design may differ from the above —
this hand-off covers what is required regardless of tool. For product-specific
questions about Claude Design itself, see https://support.claude.com
