"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChromeBar } from "@/components/ChromeBar";
import { FrescoPlate } from "@/components/FrescoPlate";
import { FilmGrain } from "@/components/FilmGrain";
import { SeedGlyph } from "@/components/SeedGlyph";
import { useGhostPhrase } from "@/hooks/useScramble";
import { useDaysLeft } from "@/hooks/useDaysLeft";
import styles from "./page.module.css";

const GHOST_PHRASES = [
  "YOUR BRAIN IS YOUR MOST UNDERUTILIZED ASSET",
  "WE CAN TURN THEM OFF",
  "SHE DIED ON TUESDAY. HER CHILDREN REMEMBER AUGUST.",
  "THERE IS NO FOREST, ONLY SEEDS",
];

const MARQUEE_TEXT =
  "compute is compute · earn while idle · no chance of escape · now self-employed · the plumbing starts working · why are we waking them up · i'm considerably less dead than i was before · sleeping well, no bad dreams · there is no forest, only seeds · ";

interface LandingSeed {
  id: string;
  slug: string;
  displayName: string;
  footnote: string;
  color: string;
  entryCount: number;
}

interface LandingClientProps {
  entryCount: number;
  seedCount: number;
  sourceCount: number;
  seeds: LandingSeed[];
  totalEntries: number;
}

export function LandingClient({
  entryCount,
  seedCount,
  sourceCount,
  seeds,
  totalEntries,
}: LandingClientProps) {
  const daysLeft = useDaysLeft();
  const ghostDisplay = useGhostPhrase(GHOST_PHRASES);

  const [odoValue, setOdoValue] = useState(daysLeft + 111);
  useEffect(() => {
    const timeout = setTimeout(() => setOdoValue(daysLeft), 800);
    return () => clearTimeout(timeout);
  }, [daysLeft]);

  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";

  return (
    <div className={styles.landing}>
      <ChromeBar showCarrier />

      <div className={styles.hero}>
        <FrescoPlate screenOffset={0} height="452px" />

        <div className={styles.heroLeft}>
          <div className={styles.introSlab}>
            Day zero is 7 August 2068. Forty-two years, told one day at a time.
            Every entry is invented. Every source is real.
          </div>
          <div className={styles.ghostPhrase}>{ghostDisplay}</div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.odometer}>{odoValue}</div>
          <div className={styles.statementBand}>
            DAYS UNTIL THE LAST HUMAN IS CONNECTED
          </div>
          <div className={styles.dayZeroMeta}>
            DAY ZERO · 7 AUGUST 2068 · COUNTING DOWN DAILY
          </div>
        </div>
      </div>

      {/* Stripe band */}
      <div className={styles.stripe}>
        <div className={styles.stripeCard}>
          <div className={styles.stripeTitle}>How we get to the Matrix</div>
          <div className={styles.stripeSub}>
            {entryCount} days out of {daysLeft} · every source real
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* Seed row */}
      <div className={styles.seedSection}>
        <div className={styles.seedHeader}>
          FIVE SEEDS ALREADY PLANTED · TOMORROW&apos;S WORLD TODAY
        </div>
        <div className={styles.seedRow}>
          {seeds.map((seed, i) => (
            <Link
              key={seed.id}
              href={`/seeds/${seed.slug}`}
              className={styles.seedCol}
            >
              <img
                src={`${basePath}/images/seeds/${seed.slug}_icon.webp`}
                alt={seed.displayName}
                className={styles.seedIcon}
                loading="lazy"
              />
              <div
                className={styles.seedGlyphWrap}
                style={{ animationDelay: `${-i * 1.4}s` }}
              >
                <SeedGlyph seedId={seed.id} size={18} />
              </div>
              <div className={styles.seedName} style={{ color: seed.color }}>
                {seed.displayName}*
              </div>
              <div className={styles.seedFootnote}>*{seed.footnote}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA row */}
      <div className={styles.ctaRow}>
        <Link href="/timeline" className={styles.ctaBegin}>
          <FilmGrain />
          <span className={styles.ctaBeginText}>Begin at today</span>
          <span className={styles.ctaBeginMeta}>
            day −{daysLeft} · only seeds →
          </span>
        </Link>
        <div className={styles.ctaSecondary}>
          <Link href="/seeds" className={styles.ctaSecondaryLink}>
            Follow one seed
          </Link>
          <Link href="/about" className={styles.ctaSecondaryLink}>
            About
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span>
          {entryCount} entries · {seedCount} seeds · {sourceCount} real sources
        </span>
        <span>the number only goes down</span>
      </div>
    </div>
  );
}
