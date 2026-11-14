/**
 * The reading layer. Two kinds of statement live here and they are kept apart:
 *
 *  - The *correspondences* (planet, day, colour, gemstone, mantra, direction)
 *    are classical navagraha material, stable across the tradition.
 *  - The *character readings* are summaries of what the modern literature
 *    teaches for each number. They are marked "attributed" in the provenance
 *    registry, because no classical verse says them.
 */

export interface NumberReading {
  n: number;
  title: string;
  nature: string;
  strengths: string[];
  watch: string[];
  careers: string[];
  day: string;
  colours: string[];
  gemstone: string;
  mantra: string;
  direction: string;
  body: string;
}

export const READINGS: Record<number, NumberReading> = {
  1: {
    n: 1, title: 'The Sun', nature: 'Authority that is given rather than taken. Number 1 people are asked to lead before they feel ready, and the whole reading turns on how they carry that.',
    strengths: ['starts things without waiting for permission', 'holds a position under pressure', 'says the unpopular thing plainly'],
    watch: ['pride that mistakes being obeyed for being right', 'impatience with anyone slower', 'taking the credit alone'],
    careers: ['government and administration', 'founder or chief executive', 'medicine and surgery', 'anything with a title attached'],
    day: 'Sunday', colours: ['copper red', 'saffron', 'gold'],
    gemstone: 'ruby (māṇikya)', mantra: 'Om Sūryāya Namaḥ', direction: 'east',
    body: 'heart, bones, right eye — the parts a Sun-dominant constitution tires first',
  },
  2: {
    n: 2, title: 'The Moon', nature: 'Receptivity. Number 2 reads a room before anyone speaks, and pays for it with a mind that will not settle at night.',
    strengths: ['notices what others miss', 'adapts without losing the thread', 'keeps the peace without pretending'],
    watch: ['mood deciding what is true', 'over-accommodating, then resenting it', 'sleep and nerves'],
    careers: ['counselling and care', 'writing and editing', 'hospitality', 'anything where listening is the skill'],
    day: 'Monday', colours: ['white', 'cream', 'silver'],
    gemstone: 'pearl (mauktika)', mantra: 'Om Somāya Namaḥ', direction: 'north-west',
    body: 'fluids, lungs, left eye — a lunar constitution shows in sleep and digestion',
  },
  3: {
    n: 3, title: 'Jupiter', nature: 'The teacher. Number 3 accumulates knowledge and is expected to hand it on, whether or not anyone asked.',
    strengths: ['sees the principle under the example', 'generous with what it knows', 'keeps faith when the evidence is thin'],
    watch: ['preaching instead of practising', 'over-promising on a wide horizon', 'weight and indulgence'],
    careers: ['teaching and law', 'counselling and clergy', 'publishing', 'advisory work'],
    day: 'Thursday', colours: ['yellow', 'turmeric', 'deep gold'],
    gemstone: 'yellow sapphire (puṣparāga)', mantra: 'Om Gurave Namaḥ', direction: 'north-east',
    body: 'liver, fat metabolism, thighs — Jupiter types expand where they should not',
  },
  4: {
    n: 4, title: 'Rāhu', nature: 'The eclipse. Number 4 works against the grain of its own century, and often succeeds precisely because it will not take the obvious route.',
    strengths: ['unorthodox method that works', 'indifference to approval', 'finds the loophole in a system'],
    watch: ['secrecy that becomes isolation', 'sudden reversals of plan', 'obsession mistaken for discipline'],
    careers: ['research and engineering', 'technology and cryptography', 'foreign work', 'anything unfashionable that turns out to be right'],
    day: 'Saturday (Rāhu kāla)', colours: ['smoky blue', 'grey', 'charcoal'],
    gemstone: 'hessonite (gomedaka)', mantra: 'Om Rāhave Namaḥ', direction: 'south-west',
    body: 'nerves, breath, unexplained symptoms — the eclipse is felt rather than seen',
  },
  5: {
    n: 5, title: 'Mercury', nature: 'The centre of the square. Number 5 stands between the planes and is expected to move between them — speech, trade, calculation.',
    strengths: ['quick to grasp and quicker to explain', 'finds the deal in a conversation', 'adapts register to audience'],
    watch: ['cleverness standing in for depth', 'scattered attention', 'saying the useful thing rather than the true one'],
    careers: ['commerce and brokerage', 'writing, journalism, editing', 'analysis and accounting', 'software'],
    day: 'Wednesday', colours: ['green', 'emerald', 'light grey'],
    gemstone: 'emerald (marakata)', mantra: 'Om Budhāya Namaḥ', direction: 'north',
    body: 'skin, speech, nervous system — Mercury types burn out through the mind first',
  },
  6: {
    n: 6, title: 'Venus', nature: 'The household. Number 6 is read through home, taste and the people it keeps, and it is rarely happy in a life it cannot make beautiful.',
    strengths: ['makes a place worth living in', 'loyal beyond convenience', 'negotiates without humiliation'],
    watch: ['comfort turning into inertia', 'indulgence', 'loving people as projects'],
    careers: ['design, art, music', 'hospitality and food', 'luxury and retail', 'family business'],
    day: 'Friday', colours: ['white', 'rose', 'pastel blue'],
    gemstone: 'diamond (vajra)', mantra: 'Om Śukrāya Namaḥ', direction: 'south-east',
    body: 'kidneys, throat, reproductive system — Venus types feel imbalance as depletion',
  },
  7: {
    n: 7, title: 'Ketu', nature: 'The flag without a pole. Number 7 is detached from what it is good at, and the reading is usually about what it cannot make itself want.',
    strengths: ['sees through an argument', 'unimpressed by status', 'depth in one narrow thing'],
    watch: ['withdrawal read as coldness', 'starting again to avoid finishing', 'doubt that arrives after the decision'],
    careers: ['research and the laboratory', 'spiritual and philosophical work', 'diagnostics', 'anything solitary and exacting'],
    day: 'Tuesday (Ketu kāla)', colours: ['grey', 'brown', 'multi-toned'],
    gemstone: "cat's eye (vaidūrya)", mantra: 'Om Ketave Namaḥ', direction: 'west',
    body: 'abdomen, immunity, the vague complaint — Ketu is the symptom without a test result',
  },
  8: {
    n: 8, title: 'Saturn', nature: 'The slow creditor. Number 8 is paid late and in full; almost everything it is given arrives after the patience has been earned.',
    strengths: ['endures what others abandon', 'keeps a system running', 'accurate about money and time'],
    watch: ['delay internalised as unworthiness', 'harshness with the self first', 'labour without rest'],
    careers: ['law and administration', 'industry and manufacturing', 'land and property', 'audit and compliance'],
    day: 'Saturday', colours: ['black', 'deep blue', 'iron grey'],
    gemstone: 'blue sapphire (nīlam)', mantra: 'Om Śanaiścarāya Namaḥ', direction: 'west',
    body: 'joints, teeth, chronic conditions — Saturn teaches through the body’s slow parts',
  },
  9: {
    n: 9, title: 'Mars', nature: 'The edge. Number 9 fights, and the reading is about whether the fight is chosen or reflexive.',
    strengths: ['acts while others deliberate', 'physically brave', 'exacting standards'],
    watch: ['temper that arrives before the facts', 'conflict for its own sake', 'injury through haste'],
    careers: ['engineering and defence', 'surgery', 'sport', 'anything with a deadline and a risk'],
    day: 'Tuesday', colours: ['red', 'coral', 'brick'],
    gemstone: 'red coral (pravāla)', mantra: 'Om Maṅgalāya Namaḥ', direction: 'south',
    body: 'blood, muscle, inflammation — Mars types overheat before they notice',
  },
};

