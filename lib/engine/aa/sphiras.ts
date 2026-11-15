/**
 * The 13 Sphiras, transcribed from the Axiom Arcana master table:
 * core meaning, zodiac resonance, planetary vector, element, traits, shadow,
 * realms and keywords.
 */
export interface Sphira {
  n: number;
  name: string;
  core: string;
  zodiac: string;
  planet: string;
  element: string;
  traits: string;
  shadow: string;
  realms: string;
  keywords: string[];
}

export const SPHIRAS: Sphira[] = [
  { n: 1, name: 'Origin', core: 'Vital Core · Self-Seed', zodiac: 'Leo-like (radiant centre)', planet: 'Sun',
    element: 'Solar / Fire', traits: 'Identity, will, life-force, initiation', shadow: 'narcissism, over-centralisation',
    realms: 'birth, authority, initiation', keywords: ['core', 'seed', 'signature'] },
  { n: 2, name: 'Reflection', core: 'Emotions · Rhythm', zodiac: 'Cancer-like (rhythm and nurture)', planet: 'Moon',
    element: 'Tidal / Water', traits: 'Intuition, home, feeling, rhythm', shadow: 'moodiness, insecurity',
    realms: 'private life, instincts', keywords: ['pulse', 'reflection', 'comfort'] },
  { n: 3, name: 'Action', core: 'Motion · Will', zodiac: 'Aries-like (drive)', planet: 'Mercury',
    element: 'Kinetic / Air–Fire', traits: 'Initiative, skill, communication-as-action', shadow: 'impulsivity, scattered force',
    realms: 'siblings, short journeys, skill', keywords: ['move', 'spark', 'gesture'] },
  { n: 4, name: 'Thought', core: 'Logic · Communication', zodiac: 'Gemini / Virgo resonance', planet: 'Venus',
    element: 'Mental / Air', traits: 'Analysis, language, ideas, structures', shadow: 'over-logic, detachment',
    realms: 'learning, speech, contracts', keywords: ['reason', 'code', 'discourse'] },
  { n: 5, name: 'Expansion', core: 'Learning · Faith', zodiac: 'Sagittarius-like (growth)', planet: 'Mars',
    element: 'Exploratory / Fire', traits: 'Education, belief, teaching, travel', shadow: 'dogmatism, reckless expansion',
    realms: 'higher learning, publishing', keywords: ['quest', 'expansion', 'belief'] },
  { n: 6, name: 'Harmony', core: 'Love · Relationships', zodiac: 'Libra-like (pairing)', planet: 'Jupiter',
    element: 'Relational / Aether', traits: 'Partnership, ethics, collaboration', shadow: 'co-dependence, excess optimism',
    realms: 'marriage, business partnerships', keywords: ['bond', 'harmony', 'alliance'] },
  { n: 7, name: 'Discipline', core: 'Structure · Responsibility', zodiac: 'Capricorn-like (structure)', planet: 'Saturn',
    element: 'Structural / Earth', traits: 'Duty, career, long-term work', shadow: 'rigidity, fear of failure',
    realms: 'career, reputation, service', keywords: ['duty', 'form', 'discipline'] },
  { n: 8, name: 'Transformation', core: 'Depth · Karma', zodiac: 'Scorpio-like (depth)', planet: 'Uranus',
    element: 'Underflow / Plasmic', traits: 'Intimacy, rebirth, shared resources', shadow: 'obsession, destructive intensity',
    realms: 'death and rebirth, shared finance', keywords: ['bind', 'transform', 'release'] },
  { n: 9, name: 'Innovation', core: 'Rebellion · Evolution', zodiac: 'Aquarius-like (innovation)', planet: 'Neptune',
    element: 'Diffuse / Ether', traits: 'Vision, innovation, social change', shadow: 'alienation, dissociation',
    realms: 'groups, technological change', keywords: ['novelty', 'revolt', 'future'] },
  { n: 10, name: 'Collective Dream', core: 'Empathy', zodiac: 'Pisces-like (collective empathy)', planet: 'Pluto',
    element: 'Collective / Depth', traits: 'Collective unconscious, mass empathy', shadow: 'victimhood, loss of borders',
    realms: 'culture, art, mass movements', keywords: ['collective', 'dream', 'myth'] },
  { n: 11, name: 'Threshold', core: 'Ending → Beginning', zodiac: 'Threshold resonance', planet: 'Eris / Transvector',
    element: 'Catalytic / Edge', traits: 'Closure, endings that birth new cycles', shadow: 'self-sabotage, abrupt rupture',
    realms: 'rituals, ego-death, catalysts', keywords: ['closure', 'pivot', 'threshold'] },
  { n: 12, name: 'Integration', core: 'Completion', zodiac: 'Integrative resonance', planet: 'Ceres / Integrant',
    element: 'Synthesis / Earth–Air', traits: 'Healing, consolidation, synthesis', shadow: 'dissolution, lethargy',
    realms: 'healing, integration, completion rites', keywords: ['weave', 'close', 'bind'] },
  { n: 13, name: 'Axion', core: 'Trans-dimensional Seed', zodiac: 'Transcendent (Axion)', planet: 'Axion',
    element: 'Zero-point / Field', traits: 'Non-local seed, totality, recursion', shadow: 'dissociation, transcendental isolation',
    realms: 'mystical seed, meta-law', keywords: ['zero-point', 'totality', 'reboot'] },
];
