import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const W = { paper: '#f6f7f1', teal: '#9fd0c0', sun: '#f6d58a', clay: '#e0a184', sage: '#bccaa6', water: '#8cc7c0', stone: '#c9cdc2', wood: '#d9b27c', glass: '#cfe6e0' }

type P = [number, number]
const pts = (a: P[]) => a.map((p) => p.join(',')).join(' ')

// isometric helpers for the villa
const iso = (x: number, y: number, z: number): P => [150 + (x - y) * 12.5, 70 + (x + y) * 7.2 - z * 13]
function box(x0: number, y0: number, z0: number, w: number, d: number, h: number, fills: [string, string, string]) {
  const z1 = z0 + h
  return (
    <g>
      <polygon className="wash" fill={fills[1]} points={pts([iso(x0, y0 + d, z0), iso(x0 + w, y0 + d, z0), iso(x0 + w, y0 + d, z1), iso(x0, y0 + d, z1)])} />
      <polygon className="wash" fill={fills[2]} points={pts([iso(x0 + w, y0, z0), iso(x0 + w, y0 + d, z0), iso(x0 + w, y0 + d, z1), iso(x0 + w, y0, z1)])} />
      <polygon className="wash" fill={fills[0]} points={pts([iso(x0, y0, z1), iso(x0 + w, y0, z1), iso(x0 + w, y0 + d, z1), iso(x0, y0 + d, z1)])} />
      <polygon className="ink" points={pts([iso(x0, y0 + d, z0), iso(x0 + w, y0 + d, z0), iso(x0 + w, y0, z0)])} fill="none" />
      <polygon className="ink" points={pts([iso(x0, y0 + d, z0), iso(x0, y0 + d, z1), iso(x0, y0, z1), iso(x0 + w, y0, z1), iso(x0 + w, y0, z0)])} fill="none" />
      <polyline className="ink" points={pts([iso(x0, y0 + d, z1), iso(x0 + w, y0 + d, z1), iso(x0 + w, y0, z1)])} fill="none" />
      <line className="ink" x1={iso(x0 + w, y0 + d, z0)[0]} y1={iso(x0 + w, y0 + d, z0)[1]} x2={iso(x0 + w, y0 + d, z1)[0]} y2={iso(x0 + w, y0 + d, z1)[1]} />
    </g>
  )
}

function Townhouse() {
  const plants: P[] = [[78, -26], [102, -32], [140, -30], [170, -26]]
  const floor = (dy: number, k: string) => (
    <g key={k} transform={`translate(0 ${dy})`}>
      <path className="wash" d="M64 192V142Q64 108 104 108Q144 108 144 142V192Z" fill={W.teal} />
      <circle className="wash" cx="174" cy="142" r="13" fill={W.sun} />
      <path className="ink" d="M64 192V142Q64 108 104 108Q144 108 144 142V192Z" fill="none" />
      {[76, 88, 100, 112, 124, 134].map((x) => <line key={x} className="ink thin" x1={x} y1={x < 80 || x > 128 ? 128 : 112} x2={x} y2="192" />)}
      <circle className="ink" cx="174" cy="142" r="13" fill="none" />
      <path className="ink thin" d="M164 142H184M174 132V152" />
      <rect className="ink" x="42" y="190" width="162" height="9" rx="4" fill="none" />
    </g>
  )
  return (
    <svg viewBox="0 -46 240 442" aria-hidden="true">
      <g className="rough">
        <ellipse className="wash" cx="120" cy="376" rx="112" ry="8" fill={W.sage} />
        <path className="wash" d="M72 372V268Q72 216 120 216Q168 216 168 268V372Z" fill={W.clay} />
        <rect className="wash" x="30" y="352" width="38" height="20" fill={W.sun} />
        {plants.map(([x, y], i) => <circle key={i} className="wash" cx={x} cy={y} r={11 + (i % 2) * 3} fill={W.sage} />)}
        {floor(0, 'f2')}
        {floor(-98, 'f3')}

        <path className="ink" d="M10 372H232" />
        <path className="ink" d="M48 372V-8M196 372V-8" />
        <rect className="ink" x="36" y="-10" width="180" height="16" rx="8" fill="none" />
        <path className="ink" d="M62 -10V-36H190V-10" />
        {plants.map(([x, y], i) => <circle key={i} className="ink" cx={x} cy={y} r={11 + (i % 2) * 3} fill="none" />)}
        <path className="ink" d="M72 372V268Q72 216 120 216Q168 216 168 268V372Z" fill="none" />
        {[84, 96, 108, 120, 132, 144, 156].map((x) => <line key={x} className="ink thin" x1={x} y1={x < 90 || x > 150 ? 250 : 232} x2={x} y2="372" />)}
        <rect className="ink" x="30" y="352" width="38" height="20" fill="none" />
        <path className="ink" d="M36 352Q38 338 48 340Q52 330 60 342Q66 346 64 352" fill="none" />
        <path className="ink" d="M24 372Q30 300 20 246" />
        <path className="ink" d="M20 246Q4 244 -4 256M20 246Q10 230 -2 232M20 246Q30 228 46 230M20 246Q36 244 48 256M20 246Q22 228 22 216" />
        <path className="ink thin" d="M208 372V120H234V372M208 150H234M208 180H234M208 210H234M208 240H234M208 270H234M208 300H234" />
      </g>
    </svg>
  )
}

