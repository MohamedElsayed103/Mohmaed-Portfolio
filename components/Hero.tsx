import { Reveal } from "./Reveal";
import { PortraitFrame } from "./PortraitFrame";
import { profile } from "@/data/content";
import { ArrowDown, ArrowUpRight, Download, GitHub, LinkedIn, Mail } from "./icons";

export function Hero() {
  // overflow-x-clip keeps the portrait's decorative glow from widening the
  // page; clip (not hidden) leaves the vertical axis untouched.
  return (
    <section id="top" className="overflow-x-clip pt-24 pb-14 sm:pt-32 lg:pt-36 lg:pb-20">
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          {/* Portrait — first thing on a phone, right-hand side on desktop */}
          <Reveal className="order-1 lg:order-2 lg:justify-self-end">
            <PortraitFrame />
          </Reveal>

          {/* Type */}
          <div className="order-2 lg:order-1">
            <Reveal delay={60}>
              <p className="data flex items-center gap-2.5">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
                </span>
                <span className="text-ink-mute">{profile.availability}</span>
              </p>
            </Reveal>

            <Reveal delay={130}>
              <h1 className="mt-5 text-display font-black text-ink">
                Mohamed
                <br />
                Elsayed
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-h3 font-medium text-signal">
                {profile.role}
                <span className="h-4 w-px bg-line" aria-hidden="true" />
                <span className="text-ink-mute">{profile.location}</span>
              </p>
            </Reveal>

            <Reveal delay={270}>
              <p className="mt-6 max-w-[56ch] text-lead text-ink-dim">{profile.positioning}</p>
            </Reveal>

            <Reveal delay={340}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="group inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 font-semibold text-bg-sunken transition-colors duration-200 hover:bg-signal-hot"
                >
                  See my work
                  <ArrowDown className="transition-transform duration-400 ease-[var(--ease-quart)] group-hover:translate-y-0.5" />
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

            <Reveal delay={410}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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
        </div>
      </div>
    </section>
  );
}
