import { Reveal } from "./Reveal";
import { StatementFill } from "./about/StatementFill";
import { Portrait } from "./about/Portrait";
import { about, education, statement } from "@/data/content";

export function About() {
  return (
    <section id="about" data-theme="light" aria-labelledby="about-title" className="py-28 sm:py-40">
      <div className="shell">
        <StatementFill text={statement} headingId="about-title" />

        <div className="mt-20 grid gap-y-16 sm:mt-28 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <Portrait className="mx-auto w-full max-w-[22rem] sm:mx-0 lg:sticky lg:top-28 lg:max-w-none" />
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal className="max-w-[65ch] space-y-5 text-[1.0625rem] leading-[1.75] sm:text-lg">
              {about.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-[var(--s-fg)]" : "text-[var(--s-body)]"}>
                  {p}
                </p>
              ))}
            </Reveal>

            <Reveal delay={60}>
              <dl className="mt-14 border-b border-[var(--s-rule)]">
                {about.facts.map((f) => (
                  <div
                    key={f.label}
                    className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-6 border-t border-[var(--s-rule)] py-4 sm:grid-cols-[9rem_minmax(0,1fr)]"
                  >
                    <dt className="text-[0.9375rem] text-[var(--s-muted)]">{f.label}</dt>
                    <dd className="text-[1.0625rem] font-medium text-[var(--s-fg)]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={60} className="mt-16">
              <h3 className="text-[1.0625rem] font-semibold text-[var(--s-fg)]">Education</h3>
              <ol className="mt-4 border-b border-[var(--s-rule)]">
                {education.map((e) => (
                  <li
                    key={e.credential}
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 border-t border-[var(--s-rule)] py-5"
                  >
                    <div>
                      <p className="text-[1.0625rem] leading-snug font-medium text-[var(--s-fg)]">{e.credential}</p>
                      <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--s-muted)]">
                        {e.detail}
                        <span aria-hidden="true"> · </span>
                        <span className="sr-only">, </span>
                        {e.place}
                      </p>
                    </div>
                    <span className="pt-0.5 font-mono text-data text-[var(--s-body)] tabular-nums">{e.year}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
