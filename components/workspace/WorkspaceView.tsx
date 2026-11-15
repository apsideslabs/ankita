'use client';

import { useMemo, useState } from 'react';
import {
  ArrowRight, User, CalendarDays, Grid3x3, Clock, Type, ShieldCheck, Info, AlertCircle, ListOrdered, BookOpen, Gem, Sparkles, Compass,
} from 'lucide-react';
import { buildProfile } from '@/lib/engine/profile';
import { GRID, PLANES } from '@/lib/engine/loshu';
import { CHALDEAN_COLUMNS } from '@/lib/engine/chaldean';
import { NUMERAL_GRAHA, friendshipMatrix, RELATION_GLOSS } from '@/lib/engine/planets';
import { SOURCES, sourceById } from '@/lib/engine/provenance';
import { HarmonyTriangle } from '@/components/workspace/HarmonyTriangle';
import { DashaPanel } from '@/components/workspace/DashaPanel';
import { GrahasPanel } from '@/components/workspace/GrahasPanel';
import type { BirthInput, Profile } from '@/lib/engine/types';

const TABS = [
  { id: 'chart', label: 'Chart', icon: User },
  { id: 'grid', label: 'Grid', icon: Grid3x3 },
  { id: 'timing', label: 'Timing', icon: Clock },
  { id: 'grahas', label: 'Grahas', icon: Compass },
  { id: 'name', label: 'Name', icon: Type },
  { id: 'reading', label: 'Reading', icon: BookOpen },
  { id: 'everything', label: 'Everything', icon: ListOrdered },
  { id: 'sources', label: 'Sources', icon: ShieldCheck },
] as const;

type TabId = (typeof TABS)[number]['id'];

function Chip({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'copper' | 'muted' }) {
  const cls =
    tone === 'copper'
      ? 'border-copper/30 bg-copper-wash text-copper'
      : tone === 'muted'
      ? 'border-line bg-canvas text-ink-muted'
      : 'border-line bg-white/70 text-ink-soft';
  return <span className={`px-2 py-0.5 rounded border text-[10px] font-mono uppercase tracking-wider ${cls}`}>{children}</span>;
}

