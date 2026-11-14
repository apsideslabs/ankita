import { reduceDigits } from './numbers';
import type { Gender } from './types';

/**
 * The Kua (Gua) number of the compass school of Feng Shui — Chinese, not Indian.
 * Two branches are required: births from 1900–1999 and from 2000–2099 use
 * different constants. A single formula applied to both misdirects every
 * user born after 1999, which is the most common error in this calculation.
 */
export function kua(year: number, gender: Gender): { value: number; group: 'east' | 'west'; note: string } | null {
  if (gender === 'unspecified') return null;
  if (year < 1900 || year > 2099) return null;
  const yy = reduceDigits(String(year).slice(-2));
  let value: number;
  if (year < 2000) {
    value = gender === 'male' ? 10 - yy : 5 + yy;
  } else {
    value = gender === 'male' ? 9 - yy : 6 + yy;
  }
  value = ((value - 1) % 9 + 9) % 9 + 1;
  if (value === 5) value = gender === 'male' ? 2 : 8;
  const east = [1, 3, 4, 9].includes(value);
  return {
    value,
    group: east ? 'east' : 'west',
    note: east ? 'East group: N, S, E, SE are favourable.' : 'West group: W, NW, SW, NE are favourable.',
  };
}
