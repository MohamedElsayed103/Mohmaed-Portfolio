import { invoicing, type Domain } from "@/data/content";

/* Geometry for the hero's platform diagram. Two hand-placed layouts share one
   logical graph (`platform` in content.ts): `wide` is a three-column grid with
   the request spine down the middle and the async lane along the bottom;
   `compact` stacks the spine in one column for phones. Coordinates are SVG user
   units, chosen so the diagram never renders below 1:1 where it is used, which
   keeps 12px text at 12px or larger. */

export type NodeId = (typeof invoicing.nodes)[number]["id"];
export type Pt = readonly [number, number];
export type Rect = { x: number; y: number; w: number; h: number };
export type Shape = "actor" | "service" | "store" | "queue";

export type EdgeGeom = {
  key: string;
  from: NodeId;
  to: NodeId;
  label: string;
  async: boolean;
  pts: Pt[];
  /** Label anchor, or null when there is no room for one. */
  labelAt: { x: number; y: number; anchor: "start" | "middle" } | null;
};

export type Layout = {
  key: "wide" | "compact";
  w: number;
  h: number;
  nodes: Record<NodeId, Rect>;
  edges: EdgeGeom[];
  legend: { x: number; y: number; rows: 2 | 4 };
};

export const SHAPE: Record<NodeId, Shape> = {
  client: "actor",
  api: "service",
  auth: "service",
  pint: "service",
  validate: "service",
  postgres: "store",
  tasks: "queue",
  peppol: "service",
  fta: "actor",
};

export const NODES = invoicing.nodes.map((n) => ({
  id: n.id as NodeId,
  label: n.label as string,
  sub: n.sub as string,
  domain: n.domain as Domain | undefined,
}));

export const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<
  NodeId,
  (typeof NODES)[number]
>;

/** Colour a packet takes when it enters this node. Client is neutral ink. */
export function nodeColor(id: NodeId): string {
  const d = NODE_BY_ID[id].domain;
  return d ? `var(--s-${d})` : "var(--s-fg)";
}

export const edgeKey = (from: string, to: string) => `${from}>${to}`;

type Route = Record<string, { pts: Pt[]; labelAt: EdgeGeom["labelAt"] }>;

function build(key: Layout["key"], w: number, h: number, nodes: Record<NodeId, Rect>, routes: Route, legend: Layout["legend"]): Layout {
  const edges = invoicing.edges.map((e) => {
    const k = edgeKey(e.from, e.to);
    const r = routes[k];
    return {
      key: k,
      from: e.from as NodeId,
      to: e.to as NodeId,
      label: e.label as string,
      async: "async" in e && Boolean(e.async),
      pts: r.pts,
      labelAt: r.labelAt,
    };
  });
  return { key, w, h, nodes, edges, legend };
}

/* ── wide: 560 x 410 ─────────────────────────────────────────── */
const NW = 132;
const NH = 50;
const C = [0, 214, 428];
const R = [12, 124, 236, 348];
const wn = (c: number, r: number): Rect => ({ x: C[c], y: R[r], w: NW, h: NH });

export const WIDE = build(
  "wide",
  560,
  410,
  {
    client: wn(0, 0),
    api: wn(1, 0),
    auth: wn(2, 0),
    pint: wn(1, 1),
    validate: wn(1, 2),
    postgres: wn(2, 2),
    tasks: wn(0, 3),
    peppol: wn(1, 3),
    fta: wn(2, 3),
  },
  {
    "client>api": { pts: [[132, 37], [214, 37]], labelAt: { x: 173, y: 29, anchor: "middle" } },
    "api>auth": { pts: [[346, 37], [428, 37]], labelAt: { x: 387, y: 29, anchor: "middle" } },
    "api>pint": { pts: [[280, 62], [280, 124]], labelAt: { x: 290, y: 97, anchor: "start" } },
    "pint>validate": { pts: [[280, 174], [280, 236]], labelAt: { x: 290, y: 209, anchor: "start" } },
    "validate>postgres": { pts: [[346, 261], [428, 261]], labelAt: { x: 387, y: 253, anchor: "middle" } },
    "validate>tasks": { pts: [[214, 261], [66, 261], [66, 348]], labelAt: { x: 140, y: 253, anchor: "middle" } },
    "tasks>peppol": { pts: [[132, 373], [214, 373]], labelAt: { x: 173, y: 365, anchor: "middle" } },
    "peppol>fta": { pts: [[346, 373], [428, 373]], labelAt: { x: 387, y: 365, anchor: "middle" } },
  },
  { x: 0, y: 112, rows: 4 },
);

/* ── compact: 320 x 444 ──────────────────────────────────────── */
const KW = 148;
const KH = 46;
const KC = [0, 172];
const kr = (i: number) => 4 + i * 78;
const kn = (c: number, r: number): Rect => ({ x: KC[c], y: kr(r), w: KW, h: KH });
const SPINE = 74;
const vEdge = (r: number, label: boolean) => ({
  pts: [[SPINE, kr(r) + KH], [SPINE, kr(r + 1)]] as Pt[],
  labelAt: label ? { x: SPINE + 10, y: kr(r) + KH + 20, anchor: "start" as const } : null,
});
const hEdge = (r: number) => ({
  pts: [[KW, kr(r) + KH / 2], [KC[1], kr(r) + KH / 2]] as Pt[],
  labelAt: null,
});

export const COMPACT = build(
  "compact",
  320,
  444,
  {
    client: kn(0, 0),
    api: kn(0, 1),
    auth: kn(1, 1),
    pint: kn(0, 2),
    validate: kn(0, 3),
    postgres: kn(1, 3),
    tasks: kn(0, 4),
    peppol: kn(0, 5),
    fta: kn(1, 5),
  },
  {
    "client>api": vEdge(0, true),
    "api>auth": hEdge(1),
    "api>pint": vEdge(1, true),
    "pint>validate": vEdge(2, true),
    "validate>postgres": hEdge(3),
    "validate>tasks": vEdge(3, true),
    "tasks>peppol": vEdge(4, true),
    "peppol>fta": hEdge(5),
  },
  { x: 172, y: 14, rows: 2 },
);

/* ── polyline helpers ────────────────────────────────────────── */
export function polyLength(pts: readonly Pt[]): number {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
}

/** Point at distance `s` along the polyline (clamped). */
export function pointAt(pts: readonly Pt[], s: number): [number, number] {
  let rest = Math.max(0, s);
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const seg = Math.hypot(bx - ax, by - ay);
    if (rest <= seg || i === pts.length - 1) {
      const t = seg ? Math.min(1, rest / seg) : 0;
      return [ax + (bx - ax) * t, ay + (by - ay) * t];
    }
    rest -= seg;
  }
  return [pts[0][0], pts[0][1]];
}

/** SVG path for the stretch [s0, s1] of the polyline, including any corners inside it. */
export function subPath(pts: readonly Pt[], s0: number, s1: number): string {
  const a = pointAt(pts, s0);
  let d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)}`;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    acc += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (acc > s0 && acc < s1) d += `L${pts[i][0]} ${pts[i][1]}`;
  }
  const b = pointAt(pts, s1);
  return `${d}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
}

export const pathOf = (pts: readonly Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");

export function reversed(pts: readonly Pt[]): Pt[] {
  return [...pts].reverse();
}
