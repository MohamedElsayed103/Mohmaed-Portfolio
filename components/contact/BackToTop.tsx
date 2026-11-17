"use client";

import { getLenis, scrollToTarget } from "@/lib/motion";
import { ArrowDown } from "../icons";

export function BackToTop({ className }: { className?: string }) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        if (document.querySelector("#top")) scrollToTarget("#top");
        else {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0 });
        }
      }}
      className={["group inline-flex min-h-11 items-center gap-2", className].filter(Boolean).join(" ")}
    >
      Back to top
      <span className="relative block size-3.5 overflow-hidden">
        <ArrowDown className="absolute inset-0 rotate-180 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full" />
        <ArrowDown className="absolute inset-0 translate-y-full rotate-180 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0" />
      </span>
    </a>
  );
}
