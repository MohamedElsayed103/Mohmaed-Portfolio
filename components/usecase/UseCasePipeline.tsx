"use client";

import { useEffect, useRef } from "react";
import { useCaseDemo } from "@/data/content";
import { gsap, EASE, prefersReduced, whenVisible } from "@/lib/motion";
import { UmlDiagram } from "./UmlDiagram";

type Kind = "actor" | "usecase";
type Seg = { text: string; kind?: Kind };

/** Split the story into plain text and the spans the model extracts (actors, use cases). */
function segment(story: string, actors: readonly string[], useCases: readonly string[]): Seg[] {
  const words = [...story.matchAll(/[A-Za-z']+/g)].map((m) => ({
    w: m[0].toLowerCase(),
    start: m.index ?? 0,
    end: (m.index ?? 0) + m[0].length,
  }));
  const spans: { start: number; end: number; kind: Kind }[] = [];
  for (const a of actors) {
    const i = words.findIndex((x) => x.w === a.toLowerCase());
    if (i >= 0) spans.push({ start: words[i].start, end: words[i].end, kind: "actor" });
  }
  for (const u of useCases) {
    const parts = u.toLowerCase().split(/\s+/);
    const i = words.findIndex((x) => x.w === parts[0]);
    if (i < 0) continue;
    let j = i;
    let found = true;
    for (const p of parts.slice(1)) {
      const k = words.findIndex((x, n) => n > j && n <= j + 3 && x.w === p);
      if (k < 0) {
        found = false;
        break;
      }
      j = k;
    }
    if (found) spans.push({ start: words[i].start, end: words[j].end, kind: "usecase" });
  }
  spans.sort((a, b) => a.start - b.start);
  const out: Seg[] = [];
  let at = 0;
  for (const s of spans) {
    if (s.start > at) out.push({ text: story.slice(at, s.start) });
    out.push({ text: story.slice(s.start, s.end), kind: s.kind });
    at = s.end;
  }
  if (at < story.length) out.push({ text: story.slice(at) });
  return out;
}

const SEGS = segment(useCaseDemo.story, useCaseDemo.actors, useCaseDemo.useCases);
const TOKENS = SEGS.filter((s) => s.kind).flatMap((s) =>
  s.text.toLowerCase().split(/\s+/).map((w) => ({ w, kind: s.kind as Kind })),
);
const kindColour = (k: Kind) => (k === "actor" ? "var(--s-python)" : "var(--s-fg)");

