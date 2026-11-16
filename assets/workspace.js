import { buildProfile } from './engine/profile.js';
import { vimshottari, fmtDate, ageAt, NAKSHATRAS } from './engine/dasha.js';
import { allPlacements, julianDay, houseFrom } from './engine/ephemeris.js';
import { READINGS } from './engine/interpretation.js';
import { relation } from './engine/planets.js';

const form = document.getElementById('ws-form');
const panel = document.getElementById('panel');
const tabs = [...document.querySelectorAll('.tab')];
let tab = 'chart';
let profile = null;

const NCOLOUR = {1:'var(--n1)',2:'var(--n2)',3:'var(--n3)',4:'var(--n4)',5:'var(--n5)',6:'var(--n6)',7:'var(--n7)',8:'var(--n8)',9:'var(--n9)'};
const GRAHA = {1:'Sun',2:'Moon',3:'Jupiter',4:'Rāhu',5:'Mercury',6:'Venus',7:'Ketu',8:'Saturn',9:'Mars'};
const HOUSE = {1:'body, self',2:'money, speech',3:'effort, siblings',4:'home, mind',5:'children, study',6:'work, debt',7:'partnership',8:'crisis, change',9:'fortune, teacher',10:'career, status',11:'gain, network',12:'loss, foreign'};
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const col = (n) => NCOLOUR[((n - 1) % 9) + 1];

function compute() {
  const name = document.getElementById('ws-name').value.trim();
  const date = document.getElementById('ws-date').value;
  const gender = document.getElementById('ws-gender').value;
  if (!name || !date) return null;
  return buildProfile({ name, date, gender, masterNumbers: false });
}

function chartPanel(p) {
  const cells = [
    ['Mūlāṅka', 'psychic · from the day', p.mulank],
    ['Bhāgyāṅka', 'destiny · whole date', p.bhagyank],
    ['Nāmāṅka', 'name · Chaldean', p.namank],
  ].map(([label, sub, f]) => {
    const n = ((f.value - 1) % 9) + 1;
    return `<div>
      <div class="k"><span>${label}</span><span style="color:${col(n)}">${GRAHA[n]}</span></div>
      <div class="v" style="color:${col(n)}">${f.value}</div>
      <div class="n">${sub}${f.compound && f.compound !== f.value ? ' · compound ' + f.compound : ''}</div>
    </div>`;
  }).join('');

  const pairs = [[p.mulank.value, p.bhagyank.value], [p.bhagyank.value, p.namank.value], [p.mulank.value, p.namank.value]];
  const rows = pairs.map(([a, b]) => {
    const r = relation(a, b);
    const c = r === 'friend' ? '#15803d' : r === 'enemy' ? 'var(--accent)' : 'var(--muted)';
    return `<tr><td class="mono">${a} · ${b}</td><td style="color:${c};font-weight:600">${r}</td></tr>`;
  }).join('');

  return `<div class="panel"><div class="panel-head">The three numbers<span class="mini-grade">${esc(p.input.name)}</span></div>
    <div class="panel-body"><div class="num-hero">${cells}</div></div></div>

    <div class="panels" style="margin-top:1rem">
      <div class="panel"><div class="panel-head">Friendships between the three</div>
        <div class="panel-body"><div class="twrap"><table><tbody>${rows}</tbody></table></div>
        <p class="lead-p" style="margin-top:.6rem">Natural friendship, from the planetary scheme the literature uses.</p></div></div>
      <div class="panel"><div class="panel-head">Kua${p.kua ? `<span class="mini-grade">${esc(p.kua.group)} group</span>` : ''}</div>
        <div class="panel-body">${p.kua
          ? `<div style="display:flex;align-items:baseline;gap:1rem"><div style="font:800 3.2rem/.85 var(--sans);letter-spacing:-.05em">${p.kua.value}</div>
             <p class="lead-p" style="margin:0">${esc(p.kua.note)}</p></div>
             <p class="lead-p" style="margin-top:.6rem"><b>Favourable</b> ${p.kua.directions.good.join(' · ')}<br><b>Avoid</b> ${p.kua.directions.bad.join(' · ')}</p>`
          : `<p class="lead-p">Select a gender to compute the Kua number — a Chinese calculation that needs the birth century.</p>`}</div></div>
    </div>`;
}

