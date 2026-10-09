// ── IMAGE SLOTS ─────────────────────────────────────────────────────────────
// Every photo the site is waiting on. An empty string shows a labelled
// placeholder; to go live, drop the file in /public at the path shown and set
// the constant to that path. Everything is .webp. (Existing slots, set where
// they're used: credits /public/credits/<slug>.webp square ~1000, bio
// /public/bio 4:5 1200x1500, work /public/work/<slug>.webp 960x600, OG
// /public/og-image.png 1200x630.)

export const IMAGES = {
  // Hang Glider cover art, square 1400x1400. Shown on the console's Master
  // panel, the session screen and the transport bar.
  cover: "", // "/cover/hang-glider.webp"

  // AI for Contractors lane on Business, landscape 1600x1000: a real job site.
  jobSite: "", // "/business/job-site.webp"

  // Portrait on Booking, 4:5 1200x1500.
  bookingPortrait: "", // "/bio/booking.webp"
} as const;

// Browser tab and home-screen icon: app/icon.png, 512x512. The file in the repo
// is a placeholder mark; replace it with the real one at the same path.
