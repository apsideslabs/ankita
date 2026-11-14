/**
 * The AA System — verified against the worked examples printed in the
 * Axiom Arcana Codex and Research Document, not against its own output.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const aa = require('../.test-build/aa/index.js');

test('Reduce13 stops at 13 and never goes below it', () => {
  const cases = [[5, 5], [14, 5], [17, 8], [26, 8], [39, 12], [49, 13], [56, 11], [78, 6], [99, 9], [166, 13]];
  for (const [input, expected] of cases) {
    assert.equal(aa.reduce13(input), expected, `Reduce13(${input})`);
  }
});

test('Core Self matches the three worked examples in the Codex', () => {
  assert.equal(aa.coreSelf(3, 3, 2009).core, 8);    // 3+3+11 = 17 → 8
  assert.equal(aa.coreSelf(29, 11, 1995).core, 10); // 11+11+6 = 28 → 10
  assert.equal(aa.coreSelf(13, 1, 1987).core, 3);   // 13+1+7 = 21 → 3
});

test('the ALC is the symmetric pairing the document describes', () => {
  const table = Object.fromEntries(aa.ALC_TABLE.map((x) => [x.letter, x.value]));
  assert.equal(table.A, 1);
  assert.equal(table.N, 13);
  assert.equal(table.U, 6);
  assert.equal(table.J, 10);
  assert.equal(table.P, 11);
  assert.equal(table.R, 9);
  assert.equal(table.I, 9);
  assert.equal(table.Y, 2);
  assert.equal(table.Z, 1);
});

test('name numbers match ANUJ and PRIYA', () => {
  const anuj = aa.nameNumbers('Anuj');
  assert.equal(anuj.dpn, 3);
  assert.equal(anuj.swn, 7);
  assert.equal(anuj.pmn, 5);

  const priya = aa.nameNumbers('Priya');
  assert.equal(priya.dpn, 5);
  assert.equal(priya.swn, 10);
  assert.equal(priya.pmn, 4);
});

test('the Y-rule resolves Binay to the corrected DPN of 4', () => {
  // The Upgrade Blueprint records the error: Part 2 gave 12, Part 3 gave 4.
  // The resolved rule (Y = 2 as a vowel) gives 4.
  const b = aa.nameNumbers('Binay Das');
  assert.equal(b.dpn, 4);
});

test('stations divide the ecliptic into 27 parts of 13.33°', () => {
  assert.equal(aa.station(0).number, 1);
  assert.equal(aa.station(0).name, 'Aśvinī');
  assert.equal(aa.station(0).pada, 1);
  assert.equal(aa.station(10).pada, 4);
  assert.equal(aa.station(13.34).number, 2);
  assert.equal(aa.station(359.9).number, 27);
  assert.equal(aa.STATIONS.length, 27);
});

test('the APS cycle sums to 91 years and starts mid-period', () => {
  const total = aa.APS_LORDS.reduce((s, l) => s + l.years, 0);
  assert.equal(total, 91);
  const st = aa.station(6.67); // half way through Aśvinī
  const aps = aa.apsTimeline(st);
  assert.equal(aps.current.force, 'Sol');
  assert.ok(Math.abs(aps.remaining - 3.5) < 0.01);
  assert.equal(aps.segments.length, 9);
  const span = aps.segments[aps.segments.length - 1].endAge - aps.segments[0].startAge;
  assert.ok(Math.abs(span - 91) < 0.001);
});

test('station lord repeats every nine stations', () => {
  assert.equal(aa.apsTimeline(aa.station(0)).current.force, 'Sol');       // station 1
  assert.equal(aa.apsTimeline(aa.station(13.34)).current.force, 'Luna');  // station 2
  assert.equal(aa.apsTimeline(aa.station(13.34 * 9)).current.force, 'Sol'); // station 10
});

test('sub-periods use the documented formula', () => {
  assert.equal(aa.subPeriodYears(13, 13), (13 * 13) / 91);
  assert.ok(Math.abs(aa.subPeriodYears(7, 10) - 70 / 91) < 1e-9);
});

test('PLY, PLM and PLD reduce to 13', () => {
  const ply = aa.personalLunarYear(3, 3, 2009, 2026);
  assert.ok(ply >= 1 && ply <= 13);
  const plm = aa.personalLunarMonth(ply, 11);
  assert.ok(plm >= 1 && plm <= 13);
  assert.ok(aa.personalLunarDay(plm, 14) >= 1);
});

test('dignity scores follow the Codex table', () => {
  assert.equal(aa.dignityScore('Sol', 1), 100);   // Sun exalted in Realm 1
  assert.equal(aa.dignityScore('Sol', 5), 85);    // moolatrikona
  assert.equal(aa.dignityScore('Sol', 9), 70);    // own
  assert.equal(aa.dignityScore('Sol', 7), 10);    // debilitated
  assert.equal(aa.dignityScore('Luna', 8), 10);
});
