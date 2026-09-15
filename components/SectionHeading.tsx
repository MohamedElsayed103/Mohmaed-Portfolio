import { Reveal } from "./Reveal";

/**
 * Section divider: title, a hairline that runs to the edge, and a
 * mono note carrying real data about the section. Deliberately not a
 * tracked uppercase eyebrow — the rule is the cadence instead.
 */
export function SectionHeading({
  title,
  note,
  id,
}: {
  title: string;
  note?: string;
  id?: string;
}) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-5 sm:gap-8">
        <h2 id={id} className="text-h2 shrink-0 font-bold text-ink">
          {title}
        </h2>
        <span className="h-px min-w-6 flex-1 bg-line-soft" aria-hidden="true" />
        {note ? (
          <span className="data hidden shrink-0 text-ink-faint sm:block">{note}</span>
        ) : null}
      </div>
    </Reveal>
  );
}
