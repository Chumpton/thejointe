# The Jointe (Mockup)

Static, high‑fidelity UI/UX mockup for **The Jointe** podcast (retro athletic × vintage cinema).

## Run

Open `index.html` in a browser.

If you want the site to load `public/episodes.json` automatically (instead of the embedded demo data in `index.html`), run a local static server.

## Swap in real assets

Replace these placeholder files with your real branding suite and renders:

- `public/assets/logo.png` (currently a placeholder screenshot)
- `public/assets/logo.svg` (optional fallback)
- `public/assets/favicon.svg`
- `public/assets/merch-shirt.svg` and `public/assets/merch-hat.svg`
- `public/assets/paper-noise.svg` (optional: swap for a photo texture)

## Using your YouTube thumbnails

This environment can’t fetch thumbnails from YouTube automatically. To use your real show thumbnails:

- Download your thumbnail images and place them in `public/assets/episodes/` as `ep-48.jpg`, `ep-47.jpg`, etc.
- Update the embedded JSON in `index.html` (search for `episodesData`) or `public/episodes.json` to point `thumb` at the correct file or a full URL (example format: `https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg`).
