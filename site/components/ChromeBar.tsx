"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useDaysLeft } from "@/hooks/useDaysLeft";
import { ChannelsOverlay } from "./ChannelsOverlay";
import styles from "./ChromeBar.module.css";

interface ChromeBarProps {
  breadcrumb?: { label: string; href: string };
  showCarrier?: boolean;
  children?: React.ReactNode;
}

export function ChromeBar({
  breadcrumb,
  showCarrier = false,
  children,
}: ChromeBarProps) {
  const daysLeft = useDaysLeft();
  const [menuOpen, setMenuOpen] = useState(false);
  const [carrierDate, setCarrierDate] = useState("");

  useEffect(() => {
    setCarrierDate(
      new Date()
        .toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
        .toUpperCase()
    );
  }, []);

  return (
    <>
      <header className={styles.chrome}>
        <div className={styles.left}>
          <Link href="/" className={styles.wordmark}>
            THE COUNTDOWN
          </Link>
          {breadcrumb && (
            <Link href={breadcrumb.href} className={styles.breadcrumb}>
              {breadcrumb.label}
            </Link>
          )}
          {children}
        </div>
        <div className={styles.right}>
          {showCarrier && (
            <div className={styles.carrier}>
              <div className={styles.eqBars}>
                <div className={styles.eqBar} />
                <div className={styles.eqBar} />
                <div className={styles.eqBar} />
                <div className={styles.eqBar} />
              </div>
              <div className={styles.carrierDot} />
              <span className={styles.carrierText}>
                CARRIER LOCKED · {carrierDate}
              </span>
            </div>
          )}
          <span className={styles.count}>{daysLeft} DAYS LEFT</span>
          {menuOpen ? (
            <button
              className={styles.closeTrigger}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.closeLabel}>CLOSE ✕</span>
              <PunchGlyph accentInk />
            </button>
          ) : (
            <button
              className={styles.channelsTrigger}
              onClick={() => setMenuOpen(true)}
            >
              <span className={styles.channelsLabel}>CHANNELS</span>
              <PunchGlyph />
            </button>
          )}
        </div>
      </header>
      {menuOpen && (
        <ChannelsOverlay
          daysLeft={daysLeft}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

function PunchGlyph({ accentInk = false }: { accentInk?: boolean }) {
  return (
    <div className={styles.punchGlyph}>
      <div className={styles.punchDot} />
      <div className={styles.punchDot} />
      <div className={styles.punchDot} />
      <div className={styles.punchDot} />
      <div
        className={`${styles.punchDot} ${accentInk ? "" : styles.accent}`}
        style={accentInk ? { background: "var(--ink)" } : undefined}
      />
      <div className={styles.punchDot} />
    </div>
  );
}
