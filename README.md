# Satya Tulachan — Portfolio

Dark, experimental portfolio built with:

| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript |
| Styling | SCSS (partials in `src/styles/`) |
| Scroll | Lenis (single scroll engine), driven by GSAP's ticker |
| Scroll animation | GSAP + ScrollTrigger (reveals, parallax, card tilt) |
| UI motion | Framer Motion (hero entrance, springy 3D rig, overlays) |
| 3D / shaders | Three.js + GLSL (portrait dissolve, `src/lib/dissolveShader.ts`) |
| Fonts | Self-hosted via @fontsource (Space Grotesk, Inter, IBM Plex Mono) |

## Run locally
```bash
npm install
npm run dev        # http://localhost:3000
```
Production check: `npm run build && npm start`.

## Structure
```
src/app/            layout (metadata, JSON-LD), page, robots, sitemap, icon, globals.scss
src/components/     Hero, HeroPortrait (Three.js), About, Work, Stack, Playroom (game), Contact,
                    SmoothScroll (Lenis), GsapEffects (reveal/tilt/parallax), Nav, Sprite
src/lib/            runner.ts (game engine), dissolveShader.ts (GLSL), lenis.ts
src/data/content.ts site constants and card/skill data — edit text here
src/styles/         SCSS partials
public/images/      webp images
```

## Deploy (Vercel)
1. Push this folder to GitHub.
2. Import the repo at vercel.com, framework is auto-detected, then Deploy.
3. Set `NEXT_PUBLIC_SITE_URL` (Project → Settings → Environment Variables) to your real URL, e.g. `https://satyatulachan.com`. It feeds canonical, Open Graph, sitemap and robots. Redeploy after setting it.

## Notes
- The WebGL dissolve loads on first interaction (or after 8s), so it never slows first paint. Until then the plain portrait image is shown.
- `prefers-reduced-motion` disables Lenis, GSAP animations and the dissolve.
- Before sharing publicly, confirm you have the rights to every image in `public/images/`.
