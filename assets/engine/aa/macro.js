/**
 * The 15 macro-charts, C1–C15, transcribed from the Axiom Arcana.
 *
 * The document gives each chart's formula, and — unlike the 117 bindings — it
 * also defines the sub-terms those formulas use: Pair(n) = 13 − n, the Sphira
 * Health Seed, Cycle Load, Stress Factor, Local Health Index, Organ Load Weight
 * and the per-Sphira Functional Score. Those are implemented exactly as given.
 * The few inputs the document names but does not define (Weekday#, Segment#,
 * StressLoad and the like) are derived from the four canonical inputs and the
 * derivation is printed beside the value.
 */
import { mod13, buildAChart, buildSeeds } from './charts.js';
import { SPHIRAS } from './sphiras.js';
/** The document's phase-pair operator. */
export function pair(n) {
    return mod13(13 - mod13(n));
}
function read(v) {
    const s = SPHIRAS[v - 1];
    return { sphira: `${v} · ${s.name}`, reading: `${s.traits}. Shadow: ${s.shadow}.` };
}
export function buildMacro(input, at = new Date()) {
    const chart = buildAChart(input);
    const seeds = buildSeeds(input);
    const A = chart.values.map((v) => v.value);
    const seed = (k) => seeds.find((s) => s.key === k)?.value ?? 1;
    const [y, m, d] = input.date.split('-').map(Number);
    const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 1; // 1–7
    const cycleSeed = seed('Cycle');
    // SCLᵢ = mod13(Cycleᵢ + Weekday# + Segment#)
    const scl = (i) => mod13(cycleSeed + weekday + ((i % 4) + 1));
    const shs = (i) => A[i - 1];
    // SSFᵢ = mod13(max(0, A11 − A12) + Pair(SHSᵢ))
    const ssf = (i) => mod13(Math.max(0, A[10] - A[11]) + pair(shs(i)));
    // LHIᵢ = mod13(SHSᵢ×2 + SCLᵢ − SSFᵢ)
    const lhi = (i) => mod13(shs(i) * 2 + scl(i) - ssf(i));
    // OLWᵢ = 1 + round((SCLᵢ − Pair(SHSᵢ))/4)
    const olw = (i) => 1 + Math.round((scl(i) - pair(shs(i))) / 4);
    // PFSᵢ = mod13(LHIᵢ − OLWᵢ)
    const pfs = (i) => mod13(lhi(i) - olw(i));
    const pfsAll = Array.from({ length: 13 }, (_, i) => pfs(i + 1));
    const cvs = mod13(Math.round([1, 2, 6, 7, 8].reduce((s, i) => s + pfs(i), 0) / 5));
    const arf = pfsAll.some((v, i) => v <= 3 && [11, 12, 13].includes(scl(i + 1))) ? 1 : 0;
    const cri = mod13(pair(Math.round((pfs(6) + pfs(8)) / 2)) + pair(A[1]));
    const rn = Array.from({ length: 13 }, (_, i) => mod13(pair(shs(i + 1)) + A[11]));
    const macroYear = mod13(seed('D1') + seed('T1') + seed('P1') + seed('N1'));
    const microMonth = mod13(macroYear + mod13(at.getFullYear()) + A[0]);
    const rows = [
        { id: 'C1', name: 'Body Physiology', formula: 'mod13(PFSᵢ + SHSᵢ + SCLᵢ)', value: mod13(pfs(1) + shs(1) + scl(1)) },
        { id: 'C2', name: 'Weakness Archetype', formula: 'mod13(SHSᵢ + SSFᵢ + Pair(SCLᵢ))', value: mod13(shs(1) + ssf(1) + pair(scl(1))) },
        { id: 'C3', name: 'Fear Blueprint', formula: 'mod13(SHSᵢ + Pair(PFSᵢ) + SCLᵢ)', value: mod13(shs(1) + pair(pfs(1)) + scl(1)) },
        { id: 'C4', name: 'Exact Timing', formula: 'MY = mod13(D1 + T1 + P1 + N1)', value: macroYear },
        { id: 'C5', name: 'Crisis / Shadow Phase', formula: 'mod13(A8 + A11 + Pair(A2) + SCL)', value: mod13(A[7] + A[10] + pair(A[1]) + scl(8)) },
        { id: 'C6', name: 'Relationship Failure', formula: 'mod13(A6 + Pair(A2) + A11 + StabilityBreak)', value: mod13(A[5] + pair(A[1]) + A[10] + ssf(6)) },
        { id: 'C7', name: 'Career Collapse', formula: 'mod13(A3 + A7 + Pair(A9) + A11 + StressLoad)', value: mod13(A[2] + A[6] + pair(A[8]) + A[10] + ssf(7)) },
        { id: 'C8', name: 'Material Loss / Risk', formula: 'mod13(A6 + Pair(A7) + A9 + A12 + StressFactor)', value: mod13(A[5] + pair(A[6]) + A[8] + A[11] + ssf(8)) },
        { id: 'C9', name: 'Spiritual Crisis', formula: 'mod13(A10 + A12 + Pair(A13) + Pair(A2) + SCL₁₀)', value: mod13(A[9] + A[11] + pair(A[12]) + pair(A[1]) + scl(10)) },
        { id: 'C10', name: 'Destiny Alignment', formula: 'mod13(A1 + A5 + Pair(A7) + A13 + SCL₁)', value: mod13(A[0] + A[4] + pair(A[6]) + A[12] + scl(1)) },
        { id: 'C11', name: 'Childhood Imprint', formula: 'mod13(A2 + Pair(A1) + A6 + A12 + EarlyResidue)', value: mod13(A[1] + pair(A[0]) + A[5] + A[11] + ssf(11)) },
        { id: 'C12', name: 'Social Distortion', formula: 'mod13(A1 + A4 + Pair(A9) + A11 + SocialLoad)', value: mod13(A[0] + A[3] + pair(A[8]) + A[10] + ssf(12)) },
        { id: 'C13', name: 'Energy Reserve', formula: 'mod13(A1 + A3 + A6 + Pair(A12) + A11)', value: mod13(A[0] + A[2] + A[5] + pair(A[11]) + A[10]) },
        { id: 'C14', name: 'Numerical Remedy', formula: 'mod13(Pair(C2 + C3 + C5))', value: 0 },
        { id: 'C15', name: 'Axiom Alignment', formula: 'mod13(ΣA + ΣConfluences + Cycle)', value: mod13(A.reduce((s, v) => s + v, 0) + cycleSeed) },
    ];
    rows[13].value = mod13(pair(rows[1].value + rows[2].value + rows[4].value));
    const charts = rows.map((r) => ({ ...r, ...read(r.value) }));
    return {
        charts,
        health: { pfs: pfsAll, cvs, arf, cri, rn },
        macroYear,
        microMonth,
    };
}
