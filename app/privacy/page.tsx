import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <section className="pt-40 pb-32 max-w-3xl mx-auto px-6 md:px-10">
      <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6">Legal</p>
      <h1 className="font-display text-5xl text-cream font-light mb-4">Privacy Policy</h1>
      <p className="font-sans text-xs text-mist mb-12">Last updated: January 2025</p>
      <div className="space-y-8 font-sans text-sm text-mist leading-relaxed">
        {[
          ["Information We Collect", "We collect information you voluntarily provide when booking a consultation, submitting a contact form, or subscribing to our newsletter — including your name, email address, and any project details you share."],
          ["How We Use Your Information", "Your information is used solely to respond to inquiries, schedule consultations, deliver services you've requested, and send occasional updates if you've opted in. We do not sell or share your data with third parties for marketing purposes."],
          ["Calendly & Third-Party Tools", "Booking is handled through Calendly. Email capture may use Formspree or a similar service. These providers have their own privacy policies and data practices."],
          ["Cookies", "This site uses minimal cookies necessary for functionality. No advertising or tracking cookies are used."],
          ["Data Retention", "We retain your contact information only as long as necessary to fulfill the purposes outlined above or as required by law."],
          ["Your Rights", "You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@influential.llc."],
          ["Contact", "IN-FLU-ENTIAL LLC · New Orleans, LA · hello@influential.llc"],
        ].map(([title, body]) => (
          <div key={title as string}>
            <h2 className="font-sans text-xs text-gold tracking-widest uppercase mb-2">{title}</h2>
            <p>{body}</p>
          </div>
        ))}
      </div>
      <Link href="/" className="inline-block mt-12 font-sans text-xs text-mist hover:text-cream transition-colors tracking-widest uppercase">← Back to Home</Link>
    </section>
  );
}
