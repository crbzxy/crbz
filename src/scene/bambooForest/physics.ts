import { BAMBOO_BLAST_FORCE, randomRange } from '../constants';
import type { BambooStalk } from './types';

export function windForce(time: number, stalk: BambooStalk, windStrength: number) {
  const gust =
    Math.sin(time * 0.55 * stalk.speed + stalk.phase) * 0.45 +
    Math.sin(time * 1.2 * stalk.speed + stalk.x * 0.15) * 0.25;
  const strength = gust * 0.55 * stalk.flex * windStrength * stalk.integrity;
  return {
    x: strength * Math.sin(stalk.phase * 0.7),
    z: strength * Math.cos(stalk.phase * 0.5) + stalk.leanBias * 0.4,
  };
}

export function leanMagnitude(stalk: BambooStalk) {
  return Math.hypot(stalk.leanX, stalk.leanZ);
}

export function blastFalloff(distance: number, radius: number) {
  const t = 1 - distance / radius;
  return Math.max(0, t * t);
}

export function applyBlastToStalk(
  stalk: BambooStalk,
  x: number,
  z: number,
  radius: number,
) {
  const dx = stalk.x - x;
  const dz = stalk.z - z;
  const distance = Math.hypot(dx, dz);
  if (distance > radius) {
    return;
  }

  let dirX = Math.cos(stalk.twist);
  let dirZ = Math.sin(stalk.twist);
  let falloff = 1;
  if (distance > 0.0001) {
    falloff = blastFalloff(distance, radius);
    dirX = dx / distance;
    dirZ = dz / distance;
  }

  const impulse = (BAMBOO_BLAST_FORCE * falloff) / stalk.mass;
  stalk.velX += dirX * impulse * randomRange(0.85, 1.25);
  stalk.velZ += dirZ * impulse * randomRange(0.85, 1.25);

  const damage =
    falloff * randomRange(0.28, 0.72) * (1.15 - stalk.mass * 0.2);
  stalk.integrity = Math.max(0, stalk.integrity - damage);
  stalk.flex *= 0.92 + stalk.integrity * 0.08;

  if (stalk.integrity <= 0.12 || (falloff > 0.7 && Math.random() > 0.35)) {
    stalk.falling = true;
    stalk.velX += dirX * impulse * 0.6;
    stalk.velZ += dirZ * impulse * 0.6;
  }
}

function fallingPull(stalk: BambooStalk) {
  const mag = leanMagnitude(stalk);
  if (mag > 0.05) {
    return { x: stalk.leanX / mag, z: stalk.leanZ / mag };
  }
  const speed = Math.hypot(stalk.velX, stalk.velZ);
  if (speed > 0.01) {
    return { x: stalk.velX / speed, z: stalk.velZ / speed };
  }
  return { x: Math.cos(stalk.twist), z: Math.sin(stalk.twist) };
}

/** Integra un paso físico del tallo; devuelve true si se ha partido (snap). */
export function integrateStalk(
  stalk: BambooStalk,
  delta: number,
  time: number,
  windStrength: number,
) {
  const step = Math.min(delta, 0.05);
  if (stalk.falling) {
    const pull = fallingPull(stalk);
    stalk.velX += pull.x * 4.8 * step;
    stalk.velZ += pull.z * 4.8 * step;
    stalk.leanX += stalk.velX * step;
    stalk.leanZ += stalk.velZ * step;
    stalk.integrity = Math.max(0, stalk.integrity - step * 0.45);
    return leanMagnitude(stalk) > 1.25;
  }

  const wind = windForce(time, stalk, windStrength);
  const spring = stalk.stiffness * (0.35 + stalk.integrity * 0.65);
  stalk.velX +=
    (-stalk.leanX * spring + wind.x * stalk.flex) * step / stalk.mass;
  stalk.velZ +=
    (-stalk.leanZ * spring + wind.z * stalk.flex) * step / stalk.mass;
  const damping = 0.9 + stalk.integrity * 0.06;
  stalk.velX *= damping;
  stalk.velZ *= damping;
  stalk.leanX += stalk.velX * step;
  stalk.leanZ += stalk.velZ * step;

  const mag = leanMagnitude(stalk);
  const breakLean = 0.55 + stalk.integrity * 0.55;
  if (mag > breakLean || (stalk.integrity < 0.2 && mag > 0.35)) {
    stalk.falling = true;
  }
  return false;
}
