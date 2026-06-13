"use client";
import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef   = useRef<HTMLDivElement>(null);
  const ringRef  = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot   = dotRef.current!;
    const ring  = ringRef.current!;
    const label = labelRef.current!;

    dot.style.opacity  = "1";
    ring.style.opacity = "1";

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
    };

    function tick() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.transform  = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
      label.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
      animId = requestAnimationFrame(tick);
    }
    tick();

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a,button,[data-cursor]");
      if (!el) return;
      const txt = el.getAttribute("data-cursor");
      if (txt) {
        label.querySelector("span")!.textContent = txt;
        label.style.opacity = "1";
        ring.style.opacity  = "0";
        dot.style.opacity   = "0";
      } else {
        ring.style.width  = "56px";
        ring.style.height = "56px";
        ring.style.borderColor = "#C9A84C";
        ring.style.backgroundColor = "rgba(201,168,76,0.06)";
        dot.style.width  = "3px";
        dot.style.height = "3px";
      }
    };

    const onOut = () => {
      ring.style.width  = "30px";
      ring.style.height = "30px";
      ring.style.borderColor = "rgba(201,168,76,0.45)";
      ring.style.backgroundColor = "transparent";
      dot.style.width  = "6px";
      dot.style.height = "6px";
      dot.style.opacity   = "1";
      ring.style.opacity  = "1";
      label.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-gold"
        style={{ width:6, height:6, opacity:0, transition:"width .2s,height .2s,opacity .2s", willChange:"transform" }} />

      <div ref={ringRef} className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border"
        style={{ width:30, height:30, opacity:0, borderColor:"rgba(201,168,76,0.45)",
          transition:"width .3s ease,height .3s ease,border-color .3s,background-color .3s,opacity .3s",
          willChange:"transform" }} />

      <div ref={labelRef} className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-gold flex items-center justify-center"
        style={{ width:72, height:72, opacity:0, transition:"opacity .2s", willChange:"transform" }}>
        <span className="font-sans text-[9px] text-ink tracking-widest uppercase font-semibold text-center leading-tight px-1" />
      </div>
    </>
  );
}
