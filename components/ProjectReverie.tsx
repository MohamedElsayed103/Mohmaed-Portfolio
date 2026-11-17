import { domainOf, featured } from "@/data/content";
import { ArrowUpRight, GitHub } from "./icons";
import { RoutingDemo } from "./reverie/RoutingDemo";

const project = featured[1];

/** Reverie: one catch-all route, couples as rows. The demo routes a request the way production does. */
export function ProjectReverie() {
  return (
    <section
      id="project-reverie"
      data-theme="raised"
      aria-labelledby="reverie-title"
      className="py-24 sm:py-36"
    >
      <div className="shell grid gap-x-16 gap-y-14 xl:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] xl:items-start">
        <div className="xl:sticky xl:top-28">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 id="reverie-title" className="text-h1 font-black text-[var(--s-fg)]">
              {project.name}
            </h3>
            <p className="text-[var(--s-muted)]">
              {project.kicker}
              <span className="data ml-3 !text-[var(--s-muted)]">{project.year}</span>
            </p>
          </div>

          <p className="mt-7 max-w-[22ch] text-h2 font-extrabold text-[var(--s-fg)]">
            {project.summary}
          </p>

          <ul className="mt-9 max-w-[52ch] border-t border-[var(--s-rule)]">
            {project.bullets?.map((b) => (
              <li key={b} className="border-b border-[var(--s-rule)] py-4 text-[var(--s-body)]">
                {b}
              </li>
            ))}
          </ul>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2" aria-label="Stack">
            {project.stack.map((s) => {
              const d = domainOf(s);
              return (
                <li key={s} className="data flex items-center gap-2 !text-[var(--s-body)]">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full"
                    style={{ background: d ? `var(--s-${d})` : "var(--s-muted)" }}
                  />
                  {s}
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {project.live ? (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 items-center gap-2.5 rounded-[0.5rem] bg-[var(--s-signal)] px-5 font-semibold text-[var(--s-on-signal)] transition-[filter] duration-300 hover:brightness-110"
              >
                Open the live site
                <ArrowUpRight
                  size={14}
                  className="transition-transform duration-300 ease-[var(--ease-expo)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
                <span className="sr-only">({project.liveLabel}, opens in a new tab)</span>
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2.5 rounded-[0.5rem] border border-[var(--s-rule)] px-5 font-semibold text-[var(--s-fg)] transition-colors duration-300 hover:border-[var(--s-muted)]"
              >
                <GitHub size={15} />
                Source
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : null}
          </div>
        </div>

        <RoutingDemo host={project.liveLabel ?? ""} />
      </div>
    </section>
  );
}
