import { TechIcon } from "../TechIcon";
import { accentOf } from "@/data/content";

/**
 * Seamless technology strip. The track holds the same run twice and
 * translates by -50%, so the loop has no visible seam. The duplicate is
 * aria-hidden so the list is announced once.
 */
export function Marquee({ items, speed = 38 }: { items: readonly string[]; speed?: number }) {
  const run = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((name) => (
        <li
          key={name}
          className="flex items-center gap-2.5 px-6 py-1"
          style={{ ["--accent" as string]: accentOf(name) ?? "var(--color-ink-mute)" }}
        >
          <TechIcon name={name} size={17} className="shrink-0" style={{ color: "var(--accent)" }} />
          <span className="font-mono text-data whitespace-nowrap text-ink-mute">{name}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee relative overflow-hidden border-y border-line-soft py-3.5">
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        {run(false)}
        {run(true)}
      </div>
      {/* Fade the strip into the page at both ends */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent"
      />
    </div>
  );
}
