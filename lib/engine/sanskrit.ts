/**
 * Three classical number-systems, offered as decoders rather than as
 * divination. All three are decimal, place-valued, and read from the units
 * upward under the rule aṅkānāṃ vāmato gatiḥ — the motion of numbers is to
 * the left.
 */

/* ------------------------------------------------------------------ bhūtasaṅkhyā */
/** Word-numerals: Piṅgala's Chandaḥsūtra is the earliest extensive use (c. 2nd c. BCE). */
export const BHUTA: Record<string, number> = {
  // zero
  kha: 0, nabhas: 0, ākāśa: 0, akasha: 0, randhra: 0, bindu: 0, śūnya: 0, shunya: 0, vyoma: 0,
  // one
  candra: 1, indu: 1, bhūmi: 1, bhumi: 1, vasudhā: 1, vasudha: 1, rūpa: 1, rupa: 1, ādi: 1,
  // two
  netra: 2, akṣi: 2, akshi: 2, hasta: 2, kara: 2, yamala: 2, aśvin: 2, ashvin: 2,
  // three
  agni: 3, guṇa: 3, guna: 3, rāma: 3, rama: 3, loka: 3, vahni: 3,
  // four
  veda: 4, samudra: 4, abdhi: 4, yuga: 4, varṇa: 4, varna: 4,
  // five
  bāṇa: 5, bana: 5, śara: 5, shara: 5, bhūta: 5, bhuta: 5, indriya: 5, prāṇa: 5, prana: 5,
  // six
  ṛtu: 6, rtu: 6, rasa: 6, aṅga: 6, anga: 6, ṣaṭka: 6,
  // seven
  muni: 7, ṛṣi: 7, rishi: 7, adri: 7, parvata: 7, svara: 7,
  // eight
  vasu: 8, nāga: 8, naga: 8, gaja: 8, siddhi: 8,
  // nine
  graha: 9, aṅka: 9, anka: 9, randhra9: 9, nidhi: 9, nanda: 9,
  // ten
  diś: 10, dik: 10, aṅguli: 10, anguli: 10, pāṅkti: 10,
};

export interface DecodeStep { word: string; digit: number | null }

/** Decode a hyphenated word-numeral phrase. Words are read units-first. */
export function decodeBhuta(phrase: string): { value: number | null; steps: DecodeStep[] } {
  const words = phrase.toLowerCase().split(/[-–—\s]+/).filter(Boolean);
  const steps: DecodeStep[] = words.map((w) => ({ word: w, digit: BHUTA[w] ?? null }));
  if (steps.some((s) => s.digit === null)) return { value: null, steps };
  // Words are given units-first, so the value is assembled in reverse order.
  const value = Number([...steps].reverse().map((s) => s.digit).join(''));
  return { value, steps };
}

/** Encode a number as word-numerals, units-first. */
export function encodeBhuta(n: number): string[] {
  const words: Record<number, string> = {
    0: 'ākāśa', 1: 'candra', 2: 'netra', 3: 'agni', 4: 'veda', 5: 'bāṇa',
    6: 'ṛtu', 7: 'muni', 8: 'vasu', 9: 'graha',
  };
  return String(Math.abs(Math.trunc(n))).split('').reverse().map((d) => words[Number(d)]);
}

/* ------------------------------------------------------------------ kaṭapayādi */
/** Consonant code of Kerala; earliest dated use Haridatta, 683 CE. */
const KATA_ROWS: [number, string[]][] = [
  [1, ['k', 'ṭ', 'p', 'y']],
  [2, ['kh', 'ṭh', 'ph', 'r']],
  [3, ['g', 'ḍ', 'b', 'l']],
  [4, ['gh', 'ḍh', 'bh', 'v']],
  [5, ['ṅ', 'ṇ', 'm', 'ś']],
  [6, ['c', 't', 'ṣ']],
  [7, ['ch', 'th', 's']],
  [8, ['j', 'd', 'h']],
  [9, ['jh', 'dh', 'ḷ']],
  [0, ['ñ', 'n']],
];

export const KATAPAYADI: Record<string, number> = {};
for (const [value, tokens] of KATA_ROWS) {
  for (const token of tokens) KATAPAYADI[token] = value;
}

const KATA_TOKENS = Object.keys(KATAPAYADI).sort((a, b) => b.length - a.length);

