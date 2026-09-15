# Mohamed Elsayed — Portfolio

Personal portfolio site. Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Motion.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Where the content lives

**All copy, projects, roles and skills are in [`data/content.ts`](data/content.ts).** That is the
only file you need to edit to keep the site current — nothing is hardcoded in the components.

| Export | What it drives |
| --- | --- |
| `profile` | Name, role, contact details, CV path, hero positioning line |
| `about` | About paragraphs and the facts grid |
| `experience` | The timeline. Set `current: true` to get the live dot |
| `featured` | The three in-depth project write-ups |
| `projects` | The repository index table |
| `projectTags` | Filter chips. A tag with zero matches hides itself |
| `techStack` | The logo grid. `core: true` highlights a tile |
| `concepts` | Text chips for skills that have no brand logo |
| `TECH_DOMAIN` / `TAG_DOMAIN` | Which accent colour each technology and tag gets |
| `education` | The list beside the About copy |
| `navLinks` | Nav items — each `href` must match a `<section id="...">` |

### Adding a project

Append an entry to `projects` in `data/content.ts`:

```ts
{
  slug: "unique-slug",
  name: "Project name",
  year: "2026",
  summary: "One sentence on what it does and what was hard about it.",
  stack: ["Django", "PostgreSQL"],
  tags: ["Python"],              // must exist in projectTags to be filterable
  repo: "https://github.com/...", // optional — omit and the row is not a link
}
```

To promote one to a featured write-up, move it into `featured` and add `bullets: [...]`. Set
`schematic: true` on exactly one featured project to render the architecture diagram beside it.

### Tech logos

