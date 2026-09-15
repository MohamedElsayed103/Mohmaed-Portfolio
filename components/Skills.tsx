import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { TechIcon } from "./TechIcon";
import { concepts, techStack } from "@/data/content";

export function Skills() {
  return (
    <section id="stack" className="border-t border-line-soft py-16 sm:py-24">
      <div className="shell">
        <SectionHeading title="Stack" note="highlighted = core" />

        <Reveal>
          <p className="mt-7 max-w-[58ch] text-lead text-ink-dim">
            What I actually reach for. The highlighted ones are where I am fastest.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
            {techStack.map((t) => (
              <li
                key={t.name}
                className={[
                  "flex items-center gap-3 rounded-card border px-3.5 py-3 transition-colors duration-200",
                  t.core
                    ? "border-line bg-bg-raised text-ink"
                    : "border-line-soft text-ink-mute hover:border-line",
                ].join(" ")}
              >
                <TechIcon
                  name={t.name}
                  size={20}
                  className={t.core ? "shrink-0 text-signal" : "shrink-0 text-ink-faint"}
                />
                <span className={t.core ? "text-[0.9375rem] font-medium" : "text-[0.9375rem]"}>
                  {t.name}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 border-t border-line-soft pt-7">
            <h3 className="data text-ink-faint">Also comfortable with</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {concepts.map((c) => (
                <li
                  key={c}
                  className="rounded-chip border border-line-soft px-2.5 py-1 font-mono text-[0.75rem] text-ink-mute"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
