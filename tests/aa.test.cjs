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

const charts = require('../.test-build/aa/charts.js');

test('mod13 is the document’s canonical reduction', () => {
  assert.equal(charts.mod13(40), 1);
  assert.equal(charts.mod13(13), 13);
  assert.equal(charts.mod13(14), 1);
  assert.equal(charts.mod13(26), 13);
  assert.equal(charts.mod13(0), 13);
});

test('the A-Chart produces thirteen values, all inside 1-13', () => {
  const c = charts.buildAChart({ name: 'Binay Das', date: '2009-03-03', hour: 23, minute: 51 });
  assert.equal(c.values.length, 13);
  for (const v of c.values) assert.ok(v.value >= 1 && v.value <= 13, v.law + ' = ' + v.value);
});

test('A13 is the sum of A1-A12 reduced mod13', () => {
  const c = charts.buildAChart({ name: 'Binay Das', date: '2009-03-03' });
  const sum = c.values.slice(0, 12).reduce((s, v) => s + v.value, 0);
  assert.equal(c.values[12].value, charts.mod13(sum));
});

test('seeds are marked documented or derived, never silently invented', () => {
  const c = charts.buildAChart({ name: 'Binay Das', date: '2009-03-03' });
  const documented = c.seeds.filter((s) => s.status === 'documented').map((s) => s.key);
  assert.deepEqual(documented, ['D1', 'N1']);
  assert.ok(c.seeds.every((s) => s.derivation.length > 3));
});

test('the same input always yields the same chart', () => {
  const a = charts.buildAChart({ name: 'Binay Das', date: '2009-03-03', hour: 23, minute: 51 });
  const b = charts.buildAChart({ name: 'Binay Das', date: '2009-03-03', hour: 23, minute: 51 });
  assert.deepEqual(a.values.map((v) => v.value), b.values.map((v) => v.value));
});

test('the 117 formulas are all transcribed', () => {
  const { FORMULAS } = require('../.test-build/aa/formulas.js');
  assert.equal(FORMULAS.length, 117);
  assert.equal(FORMULAS[0].name, 'Life Seed Constant');
  assert.equal(FORMULAS[116].name, 'Ultimate Axion Confluence');
});

test('the 13 Sphiras are all transcribed', () => {
  const { SPHIRAS } = require('../.test-build/aa/sphiras.js');
  assert.equal(SPHIRAS.length, 13);
  assert.equal(SPHIRAS[0].name, 'Origin');
  assert.equal(SPHIRAS[12].name, 'Axion');
});

const bindings = require('../.test-build/aa/bindings.js');
const inputsMod = require('../.test-build/aa/inputs.js');

const SAMPLE = { name: 'Binay Das', date: '2009-03-03', hour: 23, minute: 51, lat: 26.1445, lon: 91.7362 };

test('all 117 bindings are computed, each with a readable expression', () => {
  const rows = bindings.computeBindings(SAMPLE);
  assert.equal(rows.length, 117);
  for (const r of rows) {
    assert.ok(r.value >= 1 && r.value <= 13, `F${r.id} = ${r.value}`);
    assert.ok(r.expression.includes('mod13'), `F${r.id} prints its arithmetic`);
    assert.ok(r.reading.length > 20, `F${r.id} carries a reading`);
    assert.ok(r.sphira.includes(String(r.value)));
  }
});

test('every binding is grouped into a domain, and the domains cover all 117', () => {
  const rows = bindings.computeBindings(SAMPLE);
  const groups = bindings.byDomain(rows);
  assert.equal(groups.reduce((n, g) => n + g.rows.length, 0), 117);
  assert.equal(groups[0].domain, 'Identity & Destiny');
  assert.equal(groups[groups.length - 1].rows[groups[groups.length - 1].rows.length - 1].id, 117);
});

test('bindings are deterministic for the same four inputs', () => {
  const a = bindings.computeBindings(SAMPLE).map((r) => r.value);
  const b = bindings.computeBindings(SAMPLE).map((r) => r.value);
  assert.deepEqual(a, b);
});

test('the time and place inputs change the chart', () => {
  const morning = bindings.computeBindings({ ...SAMPLE, hour: 6, minute: 0 });
  const night = bindings.computeBindings({ ...SAMPLE, hour: 23, minute: 51 });
  assert.notDeepEqual(morning.map((r) => r.value), night.map((r) => r.value));
});

test('cities resolve to coordinates', () => {
  const ghy = inputsMod.findCity('Guwahati');
  assert.ok(ghy && Math.abs(ghy.lat - 26.1445) < 0.001);
  assert.equal(inputsMod.CITIES.length > 40, true);
});

test('time parses, and local mean time corrects for longitude', () => {
  const t = inputsMod.parseTime('23:51', 330);
  assert.equal(t.hh, 23);
  assert.equal(t.mm, 51);
  assert.equal(inputsMod.localMinutes(t), 1431);
  const lmt = inputsMod.localMeanMinutes(t, 91.7362);
  assert.ok(lmt > inputsMod.localMinutes(t), 'east of the zone meridian, mean time runs ahead');
});

const dasha = require('../.test-build/dasha.js');

test('Vimsottari has nine lords totalling 120 years', () => {
  const total = dasha.DASHA_LORDS.reduce((s, l) => s + l.years, 0);
  assert.equal(total, 120);
  assert.equal(dasha.DASHA_TOTAL, 120);
});

test('the period sequence covers 120 years from the birth balance', () => {
  const birth = new Date(Date.UTC(1995, 7, 29, 12));
  const d = dasha.vimshottari(120.5, birth); // Moon in Magha
  assert.equal(d.periods.length, 9);
  const first = d.periods[0];
  const last = d.periods[8];
  const span = (last.end - first.start) / (365.2425 * 86400000);
  assert.ok(Math.abs(span - 120) < 0.01, `span ${span}`);
  assert.equal(first.partial, true);
  assert.ok(d.balanceYears > 0 && d.balanceYears <= first.years);
});

test('antardashas of a mahadasha sum to its own length', () => {
  const d = dasha.vimshottari(200, new Date(Date.UTC(1990, 0, 1)));
  for (const p of d.periods) {
    const sum = p.antardashas.reduce((s, a) => s + a.years, 0);
    assert.ok(Math.abs(sum - p.years) < 1e-9, `${p.lord}: ${sum} vs ${p.years}`);
  }
});

test('the current period is the one containing today', () => {
  const birth = new Date(Date.UTC(1995, 7, 29, 12));
  const d = dasha.vimshottari(120.5, birth);
  const now = new Date();
  assert.ok(d.current);
  assert.ok(now >= d.current.start && now < d.current.end);
  if (d.currentAntar) assert.ok(now >= d.currentAntar.start && now < d.currentAntar.end);
});

test('the nakshatra and pada follow the longitude', () => {
  assert.equal(dasha.vimshottari(0, new Date()).nakshatra, 'Aśvinī');
  assert.equal(dasha.vimshottari(0, new Date()).pada, 1);
  assert.equal(dasha.vimshottari(13.4, new Date()).nakshatra, 'Bharaṇī');
  assert.equal(dasha.vimshottari(359, new Date()).nakshatra, 'Revatī');
});
