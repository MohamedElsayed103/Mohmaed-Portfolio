import {
  NODE_BY_ID,
  edgeKey,
  nodeColor,
  pointAt,
  polyLength,
  reversed,
  subPath,
  type Layout,
  type NodeId,
  type Pt,
} from "./layout";

/* Simulated traffic for the hero diagram. Packets are logical (a node path plus
   progress on the current hop), so the same request can be drawn on either
   layout and survives a resize across the breakpoint mid-flight. Every number
   here is made up for the demo; nothing is a measurement. */

export type Result = { target: NodeId; status: "200 OK" | "202 Accepted"; ms: number };

export const ASYNC_TARGETS: NodeId[] = ["tasks", "peppol", "fta"];
const AUTH: NodeId[] = ["client", "api", "auth", "api"];
const SYNC_TO: Partial<Record<NodeId, NodeId[]>> = {
  api: [],
  auth: [],
  pint: ["pint"],
  validate: ["pint", "validate"],
  postgres: ["pint", "validate", "postgres", "validate"],
};
const BACK: Record<string, NodeId[]> = {
  api: ["client"],
  pint: ["api", "client"],
  validate: ["pint", "api", "client"],
};

/** Time a request spends inside each node, in ms (before jitter). */
const DWELL: Record<NodeId, number> = {
  client: 0,
  api: 70,
  auth: 150,
  pint: 60,
  validate: 120,
  postgres: 240,
  tasks: 90,
  peppol: 300,
  fta: 130,
};

const jitter = (v: number, amt = 0.4) => v * (1 - amt + Math.random() * amt * 2);
const ease = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

/** Route a request takes to `target`. Used for the static (reduced motion) answer too. */
export function routeTo(target: NodeId, asyncEvent: boolean) {
  if (ASYNC_TARGETS.includes(target) || asyncEvent) {
    const lane: NodeId[] = ["tasks", "peppol", "fta"];
    const stop = ASYNC_TARGETS.includes(target) ? lane.indexOf(target) + 1 : 3;
    return {
      request: [...AUTH, "pint", "validate"] as NodeId[],
      response: ["validate", "pint", "api", "client"] as NodeId[],
      event: ["validate", ...lane.slice(0, stop)] as NodeId[],
    };
  }
  const t = target === "client" ? "postgres" : target;
  const fwd = [...AUTH, ...(SYNC_TO[t] ?? [])];
  const end = fwd[fwd.length - 1];
  return { request: [...fwd, ...(BACK[end] ?? BACK.domain)] as NodeId[], response: null, event: null };
}

/** Plausible simulated latency from the time the path spends in nodes. */
function latency(path: NodeId[], dwells: number[]): number {
  const work = dwells.reduce((a, b) => a + b, 0);
  return Math.max(3, Math.round(work / 20 + path.length * 0.4));
}

type Packet = {
  path: NodeId[];
  hop: number;
  t: number;
  dur: number;
  dwell: number;
  dwells: number[];
  kind: "req" | "evt";
  speed: number;
  el: SVGGElement | null;
  elLayout: string | null;
  parts?: { tail: SVGPathElement; head: SVGGElement };
  onDone?: (p: Packet) => void;
};

type NodeEls = { frame: SVGElement; lamp: SVGElement; halo: SVGElement };
type Surface = { layout: Layout; packets: SVGGElement; nodes: Map<NodeId, NodeEls> };

const SVGNS = "http://www.w3.org/2000/svg";

export class Traffic {
  private packets: Packet[] = [];
  private hit = new Map<NodeId, number>();
  private last = new Map<string, number>();
  private raf = 0;
  private prev = 0;
  private nextAuto = 0;
  private running = false;
  private hopCache = new Map<string, { pts: Pt[]; len: number }>();
  pointer: { x: number; y: number } | null = null;
  hover: NodeId | null = null;

  constructor(
    private surface: () => Surface | null,
    private onResult: (r: Result, user: boolean) => void,
  ) {}

  setRunning(on: boolean) {
    if (on === this.running) return;
    this.running = on;
    if (on) {
      this.prev = performance.now();
      if (!this.nextAuto) this.nextAuto = this.prev + 250;
      this.raf = requestAnimationFrame(this.frame);
    } else {
      cancelAnimationFrame(this.raf);
    }
  }

