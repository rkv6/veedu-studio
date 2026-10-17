import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { getLenis } from './smooth'

gsap.registerPlugin(useGSAP)

const line = 'Roll out the plans · Interiors · Homes for sale · Kovalam · Varkala · Kowdiar · '

/** A band of type that drifts on its own and speeds up, then flips direction, with the page scroll (after React Bits ScrollVelocity). */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const el = track.current!
      let x = 0, dir = -1, boost = 0
      const tick = (_t: number, dtMs: number) => {
        const half = el.scrollWidth / 2
        if (!half) return
        const v = getLenis()?.velocity ?? 0
        if (Math.abs(v) > 0.3) dir = v > 0 ? -1 : 1
        boost += (Math.min(Math.abs(v), 40) - boost) * 0.08
        x += dir * (60 + boost * 30) * (dtMs / 1000)
        if (x <= -half) x += half
        if (x > 0) x -= half
        el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`
      }
      gsap.ticker.add(tick)
      return () => gsap.ticker.remove(tick)
    })
    return () => mm.revert()
  }, { scope: root })

  return (
    <div className="marquee" ref={root} aria-hidden="true">
      <div className="marquee-track" ref={track}>
        <span>{line.repeat(3)}</span><span>{line.repeat(3)}</span>
      </div>
    </div>
  )
}
