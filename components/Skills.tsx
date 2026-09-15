import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { skills } from "@/data/content";

export function Skills() {
  const coreCount = skills.reduce((n, g) => n + g.items.filter((i) => i.core).length, 0);

  return (
    <section id="stack" className="border-t border-line-soft py-20 sm:py-28">
      <div className="shell">
        <SectionHeading title="Stack" note={`${coreCount} marked core`} />

        <p className="mt-8 max-w-[62ch] text-lead text-ink-dim">
          Ordered by what I actually reach for, not by what looks good in a list. The marked ones
          are where I am fastest and most sure of myself.
        </p>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, i) => (
            <Reveal key={group.title} delay={i * 50}>
              <div className="border-t border-line pt-5">
                <h3 className="font-semibold text-ink">{group.title}</h3>
                <p className="data mt-1 text-ink-faint">{group.note}</p>

                <ul className="mt-5 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={[
                          "h-1.5 w-1.5 shrink-0 rounded-full",
                          item.core ? "bg-signal" : "bg-line-strong",
                        ].join(" ")}
                      />
                      <span
                        className={
                          item.core
                            ? "text-[0.9375rem] font-medium text-ink"
                            : "text-[0.9375rem] text-ink-mute"
                        }
                      >
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
