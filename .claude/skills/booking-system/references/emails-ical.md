# Emails + .ics generation

Install: `npm install resend ics`

## `lib/ical.ts`

Two uses: (1) a single-event `.ics` attached to the confirmation email, (2) a full-calendar feed for `/api/calendar.ics`.

```ts
import { createEvent, createEvents, type EventAttributes } from "ics";

function toEvent(b: any): EventAttributes {
  const [y, m, d] = String(b.event_date).split("-").map(Number);
  // crude time parse "2:00 PM" → [h, min]; default 12:00 if absent
  let h = 12, min = 0;
  if (b.event_time) {
    const mt = /(\d+):(\d+)\s*(AM|PM)?/i.exec(b.event_time);
    if (mt) { h = Number(mt[1]) % 12 + (/pm/i.test(mt[3] || "") ? 12 : 0); min = Number(mt[2]); }
  }
  return {
    title: `${b.service} — ${b.name}`,
    start: [y, m, d, h, min],
    duration: { hours: Number(b.hours || 1) },
    description: `${b.service}\n${b.name} · ${b.email} · ${b.phone || ""}\n${b.message || ""}`,
    location: b.location || "",
    status: "CONFIRMED",
  };
}

export function buildEvent(b: any): string {
  const { value } = createEvent(toEvent(b));
  return value || "";
}

export function buildCalendar(rows: any[]): string {
  const { value } = createEvents(rows.map(toEvent));
  return value || "BEGIN:VCALENDAR\nVERSION:2.0\nEND:VCALENDAR";
}
```

## `lib/email.ts`

Resend, lazy-init. Sends to client **and** owner, with the `.ics` attached.

```ts
import { Resend } from "resend";
import { buildEvent } from "@/lib/ical";

let _resend: Resend | null = null;
function getResend() {
  if (_resend) return _resend;
  _resend = new Resend(process.env.RESEND_API_KEY!);
  return _resend;
}

export async function sendBookingEmails(b: any) {
  const resend = getResend();
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const owner = process.env.RESEND_TO_EMAIL!;
  const ics = buildEvent(b);
  const attachments = [{ filename: "booking.ics", content: Buffer.from(ics).toString("base64") }];

  // Client confirmation
  await resend.emails.send({
    from, to: b.email, attachments,
    subject: `Booking confirmed — ${b.service} on ${b.event_date}`,
    html: `<h2>You're booked.</h2><p>${b.service} on <strong>${b.event_date} ${b.event_time || ""}</strong>.</p>
           <p>Add it to your calendar with the attached file. See you then.</p>`,
  });

  // Owner notification
  await resend.emails.send({
    from, to: owner, attachments,
    subject: `New booking — ${b.name}, ${b.event_date}`,
    html: `<h2>New booking</h2>
           <p><strong>${b.service}</strong> — ${b.event_date} ${b.event_time || ""}</p>
           <p>${b.name} · ${b.email} · ${b.phone || ""}</p>
           <p>${b.location || ""}</p><p>${b.message || ""}</p>`,
  });
}
```

## Notes

- **Sender:** until the site's domain is verified in Resend, use `onboarding@resend.dev` as `RESEND_FROM_EMAIL`. Once verified (DNS records added), switch to `bookings@thesite.com` and update both `RESEND_FROM_EMAIL` and the env var in Vercel.
- **Never let an email error fail the webhook** — the payment already succeeded and the row is saved. Wrap the send in try/catch in the webhook (already done in `api-routes.md`).
- Base64-encode `.ics` content for Resend attachments.
