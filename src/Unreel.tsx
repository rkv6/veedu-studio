import { Fragment, useRef, type PointerEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { scrollByY } from './smooth'
import { SplitHeading } from './SplitHeading'

gsap.registerPlugin(useGSAP)
import { projects } from './data'
import { RoomArt } from './Art'

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (t: number) => { const c = clamp(t); return c * c * (3 - 2 * c) }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export function Unreel({ onOpen }: { onOpen: (id: string) => void }) {
  const root = useRef<HTMLElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const head = useRef<HTMLDivElement>(null)
  const tab = useRef<HTMLButtonElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const end = useRef<HTMLDivElement>(null)
  const drag = useRef<number | null>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const section = root.current!
    const svgEl = svg.current!
    const tabEl = tab.current!
    const film = svgEl.querySelector<SVGPathElement>('.film')!
    const tickL = svgEl.querySelector<SVGPathElement>('.tick-l')!
    const tickR = svgEl.querySelector<SVGPathElement>('.tick-r')!
    const roll = svgEl.querySelector<SVGGElement>('.roll')!
    const wound = svgEl.querySelector<SVGCircleElement>('.roll-wound')!
    const rings = Array.from(svgEl.querySelectorAll<SVGCircleElement>('.roll-ring'))
    const spin = svgEl.querySelector<SVGGElement>('.roll-spin')!
    const els = items.current.filter(Boolean) as HTMLLIElement[]

    let W = 0, H = 0, xc = 0, rollCy = 0, rMax = 0, rMin = 0, core = 0, stripW = 0, headMax = 0, headMin = 0, mobile = false
    let itemY: number[] = []
    const shown: boolean[] = []
    let endShown = false
    let tabText = ''
    const s = { head: -1, prev: 0, flutter: 0 }

    const measure = () => {
      const sr = section.getBoundingClientRect()
      W = sr.width; H = sr.height
      mobile = W < 760
      xc = mobile ? 64 : W / 2
      rMax = mobile ? 40 : 76
      rMin = mobile ? 17 : 30
      core = mobile ? 11 : 20
      stripW = mobile ? 40 : 92
      const hr = head.current!.getBoundingClientRect()
      rollCy = hr.bottom - sr.top + (mobile ? 24 : 36) + rMax
      itemY = els.map((el) => { const r = el.getBoundingClientRect(); return r.top - sr.top + r.height / 2 })
      headMax = end.current!.getBoundingClientRect().top - sr.top - 16
      headMin = rollCy + rMax + 40
      svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`)
      roll.setAttribute('transform', `translate(${xc} ${rollCy})`)
    }

    const tick = (time: number, dtMs: number) => {
      const dt = Math.min(dtMs, 64) / 1000
      const sr = section.getBoundingClientRect()
      const target = reduced ? headMax : clamp(window.innerHeight * 0.62 - sr.top, headMin, headMax)
      if (s.head < 0 || reduced) { s.head = target; s.prev = target }
      s.head += (target - s.head) * (1 - Math.exp(-dt * 6.5))
      const vel = (s.head - s.prev) / Math.max(dt, 0.001)
      s.prev = s.head
      s.flutter += (clamp(Math.abs(vel) / 900) - s.flutter) * (1 - Math.exp(-dt * 5))
      const A = reduced ? 0 : 5 + 26 * s.flutter
      const p = clamp((s.head - headMin) / Math.max(1, headMax - headMin))
      const r = lerp(rMax, rMin, p)
      const y0 = rollCy + r - 10
      const hd = s.head

      const L: string[] = [], R: string[] = [], TL: string[] = [], TR: string[] = []
      let lastL = 0, lastR = 0, lastY = 0, lastX = 0
      const ys: number[] = []
      for (let y = y0; y < hd; y += 10) ys.push(y)
      ys.push(hd)
      ys.forEach((y, k) => {
        const t = y - y0
        const pin = smooth(t / 170)
        // One-sided: the tape only ever bows to the right while it is pulled, it never swings back across the centre line
        let sway = (reduced ? 0 : A * (0.62 + 0.38 * Math.sin(t * 0.012 - time * 2.4)) + A * 0.18 * Math.sin(t * 0.031 + time * 1.7)) * pin
        const c = clamp((y - (hd - 110)) / 110)
        sway += (reduced ? 0 : 1) * c * c * (12 + 30 * s.flutter)
        const twist = reduced ? 1 : 0.55 + 0.45 * Math.abs(Math.cos(t * 0.009 - time * 0.9 + 0.7))
        const w = stripW * lerp(0.6, 1, smooth(t / 90)) * twist
        const x = xc + sway
        const l = x - w / 2, rr = x + w / 2
        const ins = Math.min(10, w * 0.2)
        const cmd = k === 0 ? 'M' : 'L'
        L.push(`${cmd}${l.toFixed(1)} ${y.toFixed(1)}`)
        R.push(`L${rr.toFixed(1)} ${y.toFixed(1)}`)
        TL.push(`${cmd}${(l + ins).toFixed(1)} ${y.toFixed(1)}`)
        TR.push(`${cmd}${(rr - ins).toFixed(1)} ${y.toFixed(1)}`)
        lastL = l; lastR = rr; lastY = y; lastX = x
      })
      const zig: string[] = []
      for (let k = 1; k < 6; k++) zig.push(`L${(lastL + ((lastR - lastL) * k) / 6).toFixed(1)} ${(lastY + (k % 2 ? 9 : -3)).toFixed(1)}`)
      const d = `${L.join('')}${zig.join('')}${R.reverse().join('')}Z`
      film.setAttribute('d', d)
      tickL.setAttribute('d', TL.join(''))
      tickR.setAttribute('d', TR.join(''))

      // Roll shrinks and spins as the tape leaves it
      wound.setAttribute('r', r.toFixed(1))
      rings.forEach((ring, i) => ring.setAttribute('r', lerp(core + 5, r - 3, (i + 1) / rings.length).toFixed(1)))
      const travel = s.head - headMin
      spin.setAttribute('transform', `rotate(${((travel / ((r + core) / 2)) * 57.3).toFixed(1)})`)

      // Tab hangs from the end of the tape
      const idle = p < 0.03
      const text = p > 0.985 ? '' : idle ? 'Pull me' : 'Keep pulling'
      if (text !== tabText) {
        tabText = text
        if (label.current) label.current.textContent = text
        tabEl.classList.toggle('gone', text === '')
        tabEl.classList.toggle('idle', idle)
      }
      const swing = reduced ? 0 : Math.sin(time * 2.1) * (3 + 8 * s.flutter)
      tabEl.style.transform = `translate(${(lastX).toFixed(1)}px, ${(hd + 16).toFixed(1)}px) translateX(-50%) rotate(${swing.toFixed(1)}deg)`

      els.forEach((el, i) => {
        const on = hd >= itemY[i] - 70
        if (shown[i] !== on) { shown[i] = on; el.classList.toggle('in', on) }
      })
      const endOn = hd >= headMax - 6
      if (endOn !== endShown) { endShown = endOn; end.current!.classList.toggle('in', endOn) }
    }

    measure()
    gsap.ticker.add(tick)
    tick(0, 16)
    const ro = new ResizeObserver(measure)
    ro.observe(section)
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => {
      gsap.ticker.remove(tick)
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, { scope: root })

  const onDown = (e: PointerEvent<HTMLButtonElement>) => {
    drag.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (drag.current === null) return
    scrollByY((e.clientY - drag.current) * 1.5, true)
    drag.current = e.clientY
  }
  const onUp = () => { drag.current = null }

  const open = (id: string) => (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    onOpen(id)
  }

  return (
    <section className="unreel" id="projects" ref={root} aria-labelledby="h-projects">
      <svg className="unreel-svg" ref={svg} aria-hidden="true" preserveAspectRatio="none">
        <path className="film" fill="#17221d" stroke="#0b120f" strokeOpacity=".55" strokeLinejoin="round" />
        <path className="tick-l" fill="none" stroke="#8fa398" strokeWidth="4" strokeDasharray="2.5 10" />
        <path className="tick-r" fill="none" stroke="#8fa398" strokeWidth="4" strokeDasharray="2.5 10" />
        <g className="roll">
          <circle className="roll-wound" fill="#17221d" stroke="#0b120f" strokeWidth="1.5" />
          {[0, 1, 2, 3].map((i) => <circle key={i} className="roll-ring" fill="none" stroke="#4a5f55" strokeOpacity=".55" strokeWidth="1.5" />)}
          <g className="roll-spin">
            <circle r="20" fill="#e8ece2" />
            {[0, 120, 240].map((a) => <rect key={a} x="-3" y="-20" width="6" height="11" fill="#14201b" transform={`rotate(${a})`} />)}
            <circle r="6" fill="#14201b" />
          </g>
        </g>
      </svg>

      <div className="unreel-head" ref={head}>
        <SplitHeading id="h-projects" text="Pull the tape." />
        <p>Every stop is a home we handed back, with the month the keys changed hands.</p>
      </div>

      <ol className="unreel-list">
        {projects.map((p, i) => (
          <Fragment key={p.id}>
            <li className={`u-item ${i % 2 ? 'right' : 'left'}`} style={{ gridRow: i + 1 }} ref={(el) => { items.current[i] = el }}>
              <a href={`#project-${p.id}`} onClick={open(p.id)}>
                <span className="u-name">{p.name}</span>
                <span className="u-date">{p.done}</span>
                <span className="u-meta">{p.place}, {p.scope}, {p.took}</span>
                <span className="u-note">{p.note}</span>
                <span className="u-link">See the whole story →</span>
              </a>
            </li>
            <li className={`u-card ${i % 2 ? 'at-left' : 'at-right'}`} style={{ gridRow: i + 1 }} aria-hidden="true">
              <div className="u-card-in">
                <div className="u-card-art"><RoomArt kind={p.kind} /></div>
                <p className="u-card-name">{p.name}</p>
                <p className="u-card-sub">Keys handed over, {p.done}</p>
              </div>
            </li>
          </Fragment>
        ))}
      </ol>

      <div className="unreel-end" ref={end}>
        <h3>Ready to be our next project?</h3>
        <p>Roll up your sleeves. We will roll out the plans.</p>
        <a className="btn" href="#enquire">Start an enquiry</a>
      </div>

      <button
        className="pull-tab idle" ref={tab} aria-label="Pull the tape down to see the next project"
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onClick={() => { if (drag.current === null) scrollByY(window.innerHeight * 0.6) }}
      >
        <span className="pull-label" ref={label}>Pull me</span>
      </button>
    </section>
  )
}
