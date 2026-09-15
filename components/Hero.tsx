import { Reveal } from "./Reveal";
import { PortraitFrame } from "./PortraitFrame";
import { Marquee } from "./ui/Marquee";
import { WordReveal } from "./ui/WordReveal";
import { Magnetic } from "./ui/Magnetic";
import { profile, techStack } from "@/data/content";
import { ArrowDown, ArrowUpRight, Download, GitHub, LinkedIn, Mail } from "./icons";

const SOCIALS = [
  { key: "github", Icon: GitHub, accent: "var(--color-vermilion)" },
  { key: "linkedin", Icon: LinkedIn, accent: "var(--color-cyan)" },
  { key: "email", Icon: Mail, accent: "var(--color-amber)" },
] as const;

export function Hero() {
  const links = [
    { ...SOCIALS[0], href: profile.github, label: profile.githubHandle, external: true },
    { ...SOCIALS[1], href: profile.linkedin, label: profile.linkedinHandle, external: true },
    { ...SOCIALS[2], href: `mailto:${profile.email}`, label: "Email", external: false },
  ];

  // overflow-x-clip keeps the portrait glow from widening the page.
  return (
    <section id="top" className="overflow-x-clip pt-24 pb-12 sm:pt-32 lg:pt-36 lg:pb-16">
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
          <div className="order-1 lg:order-2 lg:justify-self-end">
            <PortraitFrame />
          </div>

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

            <h1 className="mt-5 text-display font-black text-ink">
              <WordReveal text="Mohamed" delay={120} step={80} className="block" />
              <WordReveal text="Elsayed" delay={220} step={80} className="block" />
            </h1>

            <Reveal delay={420}>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-h3 font-medium">
                <span className="text-signal">{profile.role}</span>
                <span className="h-4 w-px bg-line" aria-hidden="true" />
                <span className="text-ink-mute">{profile.location}</span>
              </p>
            </Reveal>

            <Reveal delay={490}>
              <p className="mt-6 max-w-[56ch] text-lead text-ink-dim">{profile.positioning}</p>
            </Reveal>

            <Reveal delay={560}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <a
                    href="#work"
                    className="group inline-flex items-center gap-2 rounded-md bg-signal px-5 py-3 font-semibold text-bg-sunken transition-colors duration-200 hover:bg-signal-hot"
                  >
                    See my work
                    <ArrowDown className="transition-transform duration-400 ease-[var(--ease-quart)] group-hover:translate-y-0.5" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={profile.cv}
                    download
                    className="inline-flex items-center gap-2 rounded-md border border-line px-5 py-3 font-medium text-ink-dim transition-colors duration-200 hover:border-line-strong hover:text-ink"
                  >
                    <Download />
                    Download CV
                  </a>
                </Magnetic>
              </div>
            </Reveal>

            <Reveal delay={630}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {links.map(({ href, label, Icon, accent, external, key }) => (
                  <li key={key} style={{ ["--accent" as string]: accent }}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel="noreferrer noopener"
                      className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink-mute transition-colors duration-200 hover:text-ink"
                    >
                      <Icon className="text-ink-faint transition-colors duration-300 group-hover:[color:var(--accent)]" />
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

      <Reveal delay={700} className="mt-14 lg:mt-20">
        <Marquee items={techStack.map((t) => t.name)} />
      </Reveal>
    </section>
  );
}
