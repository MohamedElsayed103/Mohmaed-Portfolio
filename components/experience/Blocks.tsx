"use client";

import type { ReactNode } from "react";
import { Lamp, PendingLamp } from "./Diagram";
import { PARALLEL_STEP, accentVar, blockId, next, parallel, sequence, type MachineNode } from "./model";

/* The scroll column. On desktop it is plain reading matter beside the
   sticky diagram. Below lg it carries the machine itself: each block
   is a state box, arrows with event names run between them, and the
   two current roles sit in one composite state as stacked regions. */

type Phase = "upcoming" | "visited" | "active";
const phaseOf = (step: number, active: number): Phase =>
  step < active ? "visited" : step === active ? "active" : "upcoming";

/** Vertical transition, mobile only. */
function Transition({ event, tone = "fg", dashed }: { event: string; tone?: "fg" | "signal"; dashed?: boolean }) {
  const color = tone === "signal" ? "var(--s-signal)" : "color-mix(in oklab, var(--s-fg) 55%, transparent)";
  return (
    <div aria-hidden="true" className="flex h-16 items-stretch gap-3 pl-[1.375rem] lg:hidden" style={{ color }}>
      <svg width="10" height="64" viewBox="0 0 10 64" className="-ml-[5px] shrink-0" focusable="false">
        <line
          x1="5"
          y1="0"
          x2="5"
          y2="56"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray={dashed ? "3 4" : undefined}
        />
        <path d="M0.5 55 L5 63 L9.5 55 Z" fill="currentColor" />
      </svg>
      <span
        className="self-center font-mono text-[0.8125rem] tracking-[0.02em]"
        style={{ color: tone === "signal" ? "var(--s-signal)" : "var(--s-muted)" }}
      >
        {event}
      </span>
    </div>
  );
}

function StateTag({ node, phase, right }: { node: MachineNode; phase: Phase; right?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-[var(--s-rule)] pb-3 lg:border-0 lg:pb-0">
      <span className="flex items-center gap-2.5 text-[0.875rem]" style={{ ["--accent" as string]: node.accent }}>
        <Lamp phase={phase} size="0.6875rem" />
        <span className="font-mono font-medium tracking-[0.02em] text-[var(--s-fg)]">{node.state}</span>
      </span>
      {right}
    </div>
  );
}

function Period({ text }: { text: string }) {
  const [from, to] = text.split(" — ");
  return (
    <span className="font-mono text-[0.8125rem] tracking-[0.02em] text-[var(--s-muted)]">
      {to ? (
        <>
          {from} <span aria-hidden="true">→</span>
          <span className="sr-only">to</span>{" "}
          <span className={to === "Present" ? "text-[var(--s-fg)]" : undefined}>{to}</span>
        </>
      ) : (
        from
      )}
    </span>
  );
}

