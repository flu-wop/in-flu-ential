import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText, Rows, Cta } from "@/components/studio/Studio";
import { getStripe } from "@/lib/stripe";
import { PRODUCTS, isProductId } from "@/lib/products";

export const metadata: Metadata = { title: "Payment | IN-FLU-ENTIAL LLC", robots: { index: false } };
export const dynamic = "force-dynamic";

// Stripe returns here after embedded checkout. Status is read from Stripe on
// the server, never trusted from the URL.
export default async function CheckoutComplete({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const stripe = getStripe();
  let paid = false;
  let product = "";
  let email = "";
  let isKit = false;
  if (stripe && session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      paid = session.payment_status === "paid";
      const id = session.metadata?.product;
      product = isProductId(id) ? PRODUCTS[id].name : "";
      isKit = id === "starter-kit";
      email = session.customer_details?.email ?? "";
    } catch {
      paid = false;
    }
  }

  return (
    <StudioPage>
      <ChannelHeader
        channel="Checkout"
        title={paid ? <>Payment <em>Received</em></> : "Payment Not Completed"}
        lede={
          paid
            ? isKit
              ? "Thank you. Your kit is ready to download below. Bookmark this page to download it again."
              : "Thank you. Next, fill out the short intake form so I can start preparing before our kickoff call."
            : "Nothing was charged. You can try again, or send an inquiry and we'll sort it out together."
        }
      />
      {paid ? (
        <Panel title="Receipt">
          <Rows
            rows={[
              ["Package", product || "Deposit"],
              ["Receipt sent to", email || "your email"],
            ]}
          />
          {!isKit && (
            <div>
              <Cta href={`/intake?session_id=${session_id}`} solid>
                Fill Out the Intake Form
              </Cta>
            </div>
          )}
          {isKit &&
            (process.env.KIT_DOWNLOAD_URL ? (
              <div>
                <Cta href={`/api/kit?session_id=${session_id}`} solid>
                  Download the Kit
                </Cta>
              </div>
            ) : (
              <PanelText>Your download link will be emailed to you within one business day.</PanelText>
            ))}
          <PanelText>Stripe has emailed your receipt. Reply to it or email flu.wop@gmail.com with anything you want me to know before we talk.</PanelText>
        </Panel>
      ) : (
        <Panel title="Next Step">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Cta href="/business" solid>Back to Packages</Cta>
            <Cta href="/booking">Send an Inquiry</Cta>
          </div>
        </Panel>
      )}
    </StudioPage>
  );
}
