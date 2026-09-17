import {
  AdditiveBlending,
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
  FLAME_LIFETIME_SECONDS,
  GROUND_Y,
  LIGHTNING_FIRE_POOL,
  MAX_ACTIVE_FIRES,
  MAX_POINT_LIGHTS,
  PARTICLES_PER_FLAME,
  pickFlameCount,
  randomRange,
} from '../constants';
import { createWoodBase } from '../woodBase';
import type { SceneSystem } from '../types';
import flameVertexShader from '../../shaders/passthroughUv.vert.glsl';
import flameFragmentShader from '../../shaders/flame.frag.glsl';
import spotFragmentShader from '../../shaders/flameSpot.frag.glsl';
import {
  createGoldenLayout,
  createTraitsAt,
  createUniqueTraits,
  type FlameTraits,
} from './traits';
import {
  birthSoft,
  createParticleBundle,
  createSmokeBundle,
  flickerFor,
  updateFlameParticles,
  updateSmokeParticles,
  type ParticleBundle,
  type SmokeBundle,
} from './particles';

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

export type FlameFieldHandle = SceneSystem & {
  getDormantTargets: () => FlameStrikeTarget[];
  getStrikeTargets: () => FlameStrikeTarget[];
  hasActive: () => boolean;
  ignite: (index: number) => boolean;
  /** Enciende un fuego pequeño estilo referencia en el impacto del rayo. */
  spawnAt: (x: number, z: number) => number | null;
  surge: (index: number, strength?: number) => void;
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
    vertexShader: flameVertexShader,
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
    vertexShader: flameVertexShader,
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
    update(delta, time, ctx) {
      const { windStrength, camera } = ctx;
      applyNearestLargestScale(flames, camera.x, camera.y, camera.z);

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

        const maxParticleRise = flame.height * 1.05;
        updateFlameParticles(
          flame.particles,
          flame.traits,
          maxParticleRise,
          delta,
          time,
        );

        const maxSmokeRise =
          flame.height * (2.6 + (flame.traits.seed % 5) * 0.18);
        const life = birthSoft(flame.ignition, flame.dying);
        updateSmokeParticles(
          flame.smoke,
          flame.traits,
          maxSmokeRise,
          life,
          delta,
          time,
          windStrength,
        );
        flame.smokeMaterial.opacity =
          0.14 + flame.ignition * 0.16 * (1 - flame.dying);
        flame.smokeMaterial.size =
          (0.08 + flame.traits.size * 0.07) * (1 + flame.surge * 0.15);
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
