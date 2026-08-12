import { getSiteStats } from "@/lib/data";
import { ChromeBar } from "@/components/ChromeBar";
import { FrescoPlate } from "@/components/FrescoPlate";
import { FilmGrain } from "@/components/FilmGrain";
import styles from "./page.module.css";

export default function AboutPage() {
  const stats = getSiteStats();

  return (
    <div className={styles.about}>
      <ChromeBar breadcrumb={{ label: "← HOME", href: "/" }} />

      <div className={styles.hero}>
        <FrescoPlate screenOffset={3} height="620px" />
        <div className={styles.manifesto}>
          This is a work of
          <br />
          speculative fiction.
          <br />
          <span className={styles.manifestoRed}>The footnotes are not.</span>
        </div>
        <div className={styles.copy}>
          Every entry in the timeline is invented. Every source cited beneath it
          is a real, already-published document — a paper, a patent, a policy
          brief, a news report — that existed before this project did. The
          fiction grows from the footnotes, not the other way around.
        </div>
        <div className={styles.copy}>
          Five threads — compute, labor, biocomputing, simulation, and
          governance — run through the story independently. Each is separately
          reasonable and already funded. The timeline is what happens when they
          interlock. Nothing here requires a machine that hates you — only
          markets, insurers, voters, and institutions behaving as they always
          have.
        </div>
      </div>

      <div className={styles.stripe}>
        <div className={styles.stripeText}>The number only goes down</div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardNumber}>①</div>
          <div className={styles.cardTitle}>Begin at today</div>
          <div className={styles.cardBody}>
            The timeline always starts on the day you arrive. The countdown is
            live. It was different yesterday.
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardNumber}>②</div>
          <div className={styles.cardTitle}>Follow one seed</div>
          <div className={styles.cardBody}>
            Five threads run through the story; each is a complete story on its
            own.
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardNumber}>③</div>
          <div className={styles.cardTitle}>Check the sources</div>
          <div className={styles.cardBody}>
            Every entry carries EVIDENCE: the real documents the fiction grows
            from.
          </div>
        </div>
        <div className={`${styles.card} ${styles.cardAccent}`}>
          <FilmGrain />
          <div className={styles.cardNumber}>④</div>
          <div className={styles.cardTitle}>Wake up ✕</div>
          <div className={styles.cardBody}>
            The seeds are real and being planted now. Which futures get built is
            still a choice. For now.
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span>
          {stats.entryCount} ENTRIES · {stats.seedCount} SEEDS ·{" "}
          {stats.sourceCount} SOURCES · {stats.dateRange}
        </span>
        <span>© W.A.K.E. PRODUCTS LTD 2068</span>
      </div>
    </div>
  );
}
