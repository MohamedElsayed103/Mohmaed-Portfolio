import { domainOf, featured } from "@/data/content";
import { UseCasePipeline } from "./usecase/UseCasePipeline";

const project = featured[2];

/** Use Case Diagram Generator: a user story goes in, a UML diagram comes out. */
export function ProjectUseCase() {
  return (
    <section
      id="project-usecase"
      data-theme="sunken"
      aria-labelledby="usecase-title"
      className="py-24 sm:py-40"
    >
      <div className="shell">
        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
          <div>
            <h3 id="usecase-title" className="max-w-[14ch] text-h1 font-black text-[var(--s-fg)]">
              {project.name}
            </h3>
            <p className="mt-4 text-[var(--s-muted)]">
              {project.kicker}
              <span className="data ml-3 !text-[var(--s-muted)]">{project.year}</span>
            </p>
          </div>
          <div>
            <p className="text-h3 font-bold text-[var(--s-fg)]">{project.summary}</p>
            <ul className="mt-5 space-y-2 text-[var(--s-body)]">
              {project.bullets?.map((b) => (
                <li key={b} className="max-w-[60ch]">
                  {b}
                </li>
              ))}
            </ul>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Stack">
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
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <UseCasePipeline />
        </div>
      </div>
    </section>
  );
}
