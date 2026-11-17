"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reverieRouting } from "@/data/content";
import { gsap, EASE, prefersReduced, whenVisible, whileVisible } from "@/lib/motion";
import { InvitationCard } from "./InvitationCard";

const SLUGS = reverieRouting.slugs;
/** First view: run each slug once, then settle back on the one that renders. */
const AUTOPLAY = [0, 1, 2, 0];
const AUTOPLAY_GAP = 4.4;

function parseResult(result: string) {
  const [code, ...rest] = result.split(/\s{2,}/);
  return { code, reason: rest.join(" ") };
}

type StageStatus = "pass" | "fail" | "skip";

function stagesFor(state: string): [StageStatus, StageStatus, StageStatus] {
  if (state === "published") return ["pass", "pass", "pass"];
  if (state === "unlisted") return ["pass", "pass", "fail"];
  return ["pass", "fail", "skip"];
}

export function RoutingDemo({ host }: { host: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [run, setRun] = useState(0);
  const [announce, setAnnounce] = useState("");
  const tl = useRef<gsap.core.Timeline | null>(null);
  const next = useRef<gsap.core.Tween | null>(null);
  const autoplay = useRef(false);
  const active = useRef(true);

  const current = SLUGS[idx];
  const { code, reason } = parseResult(current.result);
  const ok = code === "200";
  const stages = stagesFor(current.state);

  const stepRef = useRef<(k: number) => void>(() => {});
  const step = useCallback((k: number) => {
    if (!autoplay.current) return;
    setIdx(AUTOPLAY[k]);
    setRun((r) => r + 1);
    if (k + 1 < AUTOPLAY.length) {
      next.current = gsap.delayedCall(AUTOPLAY_GAP, () => stepRef.current(k + 1));
      if (!active.current) next.current.pause();
    } else {
      autoplay.current = false;
    }
  }, []);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Self-running pass on first view; pauses off-screen.
  useEffect(() => {
    const el = root.current;
    const stopWhen = whenVisible(el, () => {
      autoplay.current = true;
      step(0);
    }, "top 70%");
    const stopWhile = whileVisible(el, (on) => {
      active.current = on;
      tl.current?.paused(!on);
      next.current?.paused(!on);
    });
    return () => {
      stopWhen();
      stopWhile();
      autoplay.current = false;
      next.current?.kill();
    };
  }, [step]);

  // One request, animated through the stages it actually reaches.
  useEffect(() => {
    const el = root.current;
    if (!run || !el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el);
      const rail = q("[data-rail]")[0] as HTMLElement;
      const packet = q("[data-packet]")[0] as HTMLElement;
      const nodes = q("[data-node]") as HTMLElement[];
      const railTop = rail.getBoundingClientRect().top;
      const ys = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top - railTop + r.height / 2 - 5;
      });
      const reached = stages.filter((s) => s !== "skip").length;
      const colours = ["var(--s-frontend)", "var(--s-infra)", "var(--s-frontend)"];

      const t = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.current = t;
      if (!active.current) t.pause();

      gsap.set(q("[data-stage]").slice(0, reached), { opacity: 0.3 });
      gsap.set(q("[data-seg]"), { scaleY: 0 });
      gsap.set(q("[data-node-fill]").slice(0, reached), { scale: 0 });
      gsap.set(q("[data-result] > *"), { opacity: 0 });

      t.from(q("[data-char]"), { opacity: 0, duration: 0.01, stagger: 0.026, ease: "none" });
      t.fromTo(q("[data-pending]"), { opacity: 0 }, { opacity: 1, duration: 0.3 }, "<");
      t.fromTo(
        packet,
        { y: ys[0] - 26, opacity: 0, backgroundColor: colours[0] },
        { y: ys[0], opacity: 1, duration: 0.35, ease: EASE.inOut },
        "+=0.05",
      );

      for (let i = 0; i < reached; i++) {
        if (i > 0) {
          t.to(packet, { y: ys[i], backgroundColor: colours[i], duration: 0.45, ease: EASE.inOut }, "+=0.12");
          t.to(q("[data-seg]")[i - 1], { scaleY: 1, duration: 0.45, ease: EASE.inOut }, "<");
        }
        t.to(q("[data-stage]")[i], { opacity: 1, duration: 0.25 });
        t.to(q("[data-node-fill]")[i], { scale: 1, duration: 0.3 }, "<");
        if (i === 1) {
          t.from(q("[data-row]"), { clipPath: "inset(0 100% 0 0)", duration: 0.55 }, "<");
        }
        if (i === 2) {
          t.from(q("[data-arm]"), { rotation: ok ? 0 : -52, svgOrigin: "8 40", duration: 0.6 }, "<");
        }
      }
      t.to(packet, { opacity: 0, scale: 2.4, duration: 0.45 }, "+=0.05");
      t.to(q("[data-pending]"), { opacity: 0, duration: 0.2 }, "<");
      t.to(q("[data-result] > *"), { opacity: 1, duration: 0.01 }, "<");
      t.from(q("[data-status]"), { yPercent: 60, opacity: 0, duration: 0.6 }, "<");
      t.from(q("[data-reason]"), { y: 8, opacity: 0, duration: 0.6 }, "<+0.08");
      if (ok) {
        t.from(q("[data-card]"), { clipPath: "inset(50% 0 50% 0 round 10px)", duration: 0.9 }, "<");
        t.from(q("[data-card-part]"), { y: 14, opacity: 0, duration: 0.8, stagger: 0.08 }, "<+0.25");
      } else {
        t.from(q("[data-closed]"), { opacity: 0, scale: 0.97, duration: 0.6 }, "<");
      }
      t.set(packet, { scale: 1 });
    }, el);
    return () => {
      tl.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);

  const choose = (i: number) => {
    autoplay.current = false;
    next.current?.kill();
    setIdx(i);
    setRun((r) => r + 1);
    const s = SLUGS[i];
    const p = parseResult(s.result);
    setAnnounce(`GET /${s.slug} returned ${p.code}: ${p.reason}.`);
  };

  return (
    <div
      ref={root}
      role="group"
      aria-labelledby="reverie-demo-title"
      aria-describedby="reverie-demo-desc"
      className="rounded-[14px] bg-[var(--s-raised)] p-4 sm:p-7"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p id="reverie-demo-title" className="font-semibold text-[var(--s-fg)]">
          Request a couple&apos;s page
        </p>
        <p className="text-sm text-[var(--s-muted)]">Slugs and names are examples</p>
      </div>
      <p id="reverie-demo-desc" className="sr-only">
        Pick a slug. The request goes to one catch-all route, looks the slug up in Supabase, then passes a
        server-side lifecycle gate. Published rows render; unlisted and missing ones return 404.
      </p>

      <div
        role="group"
        aria-label="Slug to request"
        className="mt-4 grid gap-1 rounded-[10px] border border-[var(--s-rule)] p-1 sm:grid-cols-3"
      >
        {SLUGS.map((s, i) => (
          <button
            key={s.slug}
            type="button"
            aria-pressed={i === idx}
            onClick={() => choose(i)}
            className={[
              "min-h-11 rounded-[7px] px-3 font-mono text-[0.8125rem] transition-colors duration-300",
              i === idx
                ? "bg-[var(--s-fg)] text-[var(--s-bg)]"
                : "text-[var(--s-muted)] hover:bg-[color-mix(in_oklab,var(--s-fg)_7%,transparent)] hover:text-[var(--s-fg)]",
            ].join(" ")}
          >
            /{s.slug}
          </button>
        ))}
      </div>

      {/* Address field: what was requested */}
      <div className="mt-4 flex h-12 items-center gap-3 rounded-[10px] border border-[var(--s-rule)] bg-[var(--s-bg)] px-4 font-mono text-[0.8125rem]">
        <span className="shrink-0 text-[var(--s-muted)]">GET</span>
        <span className="flex min-w-0 items-center">
          <span className="min-w-0 truncate text-[var(--s-muted)]">{host}</span>
          <span className="shrink-0 whitespace-pre text-[var(--s-fg)]" key={current.slug}>
            /
            {current.slug.split("").map((c, i) => (
              <span key={i} data-char>
                {c}
              </span>
            ))}
          </span>
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-4 w-px shrink-0 animate-pulse bg-[var(--s-fg)]"
          />
        </span>
      </div>

      {/* Keyed per run: every request gets fresh DOM, so a reverted tween never restores a stale style. */}
      <div key={run} className="relative mt-8 grid gap-x-10 gap-y-10 md:grid-cols-2">
        <ol data-rail className="relative" aria-label="Request path">
          <span
            data-packet
            aria-hidden="true"
            className="pointer-events-none absolute left-px top-0 z-10 size-2.5 rounded-full opacity-0"
          />

          <Stage
            index={0}
            status={stages[0]}
            accent="var(--s-frontend)"
            title="Catch-all route"
            tech="Next.js"
          >
            <code className="block font-mono text-[0.8125rem] text-[var(--s-frontend)]">
              {reverieRouting.route}
            </code>
            <code className="mt-1 block break-all font-mono text-[0.8125rem] text-[var(--s-muted)]">
              slug = &quot;{current.slug}&quot;
            </code>
          </Stage>

          <Stage
            index={1}
            status={stages[1]}
            accent="var(--s-infra)"
            title="Row lookup"
            tech="Supabase · PostgreSQL"
          >
            <div
              role="table"
              aria-label="Matching row"
              className="max-w-[18rem] overflow-hidden rounded-[6px] border border-[var(--s-rule)] font-mono text-[0.8125rem]"
            >
              <div role="row" className="grid grid-cols-[1.5fr_1fr] border-b border-[var(--s-rule)] text-[var(--s-muted)]">
                <span role="columnheader" className="px-2.5 py-1.5">slug</span>
                <span role="columnheader" className="border-l border-[var(--s-rule)] px-2.5 py-1.5">state</span>
              </div>
              {current.state === "missing" ? (
                <div role="row" data-row className="px-2.5 py-1.5 text-[var(--s-signal)]">
                  <span role="cell">0 rows</span>
                </div>
              ) : (
                <div
                  role="row"
                  data-row
                  className="grid grid-cols-[1.5fr_1fr] bg-[color-mix(in_oklab,var(--s-infra)_10%,transparent)]"
                >
                  <span role="cell" className="truncate px-2.5 py-1.5 text-[var(--s-fg)]">
                    {current.slug}
                  </span>
                  <span
                    role="cell"
                    className="border-l border-[var(--s-rule)] px-2.5 py-1.5"
                    style={{ color: current.state === "published" ? "var(--s-infra)" : "var(--s-signal)" }}
                  >
                    {current.state}
                  </span>
                </div>
              )}
            </div>
          </Stage>

          <Stage
            index={2}
            status={stages[2]}
            accent="var(--s-frontend)"
            title="Lifecycle gate"
            tech="server-side"
            last
          >
            <div className="flex items-end gap-3">
              <Gate open={stages[2] === "pass"} reached={stages[2] !== "skip"} />
              <code className="font-mono text-[0.8125rem] text-[var(--s-muted)]">
                {stages[2] === "skip" ? "not reached" : (
                  <>
                    state ={" "}
                    <span style={{ color: stages[2] === "pass" ? "var(--s-fg)" : "var(--s-signal)" }}>
                      {stages[2] === "pass" ? "published" : current.state}
                    </span>
                  </>
                )}
              </code>
            </div>
          </Stage>
        </ol>

        <p
          data-pending
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 font-mono text-[0.8125rem] text-[var(--s-muted)] opacity-0 max-md:hidden md:left-[calc(50%+1.25rem)]"
        >
          awaiting response
        </p>
        <div data-result className="flex flex-col">
          <div className="flex items-end gap-4 overflow-hidden">
            <span
              data-status
              className="font-mono text-[3.25rem] leading-[0.9] font-medium tracking-[-0.02em]"
              style={{ color: ok ? "var(--s-fg)" : "var(--s-signal)" }}
            >
              {code}
            </span>
            <span className="data pb-1 !text-[var(--s-muted)] truncate">GET /{current.slug}</span>
          </div>
          <p data-reason className="mt-3 text-[var(--s-body)]">
            {reason.charAt(0).toUpperCase() + reason.slice(1)}.
          </p>
          <div className="mt-5 flex-1">
            {ok ? (
              <InvitationCard slug={current.slug} />
            ) : (
              <div
                data-closed
                className="flex h-full min-h-[17rem] flex-col items-center justify-center gap-2 rounded-[10px] border border-dashed border-[var(--s-rule)] px-6 text-center"
              >
                <p className="font-semibold text-[var(--s-fg)]">
                  {current.state === "unlisted" ? "The row exists. The page does not." : "No row, no page."}
                </p>
                <p className="text-sm text-[var(--s-muted)]">Nothing is rendered for this slug.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

function Stage({
  index,
  status,
  accent,
  title,
  tech,
  last,
  children,
}: {
  index: number;
  status: StageStatus;
  accent: string;
  title: string;
  tech: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  const failed = status === "fail";
  const colour = failed ? "var(--s-signal)" : accent;
  return (
    <li
      data-stage={index}
      className={["relative pl-9", last ? "" : "pb-7", status === "skip" ? "opacity-35" : ""].join(" ")}
    >
      {!last ? (
        <span aria-hidden="true" className="absolute left-[5px] top-[19px] bottom-[-3px] w-0.5 bg-[var(--s-rule)]">
          <span
            data-seg
            className="absolute inset-0 origin-top"
            style={{ background: status === "pass" ? "var(--s-muted)" : "transparent" }}
          />
        </span>
      ) : null}
      <span
        data-node
        aria-hidden="true"
        className="absolute left-0 top-[5px] grid size-3 place-items-center rounded-full border-2"
        style={{ borderColor: status === "skip" ? "var(--s-rule)" : colour }}
      >
        {status !== "skip" ? (
          <span data-node-fill className="size-1 rounded-full" style={{ background: colour }} />
        ) : null}
      </span>
      <p className="flex flex-wrap items-baseline gap-x-2.5 leading-snug">
        <span className="font-semibold text-[var(--s-fg)]">{title}</span>
        <span className="text-sm text-[var(--s-muted)]">{tech}</span>
      </p>
      <div className="mt-2">{children}</div>
    </li>
  );
}

/** A boom gate: arm up lets the request through, arm down stops it. */
function Gate({ open, reached }: { open: boolean; reached: boolean }) {
  const colour = !reached ? "var(--s-rule)" : open ? "var(--s-frontend)" : "var(--s-signal)";
  return (
    <svg width="76" height="50" viewBox="0 0 76 50" aria-hidden="true" className="shrink-0">
      <line x1="2" y1="49" x2="74" y2="49" stroke="var(--s-rule)" strokeWidth="1" />
      <line x1="8" y1="40" x2="8" y2="49" stroke="var(--s-muted)" strokeWidth="2" />
      <line x1="70" y1="40" x2="70" y2="49" stroke="var(--s-muted)" strokeWidth="2" />
      <g data-arm transform={open ? "rotate(-52 8 40)" : undefined}>
        <line x1="8" y1="40" x2="66" y2="40" stroke={colour} strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="8" cy="40" r="3.5" fill="var(--s-raised)" stroke="var(--s-muted)" strokeWidth="1.5" />
    </svg>
  );
}
