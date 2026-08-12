import { getEntries, getSeedProfiles, getSiteStats } from "@/lib/data";
import { SEED_ORDER } from "@/lib/seeds";
import { LandingClient } from "./LandingClient";

export default function LandingPage() {
  const entries = getEntries();
  const seeds = getSeedProfiles();
  const stats = getSiteStats();

  return (
    <LandingClient
      entryCount={stats.entryCount}
      seedCount={stats.seedCount}
      sourceCount={stats.sourceCount}
      seeds={seeds.map((s) => ({
        id: s.id,
        slug: s.slug,
        displayName: s.displayName,
        footnote: s.footnote,
        color: s.color,
        entryCount: s.entryCount,
      }))}
      totalEntries={entries.length}
    />
  );
}
