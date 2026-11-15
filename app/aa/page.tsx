import type { Metadata } from 'next';
import Link from 'next/link';
import { AAConsole } from '@/components/aa/AAConsole';
import { Ornament } from '@/components/ui/ornament';
import { APS_LORDS, DIGNITY, REALMS, STATIONS } from '@/lib/engine/aa';
import { SPHIRAS } from '@/lib/engine/aa/sphiras';
import { FORMULAS } from '@/lib/engine/aa/formulas';

export const metadata: Metadata = {
  title: 'The AA System',
  description: 'The Axiom Arcana — a separate engine inside Aṅkita: reduce-to-13, the Axiomatic Letter Code, 27 stations and a 91-year period cycle.',
};

const LAYERS = [
  { n: '01', t: 'Reduce-to-13', b: 'The system’s fundamental reduction. Any integer collapses to 1–13 and stops at 13, which is a base number here rather than a pass-through. 49 → 13, not 4.' },
  { n: '02', t: 'Core Self', b: 'Day reduced to 13, month taken as is, year’s digits summed and reduced. The three are added and reduced again — the centre of the 12-realm ring.' },
  { n: '03', t: 'Axiomatic Letter Code', b: 'A symmetric pairing, A↔Z and B↔Y, so values mirror around the alphabet’s centre. Three name numbers: DPN, SWN, PMN.' },
  { n: '04', t: '27 Stations', b: 'The ecliptic divided into 27 equal stations of 13.333°, each quartered. The Moon’s sidereal longitude gives the station and the pada.' },
  { n: '05', t: '91-year APS', b: 'Nine forces in a repeating cycle — 7, 10, 7, 13, 13, 13, 13, 7, 8 — summing to 91. Birth begins mid-period, at the fraction of the station already traversed.' },
  { n: '06', t: 'PLY · PLM · PLD', b: 'Personal lunar year, month and day, each a reduce-to-13 of the previous layer plus the calendar value.' },
];