Logos come from [`data/techIcons.ts`](data/techIcons.ts), which is **generated** — do not edit it by
hand. To add one, put the display name and its [simple-icons](https://simpleicons.org) slug in the
`MAP` at the top of [`scripts/gen-icons.mjs`](scripts/gen-icons.mjs), then run:

```bash
node scripts/gen-icons.mjs data/techIcons.ts
```

Any name without an entry still renders — just as a label with no icon, never an empty slot. This
keeps the multi-megabyte `simple-icons` package a devDependency; only the paths actually used ship.

### Replacing the CV or the photo

For the CV, overwrite [`public/Mohamed-Elsayed-CV.pdf`](public/Mohamed-Elsayed-CV.pdf), keeping the
filename — both "Download CV" buttons point at `profile.cv`.

For the portrait, drop a new file at `public/mohamed-elsayed.jpg` and update `avatarWidth` /
`avatarHeight` in `profile` to match. The frame renders it at a 4:5 ratio with `object-cover`, so
crop to roughly head-and-shoulders first; a full-body shot leaves the face too small to read at
300px. To re-crop from a larger original with the bundled `sharp`:

```bash
node -e "require('sharp')('original.jpg').extract({left:517,top:380,width:1216,height:1520}).resize(1000,1250).jpeg({quality:86}).toFile('public/mohamed-elsayed.jpg')"
```

## Deploying to Vercel

1. Push this directory to a GitHub repo.
2. Import it at [vercel.com/new](https://vercel.com/new) — the Next.js preset needs no changes.
3. After the first deploy, set the environment variable **`NEXT_PUBLIC_SITE_URL`** to the live
   URL (e.g. `https://mohamed-elsayed.vercel.app`) and redeploy. Canonical links and the social
   preview image resolve against it.

The whole page is statically prerendered, so it serves from the CDN with no server cost.

## Design notes

Worth knowing before changing things:

- **Colour is semantic, not decorative.** Four accents each stand for a domain — vermilion for
  compiled/JVM work, amber for Python, cyan for data and infrastructure, violet for frontend. The
  same coding runs through stack tiles, project tags, timeline dots, filter pills and the marquee,
  so a glance tells you what kind of work a project is. The mapping lives in `TECH_DOMAIN` and
  `TAG_DOMAIN` in [`data/content.ts`](data/content.ts); `accentOf(name)` resolves it. Anything
  unmapped falls back to neutral ink rather than guessing a colour.
- **Surfaces stay achromatic** (chroma `0`) so the accents do all the work. Contrast was measured
  against the *rendered* page, aurora included, not just the token values — the worst-case
  background pixel is `#231d11`, against which body text holds 5.51:1 and every accent clears
  4.5:1. If you make the aurora stronger, re-measure; it lifts the background behind text.
- **The aurora** ([`components/ui/Aurora.tsx`](components/ui/Aurora.tsx)) is four blurred pools of
  the palette on a fixed layer at 10% opacity. Keep them spread apart — overlapping cyan and amber
  turns muddy green.
- **Filled accent buttons use dark text** (`text-bg-sunken`). White on vermilion is 2.97:1 and
  fails contrast — do not switch it.
- **Scroll reveals are visible by default.** The hidden from-state is gated on the CSS
  `@media (scripting: enabled)` feature, so JS-off, a headless render, or an older browser that
  does not know the feature all still show every section. Gating in CSS rather than by scripting a
  class onto `<html>` also keeps the SSR markup identical to the hydrated DOM — doing the latter
  causes a React hydration mismatch. Reveals use a CSS *animation*, not a transition, so one cannot
  stall half-faded in a background tab.
- **The architecture schematic** (`components/SystemTrace.tsx`) is plain SVG, shown beside the
  Healthcare SaaS project it actually describes. Connectors carry `pathLength="100"`, so one dash
  geometry animates every path regardless of its real length. It is laid out in two narrow columns
  specifically so it fits a 360px phone without horizontal scrolling.
- **The portrait frame** ([`components/PortraitFrame.tsx`](components/PortraitFrame.tsx)) is an
  offset hairline frame with viewfinder corner ticks, a soft brand-coloured glow, and five
  technology satellites. Each satellite drifts on its own period (5.5s-6.8s) so the group never
  pulses in unison, pauses on hover, and carries an `sr-only` label. Edit the `SATELLITES` array to
  change which logos appear or where they sit — the offsets are percentages, so they hold position
  as the frame scales. The hero section is `overflow-x-clip` so the glow can bleed without ever
  widening the page.
- **Nav links scroll programmatically, not via the browser's fragment jump**
  ([`components/Nav.tsx`](components/Nav.tsx)). Closing the mobile sheet cancels any scroll still
  in flight — both the native hash scroll and an explicit smooth `scrollIntoView` — which left taps
  doing nothing at all. The sheet now closes first and the scroll starts from
  `AnimatePresence`'s `onExitComplete`, so the two never race. Don't reintroduce a
  `body { overflow: hidden }` lock while the sheet is open either; that blocks the scroll for the
  same reason, and the sheet sits in a fixed header so it does not need one.
- **Motion primitives** live in [`components/ui/`](components/ui/): `WordReveal` (staggered
  headline), `Scramble` (decode-on-scroll headings), `Magnetic` (buttons pulled toward the
  pointer), `Tilt` (3D perspective, mouse only), `Marquee` (seamless tech strip), `Cursor` and
  `Curtain`. Every one degrades: the real text is server-rendered before any scramble or
  word-split runs, so crawlers and JS-less visitors get the finished content.
- **The custom cursor renders nothing at all** unless the device has a fine pointer and allows
  motion. Rendering it unconditionally strands the dot and ring in the top-left corner of every
  phone — gate the render, not just the effect.
- **Reduced motion** is honoured throughout: aurora, curtain and cursor are removed outright, the
  marquee and satellites stop, reveals render immediately, and smooth scrolling is disabled.

## Contact

There is no contact form and no backend — the section offers direct links (email, phone, GitHub,
LinkedIn) plus a copy-email button, which is faster for a recruiter than filling in five fields. If
you later want a form, add it to [`components/Contact.tsx`](components/Contact.tsx) and POST to
Formspree, Resend or a route handler.
