/**
 * Vimśottarī daśā, computed from the Moon's sidereal longitude.
 *
 * The 27 nakṣatras are the same 27 divisions the AA System calls stations, so
 * one longitude serves both. The lord sequence and its years are the standard
 * ones: Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rāhu 18, Jupiter 16,
 * Saturn 19, Mercury 17 — 120 years to the cycle.
 */
export const DASHA_LORDS = [
    { lord: 'Ketu', graha: 7, years: 7 },
    { lord: 'Venus', graha: 6, years: 20 },
    { lord: 'Sun', graha: 1, years: 6 },
    { lord: 'Moon', graha: 2, years: 10 },
    { lord: 'Mars', graha: 9, years: 7 },
    { lord: 'Rāhu', graha: 4, years: 18 },
    { lord: 'Jupiter', graha: 3, years: 16 },
    { lord: 'Saturn', graha: 8, years: 19 },
    { lord: 'Mercury', graha: 5, years: 17 },
];
export const DASHA_TOTAL = 120;
export const NAKSHATRAS = [
    'Aśvinī', 'Bharaṇī', 'Kṛttikā', 'Rohiṇī', 'Mṛgaśīrṣa', 'Ārdrā', 'Punarvasu', 'Puṣya', 'Āśleṣā',
    'Maghā', 'Pūrva Phālgunī', 'Uttara Phālgunī', 'Hasta', 'Citrā', 'Svātī', 'Viśākhā', 'Anurādhā',
    'Jyeṣṭhā', 'Mūla', 'Pūrvāṣāḍhā', 'Uttarāṣāḍhā', 'Śravaṇa', 'Dhaniṣṭhā', 'Śatabhiṣā',
    'Pūrva Bhādrapadā', 'Uttara Bhādrapadā', 'Revatī',
];
const NAK_SPAN = 360 / 27;
const DAY = 86400000;
const YEAR_DAYS = 365.2425;
function addYears(from, years) {
    return new Date(from.getTime() + years * YEAR_DAYS * DAY);
}
export function vimshottari(moonSidereal, birth, at = new Date()) {
    const lon = ((moonSidereal % 360) + 360) % 360;
    const idx = Math.min(26, Math.floor(lon / NAK_SPAN));
    const within = lon - idx * NAK_SPAN;
    const fraction = within / NAK_SPAN;
    const pada = Math.floor(fraction * 4) + 1;
    const lordIndex = idx % 9;
    const lord = DASHA_LORDS[lordIndex];
    const elapsed = fraction * lord.years;
    const balance = lord.years - elapsed;
    const periods = [];
    let cursor = new Date(birth.getTime() - elapsed * YEAR_DAYS * DAY);
    for (let i = 0; i < 9; i += 1) {
        const l = DASHA_LORDS[(lordIndex + i) % 9];
        const start = new Date(cursor);
        const end = addYears(start, l.years);
        const antardashas = [];
        let aCursor = new Date(start);
        for (let j = 0; j < 9; j += 1) {
            const sub = DASHA_LORDS[(lordIndex + i + j) % 9];
            const years = (l.years * sub.years) / DASHA_TOTAL;
            const aEnd = addYears(aCursor, years);
            antardashas.push({ lord: sub.lord, graha: sub.graha, years, start: new Date(aCursor), end: aEnd });
            aCursor = aEnd;
        }
        periods.push({
            lord: l.lord,
            graha: l.graha,
            years: l.years,
            start,
            end,
            antardashas,
            partial: i === 0,
        });
        cursor = end;
    }
    const current = periods.find((p) => at >= p.start && at < p.end) ?? null;
    const currentAntar = current?.antardashas.find((a) => at >= a.start && at < a.end) ?? null;
    return {
        nakshatra: NAKSHATRAS[idx],
        nakshatraIndex: idx + 1,
        pada,
        lord: lord.lord,
        balanceYears: balance,
        periods,
        current,
        currentAntar,
    };
}
export function fmtDate(d) {
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function ageAt(birth, d) {
    return (d.getTime() - birth.getTime()) / (YEAR_DAYS * DAY);
}