function gridPanel(p) {
  const order = [4,9,2,3,5,7,8,1,6];
  const count = (d) => (p.grid.find((c) => c.digit === d) || {}).count || 0;
  const cells = order.map((d) => { const c = count(d);
    return `<div class="c ${c ? '' : 'off'}"><span class="d" style="color:${c ? col(d) : ''}">${c ? d : '·'}</span>
      <span class="x">${c ? '×' + c : 'missing'}</span></div>`; }).join('');
  const miss = p.reading.missing.map((m) => `<li><b style="color:${col(m.n)}">${m.n}</b> — ${esc(m.text)}</li>`).join('') || '<li>None missing.</li>';
  const rep = p.reading.repeated.map((m) => `<li><b style="color:${col(m.n)}">${m.n}</b> — ${esc(m.text)}</li>`).join('') || '<li>No digit three times or more.</li>';
  return `<div class="panels">
    <div class="panel"><div class="panel-head">Lo Shu square<span class="mini-grade">placement</span></div>
      <div class="panel-body"><div class="loshu">${cells}</div>
      <p class="lead-p" style="margin-top:.7rem">Every non-zero digit of the date, plus the bhāgyāṅka, plus the mūlāṅka when the birth day is ten or more.</p></div></div>
    <div class="panel"><div class="panel-head">Missing and amplified</div>
      <div class="panel-body"><p class="label">Missing</p><ul class="lead-p" style="margin:.4rem 0 1rem;padding-left:1.1rem">${miss}</ul>
      <p class="label">Amplified</p><ul class="lead-p" style="margin:.4rem 0 0;padding-left:1.1rem">${rep}</ul></div></div>
  </div>`;
}

function timingPanel(p) {
  const [y, m, d] = p.input.date.split('-').map(Number);
  const moon = allPlacements(julianDay(new Date(Date.UTC(y, m - 1, d, 12)))).find((g) => g.key === 'Moon');
  const c = vimshottari(moon.longitude, new Date(Date.UTC(y, m - 1, d, 12)));
  const now = new Date();
  const total = c.periods.reduce((a, q) => a + q.years, 0);
  const bar = `<div class="dbar">${c.periods.map((q) => {
    const live = c.current && c.current.lord === q.lord;
    return `<div class="s ${live ? 'now' : ''}" style="flex:${q.years};background:${col(q.graha)};opacity:${live ? 1 : .5}"><span>${q.lord}</span></div>`;
  }).join('')}</div><div class="dscale"><span>${fmtDate(c.periods[0].start)}</span><span>${fmtDate(c.periods[8].end)}</span></div>`;

  const list = c.periods.map((q) => {
    const live = c.current && c.current.lord === q.lord;
    return `<tr><td><b style="color:${live ? 'var(--accent)' : 'var(--ink)'}">${q.lord}</b>${live ? ' <span class="mono" style="font-size:8px">NOW</span>' : ''}</td>
      <td class="mono">${q.years}y</td><td class="mono small">${fmtDate(q.start)} → ${fmtDate(q.end)}</td>
      <td class="small">ages ${Math.max(0, ageAt(new Date(Date.UTC(y, m - 1, d)), q.start)).toFixed(1)}–${ageAt(new Date(Date.UTC(y, m - 1, d)), q.end).toFixed(1)}</td></tr>`;
  }).join('');

  return `<div class="panel"><div class="panel-head">Vimśottarī daśā<span class="mini-grade">${c.current ? c.current.lord + ' running' : ''}</span></div>
    <div class="panel-body">${bar}
      <p class="lead-p" style="margin-top:.8rem">Nakṣatra ${c.nakshatraIndex} · ${esc(c.nakshatra)}, pada ${c.pada}. Balance at birth ${c.balanceYears.toFixed(2)} years.</p>
    </div></div>
    <div class="panel" style="margin-top:1rem"><div class="panel-head">The sequence</div>
      <div class="panel-body"><div class="twrap"><table><thead><tr><th>Lord</th><th>Years</th><th>Dates</th><th>Ages</th></tr></thead><tbody>${list}</tbody></table></div></div></div>`;
}

function grahasPanel(p) {
  const [y, m, d] = p.input.date.split('-').map(Number);
  const natal = allPlacements(julianDay(new Date(Date.UTC(y, m - 1, d, 12))));
  const transit = allPlacements(julianDay(new Date()));
  const moonSign = (natal.find((x) => x.key === 'Moon') || {}).sign || 1;
  const nrows = natal.map((g) => `<tr><td>${g.name}</td><td>${g.signName}</td><td class="mono">${g.degreeInSign.toFixed(2)}°</td>
    <td class="small">${NAKSHATRAS[g.nakshatra - 1]}</td><td class="mono">${g.pada}</td><td class="mono" style="color:var(--accent)">${g.retrograde ? 'R' : ''}</td></tr>`).join('');
  const trows = transit.map((t) => { const h = houseFrom(moonSign, t.sign);
    return `<tr><td>${t.name}</td><td>${t.signName}</td><td class="mono">${h}</td><td class="small">${HOUSE[h]}</td></tr>`; }).join('');
  return `<div class="panels">
    <div class="panel"><div class="panel-head">Natal positions<span class="mini-grade">12:00 UT</span></div>
      <div class="panel-body"><div class="twrap"><table><thead><tr><th>Graha</th><th>Rāśi</th><th>Degree</th><th>Nakṣatra</th><th>Pada</th><th></th></tr></thead><tbody>${nrows}</tbody></table></div></div></div>
    <div class="panel"><div class="panel-head">Gochara<span class="mini-grade">from the natal Moon</span></div>
      <div class="panel-body"><div class="twrap"><table><thead><tr><th>Graha</th><th>Today</th><th>House</th><th>Reads as</th></tr></thead><tbody>${trows}</tbody></table></div></div></div>
  </div>`;
}

