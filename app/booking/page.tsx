import type { Metadata } from "next";
import Link from "next/link";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book a Consultation | IN-FLU-ENTIAL LLC",
  description:
    "Schedule a strategy session with IN-FLU-ENTIAL LLC — creative direction, brand development, and music marketing rooted in New Orleans.",
};

export default function BookingPage() {
  return (
    <main className="relative min-h-screen bg-[#080808] px-6 py-20 md:py-28">
      {/* Gold top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, #D4AF77 30%, #D4AF77 70%, transparent)" }}
      />

      {/* Back link */}
      <div className="max-w-xl mx-auto mb-12">
        <Link
          href="/"
          className="text-[10px] tracking-[0.35em] text-[#A89880]/70 hover:text-[#D4AF77] uppercase transition-colors"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          ← Back home
        </Link>
      </div>

      <BookingForm />
    </main>
  );
}
