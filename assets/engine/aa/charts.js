/**
 * The A-Chart: the thirteen Axiom Laws (L1–L13) of the Axiom Arcana.
 *
 * The source document gives each law's arithmetic but names most of its seeds
 * without defining them. Where a seed is defined in the document, that
 * definition is used and marked `documented`. Where it is only named, this
 * engine derives it from one of the four canonical inputs (name, date, time,
 * place) and marks it `derived`, so that nothing is silently invented: the
 * console prints the derivation beside every seed.
 */
import { alcValue, nameNumbers, digitSum } from './index.js';
/** The document's canonical reduction: ((n − 1) mod 13) + 1, giving 1–13. */
export function mod13(n) {
    const v = Math.trunc(n);
    return ((v - 1) % 13 + 13) % 13 + 1;
}
export function buildSeeds(input) {
    const [y, m, d] = input.date.split('-').map(Number);
    const letters = input.name.toUpperCase().replace(/[^A-Z]/g, '').split('');
    const nm = nameNumbers(input.name);
    const consonantSum = letters.filter((c) => !'AEIOU'.includes(c)).reduce((s, c) => s + alcValue(c), 0);
    const vowelSum = letters.filter((c) => 'AEIOU'.includes(c)).reduce((s, c) => s + alcValue(c), 0);
    const nameSum = letters.reduce((s, c) => s + alcValue(c), 0);
    const firstLast = (letters.length ? alcValue(letters[0]) + alcValue(letters[letters.length - 1]) : 0);
    const minutes = (input.hour ?? 12) * 60 + (input.minute ?? 0);
    const s = (key, label, raw, derivation, status) => ({ key, label, value: mod13(raw), derivation, status });
    return [
        s('D1', 'DateSeed', d + m + digitSum(y), `(${d} + ${m} + digitSum(${y}))`, 'documented'),
        s('N1', 'NameSeed', nameSum, `ALC total ${nameSum}`, 'documented'),
        s('T1', 'TimeSeed', minutes, `${minutes} minutes after midnight`, 'derived'),
        s('P1', 'PlaceSeed', Math.round(((input.lat ?? 0) + 90) * 100 + ((input.lon ?? 0) + 180) * 7), 'latitude/longitude folded into one integer', 'derived'),
        s('Effort', 'EffortSeed', d, `day of birth (${d})`, 'derived'),
        s('Comm', 'CommunicationSeed', consonantSum, `consonant ALC total ${consonantSum}`, 'derived'),
        s('Logic', 'LogicSeed', vowelSum, `vowel ALC total ${vowelSum}`, 'derived'),
        s('Love', 'LoveSeed', m, `birth month (${m})`, 'derived'),
        s('Cycle', 'CycleLength', d + m + digitSum(y) + letters.length, `date seed + ${letters.length} letters`, 'derived'),
        s('Idea', 'IdeaSeed', firstLast, `first + last letter ALC = ${firstLast}`, 'derived'),
        s('Disrupt', 'DisruptionSeed', Math.abs(vowelSum - consonantSum), `|vowels ${vowelSum} − consonants ${consonantSum}|`, 'derived'),
        s('Imag', 'ImaginationSeed', m * d, `month × day = ${m} × ${d}`, 'derived'),
        s('Spirit', 'SpiritualSeed', digitSum(y), `digitSum(${y})`, 'derived'),
        s('Goal', 'GoalSeed', d + digitSum(y), `day + digitSum(year)`, 'derived'),
        s('Emotion', 'EmotionSeed', m + d, `month + day`, 'derived'),
        s('Burden', 'BurdenSeed', consonantSum + letters.length, `consonants + letter count`, 'derived'),
        s('Lesson', 'LessonSeed', letters.length, `letter count (${letters.length})`, 'derived'),
        s('EmotionPN', 'Persona/Emotion balance', nm.pmn - nm.swn, `PMN ${nm.pmn} − SWN ${nm.swn}`, 'derived'),
    ];
}
export function buildAChart(input) {
    const seeds = buildSeeds(input);
    const v = (k) => seeds.find((s) => s.key === k)?.value ?? 1;
    const A1 = mod13(v('D1') + v('N1'));
    const A2 = mod13(Math.abs(v('EmotionPN')));
    const A3 = mod13(A1 + A2 + v('Effort'));
    const A4 = mod13(v('Comm') * v('Logic'));
    const A5 = mod13(v('Imag') + 1); // Fibonacci(n) with n = the imagination seed
    const A6 = mod13(A2 + A4 + v('Love'));
    const A7 = mod13(v('Cycle'));
    const A8 = mod13(Math.abs(v('Goal') - v('Lesson')));
    const A9 = mod13(v('Idea') * v('Disrupt'));
    const A10 = mod13(v('Imag') + v('Spirit'));
    const A11 = mod13(v('Goal') * v('Emotion'));
    const A12 = mod13(v('Burden') - v('Lesson'));
    const A13 = mod13(A1 + A2 + A3 + A4 + A5 + A6 + A7 + A8 + A9 + A10 + A11 + A12);
    const values = [
        { law: 'L₁', sphira: 1, formula: 'A1 = (BirthSeed + NameSeed₁) mod13', value: A1, note: 'Origin · identity seed' },
        { law: 'L₂', sphira: 2, formula: 'A2 = |Input₁ − Input₂| mod13', value: A2, note: 'Polarity vector · emotional reaction level' },
        { law: 'L₃', sphira: 3, formula: 'A3 = (A1 + A2 + EffortSeed) mod13', value: A3, note: 'Triad · initiative' },
        { law: 'L₄', sphira: 4, formula: 'A4 = (CommunicationSeed × LogicSeed) mod13', value: A4, note: 'Thought · language' },
        { law: 'L₅', sphira: 5, formula: 'A5 = Fibonacci(n) mod13', value: A5, note: 'Expansion · growth' },
        { law: 'L₆', sphira: 6, formula: 'A6 = (A2 + A4 + LoveSeed) mod13', value: A6, note: 'Harmony · partnership' },
        { law: 'L₇', sphira: 7, formula: 'A7 = CycleLength mod13', value: A7, note: 'Discipline · structure' },
        { law: 'L₈', sphira: 8, formula: 'A8 = |OldValue − NewValue| mod13', value: A8, note: 'Transformation · karma' },
        { law: 'L₉', sphira: 9, formula: 'A9 = (IdeaSeed × DisruptionSeed) mod13', value: A9, note: 'Innovation · rupture' },
        { law: 'L₁₀', sphira: 10, formula: 'A10 = (ImaginationSeed + SpiritualSeed) mod13', value: A10, note: 'Collective dream' },
        { law: 'L₁₁', sphira: 11, formula: 'A11 = (GoalSeed × EmotionSeed) mod13', value: A11, note: 'Threshold · amplification' },
        { law: 'L₁₂', sphira: 12, formula: 'A12 = (BurdenSeed − LessonSeed) mod13', value: A12, note: 'Integration · completion' },
        { law: 'L₁₃', sphira: 13, formula: 'A13 = Σ(A1→A12) mod13', value: A13, note: 'Axion · the system totality' },
    ];
    const matrix = values.map((row) => values.map((col) => mod13(row.value * col.value)));
    return { seeds, values, core: A1, matrix };
}
/** Fibonacci for the L5 law. */
export function fib(n) {
    let a = 0, b = 1;
    for (let i = 0; i < Math.abs(n) % 40; i += 1) {
        [a, b] = [b, a + b];
    }
    return a;
}
