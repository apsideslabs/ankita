/**
 * Named yogas, computed from whole-sign houses.
 *
 * Each rule is the standard one, stated in the code so it can be checked:
 * kendras are houses 1, 4, 7, 10; trikonas are 5 and 9 (with 1). The sign
 * lords are the classical ones.
 */
import { RASHIS } from './ephemeris.js';
export const SIGN_LORD = {
    1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon', 5: 'Sun', 6: 'Mercury',
    7: 'Venus', 8: 'Mars', 9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter',
};
export const EXALTATION = {
    Sun: 1, Moon: 2, Mars: 10, Mercury: 6, Jupiter: 4, Venus: 12, Saturn: 7,
};
export const OWN_SIGN = {
    Sun: [5], Moon: [4], Mars: [1, 8], Mercury: [3, 6], Jupiter: [9, 12],
    Venus: [2, 7], Saturn: [10, 11],
};
const KENDRA = [1, 4, 7, 10];
const TRIKONA = [1, 5, 9];
function houseOf(ascSign, sign) {
    return ((sign - ascSign + 12) % 12) + 1;
}
export function findYogas(ascSign, grahas) {
    const by = (name) => grahas.find((g) => g.key === name);
    const house = (name) => {
        const g = by(name);
        return g ? houseOf(ascSign, g.sign) : 0;
    };
    const sign = (name) => by(name)?.sign ?? 0;
    const out = [];
    // Gajakesarī — Jupiter in a kendra from the Moon
    const moonSign = sign('Moon');
    const jup = sign('Jupiter');
    if (moonSign && jup) {
        const h = ((jup - moonSign + 12) % 12) + 1;
        if (KENDRA.includes(h)) {
            out.push({
                name: 'Gajakesarī', sanskrit: 'गजकेसरी',
                rule: `Jupiter in house ${h} from the Moon — a kendra`,
                result: 'Learning worn lightly; respect arrives without being asked for.',
                strength: 'full',
            });
        }
    }
    // Budhāditya — Sun and Mercury in one sign
    if (sign('Sun') && sign('Sun') === sign('Mercury')) {
        out.push({
            name: 'Budhāditya', sanskrit: 'बुधादित्य',
            rule: 'Sun and Mercury share a sign',
            result: 'Analytical authority: the argument and the standing to make it.',
            strength: 'full',
        });
    }
    // Candra-Maṅgala — Moon and Mars together or in opposition
    if (sign('Moon') && sign('Mars')) {
        const d = ((sign('Mars') - sign('Moon') + 12) % 12) + 1;
        if (d === 1 || d === 7) {
            out.push({
                name: 'Candra-Maṅgala', sanskrit: 'चन्द्रमङ्गल',
                rule: d === 1 ? 'Moon and Mars in one sign' : 'Moon and Mars in mutual opposition',
                result: 'Earning capacity driven by feeling; money follows appetite.',
                strength: 'full',
            });
        }
    }
    // Kemadruma — nothing in the 2nd or 12th from the Moon
    if (moonSign) {
        const second = ((moonSign) % 12) + 1;
        const twelfth = ((moonSign - 2 + 12) % 12) + 1;
        const occupied = grahas.filter((g) => g.key !== 'Sun' && g.key !== 'Moon' && g.key !== 'Rahu' && g.key !== 'Ketu');
        const neighbours = occupied.filter((g) => g.sign === second || g.sign === twelfth);
        const withMoon = occupied.filter((g) => g.sign === moonSign);
        if (!neighbours.length && !withMoon.length) {
            out.push({
                name: 'Kemadruma', sanskrit: 'केमद्रुम',
                rule: 'No planet in the 2nd or 12th from the Moon, and none with it',
                result: 'A solitary mind; the work is done alone, and the loneliness is the cost.',
                strength: 'full',
            });
        }
    }
    // Pañca-mahāpuruṣa — a planet exalted or in its own sign, in a kendra from the lagna
    for (const [name, label, sk] of [['Jupiter', 'Hamsa', 'हंस'], ['Mars', 'Ruchaka', 'रुचक'],
        ['Saturn', 'Sasa', 'शश'], ['Venus', 'Malavya', 'मालव्य'], ['Mercury', 'Bhadra', 'भद्र']]) {
        const s = sign(name);
        if (!s)
            continue;
        const dignified = EXALTATION[name] === s || (OWN_SIGN[name] || []).includes(s);
        if (dignified && KENDRA.includes(house(name))) {
            out.push({
                name: `${label} yoga`, sanskrit: sk,
                rule: `${name} ${EXALTATION[name] === s ? 'exalted' : 'in its own sign'} in house ${house(name)}`,
                result: `The Pañca-mahāpuruṣa pattern of ${name}: a marked capacity in that planet's field.`,
                strength: 'full',
            });
        }
    }
    // Rāja yoga — a kendra lord and a trikona lord together
    const kendraLords = KENDRA.map((h) => SIGN_LORD[((ascSign + h - 2) % 12) + 1]);
    const trikonaLords = TRIKONA.map((h) => SIGN_LORD[((ascSign + h - 2) % 12) + 1]);
    for (const k of kendraLords) {
        for (const t of trikonaLords) {
            if (k === t)
                continue;
            const a = sign(k), b = sign(t);
            if (a && a === b) {
                out.push({
                    name: 'Rāja yoga', sanskrit: 'राजयोग',
                    rule: `${k} (a kendra lord) and ${t} (a trikoṇa lord) share ${RASHIS[a - 1]}`,
                    result: 'Authority and merit in one place: position that the work actually justifies.',
                    strength: 'full',
                });
                return out;
            }
        }
    }
    return out;
}