function RoleBody({ node }: { node: MachineNode }) {
  const role = node.role!;
  return (
    <>
      <h3
        className="mt-5 text-[clamp(1.75rem,1.2rem+2.2vw,2.875rem)] font-extrabold leading-[1.02] tracking-[-0.028em] lg:mt-6"
        style={{ color: node.accent }}
      >
        {role.company}
      </h3>
      <p className="mt-3 text-lead leading-snug">
        <span className="font-semibold text-[var(--s-fg)]">{role.role}</span>
        <span className="text-[var(--s-muted)]"> · {role.type}</span>
      </p>
      <p className="mt-5 max-w-[60ch] text-[1.0625rem] leading-relaxed text-[var(--s-body)]">{role.summary}</p>
      <ul className="mt-5 max-w-[62ch] space-y-3">
        {role.bullets.map((b) => (
          <li key={b} className="grid grid-cols-[1.25rem_minmax(0,1fr)] text-[0.9875rem] leading-relaxed text-[var(--s-body)]">
            <span
              aria-hidden="true"
              className="mt-[0.8em] h-[1.5px] w-2.5"
              style={{ backgroundColor: node.accent }}
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {role.stack.map((t) => (
          <li key={t} className="flex items-center gap-2 text-[0.9375rem] text-[var(--s-fg)]">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-[1px]"
              style={{ backgroundColor: accentVar(t) ?? "var(--s-muted)" }}
            />
            {t}
          </li>
        ))}
      </ul>
    </>
  );
}

function RoleBlock({ node, active, boxed = true }: { node: MachineNode; active: number; boxed?: boolean }) {
  const phase = phaseOf(node.step, active);
  return (
    <article
      id={blockId(node.id)}
      data-step={node.step}
      tabIndex={-1}
      aria-current={phase === "active" ? "step" : undefined}
      className={`scroll-mt-28 outline-none lg:py-14 ${boxed ? "rounded-xl border border-[var(--s-rule)] p-5 sm:p-7 lg:rounded-none lg:border-0 lg:px-0" : "p-5 sm:p-7 lg:px-0"}`}
      style={{ ["--accent" as string]: node.accent }}
    >
      <StateTag node={node} phase={phase} right={<Period text={node.period} />} />
      <RoleBody node={node} />
    </article>
  );
}

function EduBlock({ node, active }: { node: MachineNode; active: number }) {
  const edu = node.edu!;
  const phase = phaseOf(node.step, active);
  return (
    <article
      id={blockId(node.id)}
      data-step={node.step}
      tabIndex={-1}
      aria-current={phase === "active" ? "step" : undefined}
      className="scroll-mt-28 rounded-xl border border-[var(--s-rule)] p-5 outline-none sm:p-7 lg:rounded-none lg:border-0 lg:border-t lg:px-0 lg:py-10"
    >
      <StateTag node={node} phase={phase} right={<Period text={edu.year} />} />
      <h3 className="mt-4 text-h3 font-bold text-[var(--s-fg)]">{edu.credential}</h3>
      <p className="mt-1.5 text-[0.9875rem] leading-relaxed text-[var(--s-body)]">
        {edu.detail}
        <span className="text-[var(--s-muted)]"> · {edu.place}</span>
      </p>
    </article>
  );
}

function Bar() {
  return <div aria-hidden="true" className="h-1.5 w-[min(16rem,70%)] rounded-[2px] bg-[color-mix(in_oklab,var(--s-fg)_55%,transparent)]" />;
}

export function Blocks({ active, onNext, nextLive }: { active: number; onNext: () => void; nextLive: boolean }) {
  const parActive = active === PARALLEL_STEP;
  return (
    <ol className="relative">
      <li aria-hidden="true" className="pl-[1.375rem] lg:hidden">
        <span className="-ml-[7px] block h-3.5 w-3.5 rounded-full bg-[var(--s-fg)]" />
      </li>

      {sequence.map((n) => (
        <li key={n.id}>
          <Transition event={n.event} />
          {n.role ? <RoleBlock node={n} active={active} /> : <EduBlock node={n} active={active} />}
        </li>
      ))}

      <li>
        <Transition event={parallel[0].event} />
        <div className="lg:hidden">
          <Bar />
        </div>
        <div aria-hidden="true" className="h-6 pl-[1.375rem] lg:hidden">
          <span className="-ml-px block h-full w-px bg-[color-mix(in_oklab,var(--s-fg)_55%,transparent)]" />
        </div>

        <div
          className="rounded-2xl border transition-[border-color] duration-500 lg:rounded-none lg:border-0 lg:border-t lg:pt-10"
          style={{
            borderColor: parActive
              ? "color-mix(in oklab, var(--s-fg) 45%, transparent)"
              : "var(--s-rule)",
          }}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 pt-4 sm:px-7 lg:px-0 lg:pt-0">
            <p className="text-[0.9875rem] text-[var(--s-body)]">
              <span className="font-semibold text-[var(--s-fg)]">Two states at once.</span> Both entered on{" "}
              <span className="font-mono text-[0.875rem] text-[var(--s-fg)]">{parallel[0].event}</span>.
            </p>
            <Period text={parallel[0].period} />
          </div>
          {parallel.map((n, i) => (
            <div
              key={n.id}
              className={i > 0 ? "border-t border-dashed border-[var(--s-rule)] lg:border-solid" : undefined}
            >
              <RoleBlock node={n} active={active} boxed={false} />
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="h-6 pl-[1.375rem] lg:hidden">
          <span className="-ml-px block h-full w-px bg-[color-mix(in_oklab,var(--s-fg)_55%,transparent)]" />
        </div>
        <div className="lg:hidden">
          <Bar />
        </div>
      </li>

      <li>
        <Transition event={next.event} tone="signal" dashed />
        <div
          id={blockId(next.id)}
          data-step={PARALLEL_STEP}
          className="rounded-xl border border-dashed border-[var(--s-signal)] p-5 sm:p-7 lg:mt-10"
          style={{ ["--accent" as string]: next.accent }}
        >
          <span className="flex items-center gap-2.5 text-[0.875rem]">
            <PendingLamp live={nextLive} size="0.6875rem" />
            <span className="font-mono font-medium tracking-[0.02em] text-[var(--s-fg)]">{next.state}</span>
            <span className="text-[var(--s-muted)]">pending</span>
          </span>
          <h3 className="mt-4 text-h3 font-bold text-[var(--s-fg)]">The next state is not written yet.</h3>
          <p className="mt-2 max-w-[52ch] text-[0.9875rem] leading-relaxed text-[var(--s-body)]">
            It is reached on one event, and you are the one who can send it.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              onNext();
            }}
            className="mt-5 inline-flex min-h-11 items-center gap-2.5 rounded-lg bg-[var(--s-signal)] px-5 font-semibold text-[var(--s-on-signal)] transition-[filter] duration-200 hover:brightness-110"
          >
            Send <span className="font-mono text-[0.875rem] font-medium">{next.event}</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </li>
    </ol>
  );
}
