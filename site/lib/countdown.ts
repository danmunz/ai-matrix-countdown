const DAY_ZERO = Date.UTC(2068, 7, 7);

export function computeDaysLeft(): number {
  return Math.ceil((DAY_ZERO - Date.now()) / 86_400_000);
}
