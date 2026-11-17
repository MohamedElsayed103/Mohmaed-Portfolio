import { profile } from "@/data/content";
import { ArrowDown, ArrowUpRight } from "./icons";
import { Reveal } from "./Reveal";
import { ContactHero } from "./contact/ContactHero";
import { PendingTransition } from "./contact/PendingTransition";
import styles from "./contact/contact.module.css";

type Channel = {
  label: string;
  meta: string;
  href: string;
  kind: "external" | "local" | "download";
};

const channels: Channel[] = [
  { label: "GitHub", meta: profile.githubHandle, href: profile.github, kind: "external" },
  { label: "LinkedIn", meta: profile.linkedinHandle, href: profile.linkedin, kind: "external" },
  { label: "Phone", meta: profile.phone, href: profile.phoneHref, kind: "local" },
  { label: "Download CV", meta: "PDF", href: profile.cv, kind: "download" },
];

const travel = "absolute inset-0 transition-transform duration-500 ease-[var(--ease-expo)]";

function TravelArrow({ kind }: { kind: Channel["kind"] }) {
  if (kind === "download") {
    return (
      <span aria-hidden="true" className="relative block size-4 shrink-0 overflow-hidden">
        <ArrowDown size={16} className={`${travel} group-hover:translate-y-full`} />
        <ArrowDown size={16} className={`${travel} -translate-y-full group-hover:translate-y-0`} />
      </span>
    );
  }
  return (
    <span aria-hidden="true" className="relative block size-4 shrink-0 overflow-hidden">
      <ArrowUpRight size={16} className={`${travel} group-hover:translate-x-full group-hover:-translate-y-full`} />
      <ArrowUpRight size={16} className={`${travel} -translate-x-full translate-y-full group-hover:translate-x-0 group-hover:translate-y-0`} />
    </span>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      data-theme="dark"
      aria-labelledby="contact-title"
      className={`${styles.contact} overflow-x-clip py-28 sm:py-40`}
    >
      <div className="shell">
        <PendingTransition />

        <div className="mt-14 sm:mt-20">
          <ContactHero />
        </div>

        <Reveal as="ul" className="mt-20 grid sm:mt-28 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
          {channels.map((c) => (
            <li key={c.label} className="border-t border-[var(--s-rule)]">
              <a
                href={c.href}
                {...(c.kind === "external" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...(c.kind === "download" ? { download: "" } : {})}
                className="group flex min-h-11 items-start justify-between gap-4 pt-5 pb-8"
              >
                <span className="min-w-0">
                  <span className="relative inline-block text-h3 font-semibold text-[var(--s-fg)]">
                    {c.label}
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
                    />
                  </span>
                  <span className="mt-1.5 block font-mono text-data break-all text-[var(--s-muted)]">{c.meta}</span>
                  {c.kind === "external" ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </span>
                <span className="mt-2 text-[var(--s-muted)] transition-colors duration-300 group-hover:text-[var(--s-signal)]">
                  <TravelArrow kind={c.kind} />
                </span>
              </a>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
