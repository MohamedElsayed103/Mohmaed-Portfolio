"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EASE, gsap, whenVisible } from "@/lib/motion";

/**
 * Entrance for the strata: layers settle from the bedrock up, each rule
 * draws across, then one packet drops through every layer, taking the
 * colour of the layer it is entering. Server markup is complete; with
 * reduced motion none of this runs.
 */
export function StrataMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let ctx: gsap.Context | undefined;

    const stop = whenVisible(
      root,
      () => {
        ctx = gsap.context(() => {
          const bands = gsap.utils.toArray<HTMLElement>("[data-band]", root);
          const packet = root.querySelector<HTMLElement>("[data-packet]");
          const base = root.getBoundingClientRect();

          // Measure resting positions before any from-state shifts them.
          const stops = bands.map((b) => {
            const lamp = b.querySelector<HTMLElement>("[data-lamp]")!;
            const r = lamp.getBoundingClientRect();
            return {
              lamp,
              x: r.left + r.width / 2 - base.left,
              y: r.top + r.height / 2 - base.top,
              color: getComputedStyle(b).getPropertyValue("--accent").trim() || "currentColor",
            };
          });

          const tl = gsap.timeline({ defaults: { ease: EASE.out } });
          const upward = [...bands].reverse();
          upward.forEach((b, i) => {
            const at = i * 0.12;
            tl.from(b.querySelector("[data-rule]"), { scaleX: 0, duration: 1.1 }, at);
            tl.from(
              b.querySelectorAll("[data-settle]"),
              { y: 26, opacity: 0, duration: 0.9, stagger: 0.05, clearProps: "transform,opacity" },
              at + 0.05,
            );
          });

          if (packet && stops.length) {
            const first = stops[0];
            tl.set(packet, { x: first.x, y: first.y - 56, opacity: 0, backgroundColor: "var(--s-signal)" }, ">-0.35");
            tl.to(packet, { opacity: 1, y: first.y - 28, duration: 0.25, ease: "none" });
            stops.forEach((s) => {
              tl.to(packet, { y: s.y, duration: 0.42, ease: "power2.in" });
              tl.set(packet, { backgroundColor: s.color });
              tl.fromTo(
                s.lamp,
                { scale: 2.1 },
                { scale: 1, duration: 0.7, ease: EASE.out, clearProps: "transform" },
                "<",
              );
            });
            tl.to(packet, { opacity: 0, scale: 0.4, duration: 0.5, ease: EASE.out });
          }
        }, root);
      },
      "top 78%",
    );

    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  return (
    <div ref={ref} className="strata relative">
      {children}
      <span
        data-packet
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[1] -ml-[5px] -mt-[5px] h-2.5 w-2.5 rounded-[2px] opacity-0"
      />
    </div>
  );
}
