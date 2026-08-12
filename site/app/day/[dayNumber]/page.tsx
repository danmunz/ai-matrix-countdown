import { notFound } from "next/navigation";
import Link from "next/link";
import { getEntries, getEntryByDayNumber } from "@/lib/data";
import { SEED_MAP } from "@/lib/seeds";
import { ChromeBar } from "@/components/ChromeBar";
import { SeedGlyph } from "@/components/SeedGlyph";
import styles from "./page.module.css";

export function generateStaticParams() {
  return getEntries().map((e) => ({ dayNumber: String(e.dayNumber) }));
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ dayNumber: string }>;
}) {
  const { dayNumber: dayStr } = await params;
  const dayNumber = parseInt(dayStr, 10);
  if (isNaN(dayNumber)) notFound();

  const entries = getEntries();
  const entry = getEntryByDayNumber(dayNumber);
  if (!entry) notFound();

  const prevEntry = entry.index > 0 ? entries[entry.index - 1] : null;
  const nextEntry =
    entry.index < entries.length - 1 ? entries[entry.index + 1] : null;

  const primarySeedId = entry.seeds[0];
  const primarySeed = primarySeedId ? SEED_MAP[primarySeedId] : null;

  const visibleLinks = entry.links.slice(0, 2);
  const hiddenCount = entry.links.length - 2;

  const now = new Date();
  const entryDate = new Date(entry.date + "T00:00:00Z");
  const daysFromNow = Math.ceil(
    (entryDate.getTime() - now.getTime()) / 86_400_000
  );
  const distanceLabel =
    daysFromNow > 0
      ? `${daysFromNow} DAYS FROM NOW`
      : daysFromNow === 0
        ? "TODAY"
        : `${Math.abs(daysFromNow)} DAYS AGO`;

  const bodyParagraphs = entry.paragraphs.map((para, i) => {
    if (entry.highlight && para.includes(entry.highlight)) {
      const idx = para.indexOf(entry.highlight);
      return (
        <p key={i}>
          {para.slice(0, idx)}
          <span className={styles.highlight}>{entry.highlight}</span>
          {para.slice(idx + entry.highlight.length)}
        </p>
      );
    }
    return <p key={i}>{para}</p>;
  });

  return (
    <div className={styles.dayPage}>
      <ChromeBar breadcrumb={{ label: "← ALL DAYS", href: "/timeline" }} />

      <div className={styles.content}>
        <div className={styles.dayBox}>
          <div className={styles.dayNumber}>{entry.displayDay}</div>
          <div className={styles.dayMeta}>
            {entry.formattedDate} · {distanceLabel}
          </div>
        </div>

        <div className={styles.title}>{entry.title}</div>

        {primarySeed && (
          <div className={styles.seedTag}>
            <div className={styles.seedTagIcon}>
              <SeedGlyph
                seedId={primarySeedId}
                size={16}
                color="var(--paper)"
              />
            </div>
            <span
              className={styles.seedTagName}
              style={{ color: primarySeed.color }}
            >
              {primarySeed.displayName}*
            </span>
            <span className={styles.seedTagFootnote}>
              *{primarySeed.footnote.toUpperCase()}
            </span>
          </div>
        )}

        <div className={styles.body}>{bodyParagraphs}</div>

        <div className={styles.evidenceSection}>
          <div className={styles.evidenceLabel}>
            EVIDENCE ▸ {entry.links.length} DOCUMENT
            {entry.links.length !== 1 ? "S" : ""}
          </div>
          <div className={styles.evidenceCaption}>
            this part is not fiction · published before{" "}
            {now.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }).toUpperCase()}{" "}
            · {entry.links.length} document{entry.links.length !== 1 ? "s" : ""}
          </div>
          <div className={styles.evidenceCards}>
            {visibleLinks.map((link) => (
              <a
                key={link.letter}
                href={link.url}
                target="_blank"
                rel="noopener"
                className={styles.evidenceCard}
              >
                <div className={styles.exhibitTab}>
                  EXHIBIT {link.letter}
                </div>
                <div className={styles.evidenceSummary}>
                  {link.description}
                </div>
                <div className={styles.evidenceCitation}>
                  {link.hostname} · {link.relevance}
                </div>
              </a>
            ))}
          </div>
          {hiddenCount > 0 && (
            <div className={styles.moreLinks}>
              + {hiddenCount} MORE DOCUMENT{hiddenCount !== 1 ? "S" : ""}
            </div>
          )}
        </div>
      </div>

      <div className={styles.metaLine}>
        <span>
          ENTRY {entry.index + 1} OF {entries.length} · READING FORWARD FROM
          TODAY
        </span>
        <span className={styles.wakeUp}>④ WAKE UP ✕</span>
      </div>

      <div className={styles.navRow}>
        {prevEntry ? (
          <Link
            href={`/day/${prevEntry.dayNumber}`}
            className={styles.navPrev}
          >
            <div className={styles.navKicker}>
              ◄ EARLIER · {prevEntry.displayDay}
            </div>
            <div className={styles.navTitle}>{prevEntry.title}</div>
          </Link>
        ) : (
          <div className={styles.navPrev} style={{ opacity: 0.3 }}>
            <div className={styles.navKicker}>NO EARLIER ENTRY</div>
          </div>
        )}
        {nextEntry ? (
          <Link
            href={`/day/${nextEntry.dayNumber}`}
            className={styles.navNext}
          >
            <div className={styles.navKicker}>
              LATER · {nextEntry.displayDay} ►
            </div>
            <div className={styles.navTitle}>{nextEntry.title}</div>
          </Link>
        ) : (
          <div className={styles.navNext} style={{ opacity: 0.3 }}>
            <div className={styles.navKicker}>NO LATER ENTRY</div>
          </div>
        )}
      </div>
    </div>
  );
}
