import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #090909 0%, #111111 60%, #1F4D2E 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 500,
            color: "#F5EDD8",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          I-tal&nbsp;<span style={{ color: "#E2A33B" }}>Garden</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            color: "#A89880",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
