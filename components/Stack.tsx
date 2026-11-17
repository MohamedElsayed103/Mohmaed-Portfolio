import { TechIcon } from "./TechIcon";
import { StrataMotion } from "./stack/StrataMotion";
import { concepts, domainLegend, domainOf, techStack, type Domain } from "@/data/content";

/* A cross-section of a running system: one stratum per domain, from the
   browser at the top to the ideas everything stands on at the bottom. */

const ORDER: Domain[] = ["frontend", "compiled", "python", "infra"];

const ACCENT: Record<Domain, string> = {
  compiled: "var(--s-compiled)",
  python: "var(--s-python)",
  infra: "var(--s-infra)",
  frontend: "var(--s-frontend)",
};

const bands = ORDER.map((d) => {
  const legend = domainLegend.find((l) => l.domain === d)!;
  return {
    key: d,
    label: legend.label,
    blurb: legend.blurb,
    accent: ACCENT[d],
    items: techStack.filter((t) => domainOf(t.name) === d),
  };
});

const CSS = `
.strata [data-band] { transition: background-color .5s var(--ease-quart); }
.strata [data-band]:hover { background-color: color-mix(in oklab, var(--accent) 7%, var(--s-raised)); }
.strata [data-band]:hover [data-rule] { background-color: color-mix(in oklab, var(--accent) 70%, transparent); }
.strata [data-band]:hover [data-lamp] { box-shadow: 0 0 0 4px color-mix(in oklab, var(--accent) 22%, transparent), 0 0 18px color-mix(in oklab, var(--accent) 70%, transparent); }
.strata .w { transition: color .35s var(--ease-quart); }
.strata .w-core { color: var(--s-fg); }
.strata .w-soft { color: var(--s-body); }
.strata .w-icon { color: color-mix(in oklab, var(--accent) 80%, transparent); transition: color .35s var(--ease-quart); }
.strata:has([data-band]:hover) [data-band]:not(:hover) .w,
.strata:has([data-band]:hover) [data-band]:not(:hover) .w-icon { color: var(--s-muted); }
.strata [data-band]:hover .w:hover { color: var(--accent); }
.strata [data-band]:hover .w:hover .w-icon { color: var(--accent); }
`;

function Lamp() {
  return (
    <span
      data-lamp
      aria-hidden="true"
      className="mt-[0.45rem] block h-2.5 w-2.5 shrink-0 rounded-full transition-shadow duration-500"
      style={{ backgroundColor: "var(--accent)" }}
    />
  );
}

function Band({
  label,
  blurb,
  accent,
  bedrock,
  children,
}: {
  label: string;
  blurb: string;
  accent: string;
  bedrock?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      data-band
      className={`relative ${bedrock ? "bg-[var(--s-raised)]" : ""}`}
      style={{ ["--accent" as string]: accent }}
    >
      <span
        data-rule
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left bg-[var(--s-rule)] transition-colors duration-500"
      />
      <div className="shell grid gap-x-12 gap-y-5 py-10 sm:py-14 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:py-16">
        <div data-settle className="flex items-start gap-3.5">
          <Lamp />
          <div>
            <h3 className="text-[1.0625rem] font-semibold leading-snug text-[var(--s-fg)]">{label}</h3>
            <p className="mt-0.5 text-[0.9375rem] leading-snug text-[var(--s-muted)]">{blurb}</p>
          </div>
        </div>
        <div data-settle>{children}</div>
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <section id="stack" data-theme="sunken" className="py-28 sm:py-40">
      <style>{CSS}</style>
      <div className="shell flex flex-wrap items-baseline justify-between gap-x-12 gap-y-5">
        <h2 className="text-h1 font-extrabold">The stack, top to bottom.</h2>
        <p className="max-w-[44ch] text-lead text-[var(--s-muted)]">
          Each layer is a domain, from what runs in the browser down to the ideas the rest stands on. Heavier type is
          the core.
        </p>
      </div>

      <div className="mt-16 sm:mt-24">
        <StrataMotion>
          {bands.map((b) => (
            <Band key={b.key} label={b.label} blurb={b.blurb} accent={b.accent}>
              <ul className="flex flex-wrap items-baseline gap-x-[0.85em] gap-y-[0.2em] text-[clamp(1.75rem,1.05rem+2.6vw,3.25rem)] leading-[1.12] tracking-[-0.028em]">
                {b.items.map((t) => (
                  <li
                    key={t.name}
                    className={`w inline-flex items-baseline gap-[0.28em] ${t.core ? "w-core font-extrabold" : "w-soft font-normal"}`}
                  >
                    <TechIcon name={t.name} className="w-icon h-[0.5em] w-[0.5em] shrink-0 self-center" />
                    {t.name}
                  </li>
                ))}
              </ul>
            </Band>
          ))}
          <Band label="Concepts" blurb="What the layers above stand on" accent="var(--s-fg)" bedrock>
            <ul className="flex flex-wrap gap-x-[1.1em] gap-y-[0.35em] text-[clamp(1.0625rem,0.9rem+0.8vw,1.5rem)] font-medium leading-snug tracking-[-0.012em]">
              {concepts.map((c) => (
                <li key={c} className="w w-soft">
                  {c}
                </li>
              ))}
            </ul>
          </Band>
        </StrataMotion>
      </div>
    </section>
  );
}