  destroy() {
    this.setRunning(false);
    for (const p of this.packets) p.el?.remove();
    this.packets = [];
  }

  /** Send a request to `target`; the client node means "the usual full request". */
  send(target: NodeId, user: boolean) {
    if (this.packets.length > 9) return;
    const asyncEvent = !user && target === "client" && Math.random() < 0.3;
    const r = routeTo(target, asyncEvent);
    const resultTarget: NodeId = target === "client" ? (r.event ? r.event[r.event.length - 1] : "postgres") : target;

    if (!r.response) {
      this.spawn(r.request, "req", (p) =>
        this.onResult({ target: resultTarget, status: "200 OK", ms: latency(p.path, p.dwells) }, user),
      );
      return;
    }
    // Async: the request reaches the domain, which publishes and answers 202 at once.
    this.spawn(r.request, "req", (p) => {
      this.spawn(r.event!, "evt");
      this.spawn(r.response!, "req", (q) =>
        this.onResult(
          { target: resultTarget, status: "202 Accepted", ms: latency(p.path, [...p.dwells, ...q.dwells]) },
          user,
        ),
      );
    });
  }

  private spawn(path: NodeId[], kind: Packet["kind"], onDone?: (p: Packet) => void) {
    const p: Packet = {
      path,
      hop: 0,
      t: 0,
      dur: 0,
      dwell: 0,
      dwells: [],
      kind,
      speed: jitter(kind === "evt" ? 150 : 210, 0.15),
      el: null,
      elLayout: null,
      onDone,
    };
    this.startHop(p);
    this.packets.push(p);
    if (path[0] === "client") this.hit.set("client", performance.now());
  }

  private geom(layout: Layout, a: NodeId, b: NodeId) {
    const k = `${layout.key}:${a}>${b}`;
    let g = this.hopCache.get(k);
    if (!g) {
      const fwd = layout.edges.find((e) => e.key === edgeKey(a, b));
      const back = fwd ? null : layout.edges.find((e) => e.key === edgeKey(b, a));
      const pts = fwd ? fwd.pts : reversed(back!.pts);
      g = { pts, len: polyLength(pts) };
      this.hopCache.set(k, g);
    }
    return g;
  }

  private startHop(p: Packet) {
    const s = this.surface();
    const len = s ? this.geom(s.layout, p.path[p.hop], p.path[p.hop + 1]).len : 80;
    // Short wires still read as travel; long ones never drag.
    p.dur = Math.min(0.85, Math.max(0.26, len / p.speed)) * 1000;
    p.t = 0;
  }

  private arrive(p: Packet, node: NodeId, now: number) {
    this.hit.set(node, now);
    const d = jitter(DWELL[node]);
    p.dwells.push(d);
    p.dwell = d;
  }

  private frame = (now: number) => {
    const dt = Math.min(50, now - this.prev);
    this.prev = now;
    const s = this.surface();

    if (now >= this.nextAuto) {
      if (this.packets.length < 4) this.send("client", false);
      // Irregular gaps: mostly a steady trickle, occasionally a quiet spell.
      this.nextAuto = now + (Math.random() < 0.15 ? jitter(5200, 0.25) : jitter(2300, 0.45));
    }

    for (const p of this.packets) {
      if (p.dwell > 0) {
        p.dwell -= dt;
        if (p.dwell <= 0) {
          if (p.hop >= p.path.length - 1) p.hop = -1; // finished
          else this.startHop(p);
        }
        continue;
      }
      p.t += dt / p.dur;
      if (p.t >= 1) {
        p.hop += 1;
        const node = p.path[p.hop];
        this.arrive(p, node, now);
        if (p.hop >= p.path.length - 1 && DWELL[node] === 0) p.hop = -1;
      }
    }

    const done = this.packets.filter((p) => p.hop === -1);
    if (done.length) {
      this.packets = this.packets.filter((p) => p.hop !== -1);
      for (const p of done) {
        p.el?.remove();
        p.onDone?.(p);
      }
    }

    if (s) {
      for (const p of this.packets) this.draw(p, s);
      this.drawNodes(s, now);
    }
    this.raf = requestAnimationFrame(this.frame);
  };

