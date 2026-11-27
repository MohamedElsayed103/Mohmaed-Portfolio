"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { grcPlatform, isolation } from "@/data/content";
import { gsap, prefersReduced, whenVisible } from "@/lib/motion";
import { STAGE, finalStage, inFlight, resolveRequest, type Action, type Outcome, type Stage } from "./isolation";
import s from "./grc.module.css";

type Pt = [number, number];
type Geo = {
  w: number;
  h: number;
  tenant: Pt[][];
  authMw: Pt[];
  schema: Pt[][];
  /** Short bar drawn across the middleware exit when a request is refused. */
  barrier: [Pt, Pt];
};
type Run = { o: Outcome; stage: Stage };
type LogLine = { n: number; text: string; ok: boolean };

const [AUTH, MIDDLEWARE, SCHEMA] = isolation.steps;
const node = (id: string) => grcPlatform.nodes.find((n) => n.id === id)!;
const KEYCLOAK = node("keycloak");
const TENANT_MW = node("tenant");
const POSTGRES = node("postgres");

/* ── Geometry ─────────────────────────────────────────────────── */

function box(el: Element, origin: DOMRect) {
  const b = el.getBoundingClientRect();
  const l = b.left - origin.left;
  const t = b.top - origin.top;
  return { l, t, r: l + b.width, b: t + b.height, cx: l + b.width / 2, cy: t + b.height / 2 };
}

function elbowX(a: Pt, b: Pt): Pt[] {
  if (Math.abs(a[1] - b[1]) < 1) return [a, [b[0], a[1]]];
  const mx = Math.round((a[0] + b[0]) / 2);
  return [a, [mx, a[1]], [mx, b[1]], b];
}

/** Orthogonal polyline with softened corners. */
function toPath(pts: Pt[], r = 6): string {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x, y] = pts[i];
    const next = pts[i + 1];
    if (!next) {
      d += ` L${x} ${y}`;
      break;
    }
    const [px, py] = pts[i - 1];
    const inLen = Math.hypot(x - px, y - py);
    const outLen = Math.hypot(next[0] - x, next[1] - y);
    const k = Math.min(r, inLen / 2, outLen / 2);
    const ax = x - ((x - px) / (inLen || 1)) * k;
    const ay = y - ((y - py) / (inLen || 1)) * k;
    const bx = x + ((next[0] - x) / (outLen || 1)) * k;
    const by = y + ((next[1] - y) / (outLen || 1)) * k;
    d += ` L${ax} ${ay} Q${x} ${y} ${bx} ${by}`;
  }
  return d;
}

/* ── Component ────────────────────────────────────────────────── */

