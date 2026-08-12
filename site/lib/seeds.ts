export interface SeedMeta {
  id: string;
  displayName: string;
  slug: string;
  footnote: string;
  color: string;
  colorDark: string;
  index: number;
}

export const SEED_MAP: Record<string, SeedMeta> = {
  distributed_compute: {
    id: "distributed_compute",
    displayName: "KOMPUTILO",
    slug: "komputilo",
    footnote: "the box in your house",
    color: "#2A5EA8",
    colorDark: "#7FAAE8",
    index: 0,
  },
  labor_and_compute_ownership: {
    id: "labor_and_compute_ownership",
    displayName: "LABORO",
    slug: "laboro",
    footnote: "who owns the machines",
    color: "#B8860B",
    colorDark: "#E3B44A",
    index: 1,
  },
  biocomputing: {
    id: "biocomputing",
    displayName: "CERBO",
    slug: "cerbo",
    footnote: "wetware pays the mortgage",
    color: "#1F7A6B",
    colorDark: "#4FC2AC",
    index: 2,
  },
  neural_interfaces_and_simulation: {
    id: "neural_interfaces_and_simulation",
    displayName: "SONĜO",
    slug: "songo",
    footnote: "a place a person lives",
    color: "#6A4C93",
    colorDark: "#B199D6",
    index: 3,
  },
  agent_autonomy_and_machine_governance: {
    id: "agent_autonomy_and_machine_governance",
    displayName: "AŬTORITATO",
    slug: "autoritato",
    footnote: "nobody is driving",
    color: "#7A1E28",
    colorDark: "#E8556A",
    index: 4,
  },
};

export const SEED_ORDER = [
  "distributed_compute",
  "labor_and_compute_ownership",
  "biocomputing",
  "neural_interfaces_and_simulation",
  "agent_autonomy_and_machine_governance",
];

export const SLUG_TO_ID: Record<string, string> = Object.fromEntries(
  Object.values(SEED_MAP).map((s) => [s.slug, s.id])
);

export function getSeedBySlug(slug: string): SeedMeta | undefined {
  const id = SLUG_TO_ID[slug];
  return id ? SEED_MAP[id] : undefined;
}
