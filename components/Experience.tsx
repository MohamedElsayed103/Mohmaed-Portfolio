import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { StackRow } from "./StackRow";
import { experience } from "@/data/content";

export function Experience() {
  return (
    <section id="experience" className="border-t border-line-soft py-16 sm:py-24">
      <div className="shell">
        <SectionHeading title="Experience" note="2023 — present" />

        <ol className="mt-10 sm:mt-14">
          {experience.map((role, i) => (
            <Reveal
              key={`${role.company}-${role.role}`}
              delay={i * 60}
              as="li"
              className="grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
            >
              <div className="md:pt-1">
                <p className="font-mono text-data text-ink-dim">{role.period}</p>
                <p className="mt-0.5 font-mono text-[0.6875rem] text-ink-faint">{role.type}</p>
              </div>

              <div className="relative border-l border-line-soft pb-12 pl-6 sm:pl-8">
                <span
                  aria-hidden="true"
                  className={[
                    "absolute -left-[4.5px] top-2 h-2.5 w-2.5 rounded-full ring-4 ring-bg",
                    role.current ? "bg-signal" : "bg-line-strong",
                  ].join(" ")}
                />

                <h3 className="text-h3 font-bold text-ink">
                  {role.role}
                  <span className="text-ink-faint"> · </span>
                  <span className="text-signal">{role.company}</span>
                </h3>

                <p className="mt-2 max-w-[62ch] text-lead text-ink-dim">{role.summary}</p>

                <ul className="mt-4 space-y-2.5">
                  {role.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-[0.9375rem] text-ink-mute">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                      <span className="max-w-[68ch]">{b}</span>
                    </li>
                  ))}
                </ul>

                <StackRow items={role.stack} size="sm" className="mt-5" />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
