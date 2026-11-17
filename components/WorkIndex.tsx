"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { domainOf, projects, projectTags, tagDomain, type Project } from "@/data/content";
import { ArrowUpRight } from "./icons";

const domainVar = (d: string | undefined) => (d ? `var(--s-${d})` : "var(--s-fg)");
const EXPO = [0.16, 1, 0.3, 1] as const;

/** Every other repository, as a ruled index. Filter chips hide when nothing matches. */
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
      if (t !== "All") map.set(t, projects.filter((p) => p.tags.includes(t)).length);
    }
    return map;
  }, []);

  return (
    <section data-theme="dark" aria-labelledby="index-title" className="py-24 sm:py-36">
      <div className="shell">
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <h3 id="index-title" className="text-h1 font-black text-[var(--s-fg)]">
              Everything else
            </h3>
            <p className="mt-3 max-w-[44ch] text-[var(--s-muted)]">
              Smaller systems and exercises. Each row opens its repository.
            </p>
          </div>

          <div role="group" aria-label="Filter repositories by technology" className="flex flex-wrap gap-1.5">
            {projectTags.map((t) => {
              const count = counts.get(t) ?? 0;
              if (!count) return null;
              const active = tag === t;
              const accent = t === "All" ? "var(--s-fg)" : domainVar(tagDomain(t));
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  aria-pressed={active}
                  className={[
                    "relative inline-flex min-h-11 items-center rounded-[8px] border px-3.5 text-sm font-semibold transition-colors duration-300",
                    active
                      ? "border-transparent text-[var(--color-bg-sunken)]"
                      : "border-[var(--s-rule)] text-[var(--s-muted)] hover:border-[var(--s-muted)] hover:text-[var(--s-fg)]",
                  ].join(" ")}
                >
                  {active ? (
                    <motion.span
                      layoutId="index-filter"
                      aria-hidden="true"
                      className="absolute inset-[-1px] rounded-[8px]"
                      style={{ background: accent }}
                      transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EXPO }}
                    />
                  ) : null}
                  <span className="relative">
                    {t}
                    <span className="ml-1.5 font-mono text-[0.75rem] font-normal opacity-70">{count}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-12 border-t border-[var(--s-rule)]">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout={reduce ? false : "position"}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.18 } }}
                transition={{ duration: reduce ? 0 : 0.55, ease: EXPO }}
                className="border-b border-[var(--s-rule)]"
              >
                <Row project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <p aria-live="polite" className="sr-only">
          {visible.length} {visible.length === 1 ? "repository" : "repositories"} shown{tag === "All" ? "" : ` for ${tag}`}.
        </p>
      </div>
    </section>
  );
}

function Row({ project: p }: { project: Project }) {
  const accent = domainVar(tagDomain(p.tags[0]));
  const body = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        style={{ background: accent }}
      />
      <span className="flex items-baseline gap-4 sm:col-start-1">
        <span className="text-[clamp(1.25rem,1.1rem+0.7vw,1.75rem)] leading-tight font-bold tracking-[-0.02em] text-[var(--s-fg)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-2">
          {p.name}
        </span>
      </span>
      <span className="block max-w-[56ch] text-[var(--s-body)] opacity-85 transition-opacity duration-300 group-hover:opacity-100 sm:col-start-1">
        {p.summary}
      </span>
      <span className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.8125rem] sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:self-center">
        {p.stack.map((s) => (
          <span key={s} style={{ color: domainVar(domainOf(s)) }}>
            {s}
          </span>
        ))}
      </span>
      <span className="flex items-center gap-4 sm:col-start-3 sm:row-span-2 sm:row-start-1 sm:self-center sm:justify-self-end">
        <span className="font-mono text-[0.8125rem] text-[var(--s-muted)]">{p.year}</span>
        {p.repo ? (
          <span
            aria-hidden="true"
            className="relative grid size-9 place-items-center overflow-hidden rounded-full border border-[var(--s-rule)] text-[var(--s-fg)] transition-colors duration-300 group-hover:border-transparent"
          >
            <span
              className="absolute inset-0 scale-0 rounded-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-100"
              style={{ background: accent }}
            />
            <ArrowUpRight
              size={14}
              className="absolute transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-6 group-hover:-translate-y-6"
            />
            <ArrowUpRight
              size={14}
              className="absolute -translate-x-6 translate-y-6 text-[var(--color-bg-sunken)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0 group-hover:translate-y-0"
            />
          </span>
        ) : null}
      </span>
    </>
  );

  const cls =
    "group relative grid gap-x-10 gap-y-2 py-6 transition-colors duration-500 ease-[var(--ease-expo)] sm:grid-cols-[minmax(0,1fr)_minmax(0,14rem)_auto] sm:py-7 hover:bg-[color-mix(in_oklab,var(--s-fg)_4%,transparent)] focus-visible:outline-offset-0";

  return p.repo ? (
    <a href={p.repo} target="_blank" rel="noopener noreferrer" className={cls}>
      {body}
      <span className="sr-only"> (repository, opens in a new tab)</span>
    </a>
  ) : (
    <div className={cls}>{body}</div>
  );
}
