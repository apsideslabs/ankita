/**
 * Engine verification suite.
 * Every case here is checked against a worked example printed in a source,
 * not against the engine's own output.
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const { reduce, digitSum } = require('../.test-build/numbers.js');
const { nameSum, nameCompound, breakdown } = require('../.test-build/chaldean.js');
const { kua } = require('../.test-build/kua.js');
const { GRID, buildGrid, missingNumbers } = require('../.test-build/loshu.js');
const { decodeBhuta, decodeKatapayadi, padaForLongitude, NAKSHATRA_PADAS } = require('../.test-build/sanskrit.js');
const { buildProfile } = require('../.test-build/profile.js');
const { relation } = require('../.test-build/planets.js');

test('digital root reduces to 1–9', () => {
  assert.equal(digitSum(1995), 24);
  assert.equal(reduce(29), 2);
  assert.equal(reduce(43), 7);
  assert.equal(reduce(1995), 6);
});

test('master numbers are optional, and off by default', () => {
  assert.equal(reduce(11), 2);
  assert.equal(reduce(11, true), 11);
  assert.equal(reduce(33, true), 33);
});

test('Chaldean letters reproduce Cheiro’s John Smith example', () => {
  // Cheiro, Book of Numbers: John = 9, Smith = 8, compound 17, root 8.
  const parts = breakdown('John Smith');
  assert.equal(parts.length, 9);
  const john = parts.slice(0, 4).reduce((s, p) => s + p.value, 0);
  const smith = parts.slice(4).reduce((s, p) => s + p.value, 0);
  assert.equal(reduce(john), 9);
  assert.equal(reduce(smith), 8);
  assert.equal(nameCompound('John Smith'), 17);
  assert.equal(reduce(nameCompound('John Smith')), 8);
  assert.equal(nameSum('John Smith'), 35);
});

test('the Chaldean table leaves 9 unassigned', () => {
  const values = new Set(breakdown('abcdefghijklmnopqrstuvwxyz').map((p) => p.value));
  assert.ok(!values.has(9), 'no letter may carry 9');
  assert.equal(values.size, 8);
});

test('Kua number branches on the century', () => {
  assert.equal(kua(1995, 'male').value, 2);
  assert.equal(kua(1995, 'female').value, 1);
  assert.equal(kua(2005, 'male').value, 4);
  assert.equal(kua(2005, 'female').value, 2);
  assert.equal(kua(1995, 'unspecified'), null);
});

test('the Lo Shu square is magic', () => {
  for (const row of GRID) assert.equal(row.reduce((a, b) => a + b, 0), 15);
  for (let c = 0; c < 3; c += 1) assert.equal(GRID[0][c] + GRID[1][c] + GRID[2][c], 15);
  assert.equal(GRID[0][0] + GRID[1][1] + GRID[2][2], 15);
  assert.equal(GRID[0][2] + GRID[1][1] + GRID[2][0], 15);
});

test('grid placement counts and reports missing digits', () => {
  const cells = buildGrid([1, 1, 2, 9]);
  assert.equal(cells.find((c) => c.digit === 1).count, 2);
  assert.deepEqual(missingNumbers(cells), [3, 4, 5, 6, 7, 8]);
});

test('bhūtasaṅkhyā decodes the standard example', () => {
  // S. R. Sarma's illustration: 2010 as ākāśa-vasudhā-nabhas-kara.
  const r = decodeBhuta('ākāśa-vasudhā-nabhas-kara');
  assert.equal(r.value, 2010);
  assert.deepEqual(r.steps.map((s) => s.digit), [0, 1, 0, 2]);
});

test('kaṭapayādi decodes the standard example', () => {
  // 2010 as naṭanara (retroflex ṭa = 1), read right to left.
  const r = decodeKatapayadi('naṭanara');
  assert.equal(r.value, 2010);
});

test('nāmākṣara maps longitude to syllable', () => {
  assert.equal(padaForLongitude(0).syllable, 'cu');
  assert.equal(padaForLongitude(0).name, 'Aśvinī');
  assert.equal(padaForLongitude(10).syllable, 'lā');
  assert.equal(padaForLongitude(10).pada, 4);
  assert.equal(NAKSHATRA_PADAS.length, 27);
  assert.equal(NAKSHATRA_PADAS.flatMap((n) => n.padas).length, 108);
});

test('the profile agrees with the blueprint’s own arithmetic', () => {
  // 29-08-1995 → mūlāṅka 2, bhāgyāṅka 7 (2+9+0+8+1+9+9+5 = 43 → 7).
  const p = buildProfile({ name: 'John Smith', date: '1995-08-29', gender: 'male', masterNumbers: false });
  assert.ok(!('error' in p));
  assert.equal(p.mulank.value, 2);
  assert.equal(p.bhagyank.value, 7);
  assert.equal(p.namank.value, 8);
  assert.equal(p.kua.value, 2);
});

test('graha friendship follows the natural scheme', () => {
  assert.equal(relation(1, 8), 'enemy');   // Sun / Saturn
  assert.equal(relation(1, 2), 'friend');  // Sun / Moon
  assert.equal(relation(1, 5), 'neutral'); // Sun / Mercury
});

test('bad input returns an error rather than a reading', () => {
  const bad = buildProfile({ name: 'X', date: 'not-a-date', gender: 'unspecified', masterNumbers: false });
  assert.ok('error' in bad);
});
