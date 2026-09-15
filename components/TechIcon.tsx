import type { CSSProperties } from "react";
import { techIcons } from "@/data/techIcons";

/**
 * Brand mark for a technology, rendered in the current text colour.
 * Returns null when there is no logo for that name, so callers can fall
 * back to a plain label rather than showing a broken glyph.
 */
export function TechIcon({
  name,
  size = 16,
  className,
  style,
}: {
  name: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const path = techIcons[name];
  if (!path) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={style}
    >
      <path d={path} />
    </svg>
  );
}

export function hasTechIcon(name: string) {
  return Boolean(techIcons[name]);
}
