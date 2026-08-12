"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { type ProcessedEntry, type PartInfo } from "@/lib/types";
import { SEED_MAP, SEED_ORDER } from "@/lib/seeds";
import { ChromeBar } from "@/components/ChromeBar";
import { SeedGlyph } from "@/components/SeedGlyph";
import { Scrubber } from "@/components/Scrubber";
import styles from "./page.module.css";

interface Props {
  entries: ProcessedEntry[];
  parts: PartInfo[];
}

export default function TimelineClient({ entries, parts }: Props) {
  const [isMap, setIsMap] = useState(false);

  const [focusedIndex, setFocusedIndex] = useState(() => {
    const now = Date.now();
    const target = -Math.ceil(
      (Date.UTC(2068, 7, 7) - now) / 86_400_000
    );
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < entries.length; i++) {
      const dist = Math.abs(entries[i].dayNumber - target);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    return best;
  });

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToEntry = useCallback(
    (index: number) => {
      setFocusedIndex(index);
      cardRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    },
    []
  );

  const toggleView = useCallback(() => {
    setIsMap((v) => !v);
  }, []);

  const focusedEntry = entries[focusedIndex];
  const focusedPart = parts.find((p) => p.part === focusedEntry.part);
  const progressPct = ((focusedIndex + 1) / entries.length) * 100;

  if (isMap) {
    return (
      <MapView
        entries={entries}
        parts={parts}
        focusedIndex={focusedIndex}
        onToggle={toggleView}
        onSelect={setFocusedIndex}
        onScrubberCommit={(i) => {
          setFocusedIndex(i);
          setIsMap(false);
        }}
      />
    );
  }

  return (
    <div className={styles.timeline}>
      <ChromeBar breadcrumb={{ label: "← HOME", href: "/" }}>
        <div className={styles.chromeMeta}>
          <span>TIMELINE · ALL SEEDS · DEEP READ</span>
          <button className={styles.viewToggle} onClick={toggleView}>
            MAP VIEW ▦
          </button>
        </div>
      </ChromeBar>

      <div className={styles.readBody}>
        <div className={styles.rail}>
          <div className={styles.railTrack}>
            <div
              className={styles.railFill}
              style={{ height: `${progressPct}%` }}
            />
            <div
              className={styles.railDot}
              style={{ top: `${progressPct}%` }}
            />
            {focusedPart && (
              <div className={styles.railLabel}>
                PART {focusedPart.part} · {focusedPart.subtitle.toUpperCase()} ·{" "}
                {focusedPart.yearRange}
              </div>
            )}
          </div>
        </div>

        <div className={styles.entryStack}>
          {entries.map((entry, i) => {
            const distance = Math.abs(i - focusedIndex);
            const cardClass =
              distance === 0
                ? styles.entryCardFocused
                : distance <= 1
                  ? styles.entryCardNear
                  : styles.entryCardFar;

            const showGap =
              i > 0 && entry.gap !== undefined && entry.gap >= 100;

            return (
              <div key={entry.dayNumber}>
                {showGap && (
                  <div className={styles.gapMarker}>
                    <div className={styles.gapRule} />
                    <span className={styles.gapText}>
                      {entry.gap} DAYS PASS
                      {entry.gapNote ? ` · ${entry.gapNote}` : ""}
                    </span>
                    <div className={styles.gapRule} />
                  </div>
                )}
                <div
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className={`${styles.entryCard} ${cardClass}`}
                  onClick={distance > 0 ? () => scrollToEntry(i) : undefined}
                >
                  <div className={styles.entryDay}>{entry.displayDay}</div>
                  <div className={styles.entryDate}>
                    {entry.formattedDate} · {entry.partLabel}
                  </div>
                  <div className={styles.entryHeader}>
                    <div className={styles.entryTitle}>{entry.title}</div>
                    <div className={styles.seedChips}>
                      {entry.seeds.map((sid) => (
                        <div key={sid} className={styles.seedChip}>
                          <SeedGlyph
                            seedId={sid}
                            size={12}
                            color="var(--paper)"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {distance === 0 && (
                    <>
                      <div className={styles.entryBody}>
                        {entry.paragraphs.map((para, pi) => {
                          if (
                            entry.highlight &&
                            para.includes(entry.highlight)
                          ) {
                            const idx = para.indexOf(entry.highlight);
                            return (
                              <p key={pi}>
                                {para.slice(0, idx)}
                                <span className={styles.highlight}>
                                  {entry.highlight}
                                </span>
                                {para.slice(idx + entry.highlight.length)}
                              </p>
                            );
                          }
                          return <p key={pi}>{para}</p>;
                        })}
                      </div>
                      <Link
                        href={`/day/${entry.dayNumber}`}
                        className={styles.evidenceBtn}
                      >
                        EVIDENCE ▸ {entry.links.length} DOCUMENT
                        {entry.links.length !== 1 ? "S" : ""}
                      </Link>
                      <div className={styles.sourceNames}>
                        {entry.links
                          .slice(0, 3)
                          .map((l) => l.hostname)
                          .join(" · ")}
                        {entry.links.length > 3 &&
                          ` + ${entry.links.length - 3} more`}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.progressFooter}>
        <span className={styles.progressText}>
          ENTRY {focusedIndex + 1} OF {entries.length} · PART{" "}
          {focusedEntry.part} OF V · SCROLL TO ADVANCE ONE DAY
        </span>
        <div className={styles.progressBarOuter}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className={styles.scrubberDock}>
        <Scrubber
          entries={entries}
          currentIndex={focusedIndex}
          onCommit={scrollToEntry}
        />
      </div>
    </div>
  );
}

function MapView({
  entries,
  parts,
  focusedIndex,
  onToggle,
  onSelect,
  onScrubberCommit,
}: {
  entries: ProcessedEntry[];
  parts: PartInfo[];
  focusedIndex: number;
  onToggle: () => void;
  onSelect: (i: number) => void;
  onScrubberCommit: (i: number) => void;
}) {
  const partBoundaries = useMemo(() => {
    const bounds: { part: string; startCol: number; endCol: number }[] = [];
    let currentPart = entries[0]?.part;
    let startCol = 0;
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].part !== currentPart) {
        bounds.push({
          part: currentPart,
          startCol,
          endCol: i - 1,
        });
        currentPart = entries[i].part;
        startCol = i;
      }
    }
    bounds.push({
      part: currentPart,
      startCol,
      endCol: entries.length - 1,
    });
    return bounds;
  }, [entries]);

  const progressPct = ((focusedIndex + 1) / entries.length) * 100;

  return (
    <div className={styles.mapTimeline}>
      <ChromeBar breadcrumb={{ label: "← HOME", href: "/" }}>
        <div className={styles.chromeMeta} style={{ color: "rgba(237,241,242,0.5)" }}>
          <span>TIMELINE · MAP</span>
          <button
            className={styles.viewToggle}
            onClick={onToggle}
            style={{
              color: "rgba(237,241,242,0.5)",
              borderColor: "rgba(237,241,242,0.2)",
            }}
          >
            READ VIEW ≡
          </button>
        </div>
      </ChromeBar>

      <div className={styles.mapBody}>
        <div
          className={styles.punchCard}
          style={{
            gridTemplateColumns: `140px repeat(${entries.length}, 22px)`,
            gridTemplateRows: `auto repeat(${SEED_ORDER.length}, 22px) auto`,
          }}
        >
          {/* Part headers row */}
          <div />
          {entries.map((entry, i) => {
            const bound = partBoundaries.find(
              (b) => b.startCol === i
            );
            if (bound) {
              const span = bound.endCol - bound.startCol + 1;
              return (
                <div
                  key={`ph-${i}`}
                  className={styles.partHeader}
                  style={{ gridColumn: `span ${span}` }}
                >
                  PART {bound.part}
                </div>
              );
            }
            return null;
          }).filter(Boolean)}

          {/* Seed rows */}
          {SEED_ORDER.map((seedId) => {
            const seed = SEED_MAP[seedId];
            return (
              <div key={seedId} className={styles.seedRow}>
                <div
                  className={styles.seedLabel}
                  style={{ color: seed.colorDark }}
                >
                  <SeedGlyph seedId={seedId} size={10} color={seed.colorDark} />
                  {seed.displayName}
                </div>
                {entries.map((entry, ei) => {
                  const filled = entry.seeds.includes(seedId);
                  const isZero = entry.dayNumber === 0;
                  const isActive = ei === focusedIndex;
                  return (
                    <div
                      key={ei}
                      className={`${styles.cell} ${filled ? styles.cellFilled : ""} ${isZero ? styles.cellZero : ""} ${isActive ? styles.cellActive : ""}`}
                      style={filled && !isZero ? { color: seed.colorDark } : undefined}
                      onClick={() => onSelect(ei)}
                      title={`${entry.displayDay}: ${entry.title}`}
                    />
                  );
                })}
              </div>
            );
          })}

          {/* Day labels row */}
          <div />
          {entries.map((entry, i) => (
            <div key={`dl-${i}`} className={styles.dayLabel}>
              {i % 5 === 0 ? entry.year : ""}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.progressFooter} style={{ background: "rgba(237,241,242,0.08)" }}>
        <span className={styles.progressText}>
          {entries[focusedIndex].displayDay} · {entries[focusedIndex].title}
        </span>
        <div className={styles.progressBarOuter}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className={styles.scrubberDock}>
        <Scrubber
          entries={entries}
          currentIndex={focusedIndex}
          onCommit={onScrubberCommit}
        />
      </div>
    </div>
  );
}
