"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

// Wraps any Three.js scene. If WebGL throws, the page survives —
// we just render nothing (or a quiet fallback) in place of the canvas.
export default class SceneBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown) {
    // Swallow — a failed 3D scene should never take down the page
    if (typeof console !== "undefined") {
      console.warn("3D scene failed, continuing without it:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      // Default: show the actual error so we can diagnose from a screenshot
      return (
        <div className="w-full min-h-[40vh] flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
          <p
            className="text-[10px] tracking-[0.4em] text-[#D4AF77]/50 uppercase"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            3D scene error
          </p>
          <p
            className="text-[#A89880]/70 text-xs max-w-md break-words"
            style={{ fontFamily: "DM Mono, monospace" }}
          >
            {this.state.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
