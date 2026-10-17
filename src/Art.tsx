import type { PlanRoom, RoomKind } from './data'

const INK = '#14201b'

export function HouseArt({ slice = false }: { slice?: boolean }) {
  const wins: [number, number, number, number][] = [
    [100, 262, 44, 50], [276, 262, 44, 50], [104, 352, 46, 48], [270, 352, 46, 48], [398, 292, 40, 50], [476, 292, 40, 50],
  ]
  return (
    <svg viewBox="0 0 600 500" role="img" aria-label="Illustration of a sloped-roof Kerala house with a deep verandah and lit windows" preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'} className="art">
      <rect width="600" height="500" fill="#d9e6dc" />
      <circle cx="498" cy="96" r="48" fill="#f0a81c" />
      <rect y="420" width="600" height="80" fill="#b9c4a4" />
      <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
        <rect x="330" y="255" width="215" height="165" fill="#f8f3e9" />
        <polygon points="312,262 438,168 564,262" fill="#8c3a22" />
        <rect x="60" y="232" width="300" height="188" fill="#f8f3e9" />
        <polygon points="26,240 210,104 394,240" fill="#a4452a" />
        <g strokeWidth="1.5" opacity=".45">
          <line x1="210" y1="104" x2="210" y2="240" /><line x1="150" y1="150" x2="106" y2="240" /><line x1="270" y1="150" x2="314" y2="240" />
          <line x1="438" y1="168" x2="438" y2="262" /><line x1="380" y1="212" x2="352" y2="262" /><line x1="496" y1="212" x2="524" y2="262" />
        </g>
        <rect x="48" y="322" width="324" height="12" fill="#5b3a29" />
        <path d="M187 420V372a23 23 0 0 1 46 0V420Z" fill="#6a3f26" />
        {wins.map(([x, y, w, h], i) => (
          <g key={i}>
            <rect className="win" style={{ ['--i' as string]: i }} x={x} y={y} width={w} height={h} />
            <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} strokeWidth="1.6" />
            <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} strokeWidth="1.6" />
          </g>
        ))}
        {[70, 160, 250, 340].map((x) => (
          <rect key={x} x={x} y="334" width="10" height="86" fill="#cdbb9a" />
        ))}
        <rect x="166" y="420" width="88" height="10" fill="#cdbb9a" />
      </g>
      <g fill="none" stroke="#5f6e52" strokeWidth="7" strokeLinecap="round" transform="translate(-34 0)">
        <path d="M572 420C566 360 574 300 566 236" stroke="#6a4b34" strokeWidth="9" />
        <path d="M566 236C540 214 520 218 500 232" /><path d="M566 236C546 200 526 196 506 202" />
        <path d="M566 236C592 214 612 220 628 236" /><path d="M566 236C586 198 606 196 624 204" />
        <path d="M566 236C566 210 566 196 566 180" />
      </g>
    </svg>
  )
}

