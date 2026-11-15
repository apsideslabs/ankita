import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Github, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About',
  description: 'Aṅkita is a numerology workspace by Apsides Labs that computes in the open and names every source.',
};

export default function AboutPage() {
  return (
    <div className="band band-pad">
      <div className="max-w-3xl">
        <div className="kicker"><span className="n">About</span></div>
        <h1 className="page-title mt-4">Aṅkita</h1>
        <p className="mt-2 font-serif text-xl text-ink-soft">{SITE_CONFIG.devanagari} — {SITE_CONFIG.meaning}</p>
        <p className="mt-4 text-ink-soft leading-relaxed">
          Aṅkita is the numerology member of the Apsides Labs family: <strong className="text-ink">Gaṇaka</strong> computes
          the chart, <strong className="text-ink">Phalita</strong> reads it, and Aṅkita reads the number. All three share one
          principle — a figure may be printed only if the rule behind it can be named.
        </p>
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {[
          { icon: ShieldCheck, title: 'Sourced, not asserted', body: 'Every rule carries a date and an author. Where a source is missing, the interface says so rather than filling the gap.' },
          { icon: Layers, title: 'Three layers, named', body: 'Chaldean arithmetic, Indian graha-numerology and the Chinese Lo Shu grid are kept apart, because they are three different things.' },
          { icon: Sparkles, title: 'Computed locally', body: 'The engine is a pure function in your browser. Nothing is uploaded, and the same input always gives the same output.' },
        ].map((c) => (
          <div key={c.title} className="rounded-xl border border-line bg-surface p-6 shadow-3d-card">
            <c.icon className="w-5 h-5 text-copper" />
            <h2 className="mt-3 font-serif text-lg font-bold text-ink">{c.title}</h2>
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6">
          <h2 className="font-serif text-xl font-bold text-ink">What it will not do</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>· Claim a Vedic pedigree for a twentieth-century table.</li>
            <li>· Present a Chinese grid or a Feng Shui number as Indian.</li>
            <li>· Promise an outcome. The engine computes; the reading is yours.</li>
            <li>· Hide a formula. The whole engine is in <code className="font-mono text-xs bg-canvas px-1 py-0.5 rounded">lib/engine</code>.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-line bg-surface p-6">
          <h2 className="font-serif text-xl font-bold text-ink">Technical</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            <li>· Next.js 15 · React 19 · TypeScript · Tailwind CSS v4.</li>
            <li>· Engine: pure TypeScript, no dependencies, deterministic.</li>
            <li>· Tests: <code className="font-mono text-xs bg-canvas px-1 py-0.5 rounded">npm test</code> — the suite checks the engine against the sources&rsquo; own worked examples.</li>
            <li>· Licence: MIT. Sources remain the property of their authors.</li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={SITE_CONFIG.repo} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-wider text-ink hover:border-copper/40">
              <Github className="w-3.5 h-3.5" /> Repository
            </a>
            <Link href="/method" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-wider text-ink hover:border-copper/40">
              Method
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-line bg-surface p-7">
        <h2 className="font-serif text-2xl font-bold text-ink">The family</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { name: 'Gaṇaka', what: 'Jyotiṣa calculation engine', href: 'https://github.com/apsideslabs/ganaka' },
            { name: 'Phalita', what: 'Structured predictions', href: 'https://github.com/apsideslabs/phalita' },
            { name: 'Aṅkita', what: 'Numerology', href: SITE_CONFIG.repo },
          ].map((p) => (
            <a key={p.name} href={p.href} className="rounded-lg border border-line p-4 hover:border-copper/40 transition-colors">
              <p className="font-serif text-lg font-bold text-ink">{p.name}</p>
              <p className="mt-1 text-xs text-ink-soft">{p.what}</p>
            </a>
          ))}
        </div>
        <Link href="/workspace" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark">
          Open the workspace <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
