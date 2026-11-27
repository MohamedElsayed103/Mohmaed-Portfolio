import { invoicing, sanadeDemo } from "@/data/content";

/* Pure transition logic for the Sanade invoice demo. No React, no DOM:
   given what the visitor asked for and what has already happened,
   decide every frame the invoice passes through and where it stops. */

export type Kind = "issue" | "invalid" | "retry";
export type StepId = "pint" | "validate" | "peppol" | "fta";
export type StepState = "idle" | "active" | "done" | "reject" | "skipped" | "unreached";
export type Domain = "python" | "infra";
export type Stamp = "draft" | "generated" | "valid" | "rejected" | "delivered" | "reported" | "skipped";

/** Positions along the lane: 0 is the request, 1..4 are the steps. */
export const STOPS = ["request", "pint", "validate", "peppol", "fta"] as const;
export const STEP_IDS: StepId[] = ["pint", "validate", "peppol", "fta"];

const nodeOf = (id: string) => invoicing.nodes.find((n) => n.id === id)!;

export const REQUEST = nodeOf("client");

export const STEPS = sanadeDemo.steps.map((s) => {
  const n = nodeOf(s.id);
  return { id: s.id as StepId, label: s.label, note: s.note, sub: n.sub, domain: n.domain as Domain };
});

export type Steps = Record<StepId, StepState>;

export type Frame = {
  /** Index into STOPS where the invoice is. */
  at: number;
  steps: Steps;
  stamp: Stamp;
  /** What the readout shows while this frame is on screen. */
  caption: string;
  /** Seconds to hold this frame before the next one. */
  hold: number;
};

export type Plan = {
  kind: Kind;
  frames: Frame[];
  ok: boolean;
  readout: string;
  log: string;
};

const IDLE: Steps = { pint: "idle", validate: "idle", peppol: "idle", fta: "idle" };
const ALL_DONE: Steps = { pint: "done", validate: "done", peppol: "done", fta: "done" };

/** The resting state before anything has been issued. */
export const REST: Frame = { at: 0, steps: IDLE, stamp: "draft", caption: "", hold: 0 };

export function plan(kind: Kind): Plan {
  const inv = sanadeDemo.invoice;
  const f = (at: number, steps: Partial<Steps>, stamp: Stamp, caption: string, hold = 0.5, base = IDLE): Frame => ({
    at,
    steps: { ...base, ...steps },
    stamp,
    caption,
    hold,
  });

  if (kind === "retry") {
    // Only the report task runs again. The rest of the path already happened.
    return {
      kind,
      ok: true,
      frames: [
        f(4, { fta: "active" }, "reported", "report task retried: idempotency check", 0.9, ALL_DONE),
        f(4, { fta: "skipped" }, "skipped", sanadeDemo.outcomes.retry, 0, ALL_DONE),
      ],
      readout: sanadeDemo.outcomes.retry,
      log: `200  ${inv}  report retried, duplicate skipped`,
    };
  }

  const head: Frame[] = [
    f(0, {}, "draft", "POST invoice", 0.35),
    f(1, { pint: "active" }, "draft", "generating PINT AE", 0.45),
    f(1, { pint: "done" }, "generated", "PINT AE generated", 0.25),
    f(2, { pint: "done", validate: "active" }, "generated", "checking every rule", 0.6),
  ];

  if (kind === "invalid") {
    return {
      kind,
      ok: false,
      frames: [
        ...head,
        f(2, { pint: "done", validate: "reject", peppol: "unreached", fta: "unreached" }, "rejected", sanadeDemo.outcomes.invalid, 0),
      ],
      readout: sanadeDemo.outcomes.invalid,
      log: `422  ${inv}  rejected at validation`,
    };
  }

  return {
    kind,
    ok: true,
    frames: [
      ...head,
      f(2, { pint: "done", validate: "done" }, "valid", "valid: every rule passed", 0.25),
      f(3, { pint: "done", validate: "done", peppol: "active" }, "valid", "SMP discovery: finding the buyer's access point", 0.55),
      f(3, { pint: "done", validate: "done", peppol: "active" }, "valid", "AS4 to the buyer's access point", 0.5),
      f(3, { pint: "done", validate: "done", peppol: "done" }, "delivered", "delivered over Peppol", 0.25),
      f(4, { pint: "done", validate: "done", peppol: "done", fta: "active" }, "delivered", "report task submitting to the FTA", 0.6),
      f(4, ALL_DONE, "reported", sanadeDemo.outcomes.issue, 0),
    ],
    readout: sanadeDemo.outcomes.issue,
    log: `200  ${inv}  delivered, reported`,
  };
}

export const finalFrame = (p: Plan): Frame => p.frames[p.frames.length - 1];

/** Short machine-ish status under each step. */
export function statusOf(id: StepId, state: StepState): string {
  switch (state) {
    case "idle":
      return "waiting";
    case "unreached":
      return id === "peppol" ? "not sent" : "not reported";
    case "reject":
      return "422  rule broken";
    case "skipped":
      return "skipped: already reported";
    case "active":
      return { pint: "building", validate: "checking rules", peppol: "SMP → AS4", fta: "task running" }[id];
    case "done":
      return { pint: "generated", validate: "valid", peppol: "delivered", fta: "reported" }[id];
  }
}

/** Colour the invoice stamp takes: the domain of the step that stamped it. */
export function stampTone(stamp: Stamp): Domain | "signal" | "muted" {
  if (stamp === "rejected") return "signal";
  if (stamp === "draft") return "muted";
  if (stamp === "generated" || stamp === "valid") return "python";
  return "infra";
}
