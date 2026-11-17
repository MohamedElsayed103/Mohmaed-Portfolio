"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReduced, whileVisible } from "@/lib/motion";
import {
  COMPACT,
  NODES,
  NODE_BY_ID,
  SHAPE,
  WIDE,
  nodeColor,
  pathOf,
  pointAt,
  subPath,
  type Layout,
  type NodeId,
} from "./layout";
import { Traffic, routeTo, type Result } from "./traffic";
import s from "./hero.module.css";

/* Order the wires draw and the nodes switch on, following the request. */
const EDGE_DELAY: Record<string, number> = {
  "client>api": 520,
  "api>keycloak": 640,
  "api>tenant": 700,
  "tenant>domain": 800,
  "domain>postgres": 900,
  "domain>rabbitmq": 1040,
  "rabbitmq>celery": 1120,
  "celery>minio": 1200,
};
const NODE_DELAY: Record<NodeId, number> = {
  client: 460,
  api: 600,
  keycloak: 760,
  tenant: 830,
  domain: 930,
  postgres: 1030,
  rabbitmq: 1150,
  celery: 1230,
  minio: 1310,
};
const TRAFFIC_AT = 1550;

/* Frozen frame for reduced motion and no-JS: a request entering the domain,
   its query on the way to PostgreSQL, an event between RabbitMQ and Celery,
   and an earlier response heading back to the client. */
const STATIC_PACKETS: { a: NodeId; b: NodeId; t: number; kind: "req" | "evt" }[] = [
  { a: "tenant", b: "domain", t: 0.55, kind: "req" },
  { a: "domain", b: "postgres", t: 0.6, kind: "req" },
  { a: "rabbitmq", b: "celery", t: 0.5, kind: "evt" },
  { a: "api", b: "client", t: 0.45, kind: "req" },
];

const DESC =
  "A request from the client reaches the Django API, which verifies its JWT with Keycloak, resolves the tenant in middleware, and makes a scoped call into the domain modules. They query PostgreSQL, where each tenant has its own schema, and the response returns along the same path. Some requests also publish an event to RabbitMQ; Celery workers consume it and store files in MinIO, and the client gets 202 Accepted straight away. The traffic shown is simulated.";

type Lit = { nodes: Set<NodeId>; edges: Set<string> } | null;

