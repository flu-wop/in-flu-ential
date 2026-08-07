// Stand-in for a real photo until James drops the actual image in. Renders
// as an intentional-looking styled block (never a broken <img>) so the site
// looks finished in the meantime. Swap for a real <Image> once photos land
// in /public/images.
export function PhotoSlot({
  label,
  aspect = "aspect-[4/3]",
  className = "",
}: {
  label: string;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex ${aspect} items-end overflow-hidden rounded-2xl border border-dashed border-gold/25 bg-gradient-to-br from-charcoal via-dark to-palm/20 ${className}`}
    >
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_30%_20%,rgba(212,175,119,0.15),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(31,77,46,0.35),transparent_55%)]" />
      <div className="relative z-10 flex w-full items-center justify-between gap-3 p-4">
        <span className="font-mono text-[11px] uppercase tracking-wider text-mist">
          Photo needed: {label}
        </span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-mist/60"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10.5" r="1.75" />
          <path d="M3 16.5l5-4.5 4 3.5 3-2.5 6 5" />
        </svg>
      </div>
    </div>
  );
}
