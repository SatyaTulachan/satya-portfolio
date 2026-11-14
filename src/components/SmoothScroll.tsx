'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setLenis, getLenis, prefersReducedMotion } from '@/lib/lenis';

/**
 * The single scroll engine: Lenis, driven by GSAP's ticker so ScrollTrigger
 * and smooth scroll stay in lockstep. Also handles in-page #anchor clicks.
 */
export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let lenis: Lenis | null = null;
    let tick: ((t: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
      setLenis(lenis);
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t) => lenis!.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!;
      const el = id.length > 1 ? document.querySelector<HTMLElement>(id) : null;
      if (!el) return;
      e.preventDefault();
      history.replaceState(null, '', id);
      const l = getLenis();
      if (l) l.scrollTo(el, { offset: -84, duration: 1.3 });
      else el.scrollIntoView({ behavior: 'auto' });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
