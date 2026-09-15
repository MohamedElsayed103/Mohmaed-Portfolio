import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WorkIndex } from "./WorkIndex";
import { SystemTrace } from "./SystemTrace";
import { StackRow } from "./StackRow";
import { featured, projects } from "@/data/content";
import { ArrowUpRight, GitHub } from "./icons";

export function Work() {
  return (
    <section id="work" className="py-16 sm:py-24">
      <div className="shell">
        <SectionHeading title="Selected work" note={`${projects.length + featured.length} projects`} />

        <div className="mt-10 sm:mt-14">
          {featured.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={i * 60}
              as="article"
              className="group border-t border-line-soft py-9 first:border-t-0 first:pt-0 sm:py-12"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-mono text-data text-signal">{p.year}</span>
                {p.kicker ? <span className="text-[0.9375rem] text-ink-mute">{p.kicker}</span> : null}
              </div>

              <h3 className="mt-2.5 text-h3 font-bold text-ink transition-colors duration-300 group-hover:text-signal">
                {p.name}
              </h3>

              <div
                className={
                  p.schematic
                    ? "mt-4 grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:gap-12"
                    : "mt-4"
                }
              >
                <div>
                  <p className="max-w-[64ch] text-lead text-ink-dim">{p.summary}</p>

                  {p.bullets ? (
                    <ul className="mt-5 space-y-2.5">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-[0.9375rem] text-ink-mute">
                          <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                          <span className="max-w-[68ch]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <StackRow items={p.stack} className="mt-6" />

                  {p.repo || p.live ? (
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {p.repo ? (
                        <a
                          href={p.repo}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-dim transition-colors duration-200 hover:text-signal"
                        >
                          <GitHub />
                          Source
                          <ArrowUpRight />
                        </a>
                      ) : null}
                      {p.live ? (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-signal transition-colors duration-200 hover:text-signal-hot"
                        >
                          Live demo
                          <ArrowUpRight />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>

                {p.schematic ? <SystemTrace className="md:justify-self-end" /> : null}
              </div>
            </Reveal>
          ))}
        </div>

        <WorkIndex />
      </div>
    </section>
  );
}
