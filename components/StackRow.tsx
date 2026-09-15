import { TechIcon } from "./TechIcon";
import { techIcons } from "@/data/techIcons";

/**
 * A technology list rendered as logo + label chips. Names without a
 * brand mark still render, just as a label — no empty icon slot.
 */
export function StackRow({
  items,
  className,
  size = "md",
}: {
  items: readonly string[];
  className?: string;
  size?: "sm" | "md";
}) {
  const sm = size === "sm";

  return (
    <ul className={["flex flex-wrap items-center", sm ? "gap-1.5" : "gap-2", className].filter(Boolean).join(" ")}>
      {items.map((name) => (
        <li
          key={name}
          className={[
            "inline-flex items-center rounded-chip border border-line-soft bg-bg-raised text-ink-mute",
            sm ? "gap-1.5 px-2 py-1" : "gap-2 px-2.5 py-1.5",
          ].join(" ")}
        >
          {techIcons[name] ? (
            <TechIcon name={name} size={sm ? 12 : 14} className="shrink-0 text-ink-dim" />
          ) : null}
          <span className={sm ? "font-mono text-[0.6875rem]" : "font-mono text-[0.75rem]"}>{name}</span>
        </li>
      ))}
    </ul>
  );
}
