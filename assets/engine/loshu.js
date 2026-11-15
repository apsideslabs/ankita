/**
 * The Lo Shu square: 4 9 2 / 3 5 7 / 8 1 6. Every row, column and diagonal
 * sums to 15. This grid is Chinese in origin — it is the Lo Shu of the
 * 洛書 tradition — and it enters Indian numerology late. Aṅkita labels it
 * accordingly rather than presenting it as Vedic.
 */
export const GRID = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
];
export const PLANES = {
    mental: { label: 'Mental plane', cells: [4, 9, 2], kind: 'row' },
    emotional: { label: 'Emotional plane', cells: [3, 5, 7], kind: 'row' },
    practical: { label: 'Practical plane', cells: [8, 1, 6], kind: 'row' },
    thought: { label: 'Thought column', cells: [4, 3, 8], kind: 'column' },
    will: { label: 'Will column', cells: [9, 5, 1], kind: 'column' },
    action: { label: 'Action column', cells: [2, 7, 6], kind: 'column' },
    prosperity: { label: 'Prosperity diagonal', cells: [4, 5, 6], kind: 'diagonal' },
    stability: { label: 'Stability diagonal', cells: [2, 5, 8], kind: 'diagonal' },
};
const PLANE_OF = {
    4: 'mental', 9: 'mental', 2: 'mental',
    3: 'emotional', 5: 'emotional', 7: 'emotional',
    8: 'practical', 1: 'practical', 6: 'practical',
};
export function buildGrid(digits) {
    const counts = new Map();
    for (const d of digits)
        if (d >= 1 && d <= 9)
            counts.set(d, (counts.get(d) ?? 0) + 1);
    return [1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => ({
        digit,
        count: counts.get(digit) ?? 0,
        plane: PLANE_OF[digit],
    }));
}
export function buildLines(cells) {
    const count = (d) => cells.find((c) => c.digit === d)?.count ?? 0;
    return Object.entries(PLANES).map(([id, p]) => ({
        id,
        cells: p.cells,
        label: p.label,
        kind: p.kind,
        complete: p.cells.every((d) => count(d) > 0),
        // Line names are modern English coinages of the Lo Shu literature.
        layer: 'loshu',
    }));
}
export function missingNumbers(cells) {
    return cells.filter((c) => c.count === 0).map((c) => c.digit);
}
export function repeatedNumbers(cells, threshold = 3) {
    return cells.filter((c) => c.count >= threshold).map((c) => c.digit);
}
