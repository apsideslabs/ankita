import { compatibility, nameOptions, yearAhead, chartWithLagna } from './engine/extras.js';
import { CITIES, findCity, parseTime } from './engine/aa/inputs.js';
import { findYogas } from './engine/yogas.js';

const NCOLOUR = {1:'var(--n1)',2:'var(--n2)',3:'var(--n3)',4:'var(--n4)',5:'var(--n5)',6:'var(--n6)',7:'var(--n7)',8:'var(--n8)',9:'var(--n9)'};
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const col = (n) => NCOLOUR[((n - 1) % 9) + 1];

/* 01 compatibility */
document.getElementById('m-go').addEventListener('click', () => {
  const a = { name: document.getElementById('m-name1').value, date: document.getElementById('m-date1').value };
  const b = { name: document.getElementById('m-name2').value, date: document.getElementById('m-date2').value };
  const m = compatibility(a, b);
  document.getElementById('m-out').innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap">
        <div class="numeral" style="font-size:clamp(4rem,9vw,7rem);color:${col(m.rows[0].a)}">${m.score}<span style="font-size:.35em">%</span></div>
        <div><div class="panel-title">Verdict</div><div style="font-family:var(--serif);font-size:1.6rem;font-weight:600">${esc(m.verdict)}</div>
        <p class="small">Mulanka, bhagyanka and namanka read against each other through the natural-friendship table.</p></div>
      </div>
      <table class="mt-6"><thead><tr><th>Pair</th><th>First</th><th>Second</th><th>Relation</th><th>Points</th></tr></thead>
      <tbody>${m.rows.map((r) => `<tr><td>${r.label}</td>
        <td style="font-family:var(--serif);font-size:1.3rem;color:${col(r.a)}">${r.a}</td>
        <td style="font-family:var(--serif);font-size:1.3rem;color:${col(r.b)}">${r.b}</td>
        <td style="color:${r.relation==='friend'?'#15803d':r.relation==='enemy'?'var(--copper)':'var(--ink-muted)'}">${r.relation}</td>
        <td class="mono">${r.points}/2</td></tr>`).join('')}</tbody></table>
    </div>`;
});

/* 02 lagna */
const place = document.getElementById('l-place');
place.innerHTML = CITIES.map((c) => `<option>${c.name}, ${c.state}</option>`).join('');
place.value = 'Guwahati, Assam';

document.getElementById('l-go').addEventListener('click', () => {
  const date = document.getElementById('l-date').value;
  const t = parseTime(document.getElementById('l-time').value, 330);
  const city = findCity(place.value.split(',')[0]) || CITIES[0];
  const hourUTC = t.hh + t.mm / 60 - 5.5;
  const { asc, grahas } = chartWithLagna(date, hourUTC, city.lat, city.lon);
  const yogas = findYogas(asc.sign, grahas);
  document.getElementById('l-out').innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:2rem;flex-wrap:wrap">
        <div class="numeral" style="font-size:clamp(3.4rem,7vw,5.6rem);color:${col(asc.sign)}">${asc.sign}</div>
        <div><div class="panel-title">Lagna</div>
          <div style="font-family:var(--serif);font-size:1.6rem;font-weight:600">${esc(asc.signName)}</div>
          <p class="small">${asc.sidereal.toFixed(2)}° sidereal · ${esc(city.name)} ${city.lat.toFixed(2)}°, ${city.lon.toFixed(2)}° · ${document.getElementById('l-time').value} IST</p></div>
      </div>
      <table class="mt-6"><thead><tr><th>Graha</th><th>Rāśi</th><th>House from lagna</th><th>Degree</th></tr></thead>
      <tbody>${grahas.map((g) => `<tr><td>${g.name}</td><td>${g.signName}</td>
        <td class="mono" style="color:${col(g.house)}">${g.house}</td><td class="mono">${g.degreeInSign.toFixed(2)}°</td></tr>`).join('')}</tbody></table>
      ${yogas.length ? `<p class="panel-title mt-8" style="font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-muted)">Yogas found</p>
      <div style="display:grid;gap:.6rem;margin-top:.6rem">
        ${yogas.map((y) => `<div class="rcard">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem">
            <div style="font-family:var(--serif);font-size:1.2rem;font-weight:600">${esc(y.name)} <span style="font-family:var(--serif);color:var(--copper);font-size:1rem">${esc(y.sanskrit)}</span></div>
            <span class="mono" style="font-size:9px;text-transform:uppercase;letter-spacing:.14em;color:#15803d">${y.strength}</span>
          </div>
          <p class="small" style="margin:.3rem 0 0"><b>Rule:</b> ${esc(y.rule)}</p>
          <p class="small" style="margin:.2rem 0 0">${esc(y.result)}</p></div>`).join('')}
      </div>` : `<p class="small mt-6">No named yoga fires in this chart. Most charts have none.</p>`}
      <p class="small mt-4">Whole-sign houses from the ascendant. The ascendant moves about one degree every four minutes, so the birth time matters here as it does not for the planets.</p>
    </div>`;
});

/* 03 name correction */
document.getElementById('n-go').addEventListener('click', () => {
  const name = document.getElementById('n-name').value;
  const date = document.getElementById('n-date').value;
  const [y, m, d] = date.split('-').map(Number);
  const birth = ((d - 1) % 9) + 1;
  const opts = nameOptions(name, birth);
  document.getElementById('n-out').innerHTML = opts.length ? `
    <div class="card">
      <p class="small">The mūlāṅka is <b>${birth}</b>. These spellings keep the sound and land the nāmāṅka on a friendly digit.</p>
      <table class="mt-4"><thead><tr><th>Spelling</th><th>Nāmāṅka</th><th>Relation</th></tr></thead>
      <tbody>${opts.map((o) => `<tr><td style="font-family:var(--serif);font-size:1.1rem">${esc(o.spelling)}</td>
        <td style="font-family:var(--serif);font-size:1.3rem;color:${col(o.value)}">${o.value}</td>
        <td style="color:#15803d">${o.relation}</td></tr>`).join('')}</tbody></table>
      <p class="small mt-4">Compare, never a reason to change a name. The compound number matters as much as the root.</p>
    </div>` : `<div class="card"><p class="small">No spelling in this set lands on a friendly digit — try a fuller form of the name.</p></div>`;
});

/* 04 year ahead */
document.getElementById('y-go').addEventListener('click', () => {
  const date = document.getElementById('y-date').value;
  const year = Number(document.getElementById('y-year').value);
  const y = yearAhead(date, year);
  document.getElementById('y-out').innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:baseline;gap:1rem">
        <div class="numeral" style="font-size:clamp(3rem,6vw,4.6rem);color:${col(y.ply)}">${y.ply}</div>
        <p class="small">personal year for ${year}</p>
      </div>
      <div class="nine mt-6">${y.months.map((mo) => `<div>
        <div class="g">${mo.month.slice(0,3)}</div>
        <div class="n" style="color:${col(mo.value)}">${mo.value}</div></div>`).join('')}</div>
      <table class="mt-6"><tbody>${y.months.map((mo) => `<tr><td style="width:8rem">${mo.month}</td>
        <td style="width:3rem;font-family:var(--serif);font-size:1.2rem;color:${col(mo.value)}">${mo.value}</td>
        <td class="small">${esc(mo.note)}</td></tr>`).join('')}</tbody></table>
    </div>`;
});

/* run the ascendant once on load so the page is never empty */
document.getElementById('l-go').click();
