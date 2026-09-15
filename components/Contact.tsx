"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { profile } from "@/data/content";
import { ArrowUpRight, Check, Copy, Download, GitHub, LinkedIn, Mail, MapPin, Phone } from "./icons";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied) — the mailto
      // link beside this button still works.
      setCopied(false);
    }
  }

  const links = [
    { href: `mailto:${profile.email}`, Icon: Mail, label: profile.email, meta: "email" },
    { href: profile.phoneHref, Icon: Phone, label: profile.phone, meta: "phone / WhatsApp" },
    {
      href: profile.github,
      Icon: GitHub,
      label: profile.githubHandle,
      meta: "github",
      external: true,
    },
    {
      href: profile.linkedin,
      Icon: LinkedIn,
      label: profile.linkedinHandle,
      meta: "linkedin",
      external: true,
    },
  ];

  return (
    <section id="contact" className="border-t border-line-soft py-16 sm:py-24">
      <div className="shell">
        <SectionHeading title="Get in touch" note="usually replies within a day" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <p className="max-w-[20ch] text-h1 font-bold text-ink">
              Have a backend that needs building?
            </p>
            <p className="mt-5 max-w-[52ch] text-lead text-ink-dim">
              I am open to backend roles, remote or on-site, and to contract work on Java or Python
              systems.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 font-semibold text-bg-sunken transition-colors duration-200 hover:bg-signal-hot"
              >
                <Mail />
                Email me
              </a>
              <a
                href={profile.cv}
                download
                className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-3 font-medium text-ink-dim transition-colors duration-200 hover:border-line-strong hover:text-ink"
              >
                <Download />
                Download CV
              </a>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <ul className="border-t border-line">
              {links.map(({ href, Icon, label, meta, external }) => (
                <li key={meta} className="border-b border-line-soft">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="group flex items-center gap-3.5 py-4 text-ink-dim transition-colors duration-200 hover:text-ink"
                  >
                    <Icon className="shrink-0 text-ink-faint transition-colors duration-200 group-hover:text-signal" />
                    <span className="min-w-0 flex-1">
                      <span className="data block text-ink-faint">{meta}</span>
                      <span className="block truncate font-mono text-[0.9375rem]">{label}</span>
                    </span>
                    {external ? (
                      <ArrowUpRight className="shrink-0 text-ink-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="inline-flex items-center gap-2 text-[0.9375rem] text-ink-mute">
                <MapPin className="text-ink-faint" />
                {profile.location}
                <span className="data text-ink-faint">GMT+2</span>
              </span>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[0.6875rem] text-ink-mute transition-colors duration-200 hover:border-line-strong hover:text-ink"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "email copied" : "copy email"}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
