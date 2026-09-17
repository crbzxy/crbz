import { describe, expect, it } from 'vitest';
import { easeInOutCubic, lerpParams } from './ViewpointController';
import type { ViewpointParams } from './viewpointPresets';

function makeParams(overrides: Partial<ViewpointParams> = {}): ViewpointParams {
  return {
    target: { x: 0, y: 0, z: 0 },
    distance: 10,
    azimuthDeg: 0,
    elevationDeg: 0,
    fov: 40,
    up: { x: 0, y: 1, z: 0 },
    near: 0.1,
    far: 100,
    breath: 0,
    ...overrides,
  };
}

describe('easeInOutCubic', () => {
  it('starts at 0 and ends at 1', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
  });

  it('is symmetric around the midpoint', () => {
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5);
  });

  it('accelerates then decelerates (not linear)', () => {
    expect(easeInOutCubic(0.25)).toBeLessThan(0.25);
    expect(easeInOutCubic(0.75)).toBeGreaterThan(0.75);
  });
});

describe('lerpParams', () => {
  it('returns the start params at amount 0', () => {
    const from = makeParams({ distance: 5, azimuthDeg: 10 });
    const to = makeParams({ distance: 25, azimuthDeg: 50 });
    expect(lerpParams(from, to, 0)).toEqual(from);
  });

  it('returns the end params at amount 1', () => {
    const from = makeParams({ distance: 5, azimuthDeg: 10 });
    const to = makeParams({ distance: 25, azimuthDeg: 50 });
    expect(lerpParams(from, to, 1)).toEqual(to);
  });

  it('interpolates every numeric field, including nested vectors', () => {
    const from = makeParams({
      target: { x: 0, y: 0, z: 0 },
      distance: 0,
      up: { x: 0, y: 0, z: 0 },
    });
    const to = makeParams({
      target: { x: 10, y: 20, z: 30 },
      distance: 100,
      up: { x: 2, y: 2, z: 2 },
    });
    const mid = lerpParams(from, to, 0.5);
    expect(mid.target).toEqual({ x: 5, y: 10, z: 15 });
    expect(mid.distance).toBe(50);
    expect(mid.up).toEqual({ x: 1, y: 1, z: 1 });
  });
});
