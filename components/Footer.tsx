import { profile } from "@/data/content";
import { BackToTop } from "./contact/BackToTop";
import { Lamp } from "./contact/Lamp";

export function Footer() {
  return (
    <footer data-theme="dark" className="border-t border-[var(--s-rule)]">
      <div className="shell grid gap-y-4 py-8 text-[0.9375rem] text-[var(--s-muted)] sm:py-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-8">
        <p>
          <span className="text-[var(--s-fg)]">© 2026 {profile.name}</span>
          <span aria-hidden="true"> · </span>
          <span className="sr-only">, </span>
          {profile.location}
        </p>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-data lg:justify-center">
          <span>GET /api/health</span>
          <span className="inline-flex items-center gap-2 text-[var(--s-fg)]">
            {'{"status":"ok"}'}
            <Lamp color="var(--s-infra)" />
          </span>
        </p>

        <div className="lg:justify-self-end">
          <BackToTop className="text-[var(--s-fg)] transition-colors duration-200 hover:text-[var(--s-signal)]" />
        </div>
      </div>
    </footer>
  );
}
