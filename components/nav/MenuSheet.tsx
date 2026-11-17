"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, profile } from "@/data/content";
import { gsap, EASE, prefersReduced } from "@/lib/motion";
import { Download } from "../icons";

/**
 * Full-screen menu for narrow screens. A real modal dialog: focus moves in,
 * is trapped, Esc closes, and the caller restores focus to the menu button.
 *
 * Choosing a link closes the sheet FIRST and only then hands the target back
 * through onClose, so the scroll starts after the sheet is gone. Closing while a
 * scroll is in flight cancelled it before (see README), so the two never overlap.
 * No body scroll lock either, for the same reason.
 */
export function MenuSheet({
  open,
  active,
  onClose,
}: {
  open: boolean;
  active: string;
  onClose: (href?: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const closing = useRef(false);

  // Open: mount during render (React's adjust-state-on-prop-change pattern), then animate in and move focus.
  if (open && !shown) setShown(true);

  useEffect(() => {
    const el = ref.current;
    if (!shown || !el || !open) return;
    closing.current = false;
    el.querySelector<HTMLElement>("[data-first]")?.focus({ preventScroll: true });
    if (prefersReduced()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: EASE.out });
      gsap.from("[data-item]", { yPercent: 110, duration: 0.8, ease: EASE.out, stagger: 0.05, delay: 0.12 });
      gsap.from("[data-foot]", { opacity: 0, duration: 0.5, delay: 0.4 });
    }, el);
    return () => ctx.revert();
  }, [shown, open]);

  const close = (href?: string) => {
    const el = ref.current;
    if (!el || closing.current) return;
    closing.current = true;
    const done = () => {
      setShown(false);
      onClose(href);
    };
    if (prefersReduced()) return done();
    gsap.to(el, { clipPath: "inset(0 0 100% 0)", duration: 0.38, ease: EASE.inOut, onComplete: done });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab" || !ref.current) return;
    const f = ref.current.querySelectorAll<HTMLElement>("a[href], button");
    const first = f[0];
    const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      ref={ref}
      id="nav-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      hidden={!shown}
      onKeyDown={onKeyDown}
      data-theme="dark"
      className="fixed inset-0 z-[var(--z-sheet)] flex flex-col overflow-y-auto overscroll-contain !bg-bg min-[820px]:hidden"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="shell flex h-16 shrink-0 items-center justify-between">
        <span className="inline-flex items-center gap-2.5 font-bold tracking-[-0.01em] text-[var(--s-fg)]">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--s-signal)]" />
          {profile.name}
        </span>
        <button
          type="button"
          data-first=""
          onClick={() => close()}
          className="-mr-2 inline-flex min-h-11 items-center gap-2.5 px-2 text-[0.9375rem] font-medium text-[var(--s-fg)]"
        >
          Close
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 2l10 10M12 2 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav aria-label="Sections" className="shell flex flex-1 flex-col justify-center py-8">
        <ul>
          {navLinks.map((l) => {
            const on = active === l.href;
            return (
              <li key={l.href} className="overflow-hidden">
                <a
                  data-item=""
                  href={l.href}
                  aria-current={on ? "location" : undefined}
                  onClick={(e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                    e.preventDefault();
                    close(l.href);
                  }}
                  className={`flex min-h-14 items-center gap-4 py-1 text-[clamp(2.25rem,11vw,3.25rem)] leading-[1.05] font-extrabold tracking-[-0.03em] transition-colors ${on ? "text-[var(--s-fg)]" : "text-[var(--s-muted)] hover:text-[var(--s-fg)]"}`}
                >
                  {l.label}
                  {on ? <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--s-signal)]" /> : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div data-foot="" className="shell flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 pb-10">
        <a
          href={profile.cv}
          download
          className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[var(--s-signal)] px-5 font-semibold text-[var(--s-on-signal)]"
        >
          <Download />
          Download CV
        </a>
        <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 items-center text-[0.9375rem] text-[var(--s-muted)] hover:text-[var(--s-fg)]">
          Email
        </a>
      </div>
    </div>
  );
}
