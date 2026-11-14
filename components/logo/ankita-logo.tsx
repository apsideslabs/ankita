import Link from 'next/link';

export function AnkitaMark({ size = 34, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aṅkita emblem"
      className={`inline-block shrink-0 ${className}`}
    >
      <rect x="1.5" y="1.5" width="41" height="41" rx="3" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
      <path d="M15.2 1.5V42.5M28.8 1.5V42.5M1.5 15.2H42.5M1.5 28.8H42.5" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" />
      <circle cx="22" cy="22" r="4.6" fill="currentColor" />
      <circle cx="8.4" cy="8.4" r="1.7" fill="currentColor" fillOpacity="0.55" />
      <circle cx="35.6" cy="35.6" r="1.7" fill="currentColor" fillOpacity="0.55" />
      <circle cx="35.6" cy="8.4" r="1.7" fill="currentColor" fillOpacity="0.35" />
      <circle cx="8.4" cy="35.6" r="1.7" fill="currentColor" fillOpacity="0.35" />
    </svg>
  );
}

export function AnkitaLogo({ size = 'md', isLink = true }: { size?: 'sm' | 'md' | 'lg'; isLink?: boolean }) {
  const dims = size === 'sm' ? 26 : size === 'lg' ? 44 : 34;
  const body = (
    <span className="inline-flex items-center gap-2.5 select-none">
      <AnkitaMark size={dims} className="text-copper" />
      <span className="flex flex-col leading-none">
        <span className="font-serif font-bold tracking-tight text-ink" style={{ fontSize: size === 'lg' ? 24 : size === 'sm' ? 15 : 18 }}>
          Aṅkita
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted mt-1">
          {size === 'sm' ? 'aṅkita' : 'अङ्कित · number'}
        </span>
      </span>
    </span>
  );
  if (!isLink) return body;
  return (
    <Link href="/" aria-label="Aṅkita — home" className="inline-flex items-center hover:opacity-90 transition-opacity">
      {body}
    </Link>
  );
}
