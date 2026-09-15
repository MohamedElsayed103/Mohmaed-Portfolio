"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { projects, projectTags } from "@/data/content";
import { ArrowUpRight } from "./icons";

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
    <div className="mt-6 border-t border-line-soft pt-12">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <h3 className="text-h3 font-bold text-ink">Repository index</h3>

        <div role="group" aria-label="Filter projects by technology" className="flex flex-wrap gap-1.5">
          {projectTags.map((t) => {
            const active = tag === t;
            const count = counts.get(t) ?? 0;
            if (!count) return null;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                aria-pressed={active}
                className={[
                  "relative rounded-chip px-3 py-1.5 font-mono text-data transition-colors duration-200",
                  active ? "text-bg-sunken" : "text-ink-mute hover:text-ink",
                ].join(" ")}
              >
                {active ? (
                  <motion.span
                    layoutId="filter-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-chip bg-signal"
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
      className="group -mx-3 grid gap-x-8 gap-y-2 rounded-md px-3 py-5 transition-colors duration-200 hover:bg-bg-raised md:grid-cols-[minmax(0,2.1fr)_minmax(0,1fr)_auto] md:items-baseline"
    >
      <div>
        <span className="flex items-center gap-2 font-semibold text-ink transition-colors duration-200 group-hover:text-signal">
          {p.name}
          {p.repo ? (
            <ArrowUpRight className="text-ink-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          ) : null}
        </span>
        <p className="mt-1.5 max-w-[68ch] text-[0.9375rem] text-ink-mute">{p.summary}</p>
      </div>

      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {p.stack.map((s) => (
          <li key={s} className="font-mono text-data text-ink-faint">
            {s}
          </li>
        ))}
      </ul>

      <span className="font-mono text-data text-ink-faint md:justify-self-end">{p.year}</span>
    </Wrapper>
  );
}
