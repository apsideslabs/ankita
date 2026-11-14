'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';
import { AnkitaLogo } from '@/components/logo/ankita-logo';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full bg-canvas/95 backdrop-blur-sm border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <AnkitaLogo />

        <nav aria-label="Main" className="hidden md:flex items-center gap-1 lg:gap-5">
          {SITE_CONFIG.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className={`relative px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.14em] transition-colors ${
                isActive(item.href) ? 'text-ink font-bold' : 'text-ink-soft hover:text-ink'
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-copper" />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-line rounded-md text-[10px] font-mono uppercase tracking-wider text-ink-soft">
            <ShieldCheck className="w-3.5 h-3.5 text-copper" />
            Sourced
          </span>
          <Link
            href="/workspace"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark transition-colors btn-press"
          >
            Open workspace
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md border border-line text-ink hover:bg-subtle transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/50"
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-canvas border-l border-line p-6 flex flex-col justify-between animate-rise">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-line">
                <AnkitaLogo size="sm" isLink={false} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-1.5 rounded-md border border-line text-ink-soft hover:bg-subtle"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
              <nav className="mt-5 flex flex-col" aria-label="Mobile">
                {SITE_CONFIG.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-3 py-3 rounded-md text-sm transition-colors ${
                      isActive(item.href)
                        ? 'bg-subtle text-ink font-semibold border-l-2 border-copper'
                        : 'text-ink-soft hover:bg-subtle hover:text-ink'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive(item.href) && <span className="w-1.5 h-1.5 rounded-full bg-copper" />}
                  </Link>
                ))}
              </nav>
              <div className="pt-5 mt-5 border-t border-line">
                <Link
                  href="/workspace"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-ink text-surface text-xs font-mono uppercase tracking-wider"
                >
                  Open workspace
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="pt-5 border-t border-line text-xs text-ink-soft">
              <p className="font-medium text-ink">Aṅkita — {SITE_CONFIG.meaning}</p>
              <p className="mt-1">Every figure carries its citation.</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
