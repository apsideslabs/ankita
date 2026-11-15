/**
 * The working tools: the ascendant, compatibility, name correction and the
 * twelve-month guide. Each one uses only what the engine already computes.
 */
import { buildProfile } from './profile.js';
import { relation } from './planets.js';
import { julianDay, ayanamsa, RASHIS, allPlacements } from './ephemeris.js';
import { personalLunarYear, personalLunarMonth } from './aa/index.js';
/* ------------------------------------------------------------------ lagna */
const D2R = Math.PI / 180;
/** Greenwich mean sidereal time in degrees. */
export function gmst(jd) {
    const d = jd - 2451545.0;
    return ((280.46061837 + 360.98564736629 * d) % 360 + 360) % 360;
}
/** Ascendant (lagna) longitude, sidereal, from time, place and obliquity. */
export function lagna(dateISO, hourUTC, lat, lon) {
    const jd = julianDay(new Date(dateISO + 'T00:00:00Z')) + hourUTC / 24;
    const lst = (gmst(jd) + lon) % 360;
    const eps = 23.4393 - 3.563e-7 * (jd - 2451545.0);
    const ramc = lst * D2R;
    const e = eps * D2R;
    const phi = lat * D2R;
    const asc = Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) / D2R;
    const tropical = ((asc % 360) + 360) % 360;
    const sidereal = ((tropical - ayanamsa(jd)) % 360 + 360) % 360;
    const sign = Math.floor(sidereal / 30) + 1;
    return { tropical, sidereal, sign, signName: RASHIS[sign - 1] };
}
/* ----------------------------------------------------------- compatibility */
const WEIGHT = { friend: 2, neutral: 1, enemy: 0 };
export function compatibility(a, b) {
    const pa = buildProfile({ ...a, gender: 'unspecified', masterNumbers: false });
    const pb = buildProfile({ ...b, gender: 'unspecified', masterNumbers: false });
    const pairs = [
        { label: 'Mūlāṅka', a: pa.mulank.value, b: pb.mulank.value },
        { label: 'Bhāgyāṅka', a: pa.bhagyank.value, b: pb.bhagyank.value },
        { label: 'Nāmāṅka', a: pa.namank.value, b: pb.namank.value },
    ];
    const rows = pairs.map((p) => {
        const rel = relation(p.a, p.b);
        return { ...p, relation: rel, points: WEIGHT[rel] };
    });
    const score = Math.round((rows.reduce((s, r) => s + r.points, 0) / (rows.length * 2)) * 100);
    const verdict = score >= 80 ? 'Strong' : score >= 55 ? 'Workable' : score >= 35 ? 'Friction' : 'Difficult';
    return { score, verdict, rows };
}
/** Spellings that keep the sound but move the name number onto a friendly digit. */
export function nameOptions(name, birthNumber, limit = 8) {
    const base = name.trim().replace(/\s+/g, ' ');
    const [first, ...rest] = base.split(' ');
    const tail = rest.join(' ');
    const out = [];
    const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];
    const seen = new Set();
    const variants = [];
    for (const v of vowels)
        variants.push(first + v + (tail ? ' ' + tail : ''));
    variants.push(first + 'a' + (tail ? ' ' + tail : ''));
    variants.push(first.replace(/a$/, 'aa') + (tail ? ' ' + tail : ''));
    variants.push(first.replace(/i$/, 'ee') + (tail ? ' ' + tail : ''));
    variants.push(first + 'h' + (tail ? ' ' + tail : ''));
    for (const spelling of variants) {
        if (seen.has(spelling))
            continue;
        seen.add(spelling);
        const p = buildProfile({ name: spelling, date: '2000-01-01', gender: 'unspecified', masterNumbers: false });
        const rel = relation(birthNumber, p.namank.value);
        if (rel === 'friend') {
            out.push({ spelling, value: p.namank.value, compound: p.namank.compound ?? p.namank.value, relation: rel });
        }
        if (out.length >= limit)
            break;
    }
    return out;
}
const MONTH_NOTE = {
    1: 'start something that needs your name on it',
    2: 'wait, listen, and let a partnership settle',
    3: 'teach, publish, ask for the larger thing',
    4: 'put the routine in place; the unglamorous work pays',
    5: 'travel, negotiate, move the pieces',
    6: 'home, family, and the people you owe time to',
    7: 'withdraw, study, finish what is unfinished',
    8: 'money, contracts, and the hard conversation',
    9: 'close, clear, and let one thing end',
    10: 'a threshold: something ends and something begins',
    11: 'a warning month — resist the shortcut',
    12: 'sacrifice and enclosure; keep the boundary',
    13: 'a reset; the old order breaks usefully',
};
export function yearAhead(dateISO, year) {
    const [y, m, d] = dateISO.split('-').map(Number);
    const ply = personalLunarYear(d, m, y, year);
    const months = Array.from({ length: 12 }, (_, i) => {
        const value = personalLunarMonth(ply, i + 1);
        return {
            month: new Date(Date.UTC(year, i, 1)).toLocaleString('en-GB', { month: 'long' }),
            value,
            note: MONTH_NOTE[value] || '',
        };
    });
    return { ply, months };
}
/** The chart with the ascendant: nine grahas in whole-sign houses from the lagna. */
export function chartWithLagna(dateISO, hourUTC, lat, lon) {
    const asc = lagna(dateISO, hourUTC, lat, lon);
    const jd = julianDay(new Date(dateISO + 'T00:00:00Z')) + hourUTC / 24;
    const grahas = allPlacements(jd).map((g) => ({ ...g, house: ((g.sign - asc.sign + 12) % 12) + 1 }));
    return { asc, grahas };
}
