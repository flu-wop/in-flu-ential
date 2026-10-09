import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText } from "@/components/studio/Studio";

export const metadata: Metadata = { title: "Privacy Policy | IN-FLU-ENTIAL LLC" };

const SECTIONS: [string, string][] = [
  ["Information we collect", "We collect what you choose to send through the inquiry form: your name, email address, and any project details you share."],
  ["How we use it", "Only to reply to your inquiry, schedule and deliver work you've asked for, and keep records of that work. We don't sell or share your information for marketing."],
  ["Payments", "Deposits and purchases are processed by Stripe on this site. Your card details go directly to Stripe and are never stored by us. We receive your name, email, phone number and billing details for the receipt and to contact you about your project."],
  ["Services we use", "Payments go through Stripe, inquiries are delivered by email through Resend, and the site is hosted on Vercel. Each provider has its own privacy policy and data practices."],
  ["Cookies", "The site sets one cookie, and only if you unlock the private vault, so you stay signed in for that visit. There are no advertising or tracking cookies. The homepage console plays audio in your browser and sends nothing back."],
  ["Data retention", "We keep inquiry details only as long as needed to respond and do the work, or as required by law."],
  ["Your rights", "You can ask to see, correct or delete your information at any time by emailing flu.wop@gmail.com."],
  ["Contact", "IN-FLU-ENTIAL LLC · New Orleans, LA · flu.wop@gmail.com"],
];

export default function PrivacyPage() {
  return (
    <StudioPage>
      <ChannelHeader channel="Legal" title="Privacy policy" lede="Last updated October 2026." />
      {SECTIONS.map(([title, body]) => (
        <Panel key={title} title={title}>
          <PanelText>{body}</PanelText>
        </Panel>
      ))}
    </StudioPage>
  );
}
