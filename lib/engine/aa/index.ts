/**
 * The AA System — the Axiom Arcana engine.
 *
 * A separate system from the aṅka engine, with its own mathematics: a
 * reduce-to-13 function, a symmetric letter code, 27 stations, and a 91-year
 * period cycle. Everything here is transcribed from the Axiom Arcana Codex and
 * Research Document supplied by the author. Where the documents disagree, the
 * resolution is noted in the code.
 *
 * Provenance: this is an authored system, not a classical one. Nothing in it is
 * claimed to come from Sanskrit texts, and the platform labels it accordingly.
 */

/* ---------------------------------------------------------------- reduce 13 */
export function reduce13(n: number): number {
  let v = Math.abs(Math.trunc(n));
  if (v === 0) return 13;
  while (v > 13) {
    v = String(v).split('').reduce((a, c) => a + Number(c), 0);
  }
  return v;
}

export function digitSum(n: number): number {
  return String(Math.abs(Math.trunc(n))).split('').reduce((a, c) => a + Number(c), 0);
}

/* ------------------------------------------------------------- core self */
export interface CoreSelf {
  dayValue: number;
  monthValue: number;
  yearValue: number;
  compound: number;
  core: number;
}

export function coreSelf(day: number, month: number, year: number): CoreSelf {
  const dayValue = reduce13(day);
  const monthValue = month; // 1–12, always ≤ 13
  const yearValue = reduce13(digitSum(year));
  const compound = dayValue + monthValue + yearValue;
  return { dayValue, monthValue, yearValue, compound, core: reduce13(compound) };
}

/* ------------------------------------------------------------------- ALC */
/**
 * Axiomatic Letter Code: a symmetric pairing, A↔Z, B↔Y … so the value is
 * min(pos, 27 − pos) with A = 1 … Z = 26. The document's own examples confirm
 * it: A=1, N=13, U=6, J=10, P=11, R=9, I=9, Y=2.
 */
export function alcValue(ch: string): number {
  const c = ch.toUpperCase();
  if (c < 'A' || c > 'Z') return 0;
  const pos = c.charCodeAt(0) - 64;
  return Math.min(pos, 27 - pos);
}

export const ALC_TABLE: { letter: string; value: number }[] = Array.from({ length: 26 }, (_, i) => ({
  letter: String.fromCharCode(65 + i),
  value: Math.min(i + 1, 26 - i),
}));

const BASE_VOWELS = new Set(['A', 'E', 'I', 'O', 'U']);

/**
 * The Y-rule, as the Codex resolves it: Y is a vowel when it carries the only
 * vowel sound of its syllable ("Binay"), and a consonant before another vowel
 * ("Yoga"). Its value is 2 either way; only the SWN/PMN split changes.
 */
export function isVowel(ch: string, word: string, index: number): boolean {
  const c = ch.toUpperCase();
  if (BASE_VOWELS.has(c)) return true;
  if (c !== 'Y') return false;
  const prev = (word[index - 1] ?? '').toUpperCase();
  const next = (word[index + 1] ?? '').toUpperCase();
  const nextIsVowel = BASE_VOWELS.has(next) || next === 'Y';
  // Y at the start of a syllable followed by a vowel is the consonant /y/.
  if (nextIsVowel) return false;
  // Otherwise it carries a vowel sound (final Y, or Y between consonants).
  return !BASE_VOWELS.has(prev) || index === word.length - 1;
}

export interface NameNumbers {
  dpn: number;
  swn: number;
  pmn: number;
  total: number;
  vowels: string[];
  consonants: string[];
}

export function nameNumbers(name: string, yAsVowel = true): NameNumbers {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '').split('');
  let total = 0, vSum = 0, cSum = 0;
  const vowels: string[] = [], consonants: string[] = [];
  letters.forEach((ch, i) => {
    const val = alcValue(ch);
    total += val;
    const vowel = yAsVowel ? isVowel(ch, name.toUpperCase(), i) : BASE_VOWELS.has(ch);
    if (vowel) { vSum += val; vowels.push(ch); } else { cSum += val; consonants.push(ch); }
  });
  return { dpn: reduce13(total), swn: reduce13(vSum), pmn: reduce13(cSum), total, vowels, consonants };
}

