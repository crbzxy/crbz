import { CAMERA_START_FOCUS, FOREST_OUTER_RADIUS, GROUND_Y, randomRange } from './constants';
import type { BambooForestHandle } from './bambooForest';
import type { FlameFieldHandle, FlameStrikeTarget } from './flames';
import type { StormCloudsHandle } from './stormClouds';
import type { LightningHandle, StrikePoint } from './lightning';
import type { ShowcasePropsHandle } from './showcaseProps';

const FIRST_STRIKE_DELAY = 2.2;
const IGNITE_AFTER_STRIKE = 0.12;
const STRIKE_NEAR_FIRE = 2.8;

export function pickRandomGroundTarget(): StrikePoint {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * FOREST_OUTER_RADIUS * 0.92;
  return {
    x: CAMERA_START_FOCUS.x + Math.cos(angle) * radius,
    y: GROUND_Y + 0.12,
    z: CAMERA_START_FOCUS.z + Math.sin(angle) * radius,
  };
}

export function nearestDormantFire(
  point: StrikePoint,
  targets: FlameStrikeTarget[],
) {
  let best: FlameStrikeTarget | null = null;
  let bestDistance = Infinity;

  for (const target of targets) {
    const distance = Math.hypot(target.x - point.x, target.z - point.z);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = target;
    }
  }

  if (!best || bestDistance > STRIKE_NEAR_FIRE) {
    return null;
  }

  return best;
}

export function windStrengthAt(time: number) {
  return (
    0.65 +
    Math.sin(time * 0.2) * 0.18 +
    Math.sin(time * 0.55 + 1.2) * 0.12
  );
}

export type StormDirectorDeps = {
  getFlames: () => FlameFieldHandle | null;
  getLightning: () => LightningHandle | null;
  getStorm: () => StormCloudsHandle | null;
  bamboo: BambooForestHandle;
  showcaseProps: ShowcasePropsHandle;
};

export type StormDirectorHandle = {
  update: (delta: number, simTime: number) => void;
};

/** Orquesta cuándo y dónde caen los rayos, y qué fuegos encienden. */
export function createStormDirector(deps: StormDirectorDeps): StormDirectorHandle {
  let stormStrikeTimer = randomRange(8, 16);
  const pendingSpawns: Array<{ x: number; z: number; delay: number }> = [];

  function fireOneRandomStrike() {
    const flames = deps.getFlames();
    const lightning = deps.getLightning();
    const storm = deps.getStorm();
    if (!flames || !lightning || !storm || lightning.freeSlots() <= 0) {
      return false;
    }

    const ground = pickRandomGroundTarget();
    const dormant = flames.getDormantTargets();
    const nearFire = nearestDormantFire(ground, dormant);
    const target = nearFire
      ? { x: nearFire.x, y: nearFire.y, z: nearFire.z }
      : ground;

    const origin = storm.claimStrikeOrigin() ?? storm.pickRandomOrigin();
    lightning.strike(target, origin);
    storm.flash(origin.cloudIndex);
    deps.bamboo.thinAround(target.x, target.z);
    deps.showcaseProps.thinAround(target.x, target.z);

    // Casi cada rayo genera un fuego pequeño como la referencia
    if (Math.random() > 0.12) {
      pendingSpawns.push({
        x: target.x + randomRange(-0.15, 0.15),
        z: target.z + randomRange(-0.15, 0.15),
        delay: IGNITE_AFTER_STRIKE + randomRange(0, 0.1),
      });
    }

    return true;
  }

  function tryStormLightning(delta: number, simTime: number) {
    const flames = deps.getFlames();
    const lightning = deps.getLightning();
    const storm = deps.getStorm();
    if (!flames || !lightning || !storm) {
      return;
    }

    stormStrikeTimer -= delta;
    const forceFirst = simTime >= FIRST_STRIKE_DELAY && !flames.hasActive();
    if (!forceFirst && stormStrikeTimer > 0) {
      return;
    }

    if (!forceFirst && Math.random() > 0.42) {
      stormStrikeTimer = randomRange(10, 22);
      return;
    }

    const fired = fireOneRandomStrike() ? 1 : 0;
    stormStrikeTimer = fired > 0 ? randomRange(22, 48) : randomRange(12, 24);
  }

  function resolvePendingSpawns(delta: number) {
    const flames = deps.getFlames();
    if (!flames || pendingSpawns.length === 0) {
      return;
    }

    for (let index = pendingSpawns.length - 1; index >= 0; index -= 1) {
      const pending = pendingSpawns[index];
      pending.delay -= delta;
      if (pending.delay > 0) {
        continue;
      }
      flames.spawnAt(pending.x, pending.z);
      pendingSpawns.splice(index, 1);
    }
  }

  return {
    update(delta, simTime) {
      tryStormLightning(delta, simTime);
      resolvePendingSpawns(delta);
    },
  };
}
