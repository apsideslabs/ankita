'use client';

import { useState } from 'react';
import { ArrowRight, Hash, Type, Star } from 'lucide-react';
import { decodeBhuta, encodeBhuta, decodeKatapayadi, NAKSHATRA_PADAS, padaForLongitude, NAKSHATRA_SPAN } from '@/lib/engine/sanskrit';

export function ToolsView() {
  const [bhuta, setBhuta] = useState('ākāśa-vasudhā-nabhas-kara');
  const [kata, setKata] = useState('naṭanara');
  const [moon, setMoon] = useState('0');

  const bhutaResult = decodeBhuta(bhuta);
  const kataResult = decodeKatapayadi(kata);
  const moonLong = Number(moon);
  const pada = Number.isFinite(moonLong) ? padaForLongitude(moonLong) : null;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-3xl">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-copper">Tools</p>
        <h1 className="mt-2 text-4xl font-serif font-bold text-ink">Classical number decoders</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          Three tools for reading numbers the way Sanskrit texts wrote them — and one lookup for the
          naming syllable. All three read from the units place upward, under the rule
          <span className="font-serif italic"> aṅkānāṃ vāmato gatiḥ</span>.
        </p>
      </div>

      <div className="mt-9 grid gap-5 lg:grid-cols-2">
        {/* Bhūtasaṅkhyā */}
        <section className="rounded-xl border border-line bg-surface p-6 shadow-3d-card">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-copper" />
            <h2 className="font-serif text-lg font-bold text-ink">Bhūtasaṅkhyā</h2>
          </div>
          <p className="mt-2 text-sm text-ink-soft">Word-numerals. Hyphenate the words; the value is read units-first.</p>
          <input
            value={bhuta}
            onChange={(e) => setBhuta(e.target.value)}
            className="mt-4 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-copper/50"
          />
          <div className="mt-4 rounded-lg border border-line bg-canvas/60 p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {bhutaResult.steps.map((s, i) => (
                <span key={i} className={`px-2 py-1 rounded border text-[11px] font-mono ${s.digit === null ? 'border-copper/40 bg-copper-wash text-copper' : 'border-line bg-white text-ink-soft'}`}>
                  {s.word} <span className="text-copper">{s.digit ?? '?'}</span>
                </span>
              ))}
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-ink tabular-nums">
              {bhutaResult.value === null ? '—' : bhutaResult.value}
            </p>
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            Try <button onClick={() => setBhuta('sapta-randhra-guṇa-indavaḥ')} className="underline decoration-line-strong hover:text-copper">sapta-randhra-guṇa-indavaḥ</button> — the obliquity constant in Sūrya Siddhānta II.28.
          </p>
        </section>

        {/* Kaṭapayādi */}
        <section className="rounded-xl border border-line bg-surface p-6 shadow-3d-card">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-copper" />
            <h2 className="font-serif text-lg font-bold text-ink">Kaṭapayādi</h2>
          </div>
          <p className="mt-2 text-sm text-ink-soft">Consonant code of Kerala. Each consonant carries a digit; read right to left.</p>
          <input
            value={kata}
            onChange={(e) => setKata(e.target.value)}
            className="mt-4 w-full px-3 py-2.5 rounded-lg border border-line bg-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-copper/50"
          />
          <div className="mt-4 rounded-lg border border-line bg-canvas/60 p-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {kataResult.steps.map((s, i) => (
                <span key={i} className="px-2 py-1 rounded border border-line bg-white text-[11px] font-mono text-ink-soft">
                  {s.word} <span className="text-copper">{s.digit}</span>
                </span>
              ))}
            </div>
            <p className="mt-3 font-serif text-3xl font-bold text-ink tabular-nums">
              {kataResult.value === null ? '—' : kataResult.value}
            </p>
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            <button onClick={() => setKata('ayurārogyasaukhya')} className="underline decoration-line-strong hover:text-copper">āyur-ārogya-saukhya</button> is the chronogram that closes the Nārāyaṇīya.
          </p>
        </section>

        {/* Nāmākṣara */}
        <section className="rounded-xl border border-line bg-surface p-6 shadow-3d-card lg:col-span-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-copper" />
            <h2 className="font-serif text-lg font-bold text-ink">Nāmākṣara — the naming syllable</h2>
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            The classical rule is a lookup, not a sum: the Moon&rsquo;s nakṣatra and pada select a sound.
            Enter a sidereal longitude (0–360°) to see which.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="number" min={0} max={360} step="0.01" value={moon}
              onChange={(e) => setMoon(e.target.value)}
              className="w-40 px-3 py-2.5 rounded-lg border border-line bg-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-copper/50"
            />
            <button onClick={() => setMoon('0')} className="text-[11px] font-mono uppercase tracking-wider text-ink-soft hover:text-copper">Aśvinī 1</button>
            <button onClick={() => setMoon(String(NAKSHATRA_SPAN * 13))} className="text-[11px] font-mono uppercase tracking-wider text-ink-soft hover:text-copper">Citrā</button>
          </div>
          {pada && (
            <div className="mt-5 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="rounded-xl border border-copper/30 bg-copper-wash px-8 py-6 text-center">
                <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-copper/70">Syllable</p>
                <p className="mt-1 font-serif text-4xl font-bold text-copper">{pada.syllable}</p>
              </div>
              <div className="text-sm text-ink-soft">
                <p><span className="text-ink font-medium">Nakṣatra:</span> {pada.name} ({pada.index + 1} of 27)</p>
                <p className="mt-1"><span className="text-ink font-medium">Pada:</span> {pada.pada} of 4</p>
                <p className="mt-3 text-xs">
                  Regional tables differ for two or three nakṣatras — Śravaṇa and its neighbours among them.
                  Where a family has an almanac, that almanac takes precedence.
                </p>
              </div>
            </div>
          )}
          <details className="mt-6">
            <summary className="cursor-pointer text-[11px] font-mono uppercase tracking-wider text-copper">All 108 syllables</summary>
            <div className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              {NAKSHATRA_PADAS.map((n) => (
                <div key={n.name} className="flex items-baseline justify-between gap-2 py-0.5 border-b border-line/60">
                  <span className="text-ink-soft">{n.name}{n.variant && <span className="text-copper">*</span>}</span>
                  <span className="font-mono text-xs text-ink">{n.padas.join(' · ')}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-muted">* marked rows vary between regional tables.</p>
          </details>
        </section>
      </div>

      <div className="mt-8 rounded-xl border border-line bg-surface p-5 flex items-start gap-3">
        <ArrowRight className="w-4 h-4 text-copper mt-0.5" />
        <p className="text-sm text-ink-soft">
          None of these tools predicts anything. They read what a text wrote — which is the only thing a
          number-system can honestly claim to do.
        </p>
      </div>
    </div>
  );
}
