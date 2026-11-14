/** Digital-root arithmetic. The one place rounding of digits happens. */

export const MASTER_NUMBERS = [11, 22, 33] as const;

export function digitSum(n: number): number {
  let total = 0;
  for (const ch of String(Math.abs(Math.trunc(n)))) total += Number(ch);
  return total;
}

/**
 * Reduce to a single digit 1–9. With `master`, 11 / 22 / 33 stop early —
 * the Pythagorean convention. Without it, everything reduces, which is the
 * Indian convention (nine numbers for nine grahas).
 */
export function reduce(n: number, master = false): number {
  let value = Math.abs(Math.trunc(n));
  while (value > 9) {
    if (master && (MASTER_NUMBERS as readonly number[]).includes(value)) return value;
    value = digitSum(value);
  }
  return value === 0 ? 9 : value;
}

/** Reduce a string of digits, e.g. a year. */
export function reduceDigits(s: string, master = false): number {
  let total = 0;
  for (const ch of s) if (ch >= '0' && ch <= '9') total += Number(ch);
  return reduce(total, master);
}

export function isMaster(n: number): boolean {
  return (MASTER_NUMBERS as readonly number[]).includes(n);
}
