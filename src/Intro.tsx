import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export function Intro({ onDone }: { onDone: () => void }) {
  const wrap = useRef<HTMLDivElement>(null)
  const tape = useRef<HTMLSpanElement>(null)
  const line = useRef<HTMLParagraphElement>(null)

  const done = useRef(onDone)
  done.current = onDone

  useGSAP(() => {
    try { window.sessionStorage.setItem('veedu-intro', '1') } catch { /* private mode */ }
    document.documentElement.style.overflow = 'hidden'
    const tl = gsap.timeline({
      onComplete: () => { document.documentElement.style.overflow = ''; done.current() },
    })
    tl.to(tape.current, { width: '100%', duration: 0.9, ease: 'power2.out' })
      .to(line.current, { opacity: 1, y: 0, duration: 0.35 }, 0.3)
      .to(wrap.current, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' }, '+=0.3')
    const sway = gsap.to(tape.current, { skewY: 2.2, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    return () => { sway.kill(); document.documentElement.style.overflow = '' }
  }, { scope: wrap })

  return (
    <div className="intro" ref={wrap} aria-hidden="true">
      <div className="intro-inner">
        <p className="intro-mark">Veedu</p>
        <span className="intro-tape" ref={tape} />
        <p className="intro-line" ref={line}>Rolling out the plans</p>
      </div>
    </div>
  )
}
