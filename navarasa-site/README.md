# Navarasa — IISER Pune Dance Club Website

A real multi-page site for Navarasa — separate HTML pages for each section
(Home, Events, Gallery, Book the Room, Team, Achievements, Alumni, Join),
linked through a shared nav bar and hamburger menu (the hamburger is
always visible, desktop included, so every page is reachable from
anywhere — the inline top links only cover the five most-used pages).
Includes a landing intro on the home page, a navigable event calendar
(with the year shown so it's unambiguous which "October" you're looking
at) with click-to-view posters, a 3D photo carousel, a room-booking form,
and a scroll-animated wall of team polaroids.

## Structure

```
navarasa-site/
├── index.html          Home — landing animation + hero only
├── events.html           What we do + the events calendar/posters, combined
├── gallery.html          Photo carousel
├── booking.html          Room booking form
├── team.html             Team polaroid wall
├── achievements.html     Competitions we compete at
├── alumni.html           Previous members
├── join.html             Join / contact
├── css/
│   └── style.css        All styles — organised by section, uses CSS variables for the palette
├── js/
│   └── script.js        Intro animation, nav drawer, calendar + posters, carousel, team animation, forms
├── assets/               Logo, wordmark, QR code, and all photos used across the site
└── README.md
```

Every page shares the same nav bar, hamburger drawer, and footer — copied
into each file rather than templated, since this is a plain static site
with no build step. `script.js` is written defensively so it's safe to
load on every page: each block (calendar, carousel, team reveal, forms)
checks that its elements actually exist before doing anything, so a page
that doesn't have a calendar on it just skips that part with no errors.

**Navigation:** every page's top bar is just the logo, "Join us," and the
☰ menu button — no inline links. The ☰ opens the full drawer with every
page (Home, Events, Gallery, Book the room, Team, Achievements, Alumni,
Join). It's the only navigation on every page and every screen size, so
there's just one nav pattern to keep consistent.

**Editing the nav:** because the drawer/footer are duplicated in every
file, adding or renaming a page means updating the `<nav>` (drawer) block
in **all eight files** — search for the page you're changing (e.g.
`gallery.html`) across the project and update every occurrence. The
`class="dl active"` on the current page's own link is what highlights it
in the drawer — keep that in sync too when you copy the block to a new
page.

