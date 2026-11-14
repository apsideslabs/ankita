import { breakdown } from './chaldean';
import { GRID } from './loshu';
import type { BirthInput, Profile, TraceStep } from './types';

const sumLine = (parts: number[]) => `${parts.join(' + ')} = ${parts.reduce((a, b) => a + b, 0)}`;

function chain(n: number): string {
  const steps: string[] = [];
  let v = n;
  while (v > 9) {
    const digits = String(v).split('').map(Number);
    steps.push(`${digits.join(' + ')} = ${digits.reduce((a, b) => a + b, 0)}`);
    v = digits.reduce((a, b) => a + b, 0);
  }
  return steps.join(' → ');
}

/**
 * Every step the engine takes, in the order it takes them, with the rule and
 * the source for each. The UI renders this verbatim — nothing is computed that
 * is not shown here.
 */
export function buildTrace(input: BirthInput, p: Profile): TraceStep[] {
  const [y, m, d] = input.date.split('-').map(Number);
  const dayDigits = String(d).padStart(2, '0').split('').map(Number);
  const monthDigits = String(m).padStart(2, '0').split('').map(Number);
  const yearDigits = String(y).split('').map(Number);
  const letters = breakdown(input.name);
  const words = input.name.trim().split(/\s+/).filter(Boolean);

  const t: TraceStep[] = [];

  t.push({
    id: 'in-date', section: 'input', label: 'Date parsed',
    expression: `${input.date} → day ${d}, month ${m}, year ${y}`,
    result: `${dayDigits.join('')} / ${monthDigits.join('')} / ${yearDigits.join('')}`,
    sourceId: 'input',
  });
  t.push({
    id: 'in-name', section: 'input', label: 'Name normalised',
    expression: input.name.toUpperCase().replace(/[^A-Z]/g, ''),
    detail: `${letters.length} letters carrying a value, across ${words.length} word(s)`,
    result: letters.length,
    sourceId: 'cheiro-1926',
  });

  // Mūlāṅka
  t.push({
    id: 'mulank-1', section: 'core', label: 'Mūlāṅka — day digits summed',
    expression: sumLine(dayDigits), detail: chain(d) || 'already a single digit',
    result: p.mulank.value, sourceId: 'johari-1990',
  });

  // Bhāgyāṅka
  const all = [...dayDigits, ...monthDigits, ...yearDigits];
  t.push({
    id: 'bhagyank-1', section: 'core', label: 'Bhāgyāṅka — all date digits summed',
    expression: sumLine(all), detail: chain(all.reduce((a, b) => a + b, 0)),
    result: p.bhagyank.value, sourceId: 'johari-1990',
  });

  // Nāmāṅka — per word, then compound
  words.forEach((w, i) => {
    const ls = breakdown(w);
    const total = ls.reduce((s, b) => s + b.value, 0);
    t.push({
      id: `name-word-${i}`, section: 'name', label: `“${w}” — letters summed`,
      expression: ls.map((b) => `${b.letter} ${b.value}`).join(' + '),
      detail: `${sumLine(ls.map((b) => b.value))}; reduced ${chain(total) || '—'}`,
      result: total,
      sourceId: 'cheiro-1926',
    });
  });
  t.push({
    id: 'name-compound', section: 'name', label: 'Compound number',
    expression: words.map((w) => breakdown(w).reduce((s, b) => s + b.value, 0)).join(' + ') + ' → reduced per word, then summed',
    detail: `Cheiro reduces each name-part before adding; the sum is the compound, ${p.compound}`,
    result: p.compound, sourceId: 'cheiro-compound',
  });
  t.push({
    id: 'name-root', section: 'name', label: 'Nāmāṅka — compound reduced',
    expression: chain(p.compound) || `${p.compound} is already single`,
    result: p.namank.value, sourceId: 'cheiro-1926',
  });

  // Grid
  const used = [...all, p.mulank.value, p.bhagyank.value, p.namank.value].filter((x) => x >= 1 && x <= 9);
  t.push({
    id: 'grid-digits', section: 'grid', label: 'Digits placed in the square',
    expression: used.join(', '),
    detail: 'date digits, plus the three core numbers; zeros are not placed',
    result: used.length, sourceId: 'loshu',
  });
  p.grid.forEach((c) => {
    if (c.count > 0) {
      t.push({
        id: `grid-${c.digit}`, section: 'grid', label: `Cell ${c.digit} (${c.plane})`,
        expression: `count of ${c.digit} in the list`,
        result: c.count, sourceId: 'loshu',
      });
    }
  });
  const complete = p.lines.filter((l) => l.complete);
  t.push({
    id: 'grid-lines', section: 'grid', label: 'Lines completed',
    expression: complete.length ? complete.map((l) => l.cells.join('-')).join(', ') : 'none',
    result: complete.length, sourceId: 'loshu',
  });

  // Kua
  if (p.kua) {
    const yy = Number(String(y).slice(-2));
    const yySum = String(yy).padStart(2, '0').split('').map(Number).reduce((a, b) => a + b, 0);
    const branch = y < 2000 ? '1900s' : '2000s';
    t.push({
      id: 'kua-1', section: 'kua', label: `Kua — ${branch} branch, ${input.gender}`,
      expression: y < 2000
        ? (input.gender === 'male' ? `10 − ${yySum}` : `5 + ${yySum}`)
        : (input.gender === 'male' ? `9 − ${yySum}` : `6 + ${yySum}`),
      detail: `last two digits ${yy} → ${yySum}${p.kua.value === 2 || p.kua.value === 8 ? '; a 5 defaults to 2 (male) or 8 (female)' : ''}`,
      result: p.kua.value, sourceId: 'kua',
    });
  }

  // Timing
  const py = p.timing[0];
  t.push({
    id: 'time-py', section: 'timing', label: 'Personal year',
    expression: `${d} + ${m} + ${new Date().getFullYear()}`,
    detail: chain(d + m + new Date().getFullYear()),
    result: py.value, sourceId: 'modern-cycles',
  });
  t.push({
    id: 'time-pm', section: 'timing', label: 'Personal month',
    expression: `personal year ${py.value} + current month ${new Date().getMonth() + 1}`,
    result: p.timing[1].value, sourceId: 'modern-cycles',
  });
  t.push({
    id: 'time-pd', section: 'timing', label: 'Personal day',
    expression: `personal month ${p.timing[1].value} + current day ${new Date().getDate()}`,
    result: p.timing[2].value, sourceId: 'modern-cycles',
  });
  t.push({
    id: 'time-cycle', section: 'timing', label: 'Aṅka cycle position',
    expression: '1 year for 1, 2 for 2 … 9 for 9; the nine sum to 45',
    detail: `${p.timing[3].detail}`,
    result: p.timing[3].value, sourceId: 'modern-cycles',
  });

  return t;
}

export const GRID_ORDER = GRID.flat();
