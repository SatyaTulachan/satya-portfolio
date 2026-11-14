import Image from 'next/image';

/**
 * Decorative cut-out stickers (public/space/*.webp). Purely ornamental: hidden from assistive tech,
 * never interactive, always behind content. Placement lives in styles/_space.scss, one rule per
 * doodle (the `d-<name>` class), so the layout stays out of the markup.
 *
 * Three nested layers keep the transforms from fighting each other:
 *   .doodle   position + resting rotation (CSS)
 *   .dp       scroll parallax (GSAP, driven by data-depth)
 *   img       slow idle drift (CSS, only on `drift` doodles)
 */
const ART = {
  saturn: { w: 640, h: 398 },
  rocket: { w: 418, h: 520 },
  satellite: { w: 560, h: 468 },
  asteroid: { w: 517, h: 560 },
  debris: { w: 640, h: 623 },
  crystal: { w: 378, h: 520 },
  astronaut: { w: 414, h: 560 },
} as const;

export type DoodleName = keyof typeof ART;

export default function Doodle({
  name,
  depth = 0.4,
  drift = false,
  glow = false,
}: {
  name: DoodleName;
  /** 0 = pinned to the page, higher = drifts faster against the scroll */
  depth?: number;
  drift?: boolean;
  glow?: boolean;
}) {
  const { w, h } = ART[name];
  return (
    <span className={`doodle d-${name}${glow ? ' glow' : ''}${drift ? ' drift' : ''}`} aria-hidden="true">
      <span className="dp" data-depth={depth}>
        <Image src={`/space/${name}.webp`} alt="" width={w} height={h} sizes="(max-width: 860px) 130px, 340px" draggable={false} />
      </span>
    </span>
  );
}
