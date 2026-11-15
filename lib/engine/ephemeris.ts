/**
 * A compact ephemeris: the nine grahas, geocentric, tropical, from truncated
 * orbital elements. Accuracy is about 0.1° for the Sun, 0.3° for the Moon and
 * roughly 1° for the planets — enough for a sign, a nakṣatra and a pada, which
 * is the resolution this platform reads at. It is not a Swiss Ephemeris and
 * does not claim to be: the panel prints the uncertainty.
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function rev(x: number): number {
  return ((x % 360) + 360) % 360;
}

/** Lahiri ayanāṃśa. */
export function ayanamsa(jd: number): number {
  const year = 2000 + (jd - 2451545) / 365.25;
  return 23.85 + 0.0139 * (year - 2000);
}

/* ---------------------------------------------------------------- the Sun */
export function sunLongitude(jd: number): number {
  const d = jd - 2451543.5;
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = rev(356.047 + 0.9856002585 * d);
  const E = M + (e * R2D) * Math.sin(M * D2R) * (1 + e * Math.cos(M * D2R));
  const xv = Math.cos(E * D2R) - e;
  const yv = Math.sqrt(1 - e * e) * Math.sin(E * D2R);
  const v = Math.atan2(yv, xv) * R2D;
  return rev(v + w);
}

/* --------------------------------------------------------------- the Moon */
export function moonLongitude(jd: number): number {
  const d = jd - 2451543.5;
  const N = rev(125.1228 - 0.0529538083 * d);
  const i = 5.1454;
  const w = rev(318.0634 + 0.1643573223 * d);
  const a = 60.2666;
  const e = 0.0549;
  const M = rev(115.3654 + 13.0649929509 * d);

  let E = M + (e * R2D) * Math.sin(M * D2R) * (1 + e * Math.cos(M * D2R));
  for (let k = 0; k < 3; k += 1) {
    E = E - (E - (e * R2D) * Math.sin(E * D2R) - M) / (1 - e * Math.cos(E * D2R));
  }
  const xv = a * (Math.cos(E * D2R) - e);
  const yv = a * (Math.sqrt(1 - e * e) * Math.sin(E * D2R));
  const v = Math.atan2(yv, xv) * R2D;
  const r = Math.sqrt(xv * xv + yv * yv);

  const vw = v + w;
  const xh = r * (Math.cos(N * D2R) * Math.cos(vw * D2R) - Math.sin(N * D2R) * Math.sin(vw * D2R) * Math.cos(i * D2R));
  const yh = r * (Math.sin(N * D2R) * Math.cos(vw * D2R) + Math.cos(N * D2R) * Math.sin(vw * D2R) * Math.cos(i * D2R));
  const zh = r * (Math.sin(vw * D2R) * Math.sin(i * D2R));

  let lon = Math.atan2(yh, xh) * R2D;

  // Principal perturbations — the terms that move the Moon most.
  const Ms = rev(356.047 + 0.9856002585 * d);
  const Mm = M;
  const Ls = rev(282.9404 + 4.70935e-5 * d + Ms);
  const Lm = rev(N + w + M);
  const D = rev(Lm - Ls);
  const F = rev(Lm - N);

  lon += -1.274 * Math.sin((Mm - 2 * D) * D2R);
  lon += 0.658 * Math.sin(2 * D * D2R);
  lon += -0.186 * Math.sin(Ms * D2R);
  lon += -0.059 * Math.sin((2 * Mm - 2 * D) * D2R);
  lon += -0.057 * Math.sin((Mm - 2 * D + Ms) * D2R);
  lon += 0.053 * Math.sin((Mm + 2 * D) * D2R);
  lon += 0.046 * Math.sin((2 * D - Ms) * D2R);
  lon += -0.041 * Math.sin((Mm - Ms) * D2R);
  lon += -0.035 * Math.sin(D * D2R);
  lon += -0.031 * Math.sin((Mm + Ms) * D2R);
  lon += -0.015 * Math.sin((2 * F - 2 * D) * D2R);
  lon += 0.011 * Math.sin((Mm - 4 * D) * D2R);

  return rev(lon);
}

/* ------------------------------------------------------------ the planets */
interface Elements {
  N: [number, number]; i: [number, number]; w: [number, number];
  a: number; e: [number, number]; M: [number, number];
}