export default function AAPage() {
  return (
    <div className="w-full">
      <section className="band band-pad pt-10">
        <div className="kicker"><span className="n">System II</span><span>The AA System · Axiom Arcana</span></div>
        <h1 className="display mt-6 max-w-3xl">
          A second engine, with <em className="italic text-copper">its own</em> mathematics.
        </h1>
        <p className="lede mt-5">
          Aṅkita’s first engine reads the classical and Chaldean tradition and needs two inputs — a name
          and a date. This one is different in kind, and it needs <strong className="text-ink">four</strong>:
          name, date, time and place, because twelve of its bindings read the time and place seeds.
          The Axiom Arcana is an authored system — reduce-to-13 instead of reduce-to-9, thirteen realms
          instead of twelve signs, a symmetric letter code instead of Chaldean values, and a 91-year cycle
          instead of a daśā.
        </p>

        <div className="mt-9"><AAConsole /></div>

        <div className="mt-6 border-y border-line py-4">
          <p className="text-[11px] leading-relaxed text-ink-soft">
            <strong className="text-ink">What is verified:</strong> every rule here is transcribed from the Codex and
            Research Document, and the test suite checks the engine against the worked examples printed in them —
            Reduce13(49) = 13, 3 March 2009 → Core Self 8, ANUJ → 3 · 7 · 5, PRIYA → 5 · 10 · 4.
            The Moon longitude is a truncated series, good to about half a degree; the console warns when the
            result sits near a station boundary.
          </p>
        </div>
      </section>

      <Ornament glyph="१३" />

      <section className="band band-pad">
        <div className="kicker"><span className="n">I</span><span>Six calculations</span></div>
        <h2 className="h2-ed mt-5 max-w-2xl">What the AA engine actually computes.</h2>
        <div className="mt-8">
          {LAYERS.map((l) => (
            <div key={l.n} className="index-row">
              <span className="num">{l.n}</span>
              <div><h3>{l.t}</h3><p>{l.b}</p></div>
            </div>
          ))}
        </div>
      </section>

      <Ornament glyph="१३" />

      <section className="band band-pad pb-16">
        <div className="kicker"><span className="n">II</span><span>The tables</span></div>
        <h2 className="h2-ed mt-5">Everything the engine holds, printed.</h2>

        <div className="mt-8 grid gap-x-10 gap-y-8 lg:grid-cols-2">
          <div className="border-y border-line-strong">
            <div className="px-5 py-3 border-b border-line bg-canvas"><h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink">Thirteen realms</h3></div>
            <table className="w-full text-sm"><tbody className="divide-y divide-line">
              {REALMS.map((r, i) => (
                <tr key={r}><td className="px-5 py-2 font-mono text-xs text-copper w-10">{i + 1}</td><td className="px-5 py-2 text-ink">{r}</td></tr>
              ))}
              <tr className="bg-canvas/60"><td className="px-5 py-2 font-mono text-xs text-copper">0</td><td className="px-5 py-2 text-ink">The centre — Core Self, the observer</td></tr>
            </tbody></table>
          </div>

          <div className="border-y border-line-strong">
            <div className="px-5 py-3 border-b border-line bg-canvas"><h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink">Nine forces · 91-year cycle</h3></div>
            <table className="w-full text-sm"><tbody className="divide-y divide-line">
              {APS_LORDS.map((l) => (
                <tr key={l.force}>
                  <td className="px-5 py-2 text-ink">{l.force}</td>
                  <td className="px-5 py-2 text-ink-soft text-xs">{l.graha}</td>
                  <td className="px-5 py-2 text-right font-mono text-xs text-ink-soft">{l.years} y</td>
                </tr>
              ))}
              <tr className="bg-canvas/60"><td className="px-5 py-2 font-mono text-xs text-ink" colSpan={2}>Total</td><td className="px-5 py-2 text-right font-mono text-xs text-copper">91 y</td></tr>
            </tbody></table>
          </div>

          <div className="border-y border-line-strong">
            <div className="px-5 py-3 border-b border-line bg-canvas"><h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink">Dignity · Axiomatic Shadbala</h3></div>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-line text-left">
                {['Force', 'Exalted', 'Mool.', 'Own', 'Debil.'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-ink-muted">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-line">
                {DIGNITY.map((d) => (
                  <tr key={d.force}>
                    <td className="px-3 py-2 text-ink text-xs">{d.force}</td>
                    <td className="px-3 py-2 font-mono text-xs text-ink-soft">{d.exalted}</td>
                    <td className="px-3 py-2 font-mono text-xs text-ink-soft">{d.moolatrikona}</td>
                    <td className="px-3 py-2 font-mono text-xs text-ink-soft">{d.own.join(',')}</td>
                    <td className="px-3 py-2 font-mono text-xs text-ink-soft">{d.debilitated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-5 py-3 border-t border-line text-[11px] text-ink-muted">Scores: exalted 100 · moolatrikona 85 · own 70 · friendly 55 · neutral 45 · enemy 25 · debilitated 10.</p>
          </div>

          <div className="border-y border-line-strong">
            <div className="px-5 py-3 border-b border-line bg-canvas"><h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink">The 27 stations</h3></div>
            <div className="grid grid-cols-3 gap-x-4 px-5 py-3 text-xs">
              {STATIONS.map((s, i) => (
                <div key={s} className="flex gap-2 py-0.5"><span className="font-mono text-copper w-5 text-right">{i + 1}</span><span className="text-ink-soft truncate">{s}</span></div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="kicker"><span className="n">III</span><span>The thirteen Sphiras</span></div>
          <h3 className="h2-ed mt-4">Every field, as the master table gives it.</h3>
          <div className="mt-5 border-y border-line-strong">
            <table className="w-full text-sm">
              <thead><tr className="bg-canvas border-b border-line text-left">
                {['#', 'Sphira', 'Core', 'Vector', 'Traits', 'Shadow'].map((h) => (
                  <th key={h} className="px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-line">
                {SPHIRAS.map((sp) => (
                  <tr key={sp.n} className="align-top">
                    <td className="px-3 py-2 font-serif font-bold text-copper tabular-nums">{sp.n}</td>
                    <td className="px-3 py-2 text-ink whitespace-nowrap">{sp.name}</td>
                    <td className="px-3 py-2 text-ink-soft text-xs">{sp.core}</td>
                    <td className="px-3 py-2 text-ink-soft text-xs">{sp.planet}</td>
                    <td className="px-3 py-2 text-ink-soft text-xs">{sp.traits}</td>
                    <td className="px-3 py-2 text-ink-muted text-xs">{sp.shadow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10">
          <div className="kicker"><span className="n">IV</span><span>The 117 bindings</span></div>
          <h3 className="h2-ed mt-4">The formula index, transcribed whole.</h3>
          <p className="lede mt-3">
            Each binding is computed above from your four inputs, and every row prints the arithmetic it used.
            The document supplies the arithmetic for F1, F3 and F4; for the rest it names the binding and its
            inputs only, so those are evaluated through a declared operator pattern and labelled <em>derived</em>.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(
              FORMULAS.reduce((acc, f) => { (acc[f.domain] ||= []).push(f); return acc; }, {} as Record<string, typeof FORMULAS>)
            ).map(([domain, list]) => (
              <div key={domain} className="rounded-xl border border-line bg-surface p-4">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-copper">{domain}</p>
                <p className="mt-0.5 text-[10px] text-ink-muted">F{list[0].id}–F{list[list.length - 1].id}</p>
                <ul className="mt-2 space-y-1 text-[11px] text-ink-soft">
                  {list.map((f) => (
                    <li key={f.id} className="flex gap-2"><span className="font-mono text-ink-muted w-8 shrink-0">{f.id}</span><span className="truncate">{f.name}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/workspace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-[0.16em] text-ink hover:border-copper/50">
            The aṅka engine
          </Link>
          <Link href="/method" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-[0.16em] text-ink hover:border-copper/50">
            Method and provenance
          </Link>
        </div>
      </section>
    </div>
  );
}
