# Pintfield Creamery

Self-initiated concept website by [Ridges & Valleys Studio](https://ridgesandvalleys.com) for a Gettysburg / Adams County creamery.

**Live demo:** https://matthummel-pa.github.io/gettysburg-creamery-site/

This is a design concept — not a real business. The pattern is inspired by a local multi-shop creamery (rotating 32-flavor case, dairy-free and no-sugar-added tubs, cakes, three Adams County shops, no public phones). Names and the Pintfield brand are original to this demo.

## What’s in the concept

- Bold, animated HTML/CSS scoop shop (hero cone, drips, sprinkles, marquee, hover-tubs)
- Homepage **live freezer case** (32 + 4 DF + 4 NSA) driven by the Scoop Board
- **Scoop Board** (`scoop-board.html`) — owner packs tubs, features a scoop, publishes immediately, or schedules a future drop that auto-promotes on that date
- Contact form for visitors → owner
- Job application form (role, shop, availability, resume upload)
- Locations including the Gettysburg move to 1153 Biglerville Road (late summer 2026)

## Scoop Board (demo)

1. Open `scoop-board.html`
2. PIN: `17325` (Gettysburg zip — shown on the lock screen)
3. Click a freezer slot, then a flavor chip
4. **Publish to homepage now** or pick a **run date** and **Schedule this lineup**
5. Reload `index.html` — today’s case and the homepage note update

The concept stores the board in `localStorage` so it works on GitHub Pages with no backend. A production build would persist the same JSON to a CMS or Netlify Blobs so every visitor sees one case.

## Forms

Netlify Forms attributes are on both contact forms (`owner-contact`, `job-application`). On Netlify, enable Forms; submissions land in the Netlify UI. Locally / on GitHub Pages, the AJAX handler shows a demo success state.

## Develop

Open `index.html` locally, or:

```bash
python3 -m http.server 4173
```

Then visit http://localhost:4173/

## First-time Pages setup

If the live URL 404s: **Settings → Pages → Deploy from a branch → `main` / (root)**.
