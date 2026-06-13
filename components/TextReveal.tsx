"use client";
import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  delay?: number;  // stagger start delay in seconds
  split?: "words" | "lines" | "chars";
}

export default function TextReveal({
  children,
  className = "",
  as: Tag = "div",
  delay = 0,
  split = "words",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    let cleanup: (() => void) | undefined;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const el = ref.current!;
      const text = el.innerText;

      // Split into units
      const units = split === "chars"
        ? text.split("")
        : split === "words"
        ? text.split(" ")
        : [text];

      // Wrap each unit in a clip container
      el.innerHTML = units
        .map((u, i) => {
          const sep = split === "words" && i < units.length - 1 ? "&nbsp;" : "";
          return `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;">` +
                 `<span class="reveal-inner" style="display:inline-block;transform:translateY(110%)">${u}${sep}</span>` +
                 `</span>`;
        })
        .join(split === "lines" ? "<br/>" : "");

      const inners = el.querySelectorAll(".reveal-inner");

      const ctx = gsap.context(() => {
        gsap.to(inners, {
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: split === "chars" ? 0.03 : split === "words" ? 0.06 : 0.12,
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      }, el);

      cleanup = () => ctx.revert();
    }

    init();
    return () => cleanup?.();
  }, [delay, split]);

  // @ts-expect-error dynamic tag
  return <Tag ref={ref} className={className}>{children}</Tag>;
}
