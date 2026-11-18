'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import HeroPortrait from './HeroPortrait';
import Doodle from './Doodle';
import { prefersReducedMotion } from '@/lib/lenis';

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
// Only a small slide, never opacity, so the text is in the very first paint (good for LCP and SEO).
const rise: Variants = {
  hidden: { y: 18 },
  show: { y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const dissolveBtn = useRef<HTMLButtonElement>(null);

  // A gentle tilt of the portrait, smoothed with springs. It only reacts while the pointer is
  // over the portrait and always springs back to exactly flat when the pointer leaves.
  const ry = useMotionValue(0);
  const rx = useMotionValue(0);
  const rotateY = useSpring(ry, { stiffness: 140, damping: 22, mass: 0.6 });
  const rotateX = useSpring(rx, { stiffness: 140, damping: 22, mass: 0.6 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el || prefersReducedMotion()) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const b = el.getBoundingClientRect();
      ry.set(((e.clientX - (b.left + b.width / 2)) / b.width) * 6);
      rx.set((-(e.clientY - (b.top + b.height / 2)) / b.height) * 5);
    };
    const reset = () => {
      ry.set(0);
      rx.set(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    el.addEventListener('pointercancel', reset);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
      el.removeEventListener('pointercancel', reset);
    };
  }, [rx, ry]);

  return (
    <section id="hero" aria-label="Introduction">
      <Doodle name="saturn" depth={0.35} />
      <Doodle name="rocket" depth={0.9} />
      <Doodle name="satellite" depth={0.55} drift />
      <div className="w hero-grid">
        <motion.div className="hero-text" variants={stagger} initial="hidden" animate="show">
          <motion.div variants={rise} className="label status">
            Kathmandu, Nepal · open to opportunities
          </motion.div>
          <motion.h1 variants={rise}>
            Hi, I’m Satya. I build reliable software, <em>front to back.</em>
          </motion.h1>
          <motion.p variants={rise}>
            I’m a full stack developer working with React, Spring Boot and MySQL. I’m now adding the MERN stack and cloud
            deployment, and I like owning a feature from the UI all the way to the database.
          </motion.p>
          <motion.div variants={rise} className="actions">
            <a className="link" href="#work">See my work</a>
            <a className="link" href="#contact">Get in touch</a>
          </motion.div>
          <motion.p variants={rise} className="facts-line">
            <span>Honors in IT</span> · <span>Graduating Nov 2027</span> · <span>CGPA 3.63 / 4.00</span>
          </motion.p>
        </motion.div>

        <motion.div
          className="portrait"
          initial={{ y: 22 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <span className="note hero-note" aria-hidden="true">
            that’s me
            <svg viewBox="0 0 54 40"><path data-draw d="M3 6 C 16 2, 38 8, 46 30 M46 30 L38 25 M46 30 L47 20" /></svg>
          </span>
          <div className="stage" ref={stageRef}>
            <motion.div className="rig" style={{ rotateX, rotateY }}>
              <HeroPortrait pressedRef={dissolveBtn} />
            </motion.div>
          </div>
          <button className="dissolve-btn" ref={dissolveBtn} type="button" aria-pressed="false">
            Hover or tap the portrait to dissolve it
          </button>
        </motion.div>
      </div>
    </section>
  );
}
