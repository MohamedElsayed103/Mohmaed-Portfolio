import { grcPlatform, type Domain } from "@/data/content";
import s from "./grc.module.css";

const tone = (d?: Domain | string) => (d ? `var(--s-${d})` : "var(--s-fg)");

/** The asynchronous half of the platform, read straight from `grcPlatform.edges`. */
export function SystemStrip() {
  const async = grcPlatform.edges.filter((e) => "async" in e && e.async);
  const chain = [async[0].from, ...async.map((e) => e.to)].map(
    (id) => grcPlatform.nodes.find((n) => n.id === id)!,
  );

  return (
    <div className={s.strip}>
      <div className={s.docker}>
        <span className={s.dockerTag}>schema-per-tenant · DDD</span>
        <ol className={s.chain} aria-label="Approval path: risk modules start a Temporal approval workflow, whose outcome is recorded in the tenant's risk register">
          {chain.map((n, i) => (
            <li key={n.id} className="contents">
              {i > 0 && (
                <span className={s.link} aria-hidden="true">
                  <span className={`${s.mono} ${s.linkLabel}`}>{async[i - 1].label}</span>
                </span>
              )}
              <span className={s.node}>
                <span className={s.nodeName} style={{ color: tone(n.domain) }}>
                  {n.label}
                </span>
                <span className={s.mono}>{n.sub}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
