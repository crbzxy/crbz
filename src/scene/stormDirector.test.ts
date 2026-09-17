import { describe, expect, it } from 'vitest';
import {
  nearestDormantFire,
  pickRandomGroundTarget,
  windStrengthAt,
} from './stormDirector';
import { CAMERA_START_FOCUS, FOREST_OUTER_RADIUS, GROUND_Y } from './constants';
import type { FlameStrikeTarget } from './flames';

describe('pickRandomGroundTarget', () => {
  it('stays within the forest radius around the camera focus, on the ground', () => {
    for (let i = 0; i < 50; i += 1) {
      const target = pickRandomGroundTarget();
      const distance = Math.hypot(
        target.x - CAMERA_START_FOCUS.x,
        target.z - CAMERA_START_FOCUS.z,
      );
      expect(distance).toBeLessThanOrEqual(FOREST_OUTER_RADIUS * 0.92 + 1e-9);
      expect(target.y).toBeCloseTo(GROUND_Y + 0.12);
    }
  });
});

function makeTarget(overrides: Partial<FlameStrikeTarget>): FlameStrikeTarget {
  return {
    index: 0,
    x: 0,
    y: 0,
    z: 0,
    distanceFromOrigin: 0,
    ...overrides,
  };
}

describe('nearestDormantFire', () => {
  it('returns null when there are no candidate targets', () => {
    expect(nearestDormantFire({ x: 0, y: 0, z: 0 }, [])).toBeNull();
  });

  it('returns null when the closest target is too far away', () => {
    const far = makeTarget({ index: 1, x: 20, z: 20 });
    expect(nearestDormantFire({ x: 0, y: 0, z: 0 }, [far])).toBeNull();
  });

  it('picks the closest target within range', () => {
    const near = makeTarget({ index: 1, x: 1, z: 0 });
    const nearer = makeTarget({ index: 2, x: 0.5, z: 0 });
    const far = makeTarget({ index: 3, x: 20, z: 20 });
    const result = nearestDormantFire({ x: 0, y: 0, z: 0 }, [near, far, nearer]);
    expect(result?.index).toBe(2);
  });
});

describe('windStrengthAt', () => {
  it('stays within a sane range over time', () => {
    for (let t = 0; t < 200; t += 0.37) {
      const wind = windStrengthAt(t);
      expect(wind).toBeGreaterThan(0);
      expect(wind).toBeLessThan(1.2);
    }
  });
});
