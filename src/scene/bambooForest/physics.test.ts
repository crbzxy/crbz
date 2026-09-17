import { describe, expect, it } from 'vitest';
import { blastFalloff, leanMagnitude } from './physics';
import type { BambooStalk } from './types';

describe('blastFalloff', () => {
  it('is at full strength at the blast center', () => {
    expect(blastFalloff(0, 10)).toBe(1);
  });

  it('reaches zero exactly at the blast radius', () => {
    expect(blastFalloff(10, 10)).toBe(0);
  });

  it('decreases monotonically with distance', () => {
    const near = blastFalloff(2, 10);
    const mid = blastFalloff(5, 10);
    const far = blastFalloff(8, 10);
    expect(near).toBeGreaterThan(mid);
    expect(mid).toBeGreaterThan(far);
  });
});

describe('leanMagnitude', () => {
  function makeStalk(leanX: number, leanZ: number): BambooStalk {
    return {
      x: 0,
      z: 0,
      height: 10,
      radius: 0.1,
      leanBias: 0,
      twist: 0,
      phase: 0,
      speed: 1,
      flex: 1,
      colorIndex: 0,
      sizeClass: 'medium',
      leafScale: 1,
      alive: true,
      integrity: 1,
      leanX,
      leanZ,
      velX: 0,
      velZ: 0,
      mass: 1,
      stiffness: 10,
      falling: false,
    };
  }

  it('is zero for an upright stalk', () => {
    expect(leanMagnitude(makeStalk(0, 0))).toBe(0);
  });

  it('matches the Euclidean norm of the lean vector', () => {
    expect(leanMagnitude(makeStalk(3, 4))).toBe(5);
  });
});
