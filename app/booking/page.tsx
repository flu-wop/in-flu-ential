import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel } from "@/components/studio/Studio";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Start a Project | IN-FLU-ENTIAL LLC",
  description: "Tell IN-FLU-ENTIAL LLC what you're building. Every inquiry gets a personal reply within one business day.",
};

export default function BookingPage() {
  return (
    <StudioPage>
      <ChannelHeader
        channel="Channel 04 · Book"
        title={
          <>
            Start a <em>project</em>
          </>
        }
        lede="Tell me what you're working on. Every inquiry gets a personal reply within one business day."
        meta={[
          ["Reply", "1 business day"],
          ["From", "A human"],
          ["Email", "flu.wop@gmail.com"],
        ]}
      />
      <Panel title="Input · Inquiry" meta="* Required">
        <BookingForm />
      </Panel>
    </StudioPage>
  );
}
