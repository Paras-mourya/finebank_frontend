"use client";

import { useEffect, useState } from "react";

export default function SmoothCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trail, setTrail] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const loop = () => {
      setTrail((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.15,
        y: prev.y + (position.y - prev.y) * 0.15,
      }));
      requestAnimationFrame(loop);
    };
    loop();
  }, [position]);

  return (
    <>
      {/* Hide default cursor */}
      <style>{`body { cursor: none; }`}</style>

      {/* Smooth custom cursor */}
      <div
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: "2px solid #22c55e", // green
          transform: `translate(${trail.x - 10}px, ${trail.y - 10}px)`,
          pointerEvents: "none",
          zIndex: 9999,
          transition: "background 0.2s",
        }}
      />
    </>
  );
}