function Villa() {
  const wall: P[] = []
  for (let i = 0; i <= 14; i++) { const t = i / 14; wall.push(iso(1.8 + t * 5.4, 1.2 + 0.9 * Math.sin(t * Math.PI * 1.6), 4.3)) }
  const wallTop = wall.map(([x, y]) => [x, y - 17] as P)
  const cyl = (cx: number, cy: number, r: number) => {
    const [x, y] = iso(cx, cy, 4.3), [, y2] = iso(cx, cy, 5.6)
    return (
      <g key={cx}>
        <path className="wash" d={`M${x - r * 2.3} ${y}V${y2}A${r * 2.3} ${r * 1.3} 0 0 1 ${x + r * 2.3} ${y2}V${y}A${r * 2.3} ${r * 1.3} 0 0 1 ${x - r * 2.3} ${y}Z`} fill={W.paper} />
        <ellipse className="ink" cx={x} cy={y2} rx={r * 2.3} ry={r * 1.3} fill={W.stone} />
        <path className="ink" d={`M${x - r * 2.3} ${y2}V${y}A${r * 2.3} ${r * 1.3} 0 0 0 ${x + r * 2.3} ${y}V${y2}`} fill="none" />
      </g>
    )
  }
  const bandA = iso(1, 5, 2.9), bandB = iso(7, 5, 3.5)
  return (
    <svg viewBox="25 0 250 225" aria-hidden="true">
      <g className="rough">
        <polygon className="wash" fill={W.sage} points={pts([iso(-3, -2, 0), iso(11, -2, 0), iso(11, 9, 0), iso(-3, 9, 0)])} />
        {[[0, 6], [2.7, 6], [5.3, 6], [8, 6], [8, 3], [8, 0]].map(([x, y]) => {
          const a = iso(x, y, 0), b = iso(x, y, 2)
          return <line key={`${x}${y}`} className="ink" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        })}
        {box(1, 1, 2.5, 6, 4, 1.4, [W.paper, W.glass, W.teal])}
        {[1.8, 2.6, 3.4, 4.2, 5, 5.8, 6.6].map((x) => {
          const a = iso(x, 5, 2.9), b = iso(x, 5, 3.6)
          return <line key={x} className="ink thin" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        })}
        <line className="ink thin" x1={bandA[0]} y1={bandA[1]} x2={iso(7, 5, 2.9)[0]} y2={iso(7, 5, 2.9)[1]} />
        <line className="ink thin" x1={bandB[0] - 10} y1={bandB[1]} x2={bandB[0] - 10} y2={bandB[1]} />
        {box(0, 0, 2, 8, 6, 0.5, [W.paper, W.paper, W.stone])}
        {box(0, 0, 3.9, 8, 6, 0.45, [W.stone, W.paper, W.clay])}
        <polygon className="wash" fill={W.sun} points={pts([...wall, ...wallTop.reverse()])} />
        <polyline className="ink" points={pts(wall)} fill="none" />
        <polyline className="ink" points={pts(wallTop)} fill="none" />
        {cyl(6.4, 1.6, 4)}
        {cyl(2.4, 3.6, 3.4)}
        {[[-1.6, 2.2, 14], [9.6, 1, 11], [-1, 7.6, 10]].map(([x, y, r], i) => {
          const c = iso(x, y, 0)
          return <g key={i}><circle className="wash" cx={c[0]} cy={c[1] - r} r={r} fill={W.sage} /><circle className="ink" cx={c[0]} cy={c[1] - r} r={r} fill="none" /><line className="ink" x1={c[0]} y1={c[1]} x2={c[0]} y2={c[1] - r} /></g>
        })}
        <path className="ink" d={`M${iso(2, 7.4, 0)[0]} ${iso(2, 7.4, 0)[1]}v-14m0 3l-4 4m4-4l4 4m-4 7l-3 7m3-7l3 7`} />
      </g>
    </svg>
  )
}

