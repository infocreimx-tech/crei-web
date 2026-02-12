 "use client";
import { useEffect, useRef } from "react";

export default function StarfallOverlay() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    try {
      const shown = localStorage.getItem("starfallShown");
      if (shown) return;
      localStorage.setItem("starfallShown", "1");
    } catch {}
    containerRef.current.style.display = "block";

    const count = 60;
    for (let i = 0; i < count; i++) {
      const star = document.createElement("span");
      star.className = "starfall-star";
      const left = Math.random() * 100;
      const size = 1.5 + Math.random() * 2.5;
      const duration = 2 + Math.random() * 2;
      const delay = Math.random() * 0.8;
      const opacity = 0.6 + Math.random() * 0.4;
      star.style.left = `${left}vw`;
      star.style.top = `-5vh`;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = `${opacity}`;
      star.style.animationDuration = `${duration}s`;
      star.style.animationDelay = `${delay}s`;
      containerRef.current.appendChild(star);
    }

    const t = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
        containerRef.current.style.display = "none";
      }
    }, 3200);

    return () => clearTimeout(t);
  }, []);

  return <div ref={containerRef} className="starfall-overlay" />;
}
