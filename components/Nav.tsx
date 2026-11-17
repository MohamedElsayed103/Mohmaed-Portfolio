"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, profile } from "@/data/content";
import { prefersReduced, scrollToTarget } from "@/lib/motion";
import { MenuSheet } from "./nav/MenuSheet";
import { Download } from "./icons";

type Theme = "dark" | "raised" | "sunken" | "light";
const THEMES = new Set<Theme>(["dark", "raised", "sunken", "light"]);

/**
 * Fixed header. It reads the section[data-theme] under the bar and takes the
 * same theme, so it stays legible over light and dark sections alike; tracks
 * the active section; draws scroll progress; and slides away on scroll down,
 * back on scroll up (never while keyboard focus is inside it).
 */
export function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const [theme, setTheme] = useState<Theme>("dark");
  const [active, setActive] = useState("");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    let travel = 0;

    const update = () => {
      raf = 0;
      const header = headerRef.current;
      if (!header) return;
      const y = window.scrollY;
      const h = header.offsetHeight;
      const vh = window.innerHeight;

      // Theme: the deepest themed section under the middle of the bar.
      const probe = h / 2;
      let t: Theme = "dark";
      document.querySelectorAll<HTMLElement>("section[data-theme], footer[data-theme]").forEach((el) => {
        const r = el.getBoundingClientRect();
        const v = el.dataset.theme as Theme;
        if (r.top <= probe && r.bottom > probe && THEMES.has(v)) t = v;
      });
      setTheme(t);

      // Active section: the one crossing a line 35% down the viewport.
      const line = vh * 0.35;
      let a = "";
      for (const l of navLinks) {
        const el = document.querySelector<HTMLElement>(l.href);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) a = l.href;
      }
      setActive(a);

      const max = document.documentElement.scrollHeight - vh;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      setScrolled(y > 8);

      // Hide on scroll down, reveal on scroll up, with a little hysteresis.
      const dy = y - lastY;
      lastY = y;
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      const focusInside = header.contains(document.activeElement) && document.activeElement?.matches(":focus-visible");
      if (y < h * 2 || openRef.current || focusInside) setHidden(false);
      else if (travel > 24) setHidden(true);
      else if (travel < -12) setHidden(false);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Keyboard focus entering a hidden bar brings it back.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onFocus = () => setHidden(false);
    header.addEventListener("focusin", onFocus);
    return () => header.removeEventListener("focusin", onFocus);
  }, []);

  const go = useCallback((href: string) => {
    if (href === "#top") {
      const top = document.querySelector<HTMLElement>("#top");
      if (top) scrollToTarget(top);
      else window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
    } else scrollToTarget(href);
  }, []);

  const onLink = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (!document.querySelector(href)) return;
      e.preventDefault();
      window.history.pushState(null, "", href);
      go(href);
    },
    [go],
  );

  // We took over in-page navigation, so back/forward must scroll too.
  useEffect(() => {
    const onPop = () => go(window.location.hash || "#top");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [go]);

  const linkBase =
    "relative inline-flex min-h-11 items-center px-3 text-[0.9375rem] transition-colors duration-200";

  return (
    <>
      <header
        ref={headerRef}
        data-theme={theme}
        data-hidden={hidden || undefined}
        className={[
          "fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[transform,background-color,color,border-color] duration-300 ease-[var(--ease-expo)]",
          "data-[hidden]:-translate-y-full",
          scrolled
            ? "border-b border-[var(--s-rule)] [&[data-theme=dark]]:!bg-bg"
            : "border-b border-transparent [&[data-theme=dark]]:!bg-transparent",
        ].join(" ")}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <nav className="shell flex h-16 items-center justify-between gap-6" aria-label="Primary">
          <a
            href="#top"
            onClick={(e) => onLink(e, "#top")}
            className="group -ml-1 inline-flex min-h-11 items-center gap-2.5 px-1 font-bold tracking-[-0.01em] text-[var(--s-fg)]"
          >
            <span aria-hidden="true" className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-[var(--s-signal)] opacity-60 motion-safe:animate-[nav-lamp_2.8s_ease-out_infinite]" />
              <span className="relative h-2 w-2 rounded-full bg-[var(--s-signal)]" />
            </span>
            {profile.name}
          </a>

          <div className="flex items-center gap-1">
            <ul className="hidden items-center min-[820px]:flex">
              {navLinks.map((l) => {
                const on = active === l.href;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => onLink(e, l.href)}
                      aria-current={on ? "location" : undefined}
                      className={`${linkBase} ${on ? "text-[var(--s-fg)]" : "text-[var(--s-muted)] hover:text-[var(--s-fg)]"}`}
                    >
                      {l.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 bottom-2 h-px origin-left bg-[var(--s-signal)] transition-transform duration-500 ease-[var(--ease-expo)] ${on ? "scale-x-100" : "scale-x-0"}`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href={profile.cv}
              download
              className="ml-3 hidden min-h-10 items-center gap-2 rounded-md border border-[var(--s-rule)] px-3.5 text-[0.875rem] font-medium text-[var(--s-fg)] transition-colors duration-200 hover:border-[var(--s-signal)] min-[820px]:inline-flex"
            >
              <Download size={13} />
              Download CV
            </a>
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="nav-sheet"
              className="-mr-2 inline-flex min-h-11 items-center gap-2.5 px-2 text-[0.9375rem] font-medium text-[var(--s-fg)] min-[820px]:hidden"
            >
              Menu
              <svg width="18" height="10" viewBox="0 0 18 10" aria-hidden="true">
                <path d="M1 1h16M7 9h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>

        <div
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px h-px origin-left bg-[var(--s-signal)]"
          style={{ transform: "scaleX(0)" }}
        />
        <style>{`@keyframes nav-lamp{0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(2.6);opacity:0}}`}</style>
      </header>

      <MenuSheet
        open={open}
        active={active}
        onClose={(href) => {
          setOpen(false);
          menuBtnRef.current?.focus({ preventScroll: true });
          // The sheet has fully closed by now, so this scroll cannot be cancelled by it.
          if (href) {
            window.history.pushState(null, "", href);
            go(href);
          }
        }}
      />
    </>
  );
}

