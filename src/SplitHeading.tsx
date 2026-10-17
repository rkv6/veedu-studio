import { Fragment, useRef, type ElementType } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Props {
  as?: ElementType
  id?: string
  text: string
  /** Animate on load (hero) instead of on scroll. */
  now?: boolean
  /** Hold the animation until this is true, for example while the intro plays. */
  ready?: boolean
  className?: string
}

/** Real heading text, split into words that rise out of a mask. Reads as one heading to assistive tech. */
export function SplitHeading({ as: Tag = 'h2', id, text, now = false, ready = true, className }: Props) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!ready) return
    const words = ref.current?.querySelectorAll<HTMLElement>('.wi')
    if (!words?.length) return
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(words, {
        yPercent: 115, rotate: 4, duration: 0.8, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: now ? undefined : { trigger: ref.current, start: 'top 88%', once: true },
      })
    })
    return () => mm.revert()
  }, { scope: ref, dependencies: [ready] })

  return (
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <Fragment key={i}><span className="w" aria-hidden="true"><span className="wi">{w}</span></span>{' '}</Fragment>
      ))}
    </Tag>
  )
}
