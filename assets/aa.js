import { coreSelf, nameNumbers, station, apsTimeline, personalLunarYear, personalLunarMonth, personalLunarDay, moonSidereal, REALMS } from './engine/aa/index.js';
import { buildAChart } from './engine/aa/charts.js';
import { buildMacro } from './engine/aa/macro.js';
import { computeBindings, byDomain } from './engine/aa/bindings.js';
import { SPHIRAS } from './engine/aa/sphiras.js';
import { CITIES, findCity, parseTime } from './engine/aa/inputs.js';

const place = document.getElementById('aa-place');
place.innerHTML = CITIES.map((c) => `<option>${c.name}, ${c.state}</option>`).join('');
place.value = 'Guwahati, Assam';

const form = document.getElementById('aa-form');
const out = document.getElementById('aa-out');
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

function render() {
  const name = document.getElementById('aa-name').value.trim();
  const date = document.getElementById('aa-date').value;
  const time = document.getElementById('aa-time').value;
  if (!name || !date) { out.innerHTML = ''; return; }

  const [y, m, d] = date.split('-').map(Number);
  const t = parseTime(time || '12:00', 330);
  const cityName = place.value.split(',')[0];
  const city = findCity(cityName) || CITIES[0];

  const cs = coreSelf(d, m, y);
  const nm = nameNumbers(name);
  const moon = moonSidereal(date, t.hh - 5.5);
  const st = station(moon.sidereal);
  const aps = apsTimeline(st);
  const now = new Date();
  const ply = personalLunarYear(d, m, y, now.getFullYear());
  const plm = personalLunarMonth(ply, now.getMonth() + 1);
  const pld = personalLunarDay(plm, now.getDate());

  const input = { name, date, hour: t.hh, minute: t.mm, lat: city.lat, lon: city.lon };
  const chart = buildAChart(input);
  const macro = buildMacro(input);
  const bindings = computeBindings(input);
  const domains = byDomain(bindings);

  out.innerHTML = `
    <div class="grid-2" style="align-items:start">
      <div>
        <p class="panel-title">Core Self</p>
        <div class="numeral" style="font-size:5rem;color:var(--copper)">${cs.core}</div>
        <p class="small">${esc(REALMS[cs.core - 1] || 'centre')} · ${cs.dayValue} + ${cs.monthValue} + ${cs.yearValue} = ${cs.compound} → ${cs.core}</p>
        <p class="panel-title mt-6">Name · Axiomatic Letter Code</p>
        <p class="small">DPN ${nm.dpn} · SWN ${nm.swn} · PMN ${nm.pmn} (total ${nm.total})</p>
      </div>
      <div>
        <p class="panel-title">Station · 91-year cycle</p>
        <p class="small">${st.number} · ${esc(st.name)} · pada ${st.pada} — Moon at ${moon.sidereal.toFixed(2)}° sidereal (${esc(city.name)})</p>
        <p class="small mt-2">APS: ${aps.current.force} — ${aps.remaining.toFixed(1)} years remaining</p>
        <p class="panel-title mt-6">Personal lunar cycle</p>
        <p class="small">PLY ${ply} · PLM ${plm} · PLD ${pld}</p>
      </div>
    </div>

    <p class="panel-title mt-8">The A-Chart · thirteen laws</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(7rem,1fr));gap:.4rem;margin-top:.6rem">
      ${chart.values.map((v) => `<div class="cell"><div style="display:flex;justify-content:space-between;align-items:baseline">
        <span class="p">${v.law}</span><span class="v">${v.value}</span></div>
        <div class="n">${esc(SPHIRAS[v.sphira - 1].name)}</div><div class="p">${esc(SPHIRAS[v.sphira - 1].planet)}</div></div>`).join('')}
    </div>

    <p class="panel-title mt-8">The 15 macro-charts</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:.5rem;margin-top:.6rem">
      ${macro.charts.map((c) => `<div class="cell">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="p">${c.id}</span><span class="v">${c.value}</span></div>
        <div class="n" style="font-family:var(--serif);font-weight:600">${esc(c.name)}</div>
        <div class="p" style="text-transform:none;letter-spacing:0;font-size:9px">${esc(c.formula)}</div>
        <div class="small" style="font-size:10px">${esc(c.reading)}</div></div>`).join('')}
    </div>
    <p class="small mt-2">Vitality ${macro.health.cvs} · acute risk ${macro.health.arf ? 'yes' : 'no'} · chronic residue ${macro.health.cri} · macro-year ${macro.macroYear} · micro-month ${macro.microMonth}</p>

    <p class="panel-title mt-8">The 117 bindings, computed</p>
    ${domains.map((g, i) => `<details ${i === 0 ? 'open' : ''} style="border-bottom:1px solid var(--line);padding:.6rem 0">
      <summary style="cursor:pointer;font-family:var(--serif);font-weight:600">${esc(g.domain)}
        <span class="mono small">F${g.rows[0].id}–F${g.rows[g.rows.length - 1].id} · ${g.rows.length}</span></summary>
      <table style="margin-top:.5rem"><thead><tr><th>F</th><th>Binding</th><th>Arithmetic</th><th style="text-align:right">Value</th><th>Reading</th></tr></thead>
      <tbody>${g.rows.map((b) => `<tr><td class="mono small">${b.id}</td><td>${esc(b.name)}<div class="mono small">${esc(b.inputs)}</div></td>
        <td class="mono small">${esc(b.expression)}</td><td style="text-align:right;font-family:var(--serif);font-size:1.2rem;color:var(--copper)">${b.value}</td>
        <td class="small"><b class="mono">${esc(b.sphira)}</b><br>${esc(b.reading)}</td></tr>`).join('')}</tbody></table>
    </details>`).join('')}
  `;
}

form.addEventListener('submit', (e) => { e.preventDefault(); render(); });
render();
