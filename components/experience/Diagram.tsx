"use client";

import { forwardRef, type CSSProperties } from "react";
import { PARALLEL_STEP, next, parallel, sequence, type MachineNode } from "./model";

/* Full machine for the sticky column. The SVG draws only geometry
   (edges, bars, the composite state); every word and every button is
   HTML laid over it in the same coordinate space, so text stays at
   real pixel sizes and states are real <button>s. */

const W = 400;
const H = 700;
const CX = 200;

const BOX = { x: 82, w: 236, h: 58 };
const SEQ_Y = [66, 176, 286];
const FORK_Y = 394;
const BAR = { x: 90, w: 220, h: 6 };
const COMP = { x: 14, y: 418, w: 372, h: 128 };
const PAR = { y: 456, w: 164, h: 72, xs: [28, 208] };
const PAR_CX = PAR.xs.map((x) => x + PAR.w / 2);
const JOIN_Y = 570;
const NEXT_Y = 630;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const place = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: pct(x, W),
  top: pct(y, H),
  width: pct(w, W),
  height: pct(h, H),
});

/** Incoming path for each step; the token travels these. */
export const tokenPaths: Record<number, string[]> = {
  0: [`M${CX} 14 V${SEQ_Y[0]}`],
  1: [`M${CX} ${SEQ_Y[0] + BOX.h} V${SEQ_Y[1]}`],
  2: [`M${CX} ${SEQ_Y[1] + BOX.h} V${SEQ_Y[2]}`],
  [PARALLEL_STEP]: PAR_CX.map(
    (x) => `M${CX} ${SEQ_Y[2] + BOX.h} V${FORK_Y + BAR.h / 2} H${x} V${PAR.y}`,
  ),
};

type Phase = "upcoming" | "visited" | "active";
const phaseOf = (step: number, active: number): Phase =>
  step < active ? "visited" : step === active ? "active" : "upcoming";

const EDGE: Record<Phase, string> = {
  upcoming: "var(--s-rule)",
  visited: "color-mix(in oklab, var(--s-fg) 55%, transparent)",
  active: "var(--s-fg)",
};

function Arrow({ x, y, color }: { x: number; y: number; color: string }) {
  return <path d={`M${x - 4.5} ${y - 8} L${x} ${y} L${x + 4.5} ${y - 8} Z`} fill={color} />;
}

function Edge({ x, y1, y2, step, active, accent }: { x: number; y1: number; y2: number; step: number; active: number; accent: string }) {
  const p = phaseOf(step, active);
  const color = p === "active" ? accent : EDGE[p];
  return (
    <g style={{ color }} className="transition-colors duration-500">
      <line x1={x} y1={y1} x2={x} y2={y2 - 2} stroke="currentColor" strokeWidth={1.25} data-draw />
      <Arrow x={x} y={y2} color="currentColor" />
    </g>
  );
}

function EventLabel({ x, y, text, step, active }: { x: number; y: number; text: string; step: number; active: number }) {
  const p = phaseOf(step, active);
  return (
    <span
      aria-hidden="true"
      className="absolute -translate-y-1/2 whitespace-nowrap font-mono text-[0.86em] leading-none tracking-[0.02em] transition-colors duration-500"
      style={{
        left: pct(x, W),
        top: pct(y, H),
        color: p === "upcoming" ? "var(--s-muted)" : "var(--s-fg)",
      }}
    >
      {text}
    </span>
  );
}

function StateButton({
  node,
  active,
  style,
  onSelect,
  compact,
}: {
  node: MachineNode;
  active: number;
  style: CSSProperties;
  onSelect: (n: MachineNode) => void;
  compact?: boolean;
}) {
  const p = phaseOf(node.step, active);
  return (
    <button
      type="button"
      data-state-node
      data-phase={p}
      aria-current={p === "active" ? "step" : undefined}
      onClick={() => onSelect(node)}
      className="state-node group absolute flex flex-col justify-center rounded-[10px] border text-left transition-[background-color,border-color,color] duration-500 hover:border-[var(--s-fg)]"
      style={{
        ...style,
        ["--accent" as string]: node.accent,
        padding: compact ? "0 0.7em" : "0 1em",
        borderColor:
          p === "active"
            ? node.accent
            : p === "visited"
              ? "color-mix(in oklab, var(--s-fg) 40%, transparent)"
              : "var(--s-rule)",
        backgroundColor:
          p === "active"
            ? "color-mix(in oklab, var(--accent) 16%, var(--s-raised))"
            : p === "visited" ? "var(--s-raised)" : "transparent",
      }}
    >
      <span className="flex items-center gap-[0.55em]">
        <Lamp phase={p} />
        <span className="font-mono text-[1em] font-medium leading-tight tracking-[0.02em] text-[var(--s-fg)]">
          {node.state}
        </span>
      </span>
      <span
        className="mt-[0.3em] block text-[0.9em] leading-[1.25] transition-colors duration-500"
        style={{ color: p === "upcoming" ? "var(--s-muted)" : "var(--s-body)" }}
      >
        {node.title}
      </span>
    </button>
  );
}