  private draw(p: Packet, s: Surface) {
    if (p.elLayout !== s.layout.key) {
      p.el?.remove();
      p.el = this.makeEl(p.kind);
      p.parts = { tail: p.el.firstChild as SVGPathElement, head: p.el.lastChild as SVGGElement };
      p.elLayout = s.layout.key;
      s.packets.appendChild(p.el);
    }
    const el = p.el!;
    const inNode = p.dwell > 0 || p.t <= 0;
    if (inNode) {
      el.style.opacity = "0";
      return;
    }
    const a = p.path[p.hop];
    const b = p.path[p.hop + 1];
    const { pts, len } = this.geom(s.layout, a, b);
    const at = ease(Math.min(1, p.t)) * len;
    const [x, y] = pointAt(pts, at);
    const color = nodeColor(b);
    el.style.opacity = "1";
    el.style.color = color;
    p.parts!.head.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    p.parts!.tail.setAttribute("d", subPath(pts, Math.max(0, at - 30), at));
  }

  private makeEl(kind: Packet["kind"]) {
    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("aria-hidden", "true");
    const tail = document.createElementNS(SVGNS, "path");
    tail.setAttribute("fill", "none");
    tail.setAttribute("stroke", "currentColor");
    tail.setAttribute("stroke-width", "1.75");
    tail.setAttribute("stroke-linecap", "round");
    tail.setAttribute("stroke-opacity", kind === "evt" ? "0.55" : "0.8");
    if (kind === "evt") tail.setAttribute("stroke-dasharray", "1 4");
    const head = document.createElementNS(SVGNS, "g");
    const halo = document.createElementNS(SVGNS, "circle");
    halo.setAttribute("r", "7");
    halo.setAttribute("fill", "currentColor");
    halo.setAttribute("opacity", "0.18");
    head.appendChild(halo);
    if (kind === "evt") {
      const sq = document.createElementNS(SVGNS, "rect");
      sq.setAttribute("x", "-3");
      sq.setAttribute("y", "-3");
      sq.setAttribute("width", "6");
      sq.setAttribute("height", "6");
      sq.setAttribute("transform", "rotate(45)");
      sq.setAttribute("fill", "currentColor");
      head.appendChild(sq);
    } else {
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("r", "3.25");
      c.setAttribute("fill", "currentColor");
      head.appendChild(c);
    }
    g.append(tail, head);
    return g;
  }

  /** Lamps flash on arrival; frames brighten with pointer proximity and hover/focus. */
  private drawNodes(s: Surface, now: number) {
    for (const [id, els] of s.nodes) {
      const h = this.hit.get(id);
      let flash = h === undefined ? 0 : Math.max(0, 1 - (now - h) / 700);
      flash *= flash;
      let prox = 0;
      if (this.pointer) {
        const r = s.layout.nodes[id];
        const dx = Math.max(r.x - this.pointer.x, 0, this.pointer.x - (r.x + r.w));
        const dy = Math.max(r.y - this.pointer.y, 0, this.pointer.y - (r.y + r.h));
        prox = Math.max(0, 1 - Math.hypot(dx, dy) / 120);
      }
      const hov = this.hover === id ? 1 : 0;
      const frame = Math.max(flash * 0.9, prox * 0.55, hov);
      const lamp = Math.max(flash, hov * 0.7);
      this.set(`${s.layout.key}:${id}:f`, els.frame, "strokeOpacity", 0.42 + 0.58 * frame);
      this.set(`${s.layout.key}:${id}:l`, els.lamp, "opacity", 0.32 + 0.68 * lamp);
      this.set(`${s.layout.key}:${id}:h`, els.halo, "opacity", flash * 0.45);
    }
  }

  private set(k: string, el: SVGElement, prop: "strokeOpacity" | "opacity", v: number) {
    const r = Math.round(v * 100) / 100;
    if (this.last.get(k) === r) return;
    this.last.set(k, r);
    el.style[prop] = String(r);
  }

  /** Paint node state once (used when the loop is paused, e.g. hover while off). */
  paintIdle() {
    const s = this.surface();
    if (s) this.drawNodes(s, performance.now());
  }
}

export const nodeLabel = (id: NodeId) => NODE_BY_ID[id].label;
