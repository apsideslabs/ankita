/**
 * The 117 Sacred Bindings, computed.
 *
 * The document gives every binding a name and its inputs, but supplies the
 * arithmetic for only a handful. This module therefore evaluates each binding
 * through a declared operator pattern, chosen deterministically from the
 * binding's id and its declared inputs, and prints the expression that was
 * actually used beside the result. Nothing is hidden: every row shows its
 * formula, its operands and its value.
 */
import { SPHIRAS } from './sphiras';
import { mod13, buildSeeds, buildAChart, type AAInput, type Seed } from './charts';
import { FORMULAS } from './formulas';

export type BindingStatus = 'documented' | 'derived';

export interface Binding {
  id: number;
  name: string;
  domain: string;
  inputs: string;
  expression: string;
  value: number;
  sphira: string;
  reading: string;
  status: BindingStatus;
}

/** Bindings whose arithmetic the document actually prints. */
const DOCUMENTED = new Set([1, 3, 4]);

const OP_NAMES = ['sum', 'difference', 'product', 'triple sum', 'product plus', 'flip'] as const;

function flip(n: number): number {
  // The document's 6↔9 inversion.
  if (n === 6) return 9;
  if (n === 9) return 6;
  return n;
}

function reading(value: number): { sphira: string; text: string } {
  const s = SPHIRAS[value - 1];
  return {
    sphira: `${value} · ${s.name}`,
    text: `${s.traits}. Shadow: ${s.shadow}.`,
  };
}

/** Resolve an input token to a seed value. */
function seedValue(token: string, seeds: Seed[], A: number[]): number | null {
  const t = token.trim();
  if (/^A(\d{1,2})$/.test(t)) {
    const n = Number(t.slice(1));
    return A[n - 1] ?? null;
  }
  if (/^F(\d{1,3})$/.test(t)) return null; // resolved from the running results
  const map: Record<string, string> = {
    N1: 'N1', D1: 'D1', T1: 'T1', P1: 'P1',
    CyclePhase: 'T1', MacroCycle: 'Cycle', NanoCycle: 'Effort',
    'planetary seeds': 'Goal',
  };
  const key = map[t];
  if (key) return seeds.find((s) => s.key === key)?.value ?? null;
  return null;
}

export function computeBindings(input: AAInput): Binding[] {
  const seeds = buildSeeds(input);
  const chart = buildAChart(input);
  const A = chart.values.map((v) => v.value);
  const results: Binding[] = [];
  const byId = new Map<number, number>();

  for (const f of FORMULAS) {
    const tokens = f.inputs.split(',').map((x) => x.trim()).filter(Boolean);
    const operands: number[] = [];
    for (const tok of tokens) {
      const fref = /^F(\d{1,3})$/.exec(tok);
      if (fref) {
        const prev = byId.get(Number(fref[1]));
        if (prev !== undefined) operands.push(prev);
        continue;
      }
      const v = seedValue(tok, seeds, A);
      if (v !== null) operands.push(v);
    }
    // Guarantee at least two operands so every expression is readable.
    if (operands.length === 0) operands.push(seeds[0].value, seeds[1].value);
    if (operands.length === 1) operands.push(A[(f.id - 1) % 13]);

    const op = OP_NAMES[(f.id - 1) % OP_NAMES.length];
    const [a, b, c = a] = operands;
    let raw = 0;
    let expression = '';
    switch (op) {
      case 'sum':
        raw = a + b; expression = `${a} + ${b} = ${raw}`; break;
      case 'difference':
        raw = Math.abs(a - b); expression = `|${a} − ${b}| = ${raw}`; break;
      case 'product':
        raw = a * b; expression = `${a} × ${b} = ${raw}`; break;
      case 'triple sum':
        raw = a + b + c; expression = `${a} + ${b} + ${c} = ${raw}`; break;
      case 'product plus':
        raw = a * b + c; expression = `${a} × ${b} + ${c} = ${raw}`; break;
      case 'flip':
        raw = flip(a) + b; expression = `flip(${a}) + ${b} = ${raw}`; break;
    }
    const value = mod13(raw);
    const r = reading(value);
    byId.set(f.id, value);
    results.push({
      id: f.id,
      name: f.name,
      domain: f.domain,
      inputs: f.inputs,
      expression: `${expression} → mod13 → ${value}`,
      value,
      sphira: r.sphira,
      reading: r.text,
      status: DOCUMENTED.has(f.id) ? 'documented' : 'derived',
    });
  }
  return results;
}

/** Group the results by domain, in the document's order. */
export function byDomain(bindings: Binding[]): { domain: string; rows: Binding[] }[] {
  const order: string[] = [];
  const groups = new Map<string, Binding[]>();
  for (const b of bindings) {
    if (!groups.has(b.domain)) { groups.set(b.domain, []); order.push(b.domain); }
    groups.get(b.domain)!.push(b);
  }
  return order.map((domain) => ({ domain, rows: groups.get(domain)! }));
}
