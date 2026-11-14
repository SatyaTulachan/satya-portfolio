// GLSL for the portrait dissolve. Every pixel of the portrait becomes a point;
// the origin of the dissolve follows the pointer and the points scatter away.
export const vertexShader = /* glsl */ `
attribute float aColor;
attribute vec3 aRand;
uniform vec2 uMouse;
uniform vec2 uOrigin;
uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uAsp;
uniform float uK;
uniform float uHover;
varying float vColor;
varying float vAlpha;

void main() {
  vec2 a = position.xy;
  vec2 q  = vec2(a.x * uAsp, a.y);
  vec2 oo = vec2(uOrigin.x * uAsp, uOrigin.y);
  vec2 mm = vec2(uMouse.x * uAsp, uMouse.y);
  float dm = distance(q, mm);
  float dn = distance(q, oo) / 1.1;

  float k = clamp((uProgress * 2.0 - dn) * 1.6 - aRand.x * 0.4, 0.0, 1.0);
  k = k * k * (3.0 - 2.0 * k);

  vec2 dir  = vec2(aRand.y - 0.5, aRand.z - 0.5) * 2.0;
  vec2 away = normalize(q - oo + 1e-4);
  vec2 off  = (away * 0.45 + dir * 0.55 + vec2(0.3, -0.6)) * k * (0.5 + aRand.x);
  off.x += sin(uTime * 1.3 + aRand.y * 6.28) * 0.03 * k;
  off += normalize(q - mm + 1e-4) * smoothstep(0.14, 0.0, dm) * uHover * (1.0 - k) * 0.07;

  vec2 u = a + vec2(off.x / uAsp, off.y);
  u += vec2(sin(uTime + aRand.y * 30.0), cos(uTime * 1.1 + aRand.z * 30.0)) * 0.0007;

  gl_Position = vec4((vec2(u.x, 1.0 - u.y) * 2.0 - 1.0) / uK, 0.0, 1.0);
  gl_PointSize = uSize * (1.0 - 0.5 * k);
  vColor = aColor + 0.4 * k;
  vAlpha = (1.0 - k * 0.95) * (1.0 - smoothstep(0.82, 1.0, a.y));
}
`;

export const fragmentShader = /* glsl */ `
varying float vColor;
varying float vAlpha;
void main() {
  gl_FragColor = vec4(vec3(vColor), vAlpha);
}
`;
