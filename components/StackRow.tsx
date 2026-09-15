import { TechIcon } from "./TechIcon";
import { techIcons } from "@/data/techIcons";
import { accentOf } from "@/data/content";

/**
 * Technology list as accent-tinted chips. Each chip takes the colour of
 * its domain, so a glance at a project tells you whether it is a JVM
 * piece, a Python piece or infrastructure. Unmapped names stay neutral.
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
      {items.map((name) => {
        const accent = accentOf(name);
        return (
          <li
            key={name}
            style={accent ? ({ ["--accent" as string]: accent }) : undefined}
            className={[
              "inline-flex items-center rounded-chip border transition-colors duration-300",
              accent ? "accent-chip" : "border-line-soft bg-bg-raised text-ink-mute",
              sm ? "gap-1.5 px-2 py-1" : "gap-2 px-2.5 py-1.5",
            ].join(" ")}
          >
            {techIcons[name] ? <TechIcon name={name} size={sm ? 12 : 14} className="shrink-0" /> : null}
            <span className={sm ? "font-mono text-[0.6875rem]" : "font-mono text-[0.75rem]"}>{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
