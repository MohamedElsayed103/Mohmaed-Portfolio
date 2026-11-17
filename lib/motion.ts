"use client";

// Shared motion runtime. Import from here, never from "gsap" directly,
// so plugins register once and every section agrees on easing and reduced motion.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 0.9 });
}

export { gsap, ScrollTrigger };

/** House easings. Exponential ease-out everywhere; no bounce, no elastic. */
export const EASE = {
  out: "expo.out",
  quart: "quart.out",
  inOut: "power3.inOut",
} as const;

/** True when the visitor asked for reduced motion. Call inside effects (not at module scope on the server). */
export function prefersReduced(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

let lenis: Lenis | null = null;

/** Smooth scrolling wired into ScrollTrigger. Started once by <SmoothScroll />. */
export function initSmoothScroll(): Lenis | null {
  if (lenis || prefersReduced()) return lenis;
  // No offset here: section[id] already carries scroll-margin-top in globals.css, and Lenis honours it.
  lenis = new Lenis({ duration: 1.05, anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Scroll to an element or selector, through Lenis when it is running. */
export function scrollToTarget(target: string | HTMLElement): void {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el);
  else el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
}

/**
 * Run `fn` once the element is near the viewport. Content must already be visible in CSS:
 * this only layers an entrance on top. With reduced motion, `fn` is never called.
 * Returns a cleanup function.
 */
export function whenVisible(el: Element | null, fn: () => void, start = "top 82%"): () => void {
  if (!el || prefersReduced()) return () => {};
  const st = ScrollTrigger.create({ trigger: el, start, once: true, onEnter: fn });
  return () => st.kill();
}

/** Pause/resume a loop when `el` leaves/enters the viewport or the tab is hidden. Returns cleanup. */
export function whileVisible(el: Element | null, onChange: (active: boolean) => void): () => void {
  if (!el) return () => {};
  let inView = false;
  const sync = () => onChange(inView && !document.hidden);
  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  io.observe(el);
  document.addEventListener("visibilitychange", sync);
  return () => {
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
  };
}
