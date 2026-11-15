import { buildProfile } from './engine/profile.js';
import { vimshottari, fmtDate, ageAt } from './engine/dasha.js';
import { allPlacements, julianDay, ayanamsa, houseFrom } from './engine/ephemeris.js';
import { moonSidereal } from './engine/aa/index.js';
import { GRID } from './engine/loshu.js';
import { READINGS } from './engine/interpretation.js';
import { relation } from './engine/planets.js';

const form = document.getElementById('ws-form');
const panel = document.getElementById('panel');
const tabs = [...document.querySelectorAll('.tab')];
let tab = 'chart';
let profile = null;

const NCOLOUR = {1:'var(--n1)',2:'var(--n2)',3:'var(--n3)',4:'var(--n4)',5:'var(--n5)',6:'var(--n6)',7:'var(--n7)',8:'var(--n8)',9:'var(--n9)'};
const GRAHA_NAME = {1:'Sun',2:'Moon',3:'Jupiter',4:'Rāhu',5:'Mercury',6:'Venus',7:'Ketu',8:'Saturn',9:'Mars'};
const NAK = ['Aśvinī','Bharaṇī','Kṛttikā','Rohiṇī','Mṛgaśīrṣa','Ārdrā','Punarvasu','Puṣya','Āśleṣā','Maghā','Pūrva Phālgunī','Uttara Phālgunī','Hasta','Citrā','Svātī','Viśākhā','Anurādhā','Jyeṣṭhā','Mūla','Pūrvāṣāḍhā','Uttarāṣāḍhā','Śravaṇa','Dhaniṣṭhā','Śatabhiṣā','Pūrva Bhādrapadā','Uttara Bhādrapadā','Revatī'];
const HOUSE = {1:'body, self, health',2:'money, speech, family',3:'effort, siblings, courage',4:'home, mother, mind',5:'children, study, creativity',6:'work, debt, illness',7:'partnership, marriage',8:'crisis, inheritance, change',9:'fortune, teacher, travel',10:'career, status',11:'gain, network',12:'loss, foreign, release'};