const ELEMENTS: Record<string, Elements> = {
  Mercury: { N: [48.3313, 3.24587e-5], i: [7.0047, 5.0e-8], w: [29.1241, 1.01444e-5], a: 0.387098, e: [0.205635, 5.59e-10], M: [168.6562, 4.0923344368] },
  Venus:   { N: [76.6799, 2.4659e-5],  i: [3.3946, 2.75e-8], w: [54.891, 1.38374e-5],  a: 0.72333,  e: [0.006773, -1.302e-9], M: [48.0052, 1.6021302244] },
  Mars:    { N: [49.5574, 2.11081e-5], i: [1.8497, -1.78e-8], w: [286.5016, 2.92961e-5], a: 1.523688, e: [0.093405, 2.516e-9], M: [18.6021, 0.5240207766] },
  Jupiter: { N: [100.4542, 2.76854e-5], i: [1.303, -1.557e-7], w: [273.8777, 1.64505e-5], a: 5.20256, e: [0.048498, 4.469e-9], M: [19.895, 0.0830853001] },
  Saturn:  { N: [113.6634, 2.3898e-5], i: [2.4886, -1.081e-7], w: [339.3939, 2.97661e-5], a: 9.55475, e: [0.055546, -9.499e-9], M: [316.967, 0.0334442282] },
};

const EARTH: Elements = { N: [0, 0], i: [0, 0], w: [282.9404, 4.70935e-5], a: 1.0, e: [0.016709, -1.151e-9], M: [356.047, 0.9856002585] };

function heliocentric(el: Elements, d: number, flip = false): { x: number; y: number; z: number } {
  const N = rev(el.N[0] + el.N[1] * d);
  const i = el.i[0] + el.i[1] * d;
  const w = rev(el.w[0] + el.w[1] * d);
  const a = el.a;
  const e = el.e[0] + el.e[1] * d;
  const M = rev(el.M[0] + el.M[1] * d);

  let E = M + (e * R2D) * Math.sin(M * D2R) * (1 + e * Math.cos(M * D2R));
  for (let k = 0; k < 5; k += 1) {
    E = E - (E - (e * R2D) * Math.sin(E * D2R) - M) / (1 - e * Math.cos(E * D2R));
  }
  const xv = a * (Math.cos(E * D2R) - e);
  const yv = a * (Math.sqrt(1 - e * e) * Math.sin(E * D2R));
  const v = Math.atan2(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);

  // The Earth elements are the Sun's, seen from Earth; the Earth's own
  // heliocentric position is that longitude turned through 180°.
  const vw = v + w * D2R + (flip ? Math.PI : 0);
  const x = r * (Math.cos(N * D2R) * Math.cos(vw) - Math.sin(N * D2R) * Math.sin(vw) * Math.cos(i * D2R));
  const y = r * (Math.sin(N * D2R) * Math.cos(vw) + Math.cos(N * D2R) * Math.sin(vw) * Math.cos(i * D2R));
  const z = r * (Math.sin(vw) * Math.sin(i * D2R));
  return { x, y, z };
}

/**
 * Jupiter and Saturn pull on each other; without the great-inequality terms
 * their positions drift by several degrees. These are the standard corrections.
 */
function perturb(name: string, lon: number, d: number): number {
  const Mj = rev(19.895 + 0.0830853001 * d) * D2R;
  const Ms = rev(316.967 + 0.0334442282 * d) * D2R;
  if (name === 'Jupiter') {
    return lon
      - 0.332 * Math.sin(2 * Mj - 5 * Ms - 67.6 * D2R)
      - 0.056 * Math.sin(2 * Mj - 2 * Ms + 21 * D2R)
      + 0.042 * Math.sin(3 * Mj - 5 * Ms + 21 * D2R)
      - 0.036 * Math.sin(Mj - 2 * Ms)
      + 0.022 * Math.cos(Mj - Ms)
      + 0.023 * Math.sin(2 * Mj - 3 * Ms + 52 * D2R)
      - 0.016 * Math.sin(Mj - 5 * Ms - 69 * D2R);
  }
  if (name === 'Saturn') {
    return lon
      + 0.812 * Math.sin(2 * Mj - 5 * Ms - 67.6 * D2R)
      - 0.229 * Math.cos(2 * Mj - 4 * Ms - 2 * D2R)
      + 0.119 * Math.sin(Mj - 2 * Ms - 3 * D2R)
      + 0.046 * Math.sin(2 * Mj - 6 * Ms - 69 * D2R)
      + 0.014 * Math.sin(Mj - 3 * Ms + 32 * D2R);
  }
  return lon;
}

