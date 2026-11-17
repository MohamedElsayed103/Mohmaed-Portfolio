"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, EASE, whenVisible } from "@/lib/motion";
import { profile } from "@/data/content";
import { ArrowRight, Check, Copy } from "../icons";
import { Lamp } from "./Lamp";

const HEADING = "One event away.";

/**
 * Heading, availability, the email address as the hero, and the two email
 * actions. One entrance: heading characters rise out of word masks, then the
 * address rises out of its own masks. Everything is visible without JS.
 */
export function ContactHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState<"idle" | "ok" | "fail">("idle");
  const at = profile.email.indexOf("@");
  const local = profile.email.slice(0, at);
  const domain = profile.email.slice(at);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: gsap.Context | undefined;
    const stop = whenVisible(
      el,
      () => {
        ctx = gsap.context(() => {
          gsap
            .timeline({ defaults: { ease: EASE.out } })
            .fromTo("[data-char]", { yPercent: 115 }, { yPercent: 0, duration: 1.15, stagger: 0.028 })
            .fromTo("[data-rise]", { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: 0.09 }, 0.35)
            .fromTo("[data-after]", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 }, 0.6);
        }, el);
      },
      "top 85%",
    );
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  useEffect(() => {
    if (copied === "idle") return;
    const t = window.setTimeout(() => setCopied("idle"), 2400);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied("ok");
    } catch {
      setCopied("fail");
    }
  }

  const words = HEADING.split(" ");
  const mask = "inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-top";

  return (
    <div ref={ref}>
      <h2 id="contact-title" className="text-display font-extrabold text-[var(--s-fg)]">
        <span className="sr-only">{HEADING}</span>
        <span aria-hidden="true">
          {words.map((w, wi) => (
            <span key={wi}>
              <span className={mask}>
                {[...w].map((c, ci) => {
                  const last = wi === words.length - 1 && ci === w.length - 1 && c === ".";
                  return (
                    <span
                      key={ci}
                      data-char=""
                      className={["inline-block", last ? "text-[var(--s-signal)]" : ""].join(" ")}
                    >
                      {c}
                    </span>
                  );
                })}
              </span>
              {wi < words.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      </h2>

      <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-[minmax(0,34rem)_auto] md:items-end md:justify-between">
        <p data-after="" className="max-w-[40ch] text-lead text-[var(--s-body)]">
          Tell me what you are building and where it hurts. One message is all it takes to move this
          machine to its next state.
        </p>
        <p data-after="" className="flex items-center gap-3 text-[0.9375rem] text-[var(--s-fg)] md:pb-1.5">
          <Lamp />
          {profile.availability}
        </p>
      </div>

      <div className="@container mt-16 sm:mt-24">
        <a
          href={`mailto:${profile.email}`}
          data-fire=""
          className="group relative inline-block max-w-full text-[clamp(1.5rem,8.6cqi,5.5rem)] leading-[1.02] font-bold tracking-[-0.035em] text-[var(--s-fg)] @[46rem]:text-[clamp(1.5rem,5.75cqi,5.5rem)]"
        >
          <span className={mask}>
            <span data-rise="" className="inline-block">
              {local}
            </span>
          </span>
          <wbr />
          <span className={mask}>
            <span data-rise="" className="inline-block text-[var(--s-muted)] transition-colors duration-300 group-hover:text-[var(--s-fg)]">
              {domain}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-0 h-[3px] w-full origin-left scale-x-0 bg-[var(--s-signal)] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
          />
        </a>
      </div>

      <div data-after="" className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${profile.email}`}
          data-fire=""
          className="group inline-flex min-h-12 items-center gap-3 rounded-[var(--radius-chip)] bg-[var(--s-signal)] px-5 font-semibold text-[var(--s-on-signal)] transition-colors duration-200 hover:bg-[var(--color-signal-hot)]"
        >
          Write an email
          <span className="relative block size-3.5 overflow-hidden">
            <ArrowRight className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-full" />
            <ArrowRight className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0" />
          </span>
        </a>
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-12 items-center gap-2.5 rounded-[var(--radius-chip)] border border-[var(--s-rule)] px-5 font-medium text-[var(--s-fg)] transition-colors duration-200 hover:border-[var(--color-line-strong)]"
        >
          {copied === "ok" ? <Check className="text-[var(--s-infra)]" /> : <Copy />}
          {copied === "ok" ? "Copied" : "Copy address"}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {copied === "ok"
            ? `Copied ${profile.email} to the clipboard.`
            : copied === "fail"
              ? `Could not copy. The address is ${profile.email}.`
              : ""}
        </span>
        {copied === "fail" ? (
          <span aria-hidden="true" className="text-[0.9375rem] text-[var(--s-muted)]">
            Copy blocked by the browser. Select the address above.
          </span>
        ) : null}
      </div>
    </div>
  );
}
