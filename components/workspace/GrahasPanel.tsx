'use client';

import { useMemo } from 'react';
import { allPlacements, julianDay, ayanamsa, houseFrom, RASHIS } from '@/lib/engine/ephemeris';
import { NAKSHATRAS } from '@/lib/engine/dasha';

const HOUSE_MEANING: Record<number, string> = {
  1: 'body, self, health', 2: 'money, speech, family', 3: 'effort, siblings, courage',
  4: 'home, mother, mind', 5: 'children, study, creativity', 6: 'work, debt, illness',
  7: 'partnership, marriage', 8: 'crisis, inheritance, change', 9: 'fortune, teacher, travel',
  10: 'career, status', 11: 'gain, network, elder sibling', 12: 'loss, foreign, release',
};

export function GrahasPanel({ date }: { date: string }) {
  const { natal, transit, moonSign } = useMemo(() => {
    const [y, m, d] = date.split('-').map(Number);
    const natalJd = julianDay(new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12)));
    const nowJd = julianDay(new Date());
    const natal = allPlacements(natalJd);
    const transit = allPlacements(nowJd);
    const moon = natal.find((p) => p.key === 'Moon');
    return { natal, transit, moonSign: moon?.sign ?? 1 };
  }, [date]);

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="kicker"><span className="n">i</span><span>Natal positions · 12:00 UT</span></p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
            ayanāṃśa {ayanamsa(julianDay(new Date(date))).toFixed(2)}°
          </p>
        </div>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-line-strong text-left">
              {['Graha', 'Rāśi', 'Degree', 'Nakṣatra', 'Pada', ''].map((h) => (
                <th key={h} className="py-2 pr-4 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {natal.map((p) => (
              <tr key={p.key}>
                <td className="py-2.5 pr-4">
                  <span className="font-serif text-base font-semibold text-ink">{p.name}</span>
                  <span className="ml-2 font-mono text-[10px] text-ink-muted">{p.abbr}</span>
                </td>
                <td className="py-2.5 pr-4 text-ink">{p.signName}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-ink-soft tabular-nums">{p.degreeInSign.toFixed(2)}°</td>
                <td className="py-2.5 pr-4 text-ink-soft">{NAKSHATRAS[p.nakshatra - 1]}</td>
                <td className="py-2.5 pr-4 font-mono text-xs text-ink-soft">{p.pada}</td>
                <td className="py-2.5 font-mono text-[10px] text-copper">{p.retrograde ? 'R' : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-[11px] text-ink-muted">
          Computed from truncated orbital elements — about 0.1° for the Sun, 0.3° for the Moon, 1° for the planets.
          A sign or nakṣatra is reliable; a pada within a degree of its boundary should be checked against an ephemeris.
          The birth time is taken as 12:00 UT, which moves the Moon by up to 6° and the ascendant not at all.
        </p>
      </div>

      <div>
        <p className="kicker"><span className="n">ii</span><span>Gochara · where the grahas sit today, from your Moon</span></p>
        <table className="mt-3 w-full text-sm">
          <thead>
            <tr className="border-b border-line-strong text-left">
              {['Graha', 'Today', 'House from Moon', 'Reads as'].map((h) => (
                <th key={h} className="py-2 pr-4 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {transit.map((t) => {
              const h = houseFrom(moonSign, t.sign);
              const natalP = natal.find((n) => n.key === t.key);
              const same = natalP?.sign === t.sign;
              return (
                <tr key={t.key}>
                  <td className="py-2.5 pr-4 font-serif text-base text-ink">{t.name}</td>
                  <td className="py-2.5 pr-4 text-ink-soft">
                    {t.signName}
                    {same && <span className="ml-2 font-mono text-[9px] uppercase tracking-wider text-copper">return</span>}
                  </td>
                  <td className="py-2.5 pr-4 font-mono text-xs text-ink-soft tabular-nums">{h}</td>
                  <td className="py-2.5 text-ink-soft text-xs">{HOUSE_MEANING[h]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="mt-3 text-[11px] text-ink-muted">
          Gochara counts houses from the natal Moon, as the classical transit rules do. It is a placement table,
          not a forecast: the platform does not print events.
        </p>
      </div>

      <div className="border-t border-line pt-4">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">Rāśi sequence</p>
        <p className="mt-1 text-sm text-ink-soft">{RASHIS.join(' · ')}</p>
      </div>
    </div>
  );
}
