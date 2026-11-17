/** The page a published row renders to. Couple names come from the example slug. */
export function InvitationCard({ slug }: { slug: string }) {
  const [a, b] = slug
    .split("-and-")
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1));

  return (
    <div
      data-card
      data-theme="light"
      className="flex h-full min-h-[17rem] flex-col items-center rounded-[10px] bg-[var(--s-bg)] px-6 pt-5 pb-5 text-center text-[var(--s-body)]"
    >
      <p data-card-part className="text-[0.8125rem] text-[var(--s-muted)]">
        Example couple
      </p>
      <div className="my-auto py-5">
        <p
          data-card-part
          className="text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-[1.05] font-medium tracking-[-0.025em] text-[var(--s-fg)]"
        >
          {a}
          <span className="mx-2 font-normal text-[var(--s-frontend)]">&amp;</span>
          {b}
        </p>
        <span data-card-part aria-hidden="true" className="mx-auto mt-4 block h-px w-10 bg-[var(--s-fg)]" />
        <p data-card-part className="mt-4 text-[0.9375rem]">
          are getting married
        </p>
      </div>
      <p data-card-part className="font-mono text-[0.75rem] text-[var(--s-muted)]">
/{slug}
      </p>
    </div>
  );
}