/* --------------------------------------------------------------- stations */
export const STATION_SPAN = 360 / 27; // 13.333…

export const STATIONS = [
  'Aśvinī', 'Bharaṇī', 'Kṛttikā', 'Rohiṇī', 'Mṛgaśīrṣa', 'Ārdrā', 'Punarvasu', 'Puṣya', 'Āśleṣā',
  'Maghā', 'Pūrva Phālgunī', 'Uttara Phālgunī', 'Hasta', 'Citrā', 'Svātī', 'Viśākhā', 'Anurādhā',
  'Jyeṣṭhā', 'Mūla', 'Pūrvāṣāḍhā', 'Uttarāṣāḍhā', 'Śravaṇa', 'Dhaniṣṭhā', 'Śatabhiṣā',
  'Pūrva Bhādrapadā', 'Uttara Bhādrapadā', 'Revatī',
];

export interface Station {
  number: number;       // 1–27
  name: string;
  fraction: number;     // 0–1 through the station
  pada: number;         // 1–4
  degreesToBoundary: number;
}

/** Sidereal Moon longitude → Axiomatic Station. */
export function station(moonSidereal: number): Station {
  const lon = ((moonSidereal % 360) + 360) % 360;
  const index = Math.min(26, Math.floor(lon / STATION_SPAN));
  const within = lon - index * STATION_SPAN;
  const fraction = within / STATION_SPAN;
  const toBoundary = Math.min(within, STATION_SPAN - within);
  return {
    number: index + 1,
    name: STATIONS[index],
    fraction,
    pada: Math.floor(fraction * 4) + 1,
    degreesToBoundary: Number(toBoundary.toFixed(2)),
  };
}

/* -------------------------------------------------------------------- APS */
/** The nine forces of the AA System, in the Codex's order, with period lengths. */
export const APS_LORDS = [
  { force: 'Sol', graha: 'Sun', years: 7 },
  { force: 'Luna', graha: 'Moon', years: 10 },
  { force: 'Ignis', graha: 'Mars', years: 7 },
  { force: 'Anka', graha: 'Rāhu', years: 13 },
  { force: 'Vastus', graha: 'Jupiter', years: 13 },
  { force: 'Kronos', graha: 'Saturn', years: 13 },
  { force: 'Logos', graha: 'Mercury', years: 13 },
  { force: 'Viksha', graha: 'Ketu', years: 7 },
  { force: 'Harmonia', graha: 'Venus', years: 8 },
]; // 7+10+7+13+13+13+13+7+8 = 91

export interface PeriodSegment {
  force: string;
  graha: string;
  years: number;
  startAge: number;
  endAge: number;
}

/** The 91-year Axiomatic Period System, from the station fraction. */
export function apsTimeline(st: Station): { segments: PeriodSegment[]; current: PeriodSegment; elapsed: number; remaining: number } {
  const lordIndex = (st.number - 1) % 9;          // stations 1,10,19 → Sol …
  const lord = APS_LORDS[lordIndex];
  const elapsed = st.fraction * lord.years;       // years already spent in the first period
  const segments: PeriodSegment[] = [];
  let age = -elapsed;                             // birth falls inside the first period
  for (let i = 0; i < 9; i += 1) {
    const l = APS_LORDS[(lordIndex + i) % 9];
    segments.push({ force: l.force, graha: l.graha, years: l.years, startAge: age, endAge: age + l.years });
    age += l.years;
  }
  const current = segments[0];
  return { segments, current, elapsed, remaining: lord.years - elapsed };
}

/** Sub-period length: (Dur(major) × Dur(sub)) / 91 years. */
export function subPeriodYears(major: number, sub: number): number {
  return (major * sub) / 91;
}