export function PlatformLive() {
  const rootRef = useRef<HTMLElement>(null);
  const svgRefs = useRef<Record<Layout["key"], SVGSVGElement | null>>({ wide: null, compact: null });
  const pktRefs = useRef<Record<Layout["key"], SVGGElement | null>>({ wide: null, compact: null });
  const readout = useRef<HTMLParagraphElement>(null);
  const live = useRef<HTMLParagraphElement>(null);
  const engine = useRef<Traffic | null>(null);
  const [lit, setLit] = useState<Lit>(null);

  const show = useCallback((r: Result, user: boolean) => {
    const el = readout.current;
    if (el) {
      const [t, st, ms] = el.querySelectorAll<HTMLElement>("[data-r]");
      t.textContent = NODE_BY_ID[r.target].label;
      t.style.color = nodeColor(r.target);
      st.textContent = r.status;
      ms.textContent = `${r.ms} ms`;
      if (!prefersReduced()) el.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 320, easing: "ease-out" });
    }
    if (user && live.current) {
      live.current.textContent = `Request to ${NODE_BY_ID[r.target].label}: ${r.status}, ${r.ms} milliseconds, simulated.`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const wideMq = window.matchMedia("(min-width: 640px)");
    const cache = new Map<string, Map<NodeId, { frame: SVGElement; lamp: SVGElement; halo: SVGElement }>>();

    const surface = () => {
      const layout = wideMq.matches ? WIDE : COMPACT;
      const svg = svgRefs.current[layout.key];
      const packets = pktRefs.current[layout.key];
      if (!svg || !packets) return null;
      let nodes = cache.get(layout.key);
      if (!nodes) {
        nodes = new Map();
        svg.querySelectorAll<SVGGElement>("[data-node]").forEach((g) => {
          nodes!.set(g.dataset.node as NodeId, {
            frame: g.querySelector("[data-part=frame]")!,
            lamp: g.querySelector("[data-part=lamp]")!,
            halo: g.querySelector("[data-part=halo]")!,
          });
        });
        cache.set(layout.key, nodes);
      }
      return { layout, packets, nodes };
    };

    if (prefersReduced()) return;

    const t = new Traffic(surface, show);
    engine.current = t;
    let visible = false;
    let started = false;
    const sync = () => t.setRunning(visible && started);
    const stopVis = whileVisible(root, (on) => {
      visible = on;
      sync();
    });
    const startTimer = window.setTimeout(() => {
      started = true;
      sync();
    }, Math.max(0, TRAFFIC_AT - performance.now()));

    // Pointer proximity, mouse only.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const sf = surface();
      const svg = sf && svgRefs.current[sf.layout.key];
      const m = svg?.getScreenCTM();
      if (!svg || !m) return;
      const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      t.pointer = { x: p.x, y: p.y };
    };
    const onLeave = () => (t.pointer = null);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);

    // Scrubbed drift as the hero leaves: the diagram lingers a little.
    const section = root.closest("section");
    const ctx = gsap.context(() => {
      if (!section) return;
      gsap.to(root, {
        yPercent: 9,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);

    return () => {
      window.clearTimeout(startTimer);
      stopVis();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      ctx.revert();
      t.destroy();
      engine.current = null;
      ScrollTrigger.refresh();
    };
  }, [show]);

  const send = (target: NodeId) => {
    const t = engine.current;
    if (t) {
      t.send(target, true);
      return;
    }
    // Reduced motion: answer at once and mark the route instead of animating it.
    const r = routeTo(target, false);
    const path = [...r.request, ...(r.response ?? []), ...(r.event ?? [])];
    const edges = new Set<string>();
    const legs = [r.request, r.response, r.event].filter(Boolean) as NodeId[][];
    for (const leg of legs) for (let i = 1; i < leg.length; i++) edges.add([leg[i - 1], leg[i]].sort().join("|"));
    setLit({ nodes: new Set(path), edges });
    const resultTarget = target === "client" ? "postgres" : target;
    show({ target: resultTarget, status: r.response ? "202 Accepted" : "200 OK", ms: r.response ? 9 : 41 }, true);
  };

  const hover = (id: NodeId | null) => {
    const t = engine.current;
    if (!t) return;
    t.hover = id;
  };

  return (
    <figure
      ref={rootRef}
      role="group"
      aria-labelledby="platform-title"
      aria-describedby="platform-desc"
      className="relative m-0"
    >
      <figcaption id="platform-title" className="sr-only">
        Live diagram: a request through the healthcare platform
      </figcaption>
      <p id="platform-desc" className="sr-only">
        {DESC}
      </p>

      {[WIDE, COMPACT].map((L) => (
        <div
          key={L.key}
          className={
            L.key === "wide" ? "relative hidden sm:block" : "relative mx-auto max-w-[26rem] sm:hidden"
          }
        >
          <Diagram
            layout={L}
            lit={lit}
            svgRef={(el) => {
              svgRefs.current[L.key] = el;
            }}
            pktRef={(el) => {
              pktRefs.current[L.key] = el;
            }}
          />
          {NODES.filter((n) => n.id !== "client").map((n) => {
            const r = L.nodes[n.id];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => send(n.id)}
                onPointerEnter={() => hover(n.id)}
                onPointerLeave={() => hover(null)}
                onFocus={() => hover(n.id)}
                onBlur={() => hover(null)}
                aria-label={`Route a request to ${n.label}`}
                className="absolute cursor-pointer rounded-[3px] bg-transparent"
                style={{
                  left: `${(r.x / L.w) * 100}%`,
                  top: `${(r.y / L.h) * 100}%`,
                  width: `${(r.w / L.w) * 100}%`,
                  height: `${(r.h / L.h) * 100}%`,
                  minHeight: 44,
                }}
              />
            );
          })}
        </div>
      ))}

      <div className={`${s.follow} mt-5 flex flex-wrap items-center gap-x-5 gap-y-3`} style={{ animationDelay: "1300ms" }}>
        <button
          type="button"
          onClick={() => send("client")}
          className="group inline-flex min-h-11 items-center gap-2.5 rounded-md border border-[var(--s-rule)] px-4 text-[0.9375rem] font-medium text-[var(--s-fg)] transition-colors duration-200 hover:border-[color-mix(in_oklab,var(--s-fg)_55%,transparent)]"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="text-[var(--s-muted)] transition-colors group-hover:text-[var(--s-fg)]">
            <circle cx="3" cy="7" r="2.25" fill="currentColor" />
            <path d="M7 7h6M10.5 4.5 13 7l-2.5 2.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Send a request
        </button>
        <p ref={readout} aria-hidden="true" className="m-0 flex items-baseline gap-3 font-mono text-data whitespace-nowrap text-[var(--s-fg)]">
          <span data-r="" style={{ color: nodeColor("postgres") }}>
            PostgreSQL
          </span>
          <span data-r="">200 OK</span>
          <span data-r="" className="text-[var(--s-muted)]">
            41 ms
          </span>
        </p>
      </div>
      <p className={`${s.follow} mt-2 text-[0.8125rem] leading-relaxed text-[var(--s-muted)]`} style={{ animationDelay: "1380ms" }}>
        Simulated traffic, not live metrics. Press any node to route a request to it.
      </p>
      <p ref={live} aria-live="polite" className="sr-only" />
    </figure>
  );
}

