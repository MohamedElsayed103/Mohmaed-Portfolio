"use client";

import { useEffect, useRef } from "react";

/**
 * Staggered word-by-word entrance for a headline.
 *
 * Words render as plain text on the server; the hidden from-state lives
 * behind `@media (scripting: enabled)` in globals.css, so a JS-less or
 * headless render shows the finished headline rather than nothing.
 */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  step = 70,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  step?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const words = node.querySelectorAll<HTMLElement>("[data-word]");
    if (typeof IntersectionObserver === "undefined") {
      words.forEach((w) => w.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          words.forEach((w) => w.classList.add("is-in"));
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <span
            data-word=""
            className={["inline-block", wordClassName].filter(Boolean).join(" ")}
            style={{ "--word-delay": `${delay + i * step}ms` } as React.CSSProperties}
          >
            {word}
          </span>
          {i < text.split(" ").length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