function Cantilever() {
  return (
    <svg viewBox="0 0 300 240" aria-hidden="true">
      <g className="rough">
        <path className="wash" d="M0 172Q60 150 130 176T300 166V240H0Z" fill={W.water} />
        <circle className="wash" cx="44" cy="124" r="34" fill={W.sage} />
        <circle className="wash" cx="256" cy="52" r="42" fill={W.sage} />
        <rect className="wash" x="70" y="60" width="46" height="112" fill={W.stone} />
        <rect className="wash" x="116" y="82" width="38" height="90" fill={W.stone} />
        <polygon className="wash" fill={W.wood} points="100,100 270,86 282,98 112,114" />
        <polygon className="wash" fill={W.glass} points="120,114 262,100 262,122 132,134" />
        <polygon className="wash" fill={W.wood} points="124,134 258,122 270,134 136,148" />

        <path className="ink" d="M0 172Q60 150 130 176T300 166" />
        <path className="ink thin" d="M10 190Q50 184 90 192M120 205Q170 198 214 208M30 222Q80 214 130 224" />
        <rect className="ink" x="70" y="60" width="46" height="112" fill="none" />
        <rect className="ink" x="116" y="82" width="38" height="90" fill="none" />
        {[76, 92, 108, 124, 140, 156].map((y) => <path key={y} className="ink thin" d={`M70 ${y}H116`} />)}
        {[96, 112, 128, 144, 160].map((y) => <path key={y} className="ink thin" d={`M116 ${y}H154`} />)}
        <polygon className="ink" points="100,100 270,86 282,98 112,114" fill="none" />
        <polygon className="ink" points="120,114 262,100 262,122 132,134" fill="none" />
        <polygon className="ink" points="124,134 258,122 270,134 136,148" fill="none" />
        {[150, 175, 200, 225, 250].map((x) => <line key={x} className="ink thin" x1={x} y1={114 - (x - 120) * 0.1} x2={x + 6} y2={134 - (x - 120) * 0.09} />)}
        <path className="ink" d="M120 148V176M180 142V170M250 134V168" />
        <path className="ink" d="M196 88V74h56v12" />
        <path className="ink" d="M214 86V72m0 3l-3 3m3-3l3 3m-3 5l-3 6m3-6l3 6M236 86V72m0 3l-3 3m3-3l3 3m-3 5l-3 6m3-6l3 6" />
        <path className="ink thin" d="M214 150V120M226 148V124M238 146V130" />
        {[200, 212, 224, 236, 248, 260].map((x, i) => <path key={x} className="ink thin" d={`M${x} ${166 + (i % 2) * 3}V${230 - (i % 3) * 8}`} />)}
        <ellipse className="ink" cx="168" cy="186" rx="26" ry="9" fill={W.stone} />
        <ellipse className="ink" cx="84" cy="188" rx="30" ry="10" fill={W.stone} />
        <circle className="ink" cx="44" cy="124" r="34" fill="none" />
        <circle className="ink" cx="256" cy="52" r="42" fill="none" />
        {[22, 34, 46, 58, 70].map((x, i) => <path key={x} className="ink thin" d={`M${x} 10V${70 + i * 8}M${x} ${24 + i * 6}l8-6M${x} ${44 + i * 6}l-8-6`} />)}
        <path className="ink thin" d="M290 30Q270 60 250 80M270 20Q258 40 240 56" />
      </g>
    </svg>
  )
}

/** Three pen-and-marker house sketches that draw themselves in. Drawn in code, original designs. */
export function Sketchbook({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ready) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      root.current!.querySelectorAll<SVGGeometryElement>('.tile').forEach((tile, t) => {
        const inks = Array.from(tile.querySelectorAll<SVGGeometryElement>('.ink'))
        const washes = tile.querySelectorAll('.wash')
        inks.forEach((el) => {
          const len = el.getTotalLength?.() ?? 0
          if (len) gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        })
        gsap.set(washes, { opacity: 0 })
        const tl = gsap.timeline({ delay: 0.15 + t * 0.35 })
        tl.to(inks, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut', stagger: { amount: 1.6 } })
          .to(washes, { opacity: 1, duration: 0.9, ease: 'power1.out', stagger: { amount: 0.5 } }, '-=0.9')
      })
    })
    return () => mm.revert()
  }, { scope: root, dependencies: [ready] })

  return (
    <div className="sketchbook" ref={root} role="img" aria-label="Pen and marker sketches of three houses: a tall arched townhouse, a flat-roofed villa on stilts, and a house cantilevered over a waterfall">
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="4" /><feDisplacementMap in="SourceGraphic" scale="2.6" /></filter>
      </svg>
      <div className="tile tall"><Townhouse /></div>
      <div className="tile"><Villa /></div>
      <div className="tile"><Cantilever /></div>
    </div>
  )
}
