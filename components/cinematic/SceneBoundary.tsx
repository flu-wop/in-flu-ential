"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

// Wraps any Three.js scene. If WebGL throws, the page survives —
// we just render nothing (or a quiet fallback) in place of the canvas.
export default class SceneBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Swallow — a failed 3D scene should never take down the page
    if (typeof console !== "undefined") {
      console.warn("3D scene failed, continuing without it:", error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
