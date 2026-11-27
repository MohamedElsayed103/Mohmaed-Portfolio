import { profile } from "@/data/content";
import { PlatformLive } from "./hero/PlatformLive";
import { ArrowDown, Download, GitHub, LinkedIn, Mail } from "./icons";
import s from "./hero/hero.module.css";

/* The hero shows the system instead of a portrait: a live diagram of the
   Sanade invoice path. Typography anchors the left, the diagram
   owns the right. The tech marquee was dropped on purpose: the diagram already
   names the stack, the Stack section shows it in full, and a second moving strip
   under moving packets competed for the eye. */

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function Hero() {
  const words = profile.name.split(" ");
  const links = [
    { href: profile.github, label: "GitHub", Icon: GitHub, external: true },
    { href: profile.linkedin, label: "LinkedIn", Icon: LinkedIn, external: true },
    { href: `mailto:${profile.email}`, label: "Email", Icon: Mail, external: false },
  ];

  return (
    <section
      id="top"
      data-theme="dark"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-x-clip pt-[5.25rem] pb-14 sm:pt-28 lg:pt-24 lg:pb-16"
    >
      <div className="shell grid items-center gap-x-8 gap-y-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] xl:gap-x-16">
        <div>
          <p
            className={`${s.follow} inline-flex min-h-8 items-center gap-2.5 rounded-full border border-[var(--s-rule)] px-3 text-[0.875rem] text-[var(--s-body)]`}
            style={delay(0)}
          >
            <span className={s.lamp} aria-hidden="true" />
            {profile.availability}
          </p>

          <h1 className="mt-5 text-[clamp(3.25rem,16.5vw,6rem)] leading-[0.92] font-black tracking-[-0.03em] text-[var(--s-fg)] lg:text-[min(5.75rem,6vw)]">
            {words.map((w, i) => (
              <span key={w} className={s.mask}>
                <span className={s.rise} style={delay(80 + i * 90)}>
                  {w}
                </span>
                {i < words.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          <p className={`${s.follow} mt-4 text-[1rem] text-[var(--s-muted)]`} style={delay(360)}>
            <span className="whitespace-nowrap">{profile.role}</span>
            <span aria-hidden="true" className="mx-2.5 text-[var(--s-rule)]">
              /
            </span>
            <span className="whitespace-nowrap">{profile.location}</span>
            <span aria-hidden="true" className="mx-2.5 text-[var(--s-rule)]">
              /
            </span>
            <span className="whitespace-nowrap">Remote, EU/US overlap</span>
          </p>

          <p
            className={`${s.follow} mt-5 max-w-[34ch] text-lead text-[var(--s-body)] lg:mt-7`}
            style={delay(440)}
          >
            {profile.positioning}
          </p>

          <div className={`${s.follow} mt-7 flex flex-wrap items-center gap-2 sm:gap-3`} style={delay(520)}>
            <a
              href="#work"
              className="group inline-flex min-h-12 items-center gap-2 rounded-md bg-[var(--s-signal)] px-4 text-[0.9375rem] font-semibold sm:px-5 sm:text-base text-[var(--s-on-signal)] transition-colors duration-200 hover:bg-signal-hot"
            >
              See my work
              <ArrowDown className="transition-transform duration-300 ease-[var(--ease-quart)] group-hover:translate-y-0.5" />
            </a>
            <a
              href={profile.cv}
              download
              className="inline-flex min-h-12 items-center gap-2 rounded-md border border-[var(--s-rule)] px-4 text-[0.9375rem] font-medium sm:px-5 sm:text-base text-[var(--s-fg)] transition-colors duration-200 hover:border-[color-mix(in_oklab,var(--s-fg)_55%,transparent)]"
            >
              <Download />
              Download CV
            </a>
          </div>

          <ul className={`${s.follow} mt-5 flex flex-wrap items-center gap-x-5`} style={delay(600)}>
            {links.map(({ href, label, Icon, external }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer noopener" : undefined}
                  className="inline-flex min-h-11 items-center gap-2 text-[0.9375rem] text-[var(--s-muted)] transition-colors duration-200 hover:text-[var(--s-fg)]"
                >
                  <Icon />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:-mr-5 xl:mr-0">
          <PlatformLive />
        </div>
      </div>
    </section>
  );
}