export function IsolationDemo() {
  const tenants = isolation.tenants;
  const [tenant, setTenant] = useState(0);
  const [run, setRun] = useState<Run | null>(null);
  const [log, setLog] = useState<LogLine[]>([]);
  const [demo, setDemo] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);

  const diagramRef = useRef<HTMLDivElement>(null);
  const tenantRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const authRef = useRef<HTMLDivElement>(null);
  const mwRef = useRef<HTMLDivElement>(null);
  const schemaRefs = useRef<(HTMLLIElement | null)[]>([]);
  const packetRef = useRef<HTMLSpanElement>(null);
  const wiresRef = useRef<SVGSVGElement>(null);

  const geoRef = useRef<Geo | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const runRef = useRef<{ o: Outcome; done: boolean } | null>(null);
  const seq = useRef(0);
  const demoRef = useRef<{ active: boolean; timer?: gsap.core.Tween }>({ active: false });
  const touched = useRef(false);

  /* Measure the laid-out nodes and route the wires between them. */
  useEffect(() => {
    const root = diagramRef.current;
    if (!root) return;
    const measure = () => {
      const o = root.getBoundingClientRect();
      const T = tenantRefs.current.map((el) => box(el!, o));
      const A = box(authRef.current!, o);
      const M = box(mwRef.current!, o);
      const S = schemaRefs.current.map((el) => box(el!, o));
      const horizontal = A.l >= T[0].r - 1;
      let g: Geo;
      if (horizontal) {
        g = {
          w: o.width,
          h: o.height,
          tenant: T.map((t) => elbowX([t.r, t.cy], [A.l, A.cy])),
          authMw: elbowX([A.r, A.cy], [M.l, M.cy]),
          schema: S.map((sc) => elbowX([M.r, M.cy], [sc.l, sc.cy])),
          barrier: [
            [M.r + 10, M.cy - 9],
            [M.r + 10, M.cy + 9],
          ],
        };
      } else {
        // Narrow: one spine down the left edge of every card; schemas branch off it.
        const x = Math.round(A.l + 22);
        const tb = Math.max(...T.map((t) => t.b));
        const my = Math.round((tb + A.t) / 2);
        g = {
          w: o.width,
          h: o.height,
          tenant: T.map((t) => [
            [t.cx, t.b],
            [t.cx, my],
            [x, my],
            [x, A.t],
          ]),
          authMw: [
            [x, A.b],
            [x, M.t],
          ],
          schema: S.map((sc) => [
            [x, M.b],
            [x, sc.cy],
            [sc.l, sc.cy],
          ]),
          barrier: [
            [x - 9, M.b + 10],
            [x + 9, M.b + 10],
          ],
        };
      }
      geoRef.current = g;
      setGeo(g);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    [authRef.current, mwRef.current].forEach((el) => el && ro.observe(el));
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, []);

  const pushLog = useCallback((o: Outcome) => {
    const n = ++seq.current;
    setLog((l) => [{ n, text: o.log, ok: o.ok }, ...l].slice(0, 5));
  }, []);

  const commit = useCallback(
    (o: Outcome) => {
      const cur = runRef.current;
      if (!cur || cur.o !== o || cur.done) return;
      cur.done = true;
      setRun({ o, stage: finalStage(o) });
      pushLog(o);
    },
    [pushLog],
  );

  /** Stop whatever is in flight and clear the packet, without logging it. */
  const halt = useCallback(() => {
    tlRef.current?.kill();
    tlRef.current = null;
    if (runRef.current && !runRef.current.done) {
      runRef.current = null;
      setRun(null);
    }
    if (packetRef.current) gsap.set(packetRef.current, { opacity: 0 });
  }, []);

  const play = useCallback(
    (tenantIndex: number, action: Action): gsap.core.Timeline | null => {
      halt();
      const o = resolveRequest(tenantIndex, action);
      runRef.current = { o, done: false };
      const g = geoRef.current;
      const p = packetRef.current;
      if (prefersReduced() || !g || !p) {
        commit(o);
        return null;
      }

      setRun({ o, stage: STAGE.client });
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      const stage = (st: Stage) => tl.call(() => setRun({ o, stage: st }));
      const wait = (d: number) => tl.to({}, { duration: d });
      // A packet takes the colour of the domain it is entering.
      const travel = (pts: Pt[], domain: string) => {
        tl.set(p, { x: pts[0][0], y: pts[0][1], scale: 0.4, opacity: 0, attr: { "data-domain": domain } });
        tl.to(p, { opacity: 1, scale: 1, duration: 0.18, ease: "expo.out" });
        for (let i = 1; i < pts.length; i++) {
          const [x0, y0] = pts[i - 1];
          const [x, y] = pts[i];
          tl.to(p, { x, y, duration: Math.max(0.06, Math.hypot(x - x0, y - y0) / 560) });
        }
        // Absorbed into the node it reached.
        tl.to(p, { opacity: 0, scale: 0.3, duration: 0.2, ease: "expo.out" });
      };

      travel(g.tenant[tenantIndex], "infra");
      stage(STAGE.auth);
      wait(0.5);
      stage(STAGE.authed);
      wait(0.15);
      travel(g.authMw, "python");
      stage(STAGE.middleware);
      wait(0.55);
      if (o.ok && o.schema !== null) {
        stage(STAGE.decided);
        wait(0.15);
        travel(g.schema[o.schema], "infra");
      }
      tl.call(() => commit(o));
      tlRef.current = tl;
      return tl;
    },
    [commit, halt],
  );

  const stopDemo = useCallback(() => {
    touched.current = true;
    const d = demoRef.current;
    if (!d.active) return;
    d.active = false;
    d.timer?.kill();
    halt();
    setDemo(false);
  }, [halt]);

  /* First time the demo scrolls into view: draw the wires, then run one success and one rejection. */
  useEffect(() => {
    const root = diagramRef.current;
    return whenVisible(
      root,
      () => {
        if (touched.current) return;
        const paths = wiresRef.current?.querySelectorAll("path");
        if (paths?.length) {
          gsap.fromTo(
            paths,
            { strokeDasharray: "1 1", strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.1, stagger: 0.05, ease: "expo.out", clearProps: "strokeDasharray,strokeDashoffset" },
          );
        }
        const d = demoRef.current;
        d.active = true;
        setDemo(true);
        d.timer = gsap.delayedCall(0.7, () => {
          if (!d.active) return;
          const first = play(0, "own");
          first?.eventCallback("onComplete", () => {
            if (!d.active) return;
            d.timer = gsap.delayedCall(1.2, () => {
              if (!d.active) return;
              const second = play(0, "cross");
              second?.eventCallback("onComplete", () => {
                d.active = false;
                setDemo(false);
              });
            });
          });
        });
      },
      "top 70%",
    );
  }, [play]);

  useEffect(
    () => () => {
      tlRef.current?.kill();
      demoRef.current.timer?.kill();
    },
    [],
  );

  const choose = (i: number) => {
    stopDemo();
    if (i === tenant) return;
    halt();
    runRef.current = null;
    setRun(null);
    setTenant(i);
  };

  const send = (action: Action) => {
    stopDemo();
    play(tenant, action);
  };

  /* ── Derived view state ── */
  const o = run?.o ?? null;
  const st = run?.stage ?? -1;
  const settled = !!o && st === finalStage(o);
  const authState = !o || st < STAGE.auth ? "idle" : st === STAGE.auth ? "check" : "pass";
  const mwState =
    !o || st < STAGE.middleware ? "idle" : st === STAGE.middleware ? "check" : o.ok ? "pass" : "reject";
  const litSchema = o && o.ok && st >= STAGE.schema ? o.schema : null;

  const authStatus =
    authState === "idle" ? "waiting for a request" : authState === "check" ? "verifying token" : "JWT valid, role ok";
  const mwStatus =
    mwState === "idle"
      ? "waiting for a request"
      : mwState === "check"
        ? "reading tenant from token"
        : mwState === "pass"
          ? `tenant = ${o!.tenant.id}`
          : `403  token ${o!.tenant.id} ≠ ${o!.target.id}`;

  const wireTone = (lit: boolean, domain: "infra" | "python", route: boolean) =>
    lit ? domain : route ? "route" : "idle";

  const readout = !o
    ? null
    : settled
      ? o.readout
      : inFlight(st as Stage, o);
  const [code, ...rest] = (readout ?? "").split("  ");

  return (
    <div className={s.body}>
      <div ref={diagramRef} className={s.diagram}>
        <svg
          ref={wiresRef}
          className={s.wires}
          width={geo?.w ?? 0}
          height={geo?.h ?? 0}
          aria-hidden="true"
          focusable="false"
        >
          {geo && (
            <>
              {geo.tenant.map((pts, i) =>
                i === tenant ? null : (
                  <path key={`t${i}`} d={toPath(pts)} className={s.wire} data-tone="idle" />
                ),
              )}
              {geo.schema.map((pts, i) => (
                <path
                  key={`s${i}`}
                  d={toPath(pts)}
                  className={s.wire}
                  data-tone={wireTone(litSchema === i, "infra", false)}
                />
              ))}
              <path
                d={toPath(geo.tenant[tenant])}
                className={s.wire}
                data-tone={wireTone(!!o && st >= STAGE.auth, "infra", true)}
              />
              <path
                d={toPath(geo.authMw)}
                className={s.wire}
                data-tone={wireTone(!!o && st >= STAGE.middleware, "python", true)}
              />
              {mwState === "reject" && (
                <line
                  x1={geo.barrier[0][0]}
                  y1={geo.barrier[0][1]}
                  x2={geo.barrier[1][0]}
                  y2={geo.barrier[1][1]}
                  className={s.barrier}
                />
              )}
            </>
          )}
        </svg>

        <div className={s.tenants}>
          <p className={s.label} id="iso-tenant-label">
            Signed in as (example organisations)
          </p>
          <div className={s.segmented} role="group" aria-labelledby="iso-tenant-label">
            {tenants.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tenantRefs.current[i] = el;
                }}
                type="button"
                className={s.tenant}
                aria-pressed={i === tenant}
                onClick={() => choose(i)}
              >
                <span className={s.tenantName}>{t.label}</span>
                <span className={s.tenantId}>{t.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`${s.step} ${s.auth}`}>
        <div ref={authRef} className={s.card} data-domain={KEYCLOAK.domain} data-state={authState}>
          <div className={s.cardHead}>
            <span className={s.cardName}>
              <span className={s.swatch} aria-hidden="true" />
              {AUTH.label}
            </span>
            <span className={s.mono}>{KEYCLOAK.sub}</span>
          </div>
          <p className={s.status}>{authStatus}</p>
        </div>
        <p className={s.note}>{AUTH.note}</p>
        </div>

        <div className={`${s.step} ${s.mw}`}>
        <div ref={mwRef} className={s.card} data-domain={TENANT_MW.domain} data-state={mwState}>
          <div className={s.cardHead}>
            <span className={s.cardName}>
              <span className={s.swatch} aria-hidden="true" />
              {MIDDLEWARE.label}
            </span>
          </div>
          <p className={s.status}>{mwStatus}</p>
        </div>
        <p className={s.note}>{MIDDLEWARE.note}</p>
        </div>

        <div className={`${s.step} ${s.db}`}>
        <div className={s.dbBox}>
          <div className={s.dbHead}>
            <span className={s.cardName}>
              <span className={s.swatch} aria-hidden="true" />
              {SCHEMA.label}
            </span>
            <span className={s.mono}>{POSTGRES.sub}</span>
          </div>
          <ul className={s.schemas} aria-label="Schemas in one database">
            {tenants.map((t, i) => (
              <li
                key={t.schema}
                ref={(el) => {
                  schemaRefs.current[i] = el;
                }}
                className={s.schema}
                data-lit={litSchema === i}
              >
                <span className={s.schemaName}>{t.schema}</span>
                <span className={s.schemaHit} aria-hidden="true">
                  200
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className={s.note}>{SCHEMA.note}</p>
        </div>

        <span ref={packetRef} className={s.packet} aria-hidden="true" />
      </div>

      <div className={s.panel}>
        <div className={s.console}>
          <div className={s.actions}>
            <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={() => send("own")}>
              Read own records
            </button>
            <button type="button" className={`${s.btn} ${s.btnDanger}`} onClick={() => send("cross")}>
              Try another organisation&apos;s records
            </button>
          </div>
          <div className={s.readout}>
            {demo ? (
              <p className={s.hint}>
                <span className={s.hintDot} aria-hidden="true" />
                Playing a short demo. Press any control to take over.
              </p>
            ) : (
              <p className={s.hint}>
                {o ? `Signed in as ${o.tenant.label}` : `Signed in as ${tenants[tenant].label}. Send a request.`}
              </p>
            )}
            <p
              className={s.readoutValue}
              data-tone={!o ? "pending" : !settled ? "pending" : o.ok ? "ok" : "reject"}
            >
              {readout === null ? (
                "no request yet"
              ) : settled ? (
                <>
                  <span className={s.code}>{code}</span>
                  {rest.length ? `  ${rest.join("  ")}` : ""}
                </>
              ) : (
                readout
              )}
            </p>
          </div>
        </div>

        <div>
          <p className={s.label}>Event log, newest first</p>
          <ol className={s.log} aria-live="polite" aria-relevant="additions text">
            {log.length === 0 ? (
              <li className={s.logEmpty}>no requests yet</li>
            ) : (
              log.map((l) => {
                const [c, ...tail] = l.text.split("  ");
                return (
                  <li key={l.n} className={s.logItem} data-ok={l.ok}>
                    <span className={s.logSeq}>#{String(l.n).padStart(2, "0")}</span>
                    <span>
                      <span className={s.logCode}>{c}</span>
                      {`  ${tail.join("  ")}`}
                    </span>
                  </li>
                );
              })
            )}
          </ol>
        </div>
      </div>
    </div>
  );
}
