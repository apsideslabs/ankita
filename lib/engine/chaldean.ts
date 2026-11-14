/**
 * Chaldean letter values, as printed in Cheiro, *Book of Numbers* (London, 1926).
 * Verified against the book's own worked example: John Smith → 9 and 8 → 17 → 8.
 * The digit 9 is deliberately unassigned; Cheiro's reason is that nine letters
 * spell the name of God. That is his reason, not an Indian one.
 */
export const CHALDEAN: Record<string, number> = {
  A: 1, I: 1, J: 1, Q: 1, Y: 1,
  B: 2, K: 2, R: 2,
  C: 3, G: 3, L: 3, S: 3,
  D: 4, M: 4, T: 4,
  E: 5, H: 5, N: 5, X: 5,
  U: 6, V: 6, W: 6,
  O: 7, Z: 7,
  F: 8, P: 8,
};

export const CHALDEAN_COLUMNS: { value: number; letters: string[] }[] = [
  { value: 1, letters: ['A', 'I', 'J', 'Q', 'Y'] },
  { value: 2, letters: ['B', 'K', 'R'] },
  { value: 3, letters: ['C', 'G', 'L', 'S'] },
  { value: 4, letters: ['D', 'M', 'T'] },
  { value: 5, letters: ['E', 'H', 'N', 'X'] },
  { value: 6, letters: ['U', 'V', 'W'] },
  { value: 7, letters: ['O', 'Z'] },
  { value: 8, letters: ['F', 'P'] },
];

export function letterValue(ch: string): number {
  return CHALDEAN[ch.toUpperCase()] ?? 0;
}

/** Letters that carry a value, in order, with the value of each. */
export function breakdown(name: string): { letter: string; value: number }[] {
  return name
    .toUpperCase()
    .split('')
    .filter((ch) => /[A-Z]/.test(ch))
    .map((letter) => ({ letter, value: letterValue(letter) }));
}

export function nameSum(name: string): number {
  return breakdown(name).reduce((sum, b) => sum + b.value, 0);
}

/**
 * The compound of a name as Cheiro computes it: each word is reduced first, and
 * the reduced values are then summed. John Smith → 9 + 8 = 17, which is the
 * figure his book prints.
 */
export function nameCompound(name: string): number {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const total = breakdown(word).reduce((sum, b) => sum + b.value, 0);
      let v = total;
      while (v > 9) v = String(v).split('').reduce((a, c) => a + Number(c), 0);
      return v;
    })
    .reduce((a, b) => a + b, 0);
}

/**
 * Compound-number glosses, 10–52. These are short summaries in our own words,
 * not transcriptions of Cheiro's chapter. The range stops at 52 because the
 * book stops there — "the 52 weeks of our year".
 */
export const COMPOUND_GLOSS: Record<number, string> = {
  10: 'Rise and fall in a single arc; the wheel turns twice.',
  11: 'A warning number: hidden conflict, and strength found in resisting it.',
  12: 'Sacrifice and enclosure; growth that needs a boundary.',
  13: 'Change of plan, not of fortune; the old order breaks usefully.',
  14: 'Movement, trade and communication; gain through variety.',
  15: 'Eloquence and magnetism; the risk is persuasion without substance.',
  16: 'A sudden collapse of a structure built on the wrong foundation.',
  17: 'Immortality of the name; the classic number of the artist who outlives the age.',
  18: 'Material struggle against spiritual insight; the sword and the mirror.',
  19: 'The sun at noon: honour, and the danger of standing too high.',
  20: 'Awakening after delay; a call to a purpose larger than the self.',
  21: 'The crown won after a long contest; victory that must be maintained.',
  22: 'The man in the cage: insight that is imprisoned by circumstance.',
  23: 'The star of the lion: success through patronage and the help of others.',
  24: 'The web of love and protection; a fortunate number for partnership.',
  25: 'Strength won by experience rather than by gift.',
  26: 'Counsel that profits others more than the giver.',
  27: 'The sceptre: authority exercised through creative command.',
  28: 'Promise that outruns the harvest; gain expected but not assured.',
  29: 'Trials of the spirit, with unexpected help arriving late.',
  30: 'Reflective contemplation; fortune follows thought, not action.',
  31: 'The hermit: self-contained, and often solitary in success.',
  32: 'Fellowship in numbers; fortune shared is fortune kept.',
  33: 'The number of the teacher; knowledge that must be given away.',
  34: 'The number of the sage, whose counsel outlives him.',
  35: 'Depth of mind and long memory; the burden of carrying both.',
  36: 'The wide circle; prosperity through many small loyalties.',
  37: 'Love of the whole; friendship that becomes a fortune.',
  38: 'The astral number: subtle forces, and gains that arrive quietly.',
  39: 'The sceptic who is forced to believe; insight after resistance.',
  40: 'The column: endurance, and a strength that does not bend.',
  41: 'The magician: power over circumstance, and the duty that comes with it.',
  42: 'The heart of the community; prosperity through service.',
  43: 'Revolution from within; the old life ends to make the new one.',
  44: 'The quiet builder; the same strength as 26 but turned outward.',
  45: 'The eagle: far sight, and gain through long perspective.',
  46: 'The great harvest; comfort won by effort over many years.',
  47: 'The widow: strength discovered after loss.',
  48: 'The judge: authority, and the cost of using it well.',
  49: 'The long war; victory through persistence rather than force.',
  50: 'The wheel of fortune; a number of turning points.',
  51: 'The warrior: sudden advancement, and the enemies that come with it.',
  52: 'The same as 43: a closing of one arc and the opening of the next.',
};

export function compoundMeaning(compound: number): string {
  if (compound >= 10 && compound <= 52) return COMPOUND_GLOSS[compound] ?? '';
  return '';
}
