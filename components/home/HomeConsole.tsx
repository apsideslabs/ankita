'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarDays, User, Sparkles, AlertCircle } from 'lucide-react';
import { buildProfile } from '@/lib/engine/profile';
import { GRID } from '@/lib/engine/loshu';
import type { BirthInput, Profile } from '@/lib/engine/types';

const today = new Date().toISOString().slice(0, 10);

export function HomeConsole() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [gender, setGender] = useState<BirthInput['gender']>('unspecified');
  const [submitted, setSubmitted] = useState<BirthInput | null>(null);

  const result = useMemo(() => {
    if (!submitted) return null;
    return buildProfile(submitted);
  }, [submitted]);

  const profile = result && !('error' in result) ? (result as Profile) : null;
  const error = result && 'error' in result ? result.error : null;

  return (
    <div id="console" className="w-full">
      <div className="border-y border-line-strong bg-transparent">
        <div className="px-5 sm:px-7 py-4 border-b border-line flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-copper ring-4 ring-copper/15" />
            <h2 className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink font-semibold">
              Reading console
            </h2>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
            computes locally
          </span>
        </div>

        <form
          className="p-5 sm:p-7 grid gap-4 sm:grid-cols-[1.3fr_1fr_0.8fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted({ name, date, gender, masterNumbers: false });
          }}
        >
          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Full name</span>
            <div className="mt-1.5 relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="As the family uses it"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line bg-white text-sm text-ink placeholder:text-ink-muted/70 focus:outline-none focus:ring-1 focus:ring-copper/50"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Date of birth</span>
            <div className="mt-1.5 relative">
              <CalendarDays className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-line bg-white text-sm text-ink focus:outline-none focus:ring-1 focus:ring-copper/50"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">Kua</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as BirthInput['gender'])}
              className="mt-1.5 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm text-ink focus:outline-none focus:ring-1 focus:ring-copper/50"
            >
              <option value="unspecified">Skip</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark transition-colors btn-press"
          >
            Read
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {error && (
          <div className="px-5 sm:px-7 pb-6 -mt-1 flex items-center gap-2 text-sm text-copper">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        {profile && (
          <div className="border-t border-line bg-canvas/40 animate-rise">
            <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line">
              {[
                { label: 'Mūlāṅka', value: profile.mulank.value, sub: profile.planets[0].graha, note: 'from the day of birth' },
                { label: 'Bhāgyāṅka', value: profile.bhagyank.value, sub: profile.planets[1].graha, note: 'from the whole date' },
                { label: 'Nāmāṅka', value: profile.namank.value, sub: profile.planets[2].graha, note: `compound ${profile.compound}` },
              ].map((s) => (
                <div key={s.label} className="p-5 sm:p-6">
                  <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">{s.label}</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-serif text-4xl font-bold text-ink tabular-nums">{s.value}</span>
                    <span className="text-xs font-mono uppercase tracking-wider text-copper">{s.sub}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">{s.note}</p>
                </div>
              ))}
            </div>

            <div className="px-5 sm:px-7 py-5 border-t border-line flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="grid grid-cols-3 gap-[3px] w-[66px]">
                  {GRID.flat().map((d) => {
                    const cell = profile.grid.find((c) => c.digit === d);
                    const on = (cell?.count ?? 0) > 0;
                    return (
                      <span
                        key={d}
                        className={`aspect-square rounded-[3px] text-[10px] font-mono flex items-center justify-center border ${
                          on ? 'bg-copper text-surface border-copper' : 'bg-white/60 text-ink-muted border-line'
                        }`}
                      >
                        {d}
                      </span>
                    );
                  })}
                </div>
                <div className="text-xs text-ink-soft">
                  <p className="font-medium text-ink">Lo Shu · {profile.grid.filter((c) => c.count > 0).length} of 9 present</p>
                  <p className="mt-0.5">{profile.missing.length ? `Missing ${profile.missing.join(', ')}` : 'No missing digits'}</p>
                </div>
              </div>
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-copper hover:text-copper-dark"
              >
                Full workspace
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="px-5 sm:px-7 py-3 border-t border-line flex flex-wrap items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-ink-muted" />
              {['Chaldean 1926', 'Graha-numerology 1990', 'Lo Shu (Chinese)', 'Sanskrit codes'].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded border border-line bg-white/60 text-[10px] font-mono uppercase tracking-wider text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="mt-3 text-xs text-ink-muted">
        Nothing leaves the browser. Every figure is reproducible from the rules in <Link href="/method" className="underline decoration-line-strong underline-offset-2 hover:text-copper">Method</Link>.
      </p>
    </div>
  );
}
