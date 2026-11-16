import { CHALDEAN_COLUMNS, COMPOUND_GLOSS } from './engine/chaldean.js';
import { NUMERAL_GRAHA } from './engine/planets.js';
import { PLANES } from './engine/loshu.js';
import { SOURCES } from './engine/provenance.js';
import { DASHA_LORDS, NAKSHATRAS } from './engine/dasha.js';
import { STATIONS } from './engine/aa/index.js';
import { SPHIRAS } from './engine/aa/sphiras.js';

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const fill = (id, head, rows) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
};

fill('t-chaldean', ['Value', 'Letters'], CHALDEAN_COLUMNS.map((c) => [`<b class="mono">${c.value}</b>`, c.letters.join(' ')]));
fill('t-compounds', ['Number', 'Reading'], Object.entries(COMPOUND_GLOSS).map(([n, t]) => [`<b class="mono">${n}</b>`, esc(t)]));
fill('t-graha', ['Digit', 'Graha', 'Note'], Object.entries(NUMERAL_GRAHA).map(([n, g]) => [`<b class="mono">${n}</b>`, esc(g.graha), `<span class="small">${esc(g.note)}</span>`]));
fill('t-planes', ['Plane', 'Cells', 'Kind'], Object.values(PLANES).map((p) => [esc(p.label), `<span class="mono">${p.cells.join('–')}</span>`, `<span class="small">${esc(p.kind)}</span>`]));
fill('t-lords', ['Lord', 'Graha', 'Years'], DASHA_LORDS.map((l) => [esc(l.lord), `<span class="mono">${l.graha}</span>`, `<span class="mono">${l.years}</span>`]));
fill('t-stations', ['#', 'Nakṣatra'], STATIONS.map((s, i) => [`<span class="mono">${i + 1}</span>`, esc(s)]));
fill('t-sphiras', ['#', 'Sphira', 'Core', 'Vector'], SPHIRAS.map((s) => [`<b class="mono">${s.n}</b>`, esc(s.name), `<span class="small">${esc(s.core)}</span>`, `<span class="small">${esc(s.planet)}</span>`]));
fill('t-sources', ['Work', 'Author', 'Year', 'Status'], SOURCES.map((s) => [esc(s.title), esc(s.author), `<span class="mono">${esc(s.year || '')}</span>`, `<span class="small">${esc(s.status || '')}</span>`]));
