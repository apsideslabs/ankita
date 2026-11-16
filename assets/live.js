/* The live strip: today's number, the running daśā, the Moon's nakṣatra and the
   sun's times — all computed here, so the chrome proves the engine works. */
import { allPlacements, julianDay } from './engine/ephemeris.js';
import { vimshottari } from './engine/dasha.js';

const NAK = ['Aśvinī','Bharaṇī','Kṛttikā','Rohiṇī','Mṛgaśīrṣa','Ārdrā','Punarvasu','Puṣya','Āśleṣā','Maghā','Pūrva Phālgunī','Uttara Phālgunī','Hasta','Citrā','Svātī','Viśākhā','Anurādhā','Jyeṣṭhā','Mūla','Pūrvāṣāḍhā','Uttarāṣāḍhā','Śravaṇa','Dhaniṣṭhā','Śatabhiṣā','Pūrva Bhādrapadā','Uttara Bhādrapadā','Revatī'];
const TITHI = ['Pratipadā','Dvitīyā','Tṛtīyā','Caturthī','Pañcamī','Ṣaṣṭhī','Saptamī','Aṣṭamī','Navamī','Daśamī','Ekādaśī','Dvādaśī','Trayodaśī','Caturdaśī','Pūrṇimā/Amāvasyā'];

function reduce9(n) { let v = Math.abs(n); while (v > 9) v = String(v).split('').reduce((a, c) => a + Number(c), 0); return v; }

function sunTimes(lat, lon, date) {
  const rad = Math.PI / 180;
  const jd = julianDay(date);
  const n = Math.round(jd - 2451545.0 + 0.0008);
  const Jstar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * Jstar) % 360;
  const C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const Jtransit = 2451545.0 + Jstar + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * lambda * rad);
  const decl = Math.asin(Math.sin(lambda * rad) * Math.sin(23.44 * rad));
  const cosH = (Math.sin(-0.83 * rad) - Math.sin(lat * rad) * Math.sin(decl)) / (Math.cos(lat * rad) * Math.cos(decl));
  if (cosH < -1 || cosH > 1) return null;
  const H = Math.acos(cosH) / rad / 360;
  const fmt = (j) => {
    const d = new Date((j - 2440587.5) * 86400000);
    return d.toISOString().slice(11, 16);
  };
  return { rise: fmt(Jtransit - H), set: fmt(Jtransit + H) };
}

function build() {
  const now = new Date();
  const jd = julianDay(now);
  const p = allPlacements(jd);
  const moon = p.find((g) => g.key === 'Moon');
  const sun = p.find((g) => g.key === 'Sun');
  const tithiIdx = Math.floor((((moon.longitude - sun.longitude + 360) % 360) / 12)) % 15;
  const universal = reduce9(now.getDate() + (now.getMonth() + 1) + String(now.getFullYear()).split('').reduce((a, c) => a + Number(c), 0));
  const t = sunTimes(26.1445, 91.7362, now);

  let dasa = '—';
  try {
    const saved = JSON.parse(localStorage.getItem('ankita.readings') || '[]')[0];
    if (saved) {
      const [y, m, d] = saved.date.split('-').map(Number);
      const birthJd = julianDay(new Date(Date.UTC(y, m - 1, d, 12)));
      const bm = allPlacements(birthJd).find((g) => g.key === 'Moon');
      const c = vimshottari(bm.longitude, new Date(Date.UTC(y, m - 1, d, 12)));
      if (c.current) dasa = `${c.current.lord} · ${c.currentAntar ? c.currentAntar.lord : ''}`;
    }
  } catch (e) { /* ignore */ }

  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
  const html = `
    <span class="item">${dateStr}</span><span class="sep"></span>
    <span class="item">Tithi <b>${TITHI[tithiIdx] || '—'}</b></span><span class="sep"></span>
    <span class="item">Nakṣatra <b>${NAK[moon.nakshatra - 1]}</b></span><span class="sep"></span>
    <span class="item">Today's number <b>${universal}</b></span><span class="sep"></span>
    <span class="item">Daśā <b>${dasa}</b></span>
    ${t ? `<span class="end">Sunrise ${t.rise} · Sunset ${t.set} · Guwahati</span>` : ''}
  `;
  const bar = document.getElementById('strip') || document.querySelector('.livebar .inner');
  if (bar) bar.innerHTML = html;

  // the today strip on the home page
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('t-tithi', TITHI[tithiIdx] || '—');
  set('t-nak', NAK[moon.nakshatra - 1] || '—');
  if (t) { set('t-rise', t.rise); }
  const rahuParts = { 0: '16:30–18:00', 1: '07:30–09:00', 2: '15:00–16:30', 3: '12:00–13:30', 4: '13:30–15:00', 5: '10:30–12:00', 6: '09:00–10:30' };
  set('t-rahu', rahuParts[now.getDay()] || '—');
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
else build();
