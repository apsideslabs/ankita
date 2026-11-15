import type { Metadata } from 'next';
import { CHALDEAN_COLUMNS, COMPOUND_GLOSS } from '@/lib/engine/chaldean';
import { NUMERAL_GRAHA, friendshipMatrix, RELATION_GLOSS } from '@/lib/engine/planets';
import { GRID, PLANES } from '@/lib/engine/loshu';
import { BHUTA, KATAPAYADI, NAKSHATRA_PADAS } from '@/lib/engine/sanskrit';
import { SOURCES } from '@/lib/engine/provenance';

export const metadata: Metadata = {
  title: 'Engine',
  description: 'Every table, constant and formula the Aṅkita engine uses — printed in full.',
};

const REL_TONE: Record<string, string> = {
  friend: 'bg-emerald-600/10 text-emerald-800',
  neutral: 'bg-amber-500/10 text-amber-800',
  enemy: 'bg-copper/10 text-copper',
};

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="kicker"><span className="n">{kicker}</span></div>
      <h2 className="mt-1.5 text-2xl font-serif font-bold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function EnginePage() {
  const matrix = friendshipMatrix();
  const bhutaEntries = Object.entries(BHUTA).sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  const kataEntries = Object.entries(KATAPAYADI);
  const byDigit = new Map<number, string[]>();
  for (const [token, digit] of kataEntries) {
    const list = byDigit.get(digit) ?? [];
    list.push(token);
    byDigit.set(digit, list);
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-3xl">
        <div className="kicker"><span className="n">Engine</span></div>
        <h1 className="page-title mt-4">Every table, printed in full</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          The engine has no hidden state. These are the constants it uses, the formulas it applies, and
          the source behind each one. If a rule is not on this page, the platform does not use it.
        </p>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        {[
          ['reduction', 'Reduction'], ['chaldean', 'Chaldean'], ['compounds', 'Compounds 10–52'],
          ['grahas', 'Digit → graha'], ['matrix', 'Friendship 9×9'], ['loshu', 'Lo Shu'],
          ['kua', 'Kua'], ['timing', 'Timing'], ['bhuta', 'Bhūtasaṅkhyā'],
          ['kata', 'Kaṭapayādi'], ['namakshara', '108 syllables'], ['sources', 'Provenance'],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="px-2.5 py-1 rounded border border-line bg-surface text-[10px] font-mono uppercase tracking-wider text-ink-soft hover:border-copper/40 hover:text-copper">
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-12">
        <Section id="reduction" kicker="Rule 0" title="Digital reduction">
          <div className="border-t border-line pt-5">
            <p className="text-sm text-ink-soft">
              Digits are summed until one remains. <span className="font-mono text-ink">1995 → 1+9+9+5 = 24 → 2+4 = 6</span>.
              Zero is never a result: a sum of 0 becomes 9, because the system has nine numbers for nine grahas.
              Master numbers (11, 22, 33) are kept only when the toggle is on, and that convention is Pythagorean.
            </p>
          </div>
        </Section>

        <Section id="chaldean" kicker="Cheiro, 1926" title="Chaldean letter values">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CHALDEAN_COLUMNS.map((c) => (
              <div key={c.value} className="border border-line bg-surface p-4">
                <p className="font-serif text-2xl font-bold text-copper tabular-nums">{c.value}</p>
                <p className="mt-1 font-mono text-sm tracking-[0.18em] text-ink">{c.letters.join(' ')}</p>
              </div>
            ))}
            <div className="rounded-lg border border-dashed border-line-strong bg-canvas p-4">
              <p className="font-serif text-2xl font-bold text-ink-muted tabular-nums">9</p>
              <p className="mt-1 text-xs text-ink-soft">Unassigned — reserved by Cheiro for the nine-lettered name of God.</p>
            </div>
          </div>
        </Section>

        <Section id="compounds" kicker="Cheiro, ch. XIII" title="Compound numbers, 10 to 52">
          <div className="border-y border-line-strong bg-transparent">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {Object.entries(COMPOUND_GLOSS).map(([n, gloss]) => (
                  <tr key={n}>
                    <td className="py-2 pr-4 w-12 font-serif text-lg font-semibold text-copper tabular-nums">{n}</td>
                    <td className="py-2 pr-4 text-ink-soft">{gloss}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            The range stops at 52 because the book stops there — “the 52 weeks of our year”. Glosses are our summaries.
          </p>
        </Section>

        <Section id="grahas" kicker="Johari, 1990" title="Digit → graha">
          <div className="border-y border-line-strong bg-transparent">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  {['Digit', 'Graha', 'Sanskrit', 'Quality'].map((h) => (
                    <th key={h} className="py-2.5 pr-4 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {Object.entries(NUMERAL_GRAHA).map(([n, g]) => (
                  <tr key={n}>
                    <td className="py-2 pr-4 font-serif text-lg font-semibold text-copper tabular-nums">{n}</td>
                    <td className="py-2 pr-4 text-ink">{g.graha}</td>
                    <td className="py-2 pr-4 text-ink-soft">{g.sanskrit}</td>
                    <td className="py-2 pr-4 text-ink-soft">{g.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="matrix" kicker="Natural friendship" title="The 9 × 9 matrix">
          <div className="overflow-x-auto border-y border-line-strong bg-transparent py-3">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="p-2" />
                  {matrix.map((r) => <th key={r.a} className="p-2 font-serif text-base font-bold text-copper">{r.a}</th>)}
                </tr>
              </thead>
              <tbody>
                {matrix.map((r) => (
                  <tr key={r.a}>
                    <th className="p-2 font-serif text-base font-bold text-copper">{r.a}</th>
                    {r.row.map((rel, i) => (
                      <td key={i} className="p-1">
                        <span className={`inline-flex w-7 h-7 items-center justify-center rounded font-mono text-[10px] uppercase ${REL_TONE[rel]}`}>
                          {rel[0]}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-muted">
            F friend · N neutral · E enemy. {RELATION_GLOSS.friend} {RELATION_GLOSS.enemy}
          </p>
        </Section>

        <Section id="loshu" kicker="Chinese" title="The Lo Shu square">
          <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
            <div className="grid grid-cols-3 gap-1 w-[220px]">
              {GRID.flat().map((d) => (
                <div key={d} className="aspect-square rounded border border-line bg-surface flex items-center justify-center font-serif text-2xl font-bold text-ink tabular-nums">
                  {d}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-line bg-surface p-5">
              <p className="text-sm text-ink-soft">Every row, column and diagonal sums to 15.</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {Object.entries(PLANES).map(([id, p]) => (
                  <li key={id} className="flex justify-between gap-4">
                    <span className="text-ink-soft">{p.label}</span>
                    <span className="font-mono text-xs text-ink">{p.cells.join('-')}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-ink-muted">
                Line names are modern English coinages of the Lo Shu literature. No jyotiṣa text calls a completed diagonal a rājayoga.
              </p>
            </div>
          </div>
        </Section>

        <Section id="kua" kicker="Compass school" title="Kua number">
          <div className="rounded-xl border border-line bg-surface p-6 text-sm text-ink-soft">
            <p>Let <span className="font-mono text-ink">y</span> be the last two digits of the birth year, summed to one digit.</p>
            <ul className="mt-3 space-y-1.5 font-mono text-xs">
              <li>1900–1999 · male: 10 − y &nbsp;&nbsp;· female: 5 + y</li>
              <li>2000–2099 · male: 9 − y &nbsp;&nbsp;· female: 6 + y</li>
              <li>if the result is 5 → 2 for male, 8 for female</li>
              <li>east group: 1, 3, 4, 9 &nbsp;·&nbsp; west group: 2, 5, 6, 7, 8</li>
            </ul>
            <p className="mt-3 text-xs text-ink-muted">
              Two branches are required. A single formula applied to both centuries misdirects every user born after 1999.
            </p>
          </div>
        </Section>

        <Section id="timing" kicker="Modern" title="Timing cycles">
          <div className="rounded-xl border border-line bg-surface p-6 text-sm text-ink-soft">
            <ul className="space-y-2 font-mono text-xs">
              <li>personal year = reduce(day + month + current year)</li>
              <li>personal month = reduce(personal year + current month)</li>
              <li>personal day = reduce(personal month + current day)</li>
              <li>aṅka cycle = 1 year for 1, 2 for 2 … 9 for 9, repeating every 45 years</li>
            </ul>
            <p className="mt-3 text-xs text-ink-muted">
              Arithmetic only. These are not classical daśās, which are computed from the Moon’s longitude.
            </p>
          </div>
        </Section>

        <Section id="bhuta" kicker="Piṅgala, c. 2nd c. BCE" title="Bhūtasaṅkhyā vocabulary">
          <div className="border-y border-line-strong bg-transparent">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
                  const words = bhutaEntries.filter(([, v]) => v === n).map(([k]) => k);
                  if (!words.length) return null;
                  return (
                    <tr key={n}>
                      <td className="py-2 pr-4 w-12 font-serif text-lg font-semibold text-copper tabular-nums">{n}</td>
                      <td className="py-2 font-mono text-xs text-ink-soft">{words.join(', ')}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="kata" kicker="Haridatta, 683 CE" title="Kaṭapayādi consonants">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => (
              <div key={d} className="rounded-lg border border-line bg-surface p-3">
                <p className="font-serif text-xl font-bold text-copper tabular-nums">{d}</p>
                <p className="mt-1 font-mono text-sm text-ink">{(byDigit.get(d) ?? []).join(' ')}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-ink-muted">Vowels carry nothing; digits are read right to left.</p>
        </Section>

        <Section id="namakshara" kicker="Gṛhya-sūtra custom" title="The 108 pada syllables">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line-strong text-left">
                  {['#', 'Nakṣatra', 'Pada 1', 'Pada 2', 'Pada 3', 'Pada 4'].map((h) => (
                    <th key={h} className="px-3 py-2.5 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {NAKSHATRA_PADAS.map((n, i) => (
                  <tr key={n.name}>
                    <td className="px-3 py-1.5 font-mono text-xs text-ink-muted tabular-nums">{i + 1}</td>
                    <td className="px-3 py-1.5 text-ink">{n.name}{n.variant && <span className="text-copper"> *</span>}</td>
                    {n.padas.map((p, j) => (
                      <td key={j} className="px-3 py-1.5 font-mono text-ink-soft">{p}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-ink-muted">* regional tables differ for these nakṣatras; a family’s own almanac takes precedence.</p>
        </Section>

        <Section id="sources" kicker="Provenance" title="Where each rule comes from">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-line">
                {SOURCES.map((s) => (
                  <tr key={s.id} className="align-top">
                    <td className="px-4 py-3 w-[22%] font-medium text-ink">{s.label}</td>
                    <td className="py-2.5 pr-4 text-ink-soft">{s.source}</td>
                    <td className="px-4 py-3 w-[10%] font-mono text-xs text-ink-soft">{s.year ?? '—'}</td>
                    <td className="px-4 py-3 w-[12%]">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${
                        s.status === 'verified' ? 'text-emerald-700' : s.status === 'attributed' ? 'text-amber-700' : 'text-copper'
                      }`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  );
}
