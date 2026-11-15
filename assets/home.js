import { buildProfile } from './engine/profile.js';
import { kundaliSVG, loshuSVG, dashaBarSVG } from './chart.js';
import { chartWithLagna } from './engine/extras.js';
import { vimshottari } from './engine/dasha.js';
import { allPlacements, julianDay } from './engine/ephemeris.js';

const form = document.getElementById('home-form');
const out = document.getElementById('home-out');

function render() {
  const name = document.getElementById('home-name').value;
  const date = document.getElementById('home-date').value;
  if (!name || !date) { out.innerHTML = ''; return; }
  const p = buildProfile({ name, date, gender: 'unspecified', masterNumbers: false });
  const [yy, mm, dd] = date.split('-').map(Number);
  const chart = chartWithLagna(date, 12, 26.1445, 91.7362);
  const counts = {};
  for (const c of p.grid) counts[c.digit] = c.count;
  const moon = allPlacements(julianDay(new Date(Date.UTC(yy, mm - 1, dd, 12)))).find((g) => g.key === 'Moon');
  const chartDasha = vimshottari(moon.longitude, new Date(Date.UTC(yy, mm - 1, dd, 12)));
  const NCOLOUR = {1:'var(--n1)',2:'var(--n2)',3:'var(--n3)',4:'var(--n4)',5:'var(--n5)',6:'var(--n6)',7:'var(--n7)',8:'var(--n8)',9:'var(--n9)'};
  const GRAHA = {1:'Sun',2:'Moon',3:'Jupiter',4:'Rāhu',5:'Mercury',6:'Venus',7:'Ketu',8:'Saturn',9:'Mars'};
  out.innerHTML = `
    <div class="dash">
      ${[['Mūlāṅka', p.mulank], ['Bhāgyāṅka', p.bhagyank], ['Nāmāṅka', p.namank]].map(([label, fact]) => {
        const n = ((fact.value - 1) % 9) + 1;
        return `<div>
          <div class="top"><span class="lbl">${label}</span><span class="graha" style="color:${NCOLOUR[n]}">${GRAHA[n]}</span></div>
          <div class="huge" style="color:${NCOLOUR[n]}">${fact.value}</div>
          <div class="sub">${fact.compound && fact.compound !== fact.value ? 'compound ' + fact.compound : '&nbsp;'}</div>
        </div>`;
      }).join('')}
    </div>
    <div class="sample-grid">
      <figure>
        ${kundaliSVG(chart.asc.sign, chart.grahas, 300)}
        <figcaption>Fig. 1 — the birth chart · lagna ${chart.asc.signName}</figcaption>
      </figure>
      <figure>
        ${loshuSVG(counts, 260)}
        <figcaption>Fig. 2 — the Lo Shu square</figcaption>
      </figure>
      <figure>
        ${dashaBarSVG(chartDasha.periods, 300)}
        <figcaption>Fig. 3 — Vimśottarī, ${chartDasha.current ? chartDasha.current.lord + ' running' : ''}</figcaption>
      </figure>
    </div>
    <p class="small mt-4">${p.reading.mulank.title} · ${p.reading.mulank.strengths[0]}. <a href="./workspace.html">Open the full reading →</a></p>
  `;
}

function safeRender() {
  try { render(); }
  catch (err) {
    const box = document.getElementById('home-out');
    if (box) box.innerHTML = '<p class="small" style="color:#8B2F0B">Chart error: ' + (err && err.message ? err.message : err) + '</p>';
    console.error(err);
  }
}
form.addEventListener('submit', (e) => { e.preventDefault(); safeRender(); });
safeRender();
