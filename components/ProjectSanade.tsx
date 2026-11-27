import { domainOf, featured } from "@/data/content";
import { Reveal } from "./Reveal";
import { InvoiceDemo } from "./sanade/InvoiceDemo";
import s from "./sanade/sanade.module.css";

const project = featured.find((p) => p.slug === "sanade")!;

/** The two claims that carry the project, in the colour of the domain they live in. */
const LEAD: { match: string; domain: string }[] = [
  { match: "Peppol", domain: "infra" },
  { match: "Celery", domain: domainOf("Celery") ?? "python" },
];

/** Sanade: an invoice that either passes every rule or never leaves, reported exactly once. */
export function ProjectSanade() {
  const bullets = project.bullets ?? [];
  const lead = LEAD.flatMap(({ match, domain }) => {
    const text = bullets.find((b) => b.includes(match));
    return text ? [{ text, domain }] : [];
  });
  const quiet = bullets.filter((b) => !lead.some((l) => l.text === b));

  return (
    <section id="project-sanade" data-theme="light" className="py-24 sm:py-36" aria-labelledby="sanade-title">
      <div className="shell">
        <Reveal as="header">
          <p className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[var(--s-fg)] pb-3 text-[0.9375rem] text-[var(--s-muted)]">
            <span>{project.kicker}</span>
            <span className="font-mono text-[0.8125rem]">{project.year}</span>
          </p>
          <h3 id="sanade-title" className="mt-8 text-display font-black text-[var(--s-fg)] sm:mt-10">
            {project.name}
          </h3>
          <p className="mt-6 max-w-[50ch] text-lead text-[var(--s-body)] sm:mt-8">{project.summary}</p>
        </Reveal>

        <div
          role="group"
          aria-labelledby="sn-demo-title"
          aria-describedby="sn-demo-desc"
          className={`${s.demo} mt-14 sm:mt-20`}
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-2">
            <h4 id="sn-demo-title" className="text-[1.0625rem] font-bold text-[var(--s-fg)]">
              One invoice, end to end
            </h4>
            <p id="sn-demo-desc" className="max-w-[62ch] text-[0.9375rem] text-[var(--s-muted)]">
              Issue the example invoice and follow it from generation to the tax report. A broken rule stops it at
              validation; a retried report task changes nothing.
            </p>
          </div>
          <InvoiceDemo />
        </div>

        <div className="mt-20 grid gap-x-16 gap-y-12 sm:mt-28 lg:grid-cols-12">
          <ul className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:col-span-8">
            {lead.map(({ text, domain }) => (
              <li
                key={text}
                className="border-t-2 pt-5 text-h3 font-bold text-[var(--s-fg)]"
                style={{ borderColor: `var(--s-${domain})` }}
              >
                {text}
              </li>
            ))}
          </ul>
          <div className="grid content-start gap-6 border-t border-[var(--s-rule)] pt-5 lg:col-span-4">
            <ul className="grid gap-3 text-[0.9375rem] text-[var(--s-body)]">
              {quiet.map((b) => (
                <li key={b} className="max-w-[46ch]">
                  {b}
                </li>
              ))}
            </ul>
            <ul aria-label="Stack" className="flex flex-wrap gap-x-3 gap-y-1 text-[0.9375rem] font-semibold">
              {project.stack.map((t) => {
                const d = domainOf(t);
                return (
                  <li key={t} style={{ color: d ? `var(--s-${d})` : "var(--s-fg)" }}>
                    {t}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