/** What a missing cell in the square is traditionally taken to ask for. */
export const MISSING_READING: Record<number, string> = {
  1: 'confidence and the willingness to be seen — practise stating a position before you are sure of it.',
  2: 'emotional expression and partnership — practise saying the feeling rather than managing it.',
  3: 'learning and imagination — practise reading something difficult on a schedule.',
  4: 'order and method — practise routines that survive a bad week.',
  5: 'balance and exchange — practise finishing a conversation you would rather leave.',
  6: 'home and belonging — practise making time for the people you claim to prioritise.',
  7: 'reflection and detachment — practise sitting with a question instead of answering it.',
  8: 'discipline and money management — practise saving before spending, and waiting before deciding.',
  9: 'energy and courage — practise the difficult action rather than the urgent one.',
};

/** Repeated digits: what an amplified number is traditionally said to tip into. */
export const REPEATED_READING: Record<number, string> = {
  1: 'a strong voice that can become a monologue.',
  2: 'deep sensitivity that can become mood.',
  3: 'wide learning that can become lecture.',
  4: 'method that can become rigidity.',
  5: 'quickness that can become scatter.',
  6: 'devotion that can become possession.',
  7: 'detachment that can become absence.',
  8: 'endurance that can become grimness.',
  9: 'force that can become friction.',
};

/** Harmony triangle: the three pairwise relations, read in one line each. */
export const PAIR_READING: Record<'friend' | 'neutral' | 'enemy', string> = {
  friend: 'They support each other: what one wants, the other is willing to allow.',
  neutral: 'They neither help nor obstruct; the outcome follows effort rather than affinity.',
  enemy: 'They sharpen each other. Friction here is productive if it is named, and corrosive if it is not.',
};
