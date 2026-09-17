uniform float uIntensity;
uniform float uTime;
uniform float uSeed;
varying vec2 vUv;

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float d = length(p);
  float flicker = 0.8 + 0.12 * sin(uTime * 8.5 + uSeed) + 0.08 * sin(uTime * 19.0);
  float glow = exp(-d * d * 3.2) * uIntensity * flicker;
  float rim = exp(-d * d * 1.1) * uIntensity * 0.35 * flicker;
  vec3 color = vec3(1.0, 0.4, 0.06) * glow + vec3(1.0, 0.62, 0.18) * rim;
  gl_FragColor = vec4(color, clamp(glow + rim, 0.0, 0.75));
}
