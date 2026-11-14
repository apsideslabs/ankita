import type { ProvenanceRef } from './types';

/**
 * The registry every output points back to. Aṅkita's rule: a number may be
 * printed only if the rule behind it is listed here, with its date.
 */
export const SOURCES: ProvenanceRef[] = [
  {
    id: 'input',
    label: 'Input parsing',
    source: 'The date and name exactly as entered; no correction, no rounding, no inferred data.',
    year: null,
    status: 'verified',
  },
  {
    id: 'modern-cycles',
    label: 'Personal year / month / day, 45-year cycle',
    source: 'Modern numerology literature. Arithmetic only — not a classical daśā, which is computed from the Moon.',
    year: null,
    status: 'attributed',
  },
  {
    id: 'cheiro-1926',
    label: 'Chaldean letter values',
    source: 'Cheiro, Book of Numbers, London 1926 — verified against its own worked example (John Smith → 17 → 8)',
    year: 1926,
    status: 'verified',
  },
  {
    id: 'cheiro-compound',
    label: 'Compound numbers 10–52',
    source: 'Cheiro, Book of Numbers, ch. XIII — the range stops at 52 by the author’s own design',
    year: 1926,
    status: 'verified',
  },
  {
    id: 'johari-1990',
    label: 'Digit → graha, Indian form',
    source: 'Harish Johari, Numerology (Destiny Books, 1990) — Rāhu 4 and Ketu 7 stated as the Indian variant of Uranus/Neptune',
    year: 1990,
    status: 'verified',
  },
  {
    id: 'johari-friends',
    label: 'Planetary friendship matrix',
    source: 'Johari, Numerology, summary of interaction between numbers; natural friendship of the grahas',
    year: 1990,
    status: 'verified',
  },
  {
    id: 'ojha-1977',
    label: 'Indian numerology practice',
    source: 'Gopesh Kumar Ojha, Aṅk-Vidyā (Motilal Banarsidass; reprints 1966–1982)',
    year: 1977,
    status: 'verified',
  },
  {
    id: 'loshu',
    label: 'Lo Shu grid',
    source: 'The Lo Shu square — Chinese in origin, entering Indian practice in the late twentieth century. Labelled, not naturalised.',
    year: null,
    status: 'attributed',
  },
  {
    id: 'kua',
    label: 'Kua number',
    source: 'Compass-school Feng Shui — Chinese. Two branches are implemented, 1900s and 2000s.',
    year: null,
    status: 'attributed',
  },
  {
    id: 'bhuta',
    label: 'Bhūtasaṅkhyā word-numerals',
    source: 'Piṅgala, Chandaḥsūtra (c. 2nd c. BCE) onward; standard word lists',
    year: null,
    status: 'verified',
  },
  {
    id: 'katapayadi',
    label: 'Kaṭapayādi consonant code',
    source: 'Haridatta, Grahacāraṇibandhana, 683 CE; definition in Sadratnamālā, 1819',
    year: 683,
    status: 'verified',
  },
  {
    id: 'namakshara',
    label: 'Nāmākṣara pada syllables',
    source: 'Gṛhya-sūtra naming custom, worked out in the muhūrta literature. Regional tables differ in two or three nakṣatras.',
    year: null,
    status: 'attributed',
  },
  {
    id: 'digits-unverified',
    label: 'Digit → graha as classical doctrine',
    source: 'No classical Sanskrit text has been found that links the digits 1–9 to the grahas. The pairing is twentieth-century.',
    year: null,
    status: 'unverified',
  },
];

export function sourceById(id: string): ProvenanceRef | undefined {
  return SOURCES.find((s) => s.id === id);
}
