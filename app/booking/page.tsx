import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel } from "@/components/studio/Studio";
import BookingForm from "@/components/booking/BookingForm";
import { IMAGES } from "@/lib/images";
import k from "@/components/studio/studio.module.css";

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
            Start a <em>Project</em>
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
        <div className={k.portraitRow}>
          <figure className={`${k.portrait} ${IMAGES.bookingPortrait ? "" : k.photoEmpty}`}>
            {IMAGES.bookingPortrait ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={IMAGES.bookingPortrait} alt="James Afflu" />
            ) : (
              <span>Portrait</span>
            )}
          </figure>
          <div className={k.portraitForm}>
            <BookingForm />
          </div>
        </div>
      </Panel>
    </StudioPage>
  );
}
