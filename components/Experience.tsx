import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { experience } from "@/data/content";

export function Experience() {
  return (
    <section id="experience" className="border-t border-line-soft py-20 sm:py-28">
      <div className="shell">
        <SectionHeading title="Experience" note="2023 — present" />

        <ol className="mt-14">
          {experience.map((role, i) => (
            <Reveal
              key={`${role.company}-${role.role}`}
              delay={i * 60}
              as="li"
              className="grid gap-x-10 gap-y-3 md:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]"
            >
              {/* Period rail */}
              <div className="md:pt-1">
                <p className="font-mono text-data text-ink-dim">{role.period}</p>
                <p className="mt-1 font-mono text-[0.6875rem] text-ink-faint">
                  {role.type} · {role.location}
                </p>
              </div>

              {/* Entry */}
              <div className="relative border-l border-line-soft pb-14 pl-7 sm:pl-9">
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

                <p className="mt-2.5 max-w-[66ch] text-lead text-ink-dim">{role.summary}</p>

                <ul className="mt-5 space-y-3">
                  {role.bullets.map((b) => (
                    <li key={b} className="flex gap-3.5 text-[0.9375rem] text-ink-mute">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-line-strong"
                      />
                      <span className="max-w-[72ch]">{b}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {role.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-chip border border-line-soft bg-bg-raised px-2.5 py-1 font-mono text-[0.6875rem] text-ink-mute"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
