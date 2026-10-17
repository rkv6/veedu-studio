import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/** One smooth-scroll instance, driven by GSAP's ticker so the film strip and Lenis share a single frame loop. */
export function initSmooth() {
  if (lenis || typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ autoRaf: false, anchors: { offset: -72 }, lerp: 0.1 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export const getLenis = () => lenis

/** Scroll to an element or pixel offset, smoothly when Lenis is running and natively otherwise. */
export function scrollToTarget(target: string | number, immediate = false) {
  if (lenis) { lenis.scrollTo(target, { offset: typeof target === 'string' ? -72 : 0, immediate }); return }
  if (typeof target === 'number') window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export function scrollByY(dy: number, immediate = false) {
  scrollToTarget((lenis?.scroll ?? window.scrollY) + dy, immediate)
}

export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop()
  else lenis?.start()
}