function esc(s) { return String(s).replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

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
      <div class="top"><span class="lbl">${label}</span><span class="graha" style="color:${NCOLOUR[n]}">${GRAHA_NAME[n]}</span></div>
      <div class="huge" style="color:${NCOLOUR[n]}">${f.value}</div>
      <div class="sub">${sub}</div>
      ${f.compound && f.compound !== f.value ? `<div class="compound">compound ${f.compound}</div>` : ''}
    </div>`;
  }).join('');

  const rel = (a, b) => relation(a, b);
  const edge = (a, b) => { const r = rel(a, b); return r === 'friend' ? '#15803d' : r === 'enemy' ? '#8B2F0B' : '#B8862F'; };
  const m = p.mulank.value, b = p.bhagyank.value, nm = p.namank.value;

  return `<div class="dash">${cells}</div>

    <div style="display:grid;gap:2rem;margin-top:2rem" class="grid-2">
      <div class="card">
        <p class="panel-title">Harmony triangle</p>
        <svg viewBox="0 0 320 240" style="width:100%;max-width:340px;margin:1rem auto 0" role="img" aria-label="Harmony triangle">
          <line x1="160" y1="40" x2="46" y2="200" stroke="${edge(m,b)}" stroke-width="3"/>
          <line x1="46" y1="200" x2="274" y2="200" stroke="${edge(b,nm)}" stroke-width="3"/>
          <line x1="274" y1="200" x2="160" y2="40" stroke="${edge(nm,m)}" stroke-width="3"/>
          <circle cx="160" cy="40" r="30" fill="#fff" stroke="#E7DCC8" stroke-width="2"/>
          <text x="160" y="50" text-anchor="middle" font-size="26" font-family="var(--serif)" font-weight="600" fill="${NCOLOUR[((m-1)%9)+1]}">${m}</text>
          <circle cx="46" cy="200" r="30" fill="#fff" stroke="#E7DCC8" stroke-width="2"/>
          <text x="46" y="210" text-anchor="middle" font-size="26" font-family="var(--serif)" font-weight="600" fill="${NCOLOUR[((b-1)%9)+1]}">${b}</text>
          <circle cx="274" cy="200" r="30" fill="#fff" stroke="#E7DCC8" stroke-width="2"/>
          <text x="274" y="210" text-anchor="middle" font-size="26" font-family="var(--serif)" font-weight="600" fill="${NCOLOUR[((nm-1)%9)+1]}">${nm}</text>
        </svg>
        <p class="small" style="text-align:center">${rel(m,b)} · ${rel(b,nm)} · ${rel(nm,m)}</p>
      </div>
      <div class="card">
        <p class="panel-title">Kua &amp; direction</p>
        ${p.kua ? `<div style="display:flex;align-items:baseline;gap:1rem;margin-top:.6rem">
            <div class="huge" style="font-size:clamp(4rem,7vw,6rem);color:var(--n8)">${p.kua.value}</div>
            <div class="small">${esc(p.kua.note)}</div></div>
          <p class="small mono mt-4">favourable ${p.kua.directions.good.join(' · ')}<br>avoid ${p.kua.directions.bad.join(' · ')}</p>`
        : `<p class="small" style="margin-top:.8rem">Select a gender to compute the Kua number — a Chinese calculation that needs the birth century.</p>`}
      </div>
    </div>`;
}

function gridPanel(p) {
  const order = [4,9,2,3,5,7,8,1,6];
  const count = (d) => (p.grid.find((c) => c.digit === d) || {}).count || 0;
  return `<div class="grid-2" style="align-items:start">
    <div>
      <p class="panel-title">Lo Shu square</p>
      <div class="loshu mt-4">
        ${order.map((d) => { const c = count(d); return `<div class="cell ${c ? 'on' : 'off'}">
          <span class="d" style="color:${c ? NCOLOUR[((d-1)%9)+1] : ''}">${c ? d : '·'}</span>
          <span class="c">${c ? '×'.repeat(c) : 'missing'}</span></div>`; }).join('')}
      </div>
      <p class="small mt-4">Every non-zero digit of the date, plus the bhāgyāṅka, plus the mūlāṅka when the birth day is 10 or more. The name number is never placed.</p>
    </div>
    <div>
      <p class="panel-title">Missing</p>
      <ul style="list-style:none;padding:0;margin:.6rem 0 0">
        ${p.reading.missing.map((m) => `<li class="small" style="border-bottom:1px solid var(--line);padding:.5rem 0">
          <b style="color:${NCOLOUR[((m.n-1)%9)+1]};font-size:1.1rem">${m.n}</b> — ${esc(m.text)}</li>`).join('') || '<li class="small">No missing digits.</li>'}
      </ul>
      <p class="panel-title mt-6">Amplified</p>
      <ul style="list-style:none;padding:0;margin:.6rem 0 0">
        ${p.reading.repeated.map((m) => `<li class="small" style="border-bottom:1px solid var(--line);padding:.5rem 0">
          <b style="color:${NCOLOUR[((m.n-1)%9)+1]};font-size:1.1rem">${m.n}</b> — ${esc(m.text)}</li>`).join('') || '<li class="small">No digit appears three times or more.</li>'}
      </ul>
    </div>
  </div>`;
}

function timingPanel(p) {
  const [y,m,d] = p.input.date.split('-').map(Number);
  const moon = moonSidereal(p.input.date, 12);
  const chart = vimshottari(moon.sidereal, new Date(Date.UTC(y, m-1, d, 12)));
  const now = new Date();
  const colours = [1,2,3,4,5,6,7,8,9];
  const total = chart.periods.reduce((a, p2) => a + p2.years, 0);
  const bar = `<div class="tlbar">${chart.periods.map((per) => {
      const live = chart.current && chart.current.lord === per.lord;
      return `<div class="seg ${live ? 'now' : ''}" style="flex:${per.years};background:${NCOLOUR[((per.graha-1)%9)+1]};opacity:${live?1:.55}">
        <span>${per.lord}</span></div>`;
    }).join('')}</div>
    <div class="tlscale"><span>${fmtDate(chart.periods[0].start)}</span><span>${fmtDate(chart.periods[8].end)}</span></div>`;

  return `<div class="grid-2" style="align-items:start">
    <div>
      <p class="panel-title">Vimśottarī daśā</p>
      ${bar}
      <div class="mt-4" style="display:grid;grid-template-columns:1fr 1fr;gap:.8rem">
        ${[['Nakṣatra', chart.nakshatraIndex + ' · ' + chart.nakshatra], ['At birth', chart.lord + ' · ' + chart.balanceYears.toFixed(2) + ' yr'],
           ['Running now', chart.current ? chart.current.lord : '—'], ['Antardaśā', chart.currentAntar ? chart.currentAntar.lord : '—']]
          .map(([l,v]) => `<div><p class="panel-title">${l}</p><p class="mt-2" style="font-family:var(--serif);font-size:1.3rem">${esc(v)}</p></div>`).join('')}
      </div>
      ${chart.current ? `<p class="lede mt-4" style="font-size:.95rem"><strong>${chart.current.lord}</strong> mahādaśā, ${fmtDate(chart.current.start)} → ${fmtDate(chart.current.end)}. ${esc(READINGS[chart.current.graha].nature)}</p>` : ''}
      <ol style="list-style:none;padding:0;margin:1.2rem 0 0">
        ${chart.periods.map((per) => {
          const live = chart.current && chart.current.lord === per.lord;
          const past = per.end < now;
          return `<li style="display:flex;gap:.8rem;padding:.55rem 0;border-bottom:1px solid var(--line)">
            <span style="width:9px;height:9px;border-radius:50%;margin-top:.5rem;flex:none;border:2px solid ${live?'var(--copper)':past?'var(--line-strong)':'rgba(139,47,11,.4)'};background:${live?'var(--copper)':'transparent'}"></span>
            <div style="flex:1">
              <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap">
                <strong style="font-family:var(--serif);color:${live?'var(--copper)':'var(--ink)'}">${per.lord}</strong>
                <span class="mono small">${fmtDate(per.start)} → ${fmtDate(per.end)}</span>
              </div>
              <span class="small">ages ${Math.max(0,ageAt(new Date(Date.UTC(y,m-1,d)),per.start)).toFixed(1)}–${ageAt(new Date(Date.UTC(y,m-1,d)),per.end).toFixed(1)} · ${per.years} yr${per.partial?' · balance at birth':''}</span>
            </div></li>`;
        }).join('')}
      </ol>
    </div>
    <div>
      <p class="panel-title">Personal cycles</p>
      <table class="mt-4"><tbody>
        ${p.timing.map((t) => `<tr><td><div class="small" style="text-transform:uppercase;letter-spacing:.16em">${t.label}</div><div class="small">${esc(t.detail)}</div></td>
          <td style="text-align:right;font-family:var(--serif);font-size:1.8rem;font-weight:600">${t.value}</td></tr>`).join('')}
      </tbody></table>
      <p class="small mt-4">The 45-year cycle is arithmetic — one year for 1, two for 2, to nine. It is not a classical daśā and is labelled as a modern cycle. Vimśottarī is computed from the Moon’s sidereal longitude.</p>
    </div>
  </div>`;
}

function grahasPanel(p) {
  const [y,m,d] = p.input.date.split('-').map(Number);
  const natal = allPlacements(julianDay(new Date(Date.UTC(y, m-1, d, 12))));
  const transit = allPlacements(julianDay(new Date()));
  const moonSign = (natal.find((x) => x.key === 'Moon') || {}).sign || 1;
  return `<p class="panel-title">Natal positions · 12:00 UT</p>
    <table class="mt-3"><thead><tr><th>Graha</th><th>Rāśi</th><th>Degree</th><th>Nakṣatra</th><th>Pada</th><th></th></tr></thead>
    <tbody>${natal.map((g) => `<tr><td>${g.name}</td><td>${g.signName}</td><td class="mono">${g.degreeInSign.toFixed(2)}°</td>
      <td>${chart_nak(g.nakshatra)}</td><td class="mono">${g.pada}</td><td class="mono" style="color:var(--copper)">${g.retrograde?'R':''}</td></tr>`).join('')}</tbody></table>
    <p class="panel-title mt-8">Gochara · today, counted from the natal Moon</p>
    <table class="mt-3"><thead><tr><th>Graha</th><th>Today</th><th>House</th><th>Reads as</th></tr></thead>
    <tbody>${transit.map((t) => { const h = houseFrom(moonSign, t.sign); return `<tr><td>${t.name}</td><td>${t.signName}</td><td class="mono">${h}</td><td class="small">${HOUSE[h]}</td></tr>`; }).join('')}</tbody></table>
    <p class="small mt-4">Truncated orbital elements: about 0.1° for the Sun, 0.3° for the Moon, 1° for the planets. A sign or nakṣatra is reliable; a pada within a degree of its boundary should be checked against an ephemeris.</p>`;
}

function chart_nak(n) {
  const N = ['Aśvinī','Bharaṇī','Kṛttikā','Rohiṇī','Mṛgaśīrṣa','Ārdrā','Punarvasu','Puṣya','Āśleṣā','Maghā','Pūrva Phālgunī','Uttara Phālgunī','Hasta','Citrā','Svātī','Viśākhā','Anurādhā','Jyeṣṭhā','Mūla','Pūrvāṣāḍhā','Uttarāṣāḍhā','Śravaṇa','Dhaniṣṭhā','Śatabhiṣā','Pūrva Bhādrapadā','Uttara Bhādrapadā','Revatī'];
  return N[n-1] || '';
}

function readingPanel(p) {
  const items = [['mulank','Mūlāṅka'],['bhagyank','Bhāgyāṅka'],['namank','Nāmāṅka']];
  return items.map(([k,label]) => {
    const r = p.reading[k];
    return `<article style="border-top:1px solid var(--line);padding:1.5rem 0;display:grid;grid-template-columns:7rem 1fr;gap:2rem">
      <div><div class="numeral" style="font-size:4.4rem;color:var(--copper)">${r.n}</div><div class="panel-title mt-2">${label}</div></div>
      <div>
        <h3 style="font-size:1.5rem">${r.title} <span class="mono small" style="color:var(--copper);margin-left:.5rem">${r.day}</span></h3>
        <p class="lede" style="font-size:.98rem">${esc(r.nature)}</p>
        <div class="mt-4" style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.2rem;border-top:1px solid var(--line);padding-top:.9rem">
          <div><p class="panel-title" style="color:#15803d">Strengths</p><ul style="margin:.4rem 0 0;padding-left:1rem" class="small">${r.strengths.map((x)=>`<li>${esc(x)}</li>`).join('')}</ul></div>
          <div><p class="panel-title" style="color:var(--copper)">To watch</p><ul style="margin:.4rem 0 0;padding-left:1rem" class="small">${r.watch.map((x)=>`<li>${esc(x)}</li>`).join('')}</ul></div>
          <div><p class="panel-title">Work</p><ul style="margin:.4rem 0 0;padding-left:1rem" class="small">${r.careers.map((x)=>`<li>${esc(x)}</li>`).join('')}</ul></div>
        </div>
        <p class="small mt-2">${esc(r.body)}</p>
      </div></article>`;
  }).join('') + `
    <div class="grid-2 mt-8">
      <div><p class="panel-title">Lucky elements</p>
        <table class="mt-3"><tbody>
          <tr><td class="small">Numbers</td><td>${p.lucky.numbers.join(', ')}</td></tr>
          <tr><td class="small">Day</td><td>${p.lucky.days.join(', ')}</td></tr>
          <tr><td class="small">Colours</td><td>${p.lucky.colours.join(', ')}</td></tr>
          <tr><td class="small">Stone</td><td>${p.lucky.gemstone}</td></tr>
          <tr><td class="small">Mantra</td><td>${p.lucky.mantra}</td></tr>
          <tr><td class="small">Direction</td><td>${p.lucky.direction}</td></tr>
        </tbody></table></div>
      <div><p class="panel-title">Harmony triangle</p>
        <ul style="list-style:none;padding:0;margin:.6rem 0 0">
          ${p.reading.harmony.map((h)=>`<li style="border-left:2px solid var(--line);padding:.2rem 0 .2rem .8rem;margin-bottom:.8rem">
            <span class="mono">${h.pair[0]} · ${h.pair[1]}</span> <span class="mono small" style="color:${h.relation==='friend'?'#15803d':h.relation==='enemy'?'var(--copper)':'var(--ink-muted)'}">${h.relation}</span>
            <div class="small">${esc(h.line)}</div></li>`).join('')}
        </ul></div>
    </div>`;
}

function everythingPanel(p) {
  return `<p class="panel-title">Every computed value, in order</p>
    <table class="mt-3"><thead><tr><th>Step</th><th>Rule</th><th style="text-align:right">Value</th><th>Source</th></tr></thead>
    <tbody>${(p.trace||[]).map((t)=>`<tr><td>${esc(t.label)}</td><td class="mono small">${esc(t.arithmetic||'')}</td>
      <td style="text-align:right;font-family:var(--serif);font-size:1.1rem">${esc(t.value)}</td><td class="small">${esc(t.source||'')}</td></tr>`).join('')}</tbody></table>`;
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
