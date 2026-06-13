// ─────────────────────────────────────────────
// BOOKING CONFIG
//
// Option A (Calendly): swap in your real Calendly URLs below.
// Option B (no Calendly): the BookingClient falls back to the
//   inline form which posts to /api/booking-inquiry.
//
// Set USE_CALENDLY = true once you have your Calendly account set up.
// ─────────────────────────────────────────────

export const USE_CALENDLY = false; // ← flip to true once you have Calendly

export const BOOKING = {
  free: {
    label: "Free 15-Min Discovery Call",
    url: "https://calendly.com/YOUR_HANDLE/15min", // ← replace when ready
  },
  paid: {
    label: "$250/hr Strategy Consultation",
    url: "https://calendly.com/YOUR_HANDLE/strategy", // ← replace when ready
  },
};
