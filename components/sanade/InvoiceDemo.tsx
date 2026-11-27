"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sanadeDemo } from "@/data/content";
import { EASE, gsap, prefersReduced, whenVisible, whileVisible } from "@/lib/motion";
import {
  REQUEST,
  REST,
  STEPS,
  finalFrame,
  plan,
  stampTone,
  statusOf,
  type Frame,
  type Kind,
  type Plan,
} from "./invoice";
import s from "./sanade.module.css";

type View = { plan: Plan | null; frame: Frame; settled: boolean };
type LogLine = { n: number; text: string; ok: boolean };
type Geo = { horizontal: boolean; pos: number[]; px: number };

const DEMO: Kind[] = ["issue", "invalid", "retry"];
/** Scales every hold in the plan: one full issue lands in about four seconds. */
const PACE = 0.75;

export function InvoiceDemo() {
  const [view, setView] = useState<View>({ plan: null, frame: REST, settled: false });
  const [log, setLog] = useState<LogLine[]>([]);
  const [reported, setReported] = useState(false);
  const [demo, setDemo] = useState(false);

  const laneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const packetRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const geoRef = useRef<Geo | null>(null);
  const atRef = useRef(0);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const runRef = useRef<{ p: Plan; done: boolean } | null>(null);
  const seq = useRef(0);
  const demoRef = useRef<{ active: boolean; timer?: gsap.core.Tween }>({ active: false });
  const touched = useRef(false);

  /** Put the moving part where the invoice is: the card on wide screens, the packet on narrow ones. */
  const place = useCallback((at: number) => {
    const g = geoRef.current;
    const card = cardRef.current;
    const pk = packetRef.current;
    if (!g || !card || !pk) return;
    if (g.horizontal) {
      gsap.set(card, { x: g.pos[at] - g.pos[0], opacity: 1 });
      gsap.set(pk, { opacity: 0 });
    } else {
      gsap.set(card, { x: 0, opacity: 1 });
      gsap.set(pk, { x: g.px, y: g.pos[at], opacity: 1 });
    }
  }, []);

  /* Measure where each stop sits along the lane. */
  useEffect(() => {
    const lane = laneRef.current;
    if (!lane) return;
    const measure = () => {
      const o = lane.getBoundingClientRect();
      const dots = dotRefs.current.map((d) => d!.getBoundingClientRect());
      const horizontal = dots[1].left - dots[0].left > 4;
      geoRef.current = {
        horizontal,
        pos: dots.map((d) => (horizontal ? d.left - o.left : d.top + d.height / 2 - o.top)),
        px: dots[0].left + dots[0].width / 2 - o.left,
      };
      // A run in flight was timed against the old layout: land it, then place.
      if (tlRef.current?.isActive()) tlRef.current.progress(1);
      place(atRef.current);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(lane);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [place]);

  const show = useCallback((p: Plan, frame: Frame, settled = false) => {
    atRef.current = frame.at;
    setView({ plan: p, frame, settled });
  }, []);

  const commit = useCallback(
    (p: Plan) => {
      const cur = runRef.current;
      if (!cur || cur.p !== p || cur.done) return;
      cur.done = true;
      show(p, finalFrame(p), true);
      if (p.kind === "issue") setReported(true);
      const n = ++seq.current;
      setLog((l) => [{ n, text: p.log, ok: p.ok }, ...l].slice(0, 5));
    },
    [show],
  );

  const halt = useCallback(() => {
    const tl = tlRef.current;
    tlRef.current = null;
    tl?.kill();
    const cur = runRef.current;
    if (cur && !cur.done) {
      runRef.current = null;
      // An interrupted run leaves no half-stamped invoice behind.
      atRef.current = 0;
      setView({ plan: null, frame: REST, settled: false });
    }
    place(atRef.current);
  }, [place]);

  const play = useCallback(
    (kind: Kind): gsap.core.Timeline | null => {
      halt();
      const p = plan(kind);
      runRef.current = { p, done: false };
      const g = geoRef.current;
      const card = cardRef.current;
      const pk = packetRef.current;
      if (prefersReduced() || !g || !card || !pk) {
        commit(p);
        place(finalFrame(p).at);
        return null;
      }

      const tl = gsap.timeline();
      const mover = g.horizontal ? card : pk;
      const to = (at: number) => (g.horizontal ? { x: g.pos[at] - g.pos[0] } : { y: g.pos[at] });
      let at = atRef.current;
      p.frames.forEach((frame, i) => {
        if (frame.at === at + 1) {
          // One stop forward: the invoice travels along the lane.
          tl.to(mover, { ...to(frame.at), duration: g.horizontal ? 0.55 : 0.4, ease: EASE.inOut });
        } else if (frame.at !== at || i === 0) {
          // A new document (or the earlier one, for a retry): swap it in place.
          tl.to(card, { opacity: 0, y: g.horizontal ? 8 : 0, duration: 0.18, ease: "power2.in" });
          if (!g.horizontal) tl.to(pk, { opacity: 0, duration: 0.18 }, "<");
          tl.call(() => show(p, frame));
          tl.set(mover, to(frame.at));
          tl.to(card, { opacity: 1, y: 0, duration: 0.45, ease: EASE.out });
          if (!g.horizontal) tl.to(pk, { opacity: 1, duration: 0.3 }, "<");
          if (frame.hold) tl.to({}, { duration: frame.hold * PACE });
          at = frame.at;
          return;
        }
        at = frame.at;
        tl.call(() => show(p, frame));
        if (frame.hold) tl.to({}, { duration: frame.hold * PACE });
      });
      tl.call(() => commit(p));
      tlRef.current = tl;
      return tl;
    },
    [commit, halt, place, show],
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

  /* First view: issue, then an invalid one, then retry the report task. Stops on any press. */
  useEffect(() => {
    const d = demoRef.current;
    const next = (i: number) => {
      if (!d.active) return;
      if (i >= DEMO.length) {
        d.active = false;
        setDemo(false);
        return;
      }
      const tl = play(DEMO[i]);
      tl?.eventCallback("onComplete", () => {
        if (!d.active) return;
        d.timer = gsap.delayedCall(1.6, () => next(i + 1));
      });
    };
    return whenVisible(
      laneRef.current,
      () => {
        if (touched.current) return;
        d.active = true;
        setDemo(true);
        d.timer = gsap.delayedCall(0.6, () => next(0));
      },
      "top 72%",
    );
  }, [play]);

  /* Off screen or in a hidden tab, whatever is running holds still. */
  useEffect(
    () =>
      whileVisible(laneRef.current, (active) => {
        const tl = tlRef.current;
        const timer = demoRef.current.timer;
        if (active) {
          tl?.resume();
          timer?.resume();
        } else {
          tl?.pause();
          timer?.pause();
        }
      }),
    [],
  );

  useEffect(
    () => () => {
      tlRef.current?.kill();
      demoRef.current.timer?.kill();
    },
    [],
  );

  const press = (kind: Kind) => {
    stopDemo();
    play(kind);
  };

  /* ── Derived view state ── */
  const { plan: p, frame, settled } = view;
  const tone = stampTone(frame.stamp);
  const readout = !p ? null : settled ? p.readout : frame.caption;
  const [code, ...rest] = (readout ?? "").split("  ");
  const rejected = frame.steps.validate === "reject";

  /** Wire into stop i: lit in the colour of the step it enters once the invoice has reached it. */
  const wireIn = (i: number): string => {
    if (i === 0 || i > STEPS.length) return "none";
    const step = STEPS[i - 1];
    const st = frame.steps[step.id];
    if (st === "unreached") return i === 3 ? "blocked" : "idle";
    return st === "idle" ? "idle" : step.domain;
  };

  return (
    <div className={s.body}>
      <div className={s.toolbar}>
        <div className={s.actions}>
          <button type="button" className={`${s.btn} ${s.btnPrimary}`} onClick={() => press("issue")}>
            Issue invoice
          </button>
          <button type="button" className={`${s.btn} ${s.btnDanger}`} onClick={() => press("invalid")}>
            Issue an invalid invoice
          </button>
          <button
            type="button"
            className={`${s.btn} ${s.btnQuiet}`}
            onClick={() => press("retry")}
            disabled={!reported}
            aria-describedby="sn-retry-hint"
          >
            Retry the report task
          </button>
        </div>
        <p id="sn-retry-hint" className={s.hint}>
          {demo ? (
            <>
              <span className={s.hintDot} aria-hidden="true" />
              Playing a short demo. Press any button to take over.
            </>
          ) : reported ? (
            "Retry runs only the FTA report task again, for the invoice already reported."
          ) : (
            "Retry unlocks once an invoice has been reported."
          )}
        </p>
      </div>

      <div ref={laneRef} className={s.lane}>
        <div className={s.rail}>
          <div ref={cardRef} className={s.card} data-tone={tone} data-stamp={frame.stamp}>
            <div className={s.cardHead}>
              <span className={s.invNo}>{sanadeDemo.invoice}</span>
              <span className={s.example}>example</span>
            </div>
            <span className={s.rules} aria-hidden="true">
              <span />
              <span />
              <span data-flag={rejected} />
              <span />
            </span>
            <span key={frame.stamp} className={s.stamp}>
              {frame.stamp}
            </span>
          </div>
        </div>

        <ol className={s.stops} aria-label="Invoice path">
          <li className={s.stop} data-state={p ? "done" : "idle"} data-out={wireIn(1)}>
            <span
              ref={(el) => {
                dotRefs.current[0] = el;
              }}
              className={s.dot}
              aria-hidden="true"
            />
            <span className={s.wireOut} aria-hidden="true" />
            <p className={s.name}>{REQUEST.label}</p>
            <p className={s.sub}>{REQUEST.sub}</p>
            <p className={s.status}>POST invoice</p>
          </li>
          {STEPS.map((step, i) => {
            const state = frame.steps[step.id];
            return (
              <li
                key={step.id}
                className={s.stop}
                data-domain={step.domain}
                data-state={state}
                data-in={wireIn(i + 1)}
                data-out={wireIn(i + 2)}
              >
                <span className={s.wireIn} aria-hidden="true" />
                <span
                  ref={(el) => {
                    dotRefs.current[i + 1] = el;
                  }}
                  className={s.dot}
                  aria-hidden="true"
                />
                {i < STEPS.length - 1 && <span className={s.wireOut} aria-hidden="true" />}
                <p className={s.name}>
                  <span className={s.swatch} aria-hidden="true" />
                  {step.label}
                </p>
                <p className={s.sub}>{step.sub}</p>
                <p className={s.status}>{statusOf(step.id, state)}</p>
                <p className={s.note}>{step.note}</p>
              </li>
            );
          })}
        </ol>

        <span
          ref={packetRef}
          className={s.packet}
          aria-hidden="true"
          data-domain={rejected ? "signal" : frame.at ? STEPS[frame.at - 1].domain : undefined}
        />
      </div>

      <div className={s.panel}>
        <div className={s.readout}>
          <p className={s.label}>Response</p>
          <p
            className={s.readoutValue}
            data-tone={!p || !settled ? "pending" : p.ok ? "ok" : "reject"}
          >
            {readout === null ? (
              "no invoice issued yet"
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
        <div>
          <p className={s.label}>Event log, newest first</p>
          <ol className={s.log} aria-live="polite" aria-relevant="additions text">
            {log.length === 0 ? (
              <li className={s.logEmpty}>nothing issued yet</li>
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
