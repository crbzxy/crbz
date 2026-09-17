#include "./noise.glsl"

uniform vec3 uMist;
uniform vec3 uHorizon;
uniform float uTime;
varying vec3 vWorldPosition;

void main() {
  float height = vWorldPosition.y;
  float radial = length(vWorldPosition.xz);

  // Banda vertical que une tierra (~suelo) y cielo bajo
  float rise = smoothstep(-1.2, 2.8, height) * (1.0 - smoothstep(4.5, 14.0, height));
  float distanceFall = smoothstep(12.0, 38.0, radial) * (1.0 - smoothstep(78.0, 110.0, radial));

  float swirl = noise(vWorldPosition.xz * 0.045 + vec2(uTime * 0.015, uTime * 0.01));
  float wisps = noise(vWorldPosition.xz * 0.12 - uTime * 0.02);
  float density = rise * distanceFall;
  density *= 0.55 + swirl * 0.35 + wisps * 0.2;
  density = clamp(density, 0.0, 1.0);

  vec3 color = mix(uHorizon, uMist, 0.55 + swirl * 0.25);
  float alpha = density * 0.22;

  gl_FragColor = vec4(color, alpha);
}
