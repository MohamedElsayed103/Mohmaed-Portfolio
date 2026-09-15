"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { profile } from "@/data/content";
import { ArrowUpRight, Check, Copy, GitHub, LinkedIn, MapPin, Phone } from "./icons";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, denied permission) — the
      // mailto link beside this button still works.
      setCopied(false);
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const body = [message, "", "—", name, email].filter(Boolean).join("\n");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject || `Message from ${name || "your site"}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <section id="contact" className="border-t border-line-soft py-20 sm:py-28">
      <div className="shell">
        <SectionHeading title="Get in touch" note="usually replies within a day" />

        <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          {/* Direct lines */}
          <div>
            <Reveal>
              <p className="max-w-[24ch] text-h1 font-bold text-ink">
                Have a backend that needs building?
              </p>
              <p className="mt-6 max-w-[56ch] text-lead text-ink-dim">
                I am open to backend engineering roles, remote or on-site, and to contract work on
                Java or Python systems. The fastest way to reach me is email.
              </p>
            </Reveal>

            <Reveal delay={90}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="font-mono text-[0.9375rem] text-signal underline decoration-line-strong underline-offset-4 transition-colors duration-200 hover:decoration-signal sm:text-[1.0625rem]"
                >
                  {profile.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 font-mono text-[0.6875rem] text-ink-mute transition-colors duration-200 hover:border-line-strong hover:text-ink"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "copied" : "copy"}
                </button>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <ul className="mt-9 space-y-4">
                {[
                  {
                    href: profile.phoneHref,
                    Icon: Phone,
                    label: profile.phone,
                    meta: "phone / WhatsApp",
                  },
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
                ].map(({ href, Icon, label, meta, external }) => (
                  <li key={meta}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                      className="group flex items-center gap-3 text-ink-dim transition-colors duration-200 hover:text-ink"
                    >
                      <Icon className="text-ink-faint transition-colors duration-200 group-hover:text-signal" />
                      <span className="font-mono text-[0.9375rem]">{label}</span>
                      <span className="data text-ink-faint">{meta}</span>
                      {external ? (
                        <ArrowUpRight className="text-ink-faint opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      ) : null}
                    </a>
                  </li>
                ))}
                <li className="flex items-center gap-3 text-ink-mute">
                  <MapPin className="text-ink-faint" />
                  <span className="text-[0.9375rem]">{profile.location}</span>
                  <span className="data text-ink-faint">GMT+2 / GMT+3</span>
                </li>
              </ul>
            </Reveal>
          </div>

          {/* Compose */}
          <Reveal delay={120}>
            <form onSubmit={handleSubmit} className="border-t border-line pt-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" name="name" autoComplete="name" required />
                <Field label="Email" name="email" type="email" autoComplete="email" required />
              </div>

              <div className="mt-5">
                <Field label="Subject" name="subject" />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="data block text-ink-mute">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="What are you building?"
                  className="mt-2 w-full resize-y rounded-md border border-line bg-bg-raised px-3.5 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors duration-200 focus:border-signal focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-md bg-signal px-5 py-3 font-semibold text-bg-sunken transition-colors duration-200 hover:bg-signal-hot sm:w-auto"
              >
                Compose email
              </button>

              <p className="data mt-4 text-ink-faint">
                Opens your mail client with the message filled in — nothing is sent from this page.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="data block text-ink-mute">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-md border border-line bg-bg-raised px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors duration-200 focus:border-signal focus:outline-none"
      />
    </div>
  );
}
