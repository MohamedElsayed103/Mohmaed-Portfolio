# Design contract: Mohamed Elsayed portfolio

One page. Audience: an engineering lead or technical recruiter, on a laptop (sometimes a phone), deciding in about a minute whether to message a backend engineer. They must leave knowing: he builds multi-tenant backends in Java and Python, he has shipped real systems, and how to reach him.

## Concept: "the system is the portfolio"

Backend work is invisible by nature. The site makes it visible. Every piece of imagery is a **working diagram of real backend behaviour**: packets moving through his healthcare platform, a request that gets stopped at the tenant boundary, a route that 404s an unlisted slug, a user story turning into a UML diagram, a career drawn as a state machine. Visitors can press things and the system responds. Nothing decorative that does not mean something.

- Voice: precise, confident, a little dry. First person, plain sentences, no buzzwords, no em dashes in new copy.
- Not: a terminal/hacker costume, a typing-prompt hero, an editorial serif magazine, a SaaS landing page, a card grid of skills with progress bars.

## Hard rules

1. **Content comes only from `data/content.ts`** (import from `@/data/content`). The new exports `statement`, `platform`, `isolation`, `reverieRouting`, `useCaseDemo` and `career` feed the diagrams. Never invent a metric, employer claim, technology, date or testimonial. Connective copy is fine if it asserts no new fact. Do not edit `content.ts`; if something is missing, say so in your report.
2. **Only edit the files you own** (listed in your task). Do not touch `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `lib/motion.ts`, `data/*`, `package.json` or other sections. You may create new files under `components/<your-area>/`. No new dependencies.
3. **Next.js 16 + React 19 + Tailwind v4.** This is newer than your training data: read `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` before writing client code. Keep sections as server components where possible and put interactive or animated parts in small `"use client"` components. Server and first client render must produce identical markup (no `typeof window` branches in render, no `Math.random()` or `Date.now()` in render): a hydration mismatch is a bug.
4. **Palette is fixed: his.** Achromatic surfaces (chroma 0) plus four semantic accents where colour MEANS a domain: vermilion = compiled (Java, Spring), amber = Python (Django, Celery), cyan = infrastructure (PostgreSQL, RabbitMQ, Keycloak, MinIO, Docker), violet = frontend (Next.js, React, TS). Use `accentOf(name)` / `domainOf(name)` / `domainAccent` from content.ts to colour by domain. In diagrams, a packet or edge takes the colour of the domain it is entering. Vermilion (`--s-signal`) is also the brand signal for primary actions. No new hues, no gradients between hues.
5. **Section themes.** Root element is `<section id="…" data-theme="dark|raised|sunken|light">`. Inside a section use ONLY the `--s-*` variables for colour: `--s-bg --s-fg --s-body --s-muted --s-rule --s-raised --s-signal --s-on-signal --s-compiled --s-python --s-infra --s-frontend` (Tailwind arbitrary values work: `text-[var(--s-muted)]`, `border-[var(--s-rule)]`). They flip correctly per theme; the light theme swaps accents for darker variants that pass contrast on white. `dark` is transparent so the fixed aurora shows through. Container: `.shell`. Vertical rhythm: generous, varied (`py-28 sm:py-40` is a typical section).
6. **Type.** Schibsted Grotesk (`font-sans`, weights 400 to 900) carries everything. Display: weight 800 to 900, letter-spacing not tighter than -0.03em, max ~6rem (`text-display`, `text-h1`, `text-h2`, `text-h3`, `text-lead` exist). Geist Mono (`font-mono`, `.data`) ONLY for things that are literally code or machine data: state names, event names, queue names, routes, HTTP statuses, schema names, dates in a data column. Never for paragraphs. Body max 65ch.
7. **Banned** (rewrite if you catch yourself): gradient text; tiny uppercase tracked eyebrow labels above every heading; `01 / 02 / 03` section numbering; side-stripe coloured borders; glassmorphism; identical icon+title+text card grids; 1px border + big soft shadow on the same element; radius above 16px on cards; decorative grid-line backgrounds; stripe backgrounds; sketchy SVG illustration; skill bars or percentages; emoji; lorem ipsum.
8. **Motion.** Import `gsap, ScrollTrigger, EASE, prefersReduced, whenVisible, whileVisible, scrollToTarget, getLenis` from `@/lib/motion` (never from `gsap` directly). Use `useEffect` + `gsap.context(() => {...}, ref)` and revert it in cleanup. Content is fully visible in the server HTML; animation only enhances it (animate `from` a state inside an effect, or use the existing `@media (scripting: enabled)` reveal pattern in globals.css via `components/Reveal.tsx`). Exponential ease-out; no bounce, no elastic. Animate transform, opacity, clip-path, stroke-dashoffset, not layout properties. **Every animation has a reduced-motion path**: final state shown, loops render a meaningful static frame. Loops pause off-screen and when the tab is hidden (`whileVisible`). Each section's motion should fit what it shows; do not apply one fade-up to everything. The existing `components/ui/*` primitives (Magnetic, WordReveal, Scramble, Tilt, Marquee) may be reused or ignored.
9. **Accessibility.** One `h1` (Hero). Sections use `h2`, projects/sub-items `h3`. Body contrast at least 4.5:1 against the actual background. Every interactive thing is a real `<a>` or `<button>` with visible `:focus-visible`, a 44px touch target and a keyboard path. Diagrams: `role="img"` + `aria-label`, or `role="group"` + label + visually hidden description when they contain buttons. Interactive diagrams announce results through an `aria-live="polite"` region.
10. **Responsive.** Compose for 360, 768, 1024, 1440, 1920. No horizontal scroll at any width. Diagrams re-layout (horizontal becomes vertical, fewer nodes) on narrow screens, never shrink below 12px rendered text. Long tokens (`tenant_clinic_a`, `domain modules`, `Information Technology Institute`) must not overflow.

## Checking your work

A Next dev server is already running at `http://localhost:3000`. **Do not start another server, do not run `next build`, do not run git.** Each section has an isolated preview at `/dev/<name>`: `hero`, `nav`, `work`, `healthcare`, `reverie`, `usecase`, `experience`, `stack`, `about`, `contact` (contact includes the footer). The first request to a route compiles; wait for it.

Screenshot from the project root (path has NO leading slash; `index` is the home page), then Read the PNG and actually look at it:

```
node scripts/shots.mjs dev/hero hero-1440                         # 1440x900, reduced motion (final state)
node scripts/shots.mjs dev/hero hero-360 --w 360 --h 780 --full
node scripts/shots.mjs dev/hero hero-768 --w 768 --h 1024 --full
node scripts/shots.mjs dev/hero hero-motion --motion --wait 2500  # with animation running
```

The script prints console errors (including hydration errors) and elements crossing the viewport edge. Use a unique name prefix. Iterate until it would survive a review at a high-end studio. Minimum before you report: 1440, 768 and 360 screenshots inspected, one `--motion` shot, zero console errors, no horizontal scroll.
