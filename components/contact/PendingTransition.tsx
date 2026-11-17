"use client";

import { useEffect, useRef } from "react";
import { gsap, EASE, whenVisible, whileVisible } from "@/lib/motion";
import { career } from "@/data/content";
import styles from "./contact.module.css";

/**
 * The last edge of the career state machine, drawn across the width:
 * the current (parallel) states, a dashed YOUR_MESSAGE transition, and the
 * pending NEXT_ROLE state. Dashes drift toward NEXT_ROLE while visible.
 */
export function PendingTransition() {
  const ref = useRef<HTMLDivElement>(null);
  const { next, parallel } = career;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stopLoop = whileVisible(el, (on) => {
      el.dataset.live = String(on);
    });
    let ctx: gsap.Context | undefined;
    const stopIn = whenVisible(el, () => {
      ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: EASE.out } })
          .fromTo("[data-wire]", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 })
          .fromTo("[data-label]", { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.8 }, 0.35)
          .fromTo("[data-next]", { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.9 }, 0.7);
      }, el);
    });
    return () => {
      stopLoop();
      stopIn();
      ctx?.revert();
    };
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`State machine, pending transition: ${parallel.map((p) => p.state).join(" and ")}, on event ${next.event}, go to ${next.state}.`}
      className={`${styles.machine} flex items-center gap-3 font-mono text-data text-[var(--s-muted)] sm:gap-4`}
    >
      <span className="flex shrink-0 items-center gap-2">
        <span className="size-2.5 rounded-full bg-[var(--s-fg)]" />
        <span className="hidden md:inline">{parallel.map((p) => p.state).join(" ‖ ")}</span>
      </span>

      <span className="relative flex min-w-[7.5rem] flex-1 items-center">
        <span
          data-label=""
          className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 whitespace-nowrap text-[var(--s-signal)]"
        >
          {next.event}
        </span>
        <span data-wire="" className="flex w-full items-center">
          <svg className="h-2 min-w-0 flex-1" preserveAspectRatio="none" viewBox="0 0 100 8" aria-hidden="true">
            <line
              className={styles.wire}
              x1="0"
              y1="4"
              x2="100"
              y2="4"
              stroke="var(--s-muted)"
              strokeWidth="1.25"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <svg width="8" height="10" viewBox="0 0 8 10" className="-ml-px shrink-0" aria-hidden="true">
            <path d="M0 0 8 5 0 10Z" fill="var(--s-signal)" />
          </svg>
        </span>
      </span>

      <span
        data-next=""
        className={`${styles.chip} shrink-0 rounded-[var(--radius-chip)] border border-[var(--s-fg)] px-2.5 py-1 font-medium text-[var(--s-fg)]`}
      >
        {next.state}
      </span>
    </div>
  );
}
