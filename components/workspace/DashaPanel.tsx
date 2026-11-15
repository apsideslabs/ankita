'use client';

import { useMemo } from 'react';
import { vimshottari, fmtDate, ageAt, DASHA_TOTAL } from '@/lib/engine/dasha';
import { moonSidereal } from '@/lib/engine/aa';
import { READINGS } from '@/lib/engine/interpretation';

/** Vimśottarī daśā, drawn as a timeline: the current period, then what follows. */
export function DashaPanel({ date, hour = 12 }: { date: string; hour?: number }) {
  const chart = useMemo(() => {
    const [y, m, d] = date.split('-').map(Number);
    if (!y || !m || !d) return null;
    const moon = moonSidereal(date, hour);
    const birth = new Date(Date.UTC(y, m - 1, d, hour));
    return { d: vimshottari(moon.sidereal, birth), moon, birth };
  }, [date, hour]);

  if (!chart) return null;
  const { d, moon } = chart;
  const now = new Date();

  return (
    <div className="space-y-6">
      <div className="grid gap-px bg-line border border-line sm:grid-cols-4">
        {[
          ['Nakṣatra', `${d.nakshatraIndex} · ${d.nakshatra}`, `pada ${d.pada}`],
          ['Mahādaśā at birth', d.lord, `${d.balanceYears.toFixed(2)} yr balance`],
          ['Running now', d.current ? d.current.lord : '—', d.current ? `since ${fmtDate(d.current.start)}` : ''],
          ['Antardaśā', d.currentAntar ? d.currentAntar.lord : '—', d.currentAntar ? `${fmtDate(d.currentAntar.start)} → ${fmtDate(d.currentAntar.end)}` : ''],
        ].map(([label, value, sub]) => (
          <div key={label} className="bg-surface px-4 py-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">{label}</p>
            <p className="mt-1.5 font-serif text-2xl font-semibold text-ink">{value}</p>
            <p className="mt-0.5 text-[11px] text-ink-soft">{sub}</p>
          </div>
        ))}
      </div>

      {d.current && (
        <div className="border-l-2 border-copper bg-surface px-5 py-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-copper">This period</p>
          <p className="mt-1 text-sm text-ink leading-relaxed">
            <strong className="font-serif text-base">{d.current.lord} mahādaśā</strong>, {fmtDate(d.current.start)} to {fmtDate(d.current.end)}
            {d.currentAntar && <> — now in the <strong>{d.currentAntar.lord}</strong> antardaśā</>}.
            {' '}{READINGS[d.current.graha].nature}
          </p>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            Work that answers to {READINGS[d.current.graha].title.toLowerCase()}: {READINGS[d.current.graha].careers.slice(0, 2).join(', ')}.
            Watch for {READINGS[d.current.graha].watch[0]}.
          </p>
        </div>
      )}

      <ol className="relative">
        {d.periods.map((p, i) => {
          const isCurrent = d.current?.lord === p.lord;
          const past = p.end < now;
          return (
            <li key={`${p.lord}-${i}`} className="relative flex gap-4 pb-5 last:pb-0">
              {i < d.periods.length - 1 && (
                <span className="absolute left-[5px] top-4 bottom-0 w-px bg-line" aria-hidden />
              )}
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 ${
                  isCurrent ? 'border-copper bg-copper' : past ? 'border-line-strong' : 'border-copper/40'
                }`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className={`font-serif text-base font-semibold ${isCurrent ? 'text-copper' : 'text-ink'}`}>{p.lord}</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">{p.years} yr</span>
                  <span className="font-mono text-[10px] text-ink-muted">
                    {fmtDate(p.start)} → {fmtDate(p.end)}
                  </span>
                  {p.partial && <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">balance at birth</span>}
                  {isCurrent && <span className="rounded bg-copper px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-surface">now</span>}
                </div>
                <p className="mt-0.5 text-xs text-ink-soft">
                  ages {Math.max(0, ageAt(chart.birth, p.start)).toFixed(1)}–{ageAt(chart.birth, p.end).toFixed(1)} ·{' '}
                  {READINGS[p.graha].title} · {READINGS[p.graha].strengths[0]}
                </p>
                {isCurrent && p.antardashas.length > 0 && (
                  <div className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                    {p.antardashas.map((a) => {
                      const live = d.currentAntar?.lord === a.lord;
                      return (
                        <div key={a.lord} className={`flex justify-between border-b border-line/60 py-0.5 text-[11px] ${live ? 'text-copper font-semibold' : 'text-ink-soft'}`}>
                          <span>{a.lord}</span>
                          <span className="font-mono">{fmtDate(a.start)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-[11px] leading-relaxed text-ink-muted">
        Vimśottarī, computed from the Moon at {moon.sidereal.toFixed(2)}° sidereal — the same longitude the AA System
        uses for its station. The nine lords total {DASHA_TOTAL} years; the first period is part-elapsed at birth,
        which is why it is marked as a balance.
      </p>
    </div>
  );
}
