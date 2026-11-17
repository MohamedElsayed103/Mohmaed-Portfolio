"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EASE, getLenis, gsap, prefersReduced, scrollToTarget, whenVisible, whileVisible } from "@/lib/motion";
import { Blocks } from "./Blocks";
import { Diagram, Lamp, tokenPaths } from "./Diagram";
import { PARALLEL_STEP, blockId, next, parallel, sequence, type MachineNode } from "./model";

const DESCRIPTION = [
  sequence.map((n) => `${n.state} (${n.title}, ${n.period}) on ${n.event}`).join(", then "),
  `. On ${parallel[0].event} it forks into two concurrent states: `,
  parallel.map((n) => `${n.state} at ${n.title}`).join(" and "),
  `. The next state, ${next.state}, is pending on ${next.event}. Each state is a button that scrolls to its details.`,
].join("");

/** Scroll so the block sits across the viewport centre, which is the line that activates states. */
function centreOn(el: HTMLElement) {
  const vh = window.innerHeight;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const offset = Math.min(Math.max(96, vh / 2 - el.offsetHeight / 2), vh / 2 - 32);
  const y = top - offset;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(y, { duration: 1.1 });
  else window.scrollTo({ top: y, behavior: prefersReduced() ? "auto" : "smooth" });
}

export function Machine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const prevRef = useRef(-1);
  const [active, setActive] = useState(-1);
  const [announce, setAnnounce] = useState("");
  const [nextLive, setNextLive] = useState(false);

  // A block crossing the viewport's centre line activates its state.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    root.querySelectorAll("[data-step]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // The pending lamp only breathes while the section is on screen and motion is welcome.
  useEffect(() => {
    if (prefersReduced()) return;
    return whileVisible(rootRef.current, setNextLive);
  }, []);

  // First sight of the diagram: edges draw top-down, states settle in.
  useEffect(() => {
    const wrap = diagramRef.current;
    if (!wrap) return;
    let ctx: gsap.Context | undefined;
    const stop = whenVisible(
      wrap,
      () => {
        ctx = gsap.context(() => {
          const lines = gsap.utils.toArray<SVGLineElement>("[data-draw]");
          lines.forEach((l) => {
            const len = l.getTotalLength();
            gsap.fromTo(
              l,
              { strokeDasharray: len, strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration: 0.7,
                delay: (l.getBBox().y / 700) * 0.9,
                ease: EASE.out,
                clearProps: "strokeDasharray,strokeDashoffset",
              },
            );
          });
          gsap.from("[data-state-node], a", {
            opacity: 0,
            y: 8,
            duration: 0.8,
            stagger: 0.07,
            ease: EASE.out,
            clearProps: "opacity,transform",
          });
        }, wrap);
      },
      "top 75%",
    );
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  // A token travels the incoming transition whenever the machine moves forward.
  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = active;
    const svg = svgRef.current;
    if (!svg || active <= prev || prefersReduced()) return;
    const paths = tokenPaths[active];
    if (!paths) return;
    const tokens = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-token]"));
    const targets = active === PARALLEL_STEP ? parallel : [sequence[active]];
    const tweens: gsap.core.Tween[] = [];

    paths.forEach((d, i) => {
      const token = tokens[i];
      if (!token) return;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      const len = path.getTotalLength();
      token.setAttribute("fill", targets[i]?.accent ?? "var(--s-fg)");
      const p = { t: 0 };
      tweens.push(
        gsap.to(p, {
          t: 1,
          duration: 0.85,
          ease: EASE.quart,
          onStart: () => gsap.set(token, { opacity: 1 }),
          onUpdate: () => {
            const pt = path.getPointAtLength(p.t * len);
            token.setAttribute("cx", String(pt.x));
            token.setAttribute("cy", String(pt.y));
          },
          onComplete: () => {
            gsap.to(token, { opacity: 0, duration: 0.35, ease: EASE.out });
          },
        }),
      );
    });
    return () => tweens.forEach((t) => t.kill());
  }, [active]);

  const select = useCallback((n: MachineNode, focusBlock = false) => {
    const el = document.getElementById(blockId(n.id));
    if (!el) return;
    setActive(n.step);
    setAnnounce(`${n.state}: ${n.title}, ${n.period}`);
    centreOn(el);
    if (focusBlock) el.focus({ preventScroll: true });
  }, []);

  const toNext = useCallback(() => scrollToTarget("#contact"), []);

  return (
    <div ref={rootRef} className="mt-16 sm:mt-24 lg:grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,27rem)_minmax(0,1fr)] xl:gap-28">
      <div className="hidden lg:block">
        <div
          ref={diagramRef}
          role="group"
          aria-label="Career state machine"
          aria-describedby="exp-machine-desc"
          className="sticky top-[5.5rem] pb-8"
        >
          <p id="exp-machine-desc" className="sr-only">
            {DESCRIPTION}
          </p>
          <Diagram ref={svgRef} active={active} onSelect={(n) => select(n)} onNext={toNext} nextLive={nextLive} />
        </div>
      </div>

      <div className="min-w-0 lg:pb-[45vh]">
        <MobileStrip active={active} onSelect={(n) => select(n, true)} />
        <Blocks active={active} onNext={toNext} nextLive={nextLive} />
      </div>

      <p aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}

