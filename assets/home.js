import { buildProfile } from './engine/profile.js';

const form = document.getElementById('home-form');
const out = document.getElementById('home-out');

function render() {
  const name = document.getElementById('home-name').value;
  const date = document.getElementById('home-date').value;
  if (!name || !date) { out.innerHTML = ''; return; }
  const p = buildProfile({ name, date, gender: 'unspecified', masterNumbers: false });
  out.innerHTML = `
    <div class="triple">
      ${[['Mūlāṅka', p.mulank], ['Bhāgyāṅka', p.bhagyank], ['Nāmāṅka', p.namank]].map(([label, fact]) => `
        <div>
          <div class="label"><span>${label}</span></div>
          <div class="numeral big">${fact.value}</div>
          <p>${fact.compound && fact.compound !== fact.value ? 'compound ' + fact.compound : '&nbsp;'}</p>
        </div>`).join('')}
    </div>
    <p class="small mt-4">${p.reading.mulank.title} · ${p.reading.mulank.strengths[0]}. <a href="./workspace.html">Open the full reading →</a></p>
  `;
}

form.addEventListener('submit', (e) => { e.preventDefault(); render(); });
render();
