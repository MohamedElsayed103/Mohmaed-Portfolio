/**
 * Fixed spectrum backdrop: four soft pools of the palette drifting
 * behind the page. Decorative only — sits below all content, ignores
 * pointer events, and is removed entirely under reduced motion.
 */
const POOLS = [
  { color: "var(--color-vermilion)", top: "-12%", left: "-10%", size: "46vmax", dur: "34s", delay: "0s" },
  { color: "var(--color-violet)", top: "10%", left: "64%", size: "40vmax", dur: "41s", delay: "-8s" },
  { color: "var(--color-cyan)", top: "64%", left: "-8%", size: "38vmax", dur: "37s", delay: "-16s" },
  { color: "var(--color-amber)", top: "84%", left: "70%", size: "34vmax", dur: "45s", delay: "-24s" },
];

export function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      {POOLS.map((p, i) => (
        <span
          key={i}
          style={{
            background: p.color,
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
