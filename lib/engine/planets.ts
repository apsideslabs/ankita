/**
 * Digit → graha. The Indian form of Cheiro's table: seven of the nine entries
 * are Cheiro's, and the two that named planets unknown to Indian astronomy
 * (Uranus 4, Neptune 7) are replaced by Rāhu and Ketu. Johari states the
 * substitution himself in *Numerology* (Destiny Books, 1990).
 */
export const NUMERAL_GRAHA: Record<number, { graha: string; sanskrit: string; note: string }> = {
  1: { graha: 'Sun', sanskrit: 'Sūrya', note: 'kinglike, authoritative, original' },
  2: { graha: 'Moon', sanskrit: 'Candra', note: 'responsive, changing, receptive' },
  3: { graha: 'Jupiter', sanskrit: 'Guru', note: 'counselling, expansive, disciplined' },
  4: { graha: 'Rāhu', sanskrit: 'Rāhu', note: 'abrupt, secretive, unconventional' },
  5: { graha: 'Mercury', sanskrit: 'Budha', note: 'quick, commercial, adaptable' },
  6: { graha: 'Venus', sanskrit: 'Śukra', note: 'sensual, diplomatic, aesthetic' },
  7: { graha: 'Ketu', sanskrit: 'Ketu', note: 'inward, intuitive, detached' },
  8: { graha: 'Saturn', sanskrit: 'Śani', note: 'laborious, slow, enduring' },
  9: { graha: 'Mars', sanskrit: 'Maṅgala', note: 'forceful, competitive, exacting' },
};

/** Natural (naiśargika) friendship of the grahas, the basis of the 9×9 matrix. */
type Rel = 'friend' | 'neutral' | 'enemy';
const BASE: Record<string, Record<string, Rel>> = {
  Sun:     { Moon: 'friend', Mars: 'friend', Jupiter: 'friend', Mercury: 'neutral', Venus: 'enemy', Saturn: 'enemy' },
  Moon:    { Sun: 'friend', Mercury: 'friend', Mars: 'neutral', Jupiter: 'neutral', Venus: 'neutral', Saturn: 'neutral' },
  Mars:    { Sun: 'friend', Moon: 'friend', Jupiter: 'friend', Venus: 'neutral', Saturn: 'neutral', Mercury: 'enemy' },
  Mercury: { Sun: 'friend', Venus: 'friend', Mars: 'neutral', Jupiter: 'neutral', Saturn: 'neutral', Moon: 'enemy' },
  Jupiter: { Sun: 'friend', Moon: 'friend', Mars: 'friend', Saturn: 'neutral', Mercury: 'enemy', Venus: 'enemy' },
  Venus:   { Mercury: 'friend', Saturn: 'friend', Mars: 'neutral', Jupiter: 'neutral', Sun: 'enemy', Moon: 'enemy' },
  Saturn:  { Mercury: 'friend', Venus: 'friend', Jupiter: 'neutral', Sun: 'enemy', Moon: 'enemy', Mars: 'enemy' },
  Rāhu:    { Venus: 'friend', Saturn: 'friend', Mercury: 'friend', Sun: 'enemy', Moon: 'enemy', Mars: 'enemy' },
  Ketu:    { Mars: 'friend', Venus: 'friend', Saturn: 'friend', Sun: 'enemy', Moon: 'enemy', Mercury: 'enemy' },
};

export function relation(a: number, b: number): Rel {
  if (a === b) return 'neutral';
  const ga = NUMERAL_GRAHA[a]?.graha;
  const gb = NUMERAL_GRAHA[b]?.graha;
  if (!ga || !gb) return 'neutral';
  return BASE[ga]?.[gb] ?? BASE[gb]?.[ga] ?? 'neutral';
}

/** The full 9×9 matrix, for rendering the table in the workspace. */
export function friendshipMatrix(): { a: number; row: Rel[] }[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((a) => ({
    a,
    row: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((b) => relation(a, b)),
  }));
}

export const RELATION_GLOSS: Record<Rel, string> = {
  friend: 'Harmonious. Support without friction.',
  neutral: 'Neither. Results follow effort.',
  enemy: 'Friction, delay, and mutual sharpening.',
};