export function Lamp({ phase, size = "0.62em" }: { phase: Phase | "pending"; size?: string }) {
  const lit = phase === "active";
  return (
    <span
      aria-hidden="true"
      className="relative inline-block shrink-0 rounded-full transition-[background-color,box-shadow] duration-500"
      style={{
        width: size,
        height: size,
        backgroundColor: lit
          ? "var(--accent)"
          : phase === "visited"
            ? "color-mix(in oklab, var(--s-fg) 55%, transparent)"
            : "transparent",
        boxShadow: lit
          ? "0 0 0 0.22em color-mix(in oklab, var(--accent) 28%, transparent), 0 0 1em color-mix(in oklab, var(--accent) 70%, transparent)"
          : phase === "upcoming"
            ? "inset 0 0 0 1.5px var(--s-rule)"
            : "none",
      }}
    />
  );
}

export const Diagram = forwardRef<
  SVGSVGElement,
  { active: number; onSelect: (n: MachineNode) => void; onNext: () => void; nextLive: boolean }
>(function Diagram({ active, onSelect, onNext, nextLive }, svgRef) {
  const parPhase = phaseOf(PARALLEL_STEP, active);
  const forkColor = parPhase === "upcoming" ? EDGE.upcoming : EDGE[parPhase === "active" ? "active" : "visited"];
  const forkEdge = parPhase === "active" ? "var(--s-fg)" : forkColor;

  return (
    <div
      className="relative mx-auto w-full [container-type:inline-size]"
      style={{ aspectRatio: `${W} / ${H}`, maxWidth: `calc((100svh - 8.5rem) * ${W / H})` }}
    >
      <div className="absolute inset-0 text-[max(12px,3.15cqw)]">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden="true"
          focusable="false"
        >
          {/* initial pseudo-state */}
          <circle cx={CX} cy={14} r={7} fill="var(--s-fg)" />
          <Edge x={CX} y1={21} y2={SEQ_Y[0]} step={0} active={active} accent={sequence[0].accent} />
          <Edge x={CX} y1={SEQ_Y[0] + BOX.h} y2={SEQ_Y[1]} step={1} active={active} accent={sequence[1].accent} />
          <Edge x={CX} y1={SEQ_Y[1] + BOX.h} y2={SEQ_Y[2]} step={2} active={active} accent={sequence[2].accent} />

          {/* fork */}
          <g style={{ color: forkEdge }} className="transition-colors duration-500">
            <line x1={CX} y1={SEQ_Y[2] + BOX.h} x2={CX} y2={FORK_Y} stroke="currentColor" strokeWidth={1.25} data-draw />
            <rect x={BAR.x} y={FORK_Y} width={BAR.w} height={BAR.h} rx={1.5} fill="currentColor" />
          </g>

          {/* composite state with two orthogonal regions */}
          <rect
            x={COMP.x}
            y={COMP.y}
            width={COMP.w}
            height={COMP.h}
            rx={14}
            fill="none"
            stroke={parPhase === "upcoming" ? "var(--s-rule)" : "color-mix(in oklab, var(--s-fg) 35%, transparent)"}
            strokeWidth={1}
            className="transition-[stroke] duration-500"
          />
          <line
            x1={CX}
            y1={COMP.y + 30}
            x2={CX}
            y2={COMP.y + COMP.h - 8}
            stroke="var(--s-rule)"
            strokeDasharray="4 4"
            strokeWidth={1}
          />
          {parallel.map((n, i) => (
            <Edge
              key={n.id}
              x={PAR_CX[i]}
              y1={FORK_Y + BAR.h}
              y2={PAR.y}
              step={PARALLEL_STEP}
              active={active}
              accent={n.accent}
            />
          ))}

          {/* join */}
          <g style={{ color: forkColor }} className="transition-colors duration-500">
            {PAR_CX.map((x) => (
              <line key={x} x1={x} y1={PAR.y + PAR.h} x2={x} y2={JOIN_Y} stroke="currentColor" strokeWidth={1.25} data-draw />
            ))}
            <rect x={BAR.x} y={JOIN_Y} width={BAR.w} height={BAR.h} rx={1.5} fill="currentColor" />
          </g>

          {/* pending transition */}
          <g style={{ color: "var(--s-signal)" }}>
            <line
              x1={CX}
              y1={JOIN_Y + BAR.h}
              x2={CX}
              y2={NEXT_Y - 2}
              stroke="currentColor"
              strokeWidth={1.25}
              strokeDasharray="3 4"
            />
            <Arrow x={CX} y={NEXT_Y} color="currentColor" />
          </g>

          {/* travelling tokens, positioned by the parent's effect */}
          <circle data-token r={5} cx={-20} cy={-20} fill="var(--s-fg)" opacity={0} />
          <circle data-token r={5} cx={-20} cy={-20} fill="var(--s-fg)" opacity={0} />
        </svg>

        {/* event labels */}
        <EventLabel x={CX + 14} y={40} text={sequence[0].event} step={0} active={active} />
        <EventLabel x={CX + 14} y={(SEQ_Y[0] + BOX.h + SEQ_Y[1]) / 2} text={sequence[1].event} step={1} active={active} />
        <EventLabel x={CX + 14} y={(SEQ_Y[1] + BOX.h + SEQ_Y[2]) / 2} text={sequence[2].event} step={2} active={active} />
        <EventLabel x={CX + 14} y={(SEQ_Y[2] + BOX.h + FORK_Y) / 2} text={parallel[0].event} step={PARALLEL_STEP} active={active} />
        <span
          aria-hidden="true"
          className="absolute -translate-y-1/2 whitespace-nowrap font-mono text-[0.86em] leading-none text-[var(--s-signal)]"
          style={{ left: pct(CX + 14, W), top: pct((JOIN_Y + BAR.h + NEXT_Y) / 2, H) }}
        >
          {next.event}
        </span>

        {/* composite header, centred between the two fork branches */}
        <span
          aria-hidden="true"
          className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[0.8em] leading-none tracking-[0.02em] text-[var(--s-muted)]"
          style={{ left: pct(CX, W), top: pct(COMP.y + 18, H) }}
        >
          in parallel
        </span>

        {sequence.map((n, i) => (
          <StateButton
            key={n.id}
            node={n}
            active={active}
            onSelect={onSelect}
            style={place(BOX.x, SEQ_Y[i], BOX.w, BOX.h)}
          />
        ))}
        {parallel.map((n, i) => (
          <StateButton
            key={n.id}
            node={n}
            active={active}
            onSelect={onSelect}
            compact
            style={place(PAR.xs[i], PAR.y, PAR.w, PAR.h)}
          />
        ))}

        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="absolute flex flex-col justify-center rounded-[10px] border border-dashed px-[1em] text-left bg-[var(--s-raised)] transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--s-signal)_14%,var(--s-raised))]"
          style={{
            ...place(BOX.x, NEXT_Y, BOX.w, BOX.h),
            ["--accent" as string]: "var(--s-signal)",
            borderColor: "var(--s-signal)",
          }}
        >
          <span className="flex items-center gap-[0.55em]">
            <PendingLamp live={nextLive} />
            <span className="font-mono text-[1em] font-medium leading-tight tracking-[0.02em] text-[var(--s-fg)]">
              {next.state}
            </span>
          </span>
          <span className="mt-[0.3em] block text-[0.9em] leading-[1.25] text-[var(--s-body)]">
            Pending. Send the event <span aria-hidden="true">→</span>
          </span>
        </a>
      </div>
    </div>
  );
});

/** Signal lamp that breathes while waiting. Static (lit) under reduced motion or off-screen. */
export function PendingLamp({ live, size = "0.62em" }: { live: boolean; size?: string }) {
  return (
    <span aria-hidden="true" className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      {live ? (
        <span className="absolute inset-0 animate-ping rounded-full bg-[var(--s-signal)] opacity-60 motion-reduce:hidden" />
      ) : null}
      <span className="relative inline-block h-full w-full rounded-full bg-[var(--s-signal)]" />
    </span>
  );
}
