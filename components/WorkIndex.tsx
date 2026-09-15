"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { accentOf, domainAccent, projects, projectTags, tagDomain } from "@/data/content";
import { ArrowUpRight } from "./icons";
import { TechIcon } from "./TechIcon";
import { techIcons } from "@/data/techIcons";

export function WorkIndex() {
  const [tag, setTag] = useState<string>("All");
  const reduce = useReducedMotion();

  const visible = useMemo(
    () => (tag === "All" ? projects : projects.filter((p) => p.tags.includes(tag))),
    [tag],
  );

  const counts = useMemo(() => {
    const map = new Map<string, number>([["All", projects.length]]);
    for (const t of projectTags) {
      if (t === "All") continue;
      map.set(t, projects.filter((p) => p.tags.includes(t)).length);
    }
    return map;
  }, []);

  return (
    <div className="mt-4 border-t border-line-soft pt-10">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <h3 className="text-h3 font-bold text-ink">Repository index</h3>

        <div role="group" aria-label="Filter projects by technology" className="flex flex-wrap gap-1.5">
          {projectTags.map((t) => {
            const active = tag === t;
            const count = counts.get(t) ?? 0;
            if (!count) return null;
            const d = tagDomain(t);
            const accent = d ? domainAccent[d] : "var(--color-signal)";
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                aria-pressed={active}
                style={{ ["--accent" as string]: accent }}
                className={[
                  "relative rounded-chip px-3 py-1.5 font-mono text-data transition-colors duration-300",
                  active ? "text-bg-sunken" : "text-ink-mute hover:[color:var(--accent)]",
                ].join(" ")}
              >
                {active ? (
                  <motion.span
                    layoutId="filter-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-chip"
                    style={{ background: accent }}
                    transition={
                      reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 40 }
                    }
                  />
                ) : null}
                <span className="relative">
                  {t}
                  <span className={active ? "opacity-70" : "opacity-50"}> {count}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-8 border-t border-line-soft">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((p) => (
            <motion.li
              key={p.slug}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: reduce ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-line-soft"
            >
              <Row project={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-ink-mute">Nothing tagged {tag} yet.</p>
      ) : null}
    </div>
  );
}

function Row({ project: p }: { project: (typeof projects)[number] }) {
  const Wrapper = p.repo ? "a" : "div";

  return (
    <Wrapper
      {...(p.repo
        ? { href: p.repo, target: "_blank", rel: "noreferrer noopener" }
        : {})}
      style={{ ["--accent" as string]: accentOf(p.tags[0]) ?? "var(--color-signal)" }}
      className="group -mx-3 grid gap-x-8 gap-y-2 rounded-md px-3 py-5 transition-colors duration-300 hover:bg-bg-raised md:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)_auto] md:items-baseline"
    >
      <div>
        <span className="flex items-center gap-2 font-semibold text-ink transition-colors duration-300 group-hover:[color:var(--accent)]">
          {p.name}
          {p.repo ? (
            <ArrowUpRight className="text-ink-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          ) : null}
        </span>
        <p className="mt-1.5 max-w-[68ch] text-[0.9375rem] text-ink-mute">{p.summary}</p>
      </div>

      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {p.stack.map((s) => (
          <li key={s} className="inline-flex items-center gap-1.5 font-mono text-data text-ink-faint">
            {techIcons[s] ? (
              <TechIcon
                name={s}
                size={13}
                className="shrink-0"
                style={{ color: accentOf(s) ?? "var(--color-ink-mute)" }}
              />
            ) : null}
            {s}
          </li>
        ))}
      </ul>

      <span className="font-mono text-data text-ink-faint transition-colors duration-300 group-hover:[color:var(--accent)] md:justify-self-end">{p.year}</span>
    </Wrapper>
  );
}
