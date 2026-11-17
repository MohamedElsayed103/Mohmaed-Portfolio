import { isolation } from "@/data/content";

/* Pure transition logic for the tenant-isolation demo. No React, no DOM:
   given who is signed in and what they ask for, decide what the system does. */

export type Tenant = (typeof isolation.tenants)[number];
export type Action = "own" | "cross";

export type Outcome = {
  action: Action;
  tenant: Tenant;
  /** The clinic whose records the request asks for. */
  target: Tenant;
  ok: boolean;
  /** Index of the schema the query runs in, or null when it never reaches the database. */
  schema: number | null;
  readout: string;
  log: string;
};

/**
 * Stages a request passes through. The run ends at STAGE.schema when the
 * tenant matches, at STAGE.decided (a 403) when it does not.
 */
export const STAGE = { client: 0, auth: 1, authed: 2, middleware: 3, decided: 4, schema: 5 } as const;
export type Stage = (typeof STAGE)[keyof typeof STAGE];

export function resolveRequest(tenantIndex: number, action: Action): Outcome {
  const all = isolation.tenants;
  const tenant = all[tenantIndex];
  // "Another clinic" is always the next one along, so the demo is deterministic.
  const targetIndex = action === "own" ? tenantIndex : (tenantIndex + 1) % all.length;
  const target = all[targetIndex];
  // The middleware takes the tenant from the token, never from the request,
  // so the only query it will scope is the token's own schema.
  const ok = target.id === tenant.id;
  return {
    action,
    tenant,
    target,
    ok,
    schema: ok ? targetIndex : null,
    readout: ok ? `200  rows from ${tenant.schema}` : isolation.rejection,
    log: ok
      ? `200  ${tenant.id} → ${tenant.schema}`
      : `403  ${tenant.id} → ${target.schema}  stopped in middleware`,
  };
}

export const finalStage = (o: Outcome): Stage => (o.ok ? STAGE.schema : STAGE.decided);

/** Live caption while a request is in flight. */
export function inFlight(stage: Stage, o: Outcome): string {
  if (stage <= STAGE.client) return `${o.tenant.id} asks for ${o.target.id} records`;
  if (stage <= STAGE.authed) return "verifying JWT and role";
  if (stage === STAGE.middleware) return "resolving tenant from the token";
  return o.ok ? `query scoped to ${o.tenant.schema}` : o.readout;
}
