# Pintfield Creamery

Self-initiated concept website by [Ridges & Valleys Studio](https://ridgesandvalleys.com) for a Gettysburg / Adams County creamery.

**Live demo:** https://matthummel-pa.github.io/gettysburg-creamery-site/

This is a design concept — not a real business. The pattern is inspired by a local multi-shop creamery (rotating 32-flavor case, dairy-free and no-sugar-added tubs, cakes, three Adams County shops, no public phones). Names and the Pintfield brand are original to this demo.

## What’s in the concept

- Bold, animated HTML/CSS scoop shop (hero cone with customer photos, drips, sprinkles, marquee, photographed flavor tubs)
- Homepage **live freezer case** (32 + 4 DF + 4 NSA) driven by the Scoop Board
- **Scoop Board** (`scoop-board.html`) — owner packs tubs, features a scoop, **uploads flavor photos**, publishes immediately, or schedules a future drop that auto-promotes on that date
- Walk-up **menu** with scoop / shake / pint prices
- **Order** page: ice cream cakes, cupcakes, sandwich cookies, pints, bulk tubs, pup treats
- Separate **cart & payment** page (demo checkout, login required)
- **Customer login** via `@netlify/identity` when Identity is on; local demo account otherwise
- Contact form for visitors → owner
- Job application form (role, shop, availability, resume upload)
- Locations including the Gettysburg move to 1153 Biglerville Road (late summer 2026)

## Scoop Board (demo)

1. Open `scoop-board.html`
2. PIN: `17325` (Gettysburg zip — shown on the lock screen)
3. Click a freezer slot, then a flavor chip
4. **Publish to homepage now** or pick a **run date** and **Schedule this lineup**
5. Reload `index.html` — today’s case and the homepage note update
6. **Flavor photos** — upload a JPG/PNG per flavor (compressed in the browser). Reset restores the stock photo.

The concept stores the board **and custom flavor photos** in `localStorage` so it works on GitHub Pages with no backend. A production build would persist the same JSON to a CMS or Netlify Blobs so every visitor sees one case.

Photo credits: see `IMAGES.md`.

## Order, cart, and login

- `menu.html` — walk-up price board
- `order.html` — categorized specialties (customize flavor / drizzle / pickup, add to cart)
- `cart.html` — line items, PA tax, pay desk
- `account.html` — log in / create account

Enable Identity on the Netlify project (**Project configuration → Identity**) for real email accounts. Until then, signup stores a demo user in the browser so checkout still works.

## Forms

Netlify Forms attributes are on both contact forms (`owner-contact`, `job-application`). On Netlify, enable Forms; submissions land in the Netlify UI. Locally / on GitHub Pages, the AJAX handler shows a demo success state.

## Develop

Open `index.html` locally, or:

```bash
python3 -m http.server 4173
```

Then visit http://localhost:4173/

## GitHub Pages preview

This repo is a static site at the branch root (same setup as the other Ridges & Valleys HTML concepts).

**Preview URL:** https://matthummel-pa.github.io/gettysburg-creamery-site/

GitHub Apps cannot flip Pages on via API, so enable it once in the repo:

1. Open [Settings → Pages](https://github.com/matthummel-pa/gettysburg-creamery-site/settings/pages)
2. **Build and deployment → Source:** Deploy from a branch
3. **Branch:** `main` / `/(root)` → Save

The first publish usually takes a minute. After that, every push to `main` updates the preview.
