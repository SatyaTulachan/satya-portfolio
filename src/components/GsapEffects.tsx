'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/lenis';

/**
 * Quiet page-wide GSAP behaviour, driven by data attributes so sections stay server components:
 *   [data-reveal]  a short fade/slide in on scroll (batched, lightly staggered)
 *   [data-draw]    hand-drawn arrows draw themselves in
 *   [data-depth]   space stickers drift at their own speed against the scroll
 */
export default function GsapEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      if (reduced) return;
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
      gsap.set(items, { autoAlpha: 0, y: 20 });
      ScrollTrigger.batch(items, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.07, overwrite: true }),
      });

      gsap.utils.toArray<HTMLElement>('[data-depth]').forEach((el) => {
        const depth = Number(el.dataset.depth) || 0;
        gsap.fromTo(
          el,
          { y: depth * 50 },
          {
            y: depth * -90,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        );
      });

      gsap.utils.toArray<SVGPathElement>('[data-draw]').forEach((path) => {
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: 'power2.inOut',
          delay: 0.9,
          scrollTrigger: { trigger: path, start: 'top 95%', once: true },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
