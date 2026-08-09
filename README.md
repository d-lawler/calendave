# Calendave

A personal radar for leftfield London — experimental music, repertory cinema, art, and odd happenings at places like Cafe OTO, the ICA, and the Prince Charles Cinema.

## Stack

Nuxt 3, statically generated. No backend, no tracking, no algorithm — just hand-curated JSON.

## Running it

```bash
npm install
npm run dev        # local dev at localhost:3000
npm run generate   # static build into dist/
```

## Deploying (GitHub + Netlify)

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Netlify reads `netlify.toml` automatically (build: `npm run generate`, publish: `dist`). Done.

## Refreshing the listings

All content lives in two files:

- `data/events.json` — the curated events. Each entry: `id`, `title`, `venue`, `scene` (`music` | `cinema` | `art` | `odd`), `date` / `endDate` (ISO), `time`, `url`, `blurb`, `tags`, `price`.
- `data/venues.json` — the evergreen venue directory.

Past events hide themselves automatically (anything whose `endDate`/`date` is behind today never renders), so the site degrades gracefully between refreshes — but a periodic top-up keeps it alive. The workflow: ask Claude to re-research current listings and rewrite `events.json`, bump `verifiedDate` in `app.vue`, commit, push — Netlify redeploys.

## Ideas for later

- Per-venue scrapers (Cafe OTO paginates `/events/?page=N`; The Cinema Museum runs WordPress + The Events Calendar, so `/events/?ical=1` may exist; several venues book through DICE) feeding `events.json` at build time on a Netlify scheduled build.
- An `.ics` export so picks land in a real calendar.
- A "going" shortlist persisted in localStorage.
