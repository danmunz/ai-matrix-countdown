import { SEED_MAP } from "@/lib/seeds";

interface SeedGlyphProps {
  seedId: string;
  size?: number;
  color?: string;
}

export function SeedGlyph({ seedId, size = 18, color }: SeedGlyphProps) {
  const meta = SEED_MAP[seedId];
  const c = color ?? meta?.color ?? "#0b0b0b";

  switch (seedId) {
    case "distributed_compute":
      return (
        <svg width={size} height={size} viewBox="0 0 34 34">
          <circle cx="17" cy="17" r="4" fill={c} />
          <circle cx="6" cy="6" r="3" fill="none" stroke={c} strokeWidth="2" />
          <circle cx="28" cy="7" r="3" fill="none" stroke={c} strokeWidth="2" />
          <circle cx="7" cy="28" r="3" fill="none" stroke={c} strokeWidth="2" />
          <circle cx="27" cy="27" r="3" fill="none" stroke={c} strokeWidth="2" />
          <line x1="14" y1="14" x2="8" y2="8" stroke={c} strokeWidth="1.5" />
          <line x1="20" y1="14" x2="26" y2="9" stroke={c} strokeWidth="1.5" />
          <line x1="14" y1="20" x2="9" y2="26" stroke={c} strokeWidth="1.5" />
          <line x1="20" y1="20" x2="25" y2="25" stroke={c} strokeWidth="1.5" />
        </svg>
      );

    case "labor_and_compute_ownership":
      return (
        <svg width={size} height={size} viewBox="0 0 34 34">
          <circle cx="17" cy="8" r="4" fill={c} />
          <rect x="12" y="14" width="10" height="12" fill={c} />
          <line x1="12" y1="18" x2="5" y2="24" stroke={c} strokeWidth="2.5" />
          <line x1="22" y1="18" x2="29" y2="24" stroke={c} strokeWidth="2.5" />
          <line x1="4" y1="30" x2="30" y2="30" stroke={c} strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );

    case "biocomputing":
      return (
        <svg width={size} height={size} viewBox="0 0 34 34">
          <path
            d="M17,4 Q25,10 25,18 A8,8 0 1,1 9,18 Q9,10 17,4Z"
            fill="none"
            stroke={c}
            strokeWidth="2.5"
          />
          <circle cx="17" cy="19" r="3" fill={c} />
        </svg>
      );

    case "neural_interfaces_and_simulation":
      return (
        <svg width={size} height={size} viewBox="0 0 34 34">
          <rect x="5" y="8" width="24" height="16" rx="2" fill="none" stroke={c} strokeWidth="2.5" />
          <circle cx="17" cy="16" r="4" fill="none" stroke={c} strokeWidth="2" />
          <line x1="12" y1="28" x2="22" y2="28" stroke={c} strokeWidth="2.5" />
        </svg>
      );

    case "agent_autonomy_and_machine_governance":
      return (
        <svg width={size} height={size} viewBox="0 0 34 34">
          <polygon points="17,4 30,28 4,28" fill="none" stroke={c} strokeWidth="2.5" />
          <line x1="17" y1="13" x2="17" y2="21" stroke={c} strokeWidth="2.5" />
          <circle cx="17" cy="24.5" r="1.5" fill={c} />
        </svg>
      );

    default:
      return null;
  }
}
