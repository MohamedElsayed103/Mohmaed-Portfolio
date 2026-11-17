import { useCaseDemo } from "@/data/content";

/**
 * UML use case diagram, drawn from useCaseDemo. Two layouts share one vocabulary:
 * wide (actors either side of the boundary) and tall (actors above and below it),
 * so labels never render below 12px. Every stroke has pathLength=1 so it can be drawn in.
 */

type Pt = { x: number; y: number };
type Layout = {
  w: number;
  h: number;
  boundary: { x: number; y: number; w: number; h: number };
  actors: Pt[]; // top-centre of each figure, in useCaseDemo.actors order
  useCases: Pt[]; // ellipse centres, in useCaseDemo.useCases order
  rx: number;
  ry: number;
};

const WIDE: Layout = {
  w: 640,
  h: 400,
  boundary: { x: 168, y: 24, w: 304, h: 352 },
  actors: [
    { x: 76, y: 84 },
    { x: 564, y: 224 },
  ],
  useCases: [
    { x: 320, y: 130 },
    { x: 320, y: 270 },
  ],
  rx: 112,
  ry: 36,
};

const TALL: Layout = {
  w: 320,
  h: 540,
  boundary: { x: 14, y: 168, w: 292, h: 200 },
  actors: [
    { x: 58, y: 14 },
    { x: 262, y: 394 },
  ],
  useCases: [
    { x: 160, y: 228 },
    { x: 160, y: 314 },
  ],
  rx: 116,
  ry: 30,
};

const FIG_H = 100; // head to feet
const TXT = { fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 600 } as const;
const MONO = { fontFamily: "var(--font-mono)", fontSize: 14 } as const;
const LABEL_GAP = 24;

function Actor({ x, y, label }: Pt & { label: string }) {
  const s = { stroke: "var(--s-python)", strokeWidth: 2, strokeLinecap: "round" as const, fill: "none" };
  return (
    <g data-actor>
      <circle data-draw pathLength={1} cx={x} cy={y + 13} r={13} {...s} />
      <line data-draw pathLength={1} x1={x} y1={y + 26} x2={x} y2={y + 66} {...s} />
      <line data-draw pathLength={1} x1={x - 24} y1={y + 40} x2={x + 24} y2={y + 40} {...s} />
      <line data-draw pathLength={1} x1={x} y1={y + 66} x2={x - 19} y2={y + FIG_H} {...s} />
      <line data-draw pathLength={1} x1={x} y1={y + 66} x2={x + 19} y2={y + FIG_H} {...s} />
      <text data-label x={x} y={y + FIG_H + LABEL_GAP} textAnchor="middle" style={TXT} fill="var(--s-fg)">
        {label}
      </text>
    </g>
  );
}

/** Point on the ellipse edge facing `p`. */
function edge(c: Pt, rx: number, ry: number, p: Pt): Pt {
  const a = Math.atan2((p.y - c.y) / ry, (p.x - c.x) / rx);
  // Rounded: server and browser Math differ in the last digit, which would break hydration.
  return { x: Math.round(c.x + rx * Math.cos(a)), y: Math.round(c.y + ry * Math.sin(a)) };
}

function Diagram({ L, className }: { L: Layout; className: string }) {
  const { actors, useCases, relations } = useCaseDemo;
  const tall = L === TALL;
  const label =
    "UML use case diagram, example output. " +
    relations.map((r) => `Actor ${r.actor} is associated with use case ${r.useCase}.`).join(" ");

  return (
    <svg viewBox={`0 0 ${L.w} ${L.h}`} role="img" aria-label={label} className={className}>
      <rect
        data-boundary
        pathLength={1}
        x={L.boundary.x}
        y={L.boundary.y}
        width={L.boundary.w}
        height={L.boundary.h}
        rx={6}
        fill="none"
        stroke="var(--s-muted)"
        strokeWidth={1.25}
      />
      <text data-label x={L.boundary.x + 14} y={L.boundary.y + 24} style={MONO} fill="var(--s-muted)">
        system
      </text>

      {relations.map((r) => {
        const ai = actors.indexOf(r.actor as (typeof actors)[number]);
        const ui = useCases.indexOf(r.useCase as (typeof useCases)[number]);
        if (ai < 0 || ui < 0) return null;
        const a = L.actors[ai];
        const c = L.useCases[ui];
        // Leave from the figure's shoulder on the side facing the use case.
        const from: Pt = tall
          ? { x: a.x + (c.x > a.x ? 26 : -26), y: a.y + (c.y > a.y ? 52 : 52) }
          : { x: a.x + (c.x > a.x ? 30 : -30), y: a.y + 46 };
        const to = edge(c, L.rx, L.ry, from);
        return (
          <line
            key={`${r.actor}-${r.useCase}`}
            data-assoc
            pathLength={1}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="var(--s-fg)"
            strokeOpacity={0.75}
            strokeWidth={1.5}
          />
        );
      })}

      {useCases.map((u, i) => {
        const c = L.useCases[i];
        return (
          <g key={u}>
            <ellipse
              data-draw
              data-ellipse
              pathLength={1}
              cx={c.x}
              cy={c.y}
              rx={L.rx}
              ry={L.ry}
              fill="color-mix(in oklab, var(--s-fg) 5%, transparent)"
              stroke="var(--s-fg)"
              strokeWidth={1.75}
            />
            <text data-label x={c.x} y={c.y + 5.5} textAnchor="middle" style={TXT} fill="var(--s-fg)">
              {u}
            </text>
          </g>
        );
      })}

      {actors.map((a, i) => (
        <Actor key={a} {...L.actors[i]} label={a} />
      ))}
    </svg>
  );
}

export function UmlDiagram() {
  return (
    <>
      <Diagram L={WIDE} className="hidden h-auto w-full sm:block" />
      <Diagram L={TALL} className="mx-auto block h-auto w-full max-w-[22rem] sm:hidden" />
    </>
  );
}
