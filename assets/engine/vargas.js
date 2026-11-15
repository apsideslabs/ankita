/**
 * Divisional charts. D9 (navāṃśa) follows the classical rule: a movable sign
 * counts from itself, a fixed sign from the ninth from it, a dual sign from the
 * fifth. D10 (daśāṃśa) counts from the sign itself for odd signs and from the
 * ninth for even ones.
 */
import { RASHIS } from './ephemeris.js';
const MOVABLE = [1, 4, 7, 10];
const FIXED = [2, 5, 8, 11];
export function navamsaSign(sidereal) {
    const sign = Math.floor(sidereal / 30) + 1;
    const deg = sidereal % 30;
    const part = Math.floor(deg / (30 / 9)); // 0–8
    const start = MOVABLE.includes(sign) ? sign : FIXED.includes(sign) ? ((sign - 1 + 8) % 12) + 1 : ((sign - 1 + 4) % 12) + 1;
    return ((start - 1 + part) % 12) + 1;
}
export function dasamsaSign(sidereal) {
    const sign = Math.floor(sidereal / 30) + 1;
    const deg = sidereal % 30;
    const part = Math.floor(deg / 3); // 0–9
    const start = sign % 2 === 1 ? sign : ((sign - 1 + 8) % 12) + 1;
    return ((start - 1 + part) % 12) + 1;
}
export function vargaChart(grahas) {
    return grahas.map((g) => {
        const sign = navamsaSign(g.longitude);
        return {
            name: g.name,
            sign,
            signName: RASHIS[sign - 1],
            d1: g.sign,
            resonance: sign === g.sign,
        };
    });
}
export function dasamsaChart(grahas) {
    return grahas.map((g) => {
        const sign = dasamsaSign(g.longitude);
        return { name: g.name, sign, signName: RASHIS[sign - 1], d1: g.sign, resonance: sign === g.sign };
    });
}
