"use client";
import { useEffect, useCallback } from "react";
import Link from "next/link";
import { useScramble } from "@/hooks/useScramble";
import styles from "./ChannelsOverlay.module.css";

const DESTINATIONS = [
  { ordinal: "01", title: "Begin at today", href: "/", meta: "" },
  {
    ordinal: "02",
    title: "The timeline",
    href: "/timeline",
    meta: "read ≡ or map ▦",
  },
  {
    ordinal: "03",
    title: "The five seeds",
    href: "/seeds",
    meta: "five threads · one ending",
  },
  {
    ordinal: "04",
    title: "About",
    href: "/about",
    meta: "the footnotes are not fiction",
  },
];

interface ChannelsOverlayProps {
  daysLeft: number;
  onClose: () => void;
}

export function ChannelsOverlay({ daysLeft, onClose }: ChannelsOverlayProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const now = new Date();
  const dateStr = now
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        {DESTINATIONS.map((dest, i) => (
          <DestRow
            key={dest.ordinal}
            {...dest}
            daysLeft={daysLeft}
            index={i}
            onClose={onClose}
          />
        ))}
        <div className={styles.footer}>
          <span>ESC OR ✕ TO CLOSE · CARRIER LOCKED · {dateStr}</span>
          <span>THE NUMBER ONLY GOES DOWN</span>
        </div>
      </div>
      <div className={styles.frescoStrip}>
        <div className={styles.yellowStripe} />
      </div>
    </div>
  );
}

interface DestRowProps {
  ordinal: string;
  title: string;
  href: string;
  meta: string;
  daysLeft: number;
  index: number;
  onClose: () => void;
}

function DestRow({
  ordinal,
  title,
  href,
  meta,
  daysLeft,
  index,
  onClose,
}: DestRowProps) {
  const displayMeta = index === 0 ? `day −${daysLeft}` : meta;

  const { display } = useScramble({
    text: title.toUpperCase(),
    charsPerFrame: 4,
    frameInterval: 30,
    autoStart: true,
  });

  return (
    <Link
      href={href}
      className={styles.row}
      onClick={onClose}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <span className={styles.ordinal}>{ordinal}</span>
      <div className={styles.titleWrap}>
        <div className={styles.title}>{display}</div>
        <div className={`${styles.meta} ${index === 0 ? styles.active : ""}`}>
          {displayMeta}
        </div>
      </div>
    </Link>
  );
}
