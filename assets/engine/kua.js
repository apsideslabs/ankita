import { reduceDigits } from './numbers.js';
/**
 * The Kua (Gua) number of the compass school of Feng Shui — Chinese, not Indian.
 * Two branches are required: births from 1900–1999 and from 2000–2099 use
 * different constants. A single formula applied to both misdirects every
 * user born after 1999, which is the most common error in this calculation.
 */
/**
 * The four favourable and four unfavourable compass directions of the eight
 * mansions. Compass-school Feng Shui; not Indian, and labelled as such.
 */
export const KUA_DIRECTIONS = {
    1: { good: ['SE', 'E', 'S', 'N'], bad: ['W', 'NW', 'NE', 'SW'] },
    2: { good: ['NE', 'W', 'NW', 'SW'], bad: ['E', 'SE', 'S', 'N'] },
    3: { good: ['S', 'N', 'SE', 'E'], bad: ['W', 'NW', 'NE', 'SW'] },
    4: { good: ['N', 'S', 'E', 'SE'], bad: ['SW', 'NE', 'NW', 'W'] },
    6: { good: ['W', 'NE', 'NW', 'SW'], bad: ['E', 'SE', 'S', 'N'] },
    7: { good: ['NW', 'SW', 'NE', 'W'], bad: ['SE', 'E', 'N', 'S'] },
    8: { good: ['SW', 'NW', 'W', 'NE'], bad: ['N', 'S', 'SE', 'E'] },
    9: { good: ['E', 'SE', 'N', 'S'], bad: ['NE', 'NW', 'SW', 'W'] },
};
export function kua(year, gender) {
    if (gender === 'unspecified')
        return null;
    if (year < 1900 || year > 2099)
        return null;
    const yy = reduceDigits(String(year).slice(-2));
    let value;
    if (year < 2000) {
        value = gender === 'male' ? 10 - yy : 5 + yy;
    }
    else {
        value = gender === 'male' ? 9 - yy : 6 + yy;
    }
    value = ((value - 1) % 9 + 9) % 9 + 1;
    if (value === 5)
        value = gender === 'male' ? 2 : 8;
    const east = [1, 3, 4, 9].includes(value);
    return {
        value,
        group: east ? 'east' : 'west',
        note: east ? 'East group: N, S, E, SE are favourable.' : 'West group: W, NW, SW, NE are favourable.',
        directions: KUA_DIRECTIONS[value] ?? { good: [], bad: [] },
    };
}