export function UseCasePipeline() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const ctx = useRef<gsap.Context | null>(null);

  const build = () => {
    const el = root.current;
    if (!el) return;
    ctx.current?.revert();
    ctx.current = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const t = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.current = t;

      // 1. The words that matter light up, in reading order.
      t.from(q("[data-hl-bg]"), { scaleX: 0, duration: 0.45, stagger: 0.2 }, 0.1);
      t.from(q("[data-hl]"), { color: "var(--s-body)", duration: 0.35, stagger: 0.2 }, 0.1);

      // 2. Tokens stream into the model.
      q("[data-token]").forEach((tok, i) => {
        t.fromTo(
          tok,
          { y: -14, opacity: 0 },
          {
            keyframes: [
              { y: 10, opacity: 1, duration: 0.25, ease: "none" },
              { y: 46, opacity: 0, duration: 0.45, ease: "power2.in" },
            ],
          },
          0.9 + i * 0.09,
        );
      });

      // 3. The model runs: encoder, then decoder, then its output lines.
      t.from(q("[data-layer]"), { opacity: 0.08, duration: 0.25, stagger: 0.05 }, 1.2);
      t.from(q("[data-out] > *"), { opacity: 0, x: -8, duration: 0.4, stagger: 0.04 }, ">-0.2");

      // 4. Into the renderer.
      t.from(q("[data-wire]"), { clipPath: "inset(0 100% 100% 0)", duration: 0.5, ease: EASE.inOut }, ">-0.2");

      // 5. The diagram draws itself.
      const draw = (sel: string, d: number, st: number, pos: string) =>
        t.fromTo(
          q(sel),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: d, stagger: st, ease: EASE.inOut },
          pos,
        );
      draw("[data-boundary]", 0.7, 0, ">-0.1");
      draw("[data-actor] [data-draw]", 0.35, 0.05, "<+0.35");
      draw("[data-ellipse]", 0.6, 0.12, "<+0.15");
      t.from(q("[data-ellipse]"), { fillOpacity: 0, duration: 0.6, stagger: 0.12 }, "<+0.3");
      t.from(q("[data-label]"), { opacity: 0, duration: 0.5, stagger: 0.04 }, "<+0.35");
      draw("[data-assoc]", 0.55, 0.2, ">-0.2");
    }, el);
  };

  useEffect(() => {
    const stop = whenVisible(root.current, build, "top 65%");
    return () => {
      stop();
      ctx.current?.revert();
    };
  }, []);

  const replay = () => {
    if (prefersReduced()) return;
    if (tl.current) tl.current.restart();
    else build();
  };

  const counts = `${useCaseDemo.actors.length} actors, ${useCaseDemo.useCases.length} use cases, ${useCaseDemo.relations.length} associations`;

  return (
    <div
      ref={root}
      role="group"
      aria-label="Pipeline from user story to use case diagram (example)"
      className="grid gap-y-0 xl:grid-cols-[minmax(0,5fr)_3.5rem_minmax(0,7fr)] xl:items-center"
    >
      <div>
        {/* Input */}
        <figure className="rounded-[12px] border border-[var(--s-rule)] bg-[var(--s-raised)] p-5 sm:p-6">
          <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm text-[var(--s-muted)]">
            <span className="font-semibold text-[var(--s-fg)]">User story</span>
            <span>Example input</span>
          </figcaption>
          <p className="mt-4 text-[clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-[1.55] text-[var(--s-body)]">
            {SEGS.map((s, i) =>
              s.kind ? (
                <span
                  key={i}
                  data-hl
                  className="relative whitespace-nowrap px-[0.08em] font-semibold"
                  style={{ color: kindColour(s.kind) }}
                >
                  <span
                    data-hl-bg
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[0.05em] top-[0.1em] origin-left rounded-[3px]"
                    style={{
                      background:
                        s.kind === "actor"
                          ? "color-mix(in oklab, var(--s-python) 17%, transparent)"
                          : "transparent",
                      boxShadow: s.kind === "usecase" ? "inset 0 -2px 0 var(--s-fg)" : undefined,
                    }}
                  />
                  <span className="relative">{s.text}</span>
                </span>
              ) : (
                <span key={i}>{s.text}</span>
              ),
            )}
          </p>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[var(--s-muted)]">
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="size-2.5 rounded-[2px] bg-[var(--s-python)]" />
              actor
            </span>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="h-0.5 w-3 bg-[var(--s-fg)]" />
              use case
            </span>
          </p>
        </figure>

        {/* Token stream */}
        <div aria-hidden="true" className="relative flex h-16 justify-center">
          <span className="w-px bg-[var(--s-rule)]" />
          {TOKENS.map((t, i) => (
            <span
              key={i}
              data-token
              className="absolute top-1 rounded-[4px] border border-[var(--s-rule)] bg-[var(--s-bg)] px-1.5 font-mono text-[0.75rem] leading-5 opacity-0"
              style={{ color: kindColour(t.kind), left: `calc(50% + ${((i % 3) - 1) * 4.5}rem)`, translate: "-50% 0" }}
            >
              {t.w}
            </span>
          ))}
        </div>

        {/* Model */}
        <div className="rounded-[12px] border border-[color-mix(in_oklab,var(--s-python)_45%,transparent)] p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-semibold text-[var(--s-fg)]">{useCaseDemo.model}</p>
            <p className="flex items-center gap-2 text-sm text-[var(--s-muted)]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--s-python)]" />
              Python
            </p>
          </div>
          <div aria-hidden="true" className="mt-4 grid grid-cols-2 gap-4">
            {["encoder", "decoder"].map((name) => (
              <div key={name}>
                <p className="font-mono text-[0.75rem] text-[var(--s-muted)]">{name}</p>
                <div className="mt-1.5 flex flex-col gap-1">
                  {[0, 1, 2, 3].map((n) => (
                    <span key={n} data-layer className="h-1.5 rounded-full bg-[var(--s-python)] opacity-60" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 border-t border-[var(--s-rule)] pt-4 font-mono text-[0.8125rem]">
            {useCaseDemo.actors.map((a) => (
              <div key={a} data-out className="contents">
                <dt className="text-[var(--s-muted)]">actor</dt>
                <dd className="text-[var(--s-python)]">{a}</dd>
              </div>
            ))}
            {useCaseDemo.useCases.map((u) => (
              <div key={u} data-out className="contents">
                <dt className="text-[var(--s-muted)]">use case</dt>
                <dd className="text-[var(--s-fg)]">{u}</dd>
              </div>
            ))}
            {useCaseDemo.relations.map((r) => (
              <div key={r.actor + r.useCase} data-out className="contents">
                <dt className="text-[var(--s-muted)]">assoc</dt>
                <dd className="text-[var(--s-body)]">
                  {r.actor} &rarr; {r.useCase}
                </dd>
              </div>
            ))}
          </dl>
          <p className="sr-only">Model output: {counts}.</p>
        </div>
      </div>

      {/* Wire into the renderer: vertical when stacked, horizontal beside the diagram */}
      <div aria-hidden="true" className="flex h-16 items-center justify-center xl:h-auto">
        <span data-wire className="block h-full w-px bg-[var(--s-frontend)] xl:h-px xl:w-full" />
      </div>

      {/* Output */}
      <figure className="rounded-[12px] border border-[var(--s-rule)] bg-[var(--s-raised)] p-5 sm:p-6">
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-sm text-[var(--s-muted)]">
          <span className="font-semibold text-[var(--s-fg)]">Use case diagram</span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--s-frontend)]" />
            Rendered by Node.js · example output
          </span>
        </figcaption>
        <div className="mt-4">
          <UmlDiagram />
        </div>
        <div className="mt-4 flex justify-end motion-reduce:hidden">
          <button
            type="button"
            onClick={replay}
            className="group inline-flex min-h-11 items-center gap-2 rounded-[8px] border border-[var(--s-rule)] px-4 text-sm font-semibold text-[var(--s-fg)] transition-colors duration-300 hover:border-[var(--s-muted)]"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-rotate-180">
              <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Run again
          </button>
        </div>
      </figure>
    </div>
  );
}
