'use client';

import { useEffect, useRef } from 'react';
import NextImage from 'next/image';
import { vertexShader, fragmentShader } from '@/lib/dissolveShader';
import { prefersReducedMotion } from '@/lib/lenis';

const SRC = '/images/portrait.webp';
const STEP = 2; // sample every Nth pixel
const K = 1.7; // canvas is 170% of the image box

/**
 * Portrait that dissolves into GLSL points (Three.js) around the pointer.
 * three is imported lazily so it never blocks first paint; the plain <img>
 * is what you see (and what crawlers/no-WebGL users get) until the points are ready.
 */
export default function HeroPortrait({ pressedRef }: { pressedRef: React.RefObject<HTMLButtonElement | null> }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const im = imgRef.current;
    const cv = canvasRef.current;
    if (!im || !cv || prefersReducedMotion()) return;

    let disposed = false;
    let raf = 0;
    const ac = new AbortController();
    const { signal } = ac;
    let cleanup = () => {};

    // Keep the heavy WebGL work off the critical path: start on first interaction
    // (or after a long idle). Until then the plain <img> is shown, identical to the eye.
    const idleStarted = new Promise<void>((res) => {
      const events = ['pointermove', 'pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'] as const;
      let timer = 0;
      const go = () => {
        events.forEach((e) => window.removeEventListener(e, go));
        clearTimeout(timer);
        res();
      };
      events.forEach((e) => window.addEventListener(e, go, { passive: true, once: true }));
      timer = window.setTimeout(go, 8000);
      signal.addEventListener('abort', () => {
        events.forEach((e) => window.removeEventListener(e, go));
        clearTimeout(timer);
      });
    });

    (async () => {
      await idleStarted;
      if (disposed) return;
      const THREE = await import('three');
      const src = new Image();
      src.src = SRC;
      try {
        await src.decode();
      } catch {
        return;
      }
      if (disposed) return;

      const W = src.naturalWidth;
      const H = src.naturalHeight;
      const s = document.createElement('canvas');
      s.width = W;
      s.height = H;
      const x = s.getContext('2d')!;
      x.drawImage(src, 0, 0);
      const d = x.getImageData(0, 0, W, H).data;

      const pos: number[] = [];
      const col: number[] = [];
      const rnd: number[] = [];
      for (let y = 0; y < H; y += STEP)
        for (let xx = 0; xx < W; xx += STEP) {
          const i = (y * W + xx) * 4;
          if (d[i + 3] > 110) {
            pos.push((xx + STEP / 2) / W, (y + STEP / 2) / H, 0);
            col.push(d[i] / 255);
            rnd.push(Math.random(), Math.random(), Math.random());
          }
        }

      let renderer: import('three').WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: false, premultipliedAlpha: false });
      } catch {
        return; // no WebGL: keep the plain image
      }
      renderer.setClearColor(0x000000, 0);

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 1));
      geo.setAttribute('aRand', new THREE.Float32BufferAttribute(rnd, 3));

      const u = {
        uMouse: { value: new THREE.Vector2(-9, -9) },
        uOrigin: { value: new THREE.Vector2(0.5, 0.4) },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 3 },
        uAsp: { value: W / H },
        uK: { value: K },
        uHover: { value: 0 },
      };
      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: u,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const points = new THREE.Points(geo, mat);
      points.frustumCulled = false;
      const scene = new THREE.Scene();
      scene.add(points);
      const camera = new THREE.Camera(); // positions are written straight to clip space

      const size = () => {
        const dp = Math.min(window.devicePixelRatio || 1, 2);
        const w = im.offsetWidth;
        renderer.setPixelRatio(dp);
        renderer.setSize(w * K, im.offsetHeight * K, false);
        u.uSize.value = STEP * (w / W) * dp * 1.6;
      };
      size();
      window.addEventListener('resize', size, { signal });

      let p = 0, hv = 0, hover = false, lock = false, visible = true;
      const origin = [0.5, 0.4];
      const toggle = () => {
        lock = !lock;
        pressedRef.current?.setAttribute('aria-pressed', String(lock));
      };
      const rel = (e: PointerEvent) => {
        const r = im.getBoundingClientRect();
        return [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))];
      };
      im.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;
        hover = true;
        const [a, b] = rel(e);
        origin[0] = a; origin[1] = b;
        u.uOrigin.value.set(a, b);
      }, { signal });
      im.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const [a, b] = rel(e);
        u.uMouse.value.set(a, b);
      }, { signal });
      im.addEventListener('pointerleave', () => {
        hover = false;
        u.uMouse.value.set(-9, -9);
      }, { signal });
      im.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'touch') return;
        const [a, b] = rel(e);
        u.uOrigin.value.set(a, b);
        toggle();
      }, { signal });
      const btn = pressedRef.current;
      btn?.addEventListener('click', () => {
        u.uOrigin.value.set(0.5, 0.35);
        toggle();
      }, { signal });

      const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
      io.observe(im);

      const t0 = performance.now();
      let last = t0;
      let active = false; // true while the points (not the photo) are on screen
      const frame = (n: number) => {
        const dt = Math.min((n - last) / 1000, 0.05);
        last = n;
        const g = hover || lock ? 1 : 0;
        p += (g - p) * Math.min(1, dt * (g ? 2.2 : 3));
        hv += ((hover ? 1 : 0) - hv) * Math.min(1, dt * 8);
        const resting = !hover && !lock && p < 0.01 && hv < 0.01;
        if (resting) {
          // Back at rest: show the crisp photo again and stop drawing.
          if (active) {
            active = false;
            cv.classList.remove('on');
            im.classList.remove('gone');
          }
        } else {
          if (!active) {
            active = true;
            cv.classList.add('on');
            im.classList.add('gone');
          }
          if (visible) {
            u.uProgress.value = p;
            u.uHover.value = hv;
            u.uTime.value = (n - t0) / 1000;
            renderer.render(scene, camera);
          }
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        geo.dispose();
        mat.dispose();
        renderer.dispose();
      };
    })();

    return () => {
      disposed = true;
      ac.abort();
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [pressedRef]);

  return (
    <div className="me">
      <NextImage
        ref={imgRef}
        className="mi"
        src={SRC}
        alt="Portrait of Satya Tulachan wearing a patterned bandana and a black t-shirt"
        width={640}
        height={830}
        priority
        sizes="(max-width: 900px) 80vw, 420px"
      />
      <canvas ref={canvasRef} id="dz" aria-hidden="true" />
    </div>
  );
}
