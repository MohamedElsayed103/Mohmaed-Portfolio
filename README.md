# Mohamed Elsayed — Portfolio

Personal portfolio site. Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + Lenis · Motion.

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
| `techStack` | The stack strata. `core: true` sets a technology in heavy type |
| `concepts` | The bedrock layer of the stack strata |
| `TECH_DOMAIN` / `TAG_DOMAIN` | Which accent colour each technology and tag gets |
| `education` | The list beside the About copy, and two states in the experience machine |
| `statement` | The scroll-filled statement in About |
| `platform` | The live request-path diagram in the hero |
| `isolation` | The tenant-isolation demo in the Healthcare project |
| `reverieRouting` | The routing demo in the Reverie project |
| `useCaseDemo` | The user-story-to-UML demo in the Use Case project |
| `career` | The experience state machine (states, events, the parallel fork) |
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

The three featured projects each have a hand-built interactive section
(`components/ProjectHealthcare.tsx`, `ProjectReverie.tsx`, `ProjectUseCase.tsx`) that reads
`featured[0..2]` plus its own diagram data, so promoting a different project means building it a section.

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

The full design contract is in [`DESIGN.md`](DESIGN.md). Worth knowing before changing things:

- **The system is the portfolio.** Every visual is a working model of real backend behaviour:
  live traffic through the healthcare platform in the hero, a cross-tenant request rejected at the
  middleware, an unlisted slug that 404s, a user story becoming a UML diagram, and a career drawn as
  a state machine with two parallel states. All diagram data lives in `data/content.ts`.
- **Colour is semantic, not decorative.** Four accents each stand for a domain: vermilion for
  compiled/JVM work, amber for Python, cyan for data and infrastructure, violet for frontend. The
  mapping lives in `TECH_DOMAIN` and `TAG_DOMAIN`; `accentOf(name)` resolves it. In diagrams a
  packet takes the colour of the domain it is entering. Surfaces stay achromatic.
- **Section themes.** Each section sets `data-theme="dark|raised|sunken|light"` and reads only the
  `--s-*` variables in `app/globals.css`. The light theme swaps the accents for `-deep` variants that
  pass contrast on white. `dark` is transparent so the aurora shows through. The nav reads the theme
  of the section under it and matches it.
- **Filled accent buttons use dark text** (`--s-on-signal`). White on vermilion fails contrast.
- **Motion** goes through [`lib/motion.ts`](lib/motion.ts): GSAP with ScrollTrigger, Lenis smooth
  scroll, exponential ease-out. Content is complete in the server HTML; animation only layers on top.
  Every loop pauses off-screen and in hidden tabs, and reduced motion gets a meaningful static frame.
- **Anchor offset** comes from `scroll-margin-top` on `section[id]` only. Do not add an offset in
  Lenis as well; the two stack.
- **Nav links scroll programmatically.** The mobile sheet closes first and the scroll starts after
  it has finished closing, so taps never get cancelled. Don't add a `body { overflow: hidden }` lock.
- **Hydration.** Diagram coordinates are rounded and nothing random runs during render, so the
  server and client markup match. Keep it that way when editing the SVGs.

## Contact

There is no contact form and no backend — the section offers direct links (email, phone, GitHub,
LinkedIn) plus a copy-email button, which is faster for a recruiter than filling in five fields. If
you later want a form, add it to [`components/Contact.tsx`](components/Contact.tsx) and POST to
Formspree, Resend or a route handler.
