#include "./noise.glsl"

uniform float uTime;
uniform float uSeed;
uniform float uIntensity;
varying vec2 vUv;

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 6; i++) {
    value += amplitude * noise(p);
    p = p * 2.15 + vec2(1.7, -3.1);
    amplitude *= 0.52;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  float t = uTime + uSeed * 17.0;
  float chaos = 0.7 + hash(vec2(uSeed, 3.1)) * 0.9;

  float lean =
    sin(t * 3.1 + uSeed) * 0.11 * chaos +
    sin(t * 7.7 + 1.3) * 0.07 +
    sin(t * 14.2 + uSeed * 2.0) * 0.04 +
    (hash(vec2(floor(t * 9.0), uSeed)) - 0.5) * 0.08;
  float stretch =
    0.88 + sin(t * 4.6) * 0.1 + sin(t * 11.2 + 0.6) * 0.07 * chaos;
  vec2 warped = uv;
  warped.x += lean * pow(uv.y, 1.55);
  warped.y = pow(clamp(uv.y / stretch, 0.0, 1.1), 0.9);

  float gust = fbm(vec2(warped.x * 3.6 + t * 0.7 + uSeed, warped.y * 1.2 - t * 1.15));
  warped.x += (gust - 0.5) * 0.28 * pow(warped.y, 1.35) * chaos;
  warped.y += (gust - 0.4) * 0.05 * warped.y;

  // Varias lenguas irregulares (como fuego real)
  float tongueA = exp(-pow((warped.x - 0.5 - sin(t * 5.2) * 0.08) * 3.4, 2.0));
  float tongueB = exp(-pow((warped.x - 0.32 - cos(t * 6.8) * 0.06) * 4.2, 2.0)) * 0.75;
  float tongueC = exp(-pow((warped.x - 0.68 + sin(t * 8.1) * 0.05) * 4.6, 2.0)) * 0.65;
  float tongueD = exp(-pow((warped.x - 0.5 + sin(t * 13.0 + uSeed) * 0.12) * 5.5, 2.0)) * 0.45;
  float width = clamp(tongueA + tongueB + tongueC + tongueD, 0.0, 1.0);
  width *= pow(max(1.0 - abs(warped.x * 2.0 - 1.0), 0.0), 0.55);

  float tipNoise = fbm(vec2(warped.x * 6.0 + t * 2.2, t * 0.4 + uSeed));
  float tip = 0.72 + tipNoise * 0.28 + sin(t * 9.0 + warped.x * 12.0) * 0.08;
  float heightMask = smoothstep(0.0, 0.03, warped.y) * smoothstep(1.08, tip, warped.y);
  float shape = width * heightMask;

  vec2 flameUv = vec2(warped.x * 4.2 + sin(t * 5.5) * 0.55, warped.y * 3.1 - t * 2.2);
  float n = fbm(flameUv + vec2(fbm(flameUv * 1.4 + t * 0.35)));
  float detail = fbm(flameUv * 2.8 + vec2(2.4, -t * 1.1));
  float snaps = step(0.62, noise(vec2(floor(t * 18.0), floor(warped.x * 10.0 + uSeed))));
  float lick = step(0.78, hash(vec2(floor(t * 11.0 + uSeed), floor(warped.x * 7.0))));

  float raw = shape * (0.28 + n * 1.05) - (1.0 - shape) * detail * 0.6 - snaps * 0.16 * warped.y;
  raw += lick * shape * 0.22 * warped.y;
  float flame = clamp(smoothstep(0.12, 0.58, raw), 0.0, 1.0);
  flame *= 0.7 + 0.3 * (0.5 + 0.5 * sin(t * 21.0 + warped.x * 14.0 + uSeed));
  flame *= uIntensity;

  vec3 color = mix(vec3(0.35, 0.02, 0.0), vec3(0.98, 0.25, 0.02), flame);
  color = mix(color, vec3(1.0, 0.55, 0.08), pow(flame, 1.6));
  color = mix(color, vec3(1.0, 0.88, 0.28), pow(flame, 2.8) * (1.0 - warped.y * 0.7));
  color = mix(color, vec3(1.0, 0.97, 0.72), pow(flame, 5.0) * (1.0 - warped.y) * 0.85);

  gl_FragColor = vec4(color, clamp(flame * shape * 0.95, 0.0, 1.0));
}