export function RoomArt({ kind }: { kind: RoomKind }) {
  if (kind === 'villa') return <HouseArt slice />
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Illustration of a ${kind} interior`} preserveAspectRatio="xMidYMid slice" className="art">
      {kind === 'living' && (
        <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <rect width="400" height="300" fill="#dde5d2" />
          <rect y="214" width="400" height="86" fill="#b98a5a" />
          <rect x="40" y="36" width="116" height="124" fill="#cfe0d8" /><line x1="98" y1="36" x2="98" y2="160" strokeWidth="1.8" /><line x1="40" y1="98" x2="156" y2="98" strokeWidth="1.8" />
          <rect x="210" y="52" width="76" height="56" fill="#a4452a" /><rect x="224" y="64" width="48" height="32" fill="#f0a81c" />
          <ellipse cx="260" cy="262" rx="130" ry="22" fill="#d6c3a0" />
          <rect x="176" y="124" width="190" height="52" rx="12" fill="#6f7d62" />
          <rect x="166" y="150" width="210" height="62" rx="12" fill="#7f8e72" />
          <rect x="166" y="150" width="26" height="62" rx="10" fill="#6f7d62" /><rect x="350" y="150" width="26" height="62" rx="10" fill="#6f7d62" />
          <line x1="64" y1="212" x2="64" y2="150" /><path d="M46 150h36l-8-32H54Z" fill="#f0a81c" />
          <rect x="204" y="226" width="110" height="18" rx="4" fill="#7a5238" />
        </g>
      )}
      {kind === 'kitchen' && (
        <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <rect width="400" height="300" fill="#e3ebdc" />
          <rect y="236" width="400" height="64" fill="#cdbb9a" />
          <rect x="16" y="34" width="150" height="76" fill="#3f5a4b" /><rect x="234" y="34" width="150" height="76" fill="#3f5a4b" />
          <line x1="91" y1="34" x2="91" y2="110" strokeWidth="1.8" /><line x1="309" y1="34" x2="309" y2="110" strokeWidth="1.8" />
          <path d="M166 110h68l-12-40h-44Z" fill="#c9c2b4" /><rect x="190" y="30" width="20" height="40" fill="#c9c2b4" />
          <rect x="16" y="168" width="368" height="14" fill="#ddd6c8" />
          <rect x="16" y="182" width="368" height="78" fill="#4a6b58" />
          {[16, 108, 200, 292].map((x) => <rect key={x} x={x} y="182" width="92" height="78" fill="none" strokeWidth="1.8" />)}
          <rect x="180" y="146" width="40" height="22" rx="4" fill="#d6603a" />
          <circle cx="86" cy="278" r="12" fill="#a4452a" /><circle cx="316" cy="278" r="12" fill="#a4452a" />
        </g>
      )}
      {kind === 'bedroom' && (
        <g stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <rect width="400" height="300" fill="#d8e0d0" />
          <rect y="226" width="400" height="74" fill="#b98a5a" />
          <line x1="200" y1="0" x2="200" y2="44" /><path d="M170 76a30 30 0 0 1 60 0Z" fill="#f0a81c" />
          <rect x="100" y="84" width="200" height="118" rx="10" fill="#7a5238" />
          <rect x="84" y="174" width="232" height="66" rx="8" fill="#f6f1e7" />
          <rect x="108" y="150" width="76" height="36" rx="10" fill="#fffdf8" /><rect x="216" y="150" width="76" height="36" rx="10" fill="#fffdf8" />
          <rect x="84" y="202" width="232" height="40" rx="6" fill="#a4452a" />
          <rect x="30" y="196" width="40" height="44" fill="#cdbb9a" /><rect x="330" y="196" width="40" height="44" fill="#cdbb9a" />
          <rect x="34" y="166" width="32" height="30" rx="4" fill="#6f7d62" />
        </g>
      )}
    </svg>
  )
}

export function PlanArt({ rooms, name }: { rooms: PlanRoom[]; name: string }) {
  return (
    <svg viewBox="0 0 200 130" role="img" aria-label={`Floor plan of ${name}`} className="plan">
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#6f7d62" strokeWidth="1.4" />
        </pattern>
      </defs>
      {rooms.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={r.court ? 'url(#hatch)' : r.label.startsWith('Plot') ? '#cfd7c3' : r.label === 'Approved plan' ? '#f8f3e9' : '#f8f3e9'} stroke={INK} strokeWidth={r.label.startsWith('Plot') ? 2.2 : 1.6} strokeDasharray={r.label === 'Approved plan' ? '5 3' : undefined} />
          <text x={r.x + r.w / 2} y={r.label.startsWith('Plot') ? r.y + 12 : r.y + r.h / 2 + 2.5} textAnchor="middle" fontSize="7.5" fill={INK} fontWeight="600">{r.label}</text>
        </g>
      ))}
    </svg>
  )
}
