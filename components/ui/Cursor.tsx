"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom cursor: a dot that tracks the pointer exactly (so precision is
 * never lost) plus a ring that lags behind and swells over interactive
 * elements.
 *
 * Nothing renders at all unless the device has a fine pointer and allows
 * motion — otherwise the two elements would sit stranded at the top-left
 * corner of a phone screen. Positions are written straight to the DOM in
 * a rAF loop, so pointer movement never triggers a React re-render.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  // Decide once on mount, and keep following the media queries after.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setEnabled(fine.matches && !calm.matches);
    sync();
    fine.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let seen = false;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        // Stay hidden until the pointer actually moves, so nothing
        // flashes in the corner on load.
        seen = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const tick = () => {
      // Exponential ease toward the pointer — no spring, no overshoot.
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const INTERACTIVE = "a, button, [role='button'], input, textarea, select, summary";
    const onOver = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target.closest(INTERACTIVE) : null;
      if (ring.current) ring.current.dataset.active = el ? "true" : "false";
    };

    const hide = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", hide);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", hide);
      root.classList.remove("has-custom-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dot} className="cursor-dot" style={{ opacity: 0 }} aria-hidden="true" />
      <div ref={ring} className="cursor-ring" style={{ opacity: 0 }} aria-hidden="true" />
    </>
  );
}
