"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, EASE, whenVisible } from "@/lib/motion";
import { profile } from "@/data/content";

/**
 * Portrait in a precise frame: a hairline rectangle offset behind the photo
 * and a ruled caption. Entrance is a single upward clip reveal; with reduced
 * motion (or no JS) the photo is simply there.
 */
export function Portrait({ className }: { className?: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const photo = el.querySelector("[data-photo]");
    const img = el.querySelector("img");
    const frame = el.querySelector("[data-frame]");
    let ctx: gsap.Context | undefined;
    const stop = whenVisible(
      el,
      () => {
        ctx = gsap.context(() => {
          gsap
            .timeline({ defaults: { ease: EASE.out } })
            .fromTo(photo, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3 })
            .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.6 }, 0)
            .fromTo(frame, { x: -12, y: -12, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.1 }, 0.45);
        }, el);
      },
      "top 85%",
    );
    return () => {
      stop();
      ctx?.revert();
    };
  }, []);

  return (
    <figure ref={ref} className={className}>
      <div className="relative mr-3 mb-3 sm:mr-4 sm:mb-4">
        <div
          data-frame=""
          aria-hidden="true"
          className="absolute inset-0 translate-x-3 translate-y-3 border border-[color-mix(in_oklab,var(--s-fg)_38%,transparent)] sm:translate-x-4 sm:translate-y-4"
        />
        <div data-photo="" className="relative overflow-hidden bg-[var(--s-raised)]">
          <Image
            src={profile.avatar}
            alt={`${profile.name} in a dark suit and white shirt, smiling, photographed outdoors in ${profile.location}`}
            width={profile.avatarWidth}
            height={profile.avatarHeight}
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 320px, 80vw"
            className="block aspect-[4/5] h-auto w-full object-cover"
          />
        </div>
      </div>
      <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--s-rule)] pt-3 text-[0.9375rem]">
        <span className="font-medium text-[var(--s-fg)]">{profile.name}</span>
        <span className="text-[var(--s-muted)]">{profile.location}</span>
      </figcaption>
    </figure>
  );
}
