import { Reveal } from "./Reveal";
import { SystemTrace } from "./SystemTrace";
import { profile, stackTicker } from "@/data/content";
import { ArrowDown, ArrowUpRight, GitHub, LinkedIn, Mail } from "./icons";

export function Hero() {
  return (
    <section id="top" className="relative pt-28 pb-16 sm:pt-36 lg:pt-40 lg:pb-24">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          {/* Type column */}
          <div>
            <Reveal delay={0}>
              <p className="data flex items-start gap-2.5">
                <span className="relative mt-[0.45em] flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                </span>
                <span className="text-ink-mute">{profile.availability}</span>
              </p>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-6 text-display font-black text-ink">
                Mohamed
                <br />
                Elsayed
              </h1>
            </Reveal>

            <Reveal delay={170}>
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-h3 font-medium text-signal">
                {profile.role}
                <span className="h-4 w-px bg-line" aria-hidden="true" />
                <span className="text-ink-mute">{profile.location}</span>
              </p>
            </Reveal>

            <Reveal delay={250}>
              <p className="mt-7 max-w-[62ch] text-lead text-ink-dim">{profile.positioning}</p>
            </Reveal>

            <Reveal delay={330}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="group inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 font-semibold text-bg-sunken transition-colors duration-200 hover:bg-signal-hot"
                >
                  See selected work
                  <ArrowDown className="transition-transform duration-400 ease-[var(--ease-quart)] group-hover:translate-y-0.5" />
                </a>
                <a
                  href={profile.cv}
                  download
                  className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-3 font-medium text-ink-dim transition-colors duration-200 hover:border-line-strong hover:text-ink"
                >
                  Download CV
                </a>
              </div>
            </Reveal>

            <Reveal delay={410}>
              <ul className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                {[
                  { href: profile.github, label: profile.githubHandle, Icon: GitHub },
                  { href: profile.linkedin, label: profile.linkedinHandle, Icon: LinkedIn },
                  { href: `mailto:${profile.email}`, label: "Email", Icon: Mail },
                ].map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target={href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-mute transition-colors duration-200 hover:text-ink"
                    >
                      <Icon className="text-ink-faint transition-colors duration-200 group-hover:text-signal" />
                      <span className="font-mono text-data">{label}</span>
                      <ArrowUpRight className="opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Schematic column */}
          <Reveal delay={480} className="lg:pl-4">
            <SystemTrace />
          </Reveal>
        </div>
      </div>

      {/* Stack strip — a datasheet row, not a logo wall */}
      <Reveal delay={560} className="mt-16 border-y border-line-soft lg:mt-24">
        <div className="shell flex flex-wrap items-center gap-x-5 gap-y-2 py-4">
          {stackTicker.map((item, i) => (
            <span key={item} className="flex items-center gap-5">
              <span className="font-mono text-data text-ink-mute">{item}</span>
              {i < stackTicker.length - 1 ? (
                <span className="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true" />
              ) : null}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
