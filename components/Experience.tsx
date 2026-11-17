import { Machine } from "./experience/Machine";

/** Career drawn as a UML state machine: the diagram stays put while the states it names scroll past. */
export function Experience() {
  return (
    <section id="experience" data-theme="dark" className="py-28 sm:py-40">
      <div className="shell">
        <div className="flex flex-wrap items-baseline justify-between gap-x-12 gap-y-5">
          <h2 className="text-h1 font-extrabold">Experience, as a state machine.</h2>
          <p className="max-w-[44ch] text-lead text-[var(--s-muted)]">
            Each box is a state I was in, each arrow the event that moved me on. Two of them are running right now.
          </p>
        </div>
        <Machine />
      </div>
    </section>
  );
}
