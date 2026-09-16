import {
  BackSide,
  Color,
  CylinderGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  type Scene,
} from 'three';
import { GROUND_Y, MOON_AMBIENT, SKY_FOG, SKY_HORIZON } from './constants';

export type MistHandle = {
  update: (time: number) => void;
  dispose: () => void;
};

const mistVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPosition = world.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const bandFragmentShader = /* glsl */ `
  uniform vec3 uMist;
  uniform vec3 uHorizon;
  uniform float uTime;
  varying vec3 vWorldPosition;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

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
`;

const groundMistFragmentShader = /* glsl */ `
  uniform vec3 uMist;
  uniform float uTime;
  varying vec3 vWorldPosition;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    float radial = length(vWorldPosition.xz);
    float edge = smoothstep(6.0, 28.0, radial) * (1.0 - smoothstep(70.0, 95.0, radial));
    float flow = noise(vWorldPosition.xz * 0.07 + uTime * 0.018);
    float veil = noise(vWorldPosition.xz * 0.035 - uTime * 0.012);
    float density = edge * (0.35 + flow * 0.4 + veil * 0.35);
    float alpha = clamp(density * 0.18, 0.0, 0.24);
    gl_FragColor = vec4(uMist, alpha);
  }
`;

export function createHorizonMist(scene: Scene): MistHandle {
  const mistColor = new Color(SKY_FOG).lerp(new Color(MOON_AMBIENT), 0.55);
  mistColor.lerp(new Color(SKY_HORIZON), 0.25);

  const bandMaterial = new ShaderMaterial({
    vertexShader: mistVertexShader,
    fragmentShader: bandFragmentShader,
    uniforms: {
      uMist: { value: mistColor.clone() },
      uHorizon: { value: new Color(SKY_HORIZON) },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: BackSide,
    fog: false,
  });

  const band = new Mesh(
    new CylinderGeometry(95, 95, 22, 48, 1, true),
    bandMaterial,
  );
  band.position.y = GROUND_Y + 8.5;
  band.frustumCulled = false;
  scene.add(band);

  const sheetMaterial = new ShaderMaterial({
    vertexShader: mistVertexShader,
    fragmentShader: groundMistFragmentShader,
    uniforms: {
      uMist: { value: mistColor.clone() },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    fog: false,
  });

  const sheet = new Mesh(new PlaneGeometry(180, 180, 1, 1), sheetMaterial);
  sheet.rotation.x = -Math.PI / 2;
  sheet.position.y = GROUND_Y + 0.35;
  sheet.frustumCulled = false;
  scene.add(sheet);

  return {
    update(time) {
      bandMaterial.uniforms.uTime.value = time;
      sheetMaterial.uniforms.uTime.value = time;
    },
    dispose() {
      scene.remove(band, sheet);
      band.geometry.dispose();
      sheet.geometry.dispose();
      bandMaterial.dispose();
      sheetMaterial.dispose();
    },
  };
}
