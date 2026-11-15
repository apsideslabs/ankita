import { buildProfile } from './engine/profile.js';

const form = document.getElementById('home-form');
const out = document.getElementById('home-out');

function render() {
  const name = document.getElementById('home-name').value;
  const date = document.getElementById('home-date').value;
  if (!name || !date) { out.innerHTML = ''; return; }
  const p = buildProfile({ name, date, gender: 'unspecified', masterNumbers: false });
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
    <p class="small mt-4">${p.reading.mulank.title} · ${p.reading.mulank.strengths[0]}. <a href="./workspace.html">Open the full reading →</a></p>
  `;
}

form.addEventListener('submit', (e) => { e.preventDefault(); render(); });
render();
