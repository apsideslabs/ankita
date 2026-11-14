import Link from 'next/link';
import { ArrowRight, BookOpen, Layers, ShieldCheck, Compass, Grid3x3, Calculator, Fingerprint } from 'lucide-react';
import { HomeConsole } from '@/components/home/HomeConsole';
import { SITE_CONFIG } from '@/lib/site-config';

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative isolate w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14 pb-12">
        <div className="absolute inset-0 -z-10 opacity-[0.35] grid-watermark [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-copper ring-4 ring-copper/15 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-ink font-semibold">
                Numerology workstation
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              <span>3 layers</span><span className="text-line-strong">•</span>
              <span>4 notation systems</span><span className="text-line-strong">•</span>
              <span>every rule dated</span>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-copper/25 bg-copper-wash text-copper text-xs font-serif font-semibold">
              {SITE_CONFIG.devanagari} — {SITE_CONFIG.meaning}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-ink leading-[1.08]">
              Every number,<br className="hidden sm:block" /> with its source.
            </h1>
            <p className="text-base sm:text-lg text-ink-soft leading-relaxed max-w-2xl">
              {SITE_CONFIG.description}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/workspace" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark transition-colors btn-press">
              Open the workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link href="/method" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-line-strong bg-surface text-[11px] font-mono font-semibold uppercase tracking-wider text-ink hover:border-copper/40 transition-colors">
              <BookOpen className="w-3.5 h-3.5 text-copper" /> Read the method
            </Link>
            <Link href="/tools" className="ml-auto text-[11px] font-mono uppercase tracking-wider text-ink-soft hover:text-copper transition-colors">
              Sanskrit decoders →
            </Link>
          </div>
        </div>

        <div className="mt-10 max-w-5xl">
          <HomeConsole />
        </div>
      </section>

      {/* Three layers */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 border-t border-line">
        <div className="max-w-3xl">
          <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-copper">What the numbers are made of</p>
          <h2 className="mt-2 text-3xl font-serif font-bold text-ink">Three traditions, named separately</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">
            Most numerology merges a 1926 London letter table, a 1990 Indian graha scheme and a Chinese
            number square, then calls the result ancient. Aṅkita keeps them apart and prints which one
            produced each figure.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Fingerprint, kicker: '1926 · London', title: 'Chaldean arithmetic', body: 'Letter values, the compound numbers 10–52, and single-digit reduction. Verified against Cheiro’s own worked example.', layer: 'Chaldean' },
            { icon: Layers, kicker: '1990 · India', title: 'Graha-numerology', body: 'Nine digits for nine grahas, with Rāhu at 4 and Ketu at 7 — the substitution the Indian form makes to Cheiro’s Uranus and Neptune.', layer: 'Graha' },
            { icon: Grid3x3, kicker: 'Chinese', title: 'The Lo Shu square', body: 'Placement, missing and repeated digits, plane completion. Labelled Chinese because that is what it is.', layer: 'Lo Shu' },
          ].map((f) => (
            <article key={f.title} className="rounded-xl border border-line bg-surface p-6 shadow-3d-card">
              <f.icon className="w-5 h-5 text-copper" />
              <p className="mt-4 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">{f.kicker}</p>
              <h3 className="mt-1 text-lg font-serif font-bold text-ink">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-14 border-t border-line">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-copper">Inside the engine</p>
            <h2 className="mt-2 text-3xl font-serif font-bold text-ink">Deterministic, and open to inspection</h2>
            <p className="mt-3 text-ink-soft leading-relaxed">
              One pure function takes a name and a date and returns everything: three core numbers, the
              grid, the friendships, the timing cycles and the provenance list. No network, no model, no
              hidden step.
            </p>
            <Link href="/workspace" className="mt-5 inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-copper hover:text-copper-dark">
              Try it <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: Calculator, title: 'Core numbers', body: 'Mūlāṅka, bhāgyāṅka, nāmāṅka, with compound and root kept separately.' },
              { icon: Grid3x3, title: 'Lo Shu grid', body: 'Nine cells, eight lines, missing and amplified digits.' },
              { icon: Compass, title: 'Kua number', body: 'Both branches — 1900s and 2000s — with the Kua 5 defaults.' },
              { icon: BookOpen, title: 'Sanskrit decoders', body: 'Bhūtasaṅkhyā, kaṭapayādi and the 108 nāmākṣara syllables.' },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-line bg-surface p-5 shadow-3d-card">
                <c.icon className="w-4.5 h-4.5 text-copper" />
                <h3 className="mt-3 text-sm font-serif font-bold text-ink">{c.title}</h3>
                <p className="mt-1.5 text-xs text-ink-soft leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refusal */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pb-16">
        <div className="rounded-2xl border border-line bg-surface p-7 sm:p-9 shadow-3d-card">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-6 h-6 text-copper shrink-0 mt-0.5" />
            <div>
              <h2 className="text-2xl font-serif font-bold text-ink">What the engine refuses to do</h2>
              <p className="mt-2 text-ink-soft leading-relaxed max-w-3xl">
                It will not print a figure whose rule it cannot name. The digit-to-graha pairing has no
                classical Sanskrit citation — none has been found — so the platform says so, in the
                interface, on the page where the pairing is used.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/library" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-wider text-ink hover:border-copper/40">
                  Source library
                </Link>
                <Link href="/about" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-wider text-ink hover:border-copper/40">
                  About Aṅkita
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
