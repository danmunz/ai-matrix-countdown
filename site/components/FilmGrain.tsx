"use client";
import { useRef, useEffect } from "react";

interface FilmGrainProps {
  className?: string;
  blendMode?: string;
  opacity?: number;
}

export function FilmGrain({
  className,
  blendMode = "overlay",
  opacity = 0.55,
}: FilmGrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 220;
    const h = 24;
    canvas.width = w;
    canvas.height = h;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function draw() {
      const imageData = ctx!.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const gray = Math.floor(Math.random() * 256);
        const alpha = 55 + Math.floor(Math.random() * 26);
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
        data[i + 3] = alpha;
      }
      ctx!.putImageData(imageData, 0, 0);
    }

    draw();

    if (!reduced) {
      const interval = setInterval(draw, 90);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        imageRendering: "pixelated",
        pointerEvents: "none",
        mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
        opacity,
      }}
    />
  );
}
