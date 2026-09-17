import { describe, expect, it } from 'vitest';
import { clampToFrameDisk, depthBandFromRadius } from './traits';
import { FLAME_FRAME_RADIUS } from '../constants';

describe('depthBandFromRadius', () => {
  it('classifies distance buckets in ascending order', () => {
    expect(depthBandFromRadius(0)).toBe('near');
    expect(depthBandFromRadius(2.1)).toBe('near');
    expect(depthBandFromRadius(2.3)).toBe('mid');
    expect(depthBandFromRadius(4.3)).toBe('far');
    expect(depthBandFromRadius(10)).toBe('distant');
  });
});

describe('clampToFrameDisk', () => {
  it('leaves points inside the frame radius untouched', () => {
    const result = clampToFrameDisk(0.1, 0.1, 0, 0);
    expect(result).toEqual({ x: 0.1, z: 0.1 });
  });

  it('projects points outside the radius back onto the disk edge', () => {
    const result = clampToFrameDisk(100, 0, 0, 0);
    expect(result.x).toBeCloseTo(FLAME_FRAME_RADIUS);
    expect(result.z).toBeCloseTo(0);
  });

  it('respects an off-origin focus point', () => {
    const focusX = 5;
    const focusZ = -3;
    const result = clampToFrameDisk(focusX + 100, focusZ, focusX, focusZ);
    const distance = Math.hypot(result.x - focusX, result.z - focusZ);
    expect(distance).toBeCloseTo(FLAME_FRAME_RADIUS);
  });
});
