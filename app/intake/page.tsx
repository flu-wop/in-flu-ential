import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText, Cta } from "@/components/studio/Studio";
import IntakeForm from "@/components/intake/IntakeForm";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isProductId } from "@/lib/products";
import { INTAKE_PRODUCTS } from "@/lib/intake";

export const metadata: Metadata = { title: "Project Intake | IN-FLU-ENTIAL LLC", robots: { index: false } };
export const dynamic = "force-dynamic";

// Only reachable with a paid deposit's Stripe session, checked on the server.
export default async function IntakePage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id = "" } = await searchParams;
  const stripe = getStripe();
  let ok = false;
  let pkg: "website" | "social" = "website";
  let packageName = "";
  let prefill = { name: "", email: "", phone: "" };
  if (stripe && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      const id = s.metadata?.product;
      if (s.payment_status === "paid" && isProductId(id) && (INTAKE_PRODUCTS as readonly string[]).includes(id)) {
        ok = true;
        pkg = id === "social-deposit" ? "social" : "website";
        packageName = PRODUCTS[id].name.replace(" — 50% Deposit", "");
        prefill = { name: s.customer_details?.name ?? "", email: s.customer_details?.email ?? "", phone: s.customer_details?.phone ?? "" };
      }
    } catch {
      ok = false;
    }
  }

  if (!ok) {
    return (
      <StudioPage>
        <ChannelHeader channel="Project Intake" title="This Link Isn't Valid" lede="The intake form opens from your deposit confirmation. If you've paid and landed here, email flu.wop@gmail.com and I'll send it over." />
        <Panel title="Next Step">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Cta href="/business" solid>See Packages</Cta>
            <Cta href="/booking">Send an Inquiry</Cta>
          </div>
        </Panel>
      </StudioPage>
    );
  }

  return (
    <StudioPage>
      <ChannelHeader
        channel={`Project Intake · ${packageName}`}
        title={<>Tell Me About the <em>Project</em></>}
        lede="Your deposit is in. These answers let me start building without a long back-and-forth. Skip anything you're unsure of; we'll cover it on the kickoff call."
      />
      <Panel title="Input · Intake" meta="* Required">
        <PanelText>Please don&apos;t send passwords here. We&apos;ll set up access to your accounts together.</PanelText>
        <IntakeForm sessionId={session_id} pkg={pkg} prefill={prefill} />
      </Panel>
    </StudioPage>
  );
}
