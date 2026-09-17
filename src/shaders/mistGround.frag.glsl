#include "./noise.glsl"

uniform vec3 uMist;
uniform float uTime;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  float radial = length(vWorldPosition.xz);
  float edge = smoothstep(6.0, 28.0, radial) * (1.0 - smoothstep(70.0, 95.0, radial));
  float flow = noise(vWorldPosition.xz * 0.07 + uTime * 0.018);
  float veil = noise(vWorldPosition.xz * 0.035 - uTime * 0.012);
  float density = edge * (0.35 + flow * 0.4 + veil * 0.35);
  float alpha = clamp(density * 0.18, 0.0, 0.24);
  gl_FragColor = vec4(uMist, alpha);
}
