// UI vignette: a miniature of what a real Meal Prep order looks like, so the
// cross-promo reads as a real working service instead of a text link.
export function MealPrepVignette() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-border bg-dark/80 p-5 font-mono text-xs shadow-lg shadow-black/30">
      <div className="mb-3 flex items-center justify-between">
        <span className="uppercase tracking-widest text-turmeric">italmealprep.com</span>
        <span className="rounded-full bg-palm/30 px-2 py-0.5 text-[10px] text-[#8FD9A8]">Confirmed</span>
      </div>
      <p className="font-body text-sm text-cream">5-Day Ital Reset</p>
      <div className="mt-3 space-y-1.5 text-mist">
        <p>Pickup — Wed, 12:00 PM</p>
        <p>Location — St. Claude Ave</p>
        <p>Includes — 5 entrées, 2 sides/day</p>
      </div>
    </div>
  );
}
