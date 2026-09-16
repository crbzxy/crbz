import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  NormalBlending,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  ShaderMaterial,
  type Scene,
} from 'three';
import {
  CAMERA_START_FOCUS,
  FLAME_FRAME_RADIUS,
  FLAME_LIFETIME_SECONDS,
  GOLDEN_ANGLE,
  GROUND_Y,
  LIGHTNING_FIRE_POOL,
  MAX_ACTIVE_FIRES,
  MAX_POINT_LIGHTS,
  PARTICLES_PER_FLAME,
  PHI,
  pickFlameCount,
  randomRange,
  SMOKE_PER_FLAME,
} from './constants';
import { createWoodBase } from './woodBase';

const flameVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const flameFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uIntensity;
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
`;

const spotVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const spotFragmentShader = /* glsl */ `
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
`;

type FlameTraits = {
  x: number;
  z: number;
  size: number;
  intensity: number;
  seed: number;
  phase: number;
  speed: number;
  chaos: number;
  violence: number;
  heightFactor: number;
  depthBand: 'near' | 'mid' | 'far' | 'distant';
  particleCount: number;
};

type DepthBand = FlameTraits['depthBand'];

type GoldenSlot = {
  x: number;
  z: number;
  size: number;
  depthBand: DepthBand;
};

/** Fuego estilo referencia: pequeño/local, con raro mediano. */
function pickReferenceFlameSize() {
  if (Math.random() < 0.82) {
    return randomRange(0.38, 0.85);
  }
  return randomRange(0.9, 1.35);
}

type LayoutContext = {
  slots: GoldenSlot[];
};

function depthBandFromRadius(radius: number): DepthBand {
  if (radius < 2.2) {
    return 'near';
  }
  if (radius < 4.2) {
    return 'mid';
  }
  if (radius < 7.2) {
    return 'far';
  }
  return 'distant';
}

function clampToFrameDisk(x: number, z: number, focusX: number, focusZ: number) {
  const offsetX = x - focusX;
  const offsetZ = z - focusZ;
  const distance = Math.hypot(offsetX, offsetZ);
  if (distance <= FLAME_FRAME_RADIUS || distance < 0.0001) {
    return { x, z };
  }
  const scale = FLAME_FRAME_RADIUS / distance;
  return {
    x: focusX + offsetX * scale,
    z: focusZ + offsetZ * scale,
  };
}

/**
 * Espiral áurea anclada al foco de cámara de inicio,
 * compacta para que siempre haya fuego en cuadro.
 */
function createGoldenLayout(flameCount: number): LayoutContext {
  const focusX = CAMERA_START_FOCUS.x;
  const focusZ = CAMERA_START_FOCUS.z;
  const rotation = Math.random() * Math.PI * 2;
  const mirror = Math.random() > 0.5 ? 1 : -1;
  const unit = randomRange(0.42, 0.42 * PHI);
  const slots: GoldenSlot[] = [];

  for (let index = 0; index < flameCount; index += 1) {
    const angle = rotation + GOLDEN_ANGLE * index * mirror;
    const radius =
      index === 0
        ? randomRange(0.05, 0.28)
        : unit *
          Math.pow(PHI, (index - 1) * 0.42) *
          Math.sqrt((index + 0.35) / PHI);

    const jitterRadius =
      index === 0 ? randomRange(0.02, 0.08) : randomRange(0.03, 0.1);
    const jitterAngle = Math.random() * Math.PI * 2;
    const rawX =
      focusX + Math.cos(angle) * radius + Math.cos(jitterAngle) * jitterRadius;
    const rawZ =
      focusZ + Math.sin(angle) * radius + Math.sin(jitterAngle) * jitterRadius;
    const clamped = clampToFrameDisk(rawX, rawZ, focusX, focusZ);
    const distanceFromFocus = Math.hypot(
      clamped.x - focusX,
      clamped.z - focusZ,
    );

    slots.push({
      x: clamped.x,
      z: clamped.z,
      size: pickReferenceFlameSize(),
      depthBand: depthBandFromRadius(distanceFromFocus),
    });
  }

  return { slots };
}

function createTraitsAt(
  x: number,
  z: number,
  particleCount: number,
  size = pickReferenceFlameSize(),
): FlameTraits {
  return {
    x,
    z,
    size,
    intensity: randomRange(0.75, 1.35),
    seed: Math.random() * 100,
    phase: Math.random() * Math.PI * 2,
    speed: randomRange(0.55, 1.75),
    chaos: randomRange(0.85, 1.65),
    violence: randomRange(0.85, 1.55),
    heightFactor: randomRange(0.85, 1.25),
    depthBand: depthBandFromRadius(Math.hypot(x, z)),
    particleCount,
  };
}

function createUniqueTraits(
  index: number,
  layout: LayoutContext,
  particleCount: number,
): FlameTraits {
  const slot = layout.slots[index];
  return createTraitsAt(slot.x, slot.z, particleCount, slot.size);
}

type ParticleBundle = {
  positions: Float32Array;
  colors: Float32Array;
  ages: Float32Array;
  speeds: Float32Array;
  geometry: BufferGeometry;
  count: number;
};

type SmokeBundle = {
  positions: Float32Array;
  colors: Float32Array;
  ages: Float32Array;
  speeds: Float32Array;
  driftsX: Float32Array;
  driftsZ: Float32Array;
  geometry: BufferGeometry;
  count: number;
};

type FlameInstance = {
  traits: FlameTraits;
  group: Group;
  flameMesh: Mesh;
  glowMesh: Mesh;
  spotMesh: Mesh;
  light: PointLight | null;
  flameMaterial: ShaderMaterial;
  glowMaterial: ShaderMaterial;
  spotMaterial: ShaderMaterial;
  particles: ParticleBundle;
  particleMaterial: PointsMaterial;
  smoke: SmokeBundle;
  smokeMaterial: PointsMaterial;
  wood: ReturnType<typeof createWoodBase> | null;
  height: number;
  baseScale: number;
  /** Multiplicador de nacimiento (rayo); decae a 1. */
  spawnBoost: number;
  surge: number;
  lit: boolean;
  ignition: number;
  age: number;
  dying: number;
};

/** Escala del fuego más cercano / más lejano a la cámara. */
const NEAREST_FIRE_SCALE = 1.65;
const FARTHEST_FIRE_SCALE = 0.52;
/** Tamaño al iniciar desde un rayo. */
const STRIKE_FLAME_SIZE_MIN = 1.7;
const STRIKE_FLAME_SIZE_MAX = 2.35;
const STRIKE_BASE_SCALE_MIN = 1.55;
const STRIKE_BASE_SCALE_MAX = 2.1;
const STRIKE_SPAWN_BOOST = 2.35;
const STRIKE_SPAWN_BOOST_DECAY = 0.35;

export type FlameStrikeTarget = {
  index: number;
  x: number;
  y: number;
  z: number;
  distanceFromOrigin: number;
};

export type FlameFieldHandle = {
  update: (
    delta: number,
    time: number,
    windStrength: number,
    cameraX: number,
    cameraY: number,
    cameraZ: number,
  ) => void;
  getDormantTargets: () => FlameStrikeTarget[];
  getStrikeTargets: () => FlameStrikeTarget[];
  hasActive: () => boolean;
  ignite: (index: number) => boolean;
  /** Enciende un fuego pequeño estilo referencia en el impacto del rayo. */
  spawnAt: (x: number, z: number) => number | null;
  surge: (index: number, strength?: number) => void;
  dispose: () => void;
};

function resetParticle(
  positions: Float32Array,
  colors: Float32Array,
  ages: Float32Array,
  speeds: Float32Array,
  index: number,
  traits: FlameTraits,
) {
  const offset = index * 3;
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 0.06 * traits.size;
  positions[offset] = Math.cos(angle) * radius;
  positions[offset + 1] = 0.02 + Math.random() * 0.03;
  positions[offset + 2] = Math.sin(angle) * radius * 0.35;
  ages[index] = Math.random();
  speeds[index] = (0.6 + Math.random()) * traits.speed;
  const heat = 0.4 + traits.intensity * 0.35;
  colors[offset] = 1;
  colors[offset + 1] = 0.35 + heat * 0.35;
  colors[offset + 2] = 0.04 + Math.random() * 0.08;
}

function createParticleBundle(traits: FlameTraits): ParticleBundle {
  const count = traits.particleCount;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const ages = new Float32Array(count);
  const speeds = new Float32Array(count);
  const geometry = new BufferGeometry();

  for (let index = 0; index < count; index += 1) {
    resetParticle(positions, colors, ages, speeds, index, traits);
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  return { positions, colors, ages, speeds, geometry, count };
}

function resetSmokeParticle(
  smoke: SmokeBundle,
  index: number,
  traits: FlameTraits,
) {
  const offset = index * 3;
  const angle = Math.random() * Math.PI * 2;
  const radius = randomRange(0.02, 0.14) * traits.size;
  smoke.positions[offset] = Math.cos(angle) * radius;
  smoke.positions[offset + 1] = randomRange(0.08, 0.28) * traits.size;
  smoke.positions[offset + 2] = Math.sin(angle) * radius * 0.7;
  smoke.ages[index] = Math.random() * 0.3;
  smoke.speeds[index] = randomRange(0.12, 0.32) * traits.speed;
  smoke.driftsX[index] = randomRange(-0.35, 0.35);
  smoke.driftsZ[index] = randomRange(-0.35, 0.35);
  const grey = randomRange(0.18, 0.38);
  smoke.colors[offset] = grey;
  smoke.colors[offset + 1] = grey * 0.92;
  smoke.colors[offset + 2] = grey * 0.85;
}

function createSmokeBundle(traits: FlameTraits): SmokeBundle {
  const count = SMOKE_PER_FLAME;
  const smoke: SmokeBundle = {
    positions: new Float32Array(count * 3),
    colors: new Float32Array(count * 3),
    ages: new Float32Array(count),
    speeds: new Float32Array(count),
    driftsX: new Float32Array(count),
    driftsZ: new Float32Array(count),
    geometry: new BufferGeometry(),
    count,
  };

  for (let index = 0; index < count; index += 1) {
    resetSmokeParticle(smoke, index, traits);
  }

  smoke.geometry.setAttribute(
    'position',
    new BufferAttribute(smoke.positions, 3),
  );
  smoke.geometry.setAttribute('color', new BufferAttribute(smoke.colors, 3));
  return smoke;
}

function flickerFor(time: number, traits: FlameTraits) {
  const local = time * traits.speed + traits.phase;
  const spike = Math.sin(local * 31.0 + traits.seed) > 0.88 ? 0.38 : 0;
  const snap =
    Math.sin(local * 47.0 + traits.seed * 3.1) > 0.94 ? 0.22 : 0;
  return (
    traits.intensity *
    (0.82 +
      Math.sin(local * 5.1) * 0.18 +
      Math.sin(local * 13.9) * 0.14 +
      Math.sin(local * 27.5) * 0.1 +
      Math.sin(local * 41.0 + traits.chaos) * 0.08 +
      spike +
      snap)
  );
}

function createFlameInstance(
  traits: FlameTraits,
  options: { withLight: boolean; withWood: boolean },
): FlameInstance {
  const group = new Group();
  group.position.set(traits.x, GROUND_Y, traits.z);

  const wood = options.withWood ? createWoodBase(traits.size) : null;
  if (wood) {
    group.add(wood.group);
  }

  const height = 0.95 * traits.size;
  const width = 0.34 * traits.size;

  const flameMaterial = new ShaderMaterial({
    vertexShader: flameVertexShader,
    fragmentShader: flameFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSeed: { value: traits.seed },
      uIntensity: { value: traits.intensity },
    },
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });

  const flameMesh = new Mesh(new PlaneGeometry(width, height), flameMaterial);
  flameMesh.position.y = height / 2;
  group.add(flameMesh);

  const glowMaterial = new ShaderMaterial({
    vertexShader: spotVertexShader,
    fragmentShader: spotFragmentShader,
    uniforms: {
      uIntensity: { value: 0.35 * traits.intensity },
      uTime: { value: 0 },
      uSeed: { value: traits.seed },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });

  const glowMesh = new Mesh(
    new PlaneGeometry(1.2 * traits.size, 1.2 * traits.size),
    glowMaterial,
  );
  glowMesh.position.set(0, height * 0.35, -0.02);
  group.add(glowMesh);

  const spotMaterial = new ShaderMaterial({
    vertexShader: spotVertexShader,
    fragmentShader: spotFragmentShader,
    uniforms: {
      uIntensity: { value: 0.7 * traits.intensity },
      uTime: { value: 0 },
      uSeed: { value: traits.seed + 1 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });

  const spotMesh = new Mesh(
    new PlaneGeometry(2.6 * traits.size, 2.6 * traits.size),
    spotMaterial,
  );
  spotMesh.rotation.x = -Math.PI / 2;
  spotMesh.position.y = 0.012;
  group.add(spotMesh);

  let light: PointLight | null = null;
  if (options.withLight) {
    light = new PointLight(
      0xff7a22,
      1.65 * traits.intensity,
      4.2 + traits.size * 3.2,
      1.7,
    );
    light.position.set(0, height * 0.52, 0.06);
    group.add(light);
  }

  const particles = createParticleBundle(traits);
  const particleMaterial = new PointsMaterial({
    size: 0.018 * traits.size,
    vertexColors: true,
    transparent: true,
    opacity: 0.28 + traits.intensity * 0.18,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });
  group.add(new Points(particles.geometry, particleMaterial));

  const smoke = createSmokeBundle(traits);
  const smokeMaterial = new PointsMaterial({
    size: 0.11 * traits.size,
    vertexColors: true,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    blending: NormalBlending,
    sizeAttenuation: true,
  });
  group.add(new Points(smoke.geometry, smokeMaterial));
  group.visible = false;

  return {
    traits,
    group,
    flameMesh,
    glowMesh,
    spotMesh,
    light,
    flameMaterial,
    glowMaterial,
    spotMaterial,
    particles,
    particleMaterial,
    smoke,
    smokeMaterial,
    wood,
    height,
    baseScale: 1,
    spawnBoost: 1,
    surge: 0,
    lit: false,
    ignition: 0,
    age: 0,
    dying: 0,
  };
}

/** El más cercano a la cámara recibe siempre la escala mayor. */
function applyNearestLargestScale(
  flames: FlameInstance[],
  cameraX: number,
  cameraY: number,
  cameraZ: number,
) {
  const lit: Array<{ flame: FlameInstance; distance: number; index: number }> =
    [];

  for (let index = 0; index < flames.length; index += 1) {
    const flame = flames[index];
    if (!flame.lit) {
      continue;
    }
    const dx = flame.traits.x - cameraX;
    const dy = GROUND_Y - cameraY;
    const dz = flame.traits.z - cameraZ;
    lit.push({ flame, distance: Math.hypot(dx, dy, dz), index });
  }

  lit.sort(
    (left, right) =>
      left.distance - right.distance || left.index - right.index,
  );

  const lastRank = Math.max(1, lit.length - 1);
  for (let rank = 0; rank < lit.length; rank += 1) {
    const blend = lit.length === 1 ? 0 : rank / lastRank;
    const proximity =
      NEAREST_FIRE_SCALE +
      (FARTHEST_FIRE_SCALE - NEAREST_FIRE_SCALE) * blend;
    const entry = lit[rank];
    entry.flame.group.scale.setScalar(
      entry.flame.baseScale * proximity * entry.flame.spawnBoost,
    );
  }
}

function toStrikeTarget(flame: FlameInstance, index: number): FlameStrikeTarget {
  return {
    index,
    x: flame.traits.x,
    y: GROUND_Y + 0.15,
    z: flame.traits.z,
    distanceFromOrigin: Math.hypot(flame.traits.x, flame.traits.z),
  };
}

function disposeFlame(flame: FlameInstance) {
  flame.flameMesh.geometry.dispose();
  flame.glowMesh.geometry.dispose();
  flame.spotMesh.geometry.dispose();
  flame.flameMaterial.dispose();
  flame.glowMaterial.dispose();
  flame.spotMaterial.dispose();
  flame.particles.geometry.dispose();
  flame.particleMaterial.dispose();
  flame.smoke.geometry.dispose();
  flame.smokeMaterial.dispose();
  flame.wood?.dispose();
}

function updateFlameParticles(flame: FlameInstance, delta: number, time: number) {
  const { positions, colors, ages, speeds, geometry, count } = flame.particles;
  const traits = flame.traits;
  const maxRise = flame.height * 1.05;

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    const turbulence =
      0.7 + Math.sin(time * 8.0 + index * 0.37 + traits.seed) * 0.5;
    ages[index] += delta * speeds[index] * (0.45 + turbulence * 0.2);

    if (ages[index] >= 1) {
      resetParticle(positions, colors, ages, speeds, index, traits);
      continue;
    }

    const age = ages[index];
    positions[offset] +=
      Math.sin(time * 5.5 + index + traits.seed) * 0.0012 * turbulence;
    positions[offset + 1] +=
      (0.08 + turbulence * 0.05 - age * 0.04) * delta * traits.size;
    positions[offset + 2] += Math.cos(time * 4.2 + index) * 0.0008 * turbulence;

    if (positions[offset + 1] > maxRise) {
      ages[index] = 1;
    }

    const fade = (1 - age) * traits.intensity;
    colors[offset] = fade;
    colors[offset + 1] = (0.5 - age * 0.35) * fade;
    colors[offset + 2] = 0.04 * fade;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;
}

function birthSoft(flame: FlameInstance) {
  return flame.ignition * flame.ignition * (1 - flame.dying);
}

function updateSmokeParticles(
  flame: FlameInstance,
  delta: number,
  time: number,
  windStrength: number,
) {
  const smoke = flame.smoke;
  const traits = flame.traits;
  const maxRise = flame.height * (2.6 + (traits.seed % 5) * 0.18);
  const life = birthSoft(flame);

  for (let index = 0; index < smoke.count; index += 1) {
    const offset = index * 3;
    smoke.ages[index] +=
      delta * smoke.speeds[index] * (0.35 + traits.chaos * 0.1);

    if (smoke.ages[index] >= 1) {
      resetSmokeParticle(smoke, index, traits);
      continue;
    }

    const age = smoke.ages[index];
    const swirl =
      Math.sin(time * 1.4 + index * 0.7 + traits.seed) * 0.01 * windStrength;
    smoke.positions[offset] +=
      (smoke.driftsX[index] * 0.02 + swirl) * delta * traits.size;
    smoke.positions[offset + 1] +=
      (0.14 + (1 - age) * 0.1) *
      delta *
      traits.size *
      (0.8 + windStrength * 0.2);
    smoke.positions[offset + 2] +=
      (smoke.driftsZ[index] * 0.02 - swirl * 0.6) * delta * traits.size;

    if (smoke.positions[offset + 1] > maxRise) {
      smoke.ages[index] = 1;
    }

    const fade = (1 - age) * (0.35 + life * 0.55);
    const tint = 0.2 + age * 0.15;
    smoke.colors[offset] = tint * fade;
    smoke.colors[offset + 1] = tint * 0.9 * fade;
    smoke.colors[offset + 2] = tint * 0.8 * fade;
  }

  smoke.geometry.attributes.position.needsUpdate = true;
  smoke.geometry.attributes.color.needsUpdate = true;
  flame.smokeMaterial.opacity = 0.14 + flame.ignition * 0.16 * (1 - flame.dying);
  flame.smokeMaterial.size =
    (0.08 + flame.traits.size * 0.07) * (1 + flame.surge * 0.15);
}

function countLit(flames: FlameInstance[]) {
  return flames.reduce((total, flame) => total + (flame.lit ? 1 : 0), 0);
}

function findSpawnSlot(flames: FlameInstance[]) {
  const dormant = flames.findIndex((flame) => !flame.lit);
  if (dormant >= 0) {
    return dormant;
  }

  let oldestIndex = 0;
  let oldestAge = -1;
  for (let index = 0; index < flames.length; index += 1) {
    if (flames[index].age > oldestAge) {
      oldestAge = flames[index].age;
      oldestIndex = index;
    }
  }
  return oldestIndex;
}

export function createFlameField(scene: Scene): FlameFieldHandle {
  const seededCount = pickFlameCount();
  const layout = createGoldenLayout(seededCount);
  const particleCount = PARTICLES_PER_FLAME;
  const flames: FlameInstance[] = [];

  for (let index = 0; index < LIGHTNING_FIRE_POOL; index += 1) {
    const traits =
      index < seededCount
        ? createUniqueTraits(index, layout, particleCount)
        : createTraitsAt(
            CAMERA_START_FOCUS.x + randomRange(-8, 8),
            CAMERA_START_FOCUS.z + randomRange(-8, 8),
            particleCount,
          );
    const flame = createFlameInstance(traits, {
      withLight: index < MAX_POINT_LIGHTS,
      withWood: index < seededCount,
    });
    if (flame.wood) {
      flame.wood.group.visible = index < seededCount && Math.random() > 0.35;
    }
    flames.push(flame);
    scene.add(flame.group);
  }

  return {
    update(delta, time, windStrength, cameraX, cameraY, cameraZ) {
      applyNearestLargestScale(flames, cameraX, cameraY, cameraZ);

      for (const flame of flames) {
        if (!flame.lit) {
          continue;
        }

        flame.age += delta;
        if (flame.age >= FLAME_LIFETIME_SECONDS - 12) {
          flame.dying = Math.min(1, flame.dying + delta / 12);
        }
        if (flame.dying >= 1) {
          flame.lit = false;
          flame.group.visible = false;
          flame.age = 0;
          flame.dying = 0;
          flame.ignition = 0;
          flame.surge = 0;
          flame.spawnBoost = 1;
          continue;
        }

        if (flame.ignition < 1) {
          flame.ignition = Math.min(1, flame.ignition + delta * 0.9);
        }
        if (flame.spawnBoost > 1) {
          flame.spawnBoost = Math.max(
            1,
            flame.spawnBoost - delta * STRIKE_SPAWN_BOOST_DECAY,
          );
        }
        if (flame.surge > 0) {
          flame.surge = Math.max(0, flame.surge - delta * 1.8);
        }

        const birth = flame.ignition * flame.ignition;
        const fadeOut = 1 - flame.dying;
        const pulse =
          flickerFor(time, flame.traits) *
          (0.2 + birth * 0.9) *
          fadeOut *
          (1 + flame.surge * 1.2);
        flame.flameMaterial.uniforms.uTime.value = time;
        flame.flameMaterial.uniforms.uIntensity.value = pulse;
        flame.glowMaterial.uniforms.uTime.value = time;
        flame.glowMaterial.uniforms.uIntensity.value =
          pulse * (0.4 + flame.surge * 0.35);
        flame.spotMaterial.uniforms.uTime.value = time;
        flame.spotMaterial.uniforms.uIntensity.value =
          pulse * (0.95 + flame.surge * 0.45);
        if (flame.light) {
          flame.light.intensity = (1.7 + flame.surge * 2.8) * pulse;
        }

        const phase = flame.traits.phase;
        const seed = flame.traits.seed;
        const windLean =
          Math.sin(time * 1.5 + phase) * 0.05 * windStrength +
          Math.sin(time * 4.8 + seed) * 0.03 * flame.traits.chaos;
        const jump =
          Math.sin(time * 9.5 * flame.traits.speed + seed) > 0.82 ? 0.22 : 0;
        const scaleY =
          (0.55 + birth * 0.85) *
          fadeOut *
          (0.88 +
            Math.sin(time * 3.6 * flame.traits.speed + phase) * 0.12 +
            Math.sin(time * 7.1 + seed) * 0.1 +
            flame.surge * 0.22 +
            jump);
        const scaleX =
          (0.48 + birth * 0.42) *
          fadeOut *
          (0.9 +
            Math.sin(time * 5.4 + phase * 2.1) * 0.14 +
            Math.sin(time * 11.0 + seed) * 0.1);
        flame.flameMesh.scale.set(scaleX, scaleY, 1);
        flame.flameMesh.position.y = (flame.height * scaleY) / 2;
        flame.flameMesh.rotation.z = windLean;
        flame.glowMesh.scale.setScalar(
          birth * fadeOut * (0.95 + pulse * 0.12 + flame.surge * 0.28),
        );
        flame.spotMesh.scale.setScalar(
          birth * fadeOut * (1.05 + pulse * 0.18 + flame.surge * 0.2),
        );
        updateFlameParticles(flame, delta, time);
        updateSmokeParticles(flame, delta, time, windStrength);
      }
    },
    getDormantTargets() {
      return flames
        .map((flame, index) => ({ flame, index }))
        .filter((entry) => !entry.flame.lit)
        .map((entry) => toStrikeTarget(entry.flame, entry.index));
    },
    getStrikeTargets() {
      return flames.map((flame, index) => toStrikeTarget(flame, index));
    },
    hasActive() {
      return flames.some((flame) => flame.lit);
    },
    ignite(index) {
      const flame = flames[index];
      if (!flame || flame.lit) {
        return false;
      }
      flame.lit = true;
      flame.ignition = 0.1;
      flame.surge = 1.8;
      flame.age = 0;
      flame.dying = 0;
      flame.group.visible = true;
      return true;
    },
    spawnAt(x, z) {
      if (countLit(flames) >= MAX_ACTIVE_FIRES) {
        const recycle = findSpawnSlot(flames);
        flames[recycle].lit = false;
        flames[recycle].group.visible = false;
      }

      const index = findSpawnSlot(flames);
      const flame = flames[index];
      flame.traits.x = x;
      flame.traits.z = z;
      flame.traits.size = randomRange(
        STRIKE_FLAME_SIZE_MIN,
        STRIKE_FLAME_SIZE_MAX,
      );
      flame.traits.seed = Math.random() * 100;
      flame.traits.intensity = randomRange(1.15, 1.55);
      flame.group.position.set(x, GROUND_Y, z);
      flame.baseScale = randomRange(
        STRIKE_BASE_SCALE_MIN,
        STRIKE_BASE_SCALE_MAX,
      );
      flame.spawnBoost = STRIKE_SPAWN_BOOST;
      flame.group.scale.setScalar(
        flame.baseScale * NEAREST_FIRE_SCALE * flame.spawnBoost,
      );
      if (flame.wood) {
        flame.wood.group.visible = Math.random() > 0.7;
      }
      flame.lit = true;
      flame.ignition = 0.85;
      flame.surge = 2.5;
      flame.age = 0;
      flame.dying = 0;
      flame.group.visible = true;
      return index;
    },
    surge(index, strength = 1.4) {
      const flame = flames[index];
      if (!flame || !flame.lit) {
        return;
      }
      flame.surge = Math.min(2.5, strength);
    },
    dispose() {
      for (const flame of flames) {
        scene.remove(flame.group);
        disposeFlame(flame);
      }
    },
  };
}
