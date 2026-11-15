/* The North Indian kundali, drawn from the engine's placements. */

const GLYPH = { Sun: 'Sū', Moon: 'Ca', Mars: 'Ma', Mercury: 'Bu', Jupiter: 'Gu', Venus: 'Śu', Saturn: 'Śa', Rahu: 'Rā', Ketu: 'Ke' };

export function kundaliSVG(ascSign, grahas, size = 340) {
  const S = 300, c = S / 2;
  const pos = {
    1: [150, 78], 2: [72, 44], 3: [44, 72], 4: [78, 150], 5: [44, 228], 6: [72, 256],
    7: [150, 222], 8: [228, 256], 9: [256, 228], 10: [222, 150], 11: [256, 72], 12: [228, 44],
  };
  const byHouse = {};
  for (const g of grahas) {
    const h = ((g.sign - ascSign + 12) % 12) + 1;
    (byHouse[h] ||= []).push(g);
  }
  const cells = Object.entries(pos).map(([h, [x, y]]) => {
    const list = byHouse[h] || [];
    const marks = list.map((g, i) => `<text x="${x}" y="${y + 12 + i * 13}" text-anchor="middle"
      font-size="11" font-family="Georgia,serif" fill="${g.key === 'Rahu' || g.key === 'Ketu' ? '#8B2F0B' : '#1B1712'}"
      ${g.retrograde ? 'font-style="italic"' : ''}>${GLYPH[g.key] || g.name.slice(0, 2)}</text>`).join('');
    return `<text x="${x}" y="${y}" text-anchor="middle" font-size="8" font-family="ui-monospace,monospace"
      fill="#9A9184" letter-spacing="1">${h}</text>${marks}`;
  }).join('');

  return `<svg viewBox="0 0 ${S} ${S}" width="${size}" height="${size}" role="img"
    aria-label="North Indian birth chart, ascendant ${ascSign}">
    <rect x="1" y="1" width="${S - 2}" height="${S - 2}" fill="#FFFDF8" stroke="#B6A788" stroke-width="1.4"/>
    <g stroke="#B6A788" stroke-width="1" fill="none">
      <line x1="1" y1="1" x2="${S - 1}" y2="${S - 1}"/>
      <line x1="${S - 1}" y1="1" x2="1" y2="${S - 1}"/>
      <path d="M${c} 1 L${S - 1} ${c} L${c} ${S - 1} L1 ${c} Z"/>
    </g>
    ${cells}
  </svg>`;
}

export function loshuSVG(counts, size = 300) {
  const order = [4, 9, 2, 3, 5, 7, 8, 1, 6];
  const cell = 96, gap = 4;
  const cells = order.map((d, i) => {
    const x = (i % 3) * (cell + gap), y = Math.floor(i / 3) * (cell + gap);
    const n = counts[d] || 0;
    return `<g>
      <rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${n ? '#FFFDF8' : '#F1EBDD'}"
        stroke="${n ? '#B6A788' : '#D9CDB6'}" stroke-width="1" ${n ? '' : 'stroke-dasharray="3 4"'}/>
      <text x="${x + cell / 2}" y="${y + cell / 2 + 16}" text-anchor="middle" font-size="${n ? 40 : 26}"
        font-family="Georgia,serif" font-weight="600" fill="${n ? '#1B1712' : '#C3B69C'}">${n ? d : '·'}</text>
      ${n > 1 ? `<text x="${x + cell / 2}" y="${y + cell - 12}" text-anchor="middle" font-size="9"
        font-family="ui-monospace,monospace" fill="#9A9184">×${n}</text>` : ''}
    </g>`;
  }).join('');
  return `<svg viewBox="0 0 ${3 * cell + 2 * gap} ${3 * cell + 2 * gap}" width="${size}" height="${size}"
    role="img" aria-label="Lo Shu square">${cells}</svg>`;
}

export function dashaBarSVG(periods, size = 340) {
  const w = 340, h = 46;
  const total = periods.reduce((a, p) => a + p.years, 0);
  const COLOUR = { Sun: '#B07B1E', Moon: '#5F7391', Mars: '#A63A2C', Mercury: '#2C7154', Jupiter: '#C0902A', Venus: '#A85F73', Saturn: '#28425F', Rahu: '#3A3A6B', Ketu: '#6A6459' };
  let x = 0;
  const segs = periods.map((p) => {
    const pw = (p.years / total) * w;
    const seg = `<g><rect x="${x}" y="0" width="${pw}" height="${h}" fill="${COLOUR[p.lord] || '#8B2F0B'}" opacity="0.92"/>
      <text x="${x + pw / 2}" y="${h / 2 + 4}" text-anchor="middle" font-size="8"
        font-family="ui-monospace,monospace" fill="#fff" letter-spacing="1">${p.lord.slice(0, 3).toUpperCase()}</text></g>`;
    x += pw;
    return seg;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" width="${size}" height="${h / w * size}" role="img"
    aria-label="Vimsottari dasha timeline">${segs}</svg>`;
}
