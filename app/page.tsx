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
      {/* ── Masthead: headline left, console right, full width ─── */}
      <section className="band band-pad pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 xl:gap-20 items-start">
          <div>
            <h1 className="masthead-name">Aṅkita<span className="dot">.</span></h1>
            <p className="hero-claim">
              Numerology with the receipts — <span>three traditions kept apart, every figure dated to the book it came from.</span>
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/workspace" className="action-slab inline-flex items-center gap-2 px-6 py-3 rounded-md text-[11px] font-mono font-semibold uppercase tracking-[0.16em] transition-colors btn-press">
                Open the workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/method" className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-line-strong text-[11px] font-mono font-semibold uppercase tracking-[0.16em] text-ink hover:border-copper/50 transition-colors">
                Read the method
              </Link>
            </div>

            <div className="topics mt-8">
              <span className="topics-label">Filed under</span>
              {[['Chaldean', '/method'], ['Graha', '/method'], ['Lo Shu', '/method'], ['Sanskrit', '/tools'], ['AA System', '/aa']].map(([label, href]) => (
                <Link key={label} href={href} className="chip">{label}</Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="plate-cap">Fig. 1 — reading console</span>
              <span className="plate-cap">computes locally</span>
            </div>
            <HomeConsole />
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-[11px] text-ink-soft">
              {['Mūlāṅka · bhāgyāṅka · nāmāṅka', 'Compound 10–52', 'Lo Shu grid and planes',
                'Vimśottarī daśā', 'Graha positions and gochara', 'The AA System, C1–C15'].map((x) => (
                <li key={x} className="flex gap-2 border-t border-line pt-1.5">
                  <span className="text-copper">→</span>{x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Dark band: the statement and the counts ────────────── */}
      <section className="band band-dark mt-14 py-12">
        <div className="band-pad grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <p className="statement" style={{ color: '#F2EDE3', margin: 0 }}>
            Every claim sourced. <em style={{ color: '#E08A5B' }}>Every number checked.</em>
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-5">
            {[
              ['Sources dated', '11'],
              ['Rules', '38'],
              ['Tables', '9'],
              ['Tests', '56'],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em]" style={{ color: 'rgba(242,237,227,.55)' }}>{label}</dt>
                <dd className="mt-1 font-serif text-3xl font-semibold" style={{ color: '#F2EDE3' }}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Ornament glyph="अं" />

      {/* ── The three layers, as an index ──────────────────────── */}
      <section className="band band-pad">
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
      <section className="band band-pad">
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
