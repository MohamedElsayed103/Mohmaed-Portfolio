"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReduced } from "@/lib/motion";

/** Pale state of an unfilled word: faint but still readable on the light theme. */
const PALE = 0.2;

function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <span key={i}>
      <span data-fill="">{w}</span>
      {/* Keep the last two words together so the statement never ends on an orphan. */}
      {i < words.length - 2 ? " " : i === words.length - 2 ? " " : null}
    </span>
  ));
}

/**
 * The About statement. The first sentence is the section's h2; the rest
 * continues inline as a paragraph so it reads as one block of type.
 *
 * Words are split in the render itself (identical on server and client) and
 * are full ink by default. Only after mount, and only without reduced
 * motion, do they drop to a pale tone and fill in step with the scroll.
 */
export function StatementFill({
  text,
  headingId,
  className,
}: {
  text: string;
  headingId: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cut = text.indexOf(". ") + 1;
  const lead = cut > 0 ? text.slice(0, cut) : text;
  const rest = cut > 0 ? text.slice(cut + 1) : "";

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-fill]"),
        { opacity: PALE },
        {
          opacity: 1,
          ease: "none",
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.4 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  const type = "inline font-semibold text-[var(--s-fg)]";

  return (
    <div
      ref={ref}
      className={[
        "max-w-[25ch] text-pretty text-[clamp(1.75rem,1.05rem+2.5vw,3.125rem)] leading-[1.12] tracking-[-0.024em]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 id={headingId} className={type}>
        <Words text={lead} />
      </h2>
      {rest ? (
        <>
          {" "}
          <p className={type}>
            <Words text={rest} />
          </p>
        </>
      ) : null}
    </div>
  );
}
