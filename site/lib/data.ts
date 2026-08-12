import rawTimeline from "./matrix_reverse_timeline.json";
import rawSeeds from "./matrix_seed_descriptions.json";
import {
  type RawTimelineEntry,
  type RawSeedDescription,
  type ProcessedEntry,
  type EvidenceLink,
  type Part,
  type SeedProfile,
  type PartInfo,
  type SiteStats,
} from "./types";
import { SEED_MAP, SEED_ORDER } from "./seeds";

const KNOWN_SEED_IDS = new Set(SEED_ORDER);

const PART_DEFS: { part: Part; subtitle: string; maxYear: number }[] = [
  { part: "I", subtitle: "Only Seeds", maxYear: 2031 },
  { part: "II", subtitle: "The Ownership Turn", maxYear: 2039 },
  { part: "III", subtitle: "The Wet Economy", maxYear: 2058 },
  { part: "IV", subtitle: "The War Nobody Named", maxYear: 2062 },
  { part: "V", subtitle: "The Quiet Transition", maxYear: 9999 },
];

function derivePart(year: number): Part {
  for (const def of PART_DEFS) {
    if (year <= def.maxYear) return def.part;
  }
  return "V";
}

function partSubtitle(part: Part): string {
  return PART_DEFS.find((d) => d.part === part)!.subtitle;
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function processEntry(raw: RawTimelineEntry, index: number): ProcessedEntry {
  const year = new Date(raw.date + "T00:00:00Z").getUTCFullYear();
  const part = (raw.part as Part) || derivePart(year);
  const absDay = Math.abs(raw.dayNumber);
  const displayDay =
    raw.dayNumber === 0 ? "DAY 0" : `DAY −${absDay}`;

  const links: EvidenceLink[] = raw.links.map((l, i) => ({
    ...l,
    letter: String.fromCharCode(65 + i),
    hostname: hostname(l.url),
  }));

  return {
    date: raw.date,
    dayNumber: raw.dayNumber,
    displayDay,
    title: raw.title,
    text: raw.text,
    paragraphs: raw.text.split("\n\n"),
    links,
    seeds: raw.seeds,
    highlight: raw.highlight,
    gapNote: raw.gapNote,
    note: raw.note,
    part,
    partLabel: `PART ${part} · ${partSubtitle(part).toUpperCase()}`,
    index,
    formattedDate: formatDate(raw.date),
    year,
  };
}

function validate(entries: ProcessedEntry[], raws: RawTimelineEntry[]): void {
  const dayNumbers = new Set<number>();
  const dayZeroCount = raws.filter((e) => e.dayNumber === 0).length;
  if (dayZeroCount !== 1) {
    throw new Error(
      `Expected exactly 1 entry with dayNumber===0, found ${dayZeroCount}`
    );
  }

  for (const raw of raws) {
    if (dayNumbers.has(raw.dayNumber)) {
      throw new Error(`Duplicate dayNumber: ${raw.dayNumber}`);
    }
    dayNumbers.add(raw.dayNumber);

    for (const sid of raw.seeds) {
      if (!KNOWN_SEED_IDS.has(sid)) {
        throw new Error(
          `Unknown seed id "${sid}" in entry dayNumber=${raw.dayNumber}`
        );
      }
    }

    if (!raw.links || raw.links.length === 0) {
      throw new Error(
        `Entry dayNumber=${raw.dayNumber} has no links`
      );
    }

    for (const link of raw.links) {
      try {
        new URL(link.url);
      } catch {
        throw new Error(
          `Invalid URL "${link.url}" in entry dayNumber=${raw.dayNumber}`
        );
      }
    }

    if (raw.highlight && !raw.text.includes(raw.highlight)) {
      throw new Error(
        `Highlight not found in text for entry dayNumber=${raw.dayNumber}`
      );
    }
  }
}

const sorted = [...(rawTimeline as RawTimelineEntry[])].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

const entries: ProcessedEntry[] = sorted.map((raw, i) => {
  const entry = processEntry(raw, i);
  if (i > 0) {
    const prev = sorted[i - 1];
    entry.gap = Math.abs(raw.dayNumber - prev.dayNumber);
  }
  return entry;
});

validate(entries, sorted);

export function getEntries(): ProcessedEntry[] {
  return entries;
}

export function getEntryByDayNumber(dayNumber: number): ProcessedEntry | undefined {
  return entries.find((e) => e.dayNumber === dayNumber);
}

export function getEntryByIndex(index: number): ProcessedEntry | undefined {
  return entries[index];
}

export function getSeedProfiles(): SeedProfile[] {
  const seedDescs = rawSeeds as RawSeedDescription[];
  return SEED_ORDER.map((id, i) => {
    const meta = SEED_MAP[id];
    const desc = seedDescs.find((s) => s.id === id);
    const seedEntries = entries.filter((e) => e.seeds.includes(id));
    const years = seedEntries.map((e) => e.year);
    return {
      id,
      slug: meta.slug,
      displayName: meta.displayName,
      footnote: meta.footnote,
      color: meta.color,
      colorDark: meta.colorDark,
      description: desc?.description ?? "",
      summary: desc?.summary ?? (desc ? desc.description.split(". ")[0] + "." : ""),
      entries: seedEntries,
      entryCount: seedEntries.length,
      firstYear: Math.min(...years),
      lastYear: Math.max(...years),
      spanYears: Math.max(...years) - Math.min(...years),
      index: i,
    };
  });
}

export function getSeedProfileBySlug(slug: string): SeedProfile | undefined {
  return getSeedProfiles().find((s) => s.slug === slug);
}

export function getPartInfos(): PartInfo[] {
  const partMap = new Map<Part, ProcessedEntry[]>();
  for (const entry of entries) {
    const arr = partMap.get(entry.part) || [];
    arr.push(entry);
    partMap.set(entry.part, arr);
  }
  return PART_DEFS.map((def) => {
    const partEntries = partMap.get(def.part) || [];
    const years = partEntries.map((e) => e.year);
    return {
      part: def.part,
      subtitle: def.subtitle,
      entries: partEntries,
      yearRange:
        years.length > 0
          ? `${Math.min(...years)} → ${Math.max(...years)}`
          : "",
      entryCount: partEntries.length,
    };
  });
}

export function getSiteStats(): SiteStats {
  const uniqueUrls = new Set(entries.flatMap((e) => e.links.map((l) => l.url)));
  const years = entries.map((e) => e.year);
  return {
    entryCount: entries.length,
    seedCount: SEED_ORDER.length,
    sourceCount: uniqueUrls.size,
    dateRange: `${Math.min(...years)} → ${Math.max(...years)}`,
  };
}
