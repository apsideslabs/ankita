import { transitTable, nextIngress } from './engine/transits.js';
import { allPlacements, julianDay } from './engine/ephemeris.js';

const NCOLOUR = {1:'var(--n1)',2:'var(--n2)',3:'var(--n3)',4:'var(--n4)',5:'var(--n5)',6:'var(--n6)',7:'var(--n7)',8:'var(--n8)',9:'var(--n9)'};
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const HOUSE = {1:'body, self',2:'money, speech',3:'effort, siblings',4:'home, mind',5:'children, study',6:'work, debt',7:'partnership',8:'crisis, change',9:'fortune, teacher',10:'career, status',11:'gain, network',12:'loss, foreign'};

function render() {
  const date = document.getElementById('t-date').value;
  const [y, m, d] = date.split('-').map(Number);
  const natal = allPlacements(julianDay(new Date(Date.UTC(y, m - 1, d, 12))));
  const moon = natal.find((g) => g.key === 'Moon');
  const rows = transitTable(moon.sign);
  const now = new Date();
  const slow = ['Jupiter', 'Saturn', 'Rahu', 'Ketu'];
  const ingresses = slow.map((k) => nextIngress(k, now)).filter(Boolean);

  document.getElementById('t-out').innerHTML = `
    <div style="display:flex;align-items:baseline;gap:1rem;flex-wrap:wrap">
      <div class="numeral" style="font-size:clamp(2.4rem,5vw,3.6rem);color:${NCOLOUR[moon.sign]}">${moon.sign}</div>
      <div><div class="panel-title" style="font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-muted)">Natal Moon</div>
      <div style="font-family:var(--serif);font-size:1.4rem;font-weight:600">${esc(moon.signName)}</div></div>
    </div>

    <div class="card mt-6">
      <table><thead><tr><th>Graha</th><th>Today</th><th>Degree</th><th>House from Moon</th><th>Reads as</th></tr></thead>
      <tbody>${rows.map((r) => `<tr>
        <td>${esc(r.name)}</td>
        <td style="color:${NCOLOUR[r.sign]}">${esc(r.signName)}${r.retrograde ? ' <span class="mono" style="font-size:9px;color:var(--copper)">R</span>' : ''}</td>
        <td class="mono">${r.degree.toFixed(2)}°</td>
        <td class="mono" style="color:${NCOLOUR[r.house]}">${r.house}</td>
        <td class="small">${HOUSE[r.house]}</td></tr>`).join('')}</tbody></table>
    </div>

    <p class="eyebrow mt-12">Next sign changes</p>
    <h2 class="big">When the slow ones move.</h2>
    <div class="card mt-6">
      <table><thead><tr><th>Graha</th><th>From</th><th>To</th><th>Date</th></tr></thead>
      <tbody>${ingresses.map((i) => `<tr><td>${esc(i.graha)}</td><td class="small">${esc(i.from)}</td>
        <td>${esc(i.to)}</td><td class="mono">${i.date}</td></tr>`).join('')}</tbody></table>
      <p class="small mt-4">Computed by stepping the ephemeris a day at a time and watching for a sign change — the date is accurate to a day, not to the hour.</p>
    </div>`;
}

document.getElementById('t-go').addEventListener('click', render);
render();
