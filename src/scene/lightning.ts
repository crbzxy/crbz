import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Line,
  LineBasicMaterial,
  PointLight,
  Vector3,
  type Scene,
} from 'three';
import { randomRange } from './constants';
import type { SceneSystem } from './types';

export type StrikePoint = {
  x: number;
  y: number;
  z: number;
};

export type LightningHandle = SceneSystem & {
  strike: (target: StrikePoint, origin?: StrikePoint) => boolean;
  /** Cuántos rayos pueden caer a la vez todavía. */
  freeSlots: () => number;
  isActive: () => boolean;
};

const CHANNELS = 8;
const BOLTS_PER_CHANNEL = 4;
const MAX_POINTS = 28;

function appendSegment(
  points: number[],
  from: Vector3,
  to: Vector3,
  segments: number,
  jaggedScale: number,
) {
  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    const jagged =
      index === 0 || index === segments
        ? 0
        : (Math.random() - 0.5) * (1.15 - t) * jaggedScale;
    const side =
      index === 0 || index === segments
        ? 0
        : (Math.random() - 0.5) * (1.15 - t) * jaggedScale;
    points.push(
      from.x + (to.x - from.x) * t + jagged,
      from.y + (to.y - from.y) * t,
      from.z + (to.z - from.z) * t + side,
    );
  }
}

function buildBoltPaths(target: StrikePoint, origin?: StrikePoint) {
  const style = Math.floor(Math.random() * 4);
  const tip = new Vector3(target.x, target.y + 0.12, target.z);
  const paths: number[][] = [];
  const skyHeight =
    style === 0
      ? randomRange(18, 28)
      : style === 1
        ? randomRange(14, 22)
        : style === 2
          ? randomRange(22, 34)
          : randomRange(16, 26);

  const start = origin
    ? new Vector3(origin.x, origin.y, origin.z)
    : new Vector3(
        tip.x + randomRange(-3.5, 3.5),
        tip.y + skyHeight,
        tip.z + randomRange(-3.5, 3.5),
      );

  const main: number[] = [];
  const mid = new Vector3(
    tip.x + randomRange(-1.4, 1.4),
    tip.y + skyHeight * randomRange(0.35, 0.62),
    tip.z + randomRange(-1.4, 1.4),
  );
  const jagged = style === 3 ? randomRange(2.4, 3.6) : randomRange(1.4, 2.6);
  const segments = style === 1 ? 10 : style === 2 ? 22 : 16;

  appendSegment(main, start, mid, Math.floor(segments * 0.55), jagged);
  appendSegment(main, mid, tip, Math.ceil(segments * 0.45), jagged * 0.75);
  paths.push(main);

  const forkCount = style === 0 ? 1 : style === 1 ? 3 : style === 2 ? 2 : 3;
  for (let fork = 0; fork < forkCount; fork += 1) {
    const branch: number[] = [];
    const forkT = randomRange(0.25, 0.72);
    const forkStart = new Vector3().lerpVectors(start, tip, forkT);
    forkStart.x += randomRange(-0.8, 0.8);
    forkStart.z += randomRange(-0.8, 0.8);
    const forkEnd = new Vector3(
      tip.x + randomRange(-2.8, 2.8),
      tip.y + randomRange(0.4, skyHeight * 0.45),
      tip.z + randomRange(-2.8, 2.8),
    );
    appendSegment(
      branch,
      forkStart,
      forkEnd,
      5 + Math.floor(Math.random() * 6),
      jagged * randomRange(0.8, 1.4),
    );
    paths.push(branch);
  }

  return paths;
}

function createBoltLine(scene: Scene) {
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(3 * MAX_POINTS), 3),
  );
  const material = new LineBasicMaterial({
    color: new Color(0xe8f0ff),
    transparent: true,
    opacity: 0,
    blending: AdditiveBlending,
    depthWrite: false,
  });
  const line = new Line(geometry, material);
  line.visible = false;
  line.frustumCulled = false;
  scene.add(line);
  return { geometry, material, line };
}

type StrikeChannel = {
  bolts: ReturnType<typeof createBoltLine>[];
  flash: PointLight;
  rimFlash: PointLight;
  life: number;
  duration: number;
  peakFlash: number;
  activeBolts: number;
};

