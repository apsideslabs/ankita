import { breakdown, compoundMeaning, nameCompound } from './chaldean.js';
import { buildGrid, buildLines, missingNumbers, repeatedNumbers } from './loshu.js';
import { kua } from './kua.js';
import { NUMERAL_GRAHA } from './planets.js';
import { reduce } from './numbers.js';
import { buildTiming } from './timing.js';
import { SOURCES } from './provenance.js';
import { buildTrace } from './trace.js';
import { MISSING_READING, PAIR_READING, READINGS, REPEATED_READING } from './interpretation.js';
import { relation } from './planets.js';
function parseDate(date) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!m)
        return null;
    const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (month < 1 || month > 12 || day < 1 || day > 31)
        return null;
    return { day, month, year };
}
const GRAHA_GLOSS = Object.fromEntries(Object.entries(NUMERAL_GRAHA).map(([k, v]) => [Number(k), `${v.graha} — ${v.note}`]));
/** Build the full reading. Pure: same input, same output, always. */
export function buildProfile(input) {
    const parsed = parseDate(input.date);
    if (!parsed)
        return { error: 'Enter the date as yyyy-mm-dd.' };
    if (!input.name.trim())
        return { error: 'Enter the name to be read.' };
    const { day, month, year } = parsed;
    const master = input.masterNumbers;
    const mulankValue = reduce(day, master);
    const mulank = {
        value: mulankValue,
        compound: day > 9 ? reduce(day, false) : null,
        meaning: GRAHA_GLOSS[reduce(day, false)] ?? '',
        layer: 'graha',
    };
    const dateSum = reduce(day + month + year, false);
    const bhagyank = {
        value: reduce(day + month + year, master),
        compound: dateSum,
        meaning: GRAHA_GLOSS[dateSum] ?? '',
        layer: 'graha',
    };
    const total = nameCompound(input.name);
    const namank = {
        value: reduce(total, master),
        compound: total,
        meaning: compoundMeaning(total) || GRAHA_GLOSS[reduce(total, false)] || '',
        layer: 'chaldean',
    };
    // Standard Indian placement: every non-zero digit of the date, plus the
    // bhāgyāṅka, plus the mūlāṅka only when the birth day is 10 or more (on the
    // 1st–9th the day digit is already in the list). The name number is NOT
    // placed, and the Kua number is not placed — that is a Chinese system.
    const dateDigits = [
        ...String(day).padStart(2, '0').split('').map(Number),
        ...String(month).padStart(2, '0').split('').map(Number),
        ...String(year).split('').map(Number),
    ].filter((d) => d >= 1 && d <= 9);
    const coreDigits = [bhagyank.value, ...(day >= 10 ? [mulank.value] : [])].filter((d) => d >= 1 && d <= 9);
    const digits = [...dateDigits, ...coreDigits];
    const cells = buildGrid(digits);
    const kuaResult = kua(year, input.gender);
    const m = reduce(mulank.value, false);
    const b = reduce(bhagyank.value, false);
    const nm = reduce(namank.value, false);
    const pair = (x, y) => relation(x, y);
    const profile = {
        input,
        mulank,
        bhagyank,
        namank,
        compound: total,
        breakdown: breakdown(input.name),
        planets: [mulank.value, bhagyank.value, namank.value].map((v) => ({
            value: v,
            graha: NUMERAL_GRAHA[reduce(v, false)]?.graha ?? '—',
            sanskrit: NUMERAL_GRAHA[reduce(v, false)]?.sanskrit ?? '—',
        })),
        grid: cells,
        lines: buildLines(cells),
        missing: missingNumbers(cells),
        repeated: repeatedNumbers(cells),
        kua: kuaResult,
        timing: buildTiming(day, month),
        provenance: SOURCES,
        trace: [],
        reading: {
            mulank: READINGS[m],
            bhagyank: READINGS[b],
            namank: READINGS[nm],
            harmony: [
                { pair: [m, b], relation: pair(m, b), line: PAIR_READING[pair(m, b)] },
                { pair: [b, nm], relation: pair(b, nm), line: PAIR_READING[pair(b, nm)] },
                { pair: [m, nm], relation: pair(m, nm), line: PAIR_READING[pair(m, nm)] },
            ],
            missing: missingNumbers(cells).map((n) => ({ n, text: MISSING_READING[n] })),
            repeated: repeatedNumbers(cells).map((n) => ({ n, text: REPEATED_READING[n] })),
        },
        lucky: {
            numbers: [m, ...[1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => pair(m, x) === 'friend' && x !== m)],
            days: [READINGS[m].day],
            colours: READINGS[m].colours,
            gemstone: READINGS[m].gemstone,
            mantra: READINGS[m].mantra,
            direction: READINGS[m].direction,
        },
    };
    profile.trace = buildTrace(input, profile);
    return profile;
}
