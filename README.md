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
| `stackTicker` | The mono strip under the hero |
| `about` | About paragraphs and the facts table |
| `experience` | The timeline. Set `current: true` to get the live dot |
| `featured` | The three in-depth project write-ups |
| `projects` | The repository index table |
| `projectTags` | Filter chips. A tag with zero matches hides itself |
| `skills` | Stack columns. `core: true` marks an item with the accent dot |
| `education`, `involvement` | The two lists at the bottom of About |
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

To promote one to a featured write-up, move it into `featured` and add `bullets: [...]`.

### Replacing the CV

Overwrite [`public/Mohamed-Elsayed-CV.pdf`](public/Mohamed-Elsayed-CV.pdf), keeping the filename.
Both "Download CV" buttons point at `profile.cv`.

## Deploying to Vercel

1. Push this directory to a GitHub repo.
2. Import it at [vercel.com/new](https://vercel.com/new) — the Next.js preset needs no changes.
3. After the first deploy, set the environment variable **`NEXT_PUBLIC_SITE_URL`** to the live
   URL (e.g. `https://mohamed-elsayed.vercel.app`) and redeploy. Canonical links and the social
   preview image resolve against it.

The whole page is statically prerendered, so it serves from the CDN with no server cost.

## Design notes

Worth knowing before changing things:

- **Palette** is defined once in [`app/globals.css`](app/globals.css) under `@theme`, in OKLCH.
  The surfaces are deliberately achromatic (chroma `0`) so the single vermilion signal carries the
  brand. Every text pair is verified at ≥ 4.5:1 against its background; `--color-ink-faint` is
  the one exception at 3.9:1 and is used only for large or decorative text.
- **Filled accent buttons use dark text** (`text-bg-sunken`). White on vermilion is 2.97:1 and
  fails contrast — do not switch it.
- **Scroll reveals are visible by default.** The hidden from-state is gated on the CSS
  `@media (scripting: enabled)` feature, so JS-off, a headless render, or an older browser that
  does not know the feature all still show every section. Gating in CSS rather than by scripting a
  class onto `<html>` also keeps the SSR markup identical to the hydrated DOM — doing the latter
  causes a React hydration mismatch. Reveals use a CSS *animation*, not a transition, so one cannot
  stall half-faded in a background tab.
- **The hero schematic** (`components/SystemTrace.tsx`) is plain SVG. Connectors carry
  `pathLength="100"`, so one dash geometry animates every path regardless of its real length. It
  scrolls horizontally below ~480px rather than shrinking its labels past legibility.
- **Reduced motion** is honoured throughout: animations collapse, smooth scrolling is disabled,
  and reveals render immediately.

## Contact form

The form composes a `mailto:` link and opens the visitor's mail client — nothing is sent from the
page, and there is no backend. If you later want real submissions, swap the `handleSubmit` body in
[`components/Contact.tsx`](components/Contact.tsx) for a POST to Formspree, Resend or a route
handler; the markup and validation stay as they are.
