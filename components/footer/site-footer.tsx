import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/site-config';
import { AnkitaMark } from '@/components/logo/ankita-logo';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <AnkitaMark size={28} className="text-copper" />
              <span className="font-serif text-lg font-bold text-ink">Aṅkita</span>
            </div>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed max-w-xs">
              {SITE_CONFIG.tagline} A numerology workspace where each rule is dated and each layer is named.
            </p>
            <p className="mt-4 text-[11px] font-mono uppercase tracking-wider text-ink-muted">
              {SITE_CONFIG.family}
            </p>
          </div>
          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-muted">Platform</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              {SITE_CONFIG.nav.map((n) => (
                <li key={n.href}><Link href={n.href} className="hover:text-copper transition-colors">{n.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-muted">Sources</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>Cheiro, <em>Book of Numbers</em> (1926)</li>
              <li>Johari, <em>Numerology</em> (1990)</li>
              <li>Ojha, <em>Aṅk-Vidyā</em></li>
              <li>Piṅgala; Haridatta (683 CE)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-mono uppercase tracking-[0.16em] text-ink-muted">Elsewhere</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li><a href={SITE_CONFIG.repo} className="hover:text-copper transition-colors">Repository</a></li>
              <li><a href="https://github.com/apsideslabs/ganaka" className="hover:text-copper transition-colors">Gaṇaka</a></li>
              <li><a href="https://github.com/apsideslabs/phalita" className="hover:text-copper transition-colors">Phalita</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} Apsides Labs. Computed locally in your browser; nothing is uploaded.
          </p>
          <p className="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            Deterministic · Auditable · Offline
          </p>
        </div>
      </div>
    </footer>
  );
}
