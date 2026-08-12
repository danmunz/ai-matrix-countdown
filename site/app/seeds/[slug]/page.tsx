import { notFound } from "next/navigation";
import Link from "next/link";
import { getSeedProfiles, getSeedProfileBySlug } from "@/lib/data";
import { SEED_ORDER, SEED_MAP } from "@/lib/seeds";
import { ChromeBar } from "@/components/ChromeBar";
import { FrescoPlate } from "@/components/FrescoPlate";
import { SeedGlyph } from "@/components/SeedGlyph";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getSeedProfiles().map((s) => ({ slug: s.slug }));
}

export default async function SeedProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const seed = getSeedProfileBySlug(slug);
  if (!seed) notFound();

  const basePath = process.env.__NEXT_ROUTER_BASEPATH || "";
  const seedIdx = SEED_ORDER.indexOf(seed.id);
  const prevSeed = seedIdx > 0 ? SEED_MAP[SEED_ORDER[seedIdx - 1]] : null;
  const nextSeed =
    seedIdx < SEED_ORDER.length - 1
      ? SEED_MAP[SEED_ORDER[seedIdx + 1]]
      : null;

  return (
    <div className={styles.profile}>
      <ChromeBar breadcrumb={{ label: "← ALL FIVE SEEDS", href: "/seeds" }} />

      <div className={styles.hero}>
        <FrescoPlate screenOffset={seedIdx + 4} height="420px" />

        <div className={styles.leftCol}>
          <img
            src={`${basePath}/images/seeds/${seed.slug}_icon.webp`}
            alt={seed.displayName}
            className={styles.panel}
          />
          <div className={styles.panelCaption}>
            PANEL {["I", "II", "III", "IV", "V"][seedIdx]} OF V ·{" "}
            {seed.displayName}
            <br />
            {seed.description.split(".")[0].split(" ").slice(0, 4).join(" ")} ·
            pigment on data
          </div>
        </div>

        <div className={styles.center}>
          <div className={styles.kicker}>
            SEED {String(seedIdx + 1).padStart(2, "0")} OF 05
          </div>
          <div className={styles.nameRow}>
            <span className={styles.seedName} style={{ color: seed.color }}>
              {seed.displayName}*
            </span>
            <SeedGlyph seedId={seed.id} size={34} />
          </div>
          <div className={styles.footnote}>*{seed.footnote}</div>
          <div className={styles.description}>{seed.description}</div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.statCard}>
            <div className={styles.statGlyph}>
              <SeedGlyph seedId={seed.id} size={16} />
              <span className={styles.taxon}>
                TAXON {String(seedIdx + 1).padStart(2, "0")}
              </span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statValue}>{seed.entryCount}</span>
              <span className={styles.statLabel}>ENTRIES</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statValue}>{seed.firstYear}</span>
              <span className={styles.statLabel}>FIRST</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statValue}>DAY 0</span>
              <span className={styles.statLabel}>LAST</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statValue}>{seed.spanYears} YRS</span>
              <span className={styles.statLabel}>SPAN</span>
            </div>
            <Link
              href="/timeline"
              className={styles.followBtn}
              style={{ background: seed.color }}
            >
              Follow only this seed ▸
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.threadSection}>
        <div className={styles.threadHeader}>THE THREAD</div>
        {seed.entries.map((entry) => {
          const isZero = entry.dayNumber === 0;
          return (
            <Link
              key={entry.dayNumber}
              href={`/day/${entry.dayNumber}`}
              className={`${styles.threadRow} ${isZero ? styles.threadRowZero : ""}`}
            >
              <span className={styles.threadDay}>{entry.displayDay}</span>
              <span className={styles.threadYear}>{entry.year}</span>
              <span className={styles.threadTitle}>{entry.title}</span>
              <span className={styles.threadNote}>{entry.note ?? ""}</span>
            </Link>
          );
        })}
      </div>

      <div className={styles.navRow}>
        {prevSeed ? (
          <Link
            href={`/seeds/${prevSeed.slug}`}
            className={styles.navPrev}
          >
            <div className={styles.navKicker}>
              ◄ SEED {String(prevSeed.index + 1).padStart(2, "0")} ·{" "}
              {prevSeed.displayName}*
            </div>
            <div className={styles.navTitle}>{prevSeed.displayName}</div>
          </Link>
        ) : (
          <div className={styles.navPrev} style={{ opacity: 0.3 }}>
            <div className={styles.navKicker}>NO PREVIOUS SEED</div>
          </div>
        )}
        {nextSeed ? (
          <Link
            href={`/seeds/${nextSeed.slug}`}
            className={styles.navNext}
          >
            <div className={styles.navKicker}>
              SEED {String(nextSeed.index + 1).padStart(2, "0")} ·{" "}
              {nextSeed.displayName}* ►
            </div>
            <div className={styles.navTitle}>{nextSeed.displayName}</div>
          </Link>
        ) : (
          <div className={styles.navNext} style={{ opacity: 0.3 }}>
            <div className={styles.navKicker}>NO NEXT SEED</div>
          </div>
        )}
      </div>
    </div>
  );
}