function createChannel(scene: Scene): StrikeChannel {
  const bolts = Array.from({ length: BOLTS_PER_CHANNEL }, () =>
    createBoltLine(scene),
  );
  const flash = new PointLight(0xd4c4ff, 0, 42, 1.6);
  const rimFlash = new PointLight(0xa88cff, 0, 30, 2);
  scene.add(flash, rimFlash);

  return {
    bolts,
    flash,
    rimFlash,
    life: 0,
    duration: 0.4,
    peakFlash: 30,
    activeBolts: 0,
  };
}

function clearChannel(channel: StrikeChannel) {
  for (const bolt of channel.bolts) {
    bolt.line.visible = false;
    bolt.material.opacity = 0;
  }
  channel.flash.intensity = 0;
  channel.rimFlash.intensity = 0;
  channel.life = 0;
  channel.activeBolts = 0;
}

function playOnChannel(
  channel: StrikeChannel,
  target: StrikePoint,
  origin?: StrikePoint,
) {
  const paths = buildBoltPaths(target, origin);
  channel.activeBolts = Math.min(BOLTS_PER_CHANNEL, paths.length);

  for (let index = 0; index < BOLTS_PER_CHANNEL; index += 1) {
    const bolt = channel.bolts[index];
    if (index >= channel.activeBolts) {
      bolt.line.visible = false;
      bolt.material.opacity = 0;
      continue;
    }

    const raw = paths[index];
    const padded = new Float32Array(3 * MAX_POINTS);
    padded.set(raw.slice(0, 3 * MAX_POINTS));
    bolt.geometry.setAttribute('position', new BufferAttribute(padded, 3));
    bolt.geometry.setDrawRange(0, Math.floor(raw.length / 3));
    bolt.geometry.computeBoundingSphere();
    bolt.material.color.set(
      index === 0 ? 0xf2f6ff : Math.random() > 0.5 ? 0xd8c8ff : 0xcfe8ff,
    );
    bolt.material.opacity = index === 0 ? 1 : randomRange(0.55, 0.9);
    bolt.line.visible = true;
  }

  channel.flash.position.set(target.x, target.y + 1.4, target.z);
  channel.rimFlash.position.set(target.x, target.y + 0.5, target.z);
  channel.peakFlash = randomRange(26, 46);
  channel.flash.intensity = channel.peakFlash;
  channel.rimFlash.intensity = channel.peakFlash * 0.55;
  channel.duration = randomRange(0.28, 0.52);
  channel.life = channel.duration;
}

function updateChannel(channel: StrikeChannel, delta: number) {
  if (channel.life <= 0) {
    clearChannel(channel);
    return;
  }

  channel.life -= delta;
  const fade = Math.max(0, channel.life / channel.duration);
  const flicker =
    fade > 0.4 && Math.random() > 0.55 ? randomRange(1.15, 1.7) : 1;

  for (let index = 0; index < channel.activeBolts; index += 1) {
    const strength = index === 0 ? 1 : 0.7;
    channel.bolts[index].material.opacity = fade * strength * flicker;
  }

  channel.flash.intensity = channel.peakFlash * fade * fade * flicker;
  channel.rimFlash.intensity = channel.peakFlash * 0.5 * fade * flicker;

  if (channel.life <= 0) {
    clearChannel(channel);
  }
}

export function createLightning(scene: Scene): LightningHandle {
  const channels = Array.from({ length: CHANNELS }, () => createChannel(scene));

  return {
    freeSlots() {
      return channels.filter((channel) => channel.life <= 0).length;
    },
    isActive() {
      return channels.some((channel) => channel.life > 0);
    },
    strike(target, origin) {
      let channel = channels.find((entry) => entry.life <= 0);
      if (!channel) {
        channel = channels.reduce((oldest, entry) =>
          entry.life < oldest.life ? entry : oldest,
        );
      }
      playOnChannel(channel, target, origin);
      return true;
    },
    update(delta) {
      for (const channel of channels) {
        updateChannel(channel, delta);
      }
    },
    dispose() {
      for (const channel of channels) {
        for (const bolt of channel.bolts) {
          scene.remove(bolt.line);
          bolt.geometry.dispose();
          bolt.material.dispose();
        }
        scene.remove(channel.flash, channel.rimFlash);
      }
    },
  };
}