function readingPanel(p) {
  const items = [['mulank','Mūlāṅka'],['bhagyank','Bhāgyāṅka'],['namank','Nāmāṅka']];
  const blocks = items.map(([k, label]) => {
    const r = p.reading[k];
    return `<div class="panel"><div class="panel-head">${label}<span class="mini-grade">${r.day}</span></div>
      <div class="panel-body">
        <div style="display:flex;gap:1.2rem;align-items:baseline">
          <div style="font:800 clamp(2.6rem,6vw,3.6rem)/.85 var(--sans);letter-spacing:-.05em;color:${col(r.n)}">${r.n}</div>
          <div><div style="font:800 1.15rem/1.2 var(--sans);letter-spacing:-.02em">${r.title}</div>
            <p class="lead-p" style="margin:.3rem 0 0">${esc(r.nature)}</p></div>
        </div>
        <div class="twrap" style="margin-top:.8rem"><table><tbody>
          <tr><td class="label">Strengths</td><td class="small">${r.strengths.map(esc).join(' · ')}</td></tr>
          <tr><td class="label">Watch</td><td class="small">${r.watch.map(esc).join(' · ')}</td></tr>
          <tr><td class="label">Work</td><td class="small">${r.careers.map(esc).join(' · ')}</td></tr>
          <tr><td class="label">Body</td><td class="small">${esc(r.body)}</td></tr>
        </tbody></table></div>
      </div></div>`;
  }).join('');

  const lucky = `<div class="panel"><div class="panel-head">Lucky elements<span class="mini-grade">from the mūlāṅka</span></div>
    <div class="panel-body"><div class="twrap"><table><tbody>
      <tr><td class="label">Numbers</td><td>${p.lucky.numbers.join(', ')}</td></tr>
      <tr><td class="label">Day</td><td>${p.lucky.days.join(', ')}</td></tr>
      <tr><td class="label">Colours</td><td>${p.lucky.colours.join(', ')}</td></tr>
      <tr><td class="label">Stone</td><td>${p.lucky.gemstone}</td></tr>
      <tr><td class="label">Mantra</td><td>${p.lucky.mantra}</td></tr>
      <tr><td class="label">Direction</td><td>${p.lucky.direction}</td></tr>
    </tbody></table></div></div></div>`;

  const harmony = `<div class="panel"><div class="panel-head">Harmony triangle</div>
    <div class="panel-body"><div class="twrap"><table><tbody>${p.reading.harmony.map((h) =>
      `<tr><td class="mono">${h.pair[0]} · ${h.pair[1]}</td><td style="color:${h.relation === 'friend' ? '#15803d' : h.relation === 'enemy' ? 'var(--accent)' : 'var(--muted)'}">${h.relation}</td>
       <td class="small">${esc(h.line)}</td></tr>`).join('')}</tbody></table></div></div></div>`;

  return blocks + `<div class="panels" style="margin-top:1rem">${lucky}${harmony}</div>`;
}

function everythingPanel(p) {
  const rows = (p.trace || []).map((t) => `<tr><td>${esc(t.label)}</td><td class="mono small">${esc(t.arithmetic || '')}</td>
    <td class="mono" style="text-align:right">${esc(t.value)}</td><td class="small">${esc(t.source || '')}</td></tr>`).join('');
  return `<div class="panel"><div class="panel-head">Every computed value<span class="mini-grade">${(p.trace || []).length} steps</span></div>
    <div class="panel-body"><div class="twrap"><table><thead><tr><th>Step</th><th>Rule</th><th style="text-align:right">Value</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table></div></div></div>`;
}

function render() {
  if (!profile) return;
  const map = { chart: chartPanel, grid: gridPanel, timing: timingPanel, grahas: grahasPanel, reading: readingPanel, everything: everythingPanel };
  panel.innerHTML = map[tab](profile);
  tabs.forEach((t) => t.setAttribute('aria-current', t.dataset.tab === tab ? 'page' : 'false'));
}

tabs.forEach((t) => t.addEventListener('click', (e) => { e.preventDefault(); tab = t.dataset.tab; render(); }));
form.addEventListener('submit', (e) => { e.preventDefault(); profile = compute(); render(); });
profile = compute();
render();
