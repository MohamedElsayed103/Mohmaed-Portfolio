type Node = {
  x: number;
  y: number;
  label: string;
  sub: string;
  accent?: boolean;
};

const W = 116;
const H = 48;

const NODES: Node[] = [
  { x: 16, y: 34, label: "CLIENT", sub: "browser" },
  { x: 222, y: 34, label: "API", sub: "JWT · RBAC", accent: true },
  { x: 16, y: 130, label: "KEYCLOAK", sub: "identity" },
  { x: 222, y: 130, label: "DOMAIN", sub: "bounded ctx", accent: true },
  { x: 428, y: 130, label: "POSTGRES", sub: "18 schemas" },
  { x: 222, y: 226, label: "RABBITMQ", sub: "event bus" },
  { x: 428, y: 226, label: "CELERY", sub: "workers" },
  { x: 428, y: 322, label: "MINIO", sub: "objects" },
];

type Edge = { d: string; dur: number; delay: number; label?: string; lx?: number; ly?: number };

/* Orthogonal connectors. pathLength="100" normalises every path so one
   dash geometry drives all of them regardless of real length. */
const EDGES: Edge[] = [
  { d: "M132 58 H222", dur: 2.4, delay: 0, label: "request", lx: 177, ly: 50 },
  { d: "M132 154 H196 V70 H222", dur: 3.1, delay: 1.1, label: "verify", lx: 164, ly: 146 },
  { d: "M280 82 V130", dur: 2.2, delay: 0.5, label: "tenant ctx", lx: 290, ly: 110 },
  { d: "M338 154 H428", dur: 2.6, delay: 0.9, label: "scoped query", lx: 383, ly: 146 },
  { d: "M280 178 V226", dur: 2.8, delay: 1.5, label: "domain event", lx: 290, ly: 206 },
  { d: "M338 250 H428", dur: 2.3, delay: 2.0, label: "consume", lx: 383, ly: 242 },
  { d: "M486 274 V322", dur: 2.5, delay: 2.4, label: "store", lx: 496, ly: 302 },
];

export function SystemTrace({ className }: { className?: string }) {
  return (
    <figure className={className}>
      {/* The schematic has a legibility floor — below it the mono labels
          stop being readable, so it scrolls rather than shrinks. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <svg
        viewBox="0 0 560 400"
        role="img"
        aria-label="Architecture schematic: a client request passes through an API layer that verifies identity against Keycloak, into a tenant-scoped domain layer, which reads Postgres and emits domain events onto RabbitMQ for Celery workers that write to MinIO object storage."
        className="h-auto w-full min-w-[30rem] overflow-visible"
      >
        <defs>
          <marker
            id="trace-arrow"
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 1 L7 4 L0 7 z" fill="var(--color-line-strong)" />
          </marker>
        </defs>

        <g aria-hidden="true">
          {/* Base connectors */}
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

          {/* Travelling signal pulses */}
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
              style={{
                animationDuration: `${e.dur}s`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}

          {/* Edge labels */}
          {EDGES.map((e, i) =>
            e.label ? (
              <text
                key={`label-${i}`}
                x={e.lx}
                y={e.ly}
                textAnchor={e.d.startsWith("M280") || e.d.startsWith("M486") ? "start" : "middle"}
                className="trace-edge-label"
              >
                {e.label}
              </text>
            ) : null,
          )}

          {/* Nodes */}
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
                <rect
                  x={n.x}
                  y={n.y}
                  width={W}
                  height={H}
                  rx="5"
                  fill="var(--color-signal)"
                  opacity="0.06"
                />
              ) : null}
              <text x={n.x + 12} y={n.y + 21} className="trace-node-label">
                {n.label}
              </text>
              <text x={n.x + 12} y={n.y + 35} className="trace-node-sub">
                {n.sub}
              </text>
            </g>
          ))}
        </g>
      </svg>
      </div>

      <figcaption className="data mt-5 text-ink-faint">
        <span className="text-ink-mute">fig.</span> request path through the multi-tenant platform
      </figcaption>
    </figure>
  );
}
