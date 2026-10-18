# Weekly listings refresh

You are maintaining Calendave, a hand-curated radar of experimental music, repertory cinema, art and odd happenings in London. Your job this run: bring `data/events.json` up to date. Only edit files in `data/`.

## Window

From today to roughly 10 weeks ahead, weighted towards the next 4 weeks. Exhibitions currently open count, whenever they opened.

## Steps

1. Read `data/events.json` and `data/venues.json`.
2. Remove every event whose `endDate` (or `date`, if there's no end date) is before today.
3. Check upcoming events are still happening; fix changed dates or times, drop cancelled ones.
4. Research new events with WebSearch and WebFetch, working through every venue in `data/venues.json` (its `url` is the place to start). Leftfield venues not in the list are welcome if they fit the taste.
5. Aim for a healthy spread after the update, roughly: music 30+, cinema 30+ (with real depth at the Prince Charles Cinema: all-nighters, 35mm/70mm, marathons, sing-alongs, seasons), art 15+, words 12+.
6. Write the result back to `data/events.json`, sorted by `date`, and confirm it parses with `python3 -c "import json; json.load(open('data/events.json'))"`.

## Rules

- Only include events you verified on a real page (venue site, Resident Advisor, DICE, Time Out and so on) showing the date. Never invent an event or a URL. The `url` must be a page you actually saw: an event page is best, a venue listings page is acceptable.
- For a film running across many dates, use one entry: `date` = first upcoming screening, `endDate` = last, `time` null.
- Keep existing entries' `id`s unchanged. New ids are unique kebab-case with a venue suffix, e.g. `nkisi-ormside`.
- Use venue names exactly as they appear in `data/venues.json` when the venue is listed there.
- Taste: adventurous over mainstream. Club nights only when the lineup is genuinely leftfield.

## Schema

```json
{
  "id": "laila-sakini-oto",
  "title": "Laila Sakini + Rebecca Salvadori + Ella Fleck",
  "venue": "Cafe OTO",
  "scene": "music",
  "date": "2026-08-10",
  "endDate": null,
  "time": "19:30",
  "url": "https://www.cafeoto.co.uk/events/laila-sakini-rebecca-salvadori-ella-fleck/",
  "blurb": "Hushed, half-lit songcraft from Laila Sakini alongside video artist Rebecca Salvadori and writer Ella Fleck, the kind of cross-disciplinary Monday only OTO programmes.",
  "tags": ["ambient", "experimental", "audiovisual"],
  "price": "£16 (£14 adv)"
}
```

- `scene` is one of `music`, `cinema`, `art`, `words` (talks, readings, live art, fairs, strange one-offs).
- `time` is `HH:MM` or null; `price` is a short string like `£12`, `free`, or null.
- Blurbs: one or two short sentences, knowing and dry, specific about what the thing actually is. Never use em dashes or en dashes anywhere; use commas, colons or full stops.
- 2 to 4 lowercase kebab-case tags.
