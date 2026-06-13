import type { Metadata } from "next";
import BookingClient from "@/components/BookingClient";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Book a free 15-minute discovery call or a $500/hr strategy consultation with IN-FLU-ENTIAL LLC.",
};

export default function BookingPage() {
  return <BookingClient />;
}
