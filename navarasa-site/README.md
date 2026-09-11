# Navarasa — IISER Pune Dance Club Website

A single-page site for Navarasa: an event calendar with click-to-view
posters, a 3D photo carousel, a room-booking form, and the full team
roster with a scroll-animated wall of polaroids.

## Structure

```
navarasa-site/
├── index.html          All markup + content (sections are labelled with comments)
├── css/
│   └── style.css        All styles — organised by section, uses CSS variables for the palette
├── js/
│   └── script.js        Nav drawer, calendar + posters, carousel, team animation, forms
├── assets/               Logo, QR codes, and all photos used across the site
└── README.md
```

## Running it

No build step. Open `index.html` directly in a browser, or serve the folder
with any static server, e.g.:

```
npx serve .
# or
python3 -m http.server 8000
```

Then visit the printed local URL.

## Editing notes

- **Colours, fonts, spacing** — all defined as CSS variables at the top of
  `css/style.css` under `:root` (e.g. `--acid`, `--magenta`, `--violet`,
  `--gold`). Change a value there to restyle the whole site.

- **Hero title effect** — the "NAVARASA" headline is a soft animated
  gradient clipped to the text (`.hero h1 span` in `css/style.css`), tuned
  to stay translucent so the photo behind it still reads. To make it bolder
  or dimmer, adjust the alpha values in that gradient; to change the speed,
  adjust the `heroShimmer` animation duration.

- **Events calendar** — this is a real calendar, not a static list. Open
  `js/script.js` and look for `calendarEvents` near the top: it's a plain
  object keyed by day-of-month, e.g.
  ```js
  10: { title: 'Garba Night', cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 10', poster: null }
  ```
  - `cat` must be `"october"` or `"monthly"` — that's what colours the dot
    and the legend.
  - `date` is just the display string shown inside the poster popup.
  - `poster` is `null` until you have a real poster image. Drop the file in
    `assets/` (e.g. `assets/posters/garba-night.jpg`) and set
    `poster: 'assets/posters/garba-night.jpg'` — the click-through modal
    switches from the placeholder note to the actual image automatically,
    no other changes needed.
  - The grid itself is generated for **October 2026** specifically (the 1st
    is a Thursday, hence the 4 leading blank cells at the top — see
    `CAL_LEADING_BLANKS` and `CAL_DAYS_IN_MONTH` in `script.js`). For a
    different month, update those two constants and the `<h3 class="calendar-month">`
    text in `index.html`.
  - Events without a firm date yet (Dance Battles, Open-Stage, etc.) aren't
    forced onto the calendar — they're just named in the small note under
    the legend. Move them into `calendarEvents` once they have a date.

- **Gallery ("On stage")** — a 3D coverflow carousel. The slides are plain
  markup this time (`.carousel-slide` elements inside `#carouselTrack` in
  `index.html`), each with a `data-full` attribute for the lightbox. Add,
  remove or reorder `.carousel-slide` blocks and everything (arrows, dots,
  depth positions) recalculates automatically in `script.js`. Clicking the
  centered (active) slide opens it full-screen; clicking a side slide
  brings it to the front.

- **Team ("The people who move it")** — every card is a `.polaroid-card`
  with an inline `--tilt` custom property for its resting rotation. Two
  things make the wall feel alive:
  1. Cards fade in as you scroll to them (`IntersectionObserver` in
     `script.js`, staggered per card).
  2. Each photo has a slow, gentle idle float (`polaroidFloat` keyframes in
     `css/style.css`), staggered per card so they don't move in sync.
  Copy/paste a `.polaroid-card` block to add someone; the tilt, float and
  reveal are all handled automatically.

- **Booking / Alumni forms** — no backend. On submit they build a
  `mailto:` link (bottom of `js/script.js`) addressed to
  `dance@sac.iiserpune.ac.in` with the form fields filled into the body.
  Swap those two submit handlers out if you get a real form service later.

## Assets

All photos, the logo, and the Instagram QR code came from the club's own
material and are already in `assets/`. Replace any file in place (keep the
same filename) and it updates everywhere it's used. Add poster images to a
new `assets/posters/` folder as you get them — see the calendar note above.
