import { ProjectSanade } from "./ProjectSanade";
import { ProjectGrc } from "./ProjectGrc";
import { ProjectReverie } from "./ProjectReverie";
import { ProjectUseCase } from "./ProjectUseCase";
import { WorkIndex } from "./WorkIndex";

/** Four featured systems, each drawn the way it runs, then the full repository index. */
export function Work() {
  return (
    <div id="work">
      <section data-theme="dark" className="pt-28 pb-14 sm:pt-36 sm:pb-20">
        <div className="shell flex flex-wrap items-baseline justify-between gap-x-12 gap-y-4">
          <h2 className="text-h1">Selected work</h2>
          <p className="max-w-[44ch] text-lead text-[var(--s-muted)]">
            Four systems, each drawn the way it runs. Press things; they respond.
          </p>
        </div>
      </section>
      <ProjectSanade />
      <ProjectGrc />
      <ProjectReverie />
      <ProjectUseCase />
      <WorkIndex />
    </div>
  );
}
