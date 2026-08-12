"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { type ProcessedEntry } from "@/lib/types";
import { FilmGrain } from "./FilmGrain";
import styles from "./Scrubber.module.css";

interface ScrubberProps {
  entries: ProcessedEntry[];
  currentIndex: number;
  onCommit: (index: number) => void;
}

function tickX(i: number, total: number): number {
  return 2 + Math.pow(i / (total - 1), 1.15) * 96;
}

function nearestEntry(
  pct: number,
  entries: ProcessedEntry[]
): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < entries.length; i++) {
    const dist = Math.abs(tickX(i, entries.length) - pct);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

function ordinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function Scrubber({ entries, currentIndex, onCommit }: ScrubberProps) {
  const [idx, setIdx] = useState(currentIndex);
  const [dragging, setDragging] = useState(false);
  const [frac, setFrac] = useState<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startPctRef = useRef(0);

  useEffect(() => {
    setIdx(currentIndex);
  }, [currentIndex]);

  const handlePct = frac ?? tickX(idx, entries.length);
  const displayEntry = entries[idx];

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startXRef.current = e.clientX;
      startPctRef.current = handlePct;
      setDragging(true);
    },
    [handlePct]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const deltaPx = e.clientX - startXRef.current;
      const deltaPct = (deltaPx / rect.width) * 100;
      const newPct = Math.max(0, Math.min(100, startPctRef.current + deltaPct));
      setFrac(newPct);
      setIdx(nearestEntry(newPct, entries));
    },
    [dragging, entries]
  );

  const onPointerUp = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    setFrac(null);
    onCommit(idx);
  }, [dragging, idx, onCommit]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const next =
          e.key === "ArrowLeft"
            ? Math.max(0, idx - 1)
            : Math.min(entries.length - 1, idx + 1);
        setIdx(next);
        setFrac(null);
        onCommit(next);
      }
    },
    [idx, entries.length, onCommit]
  );

  const partCounts: Record<string, { firstIdx: number }> = {};
  entries.forEach((e, i) => {
    if (!partCounts[e.part]) partCounts[e.part] = { firstIdx: i };
  });

  return (
    <div className={styles.scrubber}>
      <div className={styles.statusLine}>
        <span>GRAB AND DRAG · ◄ ► STEPS ONE ENTRY</span>
        <span>
          {displayEntry
            ? `${ordinalSuffix(idx + 1)} · ${displayEntry.partLabel.split(" · ")[0]} · ${displayEntry.formattedDate}`
            : ""}
        </span>
      </div>
      <div
        ref={trackRef}
        className={`${styles.trackArea} ${dragging ? styles.dragging : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={entries.length - 1}
        aria-valuenow={idx}
        aria-label="Timeline scrubber"
      >
        <div className={styles.track}>
          <div
            className={styles.trackFill}
            style={{ width: `${handlePct}%` }}
          />
        </div>

        {/* Ticks */}
        <div className={styles.ticks}>
          {entries.map((entry, i) => {
            const x = tickX(i, entries.length);
            const isMajor = i % 6 === 0 || i === entries.length - 1;
            const isDayZero = entry.dayNumber === 0;
            const nearDist = Math.abs(x - handlePct);
            const near = Math.max(0, 1 - nearDist / 7);
            const baseH = isMajor ? 13 : 7;
            const h = baseH + near * (isMajor ? 9 : 15);
            const opacity = 0.22 + near * 0.6;

            return (
              <div
                key={i}
                className={`${styles.tick} ${isMajor ? styles.major : styles.minor} ${isDayZero ? styles.dayZero : ""}`}
                style={{
                  left: `${Math.round(x * 1000) / 1000}%`,
                  height: `${Math.round(h * 100) / 100}px`,
                  opacity: Math.round(opacity * 1000) / 1000,
                }}
              />
            );
          })}
        </div>

        {/* Handle assembly */}
        <div
          className={`${styles.handleAssembly} ${!dragging ? styles.animate : ""}`}
          style={{ left: `${handlePct}%` }}
        >
          <div
            className={`${styles.readoutPlate} ${dragging ? styles.scaled : ""}`}
          >
            <FilmGrain opacity={0.55} />
            <span style={{ position: "relative", zIndex: 1 }}>
              {displayEntry
                ? displayEntry.dayNumber === 0
                  ? "0"
                  : `−${Math.abs(displayEntry.dayNumber)}`
                : ""}
            </span>
          </div>
          <div className={styles.pointer} />
          <div className={styles.stem} />
          <div
            className={`${styles.bearing} ${dragging ? styles.scaled : ""} ${hovering && !dragging ? styles.hover : ""}`}
          >
            <div className={styles.bearingRing}>
              <div className={styles.bearingCenter} />
            </div>
          </div>
        </div>

        {/* Ripple rings while dragging */}
        {dragging && (
          <div
            className={styles.rippleContainer}
            style={{ left: `${handlePct}%` }}
          >
            <div className={`${styles.rippleRing} ${styles.active}`} />
            <div
              className={`${styles.rippleRing} ${styles.active} ${styles.delayed}`}
            />
          </div>
        )}

        {/* Part labels */}
        <div className={styles.partLabels}>
          <span className={styles.partLabel} style={{ left: "2%" }}>
            TODAY
          </span>
          {Object.entries(partCounts).map(([part, { firstIdx }]) => (
            <span
              key={part}
              className={styles.partLabel}
              style={{ left: `${tickX(firstIdx, entries.length)}%` }}
            >
              PART {part}
            </span>
          ))}
          <span
            className={`${styles.partLabel} ${styles.dayZeroLabel}`}
            style={{ left: "98%", textAlign: "right" }}
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
}
