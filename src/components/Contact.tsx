'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE } from '@/data/content';
import Doodle from './Doodle';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
    } catch {
      const t = document.createElement('textarea');
      t.value = SITE.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact">
      <Doodle name="astronaut" depth={0.4} drift />
      <div className="w contact">
        <span className="label" data-reveal style={{ display: 'block', marginBottom: 18 }}>05 — Contact</span>
        <h2 data-reveal>Have something in mind? Let’s talk.</h2>
        <p data-reveal>I’m looking for opportunities and always happy to talk about what you’re building.</p>
        <div data-reveal>
          <button className="email" type="button" onClick={copy} aria-label={`Copy email address ${SITE.email}`}>
            {SITE.email}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={copied ? 'c' : 'n'}
                className="label"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {copied ? 'Copied' : 'Copy'}
              </motion.span>
            </AnimatePresence>
          </button>
          <span className="note contact-note" aria-hidden="true">
            <svg viewBox="0 0 54 40"><path data-draw d="M46 34 C 30 38, 10 30, 6 8 M6 8 L4 18 M6 8 L14 13" /></svg>
            say hello
          </span>
        </div>
        <div className="socials" data-reveal>
          <a className="link" href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a className="link" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
        <footer>
          <span className="label">Satya Tulachan · {new Date().getFullYear()}</span>
          <span className="label">Kathmandu · 27°42’ N</span>
        </footer>
      </div>
    </section>
  );
}