export function planetLongitude(name: keyof typeof ELEMENTS, jd: number): number {
  const d = jd - 2451543.5;
  const earth = heliocentric(EARTH, d, true);
  const p = heliocentric(ELEMENTS[name], d);

  let x = p.x - earth.x;
  let y = p.y - earth.y;
  let lon = Math.atan2(y, x) * R2D;

  if (name === 'Jupiter' || name === 'Saturn') {
    const r = Math.sqrt(x * x + y * y);
    const corrected = perturb(name, lon, d) * D2R;
    x = r * Math.cos(corrected);
    y = r * Math.sin(corrected);
  }
  return rev(Math.atan2(y, x) * R2D);
}

/** Mean lunar node — Rāhu. Ketu is exactly opposite. */
export function rahuLongitude(jd: number): number {
  const d = jd - 2451543.5;
  return rev(125.1228 - 0.0529538083 * d);
}

/* ------------------------------------------------------------------ signs */
export const RASHIS = [
  'Meṣa', 'Vṛṣabha', 'Mithuna', 'Karka', 'Siṃha', 'Kanyā',
  'Tulā', 'Vṛścika', 'Dhanu', 'Makara', 'Kumbha', 'Mīna',
];

export const GRAHAS = [
  { key: 'Sun', name: 'Sūrya', abbr: 'Su' },
  { key: 'Moon', name: 'Candra', abbr: 'Mo' },
  { key: 'Mars', name: 'Maṅgala', abbr: 'Ma' },
  { key: 'Mercury', name: 'Budha', abbr: 'Bu' },
  { key: 'Jupiter', name: 'Guru', abbr: 'Gu' },
  { key: 'Venus', name: 'Śukra', abbr: 'Śu' },
  { key: 'Saturn', name: 'Śani', abbr: 'Śa' },
  { key: 'Rahu', name: 'Rāhu', abbr: 'Rā' },
  { key: 'Ketu', name: 'Ketu', abbr: 'Ke' },
] as const;

export interface Placement {
  key: string;
  name: string;
  abbr: string;
  longitude: number;   // sidereal
  tropical: number;
  sign: number;        // 1–12
  signName: string;
  degreeInSign: number;
  nakshatra: number;   // 1–27
  pada: number;
  retrograde: boolean;
}

const NAK = 360 / 27;

export function placement(key: string, name: string, abbr: string, jd: number, ay: number): Placement {
  const tropical = key === 'Sun' ? sunLongitude(jd)
    : key === 'Moon' ? moonLongitude(jd)
    : key === 'Rahu' ? rahuLongitude(jd)
    : key === 'Ketu' ? rev(rahuLongitude(jd) + 180)
    : planetLongitude(key as keyof typeof ELEMENTS, jd);

  const sidereal = rev(tropical - ay);
  const sign = Math.floor(sidereal / 30) + 1;
  const nak = Math.floor(sidereal / NAK) + 1;
  const pada = Math.floor((sidereal % NAK) / (NAK / 4)) + 1;

  const tomorrow = key === 'Sun' ? sunLongitude(jd + 1)
    : key === 'Moon' ? moonLongitude(jd + 1)
    : key === 'Rahu' ? rahuLongitude(jd + 1)
    : key === 'Ketu' ? rev(rahuLongitude(jd + 1) + 180)
    : planetLongitude(key as keyof typeof ELEMENTS, jd + 1);

  return {
    key, name, abbr,
    longitude: Number(sidereal.toFixed(2)),
    tropical: Number(tropical.toFixed(2)),
    sign,
    signName: RASHIS[sign - 1],
    degreeInSign: Number((sidereal % 30).toFixed(2)),
    nakshatra: nak,
    pada,
    retrograde: key !== 'Sun' && key !== 'Moon' && key !== 'Rahu' && key !== 'Ketu'
      ? rev(tomorrow - tropical) > 180
      : false,
  };
}

export function allPlacements(jd: number): Placement[] {
  const ay = ayanamsa(jd);
  return GRAHAS.map((g) => placement(g.key, g.name, g.abbr, jd, ay));
}

/** Whole-sign houses from a rāśi: 1 = the sign itself. */
export function houseFrom(fromSign: number, sign: number): number {
  return ((sign - fromSign + 12) % 12) + 1;
}
