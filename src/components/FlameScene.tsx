import { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { createAtmosphere, type AtmosphereHandle } from '../scene/atmosphere';
import { createBambooForest, type BambooForestHandle } from '../scene/bambooForest';
import {
  CAMERA_START_FOCUS,
  FOREST_OUTER_RADIUS,
  GROUND_Y,
  randomRange,
  SKY_FOG,
} from '../scene/constants';
import { createFlameField, type FlameFieldHandle } from '../scene/flames';
import { createGround, type GroundHandle } from '../scene/ground';
import {
  createLeafLitter,
  type LeafLitterHandle,
} from '../scene/leafLitter';
import {
  createLightning,
  type LightningHandle,
  type StrikePoint,
} from '../scene/lightning';
import {
  createHorizonMist,
  type MistHandle,
} from '../scene/mist';
import { createRockField, type RockFieldHandle } from '../scene/rocks';
import {
  createStormClouds,
  type StormCloudsHandle,
} from '../scene/stormClouds';
import { createTurtle, type TurtleHandle } from '../scene/turtle';
import { ViewpointController } from '../scene/ViewpointController';
import { createRandomDollySequence } from '../scene/viewpointPresets';

const MIN_SPEED = 0.2;
const MAX_SPEED = 2.6;
const FIRST_STRIKE_DELAY = 2.2;
const IGNITE_AFTER_STRIKE = 0.12;
const STRIKE_NEAR_FIRE = 2.8;

function pickRandomGroundTarget(): StrikePoint {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.sqrt(Math.random()) * FOREST_OUTER_RADIUS * 0.92;
  return {
    x: CAMERA_START_FOCUS.x + Math.cos(angle) * radius,
    y: GROUND_Y + 0.12,
    z: CAMERA_START_FOCUS.z + Math.sin(angle) * radius,
  };
}

function nearestDormantFire(
  point: StrikePoint,
  targets: ReturnType<FlameFieldHandle['getDormantTargets']>,
) {
  let best: (typeof targets)[number] | null = null;
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

function windStrengthAt(time: number) {
  return (
    0.65 +
    Math.sin(time * 0.2) * 0.18 +
    Math.sin(time * 0.55 + 1.2) * 0.12
  );
}

function speedFromPointer(clientX: number, clientY: number) {
  const width = Math.max(window.innerWidth, 1);
  const height = Math.max(window.innerHeight, 1);
  const horizontal = clientX / width;
  const vertical = 1 - clientY / height;
  const blend = horizontal * 0.65 + vertical * 0.35;
  return MIN_SPEED + blend * (MAX_SPEED - MIN_SPEED);
}

export function FlameScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    let previousTime = performance.now();
    let simTime = 0;
    let playbackSpeed = 1;
    let flames: FlameFieldHandle | null = null;
    let lightning: LightningHandle | null = null;
    let storm: StormCloudsHandle | null = null;
    let mist: MistHandle | null = null;
    let turtle: TurtleHandle | null = null;
    let litter: LeafLitterHandle | null = null;
    let flameBootTimer = 0;
    let stormStrikeTimer = randomRange(8, 16);
    const pendingSpawns: Array<{ x: number; z: number; delay: number }> = [];

    const scene = new Scene();
    const camera = new PerspectiveCamera(42, 1, 0.2, 400);
    const dollySequence = createRandomDollySequence();
    const viewpoint = new ViewpointController(camera, dollySequence[0].preset);
    viewpoint.playSequence(dollySequence, true);

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (error) {
      console.error('No se pudo crear WebGLRenderer', error);
      return;
    }

    renderer.setClearColor(SKY_FOG, 1);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    let atmosphere: AtmosphereHandle;
    let ground: GroundHandle;
    let rocks: RockFieldHandle;
    let bamboo: BambooForestHandle;

    try {
      atmosphere = createAtmosphere(scene);
      ground = createGround(scene);
      litter = createLeafLitter(scene);
      rocks = createRockField(scene);
      bamboo = createBambooForest(scene);
      mist = createHorizonMist(scene);
      storm = createStormClouds(scene);
      turtle = createTurtle(scene);
    } catch (error) {
      console.error('Error creando la escena base', error);
      renderer.dispose();
      return;
    }

    const resize = () => {
      if (disposed) {
        return;
      }
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, true);
    };

    const onPointerMove = (event: PointerEvent) => {
      playbackSpeed = speedFromPointer(event.clientX, event.clientY);
    };

    const bootFlames = () => {
      if (disposed || flames) {
        return;
      }
      try {
        flames = createFlameField(scene);
        lightning = createLightning(scene);
      } catch (error) {
        console.error('Error creando fuegos', error);
      }
    };

    const fireOneRandomStrike = () => {
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
      bamboo.thinAround(target.x, target.z);

      // Casi cada rayo genera un fuego pequeño como la referencia
      if (Math.random() > 0.12) {
        pendingSpawns.push({
          x: target.x + randomRange(-0.15, 0.15),
          z: target.z + randomRange(-0.15, 0.15),
          delay: IGNITE_AFTER_STRIKE + randomRange(0, 0.1),
        });
      }

      return true;
    };

    const tryStormLightning = (delta: number) => {
      if (!flames || !lightning || !storm) {
        return;
      }

      stormStrikeTimer -= delta;
      const forceFirst =
        simTime >= FIRST_STRIKE_DELAY && !flames.hasActive();
      if (!forceFirst && stormStrikeTimer > 0) {
        return;
      }

      if (!forceFirst && Math.random() > 0.42) {
        stormStrikeTimer = randomRange(10, 22);
        return;
      }

      const fired = fireOneRandomStrike() ? 1 : 0;
      stormStrikeTimer =
        fired > 0 ? randomRange(22, 48) : randomRange(12, 24);
    };

    const resolvePendingSpawns = (delta: number) => {
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
    };

    const animate = (now: number) => {
      if (disposed) {
        return;
      }

      const frameDelta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      const delta = frameDelta * playbackSpeed;
      simTime += delta;
      const wind = windStrengthAt(simTime);

      atmosphere.update(simTime);
      mist?.update(simTime);
      bamboo.update(simTime, wind, delta);
      turtle?.update(delta, simTime);
      storm?.update(simTime, delta);
      flames?.update(
        delta,
        simTime,
        wind,
        camera.position.x,
        camera.position.y,
        camera.position.z,
      );
      viewpoint.update(delta);
      tryStormLightning(delta);
      resolvePendingSpawns(delta);
      lightning?.update(delta);

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    animationFrame = window.requestAnimationFrame(animate);
    flameBootTimer = window.setTimeout(bootFlames, 0);

    return () => {
      disposed = true;
      window.clearTimeout(flameBootTimer);
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);

      try {
        lightning?.dispose();
        flames?.dispose();
        storm?.dispose();
        mist?.dispose();
        turtle?.dispose();
        bamboo.dispose();
        rocks.dispose();
        litter?.dispose();
        ground.dispose();
        atmosphere.dispose();
      } catch (error) {
        console.error('Error al liberar la escena', error);
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div className="scene-layer">
      <canvas ref={canvasRef} className="flame-canvas" aria-hidden="true" />
    </div>
  );
}
