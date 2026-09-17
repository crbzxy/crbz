import {
  CAMERA_START_FOCUS,
  FLAME_FRAME_RADIUS,
  GOLDEN_ANGLE,
  PHI,
  randomRange,
} from '../constants';

export type DepthBand = 'near' | 'mid' | 'far' | 'distant';

export type FlameTraits = {
  x: number;
  z: number;
  size: number;
  intensity: number;
  seed: number;
  phase: number;
  speed: number;
  chaos: number;
  violence: number;
  heightFactor: number;
  depthBand: DepthBand;
  particleCount: number;
};

export type GoldenSlot = {
  x: number;
  z: number;
  size: number;
  depthBand: DepthBand;
};

export type LayoutContext = {
  slots: GoldenSlot[];
};

/** Fuego estilo referencia: pequeño/local, con raro mediano. */
export function pickReferenceFlameSize() {
  if (Math.random() < 0.82) {
    return randomRange(0.38, 0.85);
  }
  return randomRange(0.9, 1.35);
}

export function depthBandFromRadius(radius: number): DepthBand {
  if (radius < 2.2) {
    return 'near';
  }
  if (radius < 4.2) {
    return 'mid';
  }
  if (radius < 7.2) {
    return 'far';
  }
  return 'distant';
}

export function clampToFrameDisk(
  x: number,
  z: number,
  focusX: number,
  focusZ: number,
) {
  const offsetX = x - focusX;
  const offsetZ = z - focusZ;
  const distance = Math.hypot(offsetX, offsetZ);
  if (distance <= FLAME_FRAME_RADIUS || distance < 0.0001) {
    return { x, z };
  }
  const scale = FLAME_FRAME_RADIUS / distance;
  return {
    x: focusX + offsetX * scale,
    z: focusZ + offsetZ * scale,
  };
}

/**
 * Espiral áurea anclada al foco de cámara de inicio,
 * compacta para que siempre haya fuego en cuadro.
 */
export function createGoldenLayout(flameCount: number): LayoutContext {
  const focusX = CAMERA_START_FOCUS.x;
  const focusZ = CAMERA_START_FOCUS.z;
  const rotation = Math.random() * Math.PI * 2;
  const mirror = Math.random() > 0.5 ? 1 : -1;
  const unit = randomRange(0.42, 0.42 * PHI);
  const slots: GoldenSlot[] = [];

  for (let index = 0; index < flameCount; index += 1) {
    const angle = rotation + GOLDEN_ANGLE * index * mirror;
    const radius =
      index === 0
        ? randomRange(0.05, 0.28)
        : unit *
          Math.pow(PHI, (index - 1) * 0.42) *
          Math.sqrt((index + 0.35) / PHI);

    const jitterRadius =
      index === 0 ? randomRange(0.02, 0.08) : randomRange(0.03, 0.1);
    const jitterAngle = Math.random() * Math.PI * 2;
    const rawX =
      focusX + Math.cos(angle) * radius + Math.cos(jitterAngle) * jitterRadius;
    const rawZ =
      focusZ + Math.sin(angle) * radius + Math.sin(jitterAngle) * jitterRadius;
    const clamped = clampToFrameDisk(rawX, rawZ, focusX, focusZ);
    const distanceFromFocus = Math.hypot(
      clamped.x - focusX,
      clamped.z - focusZ,
    );

    slots.push({
      x: clamped.x,
      z: clamped.z,
      size: pickReferenceFlameSize(),
      depthBand: depthBandFromRadius(distanceFromFocus),
    });
  }

  return { slots };
}

export function createTraitsAt(
  x: number,
  z: number,
  particleCount: number,
  size = pickReferenceFlameSize(),
): FlameTraits {
  return {
    x,
    z,
    size,
    intensity: randomRange(0.75, 1.35),
    seed: Math.random() * 100,
    phase: Math.random() * Math.PI * 2,
    speed: randomRange(0.55, 1.75),
    chaos: randomRange(0.85, 1.65),
    violence: randomRange(0.85, 1.55),
    heightFactor: randomRange(0.85, 1.25),
    depthBand: depthBandFromRadius(Math.hypot(x, z)),
    particleCount,
  };
}

export function createUniqueTraits(
  index: number,
  layout: LayoutContext,
  particleCount: number,
): FlameTraits {
  const slot = layout.slots[index];
  return createTraitsAt(slot.x, slot.z, particleCount, slot.size);
}