export function WorkspaceView() {
  const [name, setName] = useState('John Smith');
  const [date, setDate] = useState('1995-08-29');
  const [gender, setGender] = useState<BirthInput['gender']>('unspecified');
  const [master, setMaster] = useState(false);
  const [input, setInput] = useState<BirthInput | null>({ name: 'John Smith', date: '1995-08-29', gender: 'unspecified', masterNumbers: false });
  const [tab, setTab] = useState<TabId>('chart');

  const result = useMemo(() => (input ? buildProfile(input) : null), [input]);
  const profile = result && !('error' in result) ? (result as Profile) : null;
  const error = result && 'error' in result ? result.error : null;

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 py-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="kicker"><span className="n">Workspace</span></div>
          <h1 className="page-title mt-4">Reading console</h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            Enter a name and a date. Everything below is computed in this browser.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Chip tone="muted">engine v1</Chip>
          <Chip tone="copper">deterministic</Chip>
        </div>
      </div>

      {/* Input */}
      <form
        className="mt-6 border-y border-line-strong py-5"
        onSubmit={(e) => {
          e.preventDefault();
          setInput({ name, date, gender, masterNumbers: master });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.9fr_auto] lg:items-end">
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Full name</span>
            <div className="mt-1.5 relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Smith"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
            </div>
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Date of birth</span>
            <div className="mt-1.5 relative">
              <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input type="date" max={today} value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
            </div>
          </label>
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Kua (optional)</span>
            <select value={gender} onChange={(e) => setGender(e.target.value as BirthInput['gender'])}
              className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50">
              <option value="unspecified">Skip</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark transition-colors btn-press">
            Compute <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <label className="mt-4 inline-flex items-center gap-2 text-xs text-ink-soft select-none">
          <input type="checkbox" checked={master} onChange={(e) => setMaster(e.target.checked)}
            className="w-3.5 h-3.5 rounded border-line text-copper focus:ring-copper/40" />
          Keep master numbers (11, 22, 33) instead of reducing to 1–9
        </label>
        {error && (
          <p className="mt-3 flex items-center gap-2 text-sm text-copper"><AlertCircle className="w-4 h-4" />{error}</p>
        )}
      </form>

      {/* Empty state */}
      {!profile && (
        <div className="mt-8 rounded-2xl border border-dashed border-line-strong bg-surface/60 p-10 text-center">
          <Grid3x3 className="w-8 h-8 text-line-strong mx-auto" />
          <p className="mt-3 font-serif text-lg text-ink">No reading yet</p>
          <p className="mt-1 text-sm text-ink-soft">Fill the two fields above and press Compute. Try <span className="font-mono">John Smith, 1995-08-29</span> to see the engine reproduce Cheiro’s own example.</p>
        </div>
      )}

      {profile && (
        <>
          {/* Tabs */}
          <div className="sticky top-0 z-30 -mx-3 sm:-mx-6 lg:-mx-8 xl:-mx-10 px-3 sm:px-6 lg:px-8 xl:px-10 mt-8 flex flex-wrap items-center gap-1 border-b border-line bg-canvas/95 backdrop-blur-sm">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono uppercase tracking-[0.14em] border-b-2 -mb-px transition-colors ${
                    active ? 'border-copper text-ink font-bold' : 'border-transparent text-ink-soft hover:text-ink'
                  }`}>
                  <t.icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              );
            })}
          </div>

          {tab === 'chart' && (
            <div className="mt-8 space-y-8">
              {/* Specimen sheet: the three core numbers, ruled rather than carded */}
              <div className="border-y border-line divide-y divide-line sm:divide-y-0 sm:grid sm:grid-cols-3 sm:divide-x">
                {[
                  { label: 'Mūlāṅka', sub: 'psychic · from the day', fact: profile.mulank },
                  { label: 'Bhāgyāṅka', sub: 'destiny · whole date', fact: profile.bhagyank },
                  { label: 'Nāmāṅka', sub: 'name · Chaldean', fact: profile.namank },
                ].map((c) => {
                  const g = NUMERAL_GRAHA[((c.fact.value - 1) % 9) + 1];
                  return (
                    <div key={c.label} className="px-0 py-6 sm:px-6 sm:first:pl-0">
                      <div className="flex items-baseline justify-between">
                        <p className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-ink-muted">{c.label}</p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-copper">{g?.graha}</p>
                      </div>
                      <p className="mt-3 font-serif text-[5.2rem] leading-[0.85] font-semibold text-ink tabular-nums">
                        {c.fact.value}
                      </p>
                      <p className="mt-3 text-sm text-ink-soft">{c.sub}</p>
                      <p className="mt-2 text-sm text-ink-soft leading-relaxed">{g?.note}</p>
                      {c.fact.compound !== null && c.fact.compound !== c.fact.value && (
                        <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-muted">
                          compound {c.fact.compound}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <p className="kicker"><span className="n">i</span><span>Friendships between the three</span></p>
                  <ul className="mt-4">
                    {[[profile.mulank.value, profile.bhagyank.value], [profile.bhagyank.value, profile.namank.value], [profile.mulank.value, profile.namank.value]].map(([a, b], i) => {
                      const rel = friendshipMatrix().find((r) => r.a === a)?.row[(b - 1) % 9];
                      const tone = rel === 'friend' ? 'text-emerald-700' : rel === 'enemy' ? 'text-copper' : 'text-ink-soft';
                      return (
                        <li key={i} className="flex items-baseline justify-between border-b border-line py-2.5 text-sm">
                          <span className="font-mono text-ink">{a} · {b}</span>
                          <span className={`font-medium capitalize ${tone}`}>{rel}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 text-xs text-ink-soft">{RELATION_GLOSS.neutral}</p>
                </div>

                <div>
                  <p className="kicker"><span className="n">ii</span><span>Kua &amp; direction</span></p>
                  {profile.kua ? (
                    <>
                      <div className="mt-4 flex items-end gap-4">
                        <p className="font-serif text-[4rem] leading-[0.85] font-semibold text-ink tabular-nums">{profile.kua.value}</p>
                        <p className="pb-2 text-sm text-ink-soft max-w-[22ch]">{profile.kua.note}</p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">Favourable</p>
                          <p className="mt-1 text-ink">{profile.kua.directions.good.join(' · ')}</p>
                        </div>
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">Avoid</p>
                          <p className="mt-1 text-ink-soft">{profile.kua.directions.bad.join(' · ')}</p>
                        </div>
                      </div>
                      <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">Chinese · compass school</p>
                    </>
                  ) : (
                    <p className="mt-4 text-sm text-ink-soft">Select a gender in the form to compute the Kua number. It is a Chinese calculation and needs the branch for the birth century.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'grid' && (
            <div className="mt-6 grid gap-4 lg:grid-cols-[auto_1fr]">
              <div className="rounded-xl border border-line bg-surface p-6 shadow-3d-card">
                <div className="grid grid-cols-3 gap-1.5 w-[260px]">
                  {GRID.flat().map((d) => {
                    const cell = profile.grid.find((c) => c.digit === d)!;
                    const on = cell.count > 0;
                    return (
                      <div key={d} className={`aspect-square rounded-md border flex flex-col items-center justify-center ${
                        on ? 'bg-copper/10 border-copper/40' : 'bg-white/50 border-line'
                      }`}>
                        <span className={`font-serif text-2xl font-bold tabular-nums ${on ? 'text-copper' : 'text-ink-muted/50'}`}>{d}</span>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-ink-muted">
                          {cell.count > 0 ? `×${cell.count}` : '—'}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-ink-soft">
                  Every row, column and diagonal sums to 15. The grid is the Lo Shu square — Chinese in origin.
                </p>
                <p className="mt-2 text-[11px] text-ink-muted">
                  Placement: every non-zero digit of the date, plus the bhāgyāṅka, plus the mūlāṅka when the birth
                  day is 10 or more. The name number and the Kua number are not placed.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-surface p-6">
                  <h3 className="font-serif text-lg font-bold text-ink">Lines</h3>
                  <ul className="mt-3 space-y-2">
                    {profile.lines.map((l) => (
                      <li key={l.id} className="flex items-center justify-between text-sm">
                        <span className="text-ink-soft">{l.label} <span className="font-mono text-[11px] text-ink-muted">{l.cells.join('-')}</span></span>
                        <span className={`text-[11px] font-mono uppercase tracking-wider ${l.complete ? 'text-copper' : 'text-ink-muted'}`}>
                          {l.complete ? 'complete' : 'open'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-line bg-surface p-6">
                  <h3 className="font-serif text-lg font-bold text-ink">Missing &amp; amplified</h3>
                  <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Missing</p>
                  <p className="mt-1 text-sm text-ink-soft">{profile.missing.length ? profile.missing.join(', ') : 'none'}</p>
                  <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Three or more</p>
                  <p className="mt-1 text-sm text-ink-soft">{profile.repeated.length ? profile.repeated.join(', ') : 'none'}</p>
                  <p className="mt-4 pt-4 border-t border-line text-xs text-ink-soft">
                    Line names (mental, emotional, practical) belong to the modern Lo Shu literature, not to jyotiṣa.
                  </p>
                </div>
              </div>
            </div>
          )}

          {tab === 'timing' && (
            <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
              <div>
                <p className="kicker"><span className="n">i</span><span>Vimśottarī daśā</span></p>
                <div className="mt-4">
                  <DashaPanel date={profile.input.date} />
                </div>
              </div>
              <aside className="space-y-6">
                <div>
                  <p className="kicker"><span className="n">ii</span><span>Personal cycles</span></p>
                  <div className="mt-3 divide-y divide-line border-y border-line">
                    {profile.timing.map((t) => (
                      <div key={t.label} className="flex items-start justify-between gap-4 py-3">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">{t.label}</p>
                          <p className="mt-1 text-xs text-ink-soft leading-relaxed">{t.detail}</p>
                        </div>
                        <p className="font-serif text-3xl font-semibold text-ink tabular-nums leading-none">{t.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-[11px] leading-relaxed text-ink-muted">
                  The 45-year cycle beside the daśā is arithmetic — one year for 1, two for 2, to nine, summing to
                  45. It is not a classical daśā and is labelled as a modern cycle. Vimśottarī is computed from the
                  Moon’s sidereal longitude.
                </p>
              </aside>
            </div>
          )}

          {tab === 'grahas' && (
            <div className="mt-6">
              <GrahasPanel date={profile.input.date} />
            </div>
          )}

          {tab === 'name' && (
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="font-serif text-lg font-bold text-ink">Letter arithmetic</h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {profile.breakdown.map((b, i) => (
                    <span key={i} className="inline-flex flex-col items-center px-2.5 py-1.5 rounded-md border border-line bg-white/70">
                      <span className="font-mono text-sm text-ink">{b.letter}</span>
                      <span className="font-mono text-[10px] text-copper">{b.value}</span>
                    </span>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-line grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Compound</p><p className="font-serif text-2xl font-bold text-ink">{profile.compound}</p></div>
                  <div><p className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Root</p><p className="font-serif text-2xl font-bold text-ink">{profile.namank.value}</p></div>
                </div>
                {profile.namank.meaning && <p className="mt-4 text-sm text-ink-soft leading-relaxed">{profile.namank.meaning}</p>}
              </div>
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="font-serif text-lg font-bold text-ink">The Chaldean table</h3>
                <div className="mt-4 space-y-1.5">
                  {CHALDEAN_COLUMNS.map((c) => (
                    <div key={c.value} className="flex items-center gap-3 text-sm">
                      <span className="w-5 text-right font-mono text-copper">{c.value}</span>
                      <span className="font-mono tracking-[0.18em] text-ink">{c.letters.join(' ')}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 text-sm pt-2 border-t border-line">
                    <span className="w-5 text-right font-mono text-ink-muted">9</span>
                    <span className="text-xs text-ink-soft">unassigned — Cheiro reserves it for the nine-lettered name of God</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'reading' && (
            <div className="mt-6 space-y-5">
              {(['mulank', 'bhagyank', 'namank'] as const).map((k, idx) => {
                const r = profile.reading[k];
                const labels = { mulank: 'Mūlāṅka', bhagyank: 'Bhāgyāṅka', namank: 'Nāmāṅka' };
                return (
                  <article key={k} className="border-t border-line pt-6 first:border-t-0 first:pt-0">
                    <div className="grid gap-x-8 gap-y-4 sm:grid-cols-[7rem_1fr]">
                      <div>
                        <p className="font-serif text-[5rem] leading-[0.8] font-semibold text-copper tabular-nums">{r.n}</p>
                        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">{labels[k]}</p>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <h3 className="font-serif text-2xl font-semibold text-ink">{r.title}</h3>
                          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-copper">{r.day}</span>
                        </div>
                        <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-[62ch]">{r.nature}</p>
                        <div className="mt-5 grid gap-5 sm:grid-cols-3 border-t border-line pt-4">
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-800">Strengths</p>
                            <ul className="mt-1.5 space-y-1 text-xs text-ink-soft">{r.strengths.map((x) => <li key={x}>· {x}</li>)}</ul>
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-copper">To watch</p>
                            <ul className="mt-1.5 space-y-1 text-xs text-ink-soft">{r.watch.map((x) => <li key={x}>· {x}</li>)}</ul>
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">Work</p>
                            <ul className="mt-1.5 space-y-1 text-xs text-ink-soft">{r.careers.map((x) => <li key={x}>· {x}</li>)}</ul>
                          </div>
                        </div>
                        <p className="mt-3 text-[11px] text-ink-muted">{r.body}</p>
                      </div>
                    </div>
                  </article>
                );
              })}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="kicker"><span className="n">i</span><span>The harmony triangle</span></p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-6">
                    <HarmonyTriangle
                      m={profile.reading.harmony[2].pair[0]}
                      b={profile.reading.harmony[0].pair[1]}
                      n={profile.reading.harmony[1].pair[1]}
                      ab={profile.reading.harmony[0].relation}
                      bn={profile.reading.harmony[1].relation}
                      ma={profile.reading.harmony[2].relation}
                    />
                    <ul className="space-y-3 text-xs flex-1">
                      {profile.reading.harmony.map((h, i) => (
                        <li key={i} className="border-l-2 border-line pl-3">
                          <p className="font-mono text-ink">
                            {h.pair[0]} · {h.pair[1]}
                            <span className={`ml-2 text-[9px] uppercase tracking-wider ${
                              h.relation === 'friend' ? 'text-emerald-700' : h.relation === 'enemy' ? 'text-copper' : 'text-ink-muted'
                            }`}>{h.relation}</span>
                          </p>
                          <p className="mt-0.5 text-ink-soft">{h.line}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="kicker"><span className="n">ii</span><span>Lucky elements</span></p>
                  <p className="mt-2 text-xs text-ink-soft">Taken from the ruling planet of the mūlāṅka.</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-4"><dt className="text-ink-muted text-xs uppercase tracking-wider font-mono">Numbers</dt><dd className="text-ink">{profile.lucky.numbers.join(', ')}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-muted text-xs uppercase tracking-wider font-mono">Day</dt><dd className="text-ink">{profile.lucky.days.join(', ')}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-muted text-xs uppercase tracking-wider font-mono">Colours</dt><dd className="text-ink">{profile.lucky.colours.join(', ')}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-muted text-xs uppercase tracking-wider font-mono">Stone</dt><dd className="text-ink text-right">{profile.lucky.gemstone}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-muted text-xs uppercase tracking-wider font-mono">Mantra</dt><dd className="text-ink text-right">{profile.lucky.mantra}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-muted text-xs uppercase tracking-wider font-mono">Direction</dt><dd className="text-ink">{profile.lucky.direction}</dd></div>
                  </dl>
                  <p className="mt-4 pt-3 border-t border-line text-[11px] text-ink-muted">
                    Correspondences are classical navagraha material. The character readings above are summaries of
                    what the modern literature teaches, not verse.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-line bg-surface p-6">
                  <h3 className="font-serif text-lg font-bold text-ink">Missing digits</h3>
                  {profile.reading.missing.length ? (
                    <ul className="mt-3 space-y-2">
                      {profile.reading.missing.map((x) => (
                        <li key={x.n} className="text-sm text-ink-soft"><span className="font-serif font-bold text-copper">{x.n}</span> — {x.text}</li>
                      ))}
                    </ul>
                  ) : <p className="mt-3 text-sm text-ink-soft">No missing digits.</p>}
                </div>
                <div className="rounded-xl border border-line bg-surface p-6">
                  <h3 className="font-serif text-lg font-bold text-ink">Amplified digits</h3>
                  {profile.reading.repeated.length ? (
                    <ul className="mt-3 space-y-2">
                      {profile.reading.repeated.map((x) => (
                        <li key={x.n} className="text-sm text-ink-soft"><span className="font-serif font-bold text-copper">{x.n}</span> — {x.text}</li>
                      ))}
                    </ul>
                  ) : <p className="mt-3 text-sm text-ink-soft">No digit appears three times or more.</p>}
                </div>
              </div>
            </div>
          )}

          {tab === 'everything' && (
            <div className="mt-6 space-y-6">
              <div className="rounded-xl border border-line bg-surface p-6">
                <h3 className="font-serif text-lg font-bold text-ink">Every step the engine took</h3>
                <p className="mt-1 text-sm text-ink-soft">
                  Nothing is computed that is not printed here. Each row shows the arithmetic, the result,
                  and the rule it came from.
                </p>
              </div>
              {['input', 'core', 'name', 'grid', 'kua', 'timing'].map((section) => {
                const rows = profile.trace.filter((t) => t.section === section);
                if (!rows.length) return null;
                const titles: Record<string, string> = {
                  input: 'Input', core: 'Core numbers', name: 'Name arithmetic',
                  grid: 'Lo Shu grid', kua: 'Kua number', timing: 'Timing',
                };
                return (
                  <div key={section} className="rounded-xl border border-line bg-surface overflow-hidden">
                    <div className="px-5 py-3 border-b border-line bg-canvas">
                      <h4 className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink">{titles[section]}</h4>
                    </div>
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-line">
                        {rows.map((r) => {
                          const src = sourceById(r.sourceId);
                          return (
                            <tr key={r.id} className="align-top">
                              <td className="px-5 py-3 w-[26%] text-ink font-medium">{r.label}</td>
                              <td className="px-5 py-3 text-ink-soft font-mono text-xs">
                                {r.expression}
                                {r.detail && <span className="block mt-1 font-sans text-[11px] text-ink-muted">{r.detail}</span>}
                              </td>
                              <td className="px-5 py-3 w-[10%] text-right font-serif text-lg font-bold text-ink tabular-nums">{String(r.result)}</td>
                              <td className="px-5 py-3 w-[16%] text-right">
                                <span className="text-[9px] font-mono uppercase tracking-wider text-ink-muted">{src?.label ?? r.sourceId}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
              <div className="rounded-xl border border-line bg-surface p-6">
                <h4 className="font-serif text-lg font-bold text-ink">Everything else the engine holds</h4>
                <p className="mt-1 text-sm text-ink-soft">
                  The full constant tables — 108 syllables, 43 compound glosses, the 9×9 matrix, the Lo Shu
                  lines, the bhūtasaṅkhyā vocabulary — are printed on the Engine page.
                </p>
                <a href="/engine" className="mt-3 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-copper hover:text-copper-dark">
                  Open the engine tables <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {tab === 'sources' && (
            <div className="mt-6 rounded-xl border border-line bg-surface overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-canvas border-b border-line text-left">
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Figure</th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Source</th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Year</th>
                    <th className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {SOURCES.map((s) => (
                    <tr key={s.id} className="align-top">
                      <td className="px-4 py-3 font-medium text-ink">{s.label}</td>
                      <td className="px-4 py-3 text-ink-soft">{s.source}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink-soft">{s.year ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${
                          s.status === 'verified' ? 'text-emerald-700' : s.status === 'attributed' ? 'text-amber-700' : 'text-copper'
                        }`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