/* -------------------------------------------------------------------- PLY */
export function lifePath(day: number, month: number, year: number): number {
  return reduce13(day + month + digitSum(year));
}

export function personalLunarYear(day: number, month: number, year: number, targetYear: number): number {
  return reduce13(lifePath(day, month, year) + reduce13(digitSum(targetYear)));
}

export function personalLunarMonth(ply: number, month: number): number {
  return reduce13(ply + month);
}

export function personalLunarDay(plm: number, day: number): number {
  return reduce13(plm + day);
}

/* --------------------------------------------------------------- dignity */
/** Exaltation, moolatrikona, own and debilitation realms, from the Codex table. */
export const DIGNITY = [
  { force: 'Sol', graha: 'Sun', exalted: 1, moolatrikona: 5, own: [5, 9], debilitated: 7 },
  { force: 'Luna', graha: 'Moon', exalted: 2, moolatrikona: 4, own: [4], debilitated: 8 },
  { force: 'Ignis', graha: 'Mars', exalted: 10, moolatrikona: 1, own: [1, 8], debilitated: 4 },
  { force: 'Logos', graha: 'Mercury', exalted: 6, moolatrikona: 3, own: [3, 6], debilitated: 12 },
  { force: 'Vastus', graha: 'Jupiter', exalted: 4, moolatrikona: 9, own: [9, 12], debilitated: 10 },
  { force: 'Harmonia', graha: 'Venus', exalted: 12, moolatrikona: 7, own: [2, 7], debilitated: 6 },
  { force: 'Kronos', graha: 'Saturn', exalted: 7, moolatrikona: 11, own: [10, 11], debilitated: 1 },
  { force: 'Anka', graha: 'Rāhu', exalted: 3, moolatrikona: 11, own: [3, 11], debilitated: 9 },
  { force: 'Viksha', graha: 'Ketu', exalted: 9, moolatrikona: 12, own: [9, 12], debilitated: 3 },
];

/** Axiomatic Shadbala, as the Codex defines it. */
export function dignityScore(force: string, realm: number): number {
  const d = DIGNITY.find((x) => x.force === force);
  if (!d) return 45;
  if (realm === d.exalted) return 100;
  if (realm === d.moolatrikona) return 85;
  if (d.own.includes(realm)) return 70;
  if (realm === d.debilitated) return 10;
  return 45; // neutral, absent the friendship table
}

export const REALMS = [
  'Genesis', 'Endowment', 'Nexus', 'Hearth', 'Radiance', 'Calibration', 'Covenant',
  'Chrysalis', 'Horizon', 'Apex', 'Constellation', 'Abyss',
];

/* ------------------------------------------------------------------- moon */
/**
 * A compact lunar longitude (Meeus, truncated): good to about half a degree.
 * Enough for a 13.33° station except within half a degree of a boundary, and
 * the console says so when it happens.
 */
export function moonTropical(jd: number): number {
  const n = jd - 2451545.0;
  const L = 218.316 + 13.176396 * n;
  const M = ((134.963 + 13.064993 * n) * Math.PI) / 180;
  return ((L + 6.289 * Math.sin(M)) % 360 + 360) % 360;
}

export function julianDay(dateISO: string, hourUTC = 12): number {
  const [y, m, d] = dateISO.split('-').map(Number);
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  const jdn =
    d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) -
    Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
  return jdn + (hourUTC - 12) / 24;
}

/** Lahiri ayanāṃśa, close enough for a station lookup. */
export function ayanamsa(year: number): number {
  return 23.85 + 0.0139 * (year - 2000);
}

export function moonSidereal(dateISO: string, hourUTC = 12): { tropical: number; sidereal: number; ay: number } {
  const jd = julianDay(dateISO, hourUTC);
  const tropical = moonTropical(jd);
  const ay = ayanamsa(Number(dateISO.slice(0, 4)));
  return { tropical, sidereal: ((tropical - ay) % 360 + 360) % 360, ay };
}