function Diagram({
  layout: L,
  lit,
  svgRef,
  pktRef,
}: {
  layout: Layout;
  lit: Lit;
  svgRef: (el: SVGSVGElement | null) => void;
  pktRef: (el: SVGGElement | null) => void;
}) {
  const wire = "color-mix(in oklab, var(--s-fg) 30%, transparent)";
  return (
    <svg ref={svgRef} viewBox={`0 0 ${L.w} ${L.h}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
      {/* wires */}
      {L.edges.map((e) => {
        const on = lit?.edges.has([e.from, e.to].sort().join("|"));
        const delay = { animationDelay: `${EDGE_DELAY[e.key]}ms` };
        return (
          <g key={e.key}>
            <path
              d={pathOf(e.pts)}
              fill="none"
              stroke={on ? nodeColor(e.to) : wire}
              strokeWidth={e.async ? 1.5 : 1}
              strokeDasharray={e.async ? "0.5 5" : undefined}
              strokeLinecap="round"
              pathLength={e.async ? undefined : 100}
              className={e.async ? s.fade : s.draw}
              style={delay}
            />
            {e.labelAt ? (
              <text x={e.labelAt.x} y={e.labelAt.y} textAnchor={e.labelAt.anchor} className={`${s.edgeLabel} ${s.fade}`} style={delay}>
                {e.label}
              </text>
            ) : null}
          </g>
        );
      })}

      {/* legend: line style and colour meaning */}
      <g className={s.fade} style={{ animationDelay: "1250ms" }} transform={`translate(${L.legend.x} ${L.legend.y})`}>
        <path d="M0 0H22" stroke={wire} strokeWidth="1" />
        <text x="30" y="4" className={s.legend}>request, response</text>
        <path d="M0 22H22" stroke={wire} strokeWidth="1.5" strokeDasharray="0.5 5" strokeLinecap="round" />
        <text x="30" y="26" className={s.legend}>async event</text>
        {L.legend.rows === 4 ? (
          <>
            <circle cx="4" cy="48" r="3.25" fill="var(--s-python)" />
            <text x="30" y="52" className={s.legend}>Python</text>
            <circle cx="4" cy="70" r="3.25" fill="var(--s-infra)" />
            <text x="30" y="74" className={s.legend}>infrastructure</text>
          </>
        ) : null}
      </g>

      {/* nodes */}
      {NODES.map((n) => {
        const r = L.nodes[n.id];
        const color = nodeColor(n.id);
        const shape = SHAPE[n.id];
        const compact = L.key === "compact";
        const on = lit?.nodes.has(n.id);
        return (
          <g
            key={n.id}
            data-node={n.id}
            className={`${s.switchOn} ${on ? s.lit : ""}`}
            style={{ animationDelay: `${NODE_DELAY[n.id]}ms` }}
          >
            {shape === "store" ? (
              <path d={`M${r.x + 5} ${r.y + r.h + 4}H${r.x + r.w - 5}`} stroke={color} strokeOpacity="0.4" strokeWidth="1" />
            ) : null}
            <rect
              data-part="frame"
              x={r.x + 0.5}
              y={r.y + 0.5}
              width={r.w - 1}
              height={r.h - 1}
              rx={shape === "actor" ? (r.h - 1) / 2 : 3}
              fill="var(--color-bg)"
              fillOpacity="0.92"
              stroke={color}
              strokeOpacity="0.42"
              className={s.frame}
            />
            {shape === "queue"
              ? [0, 1, 2].map((i) => (
                  <path
                    key={i}
                    d={`M${r.x + r.w - 30 + i * 6} ${r.y + r.h - 15}v7`}
                    stroke={color}
                    strokeOpacity="0.55"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                  />
                ))
              : null}
            <circle data-part="halo" cx={r.x + r.w - 16} cy={r.y + 0.5} r="7" fill={color} opacity="0" />
            <circle data-part="lamp" cx={r.x + r.w - 16} cy={r.y + 0.5} r="2.75" fill={color} opacity="0.32" className={s.lampDot} />
            <text x={r.x + (shape === "actor" ? 18 : 12)} y={r.y + (compact ? 19 : 21)} className={s.nodeLabel}>
              {n.label}
            </text>
            <text x={r.x + (shape === "actor" ? 18 : 12)} y={r.y + (compact ? 36 : 39)} className={s.nodeSub}>
              {n.sub}
            </text>
          </g>
        );
      })}

      {/* frozen packets (reduced motion / no JS) */}
      <g className={s.staticPacket}>
        {STATIC_PACKETS.map((p) => {
          const e = L.edges.find((x) => (x.from === p.a && x.to === p.b) || (x.from === p.b && x.to === p.a))!;
          const pts = e.from === p.a ? e.pts : [...e.pts].reverse();
          const len = pts.reduce((acc, pt, i) => (i ? acc + Math.hypot(pt[0] - pts[i - 1][0], pt[1] - pts[i - 1][1]) : 0), 0);
          const at = len * p.t;
          const [x, y] = pointAt(pts, at);
          const c = nodeColor(p.b);
          return (
            <g key={`${p.a}-${p.b}`} style={{ color: c }}>
              <path d={subPath(pts, Math.max(0, at - 30), at)} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeOpacity={p.kind === "evt" ? 0.55 : 0.8} strokeDasharray={p.kind === "evt" ? "1 4" : undefined} />
              <circle cx={x} cy={y} r="7" fill="currentColor" opacity="0.18" />
              {p.kind === "evt" ? (
                <rect x={x - 3} y={y - 3} width="6" height="6" fill="currentColor" transform={`rotate(45 ${x} ${y})`} />
              ) : (
                <circle cx={x} cy={y} r="3.25" fill="currentColor" />
              )}
            </g>
          );
        })}
      </g>

      {/* live packets: drawn imperatively by the traffic engine */}
      <g ref={pktRef} />
    </svg>
  );
}