- **About Navarasa (home page only)** — a 3D tilt card (`#aboutCard`
  inside `#aboutTiltWrap`). It follows the mouse (`mousemove` in
  `script.js` sets `rotateX`/`rotateY` based on cursor position) and drag
  position on touch, with three layered pieces — a background photo, a
  caption at the bottom, and a floating "est. 2026" badge — each sitting
  at a different `translateZ`, so the tilt visibly separates them into
  depth. The photo itself isn't covered by anything — only a light
  bottom-up gradient behind the caption text, so it stays clearly visible.
  Respects reduced-motion (the tilt listener doesn't attach at all). Swap
  the photo, badge text or copy directly in `index.html`.

## Running it

No build step, no server required — just open `index.html` directly in a
browser. (Earlier builds used a `mask-image` pointing at an external file,
which some browsers block under the bare `file://` protocol; the wordmark
mask is now embedded directly in `css/style.css` as a data URI, so there's
no external file for the browser to block.)

## Editing notes

- **Colours, fonts, spacing** — all defined as CSS variables at the top of
  `css/style.css` under `:root` (e.g. `--acid`, `--magenta`, `--violet`,
  `--gold`). Change a value there to restyle the whole site.

- **Landing animation** — on first load, `#introOverlay` (only in
  `index.html`, the home page) shows the logo for a beat before fading into
  the site. Timing and the logo's entrance are in the "INITIAL LANDING
  ANIMATION" blocks of `css/style.css` and `script.js`. It respects
  reduced-motion (skips straight through) and only ever runs once per page
  load, not once per visit — there's no cookie/localStorage gate, so it
  plays every time `index.html` is loaded fresh (it won't re-run when
  navigating between the other pages, since it only exists on the home
  page). Swap the `<img>` in `#introOverlay` for a different graphic if you
  want.

- **Hero wordmark** — the custom "navarasa" logotype is used as a CSS mask
  on `.hero-wordmark`, with the animated shimmer gradient shining through
  the artwork instead of plain text. The mask image is embedded directly in
  `css/style.css` as a base64 data URI (search for `mask-image` near the
  hero rules) rather than linked as a file — this is what makes it render
  reliably even when the page is opened straight from disk. A full-size
  copy of the source artwork is still kept at
  `assets/navarasa-wordmark.png` for reference/editing. To swap the
  wordmark:
  1. Replace `assets/navarasa-wordmark.png` with the new artwork (transparent background).
  2. Re-encode it to base64 (e.g. `base64 -i assets/navarasa-wordmark.png`) and
     paste the result into the `mask-image: url("data:image/png;base64,...")`
     lines in `css/style.css` (both the `-webkit-` and unprefixed versions).
  3. Adjust the `aspect-ratio` on `.hero-wordmark` if the new artwork's
     proportions differ.
  A `.sr-only` "Navarasa" text node sits next to it so screen readers and
  search engines still see the club's name.

- **Events calendar** — a real, navigable calendar, not a static list.
  Open `js/script.js` and look for `calendarEvents` near the top: it's a
  plain object keyed `"YYYY-M-D"`, e.g.
  ```js
  '2026-10-10': { title: 'Garba Night', cat: 'october', tag: 'OCTOBER', date: 'Sat, Oct 10', poster: null }
  ```
  - `cat` must be `"october"` or `"monthly"` — that's what colours the dot
    and the legend (add a new category by mirroring the `.dot-bar.cat-*`
    and `.legend-dot.cat-*` rules in `css/style.css`).
  - `date` is just the display string shown inside the poster popup.
  - `poster` is `null` until you have a real poster image. Drop the file in
    `assets/` (e.g. `assets/posters/garba-night.jpg`) and set
    `poster: 'assets/posters/garba-night.jpg'` — the click-through modal
    switches from the placeholder note to the actual image automatically.
  - The **‹ ›** buttons next to the month name move a full month forward or
    back (`calPrev` / `calNext` in `script.js`), regenerating the grid and
    picking up whatever's in `calendarEvents` for that month — so events
    for November, December, next September, etc. all "just work" once
    they're in the object. The calendar opens on October 2026 by default
    (`calYear` / `calMonthIndex` at the top of the calendar block in
    `script.js`) since that's where the known events are; change those two
    values to open on a different month.
  - Events without a firm date yet (Dance Battles, Open-Stage, etc.) aren't
    forced onto the calendar — they're just named in the small note under
    the legend. Move them into `calendarEvents` once they have a date.

- **Gallery ("On stage")** — a 3D coverflow carousel. The slides are plain
  markup (`.carousel-slide` elements inside `#carouselTrack` in
  `gallery.html`), each with a `data-full` attribute for the lightbox. Add,
  remove or reorder `.carousel-slide` blocks and everything (arrows, dots,
  depth positions) recalculates automatically in `script.js`. Clicking the
  centered (active) slide opens it full-screen; clicking a side slide
  brings it to the front.

- **Reels (also on `gallery.html`, below the photos)** — a horizontal
  drag/scroll strip of portrait video cards, deliberately built to feel
  different from the photo carousel above: it's driven by scroll position
  continuously (not clicks), and the card nearest the centre gets the
  `.is-center` highlight automatically (see `updateCenterReel()` in
  `script.js`). Each `.reel-card` has a `data-title` and a `data-video`
  attribute — `data-video` is empty for all of them right now, so clicking
  a card opens a "this reel is on its way" placeholder. Once you have a
  real video file, drop it in `assets/` and set `data-video="assets/your-file.mp4"`
  on that card — the modal will play it instead of showing the
  placeholder, no other changes needed.

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

- **Achievements** — intentionally just a placeholder right now (`.alumni-box`
  reused for the "Updating soon" message). Rebuild this one with real
  competition write-ups and results whenever that's ready — there's no
  special mechanism to preserve, just plain markup in `achievements.html`.

## Assets

All photos, the logo, the wordmark graphic and the Instagram QR code came
from the club's own material and are already in `assets/`. Replace any
file in place (keep the same filename) and it updates everywhere it's
used. Add poster images to a new `assets/posters/` folder as you get them
— see the calendar note above.

