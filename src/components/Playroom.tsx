'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RunnerGame } from '@/lib/runner';

const pad = (n: number) => String(n).padStart(5, '0');

export default function Playroom() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const game = useRef<RunnerGame | null>(null);

  const [phase, setPhase] = useState<'idle' | 'running' | 'over'>('idle');
  const [final, setFinal] = useState(0);
  const [best, setBest] = useState(0);
  const bestRef = useRef(0);

  useEffect(() => {
    try {
      const b = Number(localStorage.getItem('run-best')) || 0;
      bestRef.current = b;
      setBest(b);
    } catch {}
  }, []);

  useEffect(() => {
    const arena = arenaRef.current!;
    const g = new RunnerGame(canvasRef.current!, arena, {
      onScore: (s) => {
        if (scoreRef.current) scoreRef.current.textContent = `SCORE ${pad(s)}`;
      },
      onOver: (s) => {
        if (s > bestRef.current) {
          bestRef.current = s;
          setBest(s);
          try {
            localStorage.setItem('run-best', String(s));
          } catch {}
        }
        setFinal(s);
        setPhase('over');
      },
    });
    game.current = g;

    const io = new IntersectionObserver((e) => g.setVisible(e[0].isIntersecting));
    io.observe(arena);
    const onResize = () => g.resize();
    window.addEventListener('resize', onResize);

    const down = (e: KeyboardEvent) => {
      if (!g.isRunning) return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        g.jump();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        g.setDuck(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'ArrowDown' || e.code === 'KeyS') g.setDuck(false);
    };
    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);

    return () => {
      g.destroy();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  const start = useCallback(() => {
    setPhase('running');
    game.current?.start();
    arenaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (phase !== 'over') return;
    const t = setTimeout(() => startRef.current?.focus(), 700);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <section id="play">
      <div className="w">
        <div className="playbox" data-reveal>
          <div>
            <div className="label">04 — Take a break</div>
            <h2>Run. Jump. Duck.</h2>
            <p>A little endless runner in the spirit of the Chrome dino. Jump the bugs, duck the flying ones, and keep going as it speeds up.</p>
            <p>Your best score is saved in this browser.</p>
            <div className="keys">
              <span><kbd>↑</kbd>Space or up to jump</span>
              <span><kbd>↓</kbd>Down to duck</span>
              <span><kbd>tap</kbd>to jump</span>
            </div>
          </div>
          <div
            className="arena"
            ref={arenaRef}
            tabIndex={-1}
            role="group"
            aria-label="Endless runner game"
            onPointerDown={() => game.current?.jump()}
          >
            <canvas ref={canvasRef} id="rn" aria-hidden="true" />
            <div className="hud">
              <span ref={scoreRef}>SCORE 00000</span>
              <span>HI {pad(best)}</span>
            </div>
            <AnimatePresence>
              {phase !== 'running' && (
                <motion.div
                  className="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <b>{phase === 'over' ? `Game over · ${final}` : 'Ready to run?'}</b>
                  <button className="btn" ref={startRef} type="button" onClick={start}>
                    {phase === 'over' ? 'Play again' : 'Start game'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="label" role="status" aria-live="polite" id="gs">
            {phase === 'over' ? `Game over. You scored ${final}.` : ''}
          </div>
        </div>
      </div>
    </section>
  );
}
