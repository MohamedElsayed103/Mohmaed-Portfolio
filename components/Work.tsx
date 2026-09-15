import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { WorkIndex } from "./WorkIndex";
import { featured, projects } from "@/data/content";
import { ArrowUpRight, GitHub } from "./icons";

export function Work() {
  return (
    <section id="work" className="py-20 sm:py-28">
      <div className="shell">
        <SectionHeading
          title="Selected work"
          note={`${featured.length} in depth · ${projects.length} more below`}
        />

        <div className="mt-14">
          {featured.map((p, i) => (
            <Reveal
              key={p.slug}
              delay={i * 60}
              as="article"
              className="group border-t border-line-soft py-10 first:border-t-0 first:pt-0 sm:py-14"
            >
              <div className="grid gap-6 md:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] md:gap-10 lg:gap-16">
                {/* Meta rail */}
                <div className="flex flex-row flex-wrap items-baseline gap-x-4 gap-y-2 md:flex-col md:items-start md:gap-3">
                  <span className="font-mono text-data text-signal">{p.year}</span>
                  {p.kicker ? (
                    <span className="text-[0.9375rem] text-ink-mute">{p.kicker}</span>
                  ) : null}
                  <ul className="flex flex-wrap gap-1.5 md:mt-2">
                    {p.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-chip border border-line-soft px-2 py-0.5 font-mono text-[0.6875rem] text-ink-faint"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Body */}
                <div>
                  <h3 className="text-h3 font-bold text-ink transition-colors duration-300 group-hover:text-signal">
                    {p.name}
                  </h3>
                  <p className="mt-3 max-w-[68ch] text-lead text-ink-dim">{p.summary}</p>

                  {p.bullets ? (
                    <ul className="mt-6 space-y-3">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-3.5 text-[0.9375rem] text-ink-mute">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal"
                          />
                          <span className="max-w-[72ch]">{b}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <ul className="mt-7 flex flex-wrap gap-x-4 gap-y-2">
                    {p.stack.map((s) => (
                      <li key={s} className="font-mono text-data text-ink-faint">
                        {s}
                      </li>
                    ))}
                  </ul>

                  {p.repo || p.live ? (
                    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
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
                          Live
                          <span className="font-mono text-data text-ink-faint">{p.liveLabel}</span>
                          <ArrowUpRight />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <WorkIndex />
      </div>
    </section>
  );
}
