'use client';

type Rel = 'friend' | 'neutral' | 'enemy';

const EDGE: Record<Rel, string> = {
  friend: '#15803d',
  neutral: '#b45309',
  enemy: '#8B2F0B',
};

/** The harmony triangle: mūlāṅka, bhāgyāṅka and nāmāṅka at the vertices. */
export function HarmonyTriangle({
  m, b, n, ab, bn, ma,
}: { m: number; b: number; n: number; ab: Rel; bn: Rel; ma: Rel }) {
  const V = { top: [150, 34], left: [34, 214], right: [266, 214] } as const;
  const mid = (p: readonly number[], q: readonly number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const edges = [
    { a: V.top, b: V.left, rel: ab, label: `${m}·${b}`, pos: mid(V.top, V.left) },
    { a: V.left, b: V.right, rel: bn, label: `${b}·${n}`, pos: [150, 214] },
    { a: V.right, b: V.top, rel: ma, label: `${n}·${m}`, pos: mid(V.right, V.top) },
  ] as const;

  return (
    <svg viewBox="0 0 300 260" className="w-full max-w-[300px]" role="img"
      aria-label={`Harmony triangle: ${m} with ${b} ${ab}, ${b} with ${n} ${bn}, ${n} with ${m} ${ma}`}>
      {edges.map((e, i) => (
        <g key={i}>
          <line x1={e.a[0]} y1={e.a[1]} x2={e.b[0]} y2={e.b[1]} stroke={EDGE[e.rel]} strokeWidth="1.6" strokeOpacity="0.85" />
          <text x={e.pos[0]} y={e.pos[1] - 6} textAnchor="middle" fontSize="8.5"
            fontFamily="var(--font-mono)" fill={EDGE[e.rel]} letterSpacing="1">{e.label}</text>
        </g>
      ))}
      {[
        { p: V.top, v: m, l: 'Mūlāṅka' },
        { p: V.left, v: b, l: 'Bhāgyāṅka' },
        { p: V.right, v: n, l: 'Nāmāṅka' },
      ].map((x) => (
        <g key={x.l}>
          <circle cx={x.p[0]} cy={x.p[1]} r="21" fill="#FCFAF6" stroke="#BCB4A4" />
          <text x={x.p[0]} y={x.p[1] + 6} textAnchor="middle" fontSize="17" fontWeight="600"
            fontFamily="var(--font-serif)" fill="#171614">{x.v}</text>
          <text x={x.p[0]} y={x.p[1] + (x.l === 'Mūlāṅka' ? -30 : 38)} textAnchor="middle" fontSize="7"
            fontFamily="var(--font-mono)" letterSpacing="1.4" fill="#847E72">{x.l.toUpperCase()}</text>
        </g>
      ))}
    </svg>
  );
}
