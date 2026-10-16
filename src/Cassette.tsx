const INK = '#1d1a17'
const LIME = '#f1e9db'

function Hub({ cx, cy, cls }: { cx: number; cy: number; cls: string }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <circle className={`${cls}-tape`} r="38" fill="#4a3a2e" />
      <g className={`${cls}-spin`}>
        <circle r="24" fill={LIME} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect key={a} x="-3.5" y="-24" width="7" height="11" fill={INK} transform={`rotate(${a})`} />
        ))}
        <circle r="9" fill={INK} />
      </g>
    </g>
  )
}

export function Cassette() {
  return (
    <svg className="cassette-svg" viewBox="0 0 440 272" role="img" aria-label="Cassette tape for the finished interiors">
      <rect width="440" height="272" rx="26" fill="#2a2622" />
      <rect x="3" y="3" width="434" height="266" rx="23" fill="none" stroke="#fff" strokeOpacity=".09" strokeWidth="2" />
      {[[24, 24], [416, 24], [24, 248], [416, 248]].map(([x, y]) => (
        <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
          <circle r="8" fill="#38332e" />
          <path d="M-4.5-4.5 4.5 4.5M4.5-4.5-4.5 4.5" stroke="#1a1714" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <rect x="36" y="30" width="368" height="166" rx="14" fill={LIME} />
      <text x="56" y="58" fontSize="12" fontWeight="700" letterSpacing="2.2" fill={INK} fontFamily="Hanken Grotesk Variable, sans-serif">VEEDU STUDIO</text>
      <text x="56" y="90" fontSize="30" fill={INK} fontFamily="Instrument Serif, serif">Interiors, 2025 to 26</text>
      <rect x="326" y="42" width="66" height="24" rx="12" fill={INK} />
      <text x="359" y="58.5" fontSize="11" fontWeight="700" letterSpacing="1.4" textAnchor="middle" fill={LIME} fontFamily="Hanken Grotesk Variable, sans-serif">SIDE A</text>
      <rect x="36" y="116" width="368" height="9" fill="#a4452a" />
      <rect x="36" y="129" width="368" height="9" fill="#e7b85c" />
      <rect x="36" y="142" width="368" height="9" fill="#6f7d62" />
      <rect x="86" y="104" width="268" height="86" rx="43" fill={INK} />
      <Hub cx={146} cy={147} cls="reel-l" />
      <Hub cx={294} cy={147} cls="reel-r" />
      <rect x="192" y="124" width="56" height="46" rx="6" fill="#2e2a26" stroke="#fff" strokeOpacity=".14" />
      <path d="M208 128v38M220 128v38M232 128v38" stroke="#fff" strokeOpacity=".18" strokeWidth="1.5" />
      <path d="M70 208H370L398 272H42Z" fill="#1c1916" />
      <circle cx="108" cy="240" r="7" fill="#0e0c0a" /><circle cx="332" cy="240" r="7" fill="#0e0c0a" />
      <rect x="194" y="246" width="52" height="26" rx="4" fill="#0e0c0a" />
    </svg>
  )
}
