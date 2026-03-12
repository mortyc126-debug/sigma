"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 24;
const LERP = 0.32;

export function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -SIZE * 2, y: -SIZE * 2 });
  const [mounted, setMounted] = useState(false);
  const target = useRef({ x: -SIZE * 2, y: -SIZE * 2 });
  const raf = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    const animate = () => {
      setPos((prev) => ({
        x: prev.x + (target.current.x - prev.x) * LERP,
        y: prev.y + (target.current.y - prev.y) * LERP,
      }));
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden
    >
      <div
        className="absolute left-0 top-0"
        style={{
          left: pos.x,
          top: pos.y,
          width: SIZE * 3,
          height: SIZE * 3,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Внешний ореол — пульс */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full animate-spotlight-dynamic"
          style={{
            width: SIZE * 2.4,
            height: SIZE * 2.4,
            background: `radial-gradient(
              circle,
              transparent 0%,
              rgba(255, 248, 235, 0.04) 40%,
              rgba(252, 240, 200, 0.08) 55%,
              transparent 75%
            )`,
          }}
        />
        {/* Основное пятно — пульс */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full animate-spotlight-dynamic"
          style={{
            width: SIZE * 1.6,
            height: SIZE * 1.6,
            background: `radial-gradient(
              circle at center,
              rgba(255, 250, 240, 0.4) 0%,
              rgba(255, 245, 220, 0.2) 25%,
              rgba(255, 240, 200, 0.1) 45%,
              transparent 70%
            )`,
            boxShadow: `
              0 0 ${SIZE}px ${SIZE * 0.6}px rgba(255, 248, 235, 0.15),
              0 0 ${SIZE * 1.5}px ${SIZE}px rgba(252, 235, 180, 0.08),
              inset 0 0 ${SIZE * 0.5}px rgba(255, 252, 240, 0.2)
            `,
          }}
        />
        {/* Ядро — пульс */}
        <div
          className="absolute left-1/2 top-1/2 rounded-full animate-spotlight-core"
          style={{
            width: SIZE,
            height: SIZE,
            background: `radial-gradient(
              circle at center,
              rgba(255, 255, 255, 0.55) 0%,
              rgba(255, 248, 230, 0.3) 35%,
              rgba(255, 240, 210, 0.1) 60%,
              transparent 100%
            )`,
            boxShadow: `
              inset 0 0 ${SIZE * 0.4}px rgba(255, 255, 255, 0.25),
              0 0 ${SIZE * 0.5}px rgba(255, 248, 235, 0.3)
            `,
          }}
        />
      </div>
    </div>
  );
}
