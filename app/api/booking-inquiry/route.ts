import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, project, timeline, message, label } = body;

    if (!name || !email || !project || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Lazy-init Resend so build doesn't fail without env var
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    // ── Email to James ────────────────────────
    await resend.emails.send({
      from: "IN-FLU-ENTIAL LLC <onboarding@resend.dev>",
      to: "hello@influential.llc",
      subject: `New Booking Request — ${label}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #F5F0E8; padding: 40px;">
          <div style="border-bottom: 1px solid #222; padding-bottom: 20px; margin-bottom: 28px;">
            <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; margin: 0 0 8px;">IN-FLU-ENTIAL LLC</p>
            <h1 style="font-size: 22px; font-weight: 300; margin: 0; color: #F5F0E8;">New Booking Request</h1>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 11px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.1em; width: 120px;">Session</td><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; color: #C9A84C;">${label}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 11px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.1em;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; color: #F5F0E8;">${name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 11px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.1em;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px;"><a href="mailto:${email}" style="color: #C9A84C;">${email}</a></td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 11px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.1em;">Project</td><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; color: #F5F0E8;">${project}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 11px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.1em;">Timeline</td><td style="padding: 10px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px; color: #F5F0E8;">${timeline || "Not specified"}</td></tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: #141414; border-left: 2px solid #C9A84C;">
            <p style="font-size: 11px; color: #9A9A9A; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 10px;">Message</p>
            <p style="font-size: 13px; color: #F5F0E8; line-height: 1.6; margin: 0;">${message.replace(/\n/g, "<br/>")}</p>
          </div>
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #222;">
            <a href="mailto:${email}" style="display: inline-block; background: #C9A84C; color: #0A0A0A; padding: 12px 28px; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; font-weight: 600;">Reply to ${name}</a>
          </div>
        </div>
      `,
    });

    // ── Confirmation to client ────────────────
    await resend.emails.send({
      from: "IN-FLU-ENTIAL LLC <onboarding@resend.dev>",
      to: email,
      subject: `We received your request — IN-FLU-ENTIAL LLC`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0A0A0A; color: #F5F0E8; padding: 40px;">
          <p style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #C9A84C; margin: 0 0 24px;">IN-FLU-ENTIAL LLC</p>
          <h1 style="font-size: 24px; font-weight: 300; margin: 0 0 16px; color: #F5F0E8;">Got it, ${name.split(" ")[0]}.</h1>
          <p style="font-size: 14px; color: #9A9A9A; line-height: 1.7; margin: 0 0 24px;">
            Your request for a <strong style="color: #C9A84C;">${label}</strong> has been received.
            We'll be in touch within one business day to confirm your session.
          </p>
          <p style="font-size: 14px; color: #9A9A9A; line-height: 1.7; margin: 0 0 32px;">
            In the meantime, feel free to reply to this email or reach out at
            <a href="mailto:hello@influential.llc" style="color: #C9A84C;">hello@influential.llc</a>.
          </p>
          <div style="border-top: 1px solid #1a1a1a; padding-top: 24px;">
            <p style="font-size: 11px; color: #444; margin: 0;">Global Roots. Executive Vision. Creative Execution.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Booking inquiry error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
