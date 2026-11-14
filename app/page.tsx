import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HomeConsole } from '@/components/home/HomeConsole';
import { Ornament } from '@/components/ui/ornament';
import { SITE_CONFIG } from '@/lib/site-config';

const LAYERS = [
  {
    n: '01',
    title: 'Chaldean arithmetic',
    body: 'Letter values, the compound numbers 10–52, single-digit reduction. Verified against the worked example in the book itself — John Smith, 9 and 8, compound 17, root 8.',
    tag: 'Cheiro · London 1926',
  },
  {
    n: '02',
    title: 'Graha-numerology',
    body: 'Nine digits for nine planets. The Indian form keeps seven of Cheiro’s assignments and replaces Uranus and Neptune with Rāhu and Ketu — a substitution the source states in its own words.',
    tag: 'Johari · Delhi 1990',
  },
  {
    n: '03',
    title: 'The Lo Shu square',
    body: 'Placement, plane lines, missing and amplified digits. Chinese in origin, entering Indian practice late, and labelled as Chinese everywhere in this platform.',
    tag: 'Chinese · 4th c. BCE',
  },
];

const SPECIMEN = [
  ['Rules in the engine', '38'],
  ['Tables printed in full', '9'],
  ['Sources dated', '11'],
  ['Engine tests', '17'],
];

export default function HomePage() {
  return (
    <div className="w-full">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pt-12 sm:pt-16">
        <div className="kicker">
          <span className="n">Aṅkita</span>
          <span>{SITE_CONFIG.devanagari} · numerology workstation</span>
        </div>

        <h1 className="display mt-7 max-w-4xl">
          Every number,
          <br />
          with its <em className="italic text-copper">source</em> attached.
        </h1>

        <p className="lede mt-6">
          Three traditions are usually sold as one. Aṅkita keeps them apart: the Chaldean letter
          table of 1926, the Indian graha scheme of 1990, and a Chinese number square — each figure
          printed with the date and the book it came from.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/workspace"
            className="action-slab inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[11px] font-mono font-semibold uppercase tracking-[0.16em] transition-colors btn-press"
          >
            Open the workspace <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/method"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-line-strong bg-surface/70 text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-ink hover:border-copper/50 transition-colors"
          >
            Read the method
          </Link>
          <Link
            href="/engine"
            className="ml-auto text-[11px] font-mono uppercase tracking-[0.16em] text-ink-soft hover:text-copper transition-colors"
          >
            Every table →
          </Link>
        </div>

        {/* Specimen strip */}
        <dl className="mt-12 grid grid-cols-2 sm:grid-cols-4 border-y border-line divide-x divide-line">
          {SPECIMEN.map(([label, value]) => (
            <div key={label} className="px-4 py-4 first:pl-0">
              <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">{label}</dt>
              <dd className="mt-1 font-serif text-2xl font-bold text-ink tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Console, framed as a plate */}
        <div className="mt-12">
          <div className="flex items-baseline justify-between mb-2">
            <span className="plate-cap">Fig. 1 — reading console</span>
            <span className="plate-cap">computes locally</span>
          </div>
          <HomeConsole />
        </div>
      </section>

      <Ornament glyph="अं" />

      {/* ── The three layers, as an index ──────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="kicker">
          <span className="n">I</span>
          <span>What the numbers are made of</span>
        </div>
        <h2 className="h2-ed mt-5 max-w-2xl">
          Three traditions, named separately, never blended.
        </h2>

        <div className="mt-9">
          {LAYERS.map((l) => (
            <div key={l.n} className="index-row">
              <span className="num">{l.n}</span>
              <div>
                <h3>{l.title}</h3>
                <p>{l.body}</p>
                <span className="tag">{l.tag}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Ornament glyph="॥" />

      {/* ── What it computes ───────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="kicker">
              <span className="n">II</span>
              <span>Inside the engine</span>
            </div>
            <h2 className="h2-ed mt-5">Deterministic, and open to inspection.</h2>
            <p className="lede mt-4">
              One pure function takes a name and a date and returns everything — three core numbers,
              the grid, the friendships, the timing cycles, the reading and the provenance list.
            </p>
            <ul className="arrow-list mt-6 text-sm text-ink-soft">
              <li>Mūlāṅka, bhāgyāṅka, nāmāṅka — compound and root kept separately</li>
              <li>Lo Shu grid with the standard placement, planes, missing and amplified digits</li>
              <li>Harmony triangle, lucky elements, gemstone, mantra, direction</li>
              <li>Kua with both century branches and the eight directions</li>
              <li>Bhūtasaṅkhyā, kaṭapayādi and the 108 nāmākṣara syllables</li>
            </ul>
          </div>

          <div className="lg:pt-2">
            <div className="rounded-xl border border-line bg-surface p-6 sm:p-7 shadow-3d-card">
              <p className="plate-cap">A reading, in full</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-5xl font-bold text-ink tabular-nums">2</span>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">Mūlāṅka</p>
                  <p className="font-serif text-lg font-bold text-ink">The Moon</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">
                Receptivity. Number 2 reads a room before anyone speaks, and pays for it with a mind
                that will not settle at night.
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-xs">
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Day</p>
                  <p className="mt-0.5 text-ink">Monday</p>
                </div>
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Stone</p>
                  <p className="mt-0.5 text-ink">pearl (mauktika)</p>
                </div>
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Mantra</p>
                  <p className="mt-0.5 text-ink">Om Somāya Namaḥ</p>
                </div>
                <div>
                  <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-muted">Direction</p>
                  <p className="mt-0.5 text-ink">north-west</p>
                </div>
              </div>
              <p className="mt-4 border-t border-line pt-3 text-[11px] leading-relaxed text-ink-muted">
                Correspondences are classical navagraha material. The character reading is a summary
                of the modern literature, marked <em>attributed</em> in the provenance registry.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Ornament glyph="॥" />

      {/* ── The refusal ────────────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pb-20">
        <div className="kicker">
          <span className="n">III</span>
          <span>Where the platform stops</span>
        </div>
        <h2 className="h2-ed mt-5 max-w-3xl">
          It will not print a figure whose rule it cannot name.
        </h2>
        <p className="lede mt-4">
          The digit-to-planet pairing has no classical Sanskrit citation — none has been found in the
          texts examined. So the platform says so, on the page where the pairing is used, rather than
          dressing a 1926 London table in Vedic robes.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/library" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-[0.16em] text-ink hover:border-copper/50 transition-colors">
            Source library
          </Link>
          <Link href="/engine" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-[0.16em] text-ink hover:border-copper/50 transition-colors">
            Engine tables
          </Link>
        </div>
      </section>
    </div>
  );
}
