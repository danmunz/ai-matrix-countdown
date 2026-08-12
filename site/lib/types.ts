export interface RawTimelineEntry {
  date: string;
  dayNumber: number;
  title: string;
  text: string;
  links: {
    url: string;
    description: string;
    relevance: string;
  }[];
  seeds: string[];
  highlight?: string;
  gapNote?: string;
  note?: string;
  part?: string;
}

export interface ProcessedEntry {
  date: string;
  dayNumber: number;
  displayDay: string;
  title: string;
  text: string;
  paragraphs: string[];
  links: EvidenceLink[];
  seeds: string[];
  highlight?: string;
  gapNote?: string;
  note?: string;
  part: Part;
  partLabel: string;
  index: number;
  gap?: number;
  formattedDate: string;
  year: number;
}

export interface EvidenceLink {
  url: string;
  description: string;
  relevance: string;
  letter: string;
  hostname: string;
}

export interface RawSeedDescription {
  id: string;
  name: string;
  description: string;
  summary?: string;
}

export interface SeedProfile {
  id: string;
  slug: string;
  displayName: string;
  footnote: string;
  color: string;
  colorDark: string;
  description: string;
  summary: string;
  entries: ProcessedEntry[];
  entryCount: number;
  firstYear: number;
  lastYear: number;
  spanYears: number;
  index: number;
}

export type Part = "I" | "II" | "III" | "IV" | "V";

export interface PartInfo {
  part: Part;
  subtitle: string;
  entries: ProcessedEntry[];
  yearRange: string;
  entryCount: number;
}

export interface SiteStats {
  entryCount: number;
  seedCount: number;
  sourceCount: number;
  dateRange: string;
}
