import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <p className="font-serif text-7xl font-bold text-copper/25 tabular-nums">404</p>
        <h1 className="mt-3 text-2xl font-serif font-bold text-ink">This number is not in the table</h1>
        <p className="mt-2 text-sm text-ink-soft">The page you asked for does not exist. The workspace does.</p>
        <Link href="/workspace" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink text-surface text-[11px] font-mono font-semibold uppercase tracking-wider hover:bg-copper-dark">
          Open workspace
        </Link>
      </div>
    </div>
  );
}
