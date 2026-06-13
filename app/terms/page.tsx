import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <section className="pt-40 pb-32 max-w-3xl mx-auto px-6 md:px-10">
      <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6">Legal</p>
      <h1 className="font-display text-5xl text-cream font-light mb-4">Terms of Service</h1>
      <p className="font-sans text-xs text-mist mb-12">Last updated: January 2025</p>
      <div className="space-y-8 font-sans text-sm text-mist leading-relaxed">
        {[
          ["Acceptance", "By accessing this website or engaging IN-FLU-ENTIAL LLC for services, you agree to these terms."],
          ["Services", "IN-FLU-ENTIAL LLC provides creative direction, brand strategy, music production consultation, and related services as agreed in individual client engagements. Scope, deliverables, and timelines are defined per project."],
          ["Payment", "Consultation sessions are billed at $500/hour and are due prior to or at the time of the session. Project-based work requires a deposit before commencement. All fees are non-refundable unless otherwise agreed in writing."],
          ["Intellectual Property", "Upon receipt of full payment, clients receive ownership of final deliverables as specified in their engagement agreement. IN-FLU-ENTIAL LLC retains the right to display completed work in its portfolio unless otherwise agreed."],
          ["Confidentiality", "We treat all client information as confidential. We will not disclose your project details, business information, or strategies to third parties without your explicit consent."],
          ["Limitation of Liability", "IN-FLU-ENTIAL LLC is not liable for indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the fees paid for the specific engagement."],
          ["Governing Law", "These terms are governed by the laws of the State of Louisiana, United States."],
          ["Contact", "Questions? Reach us at hello@influential.llc"],
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
