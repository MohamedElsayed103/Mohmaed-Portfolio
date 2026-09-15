import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { about, education, profile } from "@/data/content";
import { Cap, Globe, MapPin, Server } from "./icons";

const FACT_ICONS = { pin: MapPin, server: Server, cap: Cap, globe: Globe } as const;

export function About() {
  return (
    <section id="about" className="border-t border-line-soft py-16 sm:py-24">
      <div className="shell">
        <SectionHeading title="About" note={profile.location} />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:gap-20">
          <Reveal>
            <div className="space-y-5">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "max-w-[62ch] text-lead text-ink"
                      : "max-w-[64ch] text-[1.0625rem] leading-[1.75] text-ink-mute"
                  }
                >
                  {p}
                </p>
              ))}
            </div>

            <ul className="mt-9 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {about.facts.map((f) => {
                const Icon = FACT_ICONS[f.icon as keyof typeof FACT_ICONS];
                return (
                  <li key={f.label} className="flex items-start gap-3">
                    <Icon className="mt-0.5 shrink-0 text-signal" />
                    <span>
                      <span className="data block text-ink-faint">{f.label}</span>
                      <span className="text-[0.9375rem] text-ink-dim">{f.value}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={80}>
            <h3 className="border-t border-line pt-5 font-semibold text-ink">Education</h3>
            <ul className="mt-6 space-y-7">
              {education.map((e) => (
                <li key={e.credential} className="flex gap-3.5">
                  <Cap className="mt-1 shrink-0 text-ink-faint" />
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="font-medium text-ink">{e.credential}</p>
                      <span className="data shrink-0 text-signal">{e.year}</span>
                    </div>
                    <p className="mt-1 text-[0.9375rem] text-ink-mute">{e.place}</p>
                    <p className="data mt-0.5 text-ink-faint">{e.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
