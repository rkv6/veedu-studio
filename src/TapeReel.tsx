import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Cassette } from './Cassette'
import { projects } from './data'

gsap.registerPlugin(ScrollTrigger)

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const smooth = (t: number) => { const c = clamp(t); return c * c * (3 - 2 * c) }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const n = projects.length // the last stop (index n) is the closing question

function metaLine(i: number) {
  const p = projects[i]
  return `${p.place}, ${p.scope}, ${p.took}`
}

function open(onOpen: (id: string) => void, id: string) {
  return (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    onOpen(id)
  }
}

export function TapeReel({ onOpen }: { onOpen: (id: string) => void }) {
  const [reduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const root = useRef<HTMLElement>(null)
  const pin = useRef<HTMLDivElement>(null)
  const cassette = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const items = useRef<(HTMLElement | null)[]>([])
  const hint = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (reduced) return
    const pinEl = pin.current!
    const cassetteEl = cassette.current!
    const svgEl = svg.current!
    const ribbon = svgEl.querySelector<SVGPathElement>('.ribbon')!
    const tickA = svgEl.querySelector<SVGPathElement>('.tick-a')!
    const tickB = svgEl.querySelector<SVGPathElement>('.tick-b')!
    const reelLTape = cassetteEl.querySelector<SVGCircleElement>('.reel-l-tape')!
    const reelRTape = cassetteEl.querySelector<SVGCircleElement>('.reel-r-tape')!
    const reelLSpin = cassetteEl.querySelector<SVGGElement>('.reel-l-spin')!
    const reelRSpin = cassetteEl.querySelector<SVGGElement>('.reel-r-spin')!
    const els = items.current.filter(Boolean) as HTMLElement[]

    const st = { target: 0, p: 0, prev: 0, flutter: 0 }
    let W = 0, H = 0, D = 0, S = 0, itemW = 0, tapeH = 0, laneY = 0, xExit = 0, exitY = 0, mobile = false

    const measure = () => {
      const pr = pinEl.getBoundingClientRect()
      const cr = cassetteEl.getBoundingClientRect()
      W = pr.width; H = pr.height
      mobile = W < 760
      xExit = cr.left - pr.left + cr.width * 0.5
      exitY = cr.bottom - pr.top - 10
      tapeH = mobile ? 168 : clamp(H * 0.21, 130, 176)
      itemW = mobile ? Math.min(W * 0.64, 340) : Math.min(W * 0.46, 580)
      D = mobile ? W * 0.36 : W * 0.4
      S = mobile ? W * 0.95 : W * 0.62
      laneY = Math.min(Math.max(exitY + 56 + tapeH / 2, H * 0.66), H - tapeH / 2 - 24)
      els.forEach((el) => { el.style.width = `${itemW}px`; el.style.height = `${tapeH - 26}px` })
      svgEl.setAttribute('viewBox', `0 0 ${W} ${H}`)
    }

    const aOf = (p: number) => {
      const q = clamp(p) * n
      const i = Math.min(Math.floor(q), n - 1)
      const f = q - i
      const d = 0.5
      const e = f < d / 2 ? 0 : f > 1 - d / 2 ? 1 : smooth((f - d / 2) / (1 - d))
      return i + e
    }

    const wave = (cx: number, t: number, amp: number) => amp * Math.sin(cx * 0.011 + t * 1.6) + amp * 0.45 * Math.sin(cx * 0.027 - t * 2.4 + 1.3)

    const tick = (time: number, dtMs: number) => {
      const dt = Math.min(dtMs, 64) / 1000
      st.p += (st.target - st.p) * (1 - Math.exp(-dt * 9))
      const vel = (st.p - st.prev) / Math.max(dt, 0.001)
      st.prev = st.p
      st.flutter += (clamp(Math.abs(vel) * n * 0.35) - st.flutter) * (1 - Math.exp(-dt * 5))
      const t = time
      const a = aOf(st.p)
      const amp = 4 + 22 * st.flutter

      // Ribbon geometry
      const tail = (mobile ? 0.02 : 0.12) * W
      const xEnd = D + (n - a) * S + itemW / 2 + tail
      const attach = smooth((xEnd - (xExit - 40)) / 160)
      const xRight = Math.min(xEnd, xExit)
      const T = W * (mobile ? 0.1 : 0.16)
      const top: string[] = [], bot: string[] = [], tA: string[] = [], tB: string[] = []
      const xs: number[] = []
      for (let x = -120; x < xRight; x += 14) xs.push(x)
      xs.push(xRight)
      let lastY = 0, lastHw = 0
      xs.forEach((x, k) => {
        const cx = x + a * S
        const base = laneY + wave(cx, t, amp)
        const s = smooth((x - (xExit - T)) / T) * attach
        const droop = (1 - attach) * 16 * smooth((x - (xRight - 90)) / 90)
        const y = lerp(base, exitY, s) + droop
        const hw = lerp(tapeH / 2, 20, s) * (1 + 0.035 * Math.sin(cx * 0.017 + t * 1.1))
        const c = k === 0 ? 'M' : 'L'
        top.push(`${c}${x.toFixed(1)} ${(y - hw).toFixed(1)}`)
        bot.push(`L${x.toFixed(1)} ${(y + hw).toFixed(1)}`)
        tA.push(`${c}${x.toFixed(1)} ${(y - hw + 11).toFixed(1)}`)
        tB.push(`${c}${x.toFixed(1)} ${(y + hw - 11).toFixed(1)}`)
        lastY = y; lastHw = hw
      })
      // Torn end when the tape has left the cassette
      const rag = (1 - attach)
      const zig: string[] = []
      if (rag > 0.02) {
        const steps = 6
        for (let k = 1; k < steps; k++) {
          const yy = lastY - lastHw + (lastHw * 2 * k) / steps
          zig.push(`L${(xRight + (k % 2 ? 7 : -5) * rag).toFixed(1)} ${yy.toFixed(1)}`)
        }
      }
      ribbon.setAttribute('d', `${top.join('')}${zig.join('')}${bot.reverse().join('')}Z`)
      tickA.setAttribute('d', tA.join(''))
      tickB.setAttribute('d', tB.join(''))
      const off = (a * S) % 12.5
      tickA.style.strokeDashoffset = `${off}`
      tickB.style.strokeDashoffset = `${off}`

      // Project frames ride on the same wave
      els.forEach((el, i) => {
        const x = D + (i - a) * S
        const cx = x + a * S
        const y = laneY + wave(cx, t, amp)
        const slope = (wave(cx + 12, t, amp) - wave(cx - 12, t, amp)) / 24
        const rot = Math.atan(slope) * 57.3
        const o = (1 - smooth((x - (D + 0.45 * S)) / (0.3 * S))) * smooth((x - (D - 0.85 * S)) / (0.3 * S))
        el.style.transform = `translate(${(x - itemW / 2).toFixed(1)}px, ${(y - (tapeH - 26) / 2).toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`
        el.style.opacity = o.toFixed(3)
        el.style.pointerEvents = o > 0.6 ? 'auto' : 'none'
      })

      // Reels
      const used = clamp(a / (n + 0.4))
      reelLTape.setAttribute('r', lerp(38, 14, used).toFixed(1))
      reelRTape.setAttribute('r', lerp(14, 14, used).toFixed(1))
      reelLSpin.setAttribute('transform', `rotate(${(-a * 260).toFixed(1)})`)
      reelRSpin.setAttribute('transform', `rotate(${(-a * 260 * 1.6).toFixed(1)})`)
      if (hint.current) hint.current.style.opacity = `${1 - clamp(a * 4)}`
    }

    const ctx = gsap.context(() => {
      measure()
      ScrollTrigger.create({
        trigger: pinEl,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (n * 0.95 + 0.4))}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / n, duration: { min: 0.25, max: 0.7 }, delay: 0.12, ease: 'power2.inOut' },
        onUpdate: (self) => { st.target = self.progress },
        onRefresh: (self) => { measure(); st.target = self.progress },
      })
      gsap.ticker.add(tick)
      tick(0, 16)
    }, root)

    return () => {
      gsap.ticker.remove(tick)
      ctx.revert()
    }
  }, [reduced])

  if (reduced) {
    return (
      <section className="block" id="projects" aria-labelledby="h-projects">
        <div className="head"><h2 id="h-projects">Interiors we have finished</h2></div>
        <ul className="tape-list">
          {projects.map((p) => (
            <li key={p.id}>
              <a href={`#project-${p.id}`} onClick={open(onOpen, p.id)}>
                <span className="t-date">{p.done}</span>
                <span className="t-name">{p.name}</span>
                <span className="t-meta">{p.place}, {p.scope}, {p.took}</span>
                <span className="t-link">View project →</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="tape" id="projects" ref={root} aria-labelledby="h-projects">
      <div className="tape-pin" ref={pin}>
        <div className="tape-title">
          <h2 id="h-projects">Interiors we have finished</h2>
          <p ref={hint} className="tape-hint">Scroll to play the tape. It stops at every home.</p>
        </div>
        <div className="cassette" ref={cassette}><Cassette /></div>
        <svg className="tape-svg" ref={svg} aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="film" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a2d25" /><stop offset=".5" stopColor="#241b16" /><stop offset="1" stopColor="#33271f" />
            </linearGradient>
          </defs>
          <path className="ribbon" fill="url(#film)" stroke="#120d0a" strokeOpacity=".5" strokeWidth="1" strokeLinejoin="round" />
          <path className="tick-a" fill="none" stroke="#8a7664" strokeWidth="4" strokeDasharray="2.5 10" />
          <path className="tick-b" fill="none" stroke="#8a7664" strokeWidth="4" strokeDasharray="2.5 10" />
        </svg>
        <div className="tape-lane" aria-hidden="true">
          {projects.map((p, i) => (
            <a key={p.id} className="tape-item" href={`#project-${p.id}`} tabIndex={-1} ref={(el) => { items.current[i] = el }} onClick={open(onOpen, p.id)}>
              <span className="t-date">{p.done}</span>
              <span className="t-name">{p.name}</span>
              <span className="t-meta">{metaLine(i)}</span>
              <span className="t-link">View project →</span>
            </a>
          ))}
          <div className="tape-item tape-end" tabIndex={-1} ref={(el) => { items.current[n] = el }}>
            <span className="t-name">Ready to be our next project?</span>
            <a className="t-cta" href="#enquire" tabIndex={-1}>Start an enquiry →</a>
          </div>
        </div>
        <ul className="sr-list" aria-label="Finished projects">
          {projects.map((p) => (
            <li key={p.id}><a href={`#project-${p.id}`} onClick={open(onOpen, p.id)}>{p.name}, {p.done}</a></li>
          ))}
          <li><a href="#enquire">Ready to be our next project? Start an enquiry</a></li>
        </ul>
      </div>
    </section>
  )
}
