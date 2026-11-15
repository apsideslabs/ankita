'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import {
  apsTimeline, coreSelf, moonSidereal, nameNumbers, station,
  personalLunarYear, personalLunarMonth, personalLunarDay, REALMS,
} from '@/lib/engine/aa';
import { buildAChart } from '@/lib/engine/aa/charts';
import { SPHIRAS } from '@/lib/engine/aa/sphiras';

export function AARing({ core }: { core: number }) {
  const r = 62, cx = 80, cy = 80;
  return (
    <svg viewBox="0 0 160 160" className="w-[150px] h-[150px]" aria-label={`Realm ring, core self ${core}`}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        const active = i + 1 === core;
        return (
          <g key={i}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.7" />
            <circle cx={x} cy={y} r={active ? 6 : 3} fill="currentColor" fillOpacity={active ? 1 : 0.35} />
            <text x={cx + (r + 14) * Math.cos(a)} y={cy + (r + 14) * Math.sin(a) + 2.5}
              textAnchor="middle" fontSize="6" fill="currentColor" fillOpacity="0.5">{i + 1}</text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="13" fill="currentColor" fillOpacity="0.9" />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#FCFAF6">{core}</text>
    </svg>
  );
}

export function AAConsole() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [hour, setHour] = useState('12');
  const [go, setGo] = useState(false);

  const out = useMemo(() => {
    if (!go) return null;
    const [y, m, d] = date.split('-').map(Number);
    if (!y || !m || !d) return { error: 'Enter a date of birth.' } as const;
    if (!name.trim()) return { error: 'Enter the name.' } as const;
    const cs = coreSelf(d, m, y);
    const nm = nameNumbers(name);
    const moon = moonSidereal(date, Number(hour) || 12);
    const st = station(moon.sidereal);
    const aps = apsTimeline(st);
    const now = new Date();
    const ply = personalLunarYear(d, m, y, now.getFullYear());
    const plm = personalLunarMonth(ply, now.getMonth() + 1);
    const pld = personalLunarDay(plm, now.getDate());
    const chart = buildAChart({ name, date, hour: Number(hour) || 12 });
    return { cs, nm, moon, st, aps, ply, plm, pld, date, chart };
  }, [go, name, date, hour]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-2xl border border-line bg-surface shadow-3d-console overflow-hidden">
      <div className="px-5 sm:px-7 py-4 border-b border-line flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink font-semibold">AA console</h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">separate engine</span>
      </div>

      <form className="p-5 sm:p-7 grid gap-4 sm:grid-cols-[1.3fr_1fr_0.6fr_auto] sm:items-end"
        onSubmit={(e) => { e.preventDefault(); setGo(true); }}>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="As written"
            className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Date of birth</span>
          <input type="date" max={today} value={date} onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Hour (UT)</span>
          <input type="number" min={0} max={23} value={hour} onChange={(e) => setHour(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
        </label>
        <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark btn-press">
          Compute <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      {out && 'error' in out && (
        <p className="px-5 sm:px-7 pb-6 flex items-center gap-2 text-sm text-copper"><AlertCircle className="w-4 h-4" />{out.error}</p>
      )}

      {out && !('error' in out) && (
        <div className="border-t border-line animate-rise">
          <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[auto_1fr] md:items-center">
            <div className="text-copper"><AARing core={out.cs.core} /></div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Core Self', out.cs.core, REALMS[out.cs.core - 1] ?? 'centre'],
                ['DPN', out.nm.dpn, 'destiny path'],
                ['SWN', out.nm.swn, 'soul weave'],
                ['PMN', out.nm.pmn, 'persona mask'],
                ['Station', out.st.number, `${out.st.name} · pada ${out.st.pada}`],
                ['APS', out.aps.current.force, `${out.aps.remaining.toFixed(1)} yrs remaining`],
              ].map(([label, value, sub]) => (
                <div key={String(label)}>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">{label}</p>
                  <p className="font-serif text-3xl font-bold text-ink tabular-nums leading-none mt-1">{value}</p>
                  <p className="text-[11px] text-ink-soft mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 sm:px-7 pb-6 grid gap-5 md:grid-cols-2">
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Compound core</p>
              <p className="mt-1 text-sm text-ink-soft font-mono">
                {out.cs.dayValue} + {out.cs.monthValue} + {out.cs.yearValue} = {out.cs.compound} → {out.cs.core}
              </p>
              <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Name sum</p>
              <p className="mt-1 text-sm text-ink-soft font-mono">
                ALC total {out.nm.total} → {out.nm.dpn} · vowels {out.nm.vowels.join('')} → {out.nm.swn} · consonants {out.nm.consonants.join('')} → {out.nm.pmn}
              </p>
              <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Moon</p>
              <p className="mt-1 text-sm text-ink-soft font-mono">
                tropical {out.moon.tropical.toFixed(2)}° − ayanāṃśa {out.moon.ay.toFixed(2)}° = sidereal {out.moon.sidereal.toFixed(2)}°
              </p>
              {out.st.degreesToBoundary < 0.5 && (
                <p className="mt-2 text-[11px] text-copper">Within {out.st.degreesToBoundary}° of a station boundary — check against an ephemeris.</p>
              )}
            </div>

            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">91-year APS cycle</p>
              <table className="mt-2 w-full text-xs">
                <tbody className="divide-y divide-line">
                  {out.aps.segments.map((s) => (
                    <tr key={s.force}>
                      <td className="py-1.5 text-ink">{s.force}</td>
                      <td className="py-1.5 text-ink-muted">{s.graha}</td>
                      <td className="py-1.5 text-right font-mono text-ink-soft">{s.years}y</td>
                      <td className="py-1.5 text-right font-mono text-ink-muted">
                        {s.startAge.toFixed(1)} → {s.endAge.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-5 sm:px-7 py-4 border-t border-line grid grid-cols-3 gap-4">
            {[['PLY', out.ply], ['PLM', out.plm], ['PLD', out.pld]].map(([l, v]) => (
              <div key={String(l)}>
                <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">{l}</p>
                <p className="font-serif text-2xl font-bold text-ink tabular-nums">{v}</p>
              </div>
            ))}
          </div>

          {/* The A-Chart — thirteen Axiom Laws */}
          <div className="px-5 sm:px-7 py-5 border-t border-line">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">The A-Chart · thirteen laws</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">mod13</p>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {out.chart.values.map((v) => (
                <div key={v.law} className="rounded-lg border border-line bg-canvas/50 px-3 py-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">{v.law}</span>
                    <span className="font-serif text-2xl font-bold text-copper tabular-nums leading-none">{v.value}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-ink truncate">{SPHIRAS[v.sphira - 1].name}</p>
                  <p className="text-[9px] text-ink-muted truncate">{SPHIRAS[v.sphira - 1].planet}</p>
                </div>
              ))}
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em] text-copper">
                Seeds and derivations
              </summary>
              <table className="mt-3 w-full text-xs">
                <tbody className="divide-y divide-line">
                  {out.chart.seeds.map((sd) => (
                    <tr key={sd.key}>
                      <td className="py-1.5 pr-3 font-mono text-[10px] text-ink-muted w-24">{sd.key}</td>
                      <td className="py-1.5 pr-3 text-ink">{sd.label}</td>
                      <td className="py-1.5 pr-3 text-ink-soft font-mono text-[10px]">{sd.derivation}</td>
                      <td className="py-1.5 pr-3 text-right font-serif font-bold text-ink tabular-nums w-10">{sd.value}</td>
                      <td className="py-1.5 text-right w-20">
                        <span className={`text-[9px] font-mono uppercase tracking-wider ${
                          sd.status === 'documented' ? 'text-emerald-700' : 'text-amber-700'
                        }`}>{sd.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-muted">
                The source document defines D1 and N1 explicitly. The remaining seeds are named in the
                laws but never defined; this engine derives each from the four canonical inputs and says so.
              </p>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