/** Below lg: the current fork first, earlier states after, each a jump. */
function MobileStrip({ active, onSelect }: { active: number; onSelect: (n: MachineNode) => void }) {
  const phase = (step: number) => (step < active ? "visited" : step === active ? "active" : "upcoming");
  return (
    <nav aria-label="Jump to a state" className="mb-14 lg:hidden">
      <p className="text-[0.9375rem] text-[var(--s-body)]">
        <span className="font-semibold text-[var(--s-fg)]">Current state:</span> two at once.
      </p>
      <div aria-hidden="true" className="mt-4">
        <span className="block h-1.5 w-full rounded-[2px] bg-[color-mix(in_oklab,var(--s-fg)_55%,transparent)]" />
        <span className="grid grid-cols-2 gap-2.5">
          {parallel.map((n) => (
            <span key={n.id} className="mx-auto block h-3.5 w-px bg-[color-mix(in_oklab,var(--s-fg)_55%,transparent)]" />
          ))}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-2.5">
        {parallel.map((n) => (
          <li key={n.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onSelect(n)}
              aria-current={active === n.step ? "step" : undefined}
              className="flex h-full min-h-11 w-full flex-col items-start rounded-[10px] border px-3.5 py-3 text-left transition-colors duration-300"
              style={{
                ["--accent" as string]: n.accent,
                borderColor: n.accent,
                backgroundColor: "color-mix(in oklab, var(--accent) 12%, var(--s-raised))",
              }}
            >
              <span className="flex items-center gap-2 text-[0.8125rem]">
                <Lamp phase="active" size="0.5625rem" />
                <span className="font-mono font-medium tracking-[0.02em] text-[var(--s-fg)]">{n.state}</span>
              </span>
              <span className="mt-1.5 text-[0.9375rem] font-semibold leading-tight text-[var(--s-fg)]">{n.title}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-[0.875rem] text-[var(--s-muted)]">Before that</p>
      <div className="-ml-1.5 flex flex-wrap items-center gap-x-0.5">
        {sequence.map((n, i) => (
          <span key={n.id} className="flex items-center">
            <button
              type="button"
              onClick={() => onSelect(n)}
              aria-current={phase(n.step) === "active" ? "step" : undefined}
              className="inline-flex min-h-11 items-center px-1.5 font-mono text-[0.8125rem] tracking-[0.02em] text-[var(--s-body)] underline decoration-[var(--s-rule)] underline-offset-4 hover:text-[var(--s-fg)] hover:decoration-[var(--s-fg)]"
            >
              {n.state}
            </button>
            {i < sequence.length - 1 ? (
              <span aria-hidden="true" className="text-[var(--s-muted)]">
                →
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </nav>
  );
}
