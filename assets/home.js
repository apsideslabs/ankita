import { buildProfile } from './engine/profile.js';
import { loshuSVG, dashaBarSVG } from './chart.js';
import { vimshottari } from './engine/dasha.js';
import { allPlacements, julianDay } from './engine/ephemeris.js';

const form = document.getElementById('home-form');
const out = document.getElementById('home-out');
const figs = document.getElementById('home-figs');

const NCOLOUR = {1:'var(--n1)',2:'var(--n2)',3:'var(--n3)',4:'var(--n4)',5:'var(--n5)',6:'var(--n6)',7:'var(--n7)',8:'var(--n8)',9:'var(--n9)'};
const GRAHA = {1:'Sun',2:'Moon',3:'Jupiter',4:'Rāhu',5:'Mercury',6:'Venus',7:'Ketu',8:'Saturn',9:'Mars'};

function render() {
  const name = document.getElementById('home-name').value.trim();
  const date = document.getElementById('home-date').value;
  if (!name || !date) { out.innerHTML = ''; return; }

  const p = buildProfile({ name, date, gender: 'unspecified', masterNumbers: false });
  const [yy, mm, dd] = date.split('-').map(Number);

  // the three numbers
  out.innerHTML = `<div class="num-hero" style="margin-top:1rem">${
    [['Mūlāṅka', p.mulank], ['Bhāgyāṅka', p.bhagyank], ['Nāmāṅka', p.namank]].map(([label, fact]) => {
      const n = ((fact.value - 1) % 9) + 1;
      const compound = fact.compound && fact.compound !== fact.value ? 'compound ' + fact.compound : '&nbsp;';
      return `<div>
        <div class="k"><span>${label}</span><span style="color:${NCOLOUR[n]}">${GRAHA[n]}</span></div>
        <div class="v" style="color:${NCOLOUR[n]}">${fact.value}</div>
        <div class="n">${compound}</div>
      </div>`;
    }).join('')
  }</div>`;

  // the two figures
  if (figs) {
    const counts = {};
    for (const c of p.grid) counts[c.digit] = c.count;
    const moon = allPlacements(julianDay(new Date(Date.UTC(yy, mm - 1, dd, 12)))).find((g) => g.key === 'Moon');
    const d = vimshottari(moon.longitude, new Date(Date.UTC(yy, mm - 1, dd, 12)));
    figs.innerHTML = `
      <div class="panel"><div class="panel-head">Lo Shu square<span class="mini-grade">placement</span></div>
        <div class="panel-body">${loshuSVG(counts, 300)}
        <p class="lead-p" style="margin-top:.7rem">Every non-zero digit of the date, plus the bhāgyāṅka, plus the mūlāṅka when the birth day is ten or more.</p></div></div>
      <div class="panel"><div class="panel-head">Vimśottarī daśā<span class="mini-grade">${d.current ? d.current.lord + ' running' : ''}</span></div>
        <div class="panel-body">${dashaBarSVG(d.periods, 320)}
        <p class="lead-p" style="margin-top:.7rem">One hundred and twenty years among nine lords, from the Moon's position at birth.</p></div></div>`;
  }
}

function safeRender() {
  try { render(); }
  catch (err) {
    if (out) out.innerHTML = '<p class="small" style="color:#C1440E">Could not compute: ' + (err && err.message ? err.message : err) + '</p>';
    console.error(err);
  }
}

form.addEventListener('submit', (e) => { e.preventDefault(); safeRender(); });
safeRender();