/** Decode a kaṭapayādi word. Vowels carry nothing; digits are read right to left. */
export function decodeKatapayadi(word: string): { value: number | null; steps: DecodeStep[] } {
  const text = [...word.toLowerCase()];
  const steps: DecodeStep[] = [];
  let i = 0;
  while (i < text.length) {
    let matched = false;
    for (const token of KATA_TOKENS) {
      const slice = text.slice(i, i + token.length).join('');
      if (slice === token) {
        steps.push({ word: token, digit: KATAPAYADI[token] });
        i += token.length;
        matched = true;
        break;
      }
    }
    if (!matched) i += 1;
  }
  if (!steps.length) return { value: null, steps };
  const value = Number(steps.map((s) => s.digit).reverse().join(''));
  return { value, steps };
}

/* ------------------------------------------------------------------ nāmākṣara */
/**
 * The 108 pada syllables. This is the classical naming rule: the Moon's
 * nakṣatra and pada select a *sound*, not a number. Regional tables differ for
 * two or three nakṣatras; where a family has an almanac, that almanac wins.
 */
export const NAKSHATRA_PADAS: { name: string; padas: [string, string, string, string]; variant?: boolean }[] = [
  { name: 'Aśvinī', padas: ['cu', 'ce', 'co', 'lā'] },
  { name: 'Bharaṇī', padas: ['lī', 'lu', 'le', 'lo'] },
  { name: 'Kṛttikā', padas: ['a', 'ī', 'u', 'e'] },
  { name: 'Rohiṇī', padas: ['o', 'vā', 'vī', 'vū'] },
  { name: 'Mṛgaśīrṣa', padas: ['ve', 'vo', 'kā', 'kī'] },
  { name: 'Ārdrā', padas: ['ku', 'gha', 'ṅa', 'cha'] },
  { name: 'Punarvasu', padas: ['ke', 'ko', 'hā', 'hī'] },
  { name: 'Puṣya', padas: ['hu', 'he', 'ho', 'ḍā'] },
  { name: 'Āśleṣā', padas: ['ḍī', 'ḍū', 'ḍe', 'ḍo'] },
  { name: 'Maghā', padas: ['mā', 'mī', 'mū', 'me'] },
  { name: 'Pūrva Phālgunī', padas: ['mo', 'ṭā', 'ṭī', 'ṭū'] },
  { name: 'Uttara Phālgunī', padas: ['ṭe', 'ṭo', 'pā', 'pī'] },
  { name: 'Hasta', padas: ['pū', 'ṣa', 'ṇa', 'ṭha'] },
  { name: 'Citrā', padas: ['pe', 'po', 'rā', 'rī'] },
  { name: 'Svātī', padas: ['rū', 're', 'ro', 'tā'] },
  { name: 'Viśākhā', padas: ['tī', 'tū', 'te', 'to'] },
  { name: 'Anurādhā', padas: ['nā', 'nī', 'nū', 'ne'] },
  { name: 'Jyeṣṭhā', padas: ['no', 'yā', 'yī', 'yū'] },
  { name: 'Mūla', padas: ['ye', 'yo', 'bhā', 'bhī'] },
  { name: 'Pūrvāṣāḍhā', padas: ['bhū', 'dhā', 'phā', 'ḍhā'] },
  { name: 'Uttarāṣāḍhā', padas: ['bhe', 'bho', 'jā', 'jī'] },
  { name: 'Śravaṇa', padas: ['khī', 'khū', 'khe', 'kho'], variant: true },
  { name: 'Dhaniṣṭhā', padas: ['gā', 'gī', 'gū', 'ge'] },
  { name: 'Śatabhiṣā', padas: ['go', 'sā', 'sī', 'sū'] },
  { name: 'Pūrva Bhādrapadā', padas: ['se', 'so', 'dā', 'dī'] },
  { name: 'Uttara Bhādrapadā', padas: ['dū', 'tha', 'jha', 'ña'] },
  { name: 'Revatī', padas: ['de', 'do', 'cha', 'chī'] },
];

/** Total span of a nakṣatra and a pada, in degrees. */
export const NAKSHATRA_SPAN = 360 / 27;
export const PADA_SPAN = NAKSHATRA_SPAN / 4;

/** Moon longitude (0–360, sidereal) → nakṣatra and pada, 1-indexed. */
export function padaForLongitude(longitude: number): { index: number; pada: number; name: string; syllable: string } {
  const norm = ((longitude % 360) + 360) % 360;
  const index = Math.min(26, Math.floor(norm / NAKSHATRA_SPAN));
  const pada = Math.min(4, Math.floor((norm % NAKSHATRA_SPAN) / PADA_SPAN) + 1);
  const n = NAKSHATRA_PADAS[index];
  return { index, pada, name: n.name, syllable: n.padas[pada - 1] };
}
