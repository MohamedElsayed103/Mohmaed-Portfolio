import { profile } from "@/data/content";
import { ArrowDown } from "./icons";

export function Footer() {
  return (
    <footer className="border-t border-line-soft">
      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-9">
        <p className="data text-ink-faint">
          © {new Date().getFullYear()} {profile.name} · Built with Next.js and Tailwind CSS
        </p>

        <a
          href="#top"
          className="group inline-flex items-center gap-2 font-mono text-data text-ink-mute transition-colors duration-200 hover:text-ink"
        >
          <ArrowDown className="rotate-180 transition-transform duration-400 ease-[var(--ease-quart)] group-hover:-translate-y-0.5" />
          Back to top
        </a>
      </div>
    </footer>
  );
}
