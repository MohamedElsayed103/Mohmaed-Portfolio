"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&/<>{}[]$*+=";

/**
 * Decode-on-reveal effect for headings.
 *
 * The real text is rendered on the server and is what a crawler, a
 * screen reader, or a JS-less visitor sees — the scramble only starts
 * once the component has mounted and scrolled into view, and it always
 * finishes on the exact source string. Reduced motion skips it.
 */
export function Scramble({ text, className }: { text: string; className?: string }) {
  const [display, setDisplay] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || done.current) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    let frame = 0;

    const run = () => {
      // Each character locks in after its own threshold, so the word
      // resolves left to right instead of all at once.
      const out = text
        .split("")
        .map((ch, i) => {
          if (ch === " ") return " ";
          if (frame > i * 2.2 + 8) return ch;
          if (frame < i * 2.2) return "";
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        })
        .join("");

      setDisplay(out);
      frame += 1;

      if (out === text) {
        done.current = true;
        return;
      }
      raf = requestAnimationFrame(run);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          raf = requestAnimationFrame(run);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {/* Accessible name stays the real string even mid-scramble */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
