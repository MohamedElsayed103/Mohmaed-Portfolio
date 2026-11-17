import { career, domainOf, education, experience, type Domain, type Role } from "@/data/content";

/* The career machine, derived from `career` and joined to the role and
   education records it points at. Steps are what the scroll position can
   activate: the two parallel states share one step, and the pending
   NEXT_ROLE is never entered (it waits on an event). */

export type EduRecord = (typeof education)[number];

export type MachineNode = {
  id: string;
  state: string;
  /** Event on the transition into this state. */
  event: string;
  title: string;
  period: string;
  step: number;
  accent: string;
  role?: Role;
  edu?: EduRecord;
};

const ACCENT: Record<Domain, string> = {
  compiled: "var(--s-compiled)",
  python: "var(--s-python)",
  infra: "var(--s-infra)",
  frontend: "var(--s-frontend)",
};

/** The domain most of a role's stack belongs to. */
export function dominantDomain(stack: string[]): Domain | undefined {
  const counts = new Map<Domain, number>();
  for (const t of stack) {
    const d = domainOf(t);
    if (d) counts.set(d, (counts.get(d) ?? 0) + 1);
  }
  let best: Domain | undefined;
  let max = 0;
  for (const [d, n] of counts) {
    if (n > max) {
      best = d;
      max = n;
    }
  }
  return best;
}

export function accentVar(name: string): string | undefined {
  const d = domainOf(name);
  return d ? ACCENT[d] : undefined;
}

function roleFor(company: string) {
  return experience.find((r) => r.company === company);
}

function eduFor(company: string) {
  return education.find((e) => e.place.includes(company));
}

function nodeFrom(
  s: { id: string; state: string; company: string; period: string },
  event: string,
  step: number,
): MachineNode {
  const role = roleFor(s.company);
  const edu = role ? undefined : eduFor(s.company);
  const domain = role ? dominantDomain(role.stack) : undefined;
  return {
    id: s.id,
    state: s.state,
    event,
    title: s.company,
    period: s.period,
    step,
    accent: domain ? ACCENT[domain] : "var(--s-fg)",
    role,
    edu,
  };
}

export const sequence: MachineNode[] = career.states.map((s, i) => nodeFrom(s, s.event, i));

export const PARALLEL_STEP = sequence.length;

export const parallel: MachineNode[] = career.parallel.map((s) =>
  nodeFrom(s, career.forkEvent, PARALLEL_STEP),
);

export const next = {
  id: "next",
  state: career.next.state,
  event: career.next.event,
  accent: "var(--s-signal)",
};

export const allNodes: MachineNode[] = [...sequence, ...parallel];

/** DOM id of the scroll block for a node. */
export const blockId = (id: string) => `exp-${id}`;
