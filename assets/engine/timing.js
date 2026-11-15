import { reduce } from './numbers.js';
/**
 * Personal cycles. These are the standard reductions of the modern literature;
 * they are not classical daśās. The 45-year cycle below is arithmetic
 * (1+2+…+9 = 45), not a Vimśottarī or Aṣṭottarī period, and Aṅkita labels it so.
 */
export function personalYear(day, month, year) {
    return reduce(day + month + year);
}
export function personalMonth(py, month) {
    return reduce(py + month);
}
export function personalDay(pm, day) {
    return reduce(pm + day);
}
export function buildTiming(day, month, now = new Date()) {
    const year = now.getFullYear();
    const py = personalYear(day, month, year);
    const pm = personalMonth(py, now.getMonth() + 1);
    const pd = personalDay(pm, now.getDate());
    const cycleYear = cyclePosition(year, day, month);
    return [
        { label: 'Personal year', value: py, detail: `${day} + ${month} + ${year}, reduced` },
        { label: 'Personal month', value: pm, detail: `personal year + ${now.getMonth() + 1}, reduced` },
        { label: 'Personal day', value: pd, detail: `personal month + ${now.getDate()}, reduced` },
        {
            label: 'Aṅka cycle',
            value: cycleYear.value,
            detail: `${cycleYear.offset} of 45 years — the 1…9 cycle, where each number rules for as many years as its value`,
        },
    ];
}
/** Position inside the repeating 45-year digit cycle, anchored on the birth year. */
export function cyclePosition(year, day, month) {
    const anchor = reduce(day + month) - 1;
    const offset = (((year - 1) % 45) + 45) % 45;
    const index = (anchor + offset) % 45;
    let acc = 0;
    for (let n = 1; n <= 9; n += 1) {
        acc += n;
        if (index < acc)
            return { value: n, offset: offset + 1 };
    }
    return { value: 1, offset: offset + 1 };
}
