import { Reveal } from "./Reveal";
import { Scramble } from "./ui/Scramble";

/**
 * Section divider: a decoding title, a hairline running to the edge,
 * and a mono note carrying real data about the section. Deliberately
 * not a tracked uppercase eyebrow — the rule is the cadence instead.
 */
export function SectionHeading({
  title,
  note,
  accent = "var(--color-signal)",
}: {
  title: string;
  note?: string;
  accent?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-5 sm:gap-8">
        <h2 className="text-h2 shrink-0 font-bold text-ink">
          <Scramble text={title} />
        </h2>
        <span
          className="h-px min-w-6 flex-1"
          aria-hidden="true"
          style={{
            background: `linear-gradient(to right, ${accent}, color-mix(in oklab, ${accent} 10%, transparent))`,
          }}
        />
        {note ? <span className="data hidden shrink-0 text-ink-faint sm:block">{note}</span> : null}
      </div>
    </Reveal>
  );
}
