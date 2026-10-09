import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText } from "@/components/studio/Studio";

export const metadata: Metadata = { title: "Terms of Service | IN-FLU-ENTIAL LLC" };

const SECTIONS: [string, string][] = [
  ["Acceptance", "By using this website or engaging IN-FLU-ENTIAL LLC for services, you agree to these terms."],
  ["Services", "IN-FLU-ENTIAL LLC provides websites, creative direction, brand strategy, campaigns, music production consultation, AI tools and related services as agreed in each engagement. Scope, deliverables and timelines are defined per project."],
  ["Payment", "Website builds and social media marketing require a 50% deposit before work starts. The balance is due before the site goes live on your domain, or before the campaign launches. AI projects are priced in a written proposal. Deposits are non-refundable once work has started unless agreed otherwise in writing."],
  ["Revisions", "Two rounds of revisions are included in each package. A round is one set of changes sent together. Further changes or new features are quoted before work starts."],
  ["Intellectual Property", "Once paid in full, clients own the final deliverables as set out in their engagement agreement. IN-FLU-ENTIAL LLC may show completed work in its portfolio unless agreed otherwise."],
  ["Confidentiality", "Client information is treated as confidential. Project details, business information and strategies are not shared with third parties without your consent."],
  ["Limitation of Liability", "IN-FLU-ENTIAL LLC is not liable for indirect, incidental or consequential damages arising from its services. Total liability is limited to the fees paid for the specific engagement."],
  ["Governing Law", "These terms are governed by the laws of the State of Louisiana, United States."],
  ["Contact", "Questions? Email flu.wop@gmail.com."],
];

export default function TermsPage() {
  return (
    <StudioPage>
      <ChannelHeader channel="Legal" title="Terms of Service" lede="Last updated October 2026." />
      {SECTIONS.map(([title, body]) => (
        <Panel key={title} title={title}>
          <PanelText>{body}</PanelText>
        </Panel>
      ))}
    </StudioPage>
  );
}
