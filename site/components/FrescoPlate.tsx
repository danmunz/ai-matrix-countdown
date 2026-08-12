"use client";
import { useEffect, useState } from "react";

const FRESCO_FILES = [
  "fresco_athens_halftone",
  "fresco_creation_halftone",
  "fresco_lastjudgment_halftone",
  "fresco_grotesque_halftone",
  "fresco_banquet_halftone",
  "fresco_vault_halftone",
  "fresco_gallery_halftone",
  "fresco_vatican_halftone",
];

interface FrescoPlateProps {
  screenOffset?: number;
  height?: string;
  className?: string;
  mode?: "multiply" | "screen";
  opacity?: number;
}

export function FrescoPlate({
  screenOffset = 0,
  height = "452px",
  className,
  mode = "multiply",
  opacity,
}: FrescoPlateProps) {
  const [file, setFile] = useState<string | null>(null);

  useEffect(() => {
    const key = "omFrescoIdx";
    let idx = parseInt(localStorage.getItem(key) ?? "0", 10);
    if (isNaN(idx)) idx = 0;
    idx = (idx + 1) % FRESCO_FILES.length;
    localStorage.setItem(key, String(idx));
    setFile(FRESCO_FILES[(idx + screenOffset) % FRESCO_FILES.length]);
  }, [screenOffset]);

  if (!file) return null;

  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <picture>
        <source
          srcSet={`${basePath}/images/frescoes/${file}-800.webp 800w, ${basePath}/images/frescoes/${file}-1200.webp 1200w, ${basePath}/images/frescoes/${file}.webp 2000w`}
          sizes="100vw"
          type="image/webp"
        />
        <img
          src={`${basePath}/images/frescoes/${file}.webp`}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            filter: "saturate(1.15)",
            mixBlendMode: mode,
            opacity: opacity,
          }}
        />
      </picture>
    </div>
  );
}
