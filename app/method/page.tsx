import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Method',
  description: 'The three layers, the formulas, and the six corrections that separate a defensible numerology engine from a claim.',
};

const LAYERS = [
  { n: '01', title: 'Chaldean arithmetic', date: '1926', body: 'Letter values, compound numbers 10–52, single-digit reduction. Verified against the book’s own worked example.' },
  { n: '02', title: 'Graha-numerology', date: '1990', body: 'Nine digits for nine grahas. The Indian form keeps seven of Cheiro’s assignments and replaces Uranus and Neptune with Rāhu and Ketu.' },
  { n: '03', title: 'The Lo Shu grid', date: 'Chinese', body: 'A 3×3 square of 1–9 summing to 15 in every line. Labelled Chinese, because that is its origin.' },
];

const FIXES = [
  ['Kua: male 11 − Y, female 4 + Y', 'That pair is the 1900s formula only. Births from 2000 need a different pair of constants, so Aṅkita branches on the century and applies the Kua 5 defaults.'],
  ['“Vedic dasha”: 1 year for 1 … 9 for 9', 'The arithmetic is right — the sum is 45 — but it is not a classical daśā. The classical systems run from the Moon’s longitude. Aṅkita labels it a modern cycle.'],
  ['Lo Shu line names: Rāja yoga, Silver yoga', 'The lines are correct for the grid as drawn. The names are modern English coinages; no jyotiṣa text calls a completed diagonal a rājayoga.'],
  ['“9 is sacred and omitted from letters”', 'Correct, and Cheiro gives the reason: nine letters spell the name of God. It is his reason, not an Indian one.'],
  ['Master numbers 11, 22, 33', 'A Pythagorean convention. Aṅkita offers it as a toggle and reduces to 1–9 by default, because nine numbers serve nine grahas.'],
  ['Compound numbers “10 through 52+”', 'Cheiro stops at 52 and says why — the 52 weeks of the year. There is no 53.'],
];

export default function MethodPage() {
  return (
    <div className="band band-pad">
      <div className="max-w-3xl">
        <div className="kicker"><span className="n">Method</span></div>
        <h1 className="page-title mt-4">Three layers, six corrections</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          A numerology engine is a stack of borrowed rules. This page states which rule came from where,
          and what had to be fixed before any of it could be coded honestly.
        </p>
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {LAYERS.map((l) => (
          <div key={l.n} className="rounded-xl border border-line bg-surface p-6 shadow-3d-card">
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-bold text-copper/30 tabular-nums">{l.n}</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">{l.date}</span>
            </div>
            <h2 className="mt-3 font-serif text-lg font-bold text-ink">{l.title}</h2>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">{l.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-serif font-bold text-ink">The six corrections</h2>
      <p className="mt-2 text-sm text-ink-soft max-w-3xl">
        Each of these is a place where a widely circulated formula breaks, and each is fixed in the engine.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-canvas border-b border-line text-left">
              <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted w-[34%]">Commonly said</th>
              <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">What holds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {FIXES.map(([said, holds]) => (
              <tr key={said} className="align-top">
                <td className="px-4 py-3 font-medium text-ink">{said}</td>
                <td className="px-4 py-3 text-ink-soft">{holds}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6">
          <h3 className="font-serif text-lg font-bold text-ink">What is verified</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>· Chaldean letter values — reproduced from a worked example in the source.</li>
            <li>· The compound range 10–52 — stated by the author, with his reason.</li>
            <li>· Digit → graha, Indian form — stated by Johari as a variant of the Western table.</li>
            <li>· Bhūtasaṅkhyā, kaṭapayādi, Āryabhaṭa notation — dated texts, dated usage.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6">
          <h3 className="font-serif text-lg font-bold text-ink">What is not</h3>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>· A classical Sanskrit citation for digit-to-graha. None has been found.</li>
            <li>· Any claim that the Lo Shu grid or the Kua number is Indian.</li>
            <li>· Any predictive claim. The engine computes; it does not promise.</li>
            <li>· The regional pada tables — two or three nakṣatras vary by tradition.</li>
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/workspace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark">
          See it applied <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
