type Node = { x: number; y: number; label: string; sub: string; accent?: boolean };
type Edge = { d: string; dur: number; delay: number; label: string; lx: number; ly: number; anchor: "start" | "middle" };

const W = 118;
const H = 44;

/* Two narrow columns instead of three wide ones: the whole schematic
   fits a phone without sliding, and still reads at 384px on desktop. */
const NODES: Node[] = [
  { x: 8, y: 8, label: "CLIENT", sub: "browser" },
  { x: 8, y: 92, label: "API", sub: "JWT · RBAC", accent: true },
  { x: 196, y: 92, label: "KEYCLOAK", sub: "identity" },
  { x: 8, y: 176, label: "DOMAIN", sub: "bounded ctx", accent: true },
  { x: 196, y: 176, label: "POSTGRES", sub: "18 schemas" },
  { x: 8, y: 260, label: "RABBITMQ", sub: "event bus" },
  { x: 8, y: 344, label: "CELERY", sub: "workers" },
  { x: 196, y: 344, label: "MINIO", sub: "objects" },
];

/* pathLength="100" normalises every path, so one dash geometry drives
   all of them regardless of real length. */
const EDGES: Edge[] = [
  { d: "M67 52 V92", dur: 2.4, delay: 0, label: "request", lx: 75, ly: 76, anchor: "start" },
  { d: "M126 114 H196", dur: 3.1, delay: 1.1, label: "verify", lx: 161, ly: 106, anchor: "middle" },
  { d: "M67 136 V176", dur: 2.2, delay: 0.5, label: "tenant ctx", lx: 75, ly: 160, anchor: "start" },
  { d: "M126 198 H196", dur: 2.6, delay: 0.9, label: "query", lx: 161, ly: 190, anchor: "middle" },
  { d: "M67 220 V260", dur: 2.8, delay: 1.5, label: "event", lx: 75, ly: 244, anchor: "start" },
  { d: "M67 304 V344", dur: 2.3, delay: 2.0, label: "consume", lx: 75, ly: 328, anchor: "start" },
  { d: "M126 366 H196", dur: 2.5, delay: 2.4, label: "store", lx: 161, ly: 358, anchor: "middle" },
];

export function SystemTrace({ className }: { className?: string }) {
  return (
    <figure className={className}>
      <svg
        viewBox="0 0 330 398"
        role="img"
        aria-label="Architecture schematic: a client request reaches an API layer that verifies identity against Keycloak, passes into a tenant-scoped domain layer which queries Postgres, and emits events onto RabbitMQ for Celery workers that write to MinIO object storage."
        className="h-auto w-full max-w-[24rem]"
      >
        <defs>
          <marker
            id="trace-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M0 1 L7 4 L0 7 z" fill="var(--color-line-strong)" />
          </marker>
        </defs>

        <g aria-hidden="true">
          {EDGES.map((e, i) => (
            <path
              key={`base-${i}`}
              d={e.d}
              fill="none"
              stroke="var(--color-line)"
              strokeWidth="1"
              markerEnd="url(#trace-arrow)"
            />
          ))}

          {EDGES.map((e, i) => (
            <path
              key={`pulse-${i}`}
              d={e.d}
              pathLength={100}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth="1.75"
              strokeLinecap="round"
              className="trace-pulse"
              style={{ animationDuration: `${e.dur}s`, animationDelay: `${e.delay}s` }}
            />
          ))}

          {EDGES.map((e, i) => (
            <text key={`label-${i}`} x={e.lx} y={e.ly} textAnchor={e.anchor} className="trace-edge-label">
              {e.label}
            </text>
          ))}

          {NODES.map((n) => (
            <g key={n.label}>
              <rect
                x={n.x}
                y={n.y}
                width={W}
                height={H}
                rx="5"
                fill="var(--color-bg-raised)"
                stroke={n.accent ? "var(--color-signal)" : "var(--color-line)"}
                strokeWidth="1"
              />
              {n.accent ? (
                <rect x={n.x} y={n.y} width={W} height={H} rx="5" fill="var(--color-signal)" opacity="0.06" />
              ) : null}
              <text x={n.x + 11} y={n.y + 19} className="trace-node-label">
                {n.label}
              </text>
              <text x={n.x + 11} y={n.y + 33} className="trace-node-sub">
                {n.sub}
              </text>
            </g>
          ))}
        </g>
      </svg>

      <figcaption className="data mt-4 max-w-[24rem] text-ink-faint">
        <span className="text-ink-mute">fig.</span> request path through the platform
      </figcaption>
    </figure>
  );
}
