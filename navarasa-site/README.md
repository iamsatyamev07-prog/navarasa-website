# Navarasa — IISER Pune Dance Club Website

A single-page site for Navarasa: event calendar, gallery, a room-booking
form, and the full team roster.

## Structure

```
navarasa-site/
├── index.html          All markup + content (sections are labelled with comments)
├── css/
│   └── style.css        All styles — organised by section, uses CSS variables for the palette
├── js/
│   └── script.js        Nav drawer, event filters, gallery lightbox, booking/alumni forms
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
  `css/style.css` under `:root`. Change a value there to restyle the whole
  site (e.g. `--acid`, `--magenta`, `--violet`).
- **Copy** — every section in `index.html` is wrapped in a commented block
  (`<!-- ============ HERO ============ -->` etc.) so you can jump straight
  to the part you want to edit.
- **Events** — each card lives in `#eventGrid` in `index.html`. The
  `data-cat` attribute (`october`, `monthly`, `proposed`) drives the filter
  buttons in `js/script.js` — add a new card with a matching `data-cat` and
  the filter picks it up automatically.
- **Gallery** — images live in `#galleryGrid`. Add an `<img>` with a
  `data-full` attribute pointing at the image to enlarge on click.
- **Team** — coordinators are in `.coord-row`, the rest of the team in
  `.core-grid`. Both are plain repeated markup blocks — copy/paste a card
  and swap the image, name and role.
- **Booking / Alumni forms** — these don't hit a server. On submit they
  build a `mailto:` link (see the bottom of `js/script.js`) addressed to
  `dance@sac.iiserpune.ac.in` with the form fields filled into the body.
  If you get a real backend or form service later, swap out those two
  submit handlers.

## Assets

All photos, the logo, and the two QR codes came from the club's own
orientation deck and are already in `assets/`. Replace any file in place
(keep the same filename) and it'll update everywhere it's used.
