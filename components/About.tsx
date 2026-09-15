import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { about, education, involvement, profile } from "@/data/content";

export function About() {
  return (
    <section id="about" className="border-t border-line-soft py-20 sm:py-28">
      <div className="shell">
        <SectionHeading title="About" note={profile.location} />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-20">
          {/* Narrative */}
          <Reveal>
            <div className="space-y-6">
              {about.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "max-w-[64ch] text-lead text-ink"
                      : "max-w-[66ch] text-[1.0625rem] leading-[1.75] text-ink-mute"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </Reveal>

          {/* Portrait + spec sheet */}
          <Reveal delay={90}>
            <div className="relative w-full max-w-[22rem]">
              <Image
                src={profile.avatar}
                alt={`${profile.name}, ${profile.role}`}
                width={352}
                height={352}
                sizes="(max-width: 1024px) 60vw, 352px"
                className="w-full rounded-card border border-line object-cover"
                priority={false}
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-2 -right-2 h-16 w-16 rounded-br-card border-b border-r border-signal"
              />
            </div>

            <dl className="mt-10 max-w-[22rem]">
              {about.facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-5 border-b border-line-soft py-3"
                >
                  <dt className="data shrink-0 text-ink-faint">{f.label}</dt>
                  <dd className="text-right text-[0.9375rem] text-ink-dim">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Education & involvement */}
        <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h3 className="border-t border-line pt-5 font-semibold text-ink">Education</h3>
            <ul className="mt-6 space-y-7">
              {education.map((e) => (
                <li key={e.credential}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-medium text-ink">{e.credential}</p>
                    <span className="data shrink-0 text-signal">{e.year}</span>
                  </div>
                  <p className="mt-1 text-[0.9375rem] text-ink-mute">{e.place}</p>
                  <p className="data mt-0.5 text-ink-faint">{e.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={70}>
            <h3 className="border-t border-line pt-5 font-semibold text-ink">Beyond the job</h3>
            <ul className="mt-6 space-y-7">
              {involvement.map((v) => (
                <li key={v.title}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-medium text-ink">{v.title}</p>
                    <span className="data shrink-0 text-ink-faint">{v.period}</span>
                  </div>
                  <p className="mt-1 text-[0.9375rem] text-ink-mute">{v.place}</p>
                  <p className="mt-2 max-w-[54ch] text-[0.9375rem] text-ink-mute">{v.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
