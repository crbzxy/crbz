import { BufferAttribute, BufferGeometry } from 'three';
import { SMOKE_PER_FLAME, randomRange } from '../constants';
import type { FlameTraits } from './traits';

export type ParticleBundle = {
  positions: Float32Array;
  colors: Float32Array;
  ages: Float32Array;
  speeds: Float32Array;
  geometry: BufferGeometry;
  count: number;
};

export type SmokeBundle = {
  positions: Float32Array;
  colors: Float32Array;
  ages: Float32Array;
  speeds: Float32Array;
  driftsX: Float32Array;
  driftsZ: Float32Array;
  geometry: BufferGeometry;
  count: number;
};

export function resetParticle(
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

export function createParticleBundle(traits: FlameTraits): ParticleBundle {
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

export function resetSmokeParticle(
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

export function createSmokeBundle(traits: FlameTraits): SmokeBundle {
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

export function flickerFor(time: number, traits: FlameTraits) {
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

export function updateFlameParticles(
  particles: ParticleBundle,
  traits: FlameTraits,
  maxRise: number,
  delta: number,
  time: number,
) {
  const { positions, colors, ages, speeds, geometry, count } = particles;

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

export function birthSoft(ignition: number, dying: number) {
  return ignition * ignition * (1 - dying);
}

export function updateSmokeParticles(
  smoke: SmokeBundle,
  traits: FlameTraits,
  maxRise: number,
  life: number,
  delta: number,
  time: number,
  windStrength: number,
) {
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
}
