/**
 * Transits: where the slow grahas sit now, when they next change sign, and the
 * house each occupies counted from the natal Moon.
 */
import { julianDay, allPlacements, RASHIS } from './ephemeris.js';
export function nextIngress(key, fromDate, days = 900) {
    const startJd = julianDay(fromDate);
    let prev = allPlacements(startJd).find((p) => p.key === key);
    if (!prev)
        return null;
    for (let d = 1; d <= days; d += 1) {
        const p = allPlacements(startJd + d).find((x) => x.key === key);
        if (p && p.sign !== prev.sign) {
            return {
                graha: prev.name,
                from: RASHIS[prev.sign - 1],
                to: RASHIS[p.sign - 1],
                date: new Date(fromDate.getTime() + d * 86400000).toISOString().slice(0, 10),
            };
        }
        prev = p || prev;
    }
    return null;
}
export function transitTable(natalMoonSign, now = new Date()) {
    const today = allPlacements(julianDay(now));
    return today.map((p) => ({
        key: p.key,
        name: p.name,
        sign: p.sign,
        signName: p.signName,
        degree: p.degreeInSign,
        retrograde: p.retrograde,
        house: ((p.sign - natalMoonSign + 12) % 12) + 1,
    }));
}
