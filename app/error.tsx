"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080808] px-6 text-center">
      <p
        className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase mb-4"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Something interrupted the experience
      </p>
      <p
        className="text-[#A89880] text-xs max-w-md mb-6 break-words"
        style={{ fontFamily: "DM Mono, monospace" }}
      >
        {error?.message || "Unknown error"}
      </p>
      <button
        onClick={reset}
        className="px-8 py-3 text-[10px] tracking-[0.4em] uppercase"
        style={{
          fontFamily: "DM Sans, sans-serif",
          border: "1px solid rgba(212,175,119,0.3)",
          color: "#D4AF77",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
