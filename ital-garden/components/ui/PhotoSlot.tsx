// Stand-in for a real photo until the actual shot lands. Styled to read as
// an intentional editorial moment (gradient + brand line art + a small
// handwritten-style caption) rather than a broken or unfinished image, so
// the site holds together even before every photo is in.
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
      title={`Photo coming soon: ${label}`}
      className={`relative flex ${aspect} items-center justify-center overflow-hidden rounded-2xl border border-border bg-charcoal ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 25% 20%, rgba(226,163,59,0.22), transparent 55%), radial-gradient(circle at 80% 85%, rgba(31,77,46,0.55), transparent 60%), linear-gradient(155deg, #1A1A1A 0%, #111111 60%, #0F1A13 100%)",
        }}
      />
      <div className="grain-fine absolute inset-0 opacity-[0.06]" />

      <svg
        aria-hidden
        viewBox="0 0 96 96"
        className="relative z-10 h-[34%] w-[34%] max-h-16 max-w-16 text-gold/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* crossed fork + spoon, echoing the wordmark */}
        <path d="M30 10v28a6 6 0 0 0 6 6v42" />
        <path d="M24 10v14a6 6 0 0 0 6 6" />
        <path d="M36 10v14a6 6 0 0 0-6 6" />
        <path d="M66 86V44c8 0 10-8 10-16s-2-18-10-18-10 10-10 18 2 16 10 16" />
      </svg>

      <p className="absolute bottom-4 left-0 right-0 z-10 text-center font-display text-sm italic text-gold/70">
        photo coming soon
      </p>
    </div>
  );
}
