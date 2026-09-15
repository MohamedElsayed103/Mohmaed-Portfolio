import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TechIcon } from "./TechIcon";
import { Tilt } from "./ui/Tilt";
import { concepts, domainAccent, domainLegend, domainOf, techStack } from "@/data/content";

export function Skills() {
  return (
    <section id="stack" className="border-t border-line-soft py-16 sm:py-24">
      <div className="shell">
        <SectionHeading title="Stack" accent="var(--color-cyan)" note="colour = domain" />

        <Reveal>
          <p className="mt-7 max-w-[58ch] text-lead text-ink-dim">
            What I actually reach for. Colour marks the domain, so the same coding runs through
            every project and role on this page.
          </p>
        </Reveal>

        {/* Legend — teaches the colour system before it is used below */}
        <Reveal delay={50}>
          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3">
            {domainLegend.map((d) => (
              <li key={d.domain} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: domainAccent[d.domain] }}
                />
                <span className="text-[0.9375rem] font-medium text-ink">{d.label}</span>
                <span className="data text-ink-faint">{d.blurb}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {techStack.map((t, i) => {
            const domain = domainOf(t.name);
            const accent = domain ? domainAccent[domain] : "var(--color-ink-mute)";
            return (
              <Reveal key={t.name} as="li" delay={Math.min(i, 12) * 28}>
                <Tilt max={9}>
                  <div
                    style={{ ["--accent" as string]: accent }}
                    className={[
                      "group flex items-center gap-3 rounded-card border px-3.5 py-3",
                      "transition-[transform,border-color,background-color,box-shadow] duration-300 ease-[var(--ease-quart)]",
                      "hover:-translate-y-0.5 hover:accent-glow",
                      t.core
                        ? "accent-chip border"
                        : "border-line-soft text-ink-mute hover:border-line hover:text-ink",
                    ].join(" ")}
                  >
                    <TechIcon
                      name={t.name}
                      size={20}
                      className="shrink-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{ color: "var(--accent)", opacity: t.core ? 1 : 0.6 }}
                    />
                    <span
                      className={
                        t.core
                          ? "text-[0.9375rem] font-medium text-ink"
                          : "text-[0.9375rem] transition-colors duration-300 group-hover:[color:var(--accent)]"
                      }
                    >
                      {t.name}
                    </span>
                  </div>
                </Tilt>
              </Reveal>
            );
          })}
        </ul>

        <Reveal delay={120}>
          <div className="mt-10 border-t border-line-soft pt-7">
            <h3 className="data text-ink-faint">Also comfortable with</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {concepts.map((c) => (
                <li
                  key={c}
                  className="rounded-chip border border-line-soft px-2.5 py-1 font-mono text-[0.75rem] text-ink-mute transition-colors duration-300 hover:border-line hover:text-ink"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
