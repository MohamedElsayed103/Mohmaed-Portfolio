import { domainOf, featured } from "@/data/content";
import { ArrowUpRight } from "./icons";
import { Reveal } from "./Reveal";
import { IsolationDemo } from "./healthcare/IsolationDemo";
import { SystemStrip } from "./healthcare/SystemStrip";
import s from "./healthcare/healthcare.module.css";

const project = featured.find((p) => p.slug === "healthcare-saas")!;

/** The white blueprint between dark sections: the isolation guarantee, drawn and pressable. */
export function ProjectHealthcare() {
  const [thesis, ...more] = project.bullets ?? [];

  return (
    <section id="project-healthcare" data-theme="light" className="py-24 sm:py-36" aria-labelledby="healthcare-title">
      <div className="shell">
        <header className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="text-[0.9375rem] text-[var(--s-muted)]">
              {project.kicker}
              <span aria-hidden="true" className="mx-2">
                /
              </span>
              <span className="font-mono text-[0.8125rem]">{project.year}</span>
            </p>
            <h3
              id="healthcare-title"
              className="mt-4 max-w-[14ch] text-h1 font-extrabold text-[var(--s-fg)]"
            >
              {project.name}
            </h3>
            <p className="mt-6 max-w-[48ch] text-lead text-[var(--s-body)]">{project.summary}</p>
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-8 lg:col-span-5 lg:pt-11">
            <ul className="grid gap-4">
              {thesis && (
                <li className="max-w-[30ch] text-h3 font-bold text-[var(--s-fg)]">{thesis}</li>
              )}
              {more.map((b) => (
                <li key={b} className="max-w-[48ch] text-[var(--s-body)]">
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-t border-[var(--s-rule)] pt-5">
              <ul aria-label="Stack" className="flex max-w-[34ch] flex-wrap gap-x-3 gap-y-1 text-[0.9375rem] font-semibold">
                {project.stack.map((t) => {
                  const d = domainOf(t);
                  return (
                    <li key={t} style={{ color: d ? `var(--s-${d})` : "var(--s-fg)" }}>
                      {t}
                    </li>
                  );
                })}
              </ul>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--s-fg)] px-5 font-semibold text-[var(--s-fg)] transition-colors duration-300 hover:bg-[var(--s-fg)] hover:text-[var(--s-bg)] focus-visible:outline-[var(--s-signal)]"
                >
                  Source
                  <ArrowUpRight className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  <span className="sr-only">(GitHub, opens in a new tab)</span>
                </a>
              )}
            </div>
          </Reveal>
        </header>

        <div
          role="group"
          aria-labelledby="iso-title"
          aria-describedby="iso-desc"
          className={`${s.demo} mt-16 sm:mt-24`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2 pt-5">
            <h4 id="iso-title" className="text-[1.0625rem] font-bold text-[var(--s-fg)]">
              Tenant isolation, live
            </h4>
            <p id="iso-desc" className="max-w-[62ch] text-[0.9375rem] text-[var(--s-muted)]">
              Pick a clinic and send a request. The tenant is read from the token, so the query can only land in that
              clinic&apos;s schema.
            </p>
          </div>
          <IsolationDemo />
        </div>

        <div className="mt-20 grid gap-8 sm:mt-28 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-3">
            <h4 className="text-[1.0625rem] font-bold text-[var(--s-fg)]">Off the request path</h4>
            <p className="mt-2 max-w-[40ch] text-[0.9375rem] text-[var(--s-muted)]">
              Domain modules publish events; workers pick them up. Every service runs in Docker.
            </p>
          </div>
          <div className="lg:col-span-9">
            <SystemStrip />
          </div>
        </div>
      </div>
    </section>
  );
}
