"use client";

import { useEffect, useState, type RefObject } from "react";

export function useSectionVisible(
  ref: RefObject<HTMLElement | null>,
  rootMargin = "50% 0px 50% 0px"
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return isVisible;
}
