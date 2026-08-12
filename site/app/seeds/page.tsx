import Link from "next/link";
import { getSeedProfiles, getSiteStats } from "@/lib/data";
import { ChromeBar } from "@/components/ChromeBar";
import { FrescoPlate } from "@/components/FrescoPlate";
import { SeedGlyph } from "@/components/SeedGlyph";
import styles from "./page.module.css";

export default function SeedsPage() {
  const seeds = getSeedProfiles();
  const stats = getSiteStats();
  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";

  return (
    <div className={styles.seeds}>
      <ChromeBar breadcrumb={{ label: "← HOME", href: "/" }}>
        <span
          style={{
            fontFamily: "var(--font-oswald), sans-serif",
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: 2,
            color: "rgba(11,11,11,0.5)",
            textTransform: "uppercase",
          }}
        >
          THE FIVE SEEDS
        </span>
      </ChromeBar>

      <div className={styles.hero}>
        <FrescoPlate screenOffset={2} height="400px" />
        <div className={styles.headline}>
          Nothing here is science fiction —{" "}
          <span className={styles.headlineRed}>yet.</span>
        </div>
        <div className={styles.intro}>
          Each of the five threads below is separately reasonable and already
          funded. The story is what happens when they interlock. Nothing requires
          a machine that hates you — only markets, insurers, voters, and
          institutions behaving as they always have.
        </div>
      </div>

      <div className={styles.list}>
        {seeds.map((seed) => (
          <Link
            key={seed.id}
            href={`/seeds/${seed.slug}`}
            className={styles.row}
          >
            <img
              src={`${basePath}/images/seeds/${seed.slug}_icon.webp`}
              alt={seed.displayName}
              className={styles.icon}
              loading="lazy"
            />
            <div className={styles.seedInfo}>
              <div className={styles.seedNameRow}>
                <SeedGlyph seedId={seed.id} size={15} />
                <span className={styles.seedName} style={{ color: seed.color }}>
                  {seed.displayName}*
                </span>
              </div>
              <div className={styles.footnote}>*{seed.footnote}</div>
              <div className={styles.entryStat}>
                {seed.entryCount} entries · {seed.firstYear} → day 0
              </div>
            </div>
            <span className={styles.arrow}>▸</span>
          </Link>
        ))}
      </div>

      <div className={styles.footer}>
        <span>EVERY THREAD ENDS ON THE SAME DAY</span>
        <Link href="/timeline" className={styles.footerLink}>
          ALL {stats.entryCount} ▸
        </Link>
      </div>
    </div>
  );
}
