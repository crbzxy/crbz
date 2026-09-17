#include "./noise.glsl"

uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uMoonDir;
uniform float uTime;
varying vec3 vWorldPosition;

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amp * noise(p);
    p = p * 2.05 + vec2(17.1, 9.3);
    amp *= 0.5;
  }
  return value;
}

void main() {
  vec3 direction = normalize(vWorldPosition);
  float h = clamp(direction.y * 0.5 + 0.5, 0.0, 1.0);
  float band = smoothstep(0.18, 0.92, h);
  vec3 color = mix(uHorizon, uTop, band);

  // Soft purple wash across upper sky
  float purpleWash = smoothstep(-0.05, 0.75, direction.y);
  color += vec3(0.14, 0.08, 0.22) * purpleWash * 0.32;
  color += vec3(0.08, 0.04, 0.14) * (1.0 - band) * 0.18;

  // Nubes orgánicas: domain warp + capas con aristas suaves
  float skyMask = smoothstep(-0.02, 0.68, direction.y);
  vec2 cloudUv = direction.xz / max(0.16, direction.y + 0.08);
  // Estira en X para nubes más amplias en el cielo
  cloudUv *= vec2(0.28, 0.52);
  cloudUv += vec2(uTime * 0.0055, uTime * 0.0024);

  vec2 warp = vec2(
    fbm(cloudUv * 0.9 + 2.1),
    fbm(cloudUv * 0.9 + vec2(5.3, 1.7))
  );
  vec2 warped = cloudUv + (warp - 0.5) * 0.55;
  vec2 stretch = warped * vec2(0.85, 1.35);

  float bulk = fbm(stretch * 0.28 + 1.3);
  float baseLayer = fbm(stretch * 0.55 + bulk * 0.35);
  float ridges = fbm(stretch * 1.15 + vec2(bulk * 1.4, uTime * 0.01));
  float wisps = fbm(stretch * 2.1 + 8.0);
  float billow = smoothstep(0.28, 0.78, bulk * 0.55 + baseLayer * 0.45);
  float organic = billow;
  organic *= smoothstep(0.22, 0.74, ridges * 0.65 + wisps * 0.35);
  organic = pow(organic, 1.15);
  float softVeil = smoothstep(0.18, 0.85, bulk) * 0.4;
  float clouds = mix(softVeil, organic, 0.82) * skyMask;
  clouds = smoothstep(0.08, 0.92, clouds);

  vec3 cloudTint = vec3(0.18, 0.14, 0.3);
  vec3 cloudLit = vec3(0.42, 0.34, 0.6);
  float moonFacing = clamp(dot(normalize(direction), normalize(uMoonDir)), 0.0, 1.0);
  vec3 cloudColor = mix(cloudTint, cloudLit, moonFacing * 0.65 + 0.2);
  color = mix(color, color + cloudColor, clouds * 0.85);
  color += cloudColor * clouds * 0.22;

  // Estrellas un poco más pequeñas
  vec2 starUv = direction.xz / max(0.15, direction.y + 0.05);
  float cells = 140.0;
  vec2 grid = floor(starUv * cells);
  float star = step(0.978, hash(grid + 17.0));
  float twinkle =
    0.5 +
    0.5 * sin(uTime * (1.5 + hash(grid) * 4.0) + hash(grid * 3.1) * 6.0);
  float starMask = smoothstep(0.35, 0.95, direction.y) * (1.0 - clouds * 0.9);
  color += vec3(0.85, 0.9, 1.0) * star * twinkle * starMask * 0.75;

  float fine = step(0.995, hash(grid * 1.7 + 3.2));
  color += vec3(0.7, 0.8, 1.0) * fine * starMask * 0.4;

  // Moon disk + soft halo (más grande para verse en tomas)
  vec3 moonDir = normalize(uMoonDir);
  float moonDot = clamp(dot(direction, moonDir), 0.0, 1.0);
  float moonCore = smoothstep(0.9915, 0.9978, moonDot);
  float moonRim = smoothstep(0.985, 0.994, moonDot);
  float moonHalo = pow(moonDot, 28.0);
  float moonGlow = pow(moonDot, 8.0);
  clouds *= 1.0 - moonHalo * 0.9;

  vec3 moonBody = vec3(0.95, 0.93, 1.0);
  vec3 moonPurple = vec3(0.78, 0.68, 0.98);
  color += mix(moonPurple, moonBody, 0.7) * moonCore * 1.7;
  color += moonPurple * moonRim * 0.55;
  color += vec3(0.5, 0.42, 0.78) * moonHalo * 0.75;
  color += vec3(0.32, 0.24, 0.55) * moonGlow * 0.35;

  float meteorCycle = fract(uTime * 0.07);
  float meteorActive = step(0.86, meteorCycle) * step(meteorCycle, 0.94);
  vec3 meteorDir = normalize(vec3(0.65, 0.55, -0.25));
  float along = dot(direction, meteorDir);
  float trail = smoothstep(0.88, 0.995, along) * meteorActive * (1.0 - clouds * 0.5);
  float core = smoothstep(0.985, 0.999, along) * meteorActive;
  color += vec3(0.95, 0.92, 1.0) * trail * 0.55;
  color += vec3(1.0, 0.98, 0.95) * core * 1.2;

  float canopyGlow = exp(-pow((direction.y - 0.18) * 4.5, 2.0)) * 0.06;
  color += vec3(0.1, 0.22, 0.12) * canopyGlow;

  // Neblina suave en el horizonte (no tapar la escena)
  float horizonMist = exp(-pow((direction.y - 0.04) * 6.5, 2.0));
  float lowVeil = exp(-pow((direction.y + 0.08) * 4.0, 2.0)) * 0.18;
  float mistAmount = clamp(horizonMist * 0.35 + lowVeil, 0.0, 0.38);
  vec3 mistColor = mix(uHorizon, vec3(0.32, 0.28, 0.48), 0.45);
  color = mix(color, mistColor, mistAmount * (1.0 - clouds * 0.2));

  gl_FragColor = vec4(color, 1.0);
}
