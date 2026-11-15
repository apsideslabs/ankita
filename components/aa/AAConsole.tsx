'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';
import {
  apsTimeline, coreSelf, moonSidereal, nameNumbers, station,
  personalLunarYear, personalLunarMonth, personalLunarDay, REALMS,
} from '@/lib/engine/aa';
import { buildAChart } from '@/lib/engine/aa/charts';
import { SPHIRAS } from '@/lib/engine/aa/sphiras';
import { computeBindings, byDomain } from '@/lib/engine/aa/bindings';
import { CITIES, findCity, parseTime, localMinutes, localMeanMinutes } from '@/lib/engine/aa/inputs';

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
  const [time, setTime] = useState('12:00');
  const [city, setCity] = useState('Guwahati');
  const [tz, setTz] = useState('330');
  const [go, setGo] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  const out = useMemo(() => {
    if (!go) return null;
    const [y, m, d] = date.split('-').map(Number);
    if (!y || !m || !d) return { error: 'Enter a date of birth.' } as const;
    if (!name.trim()) return { error: 'Enter the name at birth.' } as const;
    const place = findCity(city) ?? CITIES[0];
    const t = parseTime(time, Number(tz));
    const minutes = localMinutes(t);
    const lmt = localMeanMinutes(t, place.lon);

    const cs = coreSelf(d, m, y);
    const nm = nameNumbers(name);
    const moon = moonSidereal(date, t.hh - Number(tz) / 60);
    const st = station(moon.sidereal);
    const aps = apsTimeline(st);
    const now = new Date();
    const ply = personalLunarYear(d, m, y, now.getFullYear());
    const plm = personalLunarMonth(ply, now.getMonth() + 1);
    const pld = personalLunarDay(plm, now.getDate());

    const input = { name, date, hour: t.hh, minute: t.mm, lat: place.lat, lon: place.lon };
    const chart = buildAChart(input);
    const bindings = computeBindings(input);

    return { cs, nm, moon, st, aps, ply, plm, pld, chart, bindings, place, t, minutes, lmt };
  }, [go, name, date, time, city, tz]);

  return (
    <div className="rounded-2xl border border-line bg-surface shadow-3d-console overflow-hidden">
      <div className="px-5 sm:px-7 py-4 border-b border-line flex items-center justify-between">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink font-semibold">AA console</h2>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">four inputs · N1 · D1 · T1 · P1</span>
      </div>

      <form className="p-5 sm:p-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_1.2fr_auto] lg:items-end"
        onSubmit={(e) => { e.preventDefault(); setGo(true); }}>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Name at birth</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Exact string"
            className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Date of birth</span>
          <input type="date" max={today} value={date} onChange={(e) => setDate(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Time</span>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50" />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">Place</span>
          <select value={city} onChange={(e) => setCity(e.target.value)}
            className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-1 focus:ring-copper/50">
            {CITIES.map((c) => <option key={c.name + c.state} value={c.name}>{c.name}, {c.state}</option>)}
          </select>
        </label>
        <button type="submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark btn-press">
          Compute <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="px-5 sm:px-7 pb-4 -mt-2">
        <label className="inline-flex items-center gap-2 text-[11px] text-ink-muted">
          Timezone
          <select value={tz} onChange={(e) => setTz(e.target.value)} className="px-2 py-1 rounded border border-line bg-white text-[11px]">
            <option value="330">IST +05:30</option>
            <option value="0">UTC</option>
            <option value="-300">EST −05:00</option>
            <option value="240">GST +04:00</option>
            <option value="480">SGT +08:00</option>
          </select>
          <span className="font-mono text-[10px]">· the four seeds N1 D1 T1 P1</span>
        </label>
      </div>

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
                  <p className="font-serif text-3xl font-semibold text-ink tabular-nums leading-none mt-1">{value}</p>
                  <p className="text-[11px] text-ink-soft mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 sm:px-7 pb-6 grid gap-5 md:grid-cols-2 border-t border-line pt-5">
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Seeds</p>
              <p className="mt-1 text-sm text-ink-soft font-mono">
                D1 {out.chart.seeds[0].value} · N1 {out.chart.seeds[1].value} · T1 {out.chart.seeds[2].value} · P1 {out.chart.seeds[3].value}
              </p>
              <p className="mt-2 text-[11px] text-ink-muted">
                {out.place.name} ({out.place.lat.toFixed(2)}°, {out.place.lon.toFixed(2)}°) · clock {time} · local minutes {out.minutes} · mean time {out.lmt.toFixed(0)}
              </p>
              <p className="mt-3 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Moon</p>
              <p className="mt-1 text-sm text-ink-soft font-mono">
                tropical {out.moon.tropical.toFixed(2)}° − {out.moon.ay.toFixed(2)}° = {out.moon.sidereal.toFixed(2)}°
              </p>
              {out.st.degreesToBoundary < 0.5 && (
                <p className="mt-2 text-[11px] text-copper">Within {out.st.degreesToBoundary}° of a station boundary — check against an ephemeris.</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">91-year APS cycle</p>
              <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-1 text-[11px]">
                {out.aps.segments.map((s) => (
                  <div key={s.force} className="flex justify-between border-b border-line/60 py-0.5">
                    <span className="text-ink">{s.force}</span>
                    <span className="font-mono text-ink-muted">{s.years}y</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* A-Chart */}
          <div className="px-5 sm:px-7 py-5 border-t border-line">
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">The A-Chart · thirteen laws</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">mod13</p>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {out.chart.values.map((v) => (
                <div key={v.law} className="border border-line bg-canvas/50 px-3 py-2.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">{v.law}</span>
                    <span className="font-serif text-2xl font-semibold text-copper tabular-nums leading-none">{v.value}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-ink truncate">{SPHIRAS[v.sphira - 1].name}</p>
                  <p className="text-[9px] text-ink-muted truncate">{SPHIRAS[v.sphira - 1].planet}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The 117 bindings, computed */}
          <div className="px-5 sm:px-7 py-5 border-t border-line">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">The 117 bindings · computed</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">value → sphira → reading</p>
            </div>
            <div className="mt-4 space-y-1">
              {byDomain(out.bindings).map((g, gi) => (
                <details key={g.domain} open={gi === 0} className="border-b border-line py-2">
                  <summary className="flex cursor-pointer items-baseline justify-between gap-3">
                    <span className="font-serif text-sm font-semibold text-ink">{g.domain}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
                      F{g.rows[0].id}–F{g.rows[g.rows.length - 1].id} · {g.rows.length} bindings
                    </span>
                  </summary>
                  <table className="mt-2 w-full text-xs">
                    <tbody className="divide-y divide-line/70">
                      {g.rows.map((b) => (
                        <tr key={b.id} className="align-top">
                          <td className="py-2 pr-3 font-mono text-[10px] text-ink-muted w-10">F{b.id}</td>
                          <td className="py-2 pr-3 w-[30%]">
                            <p className="text-ink">{b.name}</p>
                            <p className="font-mono text-[9px] text-ink-muted">{b.inputs}</p>
                          </td>
                          <td className="py-2 pr-3 font-mono text-[10px] text-ink-soft">{b.expression}</td>
                          <td className="py-2 pr-3 text-right font-serif text-lg font-semibold text-copper tabular-nums w-10">{b.value}</td>
                          <td className="py-2 text-[11px] text-ink-soft">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">{b.sphira}</span>
                            <span className="block">{b.reading}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
              Every row prints the arithmetic it used. The document supplies the arithmetic for F1, F3 and F4;
              for the rest it names the binding and its inputs, so the engine evaluates them through a declared
              operator pattern and shows the expression — nothing is hidden, and any binding you define can be
              dropped straight into <span className="font-mono">bindings.ts</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
